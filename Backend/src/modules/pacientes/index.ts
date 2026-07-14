import { prisma } from '@/infrastructure/prisma/client.ts';
import { PacienteService } from '@/modules/pacientes/pacientes.service.ts';
import { PacienteController } from '@/modules/pacientes/pacientes.controller.ts';
import { buildPacienteRouter } from '@/modules/pacientes/pacientes.route.ts';

const pacienteService = new PacienteService(prisma);
const pacienteController = new PacienteController(pacienteService);

export const pacienteRouter = buildPacienteRouter(pacienteController);
