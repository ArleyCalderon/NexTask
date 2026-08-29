const pool = require('../config/db');
const AppError = require('../utils/AppError');

const obtenerCategorias = async (usuarioId) => {
  const resultado = await pool.query(
    `
      SELECT
        id,
        usuario_id,
        nombre,
        color,
        creado_en,
        actualizado_en
      FROM categorias
      WHERE usuario_id = $1
      ORDER BY nombre ASC
    `,
    [usuarioId]
  );

  return resultado.rows;
};

const crearCategoria = async (usuarioId, datos) => {
  const {
    nombre,
    color = '#6366F1'
  } = datos;

  try {
    const resultado = await pool.query(
      `
        INSERT INTO categorias (
          usuario_id,
          nombre,
          color
        )
        VALUES ($1, $2, $3)
        RETURNING
          id,
          usuario_id,
          nombre,
          color,
          creado_en,
          actualizado_en
      `,
      [
        usuarioId,
        nombre,
        color
      ]
    );

    return resultado.rows[0];
  } catch (error) {
    if (error.code === '23505') {
      throw new AppError(
        'Ya existe una categoría con ese nombre',
        409
      );
    }

    throw error;
  }
};

const actualizarCategoria = async (
  usuarioId,
  categoriaId,
  datos
) => {
  const camposActualizar = [];
  const valores = [];

  if (datos.nombre !== undefined) {
    valores.push(datos.nombre);

    camposActualizar.push(
      `nombre = $${valores.length}`
    );
  }

  if (datos.color !== undefined) {
    valores.push(datos.color);

    camposActualizar.push(
      `color = $${valores.length}`
    );
  }

  valores.push(categoriaId);
  const posicionCategoriaId = valores.length;

  valores.push(usuarioId);
  const posicionUsuarioId = valores.length;

  try {
    const resultado = await pool.query(
      `
        UPDATE categorias
        SET ${camposActualizar.join(', ')}
        WHERE id = $${posicionCategoriaId}
          AND usuario_id = $${posicionUsuarioId}
        RETURNING
          id,
          usuario_id,
          nombre,
          color,
          creado_en,
          actualizado_en
      `,
      valores
    );

    if (resultado.rowCount === 0) {
      throw new AppError(
        'La categoría no existe o no pertenece al usuario',
        404
      );
    }

    return resultado.rows[0];
  } catch (error) {
    if (error.code === '23505') {
      throw new AppError(
        'Ya existe una categoría con ese nombre',
        409
      );
    }

    throw error;
  }
};

const eliminarCategoria = async (
  usuarioId,
  categoriaId
) => {
  const cliente = await pool.connect();

  try {
    await cliente.query('BEGIN');

    const categoria = await cliente.query(
      `
        SELECT id
        FROM categorias
        WHERE id = $1
          AND usuario_id = $2
      `,
      [categoriaId, usuarioId]
    );

    if (categoria.rowCount === 0) {
      throw new AppError(
        'La categoría no existe o no pertenece al usuario',
        404
      );
    }

    await cliente.query(
      `
        UPDATE tareas
        SET categoria_id = NULL
        WHERE categoria_id = $1
          AND usuario_id = $2
      `,
      [categoriaId, usuarioId]
    );

    await cliente.query(
      `
        DELETE FROM categorias
        WHERE id = $1
          AND usuario_id = $2
      `,
      [categoriaId, usuarioId]
    );

    await cliente.query('COMMIT');
  } catch (error) {
    await cliente.query('ROLLBACK');
    throw error;
  } finally {
    cliente.release();
  }
};

module.exports = {
  obtenerCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria
};