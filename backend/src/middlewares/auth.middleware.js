const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

function autenticar(req, res, next) {
  const authorization = req.headers.authorization;

  if (
    !authorization ||
    !authorization.startsWith('Bearer ')
  ) {
    return next(
      new AppError(
        'Token de autenticación requerido',
        401
      )
    );
  }

  const token = authorization
    .slice(7)
    .trim();

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const usuarioId = Number(payload.sub);

    if (!Number.isInteger(usuarioId)) {
      throw new Error('Identificador de usuario inválido');
    }

    req.usuario = {
      id: usuarioId,
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(
        new AppError('El token ha expirado', 401)
      );
    }

    return next(
      new AppError('Token inválido', 401)
    );
  }
}

module.exports = autenticar;