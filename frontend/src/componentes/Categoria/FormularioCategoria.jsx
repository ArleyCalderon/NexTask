import { useState } from 'react';
import MensajeError from '../Comunes/MensajeError';
import estilos from './FormularioCategoria.module.css';

function FormularioCategoria({
  onCrear,
  onActualizar,
  categoriaInicial = null,
  onCancelar,
}) {
  const esEdicion = Boolean(categoriaInicial);

  const [nombre, setNombre] = useState(
    categoriaInicial?.nombre || ''
  );

  const [color, setColor] = useState(
    categoriaInicial?.color || '#2563EB'
  );

  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const manejarSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setEnviando(true);

    const datosCategoria = {
      nombre: nombre.trim(),
      color,
    };

    try {
      if (esEdicion) {
        await onActualizar(
          categoriaInicial.id,
          datosCategoria
        );

        onCancelar();
      } else {
        await onCrear(datosCategoria);

        setNombre('');
        setColor('#2563EB');
      }
    } catch (error) {
      setError(
        error.response?.data?.error ||
        `No se pudo ${
          esEdicion ? 'actualizar' : 'crear'
        } la categoría`
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
  <form
    onSubmit={manejarSubmit}
    className={estilos.formulario}
  >
    <div className={estilos.encabezado}>
      <h2>
        {esEdicion
          ? 'Editar categoría'
          : 'Nueva categoría'}
      </h2>

      <p>
        {esEdicion
          ? 'Modifica el nombre o color de la categoría.'
          : 'Crea un grupo para organizar tus tareas.'}
      </p>
    </div>

    <div className={estilos.campos}>
      <div className={estilos.campoNombre}>
        <label
          htmlFor={`nombreCategoria-${categoriaInicial?.id || 'nueva'}`}
        >
          Nombre
        </label>

        <input
          id={`nombreCategoria-${categoriaInicial?.id || 'nueva'}`}
          type="text"
          value={nombre}
          onChange={(e) =>
            setNombre(e.target.value)
          }
          placeholder="Ej. Universidad"
          required
        />
      </div>

      <div className={estilos.campoColor}>
        <label
          htmlFor={`colorCategoria-${categoriaInicial?.id || 'nueva'}`}
        >
          Color
        </label>

        <div className={estilos.selectorColor}>
          <input
            id={`colorCategoria-${categoriaInicial?.id || 'nueva'}`}
            type="color"
            value={color}
            onChange={(e) =>
              setColor(e.target.value)
            }
          />

          <span>{color}</span>
        </div>
      </div>
    </div>

    <MensajeError mensaje={error} />

    <div className={estilos.acciones}>
      {esEdicion && (
        <button
          type="button"
          className={estilos.cancelar}
          onClick={onCancelar}
          disabled={enviando}
        >
          Cancelar
        </button>
      )}

      <button
        type="submit"
        className={estilos.guardar}
        disabled={enviando}
      >
        {enviando
          ? 'Guardando...'
          : esEdicion
            ? 'Guardar cambios'
            : 'Crear categoría'}
      </button>
    </div>
  </form>
);
}

export default FormularioCategoria;