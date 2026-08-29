import { useState } from 'react';
import {
  Link,
  useNavigate,
} from 'react-router-dom';

import {
  Eye,
  EyeOff,
  LockKeyhole,
  LogIn,
  Mail,
  Moon,
  Sun,
} from 'lucide-react';

import useAuth from '../../hooks/useAuth';
import useTema from '../../hooks/useTema';

import MensajeError from '../Comunes/MensajeError';

import estilos from './Auth.module.css';

function FormularioLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] =
    useState('');

  const [mostrarPassword, setMostrarPassword] =
    useState(false);

  const [error, setError] = useState('');
  const [enviando, setEnviando] =
    useState(false);

  const { login } = useAuth();

  const {
    tema,
    alternarTema,
  } = useTema();

  const navigate = useNavigate();

  const temaOscuro = tema === 'dark';

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
            Inicia sesión para continuar
            organizando tus actividades.
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

            <div className={estilos.inputContenedor}>
              <Mail
                size={17}
                className={estilos.iconoInput}
              />

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
          </div>

          <div className={estilos.campo}>
            <label htmlFor="password">
              Contraseña
            </label>

            <div className={estilos.inputContenedor}>
              <LockKeyhole
                size={17}
                className={estilos.iconoInput}
              />

              <input
                id="password"
                type={
                  mostrarPassword
                    ? 'text'
                    : 'password'
                }
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Ingresa tu contraseña"
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className={
                  estilos.botonMostrarPassword
                }
                onClick={() =>
                  setMostrarPassword(
                    !mostrarPassword
                  )
                }
                aria-label={
                  mostrarPassword
                    ? 'Ocultar contraseña'
                    : 'Mostrar contraseña'
                }
              >
                {mostrarPassword ? (
                  <EyeOff size={17} />
                ) : (
                  <Eye size={17} />
                )}
              </button>
            </div>
          </div>

          <MensajeError mensaje={error} />

          <button
            type="submit"
            className={estilos.botonPrincipal}
            disabled={enviando}
          >
            <LogIn size={17} />

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