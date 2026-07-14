import type { NextFunction, Request, Response } from 'express';
import type { SuccessResponse } from '@/common/interfaces/apiResponse.interface.ts';
import type { CatalogoService } from '@/modules/catalogos/catalogo.service.ts';
import type {
  CiudadResponseDto,
  EpsResponseDto,
  GeneroResponseDto,
  TipoDocumentoResponseDto,
} from '@/modules/catalogos/catalogo.dto.ts';

export class CatalogoController {
  private readonly catalogoService: CatalogoService;

  constructor(catalogoService: CatalogoService) {
    this.catalogoService = catalogoService;
  }

  getTipoDocumentos = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.catalogoService.findAllTipoDocumento();

      const body: SuccessResponse<TipoDocumentoResponseDto[]> = {
        status: 'success',
        message: 'Tipos de documento obtenidos correctamente',
        code: 200,
        data: result,
      };
      res.status(200).json(body);
    } catch (error) {
      next(error);
    }
  };

  getGeneros = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.catalogoService.findAllGenero();

      const body: SuccessResponse<GeneroResponseDto[]> = {
        status: 'success',
        message: 'Géneros obtenidos correctamente',
        code: 200,
        data: result,
      };
      res.status(200).json(body);
    } catch (error) {
      next(error);
    }
  };

  getEps = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.catalogoService.findAllEps();

      const body: SuccessResponse<EpsResponseDto[]> = {
        status: 'success',
        message: 'EPS obtenidas correctamente',
        code: 200,
        data: result,
      };
      res.status(200).json(body);
    } catch (error) {
      next(error);
    }
  };

  getCiudades = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.catalogoService.findAllCiudad();

      const body: SuccessResponse<CiudadResponseDto[]> = {
        status: 'success',
        message: 'Ciudades obtenidas correctamente',
        code: 200,
        data: result,
      };
      res.status(200).json(body);
    } catch (error) {
      next(error);
    }
  };
}
