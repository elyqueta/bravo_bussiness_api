import { Request, Response, CookieOptions } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import { authService } from '../services/auth.service';
import { sessionRepository } from '../repositories/session.repository';
import { hashToken } from '../utils/token.util';
import { LoginInput, RefreshInput } from '../validators/auth.validator';
import { env } from '../config/env';

function getCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api/v1/auth',
    maxAge: env.JWT_REFRESH_EXPIRES_IN,
    domain: env.COOKIE_DOMAIN || undefined,
  };
}

const login = asyncHandler(
  async (req: Request<Record<string, string>, unknown, LoginInput>, res: Response) => {
    const result = await authService.login(req.body, req.ip);

    res.cookie('refreshToken', result.refreshToken, getCookieOptions());

    res.status(200).json({
      status: 'success',
      data: {
        user: result.user,
        accessToken: result.accessToken,
        refreshExpiresAt: result.refreshExpiresAt,
      },
    });
  }
);

const refresh = asyncHandler(async (req: Request, res: Response) => {
  const bodyToken = (req.body as RefreshInput).refreshToken;
  const cookieToken = (req.cookies as Record<string, string> | undefined)?.refreshToken;
  const refreshToken = cookieToken || bodyToken;

  if (!refreshToken) {
    res.status(401).json({
      status: 'error',
      message: 'Sessão não encontrada.',
    });
    return;
  }

  const result = await authService.refresh(refreshToken);

  res.cookie('refreshToken', result.refreshToken, getCookieOptions());

  res.status(200).json({
    status: 'success',
    data: {
      accessToken: result.accessToken,
      refreshExpiresAt: result.refreshExpiresAt,
    },
  });
});

const logout = asyncHandler(async (_req: Request, res: Response) => {
  const token = (_req.cookies as Record<string, string> | undefined)?.refreshToken;

  if (token) {
    const tokenHash = hashToken(token);
    const session = await sessionRepository.findByTokenHash(tokenHash);

    if (session) {
      await sessionRepository.remove(session.id);
    }
  }

  res.clearCookie('refreshToken', { path: '/api/v1/auth', domain: env.COOKIE_DOMAIN || undefined });
  res.status(204).send();
});

export const authController = {
  login,
  refresh,
  logout,
};
