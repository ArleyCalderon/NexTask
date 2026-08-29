const AppError = require('../utils/AppError');

function validar(schema) {
  return (req, res, next) => {
    const resultado = schema.safeParse(req.body);

    if (!resultado.success) {
      const detalles = resultado.error.issues.map((issue) => ({
        campo: issue.path.join('.'),
        mensaje: issue.message,
      }));

      return next(
        new AppError(
          'Datos de entrada inválidos',
          400,
          detalles
        )
      );
    }

    req.body = resultado.data;

    next();
  };
}

module.exports = validar;