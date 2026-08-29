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

  const crearCategoria = async (datosCategoria) => {
    try {
      setErrorCategorias('');

      await api.post('/categorias', datosCategoria);

      await cargarCategorias();
    } catch (error) {
      setErrorCategorias(
        error.response?.data?.error ||
        'Error al crear la categoría'
      );

      throw error;
    }
  };

  const actualizarCategoria = async (id, datosCategoria) => {
  try {
    setErrorCategorias('');

    await api.put(`/categorias/${id}`, datosCategoria);

    await cargarCategorias();
  } catch (error) {
    setErrorCategorias(
      error.response?.data?.error ||
      'Error al actualizar la categoría'
    );

    throw error;
  }
};

const eliminarCategoria = async (id) => {
  try {
    setErrorCategorias('');

    await api.delete(`/categorias/${id}`);

    await cargarCategorias();
  } catch (error) {
    setErrorCategorias(
      error.response?.data?.error ||
      'Error al eliminar la categoría'
    );

    throw error;
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
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
  };
}

export default useCategorias;