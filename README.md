# GoEcosystem — Gestión de Pacientes (Prueba Técnica Full Stack)

Módulo para que el personal de una clínica administre pacientes en espera de atención: buscarlos, registrarlos, actualizar su estado/prioridad y ver indicadores generales del servicio.

Monorepo con dos proyectos independientes:

- **`Backend/`** — API REST (Node.js, Express, TypeScript, Prisma, PostgreSQL).
- **`Frontend/`** — Interfaz web (React, Vite, TypeScript, Tailwind CSS).

## Requisitos previos

- Node.js 20 o superior
- PostgreSQL 14 o superior, corriendo localmente (o accesible por URL)
- npm

## Estructura del repositorio

```
├── Backend/                                                  API REST
├── Frontend/                                                 Interfaz web
├── Datos_Sinteticos_Prueba_Full_Stack_Junior_2026.xlsx        Datos sintéticos suministrados (pacientes, catálogos, usuarios demo)
└── AGENTS.md                                                 Convenciones de arquitectura y código del proyecto
```

## Instalación

### 1. Backend

```bash
cd Backend
npm install
cp .env.example .env
```

Completar `.env` con, como mínimo:

| Variable | Descripción |
|---|---|
| `DATABASE_URL_LOCAL` | Cadena de conexión a PostgreSQL para desarrollo, ej: `postgresql://usuario:password@localhost:5432/goecosystem?schema=public` |
| `JWT_SECRET` | Cualquier string secreto para firmar los tokens |
| `JWT_EXPIRES_IN` | Duración del token, ej: `7d` o `3600` (segundos) |
| `CORS_ORIGIN` | Origen permitido del frontend, ej: `http://localhost:5173` |

El resto de variables (`PORT`, `RATE_LIMIT_*`, `LOGIN_RATE_LIMIT_*`) tienen valores por defecto razonables en el propio código si se dejan vacías, pero `.env.example` documenta cómo completarlas.

La base de datos (`goecosystem` en el ejemplo) debe existir antes de migrar; créala con tu cliente de PostgreSQL de preferencia (`createdb`, pgAdmin, etc.).

### 2. Frontend

```bash
cd Frontend
npm install
cp .env.example .env
```

`VITE_API_URL` ya viene apuntando a `http://localhost:3000`, que es el puerto por defecto del backend.

## Ejecución

### Backend

```bash
cd Backend
npm run db:migrate   # crea las tablas (aplica las migraciones de Prisma)
npm run db:seed      # carga catálogos, los 1.000 pacientes del Excel y los usuarios demo
npm run dev           # http://localhost:3000
```

`db:seed` es idempotente: los catálogos (EPS, tipo de documento, género, ciudad) se reconstruyen en cada corrida y los usuarios se actualizan por `upsert` sin borrar los que hayas creado a mano.

### Frontend

```bash
cd Frontend
npm run dev            # http://localhost:5173
```

Con el backend corriendo en `:3000`, abrir `http://localhost:5173` e iniciar sesión.

## Credenciales demo

Vienen precargadas por `npm run db:seed` desde la hoja `Usuarios_Login` del Excel suministrado:

| Usuario | Contraseña | Rol |
|---|---|---|
| `admin.demo` | `Demo2026*` | `ADMIN` — pacientes + dashboard de indicadores + eliminar pacientes |
| `operador.demo` | `Demo2026*` | `OPERADOR` — consultar, crear y actualizar pacientes |

## API

Documentación completa de rutas, request/response y códigos de error en [`Backend/docs/api.md`](Backend/docs/api.md).

Rutas principales (prefijo `/api/v1`):

```
POST   /auth/login
POST   /auth/logout
GET    /patients            búsqueda por nombre/documento, filtros por estado y prioridad, paginación
GET    /patients/:id
POST   /patients
PATCH  /patients/:id
DELETE /patients/:id        solo ADMIN, soft delete
GET    /dashboard           solo ADMIN
GET    /catalogos/*         tipo-documentos, generos, eps, ciudades (para selects del formulario)
```

## Modelo de datos

