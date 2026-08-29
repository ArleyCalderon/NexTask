import {
  Moon,
  Sun,
} from 'lucide-react';

import useAuth from '../../hooks/useAuth';
import useTema from '../../hooks/useTema';

import estilos from './Header.module.css';

function Header() {
  const { usuario } = useAuth();

  const {
    tema,
    alternarTema,
  } = useTema();

  const inicialUsuario =
    usuario?.nombre
      ?.charAt(0)
      ?.toUpperCase() || 'U';

  const temaOscuro = tema === 'dark';

  return (
    <header className={estilos.header}>
      <div>
        <p className={estilos.subtitulo}>
          Espacio de trabajo
        </p>

        <h2>NexTask</h2>
      </div>

      <div className={estilos.acciones}>
        <button
          type="button"
          className={estilos.botonTema}
          onClick={alternarTema}
          aria-label={
            temaOscuro
              ? 'Activar tema claro'
              : 'Activar tema oscuro'
          }
          title={
            temaOscuro
              ? 'Tema claro'
              : 'Tema oscuro'
          }
        >
          {temaOscuro ? (
            <Sun size={18} />
          ) : (
            <Moon size={18} />
          )}
        </button>

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
      </div>
    </header>
  );
}

export default Header;