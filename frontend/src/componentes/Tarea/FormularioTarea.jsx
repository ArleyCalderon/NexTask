import { useState } from 'react';
import useCategorias from '../../hooks/useCategorias';


function FormularioTarea({
  onCrear,
  onActualizar,
  tareaInicial = null,
  onCancelar,
}) {
  
  const esEdicion = Boolean(tareaInicial);

  const [titulo, setTitulo] = useState(
    tareaInicial?.titulo || ''
  );

  const [descripcion, setDescripcion] = useState(
    tareaInicial?.descripcion || ''
  );

  const [prioridad, setPrioridad] = useState(
    tareaInicial?.prioridad || 'media'
  );

  const [categoriaId, setCategoriaId] = useState(
    tareaInicial?.categoria_id || ''
  );

  const [fechaVencimiento, setFechaVencimiento] = useState(
    tareaInicial?.fecha_vencimiento
      ? tareaInicial.fecha_vencimiento.split('T')[0]
      : ''
  );

  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const {
    categorias,
    cargandoCategorias,
    errorCategorias,
  } = useCategorias();

  const manejarSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setEnviando(true);

    const datosTarea = {
      titulo: titulo.trim(),
      prioridad,
      categoria_id: categoriaId
        ? Number(categoriaId)
        : null,
      descripcion: descripcion.trim() || null,
      fecha_vencimiento: fechaVencimiento || null,
    };

    try {
      if (esEdicion) {
        await onActualizar(
          tareaInicial.id,
          datosTarea
        );

        onCancelar();
      } else {
        await onCrear(datosTarea);

        setTitulo('');
        setDescripcion('');
        setPrioridad('media');
        setCategoriaId('');
        setFechaVencimiento('');
      }
    } catch (error) {
      setError(
        error.response?.data?.error ||
        `No se pudo ${
          esEdicion ? 'actualizar' : 'crear'
        } la tarea`
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={manejarSubmit}>
      <h2>
        {esEdicion ? 'Editar tarea' : 'Nueva tarea'}
      </h2>

      <div>
        <label htmlFor={`titulo-${tareaInicial?.id || 'nueva'}`}>
          Título
        </label>

        <input
          id={`titulo-${tareaInicial?.id || 'nueva'}`}
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          maxLength={200}
          required
        />
      </div>

      <div>
        <label
          htmlFor={`descripcion-${tareaInicial?.id || 'nueva'}`}
        >
          Descripción
        </label>

        <textarea
          id={`descripcion-${tareaInicial?.id || 'nueva'}`}
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </div>

      <div>
        <label
          htmlFor={`prioridad-${tareaInicial?.id || 'nueva'}`}
        >
          Prioridad
        </label>

        <select
          id={`prioridad-${tareaInicial?.id || 'nueva'}`}
          value={prioridad}
          onChange={(e) => setPrioridad(e.target.value)}
        >
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
        </select>
      </div>

      <div>
        <label
          htmlFor={`categoria-${tareaInicial?.id || 'nueva'}`}
        >
          Categoría
        </label>

        <select
          id={`categoria-${tareaInicial?.id || 'nueva'}`}
          value={categoriaId}
          onChange={(e) => setCategoriaId(e.target.value)}
          disabled={cargandoCategorias}
        >
          <option value="">
            {cargandoCategorias
              ? 'Cargando categorías...'
              : 'Sin categoría'}
          </option>

          {categorias.map((categoria) => (
            <option
              key={categoria.id}
              value={categoria.id}
            >
              {categoria.nombre}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor={`fecha-${tareaInicial?.id || 'nueva'}`}
        >
          Fecha de vencimiento
        </label>

        <input
          id={`fecha-${tareaInicial?.id || 'nueva'}`}
          type="date"
          value={fechaVencimiento}
          onChange={(e) =>
            setFechaVencimiento(e.target.value)
          }
        />
      </div>

      {errorCategorias && <p>{errorCategorias}</p>}
      {error && <p>{error}</p>}

      <button
        type="submit"
        disabled={enviando || cargandoCategorias}
      >
        {enviando
          ? 'Guardando...'
          : esEdicion
            ? 'Guardar cambios'
            : 'Crear tarea'}
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

export default FormularioTarea;