import { useContext } from 'react';
import { ContextoAuth } from '../contexto/ContextoAuth';

function useAuth() {
  return useContext(ContextoAuth);
}

export default useAuth;