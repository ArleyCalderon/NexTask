import { useState } from 'react';
import useCategorias from '../../hooks/useCategorias';
import FormularioCategoria from './FormularioCategoria';

function ListaCategorias() {
  const [categoriaEditando, setCategoriaEditando] =
    useState(null);

  const {
    categorias,
    cargandoCategorias,
    errorCategorias,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
  } = useCategorias();

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
    return <p>Cargando categorías...</p>;
  }

  return (
    <div>
      <h1>Categorías</h1>

      {categoriaEditando ? (
        <FormularioCategoria
          categoriaInicial={categoriaEditando}
          onActualizar={actualizarCategoria}
          onCancelar={() =>
            setCategoriaEditando(null)
          }
        />
      ) : (
        <FormularioCategoria
          onCrear={crearCategoria}
        />
      )}

      {errorCategorias && (
        <p>{errorCategorias}</p>
      )}

      {categorias.length === 0 ? (
        <p>No tienes categorías.</p>
      ) : (
        <div>
          {categorias.map((categoria) => (
            <div key={categoria.id}>
              <span
                style={{
                  display: 'inline-block',
                  width: '14px',
                  height: '14px',
                  backgroundColor: categoria.color,
                  marginRight: '6px',
                }}
              />

              <strong>{categoria.nombre}</strong>

              <span>
                {' '}({categoria.color})
              </span>

              {' '}

              <button
                type="button"
                onClick={() =>
                  setCategoriaEditando(categoria)
                }
              >
                Editar
              </button>

              {' '}

              <button
                type="button"
                onClick={() =>
                  manejarEliminar(categoria)
                }
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ListaCategorias;