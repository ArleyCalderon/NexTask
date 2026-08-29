import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { ContextoAuth } from '../../contexto/ContextoAuth';
import Cargando from '../Comunes/Cargando';

function RutaProtegida({ children }) {
  const { usuario, cargando } = useContext(ContextoAuth);

  if (cargando) {
    return <Cargando mensaje="Verificando sesión..." />;
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default RutaProtegida;