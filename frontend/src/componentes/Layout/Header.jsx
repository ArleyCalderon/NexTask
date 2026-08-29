import useAuth from '../../hooks/useAuth';

import estilos from './Header.module.css';

function Header() {
  const { usuario } = useAuth();

  const inicialUsuario =
    usuario?.nombre?.charAt(0)?.toUpperCase() || 'U';
    //throw new Error('Prueba ErrorBoundary');
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