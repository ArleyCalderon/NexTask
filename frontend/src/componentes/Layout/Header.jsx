import { useContext } from 'react';
import { ContextoAuth } from '../../contexto/ContextoAuth';

function Header() {
  const { usuario } = useContext(ContextoAuth);

  return (
    <header>
      <h1>NexTask</h1>

      {usuario && (
        <div>
          <span>{usuario.nombre}</span>
        </div>
      )}
    </header>
  );
}

export default Header;