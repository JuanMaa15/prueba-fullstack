import { prisma } from '@/infrastructure/prisma/client.ts';
import { AuthService } from '@/modules/auth/auth.service.ts';
import { AuthController } from '@/modules/auth/auth.controller.ts';
import { buildAuthRouter } from '@/modules/auth/auth.route.ts';

const authService = new AuthService(prisma);
const authController = new AuthController(authService);

export const authRouter = buildAuthRouter(authController);
