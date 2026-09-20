import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import { hashPassword } from '../utils/password.util';
import { userRepository } from '../repositories/user.repository';
import { ConflictError } from '../errors';
import { z } from 'zod';

const createAdminSchema = z.object({
  email: z.email().trim().toLowerCase().max(255),
  password: z.string().min(8, 'password deve ter no mínimo 8 caracteres.'),
  fullName: z.string().trim().min(3, 'fullName deve ter no mínimo 3 caracteres.').max(150),
});

const createInitialAdmin = asyncHandler(async (req, res) => {
  const { email, password, fullName } = createAdminSchema.parse(req.body);

  const existing = await userRepository.findByEmail(email);

  if (existing) {
    throw new ConflictError('Já existe um usuário com este email.');
  }

  const passwordHash = await hashPassword(password);

  const admin = await userRepository.create({
    fullName,
    email,
    passwordHash,
    phone: '',
    role: 'admin',
  });

  res.status(201).json({
    status: 'success',
    message: 'Admin criado com sucesso.',
    data: {
      id: admin.id,
      email: admin.email,
      fullName: admin.fullName,
    },
  });
});

const router = Router();

/**
 * @openapi
 * /api/seed/init:
 *   post:
 *     tags: [Seed]
 *     summary: Cria o admin inicial (rota pública para setup)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - fullName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               fullName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin criado com sucesso.
 *       409:
 *         description: Já existe um usuário com este email.
 *       422:
 *         description: Dados inválidos.
 */
router.post('/seed/init', createInitialAdmin);

export default router;
