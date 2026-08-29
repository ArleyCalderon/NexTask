import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { ProveedorAuth } from './contexto/ContextoAuth.jsx';
import { ProveedorTema } from './contexto/ContextoTema.jsx';

import ErrorBoundary from './componentes/Comunes/ErrorBoundary.jsx';

import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <ProveedorTema>
        <BrowserRouter>
          <ProveedorAuth>
            <App />
          </ProveedorAuth>
        </BrowserRouter>
      </ProveedorTema>
    </ErrorBoundary>
  </StrictMode>
);