# Plotzo MERN Platform

Plotzo is a production-oriented real estate marketplace built with React, Express, MongoDB (Prisma), Socket.io chat, and an AI price prediction microservice.

## Core Capabilities

- Role-based access control (`SELLER` and `BUYER`)
- Seller-only listing create/edit/delete
- Ownership-protected listing modification
- Property filtering and search (price, area, beds, baths, city, type, sort)
- Favorites and live messaging between buyers and sellers
- AI-powered listing price estimation
- Legal information pages (Privacy, Terms, Disclaimer)

## Monorepo Structure

- `frontend/` React + Vite SPA
- `api/` Express REST API + Prisma (MongoDB)
- `socket/` Realtime message relay
- `ai-service/` FastAPI model service

## Quick Start

1. Backend API
   - `cd api`
   - `npm install`
   - configure `.env`
   - `npx prisma generate`
   - `node app.js`
2. Frontend
   - `cd frontend`
   - `npm install`
   - `npm run dev`
3. AI Service
   - `cd ai-service`
   - `python -m pip install -r requirements.txt`
   - `uvicorn app.main:app --host 127.0.0.1 --port 8989`

For full setup and environment variables, see `INSTALLATION_GUIDE.md`.
