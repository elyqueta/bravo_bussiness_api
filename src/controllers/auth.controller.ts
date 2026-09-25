import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import { authService } from '../services/auth.service';
import { LoginInput } from '../validators/auth.validator';

const login = asyncHandler(
  async (req: Request<Record<string, string>, unknown, LoginInput>, res: Response) => {
    const result = await authService.login(req.body, req.ip);

    res.status(200).json({
      status: 'success',
      data: result,
    });
  }
);

const refresh = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body as { refreshToken: string };

  const result = await authService.refresh(refreshToken);

  res.status(200).json({
    status: 'success',
    data: result,
  });
});

export const authController = {
  login,
  refresh,
};
