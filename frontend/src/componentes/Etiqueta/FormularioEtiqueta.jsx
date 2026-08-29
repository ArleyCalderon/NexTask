import { useState } from 'react';

import {
  Plus,
  Tag,
} from 'lucide-react';

import MensajeError from '../Comunes/MensajeError';

import estilos from './FormularioEtiqueta.module.css';

function FormularioEtiqueta({ onCrear }) {
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] =
    useState(false);

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
    <form
      onSubmit={manejarSubmit}
      className={estilos.formulario}
    >
      <div className={estilos.encabezado}>
        <div className={estilos.iconoEncabezado}>
          <Tag size={19} />
        </div>

        <div>
          <h2>Nueva etiqueta</h2>

          <p>
            Crea una etiqueta para clasificar tus tareas.
          </p>
        </div>
      </div>

      <div className={estilos.contenido}>
        <div className={estilos.campo}>
          <label htmlFor="nombreEtiqueta">
            Nombre
          </label>

          <input
            id="nombreEtiqueta"
            type="text"
            value={nombre}
            onChange={(e) =>
              setNombre(e.target.value)
            }
            placeholder="Ej. importante"
            required
          />
        </div>

        <button
          type="submit"
          disabled={enviando}
        >
          <Plus size={15} />

          {enviando
            ? 'Creando...'
            : 'Crear etiqueta'}
        </button>
      </div>

      <MensajeError mensaje={error} />
    </form>
  );
}

export default FormularioEtiqueta;