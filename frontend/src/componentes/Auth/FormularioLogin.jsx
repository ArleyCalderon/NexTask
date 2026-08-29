import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ContextoAuth } from '../../contexto/ContextoAuth';
import MensajeError from '../Comunes/MensajeError';

function FormularioLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const { login } = useContext(ContextoAuth);
  const navigate = useNavigate();

  const manejarSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setEnviando(true);

    try {
      await login(email, password);

      navigate('/tareas');
    } catch (error) {
      setError(
        error.response?.data?.error ||
        'Error al iniciar sesión'
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div>
      <h2>Iniciar sesión</h2>

      <form onSubmit={manejarSubmit}>
        <div>
          <label htmlFor="email">Correo</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <MensajeError mensaje={error} />

        <button type="submit" disabled={enviando}>
          {enviando ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
}

export default FormularioLogin;