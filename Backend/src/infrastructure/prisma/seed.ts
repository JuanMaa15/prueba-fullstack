// Carga de datos por defecto (npm run db:seed)
async function main(): Promise<void> {
  // TODO: agregar datos por defecto cuando existan modelos en schema.prisma
  console.log("Seed ejecutado: sin datos por cargar todavía.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
