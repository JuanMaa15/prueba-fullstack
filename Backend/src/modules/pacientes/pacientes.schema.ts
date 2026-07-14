import { z } from 'zod';
import { EstadoCita, Prioridad } from '@/generated/prisma/enums.ts';

const uuidSchema = z.uuid('Debe ser un UUID válido');

export const IdParamSchema = z.object({
  id: uuidSchema,
});

export const CreateSchema = z.object({
  tipoDocumentoId: uuidSchema,
  numeroDocumento: z.string().min(1, 'El número de documento es requerido'),
  nombreCompleto: z.string().min(1, 'El nombre completo es requerido'),
  fechaNacimiento: z.coerce.date().max(new Date(), 'La fecha de nacimiento no puede ser posterior a hoy'),
  generoId: uuidSchema,
  telefono: z.string().min(1, 'El teléfono es requerido'),
  email: z.email('Debe ser un correo válido').optional(),
  epsId: uuidSchema,
  ciudadId: uuidSchema,
  prioridad: z.enum(Prioridad),
  estadoCita: z.enum(EstadoCita).optional(),
});

export const UpdateSchema = z
  .object({
    tipoDocumentoId: uuidSchema,
    numeroDocumento: z.string().min(1, 'El número de documento es requerido'),
    nombreCompleto: z.string().min(1, 'El nombre completo es requerido'),
    fechaNacimiento: z.coerce.date().max(new Date(), 'La fecha de nacimiento no puede ser posterior a hoy'),
    generoId: uuidSchema,
    telefono: z.string().min(1, 'El teléfono es requerido'),
    email: z.email('Debe ser un correo válido').nullable(),
    epsId: uuidSchema,
    ciudadId: uuidSchema,
    prioridad: z.enum(Prioridad),
    estadoCita: z.enum(EstadoCita),
  })
  .partial();

export const ListQuerySchema = z.object({
  search: z.string().min(1).optional(),
  estado: z.enum(EstadoCita).optional(),
  prioridad: z.enum(Prioridad).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
