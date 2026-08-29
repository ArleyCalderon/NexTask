import useEtiquetas from '../../hooks/useEtiquetas';
import FormularioEtiqueta from './FormularioEtiqueta';

function ListaEtiquetas() {
  const {
    etiquetas,
    cargandoEtiquetas,
    errorEtiquetas,
    crearEtiqueta,
  } = useEtiquetas();

  if (cargandoEtiquetas) {
    return <p>Cargando etiquetas...</p>;
  }

  return (
    <div>
      <h1>Etiquetas</h1>

      <FormularioEtiqueta
        onCrear={crearEtiqueta}
      />

      {errorEtiquetas && (
        <p>{errorEtiquetas}</p>
      )}

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