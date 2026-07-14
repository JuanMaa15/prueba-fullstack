import { defineConfig } from "prisma/config";
import { env } from "./src/common/config/env.ts";

export default defineConfig({
  schema: "src/infrastructure/prisma/schema.prisma",
  migrations: {
    path: "src/infrastructure/prisma/migrations",
    seed: "tsx --env-file=.env src/infrastructure/prisma/seed.ts",
  },
  datasource: {
    url: env.DATABASE_URL,
  },
});
