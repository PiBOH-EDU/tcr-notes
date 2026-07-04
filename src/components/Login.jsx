import { useState, useEffect } from 'react';
import { AUTHORIZED } from '../data/authorized';
import { BANNED } from '../data/banned';

const CLASS_PASSWORD = 'Barsanti1FT';

function normalizeName(cognome, nome) {
  const c = cognome.trim().toLowerCase().replace(/\s+/g, '');
  const n = nome.trim().toLowerCase().replace(/\s+/g, '');
  return `${c}.${n}`;
}

export default function Login({ onLogin, theme }) {
  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedDocs, setAcceptedDocs] = useState(() => {
    return localStorage.getItem('tcr-docs-accepted') === 'true';
  });
  const [error, setError] = useState('');

  // Stato app (manutenzione, test, ecc.)
  const [appState, setAppState] = useState(null);

  useEffect(() => {
    fetch('/state.json')
      .then((res) => res.json())
      .then((data) => setAppState(data))
      .catch(() => setAppState({ status: 'online', message: '', banner: false, bannerType: 'info' }));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const trimmedNome = nome.trim();
    const trimmedCognome = cognome.trim();

    if (!trimmedNome || !trimmedCognome || !password) {
      setError('Tutti i campi sono obbligatori.');
      return;
    }

    if (!acceptedDocs) {
      setError('Devi confermare di aver letto SECURITY.md, DISCLAIMER.md e CODE OF CONDUCT.md per proseguire.');
      return;
    }

    const normalizedName = normalizeName(trimmedCognome, trimmedNome);

    // 1. Controllo lista bannati (formato: cognome.nome)
    const isBanned = BANNED.some((b) => b.toLowerCase() === normalizedName);
    if (isBanned) {
      setError('Accesso negato: utente bannato.');
      return;
    }

    // 2. Controllo lista autorizzati
    const isInAuthorizedList = AUTHORIZED.some(
      (a) => a.toLowerCase() === normalizedName
    );

    if (AUTHORIZED.length > 0 && !isInAuthorizedList) {
      setError('Accesso negato: non sei nella lista degli autorizzati. Controlla di aver inserito correttamente i dati utente.');
      return;
    }

    // 3. Controllo password
    if (password !== CLASS_PASSWORD) {
      setError('Password di classe errata.');
      return;
    }

    onLogin(normalizedName);
  };

  const handleAcceptChange = (checked) => {
    setAcceptedDocs(checked);
    localStorage.setItem('tcr-docs-accepted', checked ? 'true' : 'false');
  };

  // Determina se mostrare il banner
  const showBanner = appState && (
    appState.status !== 'online' || appState.banner === true
  );

  const isOffline = appState?.status === 'offline';

  const bannerColors = () => {
    const type = appState?.bannerType || 'info';
    if (theme === 'dark') {
      switch (type) {
        case 'warning': return 'bg-amber-900/30 border-amber-700/50 text-amber-200';
        case 'error': return 'bg-red-900/30 border-red-700/50 text-red-200';
        case 'info': default: return 'bg-blue-900/30 border-blue-700/50 text-blue-200';
      }
    } else {
      switch (type) {
        case 'warning': return 'bg-amber-50 border-amber-300 text-amber-800';
        case 'error': return 'bg-red-50 border-red-300 text-red-800';
        case 'info': default: return 'bg-blue-50 border-blue-300 text-blue-800';
      }
    }
  };

  const statusIcon = () => {
    switch (appState?.status) {
      case 'maintenance': return '🔧';
      case 'testing': return '🧪';
      case 'issue': return '⚠️';
      case 'offline': return '🚫';
      default: return 'ℹ️';
    }
  };

  return (
    <div className="w-full max-w-md px-4">
      <div
        className={`w-full p-8 rounded-2xl shadow-2xl border ${
          theme === 'dark'
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}
      >
        {/* Banner stato app */}
        {showBanner && (
          <div className={`mb-4 p-3 rounded-lg text-sm border ${bannerColors()}`}>
            <div className="flex items-start gap-2">
              <span className="text-lg shrink-0">{statusIcon()}</span>
              <div>
                <strong className="block">
                  {appState.status === 'maintenance' && 'Manutenzione in corso'}
                  {appState.status === 'testing' && 'Modalità test'}
                  {appState.status === 'issue' && 'Problema noto'}
                  {appState.status === 'offline' && 'App temporaneamente offline'}
                  {appState.status === 'online' && 'Avviso'}
                </strong>
                {appState.message && (
                  <span className="opacity-90">{appState.message}</span>
                )}
              </div>
            </div>
          </div>
        )}

        <h1 className="text-2xl font-bold mb-2 text-center">📚 tcr-notes</h1>
        <p className="text-sm text-center mb-6 opacity-80">
          Una classe, Tanti appunti, Un unico diario
        </p>

        <div className={`mb-4 p-3 rounded-lg text-xs border ${
          theme === 'dark'
            ? 'bg-yellow-900/20 border-yellow-700/50 text-yellow-200'
            : 'bg-yellow-50 border-yellow-300 text-yellow-800'
        }`}>
          ⚠️ <strong>Attenzione:</strong> non inserire dati personali, numeri di telefono, indirizzi o informazioni sensibili negli appunti. Il contenuto è condiviso con tutta la classe.
        </div>

        <form onSubmit={handleSubmit} className={`space-y-4 ${isOffline ? 'opacity-50 pointer-events-none' : ''}`}>
          {/* NOME/I */}
          <div>
            <label className="block text-sm font-medium mb-1">Nome (o nomi)</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-gray-50 border-gray-300 text-gray-900'
              }`}
              placeholder="Mario"
            />
            <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Se hai più nomi, scrivili tutti attaccati (es. "AnnaMaria" o "PaoloGiuseppe")
            </p>
          </div>

          {/* COGNOME */}
          <div>
            <label className="block text-sm font-medium mb-1">Cognome</label>
            <input
              type="text"
              value={cognome}
              onChange={(e) => setCognome(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-gray-50 border-gray-300 text-gray-900'
              }`}
              placeholder="Rossi"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium mb-1">Password di classe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-gray-50 border-gray-300 text-gray-900'
              }`}
              placeholder="••••••••"
            />
          </div>

          {/* CHECKBOX OBBLIGATORIO */}
          <div className="flex items-start gap-2">
            <input
              id="accept-docs"
              type="checkbox"
              checked={acceptedDocs}
              onChange={(e) => handleAcceptChange(e.target.checked)}
              className="mt-1 w-4 h-4 accent-blue-600 cursor-pointer"
            />
            <label
              htmlFor="accept-docs"
              className={`text-sm cursor-pointer ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Dichiaro di aver letto e compreso i file{' '}
              <a
                href="https://github.com/PiBOH-EDU/tcr-notes/blob/main/docs/SECURITY.md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                SECURITY.md
              </a>
              ,{' '}
              <a
                href="https://github.com/PiBOH-EDU/tcr-notes/blob/main/docs/DISCLAIMER.md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                DISCLAIMER.md
              </a>
              {' '}e{' '}
              <a
                href="https://github.com/PiBOH-EDU/tcr-notes/blob/main/CODE%20OF%20CONDUCT.md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                CODE OF CONDUCT.md
              </a>
              . *
            </label>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center font-medium">{error}</div>
          )}

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
          >
            Accedi
          </button>
        </form>
      </div>
    </div>
  );
}
