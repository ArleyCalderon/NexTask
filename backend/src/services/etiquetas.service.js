const pool = require('../config/db');
const AppError = require('../utils/AppError');

const obtenerEtiquetas = async (usuarioId) => {
  const resultado = await pool.query(
    `
      SELECT
        id,
        usuario_id,
        nombre,
        creado_en,
        actualizado_en
      FROM etiquetas
      WHERE usuario_id = $1
      ORDER BY nombre ASC
    `,
    [usuarioId]
  );

  return resultado.rows;
};

const crearEtiqueta = async (usuarioId, datos) => {
  const { nombre } = datos;

  try {
    const resultado = await pool.query(
      `
        INSERT INTO etiquetas (
          usuario_id,
          nombre
        )
        VALUES ($1, $2)
        RETURNING
          id,
          usuario_id,
          nombre,
          creado_en,
          actualizado_en
      `,
      [usuarioId, nombre]
    );

    return resultado.rows[0];
  } catch (error) {
    if (error.code === '23505') {
      throw new AppError(
        'Ya existe una etiqueta con ese nombre',
        409
      );
    }

    throw error;
  }
};

module.exports = {
  obtenerEtiquetas,
  crearEtiqueta
};