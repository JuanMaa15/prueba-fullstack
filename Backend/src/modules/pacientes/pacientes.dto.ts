import type { z } from 'zod';
import type { CreateSchema, IdParamSchema, ListQuerySchema, UpdateSchema } from '@/modules/pacientes/pacientes.schema.ts';
import type { EstadoCita, Prioridad } from '@/generated/prisma/enums.ts';

export type CreateRequestDto = z.infer<typeof CreateSchema>;
export type UpdateRequestDto = z.infer<typeof UpdateSchema>;
export type ListQueryDto = z.infer<typeof ListQuerySchema>;
export type IdParamDto = z.infer<typeof IdParamSchema>;

interface CatalogoRefDto {
  id: string;
  nombre: string;
}

export interface PacienteResponseDto {
  id: string;
  numeroDocumento: string;
  nombreCompleto: string;
  fechaNacimiento: Date;
  telefono: string;
  email: string | null;
  prioridad: Prioridad;
  estadoCita: EstadoCita;
  tipoDocumento: CatalogoRefDto;
  genero: CatalogoRefDto;
  eps: CatalogoRefDto & { codigo: string };
  ciudad: CatalogoRefDto;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedResponseDto<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
