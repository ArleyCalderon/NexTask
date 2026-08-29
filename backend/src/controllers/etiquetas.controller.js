const etiquetasService = require('../services/etiquetas.service');

const obtenerEtiquetas = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id;

    const etiquetas =
      await etiquetasService.obtenerEtiquetas(usuarioId);

    return res.status(200).json({
      etiquetas
    });
  } catch (error) {
    next(error);
  }
};

const crearEtiqueta = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id;

    const etiqueta =
      await etiquetasService.crearEtiqueta(
        usuarioId,
        req.body
      );

    return res.status(201).json({
      mensaje: 'Etiqueta creada correctamente',
      etiqueta
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  obtenerEtiquetas,
  crearEtiqueta
};