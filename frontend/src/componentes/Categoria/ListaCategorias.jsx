import { useState } from 'react';

import useCategorias from '../../hooks/useCategorias';
import FormularioCategoria from './FormularioCategoria';
import Cargando from '../Comunes/Cargando';
import MensajeError from '../Comunes/MensajeError';

import estilos from './ListaCategorias.module.css';

function ListaCategorias() {
  const [categoriaEditando, setCategoriaEditando] =
    useState(null);

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false);

  const {
    categorias,
    cargandoCategorias,
    errorCategorias,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
  } = useCategorias();

  const manejarCrear = async (datosCategoria) => {
    await crearCategoria(datosCategoria);
    setMostrarFormulario(false);
  };

  const manejarEditar = (categoria) => {
    setCategoriaEditando(categoria);
    setMostrarFormulario(false);
  };

  const manejarEliminar = async (categoria) => {
    const confirmar = window.confirm(
      `¿Eliminar la categoría "${categoria.nombre}"?`
    );

    if (!confirmar) {
      return;
    }

    try {
      await eliminarCategoria(categoria.id);
    } catch (error) {
      console.error(error);
    }
  };

  if (cargandoCategorias) {
    return (
      <Cargando mensaje="Cargando categorías..." />
    );
  }

  return (
    <div className={estilos.pagina}>
      <div className={estilos.encabezado}>
        <div>
          <h1>Categorías</h1>

          <p>
            Organiza tus tareas utilizando grupos
            personalizados.
          </p>
        </div>

        {!categoriaEditando && (
          <button
            type="button"
            className={estilos.nuevaCategoria}
            onClick={() =>
              setMostrarFormulario(
                !mostrarFormulario
              )
            }
          >
            {mostrarFormulario
              ? 'Cancelar'
              : '+ Nueva categoría'}
          </button>
        )}
      </div>

      {categoriaEditando ? (
        <div className={estilos.panelFormulario}>
          <FormularioCategoria
            categoriaInicial={categoriaEditando}
            onActualizar={actualizarCategoria}
            onCancelar={() =>
              setCategoriaEditando(null)
            }
          />
        </div>
      ) : (
        mostrarFormulario && (
          <div className={estilos.panelFormulario}>
            <FormularioCategoria
              onCrear={manejarCrear}
            />
          </div>
        )
      )}

      <MensajeError mensaje={errorCategorias} />

      <section>
        <div className={estilos.tituloLista}>
          <h2>Tus categorías</h2>

          <p>
            {categorias.length === 1
              ? '1 categoría'
              : `${categorias.length} categorías`}
          </p>
        </div>

        {categorias.length === 0 ? (
          <div className={estilos.vacio}>
            <div className={estilos.iconoVacio}>
              ▦
            </div>

            <h3>No tienes categorías</h3>

            <p>
              Crea una para empezar a organizar tus
              tareas.
            </p>
          </div>
        ) : (
          <div className={estilos.grid}>
            {categorias.map((categoria) => (
              <article
                key={categoria.id}
                className={estilos.categoria}
              >
                <div className={estilos.info}>
                  <span
                    className={estilos.color}
                    style={{
                      backgroundColor:
                        categoria.color,
                    }}
                  />

                  <div>
                    <h3>{categoria.nombre}</h3>

                    <span className={estilos.codigoColor}>
                      {categoria.color}
                    </span>
                  </div>
                </div>

                <div className={estilos.acciones}>
                  <button
                    type="button"
                    className={estilos.editar}
                    onClick={() =>
                      manejarEditar(categoria)
                    }
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    className={estilos.eliminar}
                    onClick={() =>
                      manejarEliminar(categoria)
                    }
                  >
                    Eliminar
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default ListaCategorias;