import { prisma } from '@/infrastructure/prisma/client.ts';
import { CatalogoService } from '@/modules/catalogos/catalogo.service.ts';
import { CatalogoController } from '@/modules/catalogos/catalogo.controller.ts';
import { buildCatalogoRouter } from '@/modules/catalogos/catalogo.route.ts';

const catalogoService = new CatalogoService(prisma);
const catalogoController = new CatalogoController(catalogoService);

export const catalogoRouter = buildCatalogoRouter(catalogoController);
