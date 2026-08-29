import { useEffect, useState } from 'react';
import api from '../servicios/api';

function useEtiquetas() {
  const [etiquetas, setEtiquetas] = useState([]);
  const [cargandoEtiquetas, setCargandoEtiquetas] = useState(true);
  const [errorEtiquetas, setErrorEtiquetas] = useState('');

  const cargarEtiquetas = async () => {
    try {
      setCargandoEtiquetas(true);
      setErrorEtiquetas('');

      const respuesta = await api.get('/etiquetas');

      setEtiquetas(respuesta.data.etiquetas);
    } catch (error) {
      console.error(error);

      setErrorEtiquetas(
        error.response?.data?.error ||
        'Error al cargar las etiquetas'
      );
    } finally {
      setCargandoEtiquetas(false);
    }
  };

  const crearEtiqueta = async (nombre) => {
    try {
            setErrorEtiquetas('');

            await api.post('/etiquetas', {
            nombre: nombre.trim(),
            });

            await cargarEtiquetas();
        } catch (error) {
            setErrorEtiquetas(
            error.response?.data?.error ||
            'Error al crear la etiqueta'
            );

            throw error;
        }
    };

  useEffect(() => {
    cargarEtiquetas();
  }, []);

    return {
    etiquetas,
    cargandoEtiquetas,
    errorEtiquetas,
    cargarEtiquetas,
    crearEtiqueta,
    };
}

export default useEtiquetas;