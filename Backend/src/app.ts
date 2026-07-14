import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from '@/common/config/env.ts';
import { errorHandler } from '@/common/middlewares/errorHandler.middleware.ts';
import { notFound } from '@/common/middlewares/notFound.middleware.ts';
import { generalRateLimit } from '@/common/middlewares/rateLimit.middleware.ts';
import type { SuccessResponse } from '@/common/interfaces/apiResponse.interface.ts';

export const app = express();

// Seguridad y parseo
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN.length > 0 ? env.CORS_ORIGIN : true }));
app.use(express.json());
app.use(generalRateLimit);

// Health check
app.get('/health', (_req, res) => {
  const body: SuccessResponse = {
    status: 'success',
    message: 'API operativa',
    code: 200,
    data: {},
  };
  res.status(200).json(body);
});

// Aquí se montan las rutas de los módulos, ej: app.use('/api/users', userRouter)

// Rutas inexistentes y manejo global de errores (siempre al final)
app.use(notFound);
app.use(errorHandler);
