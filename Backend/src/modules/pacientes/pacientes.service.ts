import { Prisma, type PrismaClient } from '@/generated/prisma/client.ts';
import { BadRequestError, ConflictError, NotFoundError } from '@/common/errors/appError.ts';
import type { EstadoCita, Prioridad } from '@/generated/prisma/enums.ts';
import type {
  CreateRequestDto,
  ListQueryDto,
  PacienteResponseDto,
  PaginatedResponseDto,
  UpdateRequestDto,
} from '@/modules/pacientes/pacientes.dto.ts';

const PACIENTE_INCLUDE = {
  tipoDocumento: true,
  genero: true,
  eps: true,
  ciudad: true,
} as const;

interface PacienteWithRelations {
  id: string;
  numeroDocumento: string;
  nombreCompleto: string;
  fechaNacimiento: Date;
  telefono: string;
  email: string | null;
  prioridad: Prioridad;
  estadoCita: EstadoCita;
  createdAt: Date;
  updatedAt: Date;
  tipoDocumento: { id: string; nombre: string };
  genero: { id: string; nombre: string };
  eps: { id: string; nombre: string; codigo: string };
  ciudad: { id: string; nombre: string };
}

type CatalogoModel = 'tipoDocumento' | 'genero' | 'eps' | 'ciudad';

interface CatalogIdsInput {
  tipoDocumentoId?: string;
  generoId?: string;
  epsId?: string;
  ciudadId?: string;
}

export class PacienteService {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async list(query: ListQueryDto): Promise<PaginatedResponseDto<PacienteResponseDto>> {
    const where = {
      activo: true,
      ...(query.estado ? { estadoCita: query.estado } : {}),
      ...(query.prioridad ? { prioridad: query.prioridad } : {}),
      ...(query.search
        ? {
            OR: [
              { nombreCompleto: { contains: query.search, mode: 'insensitive' as const } },
              { numeroDocumento: { contains: query.search, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.paciente.findMany({
        where,
        include: PACIENTE_INCLUDE,
        orderBy: { createdAt: 'desc' },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      this.prisma.paciente.count({ where }),
    ]);

    return {
      items: items.map(toPacienteResponseDto),
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    };
  }

  async getById(id: string): Promise<PacienteResponseDto> {
    const paciente = await this.prisma.paciente.findFirst({
      where: { id, activo: true },
      include: PACIENTE_INCLUDE,
    });

    if (!paciente) {
      throw new NotFoundError('Paciente no encontrado');
    }

    return toPacienteResponseDto(paciente);
  }

  async create(data: CreateRequestDto): Promise<PacienteResponseDto> {
    await this.ensureCatalogsExist(data);

    const paciente = await this.withUniqueDocumentoCheck(() =>
      this.prisma.paciente.create({ data, include: PACIENTE_INCLUDE }),
    );

    return toPacienteResponseDto(paciente);
  }

  async update(id: string, data: UpdateRequestDto): Promise<PacienteResponseDto> {
    const existing = await this.prisma.paciente.findFirst({ where: { id, activo: true } });

    if (!existing) {
      throw new NotFoundError('Paciente no encontrado');
    }

    await this.ensureCatalogsExist(data);

    const paciente = await this.withUniqueDocumentoCheck(() =>
      this.prisma.paciente.update({ where: { id }, data, include: PACIENTE_INCLUDE }),
    );

    return toPacienteResponseDto(paciente);
  }

  // El número de documento es único a nivel de BD; se traduce la violación de esa
  // constraint (P2002) a un 409 en vez de dejar que se filtre como error 500.
  private async withUniqueDocumentoCheck<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictError('El número de documento ya está registrado');
      }
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    const existing = await this.prisma.paciente.findFirst({ where: { id, activo: true } });

    if (!existing) {
      throw new NotFoundError('Paciente no encontrado');
    }

    await this.prisma.paciente.update({ where: { id }, data: { activo: false } });
  }

  private async ensureCatalogsExist(data: CatalogIdsInput): Promise<void> {
    const checks: Promise<void>[] = [];

    if (data.tipoDocumentoId) {
      checks.push(this.assertCatalogExists('tipoDocumento', data.tipoDocumentoId, 'tipo de documento'));
    }
    if (data.generoId) {
      checks.push(this.assertCatalogExists('genero', data.generoId, 'género'));
    }
    if (data.epsId) {
      checks.push(this.assertCatalogExists('eps', data.epsId, 'EPS'));
    }
    if (data.ciudadId) {
      checks.push(this.assertCatalogExists('ciudad', data.ciudadId, 'ciudad'));
    }

    await Promise.all(checks);
  }

  private async assertCatalogExists(model: CatalogoModel, id: string, label: string): Promise<void> {
    const record = await this.findCatalogById(model, id);
    if (!record) {
      throw new BadRequestError(`El ${label} indicado no existe`);
    }
  }

  // Dispatch explícito por modelo: indexar this.prisma[model] dinámicamente no compila,
  // porque cada delegate de Prisma tiene un `findUnique` con un `where` distinto y TS no
  // puede invocar un método a través de una unión de firmas incompatibles entre sí.
  private findCatalogById(model: CatalogoModel, id: string) {
    switch (model) {
      case 'tipoDocumento':
        return this.prisma.tipoDocumento.findUnique({ where: { id } });
      case 'genero':
        return this.prisma.genero.findUnique({ where: { id } });
      case 'eps':
        return this.prisma.eps.findUnique({ where: { id } });
      case 'ciudad':
        return this.prisma.ciudad.findUnique({ where: { id } });
    }
  }
}

function toPacienteResponseDto(paciente: PacienteWithRelations): PacienteResponseDto {
  return {
    id: paciente.id,
    numeroDocumento: paciente.numeroDocumento,
    nombreCompleto: paciente.nombreCompleto,
    fechaNacimiento: paciente.fechaNacimiento,
    telefono: paciente.telefono,
    email: paciente.email,
    prioridad: paciente.prioridad,
    estadoCita: paciente.estadoCita,
    tipoDocumento: { id: paciente.tipoDocumento.id, nombre: paciente.tipoDocumento.nombre },
    genero: { id: paciente.genero.id, nombre: paciente.genero.nombre },
    eps: { id: paciente.eps.id, nombre: paciente.eps.nombre, codigo: paciente.eps.codigo },
    ciudad: { id: paciente.ciudad.id, nombre: paciente.ciudad.nombre },
    createdAt: paciente.createdAt,
    updatedAt: paciente.updatedAt,
  };
}
