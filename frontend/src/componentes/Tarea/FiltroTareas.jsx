import { useState } from 'react';
import useCategorias from '../../hooks/useCategorias';
import MensajeError from '../Comunes/MensajeError';
import estilos from './FiltroTareas.module.css';

function FiltroTareas({
  onFiltrar,
  etiquetasDisponibles,
  cargandoEtiquetas,
}) {
  const [busqueda, setBusqueda] = useState('');
  const [prioridad, setPrioridad] = useState('');
  const [completada, setCompletada] = useState('');
  const [categoria, setCategoria] = useState('');
  const [etiqueta, setEtiqueta] = useState('');

  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  const [ordenar, setOrdenar] = useState('');
  const [direccion, setDireccion] = useState('asc');

  const [errorFiltro, setErrorFiltro] = useState('');

  const {
    categorias,
    cargandoCategorias,
    errorCategorias,
  } = useCategorias();

  const manejarSubmit = (e) => {
    e.preventDefault();

    setErrorFiltro('');

    if (
      (fechaDesde && !fechaHasta) ||
      (!fechaDesde && fechaHasta)
    ) {
      setErrorFiltro(
        'Debes seleccionar las dos fechas del rango'
      );

      return;
    }

    if (
      fechaDesde &&
      fechaHasta &&
      fechaDesde > fechaHasta
    ) {
      setErrorFiltro(
        'La fecha inicial no puede ser posterior a la final'
      );

      return;
    }

    const filtros = {};

    if (busqueda.trim()) {
      filtros.busqueda = busqueda.trim();
    }

    if (prioridad) {
      filtros.prioridad = prioridad;
    }

    if (completada !== '') {
      filtros.completada = completada;
    }

    if (categoria) {
      filtros.categoria = categoria;
    }

    if (etiqueta) {
      filtros.etiquetas = etiqueta;
    }

    if (fechaDesde && fechaHasta) {
      filtros.fecha_vencimiento =
        `${fechaDesde},${fechaHasta}`;
    }

    if (ordenar) {
      filtros.ordenar = ordenar;
      filtros.direccion = direccion;
    }

    onFiltrar(filtros);
  };

  const limpiarFiltros = () => {
    setBusqueda('');
    setPrioridad('');
    setCompletada('');
    setCategoria('');
    setEtiqueta('');

    setFechaDesde('');
    setFechaHasta('');

    setOrdenar('');
    setDireccion('asc');

    setErrorFiltro('');

    onFiltrar({});
  };

 return (
  <form
    onSubmit={manejarSubmit}
    className={estilos.filtros}
  >
    <div className={estilos.encabezado}>
      <div>
        <h2>Filtrar tareas</h2>
        <p>Encuentra rápidamente las actividades que necesitas.</p>
      </div>
    </div>

    <div className={estilos.grid}>
      <div className={`${estilos.campo} ${estilos.busqueda}`}>
        <label htmlFor="busqueda">Buscar</label>

        <input
          id="busqueda"
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Título o descripción"
        />
      </div>

      <div className={estilos.campo}>
        <label htmlFor="prioridadFiltro">Prioridad</label>

        <select
          id="prioridadFiltro"
          value={prioridad}
          onChange={(e) => setPrioridad(e.target.value)}
        >
          <option value="">Todas</option>
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
        </select>
      </div>

      <div className={estilos.campo}>
        <label htmlFor="estadoFiltro">Estado</label>

        <select
          id="estadoFiltro"
          value={completada}
          onChange={(e) => setCompletada(e.target.value)}
        >
          <option value="">Todas</option>
          <option value="false">Pendientes</option>
          <option value="true">Completadas</option>
        </select>
      </div>

      <div className={estilos.campo}>
        <label htmlFor="categoriaFiltro">Categoría</label>

        <select
          id="categoriaFiltro"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          disabled={cargandoCategorias}
        >
          <option value="">Todas</option>

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

      <div className={estilos.campo}>
        <label htmlFor="etiquetaFiltro">Etiqueta</label>

        <select
          id="etiquetaFiltro"
          value={etiqueta}
          onChange={(e) => setEtiqueta(e.target.value)}
          disabled={cargandoEtiquetas}
        >
          <option value="">Todas</option>

          {etiquetasDisponibles.map((etiqueta) => (
            <option
              key={etiqueta.id}
              value={etiqueta.nombre}
            >
              {etiqueta.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className={estilos.campo}>
        <label htmlFor="fechaDesde">Vence desde</label>

        <input
          id="fechaDesde"
          type="date"
          value={fechaDesde}
          onChange={(e) => setFechaDesde(e.target.value)}
        />
      </div>

      <div className={estilos.campo}>
        <label htmlFor="fechaHasta">Vence hasta</label>

        <input
          id="fechaHasta"
          type="date"
          value={fechaHasta}
          onChange={(e) => setFechaHasta(e.target.value)}
        />
      </div>

      <div className={estilos.campo}>
        <label htmlFor="ordenarFiltro">Ordenar por</label>

        <select
          id="ordenarFiltro"
          value={ordenar}
          onChange={(e) => setOrdenar(e.target.value)}
        >
          <option value="">Orden predeterminado</option>
          <option value="creado_en">Fecha de creación</option>
          <option value="fecha_vencimiento">Fecha de vencimiento</option>
          <option value="prioridad">Prioridad</option>
          <option value="titulo">Título</option>
        </select>
      </div>

      <div className={estilos.campo}>
        <label htmlFor="direccionFiltro">Dirección</label>

        <select
          id="direccionFiltro"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          disabled={!ordenar}
        >
          <option value="asc">Ascendente</option>
          <option value="desc">Descendente</option>
        </select>
      </div>
    </div>

    <MensajeError mensaje={errorCategorias} />
    <MensajeError mensaje={errorFiltro} />

    <div className={estilos.acciones}>
      <button
        type="button"
        className={estilos.limpiar}
        onClick={limpiarFiltros}
      >
        Limpiar
      </button>

      <button
        type="submit"
        className={estilos.aplicar}
      >
        Aplicar filtros
      </button>
    </div>
  </form>
);
}

export default FiltroTareas;