import { Router, type RequestHandler } from 'express';
import { authController } from '../controllers/auth.controller';
import { authLimiter } from '../middlewares/authLimiter';
import { validate } from '../middlewares/validate';
import { loginSchema, refreshSchema } from '../validators/auth.validator';

const router = Router();

/**
 * @openapi
 * tags:
 *   name: Auth
 *   description: Autenticação do administrador
 */

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Autentica o administrador e devolve os tokens de acesso e refresh
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login efetuado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data: { $ref: '#/components/schemas/AuthResult' }
 *       401:
 *         description: Credenciais inválidas ou conta inativa.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       422:
 *         description: Dados inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       429:
 *         description: Muitas tentativas de login.
 */
router.post(
  '/login',
  authLimiter as RequestHandler,
  validate({ body: loginSchema }) as RequestHandler,
  ((req, res, next) => {
    void authController.login(req, res, next);
  }) as RequestHandler
);

/**
 * @openapi
 * /api/auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Usa o refresh token para emitir um novo access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOi...
 *     responses:
 *       200:
 *         description: Tokens renovados com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data: { $ref: '#/components/schemas/AuthResult' }
 *       401:
 *         description: Refresh token inválido ou expirado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       422:
 *         description: Dados inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  '/refresh',
  validate({ body: refreshSchema }) as RequestHandler,
  ((req, res, next) => {
    void authController.refresh(req, res, next);
  }) as RequestHandler
);

export default router;
