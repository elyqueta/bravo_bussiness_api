import { Router, type RequestHandler } from 'express';
import { authController } from '../controllers/auth.controller';
import { authLimiter } from '../middlewares/authLimiter';
import { validate } from '../middlewares/validate';
import { loginSchema } from '../validators/auth.validator';

const router = Router();

/**
 * @openapi
 * tags:
 *   name: Auth
 *   description: Login do administrador
 */

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Autentica o administrador e devolve o access token
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

export default router;
