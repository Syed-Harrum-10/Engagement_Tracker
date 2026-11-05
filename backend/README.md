# Engagement Tracker API

Backend for an image-discovery app that personalizes content based on viewing behavior. It records how long a user looks at each image. Views of 5+ seconds raise the user's interest score for that image's category, and the feed shows more images from their top categories.

## Tech Stack

- NestJS (TypeScript)
- PostgreSQL with Prisma ORM
- Redis (feed caching)
- JWT authentication (Passport)
- Docker and Docker Compose

## Features

- Image listing and detail endpoints
- View-event tracking with a 5-second engagement threshold
- Per-user category interest scores
- Personalized feed, cached in Redis for 60 seconds (cache cleared when a new event is recorded)
- Analytics: top categories and views per day
- DTO validation on all inputs

## Run with Docker

1. Create a `.env` file in the project root:

```
DATABASE_URL='postgres://75c5602ec1ebb1e46f3a67e768bcf402c87dbc063306cc0ad2f63331273747ee:sk_frhGYbjmlZy70FtHMh96L@pooled.db.prisma.io:5432/postgres?sslmode=require'

JWT_SECRET=SECRET
REDIS_HOST=6379
```
(TODO: match these names to your real .env)

2. Start the app:

```
docker compose up --build
```

3. The API runs at `http://localhost:3000/api`

Note: Postgres is not part of Docker Compose. The app connects to a hosted Postgres database through `DATABASE_URL`.

## API Routes

| Route | Method | Purpose |
|---|---|---|
| `/api/images` | GET | List images |
| `/api/images/:id` | GET | Get one image |
| `/api/users` | POST | Create a user |
| `/api/events` | POST | Record a view event |
| `/api/users/:userId/interests` | GET | A user's category scores |
| `/api/users/:userId/feed` | GET | Personalized feed (Redis cached) |
| `/api/analytics/top-categories` | GET | Most viewed categories |
| `/api/analytics/views-per-day` | GET | Views per day |

TODO: add the login route and mark which routes need a JWT.

## Data Model

User, Image, Event, UserInterest (unique per user and category).

## Status

Backend complete. Frontend (React) and deployment in progress.