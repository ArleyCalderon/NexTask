import { useState } from 'react';

import useTareas from '../../hooks/useTareas';
import useEtiquetas from '../../hooks/useEtiquetas';

import ItemTarea from './ItemTarea';
import FormularioTarea from './FormularioTarea';
import FiltroTareas from './FiltroTareas';

function ListaTareas() {
  const [filtros, setFiltros] = useState({});

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
  } = useTareas(filtros);

  const {
    etiquetas,
    cargandoEtiquetas,
    errorEtiquetas,
  } = useEtiquetas();

  return (
    <div>
      <h2>Mis tareas</h2>

      <FormularioTarea
        onCrear={crearTarea}
      />

      <FiltroTareas
        onFiltrar={setFiltros}
        etiquetasDisponibles={etiquetas}
        cargandoEtiquetas={cargandoEtiquetas}
      />

      {errorEtiquetas && (
        <p>{errorEtiquetas}</p>
      )}

      {error && (
        <p>{error}</p>
      )}

      {cargando ? (
        <p>Actualizando tareas...</p>
      ) : tareas.length === 0 ? (
        <p>No se encontraron tareas.</p>
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