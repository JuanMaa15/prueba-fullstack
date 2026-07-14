import type { AuthTokenPayload } from '@/common/interfaces/authTokenPayload.interface.ts';

declare global {
  namespace Express {
    interface Request {
      user?: AuthTokenPayload;
    }
  }
}

export {};
