const categoriasService = require('../services/categorias.service');

const obtenerCategorias = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id;

    const categorias =
      await categoriasService.obtenerCategorias(usuarioId);

    return res.status(200).json({
      categorias
    });
  } catch (error) {
    next(error);
  }
};

const crearCategoria = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id;

    const categoria =
      await categoriasService.crearCategoria(
        usuarioId,
        req.body
      );

    return res.status(201).json({
      mensaje: 'Categoría creada correctamente',
      categoria
    });
  } catch (error) {
    next(error);
  }
};

const actualizarCategoria = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id;
    const categoriaId = req.params.id;

    const categoria =
      await categoriasService.actualizarCategoria(
        usuarioId,
        categoriaId,
        req.body
      );

    return res.status(200).json({
      mensaje: 'Categoría actualizada correctamente',
      categoria
    });
  } catch (error) {
    next(error);
  }
};

const eliminarCategoria = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id;
    const categoriaId = req.params.id;

    await categoriasService.eliminarCategoria(
      usuarioId,
      categoriaId
    );

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  obtenerCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria
};