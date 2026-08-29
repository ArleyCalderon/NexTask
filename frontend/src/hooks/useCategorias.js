import { useEffect, useState } from 'react';
import api from '../servicios/api';

function useCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [cargandoCategorias, setCargandoCategorias] = useState(true);
  const [errorCategorias, setErrorCategorias] = useState('');

  const cargarCategorias = async () => {
    try {
      setCargandoCategorias(true);
      setErrorCategorias('');

      const respuesta = await api.get('/categorias');

      setCategorias(respuesta.data.categorias);
    } catch (error) {
      console.error(error);

      setErrorCategorias(
        error.response?.data?.error ||
        'Error al cargar las categorías'
      );
    } finally {
      setCargandoCategorias(false);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  return {
    categorias,
    cargandoCategorias,
    errorCategorias,
    cargarCategorias,
  };
}

export default useCategorias;