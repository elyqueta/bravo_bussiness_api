import { userRepository } from '../repositories/user.repository';
import { sessionRepository } from '../repositories/session.repository';
import { User, UserWithPasswordHash } from '../types/user.types';
import { LoginInput } from '../validators/auth.validator';
import { comparePassword, hashPassword } from '../utils/password.util';
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  verifyRefreshToken,
} from '../utils/token.util';
import { UnauthorizedError } from '../errors';
import { env } from '../config/env';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';

function toSafeUser(user: UserWithPasswordHash): User {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

async function issueTokens(
  user: User,
  device?: string | null,
  ip?: string | null
): Promise<{ user: User; accessToken: string; refreshToken: string; refreshExpiresAt: Date }> {
  const accessToken = generateAccessToken({
    sub: user.id,
    email: user.email,
    role: user.role,
  });

  const refreshTokenExpiresIn = env.JWT_REFRESH_EXPIRES_IN;
  const refreshExpiresAt = new Date(Date.now() + refreshTokenExpiresIn);

  const sessionId = crypto.randomUUID();
  const refreshToken = generateRefreshToken(sessionId, user.id);

  await sessionRepository.create({
    id: sessionId,
    userId: user.id,
    tokenHash: hashToken(refreshToken),
    device: device ?? null,
    ip: ip ?? null,
    expiresAt: refreshExpiresAt,
  });

  return {
    user,
    accessToken,
    refreshToken,
    refreshExpiresAt,
  };
}

function isAccountLocked(user: UserWithPasswordHash): boolean {
  return user.lockedUntil != null && user.lockedUntil > new Date();
}

async function login(
  input: LoginInput,
  device?: string | null,
  ip?: string | null
): Promise<{ user: User; accessToken: string; refreshToken: string; refreshExpiresAt: Date }> {
  const userWithHash = await userRepository.findByEmail(input.email);

  if (!userWithHash) {
    throw new UnauthorizedError('Credenciais inválidas.');
  }

  if (userWithHash.status !== 'active') {
    throw new UnauthorizedError('Esta conta não está ativa. Contacte o suporte.');
  }

  if (isAccountLocked(userWithHash)) {
    throw new UnauthorizedError('Conta temporariamente bloqueada. Tente novamente mais tarde.');
  }

  const isPasswordValid = await comparePassword(input.password, userWithHash.passwordHash);

  if (!isPasswordValid) {
    try {
      await userRepository.incrementFailedAttempts(userWithHash.id);
    } catch {
      // lockout ainda não disponível enquanto a migration não for aplicada
    }
    throw new UnauthorizedError('Credenciais inválidas.');
  }

  try {
    await userRepository.resetFailedAttempts(userWithHash.id);
  } catch {
    // lockout ainda não disponível enquanto a migration não for aplicada
  }

  const user = toSafeUser(userWithHash);

  return issueTokens(user, device, ip);
}

async function refresh(
  refreshToken: string
): Promise<{ user: User; accessToken: string; refreshToken: string; refreshExpiresAt: Date }> {
  let payload: { sessionId: string; userId: string };
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Refresh token expirado.');
    }
    throw new UnauthorizedError('Refresh token inválido ou expirado.');
  }

  const tokenHash = hashToken(refreshToken);
  const session = await sessionRepository.findByTokenHash(tokenHash);

  if (!session) {
    await sessionRepository.removeAllByUserId(payload.userId);
    throw new UnauthorizedError(
      'Refresh token já utilizado. Todas as sessões foram revogadas por segurança.'
    );
  }

  if (session.expiresAt < new Date()) {
    await sessionRepository.remove(session.id);
    throw new UnauthorizedError('Refresh token expirado.');
  }

  if (session.userId !== payload.userId) {
    await sessionRepository.removeAllByUserId(payload.userId);
    throw new UnauthorizedError('Sessão inválida.');
  }

  const user = await userRepository.findById(session.userId);

  if (!user || user.status !== 'active') {
    await sessionRepository.removeAllByUserId(session.userId);
    throw new UnauthorizedError('Sessão inválida.');
  }

  await sessionRepository.remove(session.id);

  return issueTokens(user, session.device, session.ip);
}

async function registerAdmin(
  fullName: string,
  email: string,
  plainPassword: string
): Promise<User> {
  const passwordHash = await hashPassword(plainPassword);

  return userRepository.create({
    fullName,
    email,
    passwordHash,
    phone: '',
    role: 'admin',
  });
}

export const authService = {
  login,
  refresh,
  registerAdmin,
};
