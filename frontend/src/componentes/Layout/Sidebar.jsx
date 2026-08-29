import { NavLink } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

import estilos from './Sidebar.module.css';

function Sidebar() {
  const { logout } = useAuth();

  const obtenerClaseEnlace = ({ isActive }) =>
    `${estilos.enlace} ${isActive ? estilos.activo : ''}`;

  return (
    <aside className={estilos.sidebar}>
      <div>
        <div className={estilos.marca}>
          <div className={estilos.logo}>N</div>

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
            <span className={estilos.icono}>✓</span>
            Tareas
          </NavLink>

          <NavLink
            to="/categorias"
            className={obtenerClaseEnlace}
          >
            <span className={estilos.icono}>▦</span>
            Categorías
          </NavLink>

          <NavLink
            to="/etiquetas"
            className={obtenerClaseEnlace}
          >
            <span className={estilos.icono}>#</span>
            Etiquetas
          </NavLink>
        </nav>
      </div>

      <button
        type="button"
        className={estilos.cerrarSesion}
        onClick={logout}
      >
        Cerrar sesión
      </button>
    </aside>
  );
}

export default Sidebar;