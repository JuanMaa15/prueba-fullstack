import type { NextFunction, Request, Response } from 'express';
import type { SuccessResponse } from '@/common/interfaces/apiResponse.interface.ts';
import type { DashboardService } from '@/modules/dashboard/dashboard.service.ts';
import type { DashboardResponseDto } from '@/modules/dashboard/dashboard.dto.ts';

export class DashboardController {
  private readonly dashboardService: DashboardService;

  constructor(dashboardService: DashboardService) {
    this.dashboardService = dashboardService;
  }

  getIndicadores = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.dashboardService.getIndicadores();

      const body: SuccessResponse<DashboardResponseDto> = {
        status: 'success',
        message: 'Indicadores obtenidos correctamente',
        code: 200,
        data: result,
      };
      res.status(200).json(body);
    } catch (error) {
      next(error);
    }
  };
}
