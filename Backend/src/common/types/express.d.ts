import type { AuthTokenPayload } from '@/common/interfaces/authTokenPayload.interface.ts';

declare global {
  namespace Express {
    interface Request {
      user?: AuthTokenPayload;
      // Express 5 expone `query` como getter de solo lectura; el resultado
      // validado/parseado por Zod se guarda acá en vez de reasignar req.query.
      validatedQuery?: unknown;
    }
  }
}

export {};
