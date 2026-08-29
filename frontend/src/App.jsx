import { Link, Route, Routes } from 'react-router-dom';
import FormularioLogin from './componentes/Auth/FormularioLogin';
import RutaProtegida from './componentes/Auth/RutaProtegida';
import { useContext } from 'react';
import { ContextoAuth } from './contexto/ContextoAuth';
import FormularioRegistro from './componentes/Auth/FormularioRegistro';
import ListaTareas from './componentes/Tarea/ListaTareas';
import ListaCategorias from './componentes/Categoria/ListaCategorias';
import ListaEtiquetas from './componentes/Etiqueta/ListaEtiquetas';

function App() {

  const { usuario, logout } = useContext(ContextoAuth);
  return (
    <div>
      <h1>NexTask</h1>

      <nav>
      {!usuario ? (
        <>
          <Link to="/login">Login</Link>
          {' | '}
          <Link to="/registro">Registro</Link>
        </>
      ) : (
        <>
        <Link to="/tareas">Tareas</Link>
        {' | '}
        <Link to="/categorias">Categorías</Link>
        {' | '}
        <Link to="/etiquetas">Etiquetas</Link>
        {' | '}
        <button onClick={logout}>
          Cerrar sesión
        </button>
      </>
      )}
    </nav>

      <Routes>
        <Route
          path="/login"
          element={<FormularioLogin />}
        />

      <Route
        path="/registro"
        element={<FormularioRegistro />}
      />

      <Route
        path="/tareas"
        element={
          <RutaProtegida>
            <ListaTareas />
          </RutaProtegida>
        }
      />

      <Route
        path="/categorias"
        element={
          <RutaProtegida>
            <ListaCategorias />
          </RutaProtegida>
        }
      />
      <Route
        path="/etiquetas"
        element={
          <RutaProtegida>
            <ListaEtiquetas />
          </RutaProtegida>
        }
      />
      </Routes>
    </div>
  );
}

export default App;