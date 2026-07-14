import type { EstadoCita, Prioridad } from '@/generated/prisma/enums.ts';

export interface DashboardResponseDto {
  totalPacientes: number;
  porEstado: Record<EstadoCita, number>;
  porPrioridad: Record<Prioridad, number>;
}
