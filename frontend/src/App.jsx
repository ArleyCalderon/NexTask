import { Navigate, Route, Routes } from 'react-router-dom';
import FormularioLogin from './componentes/Auth/FormularioLogin';
import FormularioRegistro from './componentes/Auth/FormularioRegistro';
import RutaProtegida from './componentes/Auth/RutaProtegida';

import ListaTareas from './componentes/Tarea/ListaTareas';
import ListaCategorias from './componentes/Categoria/ListaCategorias';
import ListaEtiquetas from './componentes/Etiqueta/ListaEtiquetas';

import Layout from './componentes/Layout/Layout';

function App() {
  return (
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
        element={
          <RutaProtegida>
            <Layout />
          </RutaProtegida>
        }
      >
        <Route
          path="/tareas"
          element={<ListaTareas />}
        />

        <Route
          path="/categorias"
          element={<ListaCategorias />}
        />

        <Route
          path="/etiquetas"
          element={<ListaEtiquetas />}
        />
      </Route>
	<Route
	  path="/"
	  element={<Navigate to="/login" replace />}
	/>
    </Routes>
  );
}

export default App;
