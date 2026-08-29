const authService = require('../services/auth.service');

async function registrar(req, res, next) {
  try {
    const resultado = await authService.registrar(req.body);

    res.status(201).json({
      mensaje: 'Usuario registrado correctamente',
      ...resultado,
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const resultado = await authService.login(req.body);

    res.status(200).json({
      mensaje: 'Inicio de sesión exitoso',
      ...resultado,
    });
  } catch (error) {
    next(error);
  }
}

async function obtenerPerfil(req, res, next) {
  try {
    const usuario = await authService.obtenerPerfil(
      req.usuario.id
    );

    res.status(200).json({
      usuario,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  registrar,
  login,
  obtenerPerfil,
};