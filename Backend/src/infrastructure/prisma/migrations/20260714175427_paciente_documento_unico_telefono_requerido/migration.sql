-- AlterTable
ALTER TABLE "pacientes" ALTER COLUMN "telefono" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "pacientes_numero_documento_key" ON "pacientes"("numero_documento");
