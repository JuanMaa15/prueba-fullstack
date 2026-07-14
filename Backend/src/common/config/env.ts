const NODE_ENV = process.env.NODE_ENV ?? 'development';

const DATABASE_URL =
  NODE_ENV === 'development'
    ? process.env.DATABASE_URL_LOCAL
    : process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error(
    `No se encontro una URL de base de datos para NODE_ENV="${NODE_ENV}". Verifica DATABASE_URL_LOCAL (development) o DATABASE_URL (otros entornos) en el archivo .env`,
  );
}

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET no esta definida en las variables de entorno');
}

const jwtExpiresInRaw = process.env.JWT_EXPIRES_IN ?? '3600';
// Si es un número puro se interpreta como segundos; si no (ej. "7d", "1h"),
// se deja como string para que jsonwebtoken lo interprete con su propio parser (librería `ms`).
const JWT_EXPIRES_IN: number | string = /^\d+$/.test(jwtExpiresInRaw) ? Number(jwtExpiresInRaw) : jwtExpiresInRaw;

export const env = {
  NODE_ENV,
  PORT: process.env.PORT ?? '3000',
  DATABASE_URL,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  CORS_ORIGIN: (process.env.CORS_ORIGIN ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0),
  RATE_LIMIT_WINDOW_MS: Number(process.env.RATE_LIMIT_WINDOW_MS ?? '900000'),
  RATE_LIMIT_MAX: Number(process.env.RATE_LIMIT_MAX ?? '100'),
  LOGIN_RATE_LIMIT_WINDOW_MS: Number(process.env.LOGIN_RATE_LIMIT_WINDOW_MS ?? '900000'),
  LOGIN_RATE_LIMIT_MAX: Number(process.env.LOGIN_RATE_LIMIT_MAX ?? '5'),
};
