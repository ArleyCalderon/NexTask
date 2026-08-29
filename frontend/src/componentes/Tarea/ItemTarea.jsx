import { useState } from 'react';

import {
  CalendarDays,
  Check,
  FileText,
  Folder,
  Pencil,
  Plus,
  RotateCcw,
  Tag,
  Trash2,
  X,
} from 'lucide-react';

import FormularioTarea from './FormularioTarea';

import { formatearFecha } from '../../utils/helpers';

import estilos from './ItemTarea.module.css';

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

  const [
    etiquetaSeleccionada,
    setEtiquetaSeleccionada,
  ] = useState('');

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

  const manejarQuitarEtiqueta = async (
    etiquetaId
  ) => {
    await onQuitarEtiqueta(
      tarea.id,
      etiquetaId
    );
  };

  const idsEtiquetasActuales =
    tarea.etiquetas.map(
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

  const clasesAcento = {
    baja: estilos.acentoBajo,
    media: estilos.acentoMedio,
    alta: estilos.acentoAlto,
  };

  if (editando) {
    return (
      <article className={estilos.edicion}>
        <FormularioTarea
          tareaInicial={tarea}
          onActualizar={onActualizar}
          onCancelar={() =>
            setEditando(false)
          }
        />
      </article>
    );
  }

  return (
    <article
      className={`
        ${estilos.tarea}
        ${clasesAcento[tarea.prioridad]}
        ${
          tarea.completada
            ? estilos.tareaCompletada
            : ''
        }
      `}
    >
      <div className={estilos.cabecera}>
        <div className={estilos.identidad}>
          <div className={estilos.iconoTarea}>
            <FileText size={19} />
          </div>

          <div className={estilos.informacion}>
            <div className={estilos.tituloEstado}>
              <h3>{tarea.titulo}</h3>

              <span
                className={`
                  ${estilos.estado}
                  ${
                    tarea.completada
                      ? estilos.completada
                      : estilos.pendiente
                  }
                `}
              >
                {tarea.completada
                  ? 'Completada'
                  : 'Pendiente'}
              </span>
            </div>

            {tarea.descripcion && (
              <p className={estilos.descripcion}>
                {tarea.descripcion}
              </p>
            )}

            <div className={estilos.metadatos}>
              {tarea.categoria_nombre && (
                <span>
                  <Folder size={13} />

                  {tarea.categoria_nombre}
                </span>
              )}

              {tarea.fecha_vencimiento && (
                <span>
                  <CalendarDays size={13} />

                  {formatearFecha(
                    tarea.fecha_vencimiento
                  )}
                </span>
              )}
            </div>
          </div>
        </div>

        <span
          className={`
            ${estilos.prioridad}
            ${
              clasesPrioridad[
                tarea.prioridad
              ]
            }
          `}
        >
          {tarea.prioridad}
        </span>
      </div>

      <div className={estilos.etiquetas}>
        {tarea.etiquetas.length === 0 ? (
          <span className={estilos.sinEtiquetas}>
            <Tag size={12} />
            Sin etiquetas
          </span>
        ) : (
          tarea.etiquetas.map(
            (etiqueta) => (
              <span
                key={etiqueta.id}
                className={estilos.etiqueta}
              >
                #{etiqueta.nombre}

                <button
                  type="button"
                  onClick={() =>
                    manejarQuitarEtiqueta(
                      etiqueta.id
                    )
                  }
                  aria-label={
                    `Quitar etiqueta ${etiqueta.nombre}`
                  }
                >
                  <X size={11} />
                </button>
              </span>
            )
          )
        )}
      </div>

      <div className={estilos.pie}>
        <div className={estilos.agregarEtiqueta}>
          <div
            className={
              estilos.selectorEtiqueta
            }
          >
            <Tag size={14} />

            <select
              value={etiquetaSeleccionada}
              onChange={(e) =>
                setEtiquetaSeleccionada(
                  e.target.value
                )
              }
              disabled={
                cargandoEtiquetas ||
                etiquetasParaAgregar.length ===
                  0
              }
            >
              <option value="">
                {etiquetasParaAgregar.length ===
                0
                  ? 'Sin etiquetas disponibles'
                  : 'Agregar etiqueta'}
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
          </div>

          <button
            type="button"
            className={estilos.botonAgregar}
            onClick={manejarAgregarEtiqueta}
            disabled={!etiquetaSeleccionada}
            title="Agregar etiqueta"
          >
            <Plus size={15} />
            Agregar
          </button>
        </div>

        <div className={estilos.acciones}>
          <button
            type="button"
            className={estilos.completar}
            onClick={() =>
              onCambiarEstado(tarea.id)
            }
          >
            {tarea.completada ? (
              <>
                <RotateCcw size={15} />
                Pendiente
              </>
            ) : (
              <>
                <Check size={15} />
                Completar
              </>
            )}
          </button>

          <button
            type="button"
            className={estilos.editar}
            onClick={() =>
              setEditando(true)
            }
          >
            <Pencil size={14} />
            Editar
          </button>

          <button
            type="button"
            className={estilos.eliminar}
            onClick={manejarEliminar}
          >
            <Trash2 size={14} />
            Eliminar
          </button>
        </div>
      </div>
    </article>
  );
}

export default ItemTarea;