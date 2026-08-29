import useTareas from '../../hooks/useTareas';
import ItemTarea from './ItemTarea';

function ListaTareas() {
    const {
    tareas,
    cargando,
    error,
    cambiarEstadoTarea,
    } = useTareas();

  if (cargando) {
    return <p>Cargando tareas...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Mis tareas</h2>

      {tareas.length === 0 ? (
        <p>No tienes tareas todavía.</p>
      ) : (
        <div>
          {tareas.map((tarea) => (
            <ItemTarea
                key={tarea.id}
                tarea={tarea}
                onCambiarEstado={cambiarEstadoTarea}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ListaTareas;