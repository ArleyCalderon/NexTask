import {
  createContext,
  useEffect,
  useState,
} from 'react';

export const ContextoTema = createContext();

export function ProveedorTema({ children }) {
  const [tema, setTema] = useState(() => {
    return localStorage.getItem('tema') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      tema
    );

    localStorage.setItem('tema', tema);
  }, [tema]);

  const alternarTema = () => {
    setTema((temaActual) =>
      temaActual === 'light'
        ? 'dark'
        : 'light'
    );
  };

  return (
    <ContextoTema.Provider
      value={{
        tema,
        alternarTema,
      }}
    >
      {children}
    </ContextoTema.Provider>
  );
}