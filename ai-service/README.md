# Plotzo AI Service

FastAPI microservice for property price prediction.

## Run

1. `python -m pip install -r requirements.txt`
2. `python train_model.py`
3. `uvicorn app.main:app --host 127.0.0.1 --port 8989`

## Endpoints

- `GET /health`
- `POST /predict`

## Calibration

Set `PRICE_SCALE` to calibrate output for local market ranges.

