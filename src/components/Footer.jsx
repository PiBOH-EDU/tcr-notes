import { useState, useEffect } from 'react';
import { APP_VERSION } from '../version';

export default function Footer({ theme }) {
  const [appState, setAppState] = useState(null);

  useEffect(() => {
    fetch('/state.json')
      .then((res) => res.json())
      .then((data) => setAppState(data))
      .catch(() => setAppState(null));
  }, []);

  const showStatus = appState && appState.status !== 'online';

  const statusBadge = () => {
    if (!showStatus) return null;
    const colors = {
      maintenance: theme === 'dark' ? 'text-amber-400' : 'text-amber-600',
      testing: theme === 'dark' ? 'text-blue-400' : 'text-blue-600',
      issue: theme === 'dark' ? 'text-red-400' : 'text-red-600',
      offline: theme === 'dark' ? 'text-red-500' : 'text-red-700',
    };
    const icons = {
      maintenance: '🔧',
      testing: '🧪',
      issue: '⚠️',
      offline: '🚫',
    };
    const labels = {
      maintenance: 'Manutenzione',
      testing: 'Test',
      issue: 'Problema',
      offline: 'Offline',
    };
    const status = appState.status;
    return (
      <span className={`shrink-0 font-medium ${colors[status] || ''}`}>
        {icons[status]} {labels[status]}
        {appState.message ? `: ${appState.message}` : ''}
      </span>
    );
  };

  return (
    <footer
      className={`px-3 md:px-4 py-1.5 text-[10px] md:text-[11px] border-t leading-tight ${
        theme === 'dark'
          ? 'bg-gray-900 border-gray-800 text-gray-400'
          : 'bg-gray-100 border-gray-200 text-gray-500'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5 max-w-7xl mx-auto">
        <span className="opacity-80 truncate">
          Materiale privato — accesso riservato alla classe 1FT (A.S. 2025/2026)
        </span>
        {showStatus ? (
          statusBadge()
        ) : (
          <span className={`shrink-0 ${theme === 'dark' ? 'text-yellow-500/70' : 'text-yellow-700/70'}`}>
            ⚠️ Non inserire dati personali negli appunti
          </span>
        )}
        <span className="opacity-60 shrink-0">
          v{APP_VERSION} · PiBOH
        </span>
      </div>
    </footer>
  );
}
