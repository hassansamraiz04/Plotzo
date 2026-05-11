# Installation Guide

## 1) Backend API (`api/`)

1. Open `c:\Downloads\Plotzo-Web-Project\Plotzo-Web-Project\api`
2. Install dependencies:
   - `npm install`
3. Configure `.env`:
   - `DATABASE_URL=...`
   - `JWT_SECRET_KEY=...`
   - `CLIENT_ORIGIN=http://localhost:5173`
   - `AI_SERVICE_URL=http://127.0.0.1:8989`
   - `NODE_ENV=development`
   - `COOKIE_SECURE=false`
   - Optional hardening:
     - `RATE_LIMIT_MS=900000`
     - `RATE_LIMIT_MAX=700`
     - `AUTH_RATE_LIMIT_MAX=40`
     - `TRANSLATE_RATE_LIMIT_MAX=20`
     - `PREDICTION_RATE_LIMIT_MAX=30`
4. Apply Prisma:
   - `npx prisma validate`
   - `npx prisma generate`
   - `npx prisma db push`
5. Run API:
   - `node app.js` (or `npx nodemon app.js`)

## 2) AI Service

1. Open `c:\Downloads\Plotzo-Web-Project\Plotzo-Web-Project\ai-service`
2. Install Python deps:
   - `python -m pip install -r requirements.txt`
3. Train model:
   - `python train_model.py`
4. Run service:
   - `uvicorn app.main:app --host 127.0.0.1 --port 8989`

## 3) Frontend

1. Open `c:\Downloads\Plotzo-Web-Project\Plotzo-Web-Project\frontend`
2. Install dependencies:
   - `npm install`
3. Optional `.env`:
   - `VITE_API_URL=http://localhost:8800/api`
4. Run:
   - `npm run dev`

## 4) Socket Service (optional in dev)

1. Open `socket/`
2. Install deps: `npm install`
3. Start service: `node app.js` (or project script if available)

## 5) Production Checklist

- Use `NODE_ENV=production`
- Set `COOKIE_SECURE=true` behind HTTPS
- Restrict `CLIENT_ORIGIN` to exact frontend domains
- Rotate strong `JWT_SECRET_KEY`
- Keep MongoDB network ACLs private

