function descargarArchivo(
  contenido,
  nombreArchivo,
  tipoMime
) {
  const blob = new Blob(
    [contenido],
    {
      type: tipoMime,
    }
  );

  const url = URL.createObjectURL(blob);

  const enlace = document.createElement('a');

  enlace.href = url;
  enlace.download = nombreArchivo;

  document.body.appendChild(enlace);

  enlace.click();
  enlace.remove();

  URL.revokeObjectURL(url);
}

function obtenerFechaArchivo() {
  const hoy = new Date();

  const anio = hoy.getFullYear();

  const mes = String(
    hoy.getMonth() + 1
  ).padStart(2, '0');

  const dia = String(
    hoy.getDate()
  ).padStart(2, '0');

  return `${anio}-${mes}-${dia}`;
}

function prepararValorCSV(valor) {
  if (
    valor === null ||
    valor === undefined
  ) {
    return '""';
  }

  let texto = String(valor);

  // Evita que Excel interprete contenido del usuario
  // como una fórmula al abrir el CSV.
  if (/^[=+\-@]/.test(texto)) {
    texto = `'${texto}`;
  }

  texto = texto.replaceAll('"', '""');

  return `"${texto}"`;
}

function normalizarFecha(fecha) {
  if (!fecha) {
    return '';
  }

  return String(fecha).split('T')[0];
}

function obtenerEtiquetas(tarea) {
  if (
    !Array.isArray(tarea.etiquetas) ||
    tarea.etiquetas.length === 0
  ) {
    return '';
  }

  return tarea.etiquetas
    .map(
      (etiqueta) =>
        `#${etiqueta.nombre}`
    )
    .join(', ');
}

export function exportarTareasCSV(tareas) {
  const columnas = [
    'ID',
    'Título',
    'Descripción',
    'Estado',
    'Prioridad',
    'Categoría',
    'Fecha de vencimiento',
    'Etiquetas',
    'Fecha de creación',
    'Última actualización',
  ];

  const filas = tareas.map((tarea) => [
    tarea.id,
    tarea.titulo,
    tarea.descripcion || '',
    tarea.completada
      ? 'Completada'
      : 'Pendiente',
    tarea.prioridad,
    tarea.categoria_nombre ||
      'Sin categoría',
    normalizarFecha(
      tarea.fecha_vencimiento
    ),
    obtenerEtiquetas(tarea),
    tarea.creado_en || '',
    tarea.actualizado_en || '',
  ]);

  const contenidoCSV = [
    columnas,
    ...filas,
  ]
    .map((fila) =>
      fila
        .map(prepararValorCSV)
        .join(',')
    )
    .join('\n');

  // BOM UTF-8 para que Excel reconozca
  // correctamente tildes, ñ, etc.
  const contenidoConBom =
    `\uFEFF${contenidoCSV}`;

  descargarArchivo(
    contenidoConBom,
    `nextask_tareas_${obtenerFechaArchivo()}.csv`,
    'text/csv;charset=utf-8'
  );
}

export function exportarTareasJSON(tareas) {
  const tareasExportadas =
    tareas.map((tarea) => ({
      id: tarea.id,
      titulo: tarea.titulo,
      descripcion:
        tarea.descripcion || null,

      estado:
        tarea.completada
          ? 'Completada'
          : 'Pendiente',

      prioridad: tarea.prioridad,

      categoria:
        tarea.categoria_nombre ||
        null,

      fecha_vencimiento:
        normalizarFecha(
          tarea.fecha_vencimiento
        ) || null,

      etiquetas:
        Array.isArray(
          tarea.etiquetas
        )
          ? tarea.etiquetas.map(
              (etiqueta) => ({
                id: etiqueta.id,
                nombre:
                  etiqueta.nombre,
              })
            )
          : [],

      creado_en:
        tarea.creado_en || null,

      actualizado_en:
        tarea.actualizado_en ||
        null,
    }));

  const contenidoJSON =
    JSON.stringify(
      tareasExportadas,
      null,
      2
    );

  descargarArchivo(
    contenidoJSON,
    `nextask_tareas_${obtenerFechaArchivo()}.json`,
    'application/json;charset=utf-8'
  );
}