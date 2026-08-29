import { useState } from 'react';
import useCategorias from '../../hooks/useCategorias';

function FormularioTarea({ onCrear }) {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [prioridad, setPrioridad] = useState('media');
  const [categoriaId, setCategoriaId] = useState('');
  const [fechaVencimiento, setFechaVencimiento] = useState('');

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

    const nuevaTarea = {
      titulo: titulo.trim(),
      prioridad,
    };

    if (descripcion.trim()) {
      nuevaTarea.descripcion = descripcion.trim();
    }

    if (categoriaId) {
      nuevaTarea.categoria_id = Number(categoriaId);
    }

    if (fechaVencimiento) {
      nuevaTarea.fecha_vencimiento = fechaVencimiento;
    }

    try {
      await onCrear(nuevaTarea);

      setTitulo('');
      setDescripcion('');
      setPrioridad('media');
      setCategoriaId('');
      setFechaVencimiento('');
    } catch (error) {
      setError(
        error.response?.data?.error ||
        'No se pudo crear la tarea'
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={manejarSubmit}>
      <h2>Nueva tarea</h2>

      <div>
        <label htmlFor="titulo">Título</label>

        <input
          id="titulo"
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          maxLength={200}
          required
        />
      </div>

      <div>
        <label htmlFor="descripcion">Descripción</label>

        <textarea
          id="descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="prioridad">Prioridad</label>

        <select
          id="prioridad"
          value={prioridad}
          onChange={(e) => setPrioridad(e.target.value)}
        >
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
        </select>
      </div>

      <div>
        <label htmlFor="categoria">Categoría</label>

        <select
          id="categoria"
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
        <label htmlFor="fechaVencimiento">
          Fecha de vencimiento
        </label>

        <input
          id="fechaVencimiento"
          type="date"
          value={fechaVencimiento}
          onChange={(e) => setFechaVencimiento(e.target.value)}
        />
      </div>

      {errorCategorias && <p>{errorCategorias}</p>}
      {error && <p>{error}</p>}

      <button
        type="submit"
        disabled={enviando || cargandoCategorias}
      >
        {enviando ? 'Creando...' : 'Crear tarea'}
      </button>
    </form>
  );
}

export default FormularioTarea;