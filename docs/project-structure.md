# Project Structure

Bravo Business API follows a layered architecture within a single Express service. This document explains the purpose of each top-level directory and key files.

## Root Layout

```
bravo-bussiness-api/
├── src/                    # TypeScript source code
├── dist/                   # Compiled JavaScript output (gitignored)
├── migrations/             # SQL schema files
├── docs/                   # Extended documentation
├── .env                    # Local environment variables (gitignored)
├── .env.example            # Template for environment variables
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript compiler configuration
├── Dockerfile              # Container build instructions
├── docker-compose.yml      # Local Postgres + API composition
├── render.yaml             # Render deployment blueprint
├── eslint.config.js        # ESLint flat config
└── node-version            # Pinned Node.js version for tooling
```

## Source Tree (`src/`)

```
src/
├── server.ts               # Entry point: binds HTTP server, handles graceful shutdown
├── app.ts                  # Express app bootstrap: middleware, routes, error handlers
├── config/                 # Configuration and environment loading
│   ├── env.ts              # Zod-validated environment schema
│   ├── cors.ts             # CORS policy
│   └── swagger.ts          # OpenAPI spec generation
├── database/
│   └── pool.ts             # PostgreSQL connection pool (node-postgres)
├── routes/                 # Route definitions with OpenAPI JSDoc annotations
│   ├── auth.routes.ts
│   ├── category.routes.ts
│   ├── product.routes.ts
│   ├── admin.routes.ts
│   └── seed.routes.ts
├── controllers/            # Request handlers: orchestrate services, send responses
│   ├── auth.controller.ts
│   ├── category.controller.ts
│   ├── product.controller.ts
│   ├── admin.controller.ts
│   └── seed.controller.ts
├── services/               # Business logic: pure domain operations
│   ├── auth.service.ts
│   ├── category.service.ts
│   └── product.service.ts
├── repositories/           # Data access layer: SQL queries and ORM-like helpers
│   ├── user.repository.ts
│   ├── session.repository.ts
│   ├── category.repository.ts
│   └── product.repository.ts
├── validators/             # Zod schemas for request payload validation
│   ├── auth.validator.ts
│   ├── category.validator.ts
│   └── product.validator.ts
├── middlewares/             # Express middleware
│   ├── authenticate.ts     # JWT access token verification
│   ├── requireAdmin.ts     # Role-based access control
│   ├── requireRole.ts      # Generic role enforcement
│   ├── asyncHandler.ts     # Catch async errors in controllers
│   ├── errorHandler.ts     # Centralized error formatting
│   ├── validate.ts         # Zod validation middleware wrapper
│   ├── rateLimiter.ts      # Global rate limiting
│   ├── authLimiter.ts      # Stricter rate limiting for auth routes
│   ├── upload.ts           # Multer + Cloudinary image upload handling
│   ├── notFoundHandler.ts  # 404 fallback
│   └── index.ts            # Barrel export
├── types/                  # TypeScript type definitions
│   ├── user.types.ts
│   ├── category.types.ts
│   ├── product.types.ts
│   ├── pagination.types.ts
│   └── express/
│       └── index.d.ts      # Express request type augmentations
├── utils/                  # Shared utilities
│   ├── token.util.ts       # JWT generation and verification
│   ├── password.util.ts    # bcrypt hashing and comparison
│   ├── slug.util.ts        # URL-safe slug generation
│   └── cloudinary.ts       # Cloudinary client wrapper
├── errors/                 # Domain error classes
│   ├── AppError.ts         # Base operational error
│   ├── HttpErrors.ts       # HTTP-specific error subclasses
│   └── index.ts            # Barrel export
└── scripts/                # One-off administrative scripts
    ├── seed.ts             # Seed runner entry point
    └── seeds/              # Seed implementations
        ├── index.ts
        ├── seedAdmin.ts
        ├── seedCatalog.ts
        ├── seedUsers.ts
        └── data.ts
```

## Conventions

- **Routes** declare OpenAPI annotations via JSDoc comments; `swagger-jsdoc` generates the spec from them.
- **Controllers** are thin: they call services and return JSON responses.
- **Services** contain business logic and never touch Express.
- **Repositories** encapsulate SQL; the rest of the app never imports `pg` directly.
- **Validators** are Zod schemas shared between runtime validation and TypeScript types.
- **Middlewares** are composed declaratively in route definitions.
