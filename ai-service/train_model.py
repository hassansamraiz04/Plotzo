"""
Train a regression model on California housing data and export metrics + joblib artifact.

Pakistan-oriented deployments can scale outputs using PRICE_SCALE in the API service.
"""

from __future__ import annotations

import json
from pathlib import Path

import joblib
import numpy as np
from sklearn.datasets import fetch_california_housing
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split


ROOT = Path(__file__).resolve().parent
ARTIFACT_DIR = ROOT / "artifacts"
MODEL_PATH = ARTIFACT_DIR / "model.joblib"
METRICS_PATH = ARTIFACT_DIR / "metrics.json"


def main() -> None:
    ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)
    data = fetch_california_housing()
    X = data.data
    y = data.target

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = HistGradientBoostingRegressor(
        max_depth=6,
        learning_rate=0.05,
        max_iter=400,
        random_state=42,
    )
    model.fit(X_train, y_train)
    preds = model.predict(X_test)

    mae = float(mean_absolute_error(y_test, preds))
    rmse = float(np.sqrt(mean_squared_error(y_test, preds)))
    r2 = float(r2_score(y_test, preds))

    joblib.dump(model, MODEL_PATH)
    METRICS_PATH.write_text(
        json.dumps(
            {
                "dataset": "sklearn.fetch_california_housing",
                "features": list(data.feature_names),
                "mae": mae,
                "rmse": rmse,
                "r2": r2,
                "n_train": int(X_train.shape[0]),
                "n_test": int(X_test.shape[0]),
            },
            indent=2,
        ),
        encoding="utf-8",
    )

    print(f"Saved model to {MODEL_PATH}")
    print(f"Saved metrics to {METRICS_PATH}")


if __name__ == "__main__":
    main()
