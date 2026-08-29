import { useState } from 'react';

import useTareas from '../../hooks/useTareas';
import useEtiquetas from '../../hooks/useEtiquetas';

import Cargando from '../Comunes/Cargando';
import MensajeError from '../Comunes/MensajeError';

import ItemTarea from './ItemTarea';
import FormularioTarea from './FormularioTarea';
import FiltroTareas from './FiltroTareas';

import estilos from './ListaTareas.module.css';

function ListaTareas() {
  const [filtros, setFiltros] = useState({});

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false);

  const [mostrarFiltros, setMostrarFiltros] =
    useState(false);

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

  const manejarCrearTarea = async (datosTarea) => {
    await crearTarea(datosTarea);
    setMostrarFormulario(false);
  };

  return (
    <div className={estilos.pagina}>
      <div className={estilos.encabezado}>
        <div>
          <h1>Mis tareas</h1>

          <p>
            Crea, filtra y administra tus actividades
            desde un solo lugar.
          </p>
        </div>

        <div className={estilos.accionesEncabezado}>
          <button
            type="button"
            className={estilos.botonFiltros}
            onClick={() =>
              setMostrarFiltros(!mostrarFiltros)
            }
          >
            {mostrarFiltros
              ? 'Ocultar filtros'
              : 'Filtrar tareas'}
          </button>

          <button
            type="button"
            className={estilos.botonNuevaTarea}
            onClick={() =>
              setMostrarFormulario(!mostrarFormulario)
            }
          >
            {mostrarFormulario
              ? 'Cancelar'
              : '+ Nueva tarea'}
          </button>
        </div>
      </div>

      {mostrarFormulario && (
        <div className={estilos.panelDesplegable}>
          <FormularioTarea
            onCrear={manejarCrearTarea}
          />
        </div>
      )}

      {mostrarFiltros && (
        <div className={estilos.panelDesplegable}>
          <FiltroTareas
            onFiltrar={setFiltros}
            etiquetasDisponibles={etiquetas}
            cargandoEtiquetas={cargandoEtiquetas}
          />
        </div>
      )}

      <MensajeError mensaje={errorEtiquetas} />
      <MensajeError mensaje={error} />

      <section className={estilos.seccionTareas}>
        <div className={estilos.tituloLista}>
          <div>
            <h2>Tareas</h2>

            <p>
              {tareas.length === 1
                ? '1 tarea encontrada'
                : `${tareas.length} tareas encontradas`}
            </p>
          </div>
        </div>

        {cargando ? (
          <Cargando mensaje="Actualizando tareas..." />
        ) : tareas.length === 0 ? (
          <div className={estilos.vacio}>
            <div className={estilos.iconoVacio}>
              ✓
            </div>

            <h3>No se encontraron tareas</h3>

            <p>
              Crea una nueva tarea o modifica los
              filtros aplicados.
            </p>
          </div>
        ) : (
          <div className={estilos.lista}>
            {tareas.map((tarea) => (
              <ItemTarea
                key={tarea.id}
                tarea={tarea}
                onCambiarEstado={cambiarEstadoTarea}
                onEliminar={eliminarTarea}
                onActualizar={actualizarTarea}
                etiquetasDisponibles={etiquetas}
                cargandoEtiquetas={cargandoEtiquetas}
                onAgregarEtiqueta={
                  agregarEtiquetaTarea
                }
                onQuitarEtiqueta={
                  quitarEtiquetaTarea
                }
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default ListaTareas;