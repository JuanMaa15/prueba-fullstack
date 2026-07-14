import { Router } from 'express';
import { authenticate, authorize } from '@/common/middlewares/auth.middleware.ts';
import { Rol } from '@/generated/prisma/enums.ts';
import type { DashboardController } from '@/modules/dashboard/dashboard.controller.ts';

export function buildDashboardRouter(dashboardController: DashboardController): Router {
  const router = Router();

  router.get('/', authenticate, authorize(Rol.ADMIN), dashboardController.getIndicadores);

  return router;
}
