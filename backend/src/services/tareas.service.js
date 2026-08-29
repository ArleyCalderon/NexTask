const pool = require('../config/db');
const AppError = require('../utils/AppError');

const validarCategoriaDelUsuario = async (categoriaId, usuarioId) => {
  if (categoriaId === null || categoriaId === undefined) {
    return;
  }

  const resultado = await pool.query(
    `
      SELECT id
      FROM categorias
      WHERE id = $1
        AND usuario_id = $2
    `,
    [categoriaId, usuarioId]
  );

  if (resultado.rowCount === 0) {
    throw new AppError(
      'La categoría no existe o no pertenece al usuario',
      400
    );
  }
};

const crearTarea = async (usuarioId, datos) => {
  const {
    titulo,
    descripcion = null,
    prioridad = 'media',
    fecha_vencimiento = null,
    categoria_id = null
  } = datos;

  await validarCategoriaDelUsuario(
    categoria_id,
    usuarioId
  );

  const resultado = await pool.query(
    `
      INSERT INTO tareas (
        usuario_id,
        categoria_id,
        titulo,
        descripcion,
        prioridad,
        fecha_vencimiento
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING
        id,
        usuario_id,
        categoria_id,
        titulo,
        descripcion,
        prioridad,
        completada,
        fecha_vencimiento,
        creado_en,
        actualizado_en,
        completada_en
    `,
    [
      usuarioId,
      categoria_id,
      titulo,
      descripcion,
      prioridad,
      fecha_vencimiento
    ]
  );

  return resultado.rows[0];
};


const obtenerTareas = async (usuarioId, filtros = {}) => {
  const condiciones = [
    't.usuario_id = $1'
  ];

  const valores = [usuarioId];

  if (filtros.completada !== undefined) {
    valores.push(filtros.completada === 'true');

    condiciones.push(
      `t.completada = $${valores.length}`
    );
  }

  if (filtros.categoria !== undefined) {
    valores.push(Number(filtros.categoria));

    condiciones.push(
      `t.categoria_id = $${valores.length}`
    );
  }

  if (filtros.prioridad !== undefined) {
    valores.push(filtros.prioridad);

    condiciones.push(
      `t.prioridad = $${valores.length}`
    );
  }

  if (filtros.busqueda !== undefined) {
    valores.push(`%${filtros.busqueda}%`);

    condiciones.push(
      `(
        t.titulo ILIKE $${valores.length}
        OR
        COALESCE(t.descripcion, '') ILIKE $${valores.length}
      )`
    );
  }

  if (filtros.fecha_vencimiento !== undefined) {
        const [fechaDesde, fechaHasta] =
            filtros.fecha_vencimiento.split(',');

        valores.push(fechaDesde);
        const posicionDesde = valores.length;

        valores.push(fechaHasta);
        const posicionHasta = valores.length;

        condiciones.push(
            `t.fecha_vencimiento BETWEEN $${posicionDesde} AND $${posicionHasta}`
        );
    }

    if (filtros.etiquetas !== undefined) {
        const etiquetas = filtros.etiquetas
            .split(',')
            .map((etiqueta) => etiqueta.trim())
            .filter(Boolean);

        for (const etiqueta of etiquetas) {
            valores.push(etiqueta);

            condiciones.push(
            `
                EXISTS (
                SELECT 1
                FROM tarea_etiquetas te
                JOIN etiquetas e
                    ON e.id = te.etiqueta_id
                    AND e.usuario_id = te.usuario_id
                WHERE te.tarea_id = t.id
                    AND te.usuario_id = t.usuario_id
                    AND LOWER(e.nombre) = LOWER($${valores.length})
                )
            `
            );
        }
    }

    const camposOrdenamiento = {
        creado_en: 't.creado_en',
        fecha_vencimiento: 't.fecha_vencimiento',
        titulo: 't.titulo',
        prioridad: `
            CASE t.prioridad
            WHEN 'baja' THEN 1
            WHEN 'media' THEN 2
            WHEN 'alta' THEN 3
            END
        `
        };

        const campoOrden =
        camposOrdenamiento[filtros.ordenar || 'creado_en'];

        const direccionOrden =
        filtros.direccion === 'asc'
            ? 'ASC'
            : 'DESC';

  const resultado = await pool.query(
    `
      SELECT
        t.id,
        t.usuario_id,
        t.categoria_id,
        t.titulo,
        t.descripcion,
        t.prioridad,
        t.completada,
        t.fecha_vencimiento,
        t.creado_en,
        t.actualizado_en,
        t.completada_en,
        c.nombre AS categoria_nombre
      FROM tareas t
      LEFT JOIN categorias c
        ON c.id = t.categoria_id
        AND c.usuario_id = t.usuario_id
      WHERE ${condiciones.join(' AND ')}
      ORDER BY ${campoOrden} ${direccionOrden} NULLS LAST
    `,
    valores
  );

  return resultado.rows;
};

