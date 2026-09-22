"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const pool_1 = require("./database/pool");
const env_1 = require("./config/env");
const cors_2 = require("./config/cors");
const swagger_1 = require("./config/swagger");
const asyncHandler_1 = require("./middlewares/asyncHandler");
const notFoundHandler_1 = require("./middlewares/notFoundHandler");
const errorHandler_1 = require("./middlewares/errorHandler");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const seed_routes_1 = __importDefault(require("./routes/seed.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)(cors_2.corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
if (env_1.env.NODE_ENV !== 'production') {
    app.get('/openapi.json', (_req, res) => {
        res.json(swagger_1.swaggerSpec);
    });
    app.get('/api-docs', (_req, res) => {
        res.type('html').send(`
      <!doctype html>
      <html>
        <head>
          <title>Bravo Business API Docs</title>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body>
          <script
            id="api-reference"
            data-url="/openapi.json"
            data-configuration='{"theme":"purple"}'
          ></script>
          <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
        </body>
      </html>
    `);
    });
}
app.get('/health', (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    try {
        await pool_1.pool.query('SELECT 1');
        res.status(200).json({
            status: 'ok',
            service: 'bravo-bussiness-api',
            database: 'connected',
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        console.error('Falha no health check ao consultar o banco:', error);
        res.status(503).json({
            status: 'error',
            service: 'bravo-bussiness-api',
            database: 'disconnected',
            timestamp: new Date().toISOString(),
        });
    }
}));
app.use('/api/auth', auth_routes_1.default);
app.use('/api/categories', category_routes_1.default);
app.use('/api/products', product_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
app.use('/api/seed', seed_routes_1.default);
app.use(notFoundHandler_1.notFoundHandler);
app.use(errorHandler_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map