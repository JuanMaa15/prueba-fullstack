import type { z } from 'zod';
import type { LoginSchema } from '@/modules/auth/auth.schema.ts';
import type { Rol } from '@/generated/prisma/enums.ts';

export type LoginRequestDto = z.infer<typeof LoginSchema>;

export interface LoginResponseDto {
  token: string;
  user: {
    id: string;
    usuario: string;
    nombre: string;
    rol: Rol;
  };
}
