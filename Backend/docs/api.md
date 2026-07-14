# API — Documentación de rutas

Base URL: `/api/v1`

## Convenciones generales

### Autenticación

Todas las rutas salvo `POST /auth/login` requieren el header:

```
Authorization: Bearer <token>
```

El token se obtiene en `POST /auth/login` y expira según `JWT_EXPIRES_IN` (segundos, definido en `.env`).

### Roles

| Rol | Descripción |
|---|---|
| `ADMIN` | Responsable del servicio. Acceso completo a `/patients` + `/dashboard` + eliminar pacientes. |
| `OPERADOR` | Personal asistencial. Puede consultar, crear y actualizar pacientes. No puede eliminar ni ver el dashboard. |

### Formato de respuesta — éxito (200, 201)

```json
{
  "status": "success",
  "message": "string",
  "code": 200,
  "data": {}
}
```

`204` no devuelve body.

### Formato de respuesta — error (400, 401, 403, 404, 409, 429, 500)

```json
{
  "status": "error",
  "message": "string",
  "code": 400
}
```

Si el error es de validación de Zod, se agrega `errors`:

```json
{
  "status": "error",
  "message": "Error de validación",
  "code": 400,
  "errors": [
    { "file": "usuario", "message": "El usuario es requerido" }
  ]
}
```

---

## Auth

### `POST /api/v1/auth/login`

Sin autenticación. Sujeto a rate limit estricto (`LOGIN_RATE_LIMIT_MAX` intentos por `LOGIN_RATE_LIMIT_WINDOW_MS`, configurable en `.env`).

**Body**

| Campo | Tipo | Requerido | Notas |
|---|---|---|---|
| `usuario` | string | Sí | |
| `password` | string | Sí | Comparación en texto plano (ver nota en `auth.service.ts`) |

**Respuesta 200**

```json
{
  "status": "success",
  "message": "Inicio de sesión exitoso",
  "code": 200,
  "data": {
    "token": "eyJhbGciOi...",
    "user": {
      "id": "uuid",
      "usuario": "admin.demo",
      "nombre": "Administrador Demo",
      "rol": "ADMIN"
    }
  }
}
```

**Errores**
- `400` — body inválido (falta `usuario` o `password`).
- `401` — credenciales incorrectas o usuario inactivo (mismo mensaje genérico para evitar enumeración de usuarios).
- `429` — demasiados intentos.

---

### `POST /api/v1/auth/logout`

Requiere `Authorization: Bearer <token>` válido. Sin body. Logout stateless: el servidor no invalida el token (ver decisión registrada), solo confirma el cierre de sesión.

**Respuesta 200**

```json
{
  "status": "success",
  "message": "Sesión cerrada",
  "code": 200,
  "data": {}
}
```

**Errores**
- `401` — token ausente, inválido o expirado.

---

## Pacientes

Todas las rutas requieren `Authorization: Bearer <token>` con rol `ADMIN` u `OPERADOR`, salvo `DELETE` que exige `ADMIN`.

### `GET /api/v1/patients`

Lista paginada con búsqueda y filtros.

**Query params**

| Parámetro | Tipo | Requerido | Notas |
|---|---|---|---|
| `search` | string | No | Busca coincidencia parcial (insensible a mayúsculas) en `nombreCompleto` **o** `numeroDocumento`. |
| `estado` | `PENDIENTE` \| `EN_ATENCION` \| `ATENDIDO` | No | |
| `prioridad` | `ALTA` \| `MEDIA` \| `BAJA` | No | |
| `page` | number | No | Default `1`. |
| `limit` | number | No | Default `20`, máximo `100`. |

**Respuesta 200**

