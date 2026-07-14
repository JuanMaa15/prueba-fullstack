# Frontend — Dependencias y comandos de instalación

## Dependencias de producción (`dependencies`)

| Paquete | Versión | Uso |
|---|---|---|
| `react` | `^19.2.7` | Librería de UI |
| `react-dom` | `^19.2.7` | Renderizado de React en el DOM |
| `react-router` | `^8.2.0` | Enrutamiento de la aplicación |
| `axios` | `^1.18.1` | Cliente HTTP hacia la API |
| `zod` | `^4.4.3` | Validación de esquemas y tipado de entrada |
| `react-hook-form` | `^7.81.0` | Manejo de formularios |
| `@hookform/resolvers` | `^5.4.0` | Integra Zod como resolver de validación en `react-hook-form` |
| `tailwindcss` | `^4.3.2` | Framework de estilos utility-first |
| `@tailwindcss/vite` | `^4.3.2` | Plugin de Tailwind para Vite |

## Dependencias de desarrollo (`devDependencies`)

| Paquete | Versión | Uso |
|---|---|---|
| `typescript` | `~6.0.2` | Compilador TypeScript |
| `vite` | `^8.1.1` | Bundler / servidor de desarrollo |
| `@vitejs/plugin-react` | `^6.0.3` | Soporte de React (Fast Refresh) en Vite |
| `vitest` | `^4.1.10` | Test runner |
| `jsdom` | `^29.1.1` | Entorno DOM simulado para los tests de Vitest |
| `eslint` | `^10.6.0` | Linter |
| `@eslint/js` | `^10.0.1` | Reglas recomendadas base de ESLint |
| `typescript-eslint` | `^8.62.0` | Integración de ESLint con TypeScript |
| `eslint-plugin-react-hooks` | `^7.1.1` | Reglas de ESLint para hooks de React |
| `eslint-plugin-react-refresh` | `^0.5.3` | Reglas de ESLint para Fast Refresh de Vite |
| `globals` | `^17.7.0` | Definiciones de globals para la config de ESLint |
| `prettier` | `^3.9.5` | Formateador de código |
| `@types/node` | `^24.13.2` | Tipos de Node.js (usado en `vite.config.ts`) |
| `@types/react` | `^19.2.17` | Tipos de React |
| `@types/react-dom` | `^19.2.3` | Tipos de React DOM |

## Comandos ejecutados durante la configuración del entorno

```bash
# Vitest + jsdom (test runner + entorno DOM simulado para componentes React)
npm install -D vitest jsdom
```

## Notas

- `react`, `react-dom`, `react-router`, `axios`, `zod`, `react-hook-form`, `@hookform/resolvers`, `tailwindcss`, `@tailwindcss/vite` y todas las devDependencies de ESLint/Prettier/Vite/TypeScript ya estaban definidas en el `package.json` inicial del proyecto (scaffold de Vite + elecciones previas del stack).
- `tailwindcss` y `@tailwindcss/vite` estaban instalados pero **no conectados**: no se instaló ningún paquete nuevo para activarlos, solo se registró el plugin en `vite.config.ts` y se agregó `@import "tailwindcss";` en `src/index.css`.
- No se instaló ninguna librería de testing de componentes (ej. Testing Library) porque no se pidió explícitamente escribir tests, solo configurar el test runner.
