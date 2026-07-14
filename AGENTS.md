# Goecosystem
Monorepo


## ==================================  API BACKEND  =================================




## Stack 
- Lenguaje: TypeScript estricto 
- Framework / runtime: Express, Nodejs 
- Base de datos: PostgreSQL con el ORM Prisma > 7
- Tests: Vitest
- Linter: ESlint
- Validaciones: Zod

## Comandos
- `npm run dev`  - Ejecutar el servidor local
- `npm run test` - Ejecutar test de prueba
- `npm run lint` - Ejecutar linter
- `npm run db: generate`: - Ejecutar y generar el cliente prisma
- `npm run db: migrate`: - Crea la BD (si no existe) y aplica todas las migraciones
- `npm run db:seed` - Carga de datos por defecto

## Estructura del proyecto 
`src/`:
- `modules/` — Cada uno de los modulos de dominio ( route, controller, service, schema (validación con zod), dto (Con inferencia de los esquemas zod) , index -> (inyeccion de dependencias manual) ) 
- `module/index` - centralizar rutas principales de los recursoo - ej /usuarios, userRouter
- `infrastructure/` — Configuracion de la base  de datos y prisma ( esquema prisma, migraciones ) 
- `common/` — Funciones compartidas ( middlewares, errors (manejo de errores), funciones generales, global namespaces )
-`src/app.ts` - Inicio servidor express


## Arquitectura
- Arquitectura modular por capas con POO e inyección de dependencias manual
- Inyeccion de dependencias manual: 
  - Cliente prisma se inyecta en service
  - Servicio se inyecta en controlador

  Nota: En caso de manejar tambien con la capa repository seria:
    - Cliente prisma se inyecta a repository
    - repository se inyecta a service

  - Principios de codigo limpio: SOLID, DRY - no repetir, KISS evitar complicaciones, YAGNI evitar sobreingenieria
 
# Convenciones 
- Variables, atributos y metodos con camelCase
- Clases con PascalCase
- Nombres de archivo: Ej: nombreArchivo.controller.ts
- Estructura commits:  type(categoria): mensaje < 100 caracteres
-  Manejo de errores src/common/errors -> 400, 401, 403, 404, 409, 500
- Validar toda entrada del usuario antes de 
usarla.
- Crear interfaces para los objetos (ej: payload { email: string, name: string, code: int })

## Reglas
- No subir ni leer el .env
- No usar any a no ser estrictamente necesario
- No generar test salvo a petición explicita

# Flujo de trabajo -
- Antes de una tarea no trivial, propón un plan y espera mi OK. 
- Una tarea a la vez; al terminar, dime qué cambiaste para que lo 
revise. 
- Si no estás seguro al 80%, pregunta. No inventes.

## Estructura de respuestas

- Errores (400, 401, 403, 404, 409, 500):
{
  status: 'error'
  message: ''
  code: 
}

  En caso de ser una validacion de error de zod:
  {
    status: 'error'
    message: ''
    code: 
    errors: ´[{ file: '', message '' }]
  }

- Exitosas (200, 201)
{
  status: 'success'
  message: ''
  code: 
  data: {}
}

  El 204 no devuelve nada


## Documentación

 Mas convenciones puntuales:

- Nombrar dto ej:  CreateRequestDto, CreateResponseDto, GetParamDto
- Nombrar esquemas ej: CreateSchema, UpdateSchema

(Los dto estan en un archivo aparte pero pueden inferir de los schemas de zod)





## ========================================================================================



## ==================================== FRONTEND ==========================================


## Stack 
- Lenguaje: TypeScript estricto 
- Framework / runtime: React, Vite 
- Estilos: Tailwindcss
- test: Vitest
- Linter: ESlint
- Validaciones: Zod

## Comandos
- `npm run dev`  - Ejecutar el servidor local
- `npm run test` - Ejecutar test de prueba
- `npm run lint` - Ejecutar linter

## Estructura del proyecto 
`src/`:
- `components/` — Componentes reutilizables (botones, links, cards, etc) 
- `pages/` — Cada una de las secciones que va a tener la interfaz ( pageLogin, pageUsurios, etc )
- `hooks/` — Estados personalizados
- `services/` — Manejo de peticiones HTTP  y conexion a la API
- `routes/` - Rutas de navegacion por la app

## Arquitectura
  - Principios de codigo limpio: SOLID, DRY - no repetir, KISS evitar complicaciones, YAGNI evitar sobreingenieria
 
# Convenciones 
- Variables, atributos y metodos con camelCase
- Estructura commits:  type(categoria): mensaje < 100 caracteres
- Crear interfaces para los objetos (ej: payload { email: string, name: string, code: int })

## Reglas
- No subir ni leer el .env
- No usar any a no ser estrictamente necesario

# Flujo de trabajo -
- Antes de una tarea no trivial, propón un plan y espera mi OK. 
- Una tarea a la vez; al terminar, dime qué cambiaste para que lo 
revise. 
- Si no estás seguro al 80%, pregunta. No inventes.

## Estructura de respuestas del back

- Errores (400, 401, 403, 404, 409, 500):
{
  status: 'error'
  message: ''
  code: 
}

  En caso de ser una validacion de error de zod:
  {
    status: 'error'
    message: ''
    code: 
    errors: { file: '', message '' }
  }

- Exitosas (200, 201)
{
  status: 'success'
  message: ''
  code: 
  data: {}
}

  El 204 no devuelve nada


## Documentación