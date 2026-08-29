import { useContext } from 'react';
import { ContextoTema } from '../contexto/ContextoTema';

function useTema() {
  return useContext(ContextoTema);
}

export default useTema;