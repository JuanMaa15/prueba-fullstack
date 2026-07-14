import type { PrismaClient } from '@/generated/prisma/client.ts';
import { Estado } from '@/generated/prisma/enums.ts';
import type {
  CiudadResponseDto,
  EpsResponseDto,
  GeneroResponseDto,
  TipoDocumentoResponseDto,
} from '@/modules/catalogos/catalogo.dto.ts';

export class CatalogoService {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findAllTipoDocumento(): Promise<TipoDocumentoResponseDto[]> {
    const tiposDocumento = await this.prisma.tipoDocumento.findMany({
      where: { estado: Estado.ACTIVO },
      orderBy: { nombre: 'asc' },
    });

    return tiposDocumento.map((tipoDocumento) => ({ id: tipoDocumento.id, nombre: tipoDocumento.nombre }));
  }

  async findAllGenero(): Promise<GeneroResponseDto[]> {
    const generos = await this.prisma.genero.findMany({
      where: { estado: Estado.ACTIVO },
      orderBy: { nombre: 'asc' },
    });

    return generos.map((genero) => ({ id: genero.id, nombre: genero.nombre }));
  }

  async findAllEps(): Promise<EpsResponseDto[]> {
    const epsList = await this.prisma.eps.findMany({ orderBy: { nombre: 'asc' } });

    return epsList.map((eps) => ({ id: eps.id, codigo: eps.codigo, nombre: eps.nombre }));
  }

  async findAllCiudad(): Promise<CiudadResponseDto[]> {
    const ciudades = await this.prisma.ciudad.findMany({ orderBy: { nombre: 'asc' } });

    return ciudades.map((ciudad) => ({ id: ciudad.id, nombre: ciudad.nombre, codigoPostal: ciudad.codigoPostal }));
  }
}
