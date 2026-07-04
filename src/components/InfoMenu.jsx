import { useState, useRef, useEffect } from 'react';

const DOCS = [
  { label: '📘 MANUALE UTENTE', url: 'https://github.com/PiBOH-EDU/tcr-notes/blob/main/docs/MANUAL.md' },
  { label: '🔒 SECURITY.md', url: 'https://github.com/PiBOH-EDU/tcr-notes/blob/main/docs/SECURITY.md' },
  { label: '⚠️ DISCLAIMER.md', url: 'https://github.com/PiBOH-EDU/tcr-notes/blob/main/docs/DISCLAIMER.md' },
  { label: '📋 LIMITATIONS.md', url: 'https://github.com/PiBOH-EDU/tcr-notes/blob/main/docs/LIMITATIONS.md' },
  { label: '📋 CODE OF CONDUCT.md', url: 'https://github.com/PiBOH-EDU/tcr-notes/blob/main/CODE%20OF%20CONDUCT.md' },
  { label: '📜 CHANGELOG.md', url: 'https://github.com/PiBOH-EDU/tcr-notes/blob/main/CHANGELOG.md' },
  { label: '📄 LICENSE', url: 'https://github.com/PiBOH-EDU/tcr-notes/blob/main/LICENSE' },
];

const FEEDBACK = { label: '🐛 Segnala un bug / Richiedi una funzionalità (GitHub)', url: 'https://github.com/PiBOH-EDU/tcr-notes/issues/new/choose' };

export default function InfoMenu({ theme }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handle = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((s) => !s)}
        className={`p-2 rounded-lg text-sm font-medium transition border ${
          open
            ? 'bg-blue-600 border-blue-500 text-white'
            : theme === 'dark'
            ? 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600'
            : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
        }`}
        title="Informazioni"
      >
        <span className="hidden sm:inline">ℹ️ Info</span>
        <span className="sm:hidden">ℹ️</span>
      </button>

      {open && (
        <div
          className={`absolute right-0 mt-2 w-64 rounded-xl border shadow-xl z-50 overflow-hidden ${
            theme === 'dark'
              ? 'bg-gray-800 border-gray-700 text-gray-100'
              : 'bg-white border-gray-200 text-gray-900'
          }`}
        >
          <div className="p-3 border-b border-gray-700/30">
            <div className="font-bold text-sm">📚 tcr-notes</div>
            <div className="text-xs opacity-70 mt-0.5">Versione 0.6.6</div>
            <div className="text-xs opacity-70">Autore: PiBOH</div>
          </div>
          <div className="p-2">
            <div className="text-xs font-semibold uppercase tracking-wider opacity-50 px-2 py-1">
              Documentazione
            </div>
            {DOCS.map((d) => (
              <a
                key={d.label}
                href={d.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`block px-2 py-1.5 rounded text-sm transition ${
                  theme === 'dark'
                    ? 'hover:bg-gray-700 text-gray-300'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                {d.label}
              </a>
            ))}
            <div className="text-xs font-semibold uppercase tracking-wider opacity-50 px-2 py-1 mt-1">
              Feedback
            </div>
            <a
              href={FEEDBACK.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`block px-2 py-1.5 rounded text-sm transition ${
                theme === 'dark'
                  ? 'hover:bg-gray-700 text-gray-300'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              {FEEDBACK.label}
            </a>
          </div>
          <div className={`p-2 text-xs text-center border-t ${
            theme === 'dark' ? 'border-gray-700/30 text-gray-500' : 'border-gray-200 text-gray-400'
          }`}>
            Classe 1FT — ITT "Barsanti"<br />A.S. 2025/2026
          </div>
        </div>
      )}
    </div>
  );
}
