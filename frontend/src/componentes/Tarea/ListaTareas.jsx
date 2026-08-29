import useTareas from '../../hooks/useTareas';
import useEtiquetas from '../../hooks/useEtiquetas';
import ItemTarea from './ItemTarea';
import FormularioTarea from './FormularioTarea';

function ListaTareas() {
  const {
    tareas,
    cargando,
    error,
    cambiarEstadoTarea,
    crearTarea,
    eliminarTarea,
    actualizarTarea,
    agregarEtiquetaTarea,
    quitarEtiquetaTarea,
  } = useTareas();

  const {
    etiquetas,
    cargandoEtiquetas,
    errorEtiquetas,
  } = useEtiquetas();

  if (cargando) {
    return <p>Cargando tareas...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Mis tareas</h2>

      <FormularioTarea
        onCrear={crearTarea}
      />

      {errorEtiquetas && (
        <p>{errorEtiquetas}</p>
      )}

      {tareas.length === 0 ? (
        <p>No tienes tareas todavía.</p>
      ) : (
        <div>
          {tareas.map((tarea) => (
            <ItemTarea
              key={tarea.id}
              tarea={tarea}
              onCambiarEstado={cambiarEstadoTarea}
              onEliminar={eliminarTarea}
              onActualizar={actualizarTarea}
              etiquetasDisponibles={etiquetas}
              cargandoEtiquetas={cargandoEtiquetas}
              onAgregarEtiqueta={agregarEtiquetaTarea}
              onQuitarEtiqueta={quitarEtiquetaTarea}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ListaTareas;