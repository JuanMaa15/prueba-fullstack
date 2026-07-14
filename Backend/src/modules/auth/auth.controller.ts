import type { NextFunction, Request, Response } from 'express';
import type { SuccessResponse } from '@/common/interfaces/apiResponse.interface.ts';
import type { AuthService } from '@/modules/auth/auth.service.ts';
import type { LoginRequestDto, LoginResponseDto } from '@/modules/auth/auth.dto.ts';

export class AuthController {
  private readonly authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = req.body as LoginRequestDto;
      const result = await this.authService.login(data);

      const body: SuccessResponse<LoginResponseDto> = {
        status: 'success',
        message: 'Inicio de sesión exitoso',
        code: 200,
        data: result,
      };
      res.status(200).json(body);
    } catch (error) {
      next(error);
    }
  };

  // Logout stateless: el token es responsabilidad del cliente, aquí solo se confirma el cierre de sesión
  logout = (_req: Request, res: Response): void => {
    const body: SuccessResponse = {
      status: 'success',
      message: 'Sesión cerrada',
      code: 200,
      data: {},
    };
    res.status(200).json(body);
  };
}
