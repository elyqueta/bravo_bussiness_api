import { userRepository } from '../repositories/user.repository';
import { sessionRepository } from '../repositories/session.repository';
import { User, UserWithPasswordHash } from '../types/user.types';
import { LoginInput } from '../validators/auth.validator';
import { comparePassword, hashPassword } from '../utils/password.util';
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
} from '../utils/token.util';
import { UnauthorizedError } from '../errors';
import { env } from '../config/env';

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

  const refreshToken = generateRefreshToken();
  const refreshTokenExpiresIn = env.JWT_REFRESH_EXPIRES_IN;
  const refreshExpiresAt = new Date(Date.now() + refreshTokenExpiresIn);

  await sessionRepository.create({
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
  const tokenHash = hashToken(refreshToken);

  const session = await sessionRepository.findByTokenHash(tokenHash);

  if (!session) {
    throw new UnauthorizedError('Refresh token inválido ou expirado.');
  }

  if (session.expiresAt < new Date()) {
    await sessionRepository.remove(session.id);
    throw new UnauthorizedError('Refresh token expirado.');
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
