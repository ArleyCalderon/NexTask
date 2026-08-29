import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { ContextoAuth } from '../../contexto/ContextoAuth';

function RutaProtegida({ children }) {
  const { usuario, cargando } = useContext(ContextoAuth);

  if (cargando) {
    return <p>Cargando...</p>;
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default RutaProtegida;