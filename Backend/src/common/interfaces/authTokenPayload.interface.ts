import type { Rol } from '@/generated/prisma/enums.ts';

export interface AuthTokenPayload {
  id: string;
  usuario: string;
  rol: Rol;
}
