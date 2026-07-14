import rateLimit from 'express-rate-limit';
import { env } from '@/common/config/env.ts';
import type { ErrorResponse } from '@/common/interfaces/apiResponse.interface.ts';

// Fábrica interna para no repetir configuración (DRY)
function buildRateLimit(windowMs: number, limit: number, message: string) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
      const body: ErrorResponse = { status: 'error', message, code: 429 };
      res.status(429).json(body);
    },
  });
}

// Límite global para toda la API
export const generalRateLimit = buildRateLimit(
  env.RATE_LIMIT_WINDOW_MS,
  env.RATE_LIMIT_MAX,
  'Demasiadas peticiones, intenta de nuevo más tarde',
);

// Límite estricto para el login, ej: router.post('/login', loginRateLimit, controller.login)
export const loginRateLimit = buildRateLimit(
  env.LOGIN_RATE_LIMIT_WINDOW_MS,
  env.LOGIN_RATE_LIMIT_MAX,
  'Demasiados intentos de inicio de sesión, intenta de nuevo más tarde',
);
