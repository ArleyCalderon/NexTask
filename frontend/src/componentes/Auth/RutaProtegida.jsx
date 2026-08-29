import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Cargando from '../Comunes/Cargando';

function RutaProtegida({ children }) {
  const { usuario, cargando } = useAuth();

  if (cargando) {
    return <Cargando mensaje="Verificando sesión..." />;
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default RutaProtegida;