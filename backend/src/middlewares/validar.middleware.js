const AppError = require('../utils/AppError');

function validar(schema, origen = 'body') {
  return (req, res, next) => {
    const datos =
      origen === 'query'
        ? req.query
        : req.body;

    const resultado = schema.safeParse(datos);

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

    if (origen === 'query') {
      req.queryValidada = resultado.data;
    } else {
      req.body = resultado.data;
    }

    next();
  };
}

module.exports = validar;