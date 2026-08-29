import { useState } from 'react';

function FormularioEtiqueta({ onCrear }) {
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const manejarSubmit = async (e) => {
    e.preventDefault();

    const nombreLimpio = nombre.trim();

    if (!nombreLimpio) {
      setError('El nombre es obligatorio');
      return;
    }

    setError('');
    setEnviando(true);

    try {
      await onCrear(nombreLimpio);

      setNombre('');
    } catch (error) {
      setError(
        error.response?.data?.error ||
        'No se pudo crear la etiqueta'
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={manejarSubmit}>
      <h2>Nueva etiqueta</h2>

      <div>
        <label htmlFor="nombreEtiqueta">
          Nombre
        </label>

        <input
          id="nombreEtiqueta"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </div>

      {error && <p>{error}</p>}

      <button
        type="submit"
        disabled={enviando}
      >
        {enviando
          ? 'Creando...'
          : 'Crear etiqueta'}
      </button>
    </form>
  );
}

export default FormularioEtiqueta;