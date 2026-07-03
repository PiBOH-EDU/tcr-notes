import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || 'Errore sconosciuto' };
  }

  componentDidCatch(error) {
    console.error('[tcr-notes] Errore catturato da ErrorBoundary:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            textAlign: 'center',
            fontFamily: 'sans-serif',
          }}
        >
          <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
            ⚠️ Errore di configurazione
          </h1>
          <p style={{ maxWidth: '32rem', opacity: 0.85 }}>{this.state.message}</p>
          <p style={{ maxWidth: '32rem', opacity: 0.7, marginTop: '1rem', fontSize: '0.875rem' }}>
            Se hai appena modificato il file <code>.env</code>, ricorda di riavviare il
            server (<code>npm run dev</code>): Vite legge le variabili d'ambiente solo
            all'avvio, non a caldo.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
