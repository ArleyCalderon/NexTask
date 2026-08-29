import { useState } from 'react';

import useEtiquetas from '../../hooks/useEtiquetas';
import FormularioEtiqueta from './FormularioEtiqueta';
import Cargando from '../Comunes/Cargando';
import MensajeError from '../Comunes/MensajeError';

import estilos from './ListaEtiquetas.module.css';

function ListaEtiquetas() {
  const [mostrarFormulario, setMostrarFormulario] =
    useState(false);

  const {
    etiquetas,
    cargandoEtiquetas,
    errorEtiquetas,
    crearEtiqueta,
  } = useEtiquetas();

  const manejarCrear = async (nombre) => {
    await crearEtiqueta(nombre);
    setMostrarFormulario(false);
  };

  if (cargandoEtiquetas) {
    return (
      <Cargando mensaje="Cargando etiquetas..." />
    );
  }

  return (
    <div className={estilos.pagina}>
      <div className={estilos.encabezado}>
        <div>
          <h1>Etiquetas</h1>

          <p>
            Crea etiquetas para clasificar tus tareas
            con mayor detalle.
          </p>
        </div>

        <button
          type="button"
          className={estilos.nuevaEtiqueta}
          onClick={() =>
            setMostrarFormulario(
              !mostrarFormulario
            )
          }
        >
          {mostrarFormulario
            ? 'Cancelar'
            : '+ Nueva etiqueta'}
        </button>
      </div>

      {mostrarFormulario && (
        <div className={estilos.panelFormulario}>
          <FormularioEtiqueta
            onCrear={manejarCrear}
          />
        </div>
      )}

      <MensajeError mensaje={errorEtiquetas} />

      <section>
        <div className={estilos.tituloLista}>
          <h2>Tus etiquetas</h2>

          <p>
            {etiquetas.length === 1
              ? '1 etiqueta'
              : `${etiquetas.length} etiquetas`}
          </p>
        </div>

        {etiquetas.length === 0 ? (
          <div className={estilos.vacio}>
            <div className={estilos.iconoVacio}>
              #
            </div>

            <h3>No tienes etiquetas</h3>

            <p>
              Crea una etiqueta para clasificar tus
              tareas.
            </p>
          </div>
        ) : (
          <div className={estilos.etiquetas}>
            {etiquetas.map((etiqueta) => (
              <span
                key={etiqueta.id}
                className={estilos.etiqueta}
              >
                #{etiqueta.nombre}
              </span>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default ListaEtiquetas;