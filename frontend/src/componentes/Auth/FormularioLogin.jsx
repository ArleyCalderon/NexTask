import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { ContextoAuth } from '../../contexto/ContextoAuth';
import MensajeError from '../Comunes/MensajeError';

import estilos from './Auth.module.css';

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
    <main className={estilos.pagina}>
      <section className={estilos.tarjeta}>
        <div className={estilos.marca}>
          <div className={estilos.logo}>
            N
          </div>

          <div>
            <h1>NexTask</h1>
            <span>Gestor de tareas</span>
          </div>
        </div>

        <div className={estilos.encabezado}>
          <h2>Bienvenido de nuevo</h2>

          <p>
            Inicia sesión para continuar organizando
            tus actividades.
          </p>
        </div>

        <form
          onSubmit={manejarSubmit}
          className={estilos.formulario}
        >
          <div className={estilos.campo}>
            <label htmlFor="email">
              Correo electrónico
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="nombre@correo.com"
              autoComplete="email"
              required
            />
          </div>

          <div className={estilos.campo}>
            <label htmlFor="password">
              Contraseña
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Ingresa tu contraseña"
              autoComplete="current-password"
              required
            />
          </div>

          <MensajeError mensaje={error} />

          <button
            type="submit"
            className={estilos.botonPrincipal}
            disabled={enviando}
          >
            {enviando
              ? 'Ingresando...'
              : 'Iniciar sesión'}
          </button>
        </form>

        <p className={estilos.enlaceInferior}>
          ¿No tienes una cuenta?{' '}
          <Link to="/registro">
            Crear cuenta
          </Link>
        </p>
      </section>
    </main>
  );
}

export default FormularioLogin;