-- CreateEnum
CREATE TYPE "Estado" AS ENUM ('ACTIVO', 'INACTIVO');

-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('ADMIN', 'OPERADOR');

-- CreateEnum
CREATE TYPE "Prioridad" AS ENUM ('ALTA', 'MEDIA', 'BAJA');

-- CreateEnum
CREATE TYPE "EstadoCita" AS ENUM ('PENDIENTE', 'EN_ATENCION', 'ATENDIDO');

-- CreateTable
CREATE TABLE "eps" (
    "id" UUID NOT NULL,
    "codigo" VARCHAR NOT NULL,
    "nombre" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "eps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipo_documento" (
    "id" UUID NOT NULL,
    "nombre" VARCHAR NOT NULL,
    "estado" "Estado" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tipo_documento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ciudad" (
    "id" UUID NOT NULL,
    "codigo_postal" VARCHAR,
    "nombre" VARCHAR NOT NULL,

    CONSTRAINT "ciudad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "genero" (
    "id" UUID NOT NULL,
    "nombre" VARCHAR NOT NULL,
    "estado" "Estado" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "genero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pacientes" (
    "id" UUID NOT NULL,
    "tipo_documento_id" UUID NOT NULL,
    "numero_documento" VARCHAR NOT NULL,
    "nombre_completo" VARCHAR NOT NULL,
    "fecha_nacimiento" DATE NOT NULL,
    "genero_id" UUID NOT NULL,
    "telefono" VARCHAR,
    "email" VARCHAR,
    "eps_id" UUID NOT NULL,
    "ciudad_id" UUID NOT NULL,
    "prioridad" "Prioridad" NOT NULL,
    "estado_cita" "EstadoCita" NOT NULL DEFAULT 'PENDIENTE',

    CONSTRAINT "pacientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "usuario" VARCHAR NOT NULL,
    "nombre" VARCHAR NOT NULL,
    "rol" "Rol" NOT NULL,
    "estado" "Estado" NOT NULL,
    "password" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_usuario_key" ON "users"("usuario");

-- AddForeignKey
ALTER TABLE "pacientes" ADD CONSTRAINT "pacientes_tipo_documento_id_fkey" FOREIGN KEY ("tipo_documento_id") REFERENCES "tipo_documento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pacientes" ADD CONSTRAINT "pacientes_genero_id_fkey" FOREIGN KEY ("genero_id") REFERENCES "genero"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pacientes" ADD CONSTRAINT "pacientes_eps_id_fkey" FOREIGN KEY ("eps_id") REFERENCES "eps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pacientes" ADD CONSTRAINT "pacientes_ciudad_id_fkey" FOREIGN KEY ("ciudad_id") REFERENCES "ciudad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
