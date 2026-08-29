const tareasService = require('../services/tareas.service');

const crearTarea = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id;

    const tarea = await tareasService.crearTarea(
      usuarioId,
      req.body
    );

    return res.status(201).json({
      mensaje: 'Tarea creada correctamente',
      tarea
    });
  } catch (error) {
    next(error);
  }
};

const obtenerTareas = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id;
    const filtros = req.queryValidada || {};

    const tareas = await tareasService.obtenerTareas(
      usuarioId,
      filtros
    );

    return res.status(200).json({
      tareas
    });
  } catch (error) {
    next(error);
  }
};

const actualizarTarea = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id;
    const tareaId = req.params.id;

    const tarea = await tareasService.actualizarTarea(
      usuarioId,
      tareaId,
      req.body
    );

    return res.status(200).json({
      mensaje: 'Tarea actualizada correctamente',
      tarea
    });
  } catch (error) {
    next(error);
  }
};

const eliminarTarea = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id;
    const tareaId = req.params.id;

    await tareasService.eliminarTarea(
      usuarioId,
      tareaId
    );

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const cambiarEstadoCompletada = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id;
    const tareaId = req.params.id;

    const tarea = await tareasService.cambiarEstadoCompletada(
      usuarioId,
      tareaId
    );

    return res.status(200).json({
      mensaje: 'Estado de la tarea actualizado correctamente',
      tarea
    });
  } catch (error) {
    next(error);
  }
};

const agregarEtiquetaATarea = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id;
    const tareaId = req.params.id;
    const etiquetaId = req.params.etiquetaId;

    const relacion =
      await tareasService.agregarEtiquetaATarea(
        usuarioId,
        tareaId,
        etiquetaId
      );

    return res.status(201).json({
      mensaje: 'Etiqueta asociada a la tarea correctamente',
      relacion
    });
  } catch (error) {
    next(error);
  }
};

const quitarEtiquetaDeTarea = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id;
    const tareaId = req.params.id;
    const etiquetaId = req.params.etiquetaId;

    await tareasService.quitarEtiquetaDeTarea(
      usuarioId,
      tareaId,
      etiquetaId
    );

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  crearTarea,
  obtenerTareas,
  actualizarTarea,
  eliminarTarea,
  cambiarEstadoCompletada,
  agregarEtiquetaATarea,
  quitarEtiquetaDeTarea
};