import jwt from 'jsonwebtoken';
import type { PrismaClient } from '@/generated/prisma/client.ts';
import { Estado } from '@/generated/prisma/enums.ts';
import { env } from '@/common/config/env.ts';
import { UnauthorizedError } from '@/common/errors/appError.ts';
import type { AuthTokenPayload } from '@/common/interfaces/authTokenPayload.interface.ts';
import type { LoginRequestDto, LoginResponseDto } from '@/modules/auth/auth.dto.ts';

export class AuthService {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async login(data: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.prisma.user.findUnique({ where: { usuario: data.usuario } });

    if (!user || user.estado !== Estado.ACTIVO) {
      throw new UnauthorizedError('Usuario o contraseña incorrectos');
    }

    // Comparación en texto plano a petición explícita: los usuarios se importan
    // desde una fuente externa que no provee la contraseña hasheada.
    if (data.password !== user.password) {
      throw new UnauthorizedError('Usuario o contraseña incorrectos');
    }

    const payload: AuthTokenPayload = { id: user.id, usuario: user.usuario, rol: user.rol };
    const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });

    return {
      token,
      user: { ...payload, nombre: user.nombre },
    };
  }
}
