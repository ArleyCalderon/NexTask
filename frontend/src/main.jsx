import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ProveedorAuth } from './contexto/ContextoAuth.jsx';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ProveedorAuth>
        <App />
      </ProveedorAuth>
    </BrowserRouter>
  </StrictMode>
);