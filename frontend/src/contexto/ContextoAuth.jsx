import { createContext, useEffect, useState } from 'react';
import api from '../servicios/api';

export const ContextoAuth = createContext();

export function ProveedorAuth({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarUsuario = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setCargando(false);
        return;
      }

      try {
        const respuesta = await api.get('/auth/perfil');
        setUsuario(respuesta.data.usuario);
      } catch (error) {
        localStorage.removeItem('token');
        setUsuario(null);
      } finally {
        setCargando(false);
      }
    };

    cargarUsuario();
  }, []);

  const login = async (email, password) => {
    const respuesta = await api.post('/auth/login', {
      email,
      password,
    });

    const { token, usuario } = respuesta.data;

    localStorage.setItem('token', token);
    setUsuario(usuario);

    return respuesta.data;
  };

const registro = async (nombre, email, password) => {
  const respuesta = await api.post('/auth/registro', {
    nombre,
    email,
    password,
  });

  const { token, usuario } = respuesta.data;

  localStorage.setItem('token', token);
  setUsuario(usuario);

  return respuesta.data;
};

  const logout = () => {
    localStorage.removeItem('token');
    setUsuario(null);
  };

  return (
    <ContextoAuth.Provider
        value={{
        usuario,
        cargando,
        login,
        registro,
        logout,
        }}
    >
      {children}
    </ContextoAuth.Provider>
  );
}