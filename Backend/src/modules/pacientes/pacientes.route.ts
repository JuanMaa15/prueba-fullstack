import { Router } from 'express';
import { authenticate, authorize } from '@/common/middlewares/auth.middleware.ts';
import { validate, validateParams, validateQuery } from '@/common/middlewares/validate.middleware.ts';
import { Rol } from '@/generated/prisma/enums.ts';
import { CreateSchema, IdParamSchema, ListQuerySchema, UpdateSchema } from '@/modules/pacientes/pacientes.schema.ts';
import type { PacienteController } from '@/modules/pacientes/pacientes.controller.ts';

export function buildPacienteRouter(pacienteController: PacienteController): Router {
  const router = Router();

  router.use(authenticate, authorize(Rol.ADMIN, Rol.OPERADOR));

  router.get('/', validateQuery(ListQuerySchema), pacienteController.list);
  router.get('/:id', validateParams(IdParamSchema), pacienteController.getById);
  router.post('/', validate(CreateSchema), pacienteController.create);
  router.patch('/:id', validateParams(IdParamSchema), validate(UpdateSchema), pacienteController.update);
  // DELETE queda restringido a ADMIN encima del authorize general de la línea 10
  router.delete('/:id', authorize(Rol.ADMIN), validateParams(IdParamSchema), pacienteController.delete);

  return router;
}
