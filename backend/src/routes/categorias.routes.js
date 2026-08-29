const express = require('express');

const categoriasController =
  require('../controllers/categorias.controller');

const {
  crearCategoriaSchema,
  actualizarCategoriaSchema
} = require('../validators/categorias.validator');

const autenticar =
  require('../middlewares/auth.middleware');

const validar =
  require('../middlewares/validar.middleware');

const router = express.Router();

router.use(autenticar);

router.get(
  '/',
  categoriasController.obtenerCategorias
);

router.post(
  '/',
  validar(crearCategoriaSchema),
  categoriasController.crearCategoria
);

router.put(
  '/:id',
  validar(actualizarCategoriaSchema),
  categoriasController.actualizarCategoria
);

router.delete(
  '/:id',
  categoriasController.eliminarCategoria
);

module.exports = router;