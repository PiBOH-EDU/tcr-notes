import { useState, useEffect } from 'react';
import { getHistory, restoreHistory } from '../lib/storage';

export default function HistoryViewer({ chapterId, user, theme, onRestore }) {
  const [history, setHistory] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    loadHistory();
  }, [chapterId]);

  const loadHistory = async () => {
    try {
      const h = await getHistory(chapterId);
      setHistory(h);
      setSelectedId(null);
      setPreview('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelect = (item) => {
    setSelectedId(item.id);
    setPreview(item.content || '');
  };

  const handleRestore = async () => {
    if (!selectedId) return;
    try {
      await restoreHistory(chapterId, selectedId, user);
      alert('Versione ripristinata con successo!');
      onRestore();
    } catch (err) {
      alert('Errore: ' + err.message);
    }
  };

  const formatDate = (iso) => {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleString('it-IT');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-300px)]">
      {/* Lista versioni */}
      <div
        className={`md:col-span-1 rounded-xl border overflow-y-auto ${
          theme === 'dark'
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}
      >
        <div className="p-3 border-b border-gray-700/30 font-semibold text-sm">
          Versioni salvate ({history.length})
        </div>
        <div className="p-2 space-y-1">
          {history.map((h) => (
            <button
              key={h.id}
              onClick={() => handleSelect(h)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition border ${
                selectedId === h.id
                  ? theme === 'dark'
                    ? 'bg-blue-900/30 border-blue-700 text-blue-200'
                    : 'bg-blue-50 border-blue-200 text-blue-800'
                  : theme === 'dark'
                  ? 'hover:bg-gray-700 border-transparent text-gray-300'
                  : 'hover:bg-gray-100 border-transparent text-gray-700'
              }`}
            >
              <div className="font-medium">{formatDate(h.created_at)}</div>
              <div className="text-xs opacity-60">
                {h.edited_by ? `di ${h.edited_by}` : '—'}
              </div>
              <div className="text-xs opacity-60 truncate">
                {h.content?.slice(0, 60) || '(vuoto)'}
              </div>
            </button>
          ))}
          {history.length === 0 && (
            <div className="px-3 py-4 text-sm opacity-50 text-center">
              Nessuna cronologia disponibile.
              <br />
              Inizia a scrivere per generare versioni.
            </div>
          )}
        </div>
      </div>

      {/* Preview */}
      <div
        className={`md:col-span-2 rounded-xl border flex flex-col ${
          theme === 'dark'
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}
      >
        <div className="p-3 border-b border-gray-700/30 flex items-center justify-between">
          <span className="font-semibold text-sm">Anteprima versione</span>
          {selectedId && (
            <button
              onClick={handleRestore}
              className="px-3 py-1.5 text-xs rounded bg-orange-600 hover:bg-orange-700 text-white transition"
            >
              ↩ Ripristina questa versione
            </button>
          )}
        </div>
        <div className="flex-1 p-4 overflow-y-auto font-mono text-sm whitespace-pre-wrap opacity-90">
          {selectedId ? (
            preview || <span className="opacity-50 italic">(contenuto vuoto)</span>
          ) : (
            <span className="opacity-50 italic">Seleziona una versione per visualizzarla</span>
          )}
        </div>
      </div>
    </div>
  );
}
