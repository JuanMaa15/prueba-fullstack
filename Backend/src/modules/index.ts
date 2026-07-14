import { Router } from 'express';
import { authRouter } from '@/modules/auth/index.ts';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
