const AppError = require('../utils/AppError');

function validar(schema, origen = 'body') {
  return (req, res, next) => {
    let datos;

    if (origen === 'query') {
      datos = req.query;
    } else if (origen === 'params') {
      datos = req.params;
    } else {
      datos = req.body;
    }

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
    } else if (origen === 'params') {
      req.paramsValidados = resultado.data;
    } else {
      req.body = resultado.data;
    }

    next();
  };
}

module.exports = validar;