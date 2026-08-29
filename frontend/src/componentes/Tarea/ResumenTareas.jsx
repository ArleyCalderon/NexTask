import {
  CircleCheck,
  ClipboardList,
  Clock,
  Flag,
} from 'lucide-react';

import estilos from './ResumenTareas.module.css';

function ResumenTareas({
  estadisticas,
  cargando,
}) {
  const {
    total,
    pendientes,
    completadas,
    vencidas,
  } = estadisticas;

  const tarjetas = [
    {
      titulo: 'Total tareas',
      valor: total,
      descripcion: 'Todas tus tareas',
      Icono: ClipboardList,
      clase: estilos.total,
    },
    {
      titulo: 'Pendientes',
      valor: pendientes,
      descripcion: 'Por completar',
      Icono: Clock,
      clase: estilos.pendientes,
    },
    {
      titulo: 'Completadas',
      valor: completadas,
      descripcion: '¡Buen trabajo!',
      Icono: CircleCheck,
      clase: estilos.completadas,
    },
    {
      titulo: 'Vencidas',
      valor: vencidas,
      descripcion:
        vencidas === 0
          ? 'Todo al día'
          : 'Atención requerida',
      Icono: Flag,
      clase: estilos.vencidas,
    },
  ];

  return (
    <section className={estilos.resumen}>
      {tarjetas.map(
        ({
          titulo,
          valor,
          descripcion,
          Icono,
          clase,
        }) => (
          <article
            key={titulo}
            className={`${estilos.tarjeta} ${clase}`}
          >
            <div className={estilos.icono}>
              <Icono size={21} />
            </div>

            <div className={estilos.contenido}>
              <span className={estilos.titulo}>
                {titulo}
              </span>

              <strong className={estilos.valor}>
                {cargando ? '—' : valor}
              </strong>

              <span
                className={
                  estilos.descripcion
                }
              >
                {descripcion}
              </span>
            </div>
          </article>
        )
      )}
    </section>
  );
}

export default ResumenTareas;