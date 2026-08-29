function MensajeError({ mensaje }) {
  if (!mensaje) {
    return null;
  }

  return (
    <div role="alert">
      <p>{mensaje}</p>
    </div>
  );
}

export default MensajeError;