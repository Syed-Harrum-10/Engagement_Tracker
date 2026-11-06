# Engagement Tracker

A personalized image-discovery app. It tracks how long a user looks at each image. Views of 5+ seconds raise the user's interest score for that image's category, and the feed shows images from their top categories first.

**Live demo:** https://engagement-tracker-xi.vercel.app/
**API:** https://engagement2-59lpwz2a.back4.app/api/images

> The API runs on a free plan and sleeps when idle, so the first request can take a minute.

## Tech Stack

- **Backend:** NestJS, TypeScript, Prisma, PostgreSQL
- **Cache:** Redis (feed caching)
- **Auth:** JWT (Passport), bcrypt password hashing
- **Frontend:** React, TypeScript, Vite, React Router
- **DevOps:** Docker, Docker Compose
- **Hosting:** Vercel (frontend), Back4app (backend), Upstash (Redis), Prisma Postgres (database)

## Features

- Register, login and logout with JWT authentication
- Image grid with 5-second view tracking (mouse hover)
- Per-user category interest scores
- Personalized feed, cached in Redis for 5 minutes (cache cleared when a new event is recorded)
- Dashboard with top categories and views per day
- DTO validation on all inputs

## API Routes

All routes start with `/api`.

| Route | Method | Auth | Purpose |
|---|---|---|---|
| `/images` | GET | No | List images (optional `?category=`) |
| `/images/:id` | GET | No | Get one image |
| `/users/register` | POST | No | Create a user |
| `/users/login` | POST | No | Log in and get a JWT |
| `/events` | POST | Yes | Record a view event |
| `/users/:userId/interests` | GET | Yes | A user's category scores |
| `/users/:userId/feed` | GET | Yes | Personalized feed |
| `/analytics/top-categories` | GET | Yes | Most viewed categories |
| `/analytics/views-per-day` | GET | Yes | Views per day |

## Data Model

User, Image, Event, UserInterest (unique per user and category).

## Run Locally

**Backend**

1. Create a `.env` in the backend folder:
```
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_secret
REDIS_HOST=localhost
```
2. Install and start:
```
npm install
npx prisma generate
npm run start:dev
```

**With Docker**
```
docker compose up --build
```
(Uses `REDIS_HOST=redis`. The database is an external Postgres, set through `DATABASE_URL`.)

**Frontend**

1. Create `frontend/.env`:
```
VITE_API_URL=http://localhost:3000
```
2. Install and start:
```
npm install
npm run dev

```
