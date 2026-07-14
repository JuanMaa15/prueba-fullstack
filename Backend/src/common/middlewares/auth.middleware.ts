import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '@/common/config/env.ts';
import { ForbiddenError, UnauthorizedError } from '@/common/errors/appError.ts';
import type { AuthTokenPayload } from '@/common/interfaces/authTokenPayload.interface.ts';
import type { Rol } from '@/generated/prisma/enums.ts';

// Verifica el JWT del header Authorization y adjunta el payload en req.user
export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;

  if (!token) {
    next(new UnauthorizedError('Token no proporcionado'));
    return;
  }

  try {
    req.user = jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;
    next();
  } catch {
    next(new UnauthorizedError('Token inválido o expirado'));
  }
}

// Autoriza según el rol del usuario autenticado, ej: router.get('/', authenticate, authorize('ADMIN'), ...)
export function authorize(...roles: Rol[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new UnauthorizedError());
      return;
    }
    if (!roles.includes(req.user.rol)) {
      next(new ForbiddenError());
      return;
    }
    next();
  };
}
