import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';

// Valida y reemplaza req.body con el resultado parseado del schema.
// Si falla, delega el ZodError al errorHandler (ya sabe formatear errores de validación).
export function validate(schema: ZodType) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
}

// Valida los parámetros de ruta (ej: /patients/:id)
export function validateParams(schema: ZodType) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.params = schema.parse(req.params) as typeof req.params;
      next();
    } catch (error) {
      next(error);
    }
  };
}

// Valida el query string. Express 5 expone req.query como getter de solo lectura,
// por eso el resultado parseado se guarda en req.validatedQuery en vez de reasignar req.query.
export function validateQuery(schema: ZodType) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.validatedQuery = schema.parse(req.query);
      next();
    } catch (error) {
      next(error);
    }
  };
}
