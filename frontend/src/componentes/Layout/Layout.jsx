import { Outlet } from 'react-router-dom';

import Header from './Header';
import Sidebar from './Sidebar';

import useEstadisticasTareas
  from '../../hooks/useEstadisticasTareas';

import estilos from './Layout.module.css';

function Layout() {
  const {
    estadisticas,
    cargandoEstadisticas,
  } = useEstadisticasTareas();

  return (
    <div className={estilos.layout}>
      <Sidebar
        estadisticas={estadisticas}
        cargandoEstadisticas={
          cargandoEstadisticas
        }
      />

      <div className={estilos.contenido}>
        <Header />

        <main className={estilos.principal}>
          <Outlet
            context={{
              estadisticas,
              cargandoEstadisticas,
            }}
          />
        </main>
      </div>
    </div>
  );
}

export default Layout;