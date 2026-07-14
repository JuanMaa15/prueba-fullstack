import type { NextFunction, Request, Response } from 'express';
import type { SuccessResponse } from '@/common/interfaces/apiResponse.interface.ts';
import type { PacienteService } from '@/modules/pacientes/pacientes.service.ts';
import type {
  CreateRequestDto,
  IdParamDto,
  ListQueryDto,
  PacienteResponseDto,
  PaginatedResponseDto,
  UpdateRequestDto,
} from '@/modules/pacientes/pacientes.dto.ts';

export class PacienteController {
  private readonly pacienteService: PacienteService;

  constructor(pacienteService: PacienteService) {
    this.pacienteService = pacienteService;
  }

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = req.validatedQuery as ListQueryDto;
      const result = await this.pacienteService.list(query);

      const body: SuccessResponse<PaginatedResponseDto<PacienteResponseDto>> = {
        status: 'success',
        message: 'Pacientes obtenidos correctamente',
        code: 200,
        data: result,
      };
      res.status(200).json(body);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params as IdParamDto;
      const result = await this.pacienteService.getById(id);

      const body: SuccessResponse<PacienteResponseDto> = {
        status: 'success',
        message: 'Paciente obtenido correctamente',
        code: 200,
        data: result,
      };
      res.status(200).json(body);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = req.body as CreateRequestDto;
      const result = await this.pacienteService.create(data);

      const body: SuccessResponse<PacienteResponseDto> = {
        status: 'success',
        message: 'Paciente creado correctamente',
        code: 201,
        data: result,
      };
      res.status(201).json(body);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params as IdParamDto;
      const data = req.body as UpdateRequestDto;
      const result = await this.pacienteService.update(id, data);

      const body: SuccessResponse<PacienteResponseDto> = {
        status: 'success',
        message: 'Paciente actualizado correctamente',
        code: 200,
        data: result,
      };
      res.status(200).json(body);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params as IdParamDto;
      await this.pacienteService.delete(id);

      const body: SuccessResponse = {
        status: 'success',
        message: 'Paciente eliminado correctamente',
        code: 200,
        data: {},
      };
      res.status(200).json(body);
    } catch (error) {
      next(error);
    }
  };
}
