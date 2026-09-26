import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { pool } from './database/pool';
import { env } from './config/env';
import { corsOptions } from './config/cors';
import { swaggerSpec } from './config/swagger';
import { asyncHandler } from './middlewares/asyncHandler';
import { notFoundHandler } from './middlewares/notFoundHandler';
import { errorHandler } from './middlewares/errorHandler';
import { apiLimiter } from './middlewares/rateLimiter';
import authRoutes from './routes/auth.routes';
import categoryRoutes from './routes/category.routes';
import productRoutes from './routes/product.routes';
import adminRoutes from './routes/admin.routes';
import seedRoutes from './routes/seed.routes';

const app: Application = express();

app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(compression());

app.use(cors(corsOptions));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

app.use('/api', apiLimiter);

if (env.NODE_ENV !== 'production') {
  app.get('/openapi.json', (_req: Request, res: Response) => {
    res.json(swaggerSpec);
  });

  app.get('/api-docs', (_req: Request, res: Response) => {
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

app.get(
  '/health',
  asyncHandler(async (_req: Request, res: Response) => {
    try {
      await pool.query('SELECT 1');

      res.status(200).json({
        status: 'ok',
        service: 'bravo-bussiness-api',
        database: 'connected',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Falha no health check ao consultar o banco:', error);
      res.status(503).json({
        status: 'error',
        service: 'bravo-bussiness-api',
        database: 'disconnected',
        timestamp: new Date().toISOString(),
      });
    }
  })
);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/seed', seedRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
