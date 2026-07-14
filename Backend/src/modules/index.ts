import { Router } from 'express';
import { authRouter } from '@/modules/auth/index.ts';
import { pacienteRouter } from '@/modules/pacientes/index.ts';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/patients', pacienteRouter);
