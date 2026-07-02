import { useState } from 'react';
import { AUTHORIZED } from '../data/authorized';
import { BANNED } from '../data/banned';

const CLASS_PASSWORD = 'Barsanti1FT';

function normalizeName(input) {
  const trimmed = input.trim();
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    const [nome, ...cognomeParts] = parts;
    const cognome = cognomeParts.join('');
    return `${cognome}.${nome}`.toLowerCase();
  }
  return trimmed.toLowerCase();
}

export default function Login({ onLogin, theme }) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const trimmedName = name.trim();
    if (!trimmedName || !password) {
      setError('Entrambi i campi sono obbligatori.');
      return;
    }

    const normalizedName = normalizeName(trimmedName);

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
        <h1 className="text-2xl font-bold mb-2 text-center">📚 Catcher Notes</h1>
        <p className="text-sm text-center mb-6 opacity-80">
          Appunti collaborativi — The Catcher in the Rye
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome e Cognome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-gray-50 border-gray-300 text-gray-900'
              }`}
              placeholder="Mario Rossi"
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
