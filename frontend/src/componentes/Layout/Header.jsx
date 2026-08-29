import { useContext } from 'react';
import { ContextoAuth } from '../../contexto/ContextoAuth';

import estilos from './Header.module.css';

function Header() {
  const { usuario } = useContext(ContextoAuth);

  const inicialUsuario =
    usuario?.nombre?.charAt(0)?.toUpperCase() || 'U';

  return (
    <header className={estilos.header}>
      <div>
        <p className={estilos.subtitulo}>
          Espacio de trabajo
        </p>

        <h2>NexTask</h2>
      </div>

      {usuario && (
        <div className={estilos.usuario}>
          <div className={estilos.datosUsuario}>
            <span className={estilos.nombre}>
              {usuario.nombre}
            </span>

            <span className={estilos.descripcion}>
              Mi cuenta
            </span>
          </div>

          <div className={estilos.avatar}>
            {inicialUsuario}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;