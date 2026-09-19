import { Request, Response } from 'express';

function getMe(req: Request, res: Response): void {
  res.status(200).json({
    status: 'success',
    data: req.user,
  });
}

export const adminController = {
  getMe,
};
