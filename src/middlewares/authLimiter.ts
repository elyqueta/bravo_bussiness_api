import { rateLimit } from 'express-rate-limit';
import { Request, Response } from 'express';

export interface RateLimitRequest extends Request {
  rateLimit?: {
    resetTime: number;
  };
}

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler(req: RateLimitRequest, res: Response) {
    const resetTime = req.rateLimit?.resetTime;
    const retryAfter = resetTime ? Math.ceil((resetTime - Date.now()) / 1000) : 0;

    res.status(429).json({
      status: 'error',
      message: 'Muitas tentativas de login. Tente novamente mais tarde.',
      retryAfter,
    });
  },
});
