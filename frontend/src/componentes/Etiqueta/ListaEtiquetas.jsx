import useEtiquetas from '../../hooks/useEtiquetas';
import FormularioEtiqueta from './FormularioEtiqueta';
import Cargando from '../Comunes/Cargando';
import MensajeError from '../Comunes/MensajeError';

function ListaEtiquetas() {
  const {
    etiquetas,
    cargandoEtiquetas,
    errorEtiquetas,
    crearEtiqueta,
  } = useEtiquetas();

    if (cargandoEtiquetas) {
    return <Cargando mensaje="Cargando etiquetas..." />;
    }

  return (
    <div>
      <h1>Etiquetas</h1>

      <FormularioEtiqueta
        onCrear={crearEtiqueta}
      />

    <MensajeError mensaje={errorEtiquetas} />

      {etiquetas.length === 0 ? (
        <p>No tienes etiquetas.</p>
      ) : (
        <div>
          {etiquetas.map((etiqueta) => (
            <div key={etiqueta.id}>
              <span>
                #{etiqueta.nombre}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ListaEtiquetas;