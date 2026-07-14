import path from 'node:path';
import { readSheet, parseSheetData } from 'read-excel-file/node';
import type { CellValue } from 'read-excel-file/node';
import { prisma } from '@/infrastructure/prisma/client.ts';
import { Estado, EstadoCita, Prioridad } from '@/generated/prisma/enums.ts';

const EXCEL_PATH = path.resolve(
  import.meta.dirname,
  '../../../../Datos_Sinteticos_Prueba_Full_Stack_Junior_2026.xlsx',
);

// El archivo trae 1.000 pacientes. Se limita a una muestra para verificar el import;
// subir este valor (o quitar el slice en seedPacientes) para cargar el archivo completo.
const IMPORT_LIMIT = 10;

// La hoja "Catalogos" del Excel no incluye ciudad; los valores únicos fueron provistos aparte.
const CIUDADES = ['Buga', 'Tuluá', 'Jamundí', 'Yumbo', 'Cartago', 'Palmira', 'Cali'];

const PRIORIDAD_MAP: Record<string, Prioridad> = {
  Alta: Prioridad.ALTA,
  Media: Prioridad.MEDIA,
  Baja: Prioridad.BAJA,
};

const ESTADO_CITA_MAP: Record<string, EstadoCita> = {
  Pendiente: EstadoCita.PENDIENTE,
  'En atención': EstadoCita.EN_ATENCION,
  Atendido: EstadoCita.ATENDIDO,
};

interface CatalogIds {
  epsByCodigo: Map<string, string>;
  tipoDocumentoByNombre: Map<string, string>;
  generoByNombre: Map<string, string>;
  ciudadByNombre: Map<string, string>;
}

const pacienteSchema = {
  tipoDocumento: { column: 'tipo_documento', type: String, required: true },
  documento: { column: 'documento', type: String, required: true },
  nombreCompleto: { column: 'nombre_completo', type: String, required: true },
  fechaNacimiento: { column: 'fecha_nacimiento', type: Date, required: true },
  genero: { column: 'genero', type: String, required: true },
  telefono: { column: 'telefono', type: String, required: true },
  correo: { column: 'correo', type: String, required: true },
  epsCodigo: { column: 'eps_codigo', type: String, required: true },
  ciudad: { column: 'ciudad', type: String, required: true },
  prioridad: { column: 'prioridad', type: String, required: true },
  estado: { column: 'estado', type: String, required: true },
  fechaCreacion: { column: 'fecha_creacion', type: Date, required: true },
  fechaActualizacion: { column: 'fecha_actualizacion', type: Date, required: true },
};

function cellToString(value: CellValue | null): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function requireId(map: Map<string, string>, key: string, catalogo: string): string {
  const id = map.get(key);
  if (!id) {
    throw new Error(`Valor "${key}" no encontrado en el catálogo "${catalogo}"`);
  }
  return id;
}

function requireEnum<T extends string>(map: Record<string, T>, key: string, catalogo: string): T {
  const value = map[key];
  if (!value) {
    throw new Error(`Valor "${key}" no reconocido en "${catalogo}"`);
  }
  return value;
}

// Los catálogos normalizados (eps, tipo_documento, genero, ciudad) se reconstruyen desde cero
// en cada ejecución para que el seed sea idempotente.
async function seedCatalogos(): Promise<CatalogIds> {
  const [, ...catalogoRows] = await readSheet(EXCEL_PATH, 'Catalogos');

  const epsRows = catalogoRows
    .map((row) => ({ codigo: cellToString(row[0]), nombre: cellToString(row[1]) }))
    .filter((eps): eps is { codigo: string; nombre: string } => Boolean(eps.codigo && eps.nombre));

  const tiposDocumento = [
    ...new Set(catalogoRows.map((row) => cellToString(row[9])).filter((v): v is string => Boolean(v))),
  ];
  const generos = [
    ...new Set(catalogoRows.map((row) => cellToString(row[3])).filter((v): v is string => Boolean(v))),
  ];

  await prisma.paciente.deleteMany();
  await prisma.eps.deleteMany();
  await prisma.tipoDocumento.deleteMany();
  await prisma.genero.deleteMany();
  await prisma.ciudad.deleteMany();

  const eps = await Promise.all(
    epsRows.map((row) => prisma.eps.create({ data: { codigo: row.codigo, nombre: row.nombre } })),
  );
  const tiposDocumentoCreados = await Promise.all(
    tiposDocumento.map((nombre) => prisma.tipoDocumento.create({ data: { nombre, estado: Estado.ACTIVO } })),
  );
  const generosCreados = await Promise.all(
    generos.map((nombre) => prisma.genero.create({ data: { nombre, estado: Estado.ACTIVO } })),
  );
  const ciudadesCreadas = await Promise.all(CIUDADES.map((nombre) => prisma.ciudad.create({ data: { nombre } })));

  console.log(
    `Catálogos creados: ${eps.length} EPS, ${tiposDocumentoCreados.length} tipos de documento, ` +
      `${generosCreados.length} géneros, ${ciudadesCreadas.length} ciudades.`,
  );

  return {
    epsByCodigo: new Map(eps.map((e) => [e.codigo, e.id])),
    tipoDocumentoByNombre: new Map(tiposDocumentoCreados.map((t) => [t.nombre, t.id])),
    generoByNombre: new Map(generosCreados.map((g) => [g.nombre, g.id])),
    ciudadByNombre: new Map(ciudadesCreadas.map((c) => [c.nombre, c.id])),
  };
}

async function seedPacientes(catalogos: CatalogIds): Promise<void> {
  const rawPacientes = await readSheet(EXCEL_PATH, 'Pacientes');
  const result = parseSheetData(rawPacientes, pacienteSchema);

  if (result.errors) {
    throw new Error(`Errores al leer la hoja "Pacientes": ${JSON.stringify(result.errors)}`);
  }

  const filas = result.objects.slice(0, IMPORT_LIMIT);

  for (const fila of filas) {
    await prisma.paciente.create({
      data: {
        tipoDocumentoId: requireId(catalogos.tipoDocumentoByNombre, fila.tipoDocumento, 'tipo_documento'),
        numeroDocumento: fila.documento,
        nombreCompleto: fila.nombreCompleto,
        fechaNacimiento: fila.fechaNacimiento,
        generoId: requireId(catalogos.generoByNombre, fila.genero, 'genero'),
        telefono: fila.telefono,
        email: fila.correo,
        epsId: requireId(catalogos.epsByCodigo, fila.epsCodigo, 'eps'),
        ciudadId: requireId(catalogos.ciudadByNombre, fila.ciudad, 'ciudad'),
        prioridad: requireEnum(PRIORIDAD_MAP, fila.prioridad, 'prioridad'),
        estadoCita: requireEnum(ESTADO_CITA_MAP, fila.estado, 'estado'),
        createdAt: fila.fechaCreacion,
        updatedAt: fila.fechaActualizacion,
      },
    });
  }

  console.log(`Se importaron ${filas.length} de ${result.objects.length} pacientes disponibles en el archivo.`);
}

async function main(): Promise<void> {
  const catalogos = await seedCatalogos();
  await seedPacientes(catalogos);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
