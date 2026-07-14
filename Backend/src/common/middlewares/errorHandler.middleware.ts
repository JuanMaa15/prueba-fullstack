import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '@/common/errors/appError.ts';
import type { ErrorResponse } from '@/common/interfaces/apiResponse.interface.ts';

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (error instanceof AppError) {
    const body: ErrorResponse = {
      status: 'error',
      message: error.message,
      code: error.code,
    };
    res.status(error.code).json(body);
    return;
  }

  if (error instanceof ZodError) {
    const body: ErrorResponse = {
      status: 'error',
      message: 'Error de validación',
      code: 400,
      errors: error.issues.map((issue) => ({
        file: issue.path.join('.'),
        message: issue.message,
      })),
    };
    res.status(400).json(body);
    return;
  }

  // Error no controlado: se registra el detalle pero no se expone al cliente
  console.error(error);
  const body: ErrorResponse = {
    status: 'error',
    message: 'Error interno del servidor',
    code: 500,
  };
  res.status(500).json(body);
}
