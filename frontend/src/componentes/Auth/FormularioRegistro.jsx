import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { ContextoAuth } from '../../contexto/ContextoAuth';
import MensajeError from '../Comunes/MensajeError';

import estilos from './Auth.module.css';

function FormularioRegistro() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const { registro } = useContext(ContextoAuth);
  const navigate = useNavigate();

  const manejarSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setEnviando(true);

    try {
      await registro(nombre, email, password);

      navigate('/tareas');
    } catch (error) {
      setError(
        error.response?.data?.error ||
        'Error al registrar el usuario'
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
          <h2>Crea tu cuenta</h2>

          <p>
            Empieza a organizar tus tareas,
            categorías y etiquetas.
          </p>
        </div>

        <form
          onSubmit={manejarSubmit}
          className={estilos.formulario}
        >
          <div className={estilos.campo}>
            <label htmlFor="nombre">
              Nombre
            </label>

            <input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(e) =>
                setNombre(e.target.value)
              }
              placeholder="Tu nombre"
              autoComplete="name"
              required
            />
          </div>

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
              placeholder="Crea una contraseña"
              autoComplete="new-password"
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
              ? 'Creando cuenta...'
              : 'Crear cuenta'}
          </button>
        </form>

        <p className={estilos.enlaceInferior}>
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login">
            Iniciar sesión
          </Link>
        </p>
      </section>
    </main>
  );
}

export default FormularioRegistro;