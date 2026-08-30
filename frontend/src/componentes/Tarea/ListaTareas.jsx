import {
  useEffect,
  useState,
} from 'react';
import {
  Braces,
  ChevronDown,
  Download,
  FileSpreadsheet,
} from 'lucide-react';
import {
  exportarTareasCSV,
  exportarTareasJSON,
} from '../../utils/exportarTareas';
import api from '../../servicios/api';
import useTareas from '../../hooks/useTareas';
import useEtiquetas from '../../hooks/useEtiquetas';
import ResumenTareas from './ResumenTareas';
import Cargando from '../Comunes/Cargando';
import MensajeError from '../Comunes/MensajeError';
import { useOutletContext } from 'react-router-dom';
import ItemTarea from './ItemTarea';
import FormularioTarea from './FormularioTarea';
import FiltroTareas from './FiltroTareas';

import estilos from './ListaTareas.module.css';

function ListaTareas() {
  const {
  estadisticas,
  cargandoEstadisticas,
} = useOutletContext();

  const [filtros, setFiltros] = useState({});

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false);

  const [mostrarFiltros, setMostrarFiltros] =
    useState(false);
  
  const [mostrarExportacion, setMostrarExportacion] =
  useState(false);

  const [exportando, setExportando] =
      useState(false);

  const [
      errorExportacion,
      setErrorExportacion,
    ] = useState('');

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
  useEffect(() => {
  const manejarAtajos = (evento) => {
    const elementoActivo =
      document.activeElement;

    const escribiendo =
      elementoActivo?.tagName === 'INPUT' ||
      elementoActivo?.tagName === 'TEXTAREA' ||
      elementoActivo?.tagName === 'SELECT' ||
      elementoActivo?.isContentEditable;

    // Escape sí puede cerrar paneles
    // independientemente del elemento activo.
    if (evento.key === 'Escape') {
      setMostrarFormulario(false);
      setMostrarFiltros(false);
      setMostrarExportacion(false);

      return;
    }

    // No ejecutar atajos mientras el usuario escribe.
    if (
      escribiendo ||
      evento.ctrlKey ||
      evento.metaKey ||
      evento.altKey
    ) {
      return;
    }

    const tecla =
      evento.key.toLowerCase();

    if (tecla === 'n') {
      evento.preventDefault();

      setMostrarFormulario(
        (valorActual) => !valorActual
      );

      setMostrarExportacion(false);
    }

    if (tecla === 'f') {
      evento.preventDefault();

      setMostrarFiltros(
        (valorActual) => !valorActual
      );

      setMostrarExportacion(false);
    }

    if (evento.key === '/') {
      evento.preventDefault();

      setMostrarFiltros(true);
      setMostrarExportacion(false);

      requestAnimationFrame(() => {
        document
          .getElementById('busqueda')
          ?.focus();
      });
    }
  };

  window.addEventListener(
    'keydown',
    manejarAtajos
  );

  return () => {
    window.removeEventListener(
      'keydown',
      manejarAtajos
    );
  };
}, []);

  const manejarExportacion = async (formato) => {
  try {
    setExportando(true);
    setErrorExportacion('');

    // Sin params:
    // siempre exportamos TODAS
    // las tareas del usuario.
    const respuesta =
      await api.get('/tareas');

    const todasLasTareas =
      respuesta.data.tareas;

    if (formato === 'csv') {
      exportarTareasCSV(
        todasLasTareas
      );
    }

    if (formato === 'json') {
      exportarTareasJSON(
        todasLasTareas
      );
    }

    setMostrarExportacion(false);
  } catch (error) {
    console.error(error);

    setErrorExportacion(
      error.response?.data?.error ||
      'No se pudieron exportar las tareas'
    );
  } finally {
    setExportando(false);
  }
};

  return (
    <div className={estilos.pagina}>
      <div className={estilos.encabezado}>
        <div>
          <h1>Mis tareas</h1>

          <p>
            Crea, filtra y administra tus actividades
            desde cualquier lugar.
          </p>
        </div>


        <div className={estilos.accionesEncabezado}>
          <div className={estilos.exportacion}>
            <button
              type="button"
              className={estilos.botonExportar}
              onClick={() =>
                setMostrarExportacion(
                  !mostrarExportacion
                )
              }
              disabled={exportando}
              aria-expanded={mostrarExportacion}
            >
              <Download size={15} />

              {exportando
                ? 'Exportando...'
                : 'Exportar'}

              {!exportando && (
                <ChevronDown size={14} />
              )}
            </button>

            {mostrarExportacion && (
              <div className={estilos.menuExportacion}>
                <button
                  type="button"
                  onClick={() =>
                    manejarExportacion('csv')
                  }
                >
                  <span
                    className={
                      estilos.iconoExportacionCSV
                    }
                  >
                    <FileSpreadsheet size={17} />
                  </span>

                  <div>
                    <strong>Exportar CSV</strong>
                    <span>
                      Compatible con Excel
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    manejarExportacion('json')
                  }
                >
                  <span
                    className={
                      estilos.iconoExportacionJSON
                    }
                  >
                    <Braces size={17} />
                  </span>

                  <div>
                    <strong>Exportar JSON</strong>
                    <span>
                      Datos estructurados
                    </span>
                  </div>
                </button>
              </div>
            )}
          </div>
          <button
            type="button"
            className={estilos.botonFiltros}
            onClick={() =>
              setMostrarFiltros(!mostrarFiltros)
            }
            title="Atajo: F"
          >
            <span>
              {mostrarFiltros
                ? 'Ocultar filtros'
                : 'Filtrar tareas'}
            </span>

            <kbd className={estilos.atajo}>
              F
            </kbd>
          </button>

          <button
            type="button"
            className={estilos.botonNuevaTarea}
            onClick={() =>
              setMostrarFormulario(
                !mostrarFormulario
              )
            }
            title="Atajo: N"
          >
            <span>
              {mostrarFormulario
                ? 'Cancelar'
                : '+ Nueva tarea'}
            </span>

            <kbd className={estilos.atajo}>
              N
            </kbd>
          </button>
        </div>
      </div>
              <ResumenTareas
          estadisticas={estadisticas}
          cargando={cargandoEstadisticas}
        />

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
      <MensajeError mensaje={errorExportacion} />

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