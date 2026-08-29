import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import api from '../servicios/api';

function obtenerFechaHoy() {
  const hoy = new Date();

  const anio = hoy.getFullYear();

  const mes = String(
    hoy.getMonth() + 1
  ).padStart(2, '0');

  const dia = String(
    hoy.getDate()
  ).padStart(2, '0');

  return `${anio}-${mes}-${dia}`;
}

function useEstadisticasTareas() {
  const [todasLasTareas, setTodasLasTareas] =
    useState([]);

  const [
    cargandoEstadisticas,
    setCargandoEstadisticas,
  ] = useState(true);

  const [
    errorEstadisticas,
    setErrorEstadisticas,
  ] = useState('');

  const cargarEstadisticas = useCallback(
    async () => {
      try {
        setErrorEstadisticas('');

        const respuesta =
          await api.get('/tareas');

        setTodasLasTareas(
          respuesta.data.tareas
        );
      } catch (error) {
        console.error(error);

        setErrorEstadisticas(
          error.response?.data?.error ||
          'No se pudieron cargar las estadísticas'
        );
      } finally {
        setCargandoEstadisticas(false);
      }
    },
    []
  );

  useEffect(() => {
    cargarEstadisticas();

    const manejarActualizacionTareas = () => {
      cargarEstadisticas();
    };

    window.addEventListener(
      'tareas-actualizadas',
      manejarActualizacionTareas
    );

    return () => {
      window.removeEventListener(
        'tareas-actualizadas',
        manejarActualizacionTareas
      );
    };
  }, [cargarEstadisticas]);

  const estadisticas = useMemo(() => {
    const total = todasLasTareas.length;

    const completadas =
      todasLasTareas.filter(
        (tarea) => tarea.completada
      ).length;

    const pendientes =
      todasLasTareas.filter(
        (tarea) => !tarea.completada
      ).length;

    const hoy = obtenerFechaHoy();

    const vencidas =
      todasLasTareas.filter((tarea) => {
        if (
          tarea.completada ||
          !tarea.fecha_vencimiento
        ) {
          return false;
        }

        const fechaVencimiento =
          tarea.fecha_vencimiento.split('T')[0];

        return fechaVencimiento < hoy;
      }).length;

    const porcentajeCompletado =
      total === 0
        ? 0
        : Math.round(
            (completadas / total) * 100
          );

    return {
      total,
      pendientes,
      completadas,
      vencidas,
      porcentajeCompletado,
    };
  }, [todasLasTareas]);

  return {
    estadisticas,
    cargandoEstadisticas,
    errorEstadisticas,
    cargarEstadisticas,
  };
}

export default useEstadisticasTareas;