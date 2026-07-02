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
  const [cognome, setCognome] = useState('');
  const [nome, setNome] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const trimmedCognome = cognome.trim();
    const trimmedNome = nome.trim();

    if (!trimmedCognome || !trimmedNome || !password) {
      setError('Tutti i campi sono obbligatori.');
      return;
    }

    const normalizedName = normalizeName(trimmedCognome, trimmedNome);

    // Controllo lista bannati (formato: cognome.nome)
    const isBanned = BANNED.some((b) => b.toLowerCase() === normalizedName);
    if (isBanned) {
      setError('Accesso negato: utente bannato.');
      return;
    }

    // Controllo lista autorizzati esplicita (formato: cognome.nome)
    const isExplicitlyAuthorized = AUTHORIZED.some(
      (a) => a.toLowerCase() === normalizedName
    );

    // AUTORIZZATI.md: tutti i membri della classe 1FT sono autorizzati.
    // La verifica di appartenenza alla classe è delegata alla password condivisa.
    if (!isExplicitlyAuthorized && password !== CLASS_PASSWORD) {
      setError('Password di classe errata.');
      return;
    }

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
        <h1 className="text-2xl font-bold mb-2 text-center">📚 trc-notes</h1>
        <p className="text-sm text-center mb-6 opacity-80">
          Appunti collaborativi — The Catcher in the Rye
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
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
          </div>
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
