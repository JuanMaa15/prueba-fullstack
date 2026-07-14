import type { NextFunction, Request, Response } from 'express';
import { NotFoundError } from '@/common/errors/appError.ts';

export function notFound(req: Request, _res: Response, next: NextFunction): void {
  next(new NotFoundError(`Ruta ${req.originalUrl} no encontrada`));
}
