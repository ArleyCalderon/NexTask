import { Outlet } from 'react-router-dom';

import Header from './Header';
import Sidebar from './Sidebar';

import estilos from './Layout.module.css';

function Layout() {
  return (
    <div className={estilos.layout}>
      <Sidebar />

      <div className={estilos.contenido}>
        <Header />

        <main className={estilos.principal}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;