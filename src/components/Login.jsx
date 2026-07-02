import { useState } from 'react';
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
  const [acceptedDocs, setAcceptedDocs] = useState(false);
  const [error, setError] = useState('');

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
      setError('Devi confermare di aver letto SECURITY.md e DISCLAIMER.md per proseguire.');
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
    // Se AUTHORIZED ha elementi, l'utente DEVE essere nella lista.
    // Se AUTHORIZED è vuoto, la password è sufficiente (modalità classe).
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

  return (
    <div className="w-full max-w-md px-4">
      <div
        className={`w-full p-8 rounded-2xl shadow-2xl border ${
          theme === 'dark'
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}
      >
        <h1 className="text-2xl font-bold mb-2 text-center">📚 tcr-notes</h1>
        <p className="text-sm text-center mb-6 opacity-80">
          Appunti collaborativi — The Catcher in the Rye
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              onChange={(e) => setAcceptedDocs(e.target.checked)}
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
                href="./docs/SECURITY.md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                SECURITY.md
              </a>{' '}
              e{' '}
              <a
                href="./docs/DISCLAIMER.md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                DISCLAIMER.md
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
