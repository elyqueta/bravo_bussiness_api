# Bravo Business API

REST API for product catalog and category management, built with Express, TypeScript, and PostgreSQL. It provides admin authentication, image uploads via Cloudinary, and OpenAPI documentation.

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js >= 20 |
| Language | TypeScript 5.7 |
| Framework | Express 4.21 |
| Database | PostgreSQL (Neon / local Docker) |
| Auth | JWT (access + refresh tokens), bcrypt |
| File Uploads | Multer + Sharp + Cloudinary |
| Validation | Zod 4.4 |
| Docs | Swagger / OpenAPI 3.0 |
| Security | Helmet, CORS, rate limiting, cookie-parser |
| Migrations | node-pg-migrate |
| Lint / Format | ESLint, Prettier |

## Prerequisites

- Node.js >= 20
- PostgreSQL (local or Neon)
- Cloudinary account (for image uploads)

## Installation

```bash
npm install
```

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Required variables:

- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — random string with 32+ characters
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — from Cloudinary
- `CORS_ORIGIN` — comma-separated allowed origins

Optional variables have sensible defaults (rate limiting, token expiry, bcrypt rounds).

## Database Setup

Apply migrations:

```bash
npm run migrate:up
```

Seed initial data (admin + catalog):

```bash
npm run seed
```

Or use the public endpoint:

```bash
POST /api/v1/seed/init
{
  "email": "admin@bravo.co.ao",
  "fullName": "Admin Bravo",
  "password": "YourStrongPassword"
}
```

## Running

Development with hot reload:

```bash
npm run dev
```

Production:

```bash
npm run build
npm start
```

The API listens on `http://localhost:3000` by default.

## API Documentation

In development, interactive docs are available at:

- Swagger UI: `GET /api-docs`
- OpenAPI JSON: `GET /openapi.json`

Health check:

```bash
GET /health
```

### Base URL

```
/api/v1
```

### Endpoints

#### Authentication

| Method | Path | Access | Description |
|---|---|---|---|
| `POST` | `/auth/login` | Public | Authenticate admin, returns access + refresh tokens |
| `POST` | `/auth/refresh` | Public | Refresh access token using refresh token |
| `POST` | `/auth/logout` | Authenticated | Invalidate current refresh token session |

#### Categories

| Method | Path | Access | Description |
|---|---|---|---|
| `GET` | `/categories` | Public | List all categories ordered by label |
| `POST` | `/categories` | Admin | Create a new category |
| `GET` | `/categories/:id` | Public | Get category by ID |
| `PATCH` | `/categories/:id` | Admin | Partially update a category |
| `DELETE` | `/categories/:id` | Admin | Delete a category |

#### Products

| Method | Path | Access | Description |
|---|---|---|---|
| `GET` | `/products` | Public | List products with filters (`categorySlug`, `badge`, `search`, `page`, `limit`) |
| `POST` | `/products` | Admin | Create product with image upload (`multipart/form-data`) |
| `GET` | `/products/:id` | Public | Get product by ID |
| `PATCH` | `/products/:id` | Admin | Partially update product with optional image upload |
| `DELETE` | `/products/:id` | Admin | Delete product |

#### Admin

| Method | Path | Access | Description |
|---|---|---|---|
| `POST` | `/admin/register` | Public | Register a new admin user |

#### Seed

| Method | Path | Access | Description |
|---|---|---|---|
| `POST` | `/seed/init` | Public | Bootstrap initial admin and catalog |

### Request / Response Format

Successful responses follow this structure:

```json
{
  "status": "success",
  "data": { ... }
}
```

Errors:

```json
{
  "status": "error",
  "message": "Human-readable error message.",
  "details": [ ... ]
}
```

### Authentication

Authenticated endpoints require a Bearer JWT in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

Access tokens expire after **24 hours**. Refresh tokens expire after **48 hours** and are delivered as `HttpOnly` cookies on successful login/refresh.

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `NODE_ENV` | `development` | `development` \| `production` \| `test` |
| `PORT` | `3000` | Server port |
| `DATABASE_URL` | — | PostgreSQL connection string |
| `CORS_ORIGIN` | — | Allowed CORS origins (comma-separated) |
| `COOKIE_DOMAIN` | — | Cookie domain for refresh token |
| `JWT_SECRET` | — | Secret key for JWT signing (32+ chars) |
| `JWT_ACCESS_EXPIRES_IN` | `24h` | Access token TTL |
| `JWT_REFRESH_EXPIRES_IN` | `172800000` | Refresh token TTL in milliseconds |
| `BCRYPT_SALT_ROUNDS` | `12` | bcrypt cost factor |
| `CLOUDINARY_CLOUD_NAME` | — | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | — | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | — | Cloudinary API secret |
| `RATE_LIMIT_WINDOW_MS` | `900000` | Global rate limit window |
| `RATE_LIMIT_MAX` | `100` | Max requests per window |

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server with tsx watch |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run compiled server |
| `npm run typecheck` | Type-check without emitting |
| `npm run lint` | Lint `src` with ESLint |
| `npm run lint:fix` | Lint and auto-fix |
| `npm run format` | Format `src` with Prettier |
| `npm run format:check` | Check formatting |
| `npm run migrate:up` | Run pending database migrations |
| `npm run migrate:down` | Rollback last migration |
| `npm run migrate:create` | Generate a new migration |
| `npm run seed` | Seed initial data |

## Deployment

See `docs/deploy-render-neon.md` for a step-by-step guide to deploying on Render with Neon Postgres.

## Documentation

- [Architecture](docs/architecture.md)
- [Project Structure](docs/project-structure.md)
- [Deploy on Render + Neon](docs/deploy-render-neon.md)

## License

Private — UNLICENSED
