# Backend — Dependencias y comandos de instalación

## Dependencias de producción (`dependencies`)

| Paquete | Versión | Uso |
|---|---|---|
| `@prisma/client` | `^7.8.0` | Cliente generado de Prisma para consultas a la base de datos |
| `@prisma/adapter-pg` | `^7.8.0` | Adaptador de Prisma para conexión directa con PostgreSQL (`pg`) |
| `bcrypt` | `^6.0.0` | Hash y verificación de contraseñas |
| `cors` | `^2.8.6` | Middleware de CORS para Express |
| `express` | `^5.2.1` | Framework del servidor HTTP |
| `express-rate-limit` | `^8.5.2` | Limitador de peticiones (rate limiting) |
| `helmet` | `^8.3.0` | Cabeceras de seguridad HTTP |
| `jsonwebtoken` | `^9.0.3` | Firma y verificación de JWT |
| `zod` | `^4.4.3` | Validación de esquemas y tipado de entrada |

## Dependencias de desarrollo (`devDependencies`)

| Paquete | Versión | Uso |
|---|---|---|
| `typescript` | `<6.1` | Compilador TypeScript (fijado por debajo de 6.1 por compatibilidad con `typescript-eslint`, ver Notas) |
| `tsx` | `^4.23.1` | Ejecuta TypeScript nativo en desarrollo (`dev`, `db:seed`) y resuelve el alias `@` en runtime |
| `prisma` | `^7.8.0` | CLI de Prisma (`generate`, `migrate`, seed) |
| `eslint` | `^10.7.0` | Linter |
| `@eslint/js` | `^10.0.1` | Reglas recomendadas base de ESLint |
| `typescript-eslint` | `^8.64.0` | Integración de ESLint con TypeScript |
| `vitest` | `^4.1.10` | Test runner |
| `husky` | `^9.1.7` | Git hooks (ver Notas — actualmente inactivo en este subproyecto) |
| `@types/node` | `^26.1.1` | Tipos de Node.js |
| `@types/express` | `^5.0.6` | Tipos de Express |
| `@types/cors` | `^2.8.19` | Tipos de `cors` |
| `@types/bcrypt` | `^6.0.0` | Tipos de `bcrypt` |
| `@types/jsonwebtoken` | `^9.0.10` | Tipos de `jsonwebtoken` |
| `read-excel-file` | `^9.3.1` | Lectura de archivos Excel |

## Comandos ejecutados durante la configuración del entorno

```bash
# ESLint + typescript-eslint + Vitest
# (primer intento falló por conflicto de peer dependency: typescript-eslint
#  solo soporta typescript >=4.8.4 <6.1.0, y el proyecto tenía typescript ^7.0.2)
npm install -D eslint @eslint/js typescript-eslint vitest

# Segundo intento: se degrada typescript por debajo de 6.1 para resolver el conflicto
npm install -D "typescript@<6.1" eslint @eslint/js typescript-eslint vitest

# tsx: necesario para que "dev" y "db:seed" resuelvan el alias "@/*" en runtime
npm install -D tsx

# Husky: git hooks (commit-msg)
npm install -D husky
```

## Notas

- `@prisma/client`, `@prisma/adapter-pg`, `bcrypt`, `cors`, `express`, `express-rate-limit`, `helmet`, `jsonwebtoken`, `zod`, los `@types/*`, `prisma` y `read-excel-file` ya estaban definidos en el `package.json` inicial del proyecto (no se instalaron en esta sesión de configuración).
- `typescript` se bajó de `^7.0.2` a `<6.1` porque `typescript-eslint@8.x` no soporta TS 7 todavía. Como el proyecto usa `noEmit: true` (TS solo para tipado/editor, Node ejecuta el código vía `tsx`), esto no afecta el runtime.
- `husky` está instalado aquí, pero el hook activo del monorepo vive en la **raíz del repositorio** (`Goecosyste/Backend/.husky`), no en esta carpeta — git solo permite un `core.hooksPath` activo. Este `husky`/`.husky` local quedó instalado pero inactivo a petición explícita.
