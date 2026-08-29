import { useState } from 'react';
import FormularioTarea from './FormularioTarea';

function ItemTarea({
  tarea,
  onCambiarEstado,
  onEliminar,
  onActualizar,
  etiquetasDisponibles,
  cargandoEtiquetas,
  onAgregarEtiqueta,
  onQuitarEtiqueta,
}) {
  const [editando, setEditando] = useState(false);
  const [etiquetaSeleccionada, setEtiquetaSeleccionada] =
    useState('');

  const manejarEliminar = () => {
    const confirmar = window.confirm(
      `¿Eliminar la tarea "${tarea.titulo}"?`
    );

    if (confirmar) {
      onEliminar(tarea.id);
    }
  };

  const manejarAgregarEtiqueta = async () => {
    if (!etiquetaSeleccionada) {
      return;
    }

    await onAgregarEtiqueta(
      tarea.id,
      etiquetaSeleccionada
    );

    setEtiquetaSeleccionada('');
  };

  const manejarQuitarEtiqueta = async (etiquetaId) => {
    await onQuitarEtiqueta(
      tarea.id,
      etiquetaId
    );
  };

  const idsEtiquetasActuales = tarea.etiquetas.map(
    (etiqueta) => String(etiqueta.id)
  );

  const etiquetasParaAgregar =
    etiquetasDisponibles.filter(
      (etiqueta) =>
        !idsEtiquetasActuales.includes(
          String(etiqueta.id)
        )
    );

  if (editando) {
    return (
      <article>
        <FormularioTarea
          tareaInicial={tarea}
          onActualizar={onActualizar}
          onCancelar={() => setEditando(false)}
        />
      </article>
    );
  }

  return (
    <article>
      <div>
        <h3>{tarea.titulo}</h3>

        <span>
          {tarea.completada
            ? 'Completada'
            : 'Pendiente'}
        </span>
      </div>

      <button
        type="button"
        onClick={() => onCambiarEstado(tarea.id)}
      >
        {tarea.completada
          ? 'Marcar como pendiente'
          : 'Marcar como completada'}
      </button>

      <button
        type="button"
        onClick={() => setEditando(true)}
      >
        Editar
      </button>

      <button
        type="button"
        onClick={manejarEliminar}
      >
        Eliminar
      </button>

      {tarea.descripcion && (
        <p>{tarea.descripcion}</p>
      )}

      <div>
        <span>
          Prioridad: {tarea.prioridad}
        </span>

        {tarea.categoria_nombre && (
          <span>
            {' '}
            Categoría: {tarea.categoria_nombre}
          </span>
        )}
      </div>

      {tarea.fecha_vencimiento && (
        <p>
          Vence:{' '}
          {new Date(
            tarea.fecha_vencimiento
          ).toLocaleDateString()}
        </p>
      )}

      <div>
        <strong>Etiquetas:</strong>

        {tarea.etiquetas.length === 0 ? (
          <span> Sin etiquetas</span>
        ) : (
          tarea.etiquetas.map((etiqueta) => (
            <span key={etiqueta.id}>
              {' '}
              #{etiqueta.nombre}

              <button
                type="button"
                onClick={() =>
                  manejarQuitarEtiqueta(
                    etiqueta.id
                  )
                }
              >
                ×
              </button>
            </span>
          ))
        )}
      </div>

      <div>
        <select
          value={etiquetaSeleccionada}
          onChange={(e) =>
            setEtiquetaSeleccionada(
              e.target.value
            )
          }
          disabled={
            cargandoEtiquetas ||
            etiquetasParaAgregar.length === 0
          }
        >
          <option value="">
            {etiquetasParaAgregar.length === 0
              ? 'No hay etiquetas disponibles'
              : 'Seleccionar etiqueta'}
          </option>

          {etiquetasParaAgregar.map(
            (etiqueta) => (
              <option
                key={etiqueta.id}
                value={etiqueta.id}
              >
                {etiqueta.nombre}
              </option>
            )
          )}
        </select>

        <button
          type="button"
          onClick={manejarAgregarEtiqueta}
          disabled={!etiquetaSeleccionada}
        >
          Agregar etiqueta
        </button>
      </div>
    </article>
  );
}

export default ItemTarea;