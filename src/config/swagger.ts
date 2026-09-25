import path from 'node:path';
import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './env';

const swaggerDefinition: swaggerJsdoc.OAS3Definition = {
  openapi: '3.0.0',
  info: {
    title: 'Bravo Business API',
    version: '1.0.0',
    description:
      'API REST Bravo Business — catálogo de produtos e gestão de categorias. ' +
      'Documentação gerada automaticamente a partir de comentários JSDoc ' +
      'nas rotas.',
  },
  servers: [
    {
      url: `http://localhost:${env.PORT}`,
      description: 'Servidor local de desenvolvimento',
    },
  ],
  components: {
    schemas: {
      Category: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'roupas' },
          slug: { type: 'string', example: 'roupas' },
          label: { type: 'string', example: 'Roupas' },
          icon: { type: 'string', nullable: true, example: 'fa-shirt' },
          prefix: { type: 'string', example: 'R' },
          anchor: { type: 'string', example: 's-roupas' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateCategoryInput: {
        type: 'object',
        required: ['label', 'prefix', 'anchor'],
        properties: {
          label: { type: 'string', maxLength: 100, example: 'Roupas' },
          icon: { type: 'string', maxLength: 10, example: 'fa-shirt' },
          prefix: { type: 'string', maxLength: 1, example: 'R' },
          anchor: { type: 'string', maxLength: 50, example: 's-roupas' },
        },
      },
      UpdateCategoryInput: {
        type: 'object',
        properties: {
          label: { type: 'string', maxLength: 100, example: 'Roupas' },
          icon: { type: 'string', maxLength: 10, nullable: true, example: 'fa-shirt' },
          prefix: { type: 'string', maxLength: 1, example: 'R' },
          anchor: { type: 'string', maxLength: 50, example: 's-roupas' },
        },
      },
      Product: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'BB-R001' },
          categorySlug: { type: 'string', example: 'roupas' },
          name: { type: 'string', example: 'Camiseta Básica' },
          description: { type: 'string', nullable: true },
          price: { type: 'number', format: 'decimal', example: 14500.00 },
          oldPrice: { type: 'number', format: 'decimal', nullable: true, example: 18000.00 },
          img: { type: 'string', example: 'https://cdn.exemplo.co.ao/produtos/abc.jpg' },
          badge: { type: 'string', nullable: true, enum: ['Sale', 'Premium', 'Novo'] },
          features: { type: 'array', items: { type: 'string' }, example: ['100% algodão', 'Manga curta'] },
          gallery: { type: 'array', items: { type: 'string' }, example: ['https://cdn.exemplo.co.ao/produtos/abc1.jpg'] },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateProductInput: {
        type: 'object',
        required: ['categorySlug', 'name', 'price', 'img'],
        properties: {
          categorySlug: { type: 'string', example: 'roupas' },
          name: { type: 'string', maxLength: 200, example: 'Camiseta Básica' },
          description: { type: 'string', maxLength: 5000 },
          price: { type: 'integer', example: 14500 },
          oldPrice: { type: 'integer', example: 18000 },
          img: { type: 'string', example: 'https://cdn.exemplo.co.ao/produtos/abc.jpg' },
          badge: { type: 'string', enum: ['Sale', 'Premium', 'Novo'] },
          features: { type: 'array', items: { type: 'string' } },
          gallery: { type: 'array', items: { type: 'string' } },
        },
      },
      UpdateProductInput: {
        type: 'object',
        properties: {
          categorySlug: { type: 'string', example: 'roupas' },
          name: { type: 'string', maxLength: 200 },
          description: { type: 'string', maxLength: 5000, nullable: true },
          price: { type: 'integer' },
          oldPrice: { type: 'integer', nullable: true },
          img: { type: 'string' },
          badge: { type: 'string', enum: ['Sale', 'Premium', 'Novo'], nullable: true },
          features: { type: 'array', items: { type: 'string' }, nullable: true },
          gallery: { type: 'array', items: { type: 'string' }, nullable: true },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'error' },
          message: { type: 'string', example: 'Recurso não encontrado.' },
          details: {
            type: 'array',
            items: { type: 'object' },
            description: 'Presente apenas em erros de validação (422).',
          },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          fullName: { type: 'string', example: 'Admin Bravo' },
          email: { type: 'string', format: 'email', example: 'admin@bravo.co.ao' },
          phone: { type: 'string', example: '923456789' },
          role: { type: 'string', enum: ['admin'] },
          status: { type: 'string', enum: ['active', 'inactive'] },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      LoginInput: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'admin@bravo.co.ao' },
          password: { type: 'string', format: 'password', example: 'SenhaForte123' },
        },
      },
      AuthResult: {
        type: 'object',
        properties: {
          user: { $ref: '#/components/schemas/User' },
          accessToken: { type: 'string', example: 'eyJhbGciOi...' },
          refreshToken: { type: 'string', example: 'a1b2c3...' },
          refreshExpiresAt: { type: 'string', format: 'date-time', example: '2026-09-25T10:00:00.000Z' },
        },
      },
      Pagination: {
        type: 'object',
        properties: {
          page: { type: 'integer', example: 1 },
          limit: { type: 'integer', example: 20 },
          total: { type: 'integer', example: 137 },
          totalPages: { type: 'integer', example: 7 },
        },
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

const options: swaggerJsdoc.Options = {
  definition: swaggerDefinition,
  apis: [
    path.join(__dirname, '../routes/*.routes.ts'),
    path.join(__dirname, '../routes/*.routes.js'),
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
