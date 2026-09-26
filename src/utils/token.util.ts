import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UserRole } from '../types/user.types';

export interface AccessTokenPayload {
  sub: string;
  email: string;
  role: UserRole;
  type: 'access';
}

export function generateAccessToken(payload: Omit<AccessTokenPayload, 'type'>): string {
  return jwt.sign({ ...payload, type: 'access' }, env.JWT_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const payload = jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload;

  if (payload.type !== 'access') {
    throw new Error('Token inválido para este uso.');
  }

  return payload;
}

export interface RefreshTokenPayload {
  sessionId: string;
  userId: string;
  type: 'refresh';
}

export function generateRefreshToken(sessionId: string, userId: string): string {
  return jwt.sign({ sessionId, userId, type: 'refresh' }, env.JWT_SECRET, {
    expiresIn: '7d',
  });
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  const payload = jwt.verify(token, env.JWT_SECRET) as RefreshTokenPayload;

  if (payload.type !== 'refresh') {
    throw new Error('Token inválido para este uso.');
  }

  return payload;
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}
