import { Router } from 'express';
import { authenticate } from '@/common/middlewares/auth.middleware.ts';
import type { CatalogoController } from '@/modules/catalogos/catalogo.controller.ts';

export function buildCatalogoRouter(catalogoController: CatalogoController): Router {
  const router = Router();

  router.use(authenticate);

  router.get('/tipo-documentos', catalogoController.getTipoDocumentos);
  router.get('/generos', catalogoController.getGeneros);
  router.get('/eps', catalogoController.getEps);
  router.get('/ciudades', catalogoController.getCiudades);

  return router;
}
