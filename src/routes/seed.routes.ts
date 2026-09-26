import { Router, Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import { hashPassword } from '../utils/password.util';
import { userRepository } from '../repositories/user.repository';
import { ConflictError, UnauthorizedError } from '../errors';
import { z } from 'zod';
import { env } from '../config/env';

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

const requireSetupToken = (req: Request, _res: Response, next: NextFunction): void => {
  if (env.NODE_ENV === 'production' && req.get('x-setup-token') !== env.SETUP_TOKEN) {
    return next(new UnauthorizedError('Token de setup inválido.'));
  }
  next();
};

const router = Router();

router.post('/seed/init', requireSetupToken, createInitialAdmin);

export default router;
