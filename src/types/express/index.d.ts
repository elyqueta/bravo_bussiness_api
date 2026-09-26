import { AccessTokenPayload } from '../../utils/token.util';

declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
      cookies?: Record<string, string>;
      signedCookies?: Record<string, string>;
    }
  }
}

export {};