Definido en [`Backend/src/infrastructure/prisma/schema.prisma`](Backend/src/infrastructure/prisma/schema.prisma) y versionado con migraciones en `Backend/src/infrastructure/prisma/migrations/`.

- **`pacientes`** — entidad central. Referencia por FK a `tipo_documento`, `genero`, `eps` y `ciudad` (catálogos normalizados). `prioridad` y `estado_cita` se guardan como enum directamente en la tabla (no se normalizaron a catálogo aparte, porque no tiene sentido operativo separarlos: son valores fijos del dominio, no datos administrables). `numero_documento` es único; `activo` implementa borrado lógico.
- **`tipo_documento`**, **`genero`** — catálogos con bandera `estado` (`ACTIVO`/`INACTIVO`) para poder desactivar un valor sin borrarlo.
- **`eps`** — catálogo de EPS (`codigo` + `nombre`).
- **`ciudad`** — catálogo de ciudades.
- **`users`** — usuarios del sistema (`usuario` único, `rol`: `ADMIN`/`OPERADOR`, `estado`: `ACTIVO`/`INACTIVO`).

Todas las tablas con datos administrables tienen `created_at`/`updated_at`. Los IDs son UUID.

## Decisiones técnicas

- **Arquitectura modular por capas** con inyección de dependencias manual: `route → controller → service → Prisma`, cada módulo de dominio (`auth`, `pacientes`, `dashboard`, `catalogos`) con su `schema` (Zod), `dto`, `service`, `controller`, `route` e `index` (wiring). Detalle completo en `AGENTS.md`.
- **Autenticación JWT stateless.** `POST /auth/logout` no invalida el token en el servidor (no hay tabla de sesiones/blacklist); el cliente simplemente descarta el token. Se eligió así por simplicidad, dado el tiempo disponible y que no era un requisito explícito de la prueba.
- **Contraseñas en texto plano.** Decisión explícita: los usuarios se cargan desde el Excel suministrado (`Usuarios_Login`), que trae la contraseña de demostración en texto plano y no un hash. No apto para producción real — ver limitaciones.
- **`numeroDocumento` único** y **`telefono` obligatorio** a nivel de base de datos y de validación, siguiendo la regla mínima del enunciado oficial de la prueba.
- **Borrado lógico (soft delete) de pacientes** vía el campo `activo`: `DELETE /patients/:id` no borra la fila, la marca inactiva. El registro deja de aparecer en listados y búsquedas.
- **Paginación** (`page`/`limit`) en `GET /patients`, dado el volumen (1.000 pacientes sintéticos).
- **Import de datos** vía script de seed (`Backend/src/infrastructure/prisma/seed.ts`) que lee directamente el `.xlsx` suministrado con `read-excel-file`, en vez de convertirlo a JSON/CSV a mano.
- **Roles**: `ADMIN` tiene todo lo que tiene `OPERADOR` más `DELETE /patients/:id` y `GET /dashboard` (el rol superior no queda con menos permisos que el inferior).

## Limitaciones conocidas

- No hay pruebas automatizadas (no se pidieron explícitamente durante el desarrollo y el tiempo se priorizó en funcionalidad).
- Contraseñas en texto plano — requeriría hash (bcrypt, ya está como dependencia) antes de cualquier uso real.
- Logout no invalida el token del lado del servidor (JWT stateless); el token sigue siendo válido hasta que expira por tiempo aunque el usuario cierre sesión.
- No hay recuperación de contraseña ni gestión de usuarios vía API (los usuarios se administran solo por el seed).
- La búsqueda de pacientes en el frontend dispara una petición por cada tecla escrita (sin debounce); funcional pero no optimizada para tráfico alto.
- Sin manejo de concurrencia optimista: si dos personas editan el mismo paciente a la vez, gana el último `PATCH` en llegar.

## Documentación adicional

- [`Backend/docs/api.md`](Backend/docs/api.md) — rutas, request/response y errores en detalle.
- [`Backend/docs/dependencies.md`](Backend/docs/dependencies.md) — dependencias instaladas y por qué.
- [`AGENTS.md`](AGENTS.md) — convenciones de arquitectura, nombres y estructura del proyecto.
