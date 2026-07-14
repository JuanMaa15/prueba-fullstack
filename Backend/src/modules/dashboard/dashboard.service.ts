import type { PrismaClient } from '@/generated/prisma/client.ts';
import { EstadoCita, Prioridad } from '@/generated/prisma/enums.ts';
import type { DashboardResponseDto } from '@/modules/dashboard/dashboard.dto.ts';

export class DashboardService {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getIndicadores(): Promise<DashboardResponseDto> {
    const where = { activo: true };

    const [totalPacientes, porEstadoRaw, porPrioridadRaw] = await Promise.all([
      this.prisma.paciente.count({ where }),
      this.prisma.paciente.groupBy({ by: ['estadoCita'], where, _count: { _all: true } }),
      this.prisma.paciente.groupBy({ by: ['prioridad'], where, _count: { _all: true } }),
    ]);

    const porEstado = Object.fromEntries(
      Object.values(EstadoCita).map((estado) => [
        estado,
        porEstadoRaw.find((r) => r.estadoCita === estado)?._count._all ?? 0,
      ]),
    ) as Record<EstadoCita, number>;

    const porPrioridad = Object.fromEntries(
      Object.values(Prioridad).map((prioridad) => [
        prioridad,
        porPrioridadRaw.find((r) => r.prioridad === prioridad)?._count._all ?? 0,
      ]),
    ) as Record<Prioridad, number>;

    return { totalPacientes, porEstado, porPrioridad };
  }
}
