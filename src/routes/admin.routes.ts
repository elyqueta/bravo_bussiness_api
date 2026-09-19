import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';

const router = Router();

/**
 * @openapi
 * tags:
 *   name: Admin
 *   description: Endpoints restritos a administradores
 */

/**
 * @openapi
 * /api/admin/me:
 *   get:
 *     tags: [Admin]
 *     summary: Devolve os dados do administrador autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do administrador.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data: { $ref: '#/components/schemas/User' }
 *       401:
 *         description: Token de acesso ausente, inválido ou expirado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/me', authenticate, (req, res) => {
  res.status(200).json({
    status: 'success',
    data: req.user,
  });
});

export default router;
