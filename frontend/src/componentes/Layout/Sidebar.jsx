import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { ContextoAuth } from '../../contexto/ContextoAuth';

function Sidebar() {
  const { logout } = useContext(ContextoAuth);

  return (
    <aside>
      <nav>
        <ul>
          <li>
            <NavLink to="/tareas">
              Tareas
            </NavLink>
          </li>

          <li>
            <NavLink to="/categorias">
              Categorías
            </NavLink>
          </li>

          <li>
            <NavLink to="/etiquetas">
              Etiquetas
            </NavLink>
          </li>
        </ul>
      </nav>

      <button
        type="button"
        onClick={logout}
      >
        Cerrar sesión
      </button>
    </aside>
  );
}

export default Sidebar;