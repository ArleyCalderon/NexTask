const express = require('express');

const tareasController = require('../controllers/tareas.controller');
const {
  crearTareaSchema,
  actualizarTareaSchema,
  filtrosTareasSchema,
  tareaIdSchema,
  tareaEtiquetaParamsSchema
} = require('../validators/tareas.validator');

const autenticar = require('../middlewares/auth.middleware');
const validar = require('../middlewares/validar.middleware');

const router = express.Router();

// Todas las rutas de tareas requieren JWT
router.use(autenticar);

router.get(
  '/',
  validar(filtrosTareasSchema, 'query'),
  tareasController.obtenerTareas
);

router.put(
  '/:id',
  validar(tareaIdSchema, 'params'),
  validar(actualizarTareaSchema),
  tareasController.actualizarTarea
);

router.delete(
  '/:id',
  validar(tareaIdSchema, 'params'),
  tareasController.eliminarTarea
);

// Crear tarea
router.post(
  '/',
  validar(crearTareaSchema),
  tareasController.crearTarea
);

router.patch(
  '/:id/completar',
  validar(tareaIdSchema, 'params'),
  tareasController.cambiarEstadoCompletada
);

router.post(
  '/:id/etiquetas/:etiquetaId',
  validar(tareaEtiquetaParamsSchema, 'params'),
  tareasController.agregarEtiquetaATarea
);

router.delete(
  '/:id/etiquetas/:etiquetaId',
  validar(tareaEtiquetaParamsSchema, 'params'),
  tareasController.quitarEtiquetaDeTarea
);

module.exports = router;