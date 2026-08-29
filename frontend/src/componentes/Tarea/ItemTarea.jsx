import { useState } from 'react';
import FormularioTarea from './FormularioTarea';

function ItemTarea({
  tarea,
  onCambiarEstado,
  onEliminar,
  onActualizar,
}) {
  const [editando, setEditando] = useState(false);

  const manejarEliminar = () => {
    const confirmar = window.confirm(
      `¿Eliminar la tarea "${tarea.titulo}"?`
    );

    if (confirmar) {
      onEliminar(tarea.id);
    }
  };

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
          {tarea.completada ? 'Completada' : 'Pendiente'}
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

      {tarea.etiquetas.length > 0 && (
        <div>
          {tarea.etiquetas.map((etiqueta) => (
            <span key={etiqueta.id}>
              #{etiqueta.nombre}{' '}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}

export default ItemTarea;