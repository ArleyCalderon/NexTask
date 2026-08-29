import { Component } from 'react';

import estilos from './ErrorBoundary.module.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hayError: false,
    };
  }

  static getDerivedStateFromError() {
    return {
      hayError: true,
    };
  }

  componentDidCatch(error, informacion) {
    console.error(
      'Error no controlado en React:',
      error,
      informacion
    );
  }

  manejarRecarga = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hayError) {
      return (
        <main className={estilos.pagina}>
          <section className={estilos.tarjeta}>
            <div className={estilos.icono}>
              !
            </div>

            <h1>Algo salió mal</h1>

            <p>
              Ocurrió un error inesperado en la interfaz.
              Puedes recargar la aplicación para intentarlo
              nuevamente.
            </p>

            <button
              type="button"
              onClick={this.manejarRecarga}
            >
              Recargar aplicación
            </button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;