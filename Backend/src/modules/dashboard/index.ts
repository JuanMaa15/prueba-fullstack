import { prisma } from '@/infrastructure/prisma/client.ts';
import { DashboardService } from '@/modules/dashboard/dashboard.service.ts';
import { DashboardController } from '@/modules/dashboard/dashboard.controller.ts';
import { buildDashboardRouter } from '@/modules/dashboard/dashboard.route.ts';

const dashboardService = new DashboardService(prisma);
const dashboardController = new DashboardController(dashboardService);

export const dashboardRouter = buildDashboardRouter(dashboardController);
