import { useState } from 'react';
import MensajeError from '../Comunes/MensajeError';

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
    <form onSubmit={manejarSubmit}>
      <h2>
        {esEdicion
          ? 'Editar categoría'
          : 'Nueva categoría'}
      </h2>

      <div>
        <label
          htmlFor={`nombreCategoria-${categoriaInicial?.id || 'nueva'}`}
        >
          Nombre
        </label>

        <input
          id={`nombreCategoria-${categoriaInicial?.id || 'nueva'}`}
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </div>

      <div>
        <label
          htmlFor={`colorCategoria-${categoriaInicial?.id || 'nueva'}`}
        >
          Color
        </label>

        <input
          id={`colorCategoria-${categoriaInicial?.id || 'nueva'}`}
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      </div>

      <MensajeError mensaje={error} />

      <button
        type="submit"
        disabled={enviando}
      >
        {enviando
          ? 'Guardando...'
          : esEdicion
            ? 'Guardar cambios'
            : 'Crear categoría'}
      </button>

      {esEdicion && (
        <button
          type="button"
          onClick={onCancelar}
          disabled={enviando}
        >
          Cancelar
        </button>
      )}
    </form>
  );
}

export default FormularioCategoria;