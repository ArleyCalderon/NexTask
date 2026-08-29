export function formatearFecha(fecha) {
  if (!fecha) {
    return '';
  }

  return new Date(fecha).toLocaleDateString(
    'es-CO',
    {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }
  );
}