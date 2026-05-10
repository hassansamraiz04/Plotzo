from __future__ import annotations

import json
import os
from pathlib import Path

import joblib
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

ROOT = Path(__file__).resolve().parent
ARTIFACT_DIR = ROOT / "artifacts"
MODEL_PATH = ARTIFACT_DIR / "model.joblib"
METRICS_PATH = ARTIFACT_DIR / "metrics.json"

PRICE_SCALE = float(os.getenv("PRICE_SCALE", "300"))

app = FastAPI(title="Plotzo Price Predictor", version="1.0.0")
_model = None


def load_model():
    global _model
    if _model is None:
        if not MODEL_PATH.exists():
            raise RuntimeError(
                "Model artifact missing. Run `python train_model.py` first."
            )
        _model = joblib.load(MODEL_PATH)
    return _model


class PredictRequest(BaseModel):
    bedroom: float = Field(2, ge=0, le=20)
    bathroom: float = Field(2, ge=0, le=20)
    size: float | None = Field(None, ge=0, le=50000, description="Interior size (sqft)")
    latitude: float = Field(34.05, ge=-90, le=90)
    longitude: float = Field(-118.25, ge=-180, le=180)
    type: str | None = Field(None, description="buy or rent")
    property: str | None = Field(None, description="apartment|house|condo|land")
    city: str | None = Field(None, description="Free text city label for heuristics")

    class Config:
        json_schema_extra = {
            "example": {
                "bedroom": 3,
                "bathroom": 2,
                "size": 1400,
                "latitude": 24.86,
                "longitude": 67.0,
                "type": "buy",
                "property": "house",
                "city": "Karachi",
            }
        }


def _property_encoding(prop: str | None) -> float:
    if not prop:
        return 0.0
    mapping = {"apartment": 0.1, "house": 0.25, "condo": 0.15, "land": -0.2}
    return mapping.get(prop.lower(), 0.0)


def _type_encoding(t: str | None) -> float:
    if not t:
        return 0.0
    return -0.15 if t.lower() == "rent" else 0.1


def map_to_california_vector(req: PredictRequest) -> np.ndarray:
    """Heuristic mapping from listing fields → california housing feature order."""
    size = req.size if req.size and req.size > 0 else 1200 + req.bedroom * 220
    ave_rooms = max(float(size) / 280.0 + req.bedroom, 3.5)
    ave_bedrms = float(req.bedroom)
    med_inc = 3.2 + ave_bedrms * 0.25 + _property_encoding(req.property)
    house_age = 28.0 + _type_encoding(req.type) * 40.0

    pak_boost = 0.0
    if req.city:
        lowered = req.city.lower()
        if any(
            token in lowered
            for token in ("karachi", "lahore", "islamabad", "rawalpindi")
        ):
            pak_boost = 0.35

    med_inc += pak_boost + _property_encoding(req.property)

    population = 2200 + req.bathroom * 120 + size * 0.5
    ave_occup = 2.8 + req.bathroom * 0.15

    # Order must match california housing columns
    # MedInc, HouseAge, AveRooms, AveBedrms, Population, AveOccup, Latitude, Longitude
    ordered = np.array(
        [[med_inc, house_age, ave_rooms, ave_bedrms, population, ave_occup, req.latitude, req.longitude]]
    )
    return ordered


@app.get("/health")
def health():
    ok = MODEL_PATH.exists() and METRICS_PATH.exists()
    metrics = json.loads(METRICS_PATH.read_text(encoding="utf-8")) if ok else {}
    return {"ok": ok, "metrics": metrics, "price_scale": PRICE_SCALE}


@app.post("/predict")
def predict(req: PredictRequest):
    try:
        model = load_model()
    except Exception as exc:  # pragma: no cover - runtime guard
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    X = map_to_california_vector(req)
    raw = float(model.predict(X)[0])
    scaled = raw * PRICE_SCALE

    return {
        "model_unit_prediction": raw,
        "predicted_price": scaled,
        "price_scale": PRICE_SCALE,
        "inputs_echo": req.model_dump(),
    }
