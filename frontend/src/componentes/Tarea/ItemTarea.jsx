import { useState } from 'react';
import FormularioTarea from './FormularioTarea';
import estilos from './ItemTarea.module.css';
import { formatearFecha } from '../../utils/helpers';

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

    const clasesPrioridad = {
    baja: estilos.prioridadBaja,
    media: estilos.prioridadMedia,
    alta: estilos.prioridadAlta,
  };

if (editando) {
  return (
    <article className={estilos.edicion}>
      <FormularioTarea
        tareaInicial={tarea}
        onActualizar={onActualizar}
        onCancelar={() => setEditando(false)}
      />
    </article>
  );
}

return (
  <article
    className={`${estilos.tarea} ${
      tarea.completada ? estilos.tareaCompletada : ''
    }`}
  >
    <div className={estilos.superior}>
      <div>
        <div className={estilos.tituloEstado}>
          <h3>{tarea.titulo}</h3>

          <span
            className={`${estilos.estado} ${
              tarea.completada
                ? estilos.completada
                : estilos.pendiente
            }`}
          >
            {tarea.completada ? 'Completada' : 'Pendiente'}
          </span>
        </div>

        {tarea.descripcion && (
          <p className={estilos.descripcion}>
            {tarea.descripcion}
          </p>
        )}
      </div>

      <span
        className={`${estilos.prioridad} ${
          clasesPrioridad[tarea.prioridad]
        }`}
      >
        {tarea.prioridad}
      </span>
    </div>

    <div className={estilos.metadatos}>
      {tarea.categoria_nombre && (
        <span>
          Categoría: <strong>{tarea.categoria_nombre}</strong>
        </span>
      )}

      {tarea.fecha_vencimiento && (
        <span>
          Vence:{' '}
          <strong>
            {formatearFecha(tarea.fecha_vencimiento)}
          </strong>
        </span>
      )}
    </div>

    <div className={estilos.etiquetas}>
      {tarea.etiquetas.length === 0 ? (
        <span className={estilos.sinEtiquetas}>
          Sin etiquetas
        </span>
      ) : (
        tarea.etiquetas.map((etiqueta) => (
          <span
            key={etiqueta.id}
            className={estilos.etiqueta}
          >
            #{etiqueta.nombre}

            <button
              type="button"
              onClick={() =>
                manejarQuitarEtiqueta(etiqueta.id)
              }
              aria-label={`Quitar etiqueta ${etiqueta.nombre}`}
            >
              ×
            </button>
          </span>
        ))
      )}
    </div>

    <div className={estilos.pie}>
      <div className={estilos.agregarEtiqueta}>
        <select
          value={etiquetaSeleccionada}
          onChange={(e) =>
            setEtiquetaSeleccionada(e.target.value)
          }
          disabled={
            cargandoEtiquetas ||
            etiquetasParaAgregar.length === 0
          }
        >
          <option value="">
            {etiquetasParaAgregar.length === 0
              ? 'No hay etiquetas disponibles'
              : 'Agregar etiqueta'}
          </option>

          {etiquetasParaAgregar.map((etiqueta) => (
            <option
              key={etiqueta.id}
              value={etiqueta.id}
            >
              {etiqueta.nombre}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={manejarAgregarEtiqueta}
          disabled={!etiquetaSeleccionada}
        >
          Agregar
        </button>
      </div>

      <div className={estilos.acciones}>
        <button
          type="button"
          className={estilos.completar}
          onClick={() => onCambiarEstado(tarea.id)}
        >
          {tarea.completada ? '↶ Pendiente' : '✓ Completar'}
        </button>

        <button
          type="button"
          className={estilos.editar}
          onClick={() => setEditando(true)}
        >
          Editar
        </button>

        <button
          type="button"
          className={estilos.eliminar}
          onClick={manejarEliminar}
        >
          Eliminar
        </button>
      </div>
    </div>
  </article>
);
}

export default ItemTarea;