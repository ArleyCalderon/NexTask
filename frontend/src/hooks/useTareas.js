import { useEffect, useState } from 'react';
import api from '../servicios/api';

function useTareas() {

const cambiarEstadoTarea = async (id) => {
  const tareasAnteriores = tareas;

  setTareas((tareasActuales) =>
    tareasActuales.map((tarea) =>
      tarea.id === id
        ? { ...tarea, completada: !tarea.completada }
        : tarea
    )
  );

  try {
    await api.patch(`/tareas/${id}/completar`);
  } catch (error) {
    setTareas(tareasAnteriores);

    setError(
      error.response?.data?.error ||
      'Error al cambiar el estado de la tarea'
    );
  }
};

const crearTarea = async (datosTarea) => {
  try {
    setError('');

    await api.post('/tareas', datosTarea);

    await cargarTareas();
  } catch (error) {
    const mensaje =
      error.response?.data?.error ||
      'Error al crear la tarea';

    setError(mensaje);

    throw error;
  }
};

const eliminarTarea = async (id) => {
  const tareasAnteriores = tareas;

  setTareas((tareasActuales) =>
    tareasActuales.filter((tarea) => tarea.id !== id)
  );

  try {
    await api.delete(`/tareas/${id}`);
  } catch (error) {
    setTareas(tareasAnteriores);

    setError(
      error.response?.data?.error ||
      'Error al eliminar la tarea'
    );
  }
};

const actualizarTarea = async (id, datosTarea) => {
  try {
    setError('');

    await api.put(`/tareas/${id}`, datosTarea);

    await cargarTareas();
  } catch (error) {
    setError(
      error.response?.data?.error ||
      'Error al actualizar la tarea'
    );

    throw error;
  }
};

  const [tareas, setTareas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargarTareas = async () => {
    try {
      setCargando(true);
      setError('');

      const respuesta = await api.get('/tareas');

      setTareas(respuesta.data.tareas);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.error ||
        'Error al cargar las tareas'
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarTareas();
  }, []);

  return {
    tareas,
    cargando,
    error,
    cargarTareas,
    cambiarEstadoTarea,
    crearTarea,
    eliminarTarea,
    actualizarTarea,
  };
}

export default useTareas;