import { NavLink } from 'react-router-dom';

import {
  Folder,
  ListTodo,
  LogOut,
  Sparkles,
  Tags,
} from 'lucide-react';

import useAuth from '../../hooks/useAuth';

import estilos from './Sidebar.module.css';

function Sidebar({
  estadisticas,
  cargandoEstadisticas,
}) {
  const {
    logout,
    usuario,
  } = useAuth();

  const obtenerClaseEnlace =
    ({ isActive }) =>
      `${estilos.enlace} ${
        isActive ? estilos.activo : ''
      }`;

  const {
    total,
    completadas,
    porcentajeCompletado,
  } = estadisticas;

  const primerNombre =
    usuario?.nombre?.split(' ')[0] ||
    'ahí';

  const obtenerMensajeProgreso = () => {
    if (total === 0) {
      return 'Crea tu primera tarea para comenzar.';
    }

    if (porcentajeCompletado === 100) {
      return '¡Todo completado! Excelente trabajo.';
    }

    if (porcentajeCompletado >= 75) {
      return `¡Ya casi terminas, ${primerNombre}!`;
    }

    if (porcentajeCompletado >= 50) {
      return `¡Vas por muy buen camino, ${primerNombre}!`;
    }

    if (porcentajeCompletado >= 25) {
      return `Buen progreso, ${primerNombre}.`;
    }

    return 'Todo gran avance empieza por una tarea.';
  };

  return (
    <aside className={estilos.sidebar}>
      <div>
        <div className={estilos.marca}>
          <div className={estilos.logo}>
            N
          </div>

          <div>
            <h1>NexTask</h1>
            <span>Gestor de tareas</span>
          </div>
        </div>

        <nav className={estilos.navegacion}>
          <NavLink
            to="/tareas"
            className={obtenerClaseEnlace}
          >
            <ListTodo size={18} />
            Tareas
          </NavLink>

          <NavLink
            to="/categorias"
            className={obtenerClaseEnlace}
          >
            <Folder size={18} />
            Categorías
          </NavLink>

          <NavLink
            to="/etiquetas"
            className={obtenerClaseEnlace}
          >
            <Tags size={18} />
            Etiquetas
          </NavLink>
        </nav>
      </div>

      <div className={estilos.inferior}>
        <section className={estilos.progreso}>
          <div className={estilos.tituloProgreso}>
            <Sparkles size={16} />

            <span>Tu progreso</span>
          </div>

          <p>
            {cargandoEstadisticas
              ? 'Calculando tu progreso...'
              : obtenerMensajeProgreso()}
          </p>

          <div className={estilos.barraProgreso}>
            <div
              className={
                estilos.barraCompletada
              }
              style={{
                width:
                  `${
                    cargandoEstadisticas
                      ? 0
                      : porcentajeCompletado
                  }%`,
              }}
            />
          </div>

          <div className={estilos.detalleProgreso}>
            <span>
              {cargandoEstadisticas
                ? 'Cargando...'
                : `${completadas} de ${total} completadas`}
            </span>

            <strong>
              {cargandoEstadisticas
                ? '—'
                : `${porcentajeCompletado}%`}
            </strong>
          </div>
        </section>

        <button
          type="button"
          className={estilos.cerrarSesion}
          onClick={logout}
        >
          <LogOut size={17} />

          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;