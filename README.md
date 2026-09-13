# GoPratle Requirement Posting

Phase 1 setup for a requirement posting application. This phase establishes the frontend and backend architecture only; the requirement form, category-specific fields, persistence models, authentication, and business logic will be added in later phases.

## Tech stack

- Frontend: Next.js, React, JavaScript, App Router, CSS
- Backend: Node.js, Express, Mongoose, dotenv, cors
- Database: MongoDB (connection configuration reserved for a later phase)

## Project structure

```text
frontend/   Next.js application
backend/    Express API application
```

## Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Backend setup

```bash
cd backend
copy .env.example .env
npm install
npm run dev
```

The backend runs on `http://localhost:5000` by default. The health check is available at:

```text
GET http://localhost:5000/api/health
```

## Run both applications locally

Use two terminal windows:

```bash
# Terminal 1
cd frontend
npm run dev
```

```bash
# Terminal 2
cd backend
npm install
npm run dev
```

The backend `.env` file should contain local values such as:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gopratle
```

MongoDB is not connected in Phase 1; the URI is included only as reserved configuration.