```json
{
  "status": "success",
  "message": "Pacientes obtenidos correctamente",
  "code": 200,
  "data": {
    "items": [
      {
        "id": "uuid",
        "numeroDocumento": "339402725",
        "nombreCompleto": "Catalina Sara Vargas Restrepo",
        "fechaNacimiento": "1946-09-06T00:00:00.000Z",
        "telefono": "3142433976",
        "email": "catalina.vargas2@example.test",
        "prioridad": "BAJA",
        "estadoCita": "EN_ATENCION",
        "tipoDocumento": { "id": "uuid", "nombre": "CC" },
        "genero": { "id": "uuid", "nombre": "Femenino" },
        "eps": { "id": "uuid", "nombre": "Famisanar", "codigo": "EPS008" },
        "ciudad": { "id": "uuid", "nombre": "Tuluá" },
        "createdAt": "2026-06-14T07:34:00.000Z",
        "updatedAt": "2026-06-26T03:40:59.999Z"
      }
    ],
    "page": 1,
    "limit": 20,
    "total": 1000,
    "totalPages": 50
  }
}
```

**Errores**
- `400` — query inválida (ej. `page` no numérico, `estado`/`prioridad` fuera del enum).
- `401` / `403` — sin token o rol no autorizado.

---

### `GET /api/v1/patients/:id`

**Path params:** `id` (uuid).

**Respuesta 200** — mismo shape que un elemento de `items` en el listado.

**Errores**
- `400` — `id` no es un uuid válido.
- `404` — no existe o está eliminado (soft delete).

---

### `POST /api/v1/patients`

**Body**

| Campo | Tipo | Requerido | Notas |
|---|---|---|---|
| `tipoDocumentoId` | uuid | Sí | Debe existir en el catálogo `tipo_documento`. |
| `numeroDocumento` | string | Sí | |
| `nombreCompleto` | string | Sí | |
| `fechaNacimiento` | date (ISO) | Sí | No puede ser posterior a hoy. |
| `generoId` | uuid | Sí | Debe existir en el catálogo `genero`. |
| `telefono` | string | Condicional | Al menos uno de `telefono` / `email` es obligatorio. |
| `email` | string (email) | Condicional | Al menos uno de `telefono` / `email` es obligatorio. |
| `epsId` | uuid | Sí | Debe existir en el catálogo `eps`. |
| `ciudadId` | uuid | Sí | Debe existir en el catálogo `ciudad`. |
| `prioridad` | `ALTA` \| `MEDIA` \| `BAJA` | Sí | |
| `estadoCita` | `PENDIENTE` \| `EN_ATENCION` \| `ATENDIDO` | No | Default `PENDIENTE`. |

**Respuesta 201** — mismo shape que `GET /patients/:id`, con `code: 201`.

**Errores**
- `400` — validación de Zod (campo faltante/formato inválido, o ni `telefono` ni `email`), o alguna FK (`tipoDocumentoId`, `generoId`, `epsId`, `ciudadId`) no existe en su catálogo.

---

### `PATCH /api/v1/patients/:id`

Actualización parcial: se puede enviar cualquier subconjunto de los campos de creación (por ejemplo, solo `estadoCita` y/o `prioridad` para reflejar un cambio de situación del paciente).

**Path params:** `id` (uuid).

**Body** — mismos campos que `POST /patients`, todos opcionales. `telefono` y `email` aceptan `null` explícito para limpiarlos, pero el resultado final (lo enviado + lo que ya existía en el registro) debe conservar al menos uno de los dos.

**Respuesta 200** — mismo shape que `GET /patients/:id`.

**Errores**
- `400` — validación de Zod, FK inexistente, o la combinación final de `telefono`/`email` queda vacía.
- `404` — el paciente no existe o está eliminado.

---

### `DELETE /api/v1/patients/:id`

Solo `ADMIN`. Soft delete: marca `activo = false`, no borra la fila. El registro deja de aparecer en `GET /patients` y `GET /patients/:id`.

**Path params:** `id` (uuid).

**Respuesta 200**

```json
{
  "status": "success",
  "message": "Paciente eliminado correctamente",
  "code": 200,
  "data": {}
}
```

**Errores**
- `401` — sin token.
- `403` — rol `OPERADOR` (no autorizado para eliminar).
- `404` — el paciente no existe o ya estaba eliminado.

---

## Pendiente

- `GET /api/v1/dashboard` — indicadores para `ADMIN` (volumen total, distribución por estado y prioridad). Aún no implementado.
