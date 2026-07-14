import { Router } from 'express';
import { authRouter } from '@/modules/auth/index.ts';
import { pacienteRouter } from '@/modules/pacientes/index.ts';
import { catalogoRouter } from '@/modules/catalogos/index.ts';
import { dashboardRouter } from '@/modules/dashboard/index.ts';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/patients', pacienteRouter);
apiRouter.use('/catalogos', catalogoRouter);
apiRouter.use('/dashboard', dashboardRouter);
