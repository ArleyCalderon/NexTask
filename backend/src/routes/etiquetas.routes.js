const express = require('express');

const etiquetasController =
  require('../controllers/etiquetas.controller');

const {
  crearEtiquetaSchema
} = require('../validators/etiquetas.validator');

const autenticar =
  require('../middlewares/auth.middleware');

const validar =
  require('../middlewares/validar.middleware');

const router = express.Router();

router.use(autenticar);

router.get(
  '/',
  etiquetasController.obtenerEtiquetas
);

router.post(
  '/',
  validar(crearEtiquetaSchema),
  etiquetasController.crearEtiqueta
);

module.exports = router;