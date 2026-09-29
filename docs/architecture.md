# Architecture

## Overview

Bravo Business API is a monolithic Express application organized in clear vertical slices (auth, categories, products, admin, seed). It follows a layered separation of concerns without over-engineering: routes define the contract, controllers handle HTTP, services enforce business rules, and repositories manage persistence.

## Request Lifecycle

```
Client Request
    │
    ▼
Helmet / Compression / CORS / Cookie Parser
    │
    ▼
Global Rate Limiter (`/api`)
    │
    ▼
Route Matching
    │
    ▼
Route-specific Middlewares
    ├── authenticate        (JWT access token)
    ├── requireAdmin        (role check)
    ├── validate            (Zod schema)
    └── uploadProductImages (Multer + Sharp + Cloudinary)
    │
    ▼
Controller
    ├── parses Express req/res
    ├── calls Service layer
    └── sends structured JSON response
    │
    ▼
Service
    ├── business logic
    ├── transaction orchestration
    └── calls Repositories
    │
    ▼
Repository
    ├── parameterized SQL
    ├── row-to-domain mapping
    └── PostgreSQL via connection pool
    │
    ▼
Response
    │
    ▼
Error Handler (if unhandled)
    ├── AppError → client-safe JSON with status code
    └── Unexpected Error → generic 500 + internal logging
```

## Authentication Flow

The API uses a dual-token strategy:

1. **Login** (`POST /api/v1/auth/login`)
   - Validates credentials with bcrypt.
   - Creates a session row in `sessions` table.
   - Returns an **access token** (JWT, 24h) in the response body.
   - Returns a **refresh token** (JWT, 48h) as an `HttpOnly` cookie.

2. **Refresh** (`POST /api/v1/auth/refresh`)
   - Accepts refresh token from cookie or request body.
   - Verifies JWT signature and expiry.
   - Looks up the hashed token in the `sessions` table.
   - If valid, revokes the old session and issues a new session + token pair (rotation).
   - If the token hash is missing (replay attack), revokes all sessions for that user.

3. **Logout** (`POST /api/v1/auth/logout`)
   - Deletes the session row associated with the refresh token cookie.
   - Clears the cookie.

Access tokens are stateless JWTs verified on every request by the `authenticate` middleware. Refresh tokens are stateful: their hashes are stored server-side to enable revocation and rotation.

## Database Design

The schema is managed via raw SQL migrations in `migrations/`:

- `001_init_schema.sql` — core tables: `users`, `categories`, `products`, `sessions`.
- `002_fix_category_icon_length.sql` — adjusts `icon` column length.
- `003_fix_category_icon_length.sql` — repeat fix for consistency.
- `004_seed_initial.sql` — initial seed data.
- `005_alter_product_prices_to_numeric.sql` — price precision migration.
- `006_add_login_lockout.sql` — failed login tracking and account lockout.

The app uses `node-pg-migrate` for versioning, but migrations are plain `.sql` files applied with `psql` or the npm script.

Connection pooling is handled by a shared `pool.ts` module. In production (`NODE_ENV=production`), SSL is enforced with `rejectUnauthorized: false` for compatibility with managed databases like Neon.

## Configuration

All environment variables are validated at startup using Zod in `src/config/env.ts`. Missing or invalid variables cause the process to exit immediately with a clear error message. This prevents runtime surprises from misconfigured deployments.

## Error Handling

- **Operational errors** extend `AppError` and carry an HTTP status code. Examples: `NotFoundError`, `UnauthorizedError`, `ConflictError`.
- **Unexpected errors** are caught by the global error handler, logged with full stack traces, and returned to the client as generic `500 Internal Server Error` responses to avoid leaking implementation details.

## File Uploads

Product images are handled by a custom Multer middleware that:
1. Accepts `multipart/form-data` uploads.
2. Validates file type using `file-type`.
3. Optimizes images with Sharp.
4. Uploads to Cloudinary.
5. Attaches the resulting URLs to `req.body` for downstream services.

## Observability

- Health check endpoint: `GET /health` (returns database connectivity status).
- OpenAPI docs available in non-production environments.
- Structured error responses with optional `details` arrays for validation failures.

## Deployment Target

The primary deployment path is Render (web service) + Neon (managed Postgres). See `docs/deploy-render-neon.md` for the full runbook. Docker support exists for local development via `docker-compose.yml`.
