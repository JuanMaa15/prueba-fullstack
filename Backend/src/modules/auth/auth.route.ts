import { Router } from 'express';
import { authenticate } from '@/common/middlewares/auth.middleware.ts';
import { loginRateLimit } from '@/common/middlewares/rateLimit.middleware.ts';
import { validate } from '@/common/middlewares/validate.middleware.ts';
import { LoginSchema } from '@/modules/auth/auth.schema.ts';
import type { AuthController } from '@/modules/auth/auth.controller.ts';

export function buildAuthRouter(authController: AuthController): Router {
  const router = Router();

  router.post('/login', loginRateLimit, validate(LoginSchema), authController.login);
  router.post('/logout', authenticate, authController.logout);

  return router;
}
