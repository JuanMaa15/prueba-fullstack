export class AppError extends Error {
  public readonly code: number;

  constructor(message: string, code: number) {
    super(message);
    this.code = code;
    this.name = this.constructor.name;
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Solicitud inválida') {
    super(message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'No autenticado') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'No tienes permisos para realizar esta acción') {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Recurso no encontrado') {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflicto con el estado actual del recurso') {
    super(message, 409);
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'Error interno del servidor') {
    super(message, 500);
  }
}