const actualizarTarea = async (usuarioId, tareaId, datos) => {
  if (datos.categoria_id !== undefined) {
    await validarCategoriaDelUsuario(
      datos.categoria_id,
      usuarioId
    );
  }

  const camposPermitidos = {
    titulo: 'titulo',
    descripcion: 'descripcion',
    prioridad: 'prioridad',
    fecha_vencimiento: 'fecha_vencimiento',
    categoria_id: 'categoria_id'
  };

  const camposActualizar = [];
  const valores = [];

  for (const [campo, columna] of Object.entries(camposPermitidos)) {
    if (datos[campo] !== undefined) {
      valores.push(datos[campo]);

      camposActualizar.push(
        `${columna} = $${valores.length}`
      );
    }
  }

  valores.push(tareaId);
  const posicionTareaId = valores.length;

  valores.push(usuarioId);
  const posicionUsuarioId = valores.length;

  const resultado = await pool.query(
    `
      UPDATE tareas
      SET ${camposActualizar.join(', ')}
      WHERE id = $${posicionTareaId}
        AND usuario_id = $${posicionUsuarioId}
      RETURNING
        id,
        usuario_id,
        categoria_id,
        titulo,
        descripcion,
        prioridad,
        completada,
        fecha_vencimiento,
        creado_en,
        actualizado_en,
        completada_en
    `,
    valores
  );

  if (resultado.rowCount === 0) {
    throw new AppError(
      'La tarea no existe o no pertenece al usuario',
      404
    );
  }

  return resultado.rows[0];
};

const eliminarTarea = async (usuarioId, tareaId) => {
  const resultado = await pool.query(
    `
      DELETE FROM tareas
      WHERE id = $1
        AND usuario_id = $2
      RETURNING id
    `,
    [tareaId, usuarioId]
  );

  if (resultado.rowCount === 0) {
    throw new AppError(
      'La tarea no existe o no pertenece al usuario',
      404
    );
  }
};

const cambiarEstadoCompletada = async (usuarioId, tareaId) => {
  const resultado = await pool.query(
    `
      UPDATE tareas
      SET
        completada = NOT completada,
        completada_en = CASE
          WHEN completada = FALSE THEN NOW()
          ELSE NULL
        END
      WHERE id = $1
        AND usuario_id = $2
      RETURNING
        id,
        usuario_id,
        categoria_id,
        titulo,
        descripcion,
        prioridad,
        completada,
        fecha_vencimiento,
        creado_en,
        actualizado_en,
        completada_en
    `,
    [tareaId, usuarioId]
  );

  if (resultado.rowCount === 0) {
    throw new AppError(
      'La tarea no existe o no pertenece al usuario',
      404
    );
  }

  return resultado.rows[0];
};

module.exports = {
  crearTarea,
  obtenerTareas,
  actualizarTarea,
  eliminarTarea,
  cambiarEstadoCompletada
};