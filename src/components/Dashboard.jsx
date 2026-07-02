import { useState, useEffect, useCallback } from 'react';
import {
  getTitles,
  createTitle,
  deleteTitle,
  getChapters,
  createChapter,
  deleteChapter,
  exportData,
  importData,
} from '../lib/storage';
import ThemeToggle from './ThemeToggle';
import Editor from './Editor';
import HistoryViewer from './HistoryViewer';

export default function Dashboard({ user, theme, toggleTheme, onLogout }) {
  const [titles, setTitles] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [view, setView] = useState('editor'); // 'editor' | 'history'
  const [newTitle, setNewTitle] = useState('');
  const [newChapter, setNewChapter] = useState('');
  const [showNewTitle, setShowNewTitle] = useState(false);
  const [showNewChapter, setShowNewChapter] = useState(false);
  const [importError, setImportError] = useState('');

  const refreshTitles = useCallback(() => {
    setTitles(getTitles());
  }, []);

  const refreshChapters = useCallback((titleId) => {
    setChapters(getChapters(titleId));
  }, []);

  useEffect(() => {
    refreshTitles();
  }, [refreshTitles]);

  useEffect(() => {
    if (selectedTitle) {
      refreshChapters(selectedTitle);
    } else {
      setChapters([]);
    }
  }, [selectedTitle, refreshChapters]);

  const handleCreateTitle = () => {
    const id = createTitle(newTitle);
    if (id) {
      setNewTitle('');
      setShowNewTitle(false);
      refreshTitles();
      setSelectedTitle(id);
    }
  };

  const handleDeleteTitle = (id) => {
    if (!confirm(`Eliminare il titolo "${id}" e tutti i suoi capitoli?`)) return;
    deleteTitle(id);
    refreshTitles();
    if (selectedTitle === id) {
      setSelectedTitle(null);
      setSelectedChapter(null);
    }
  };

  const handleCreateChapter = () => {
    if (!selectedTitle) return;
    const id = createChapter(selectedTitle, newChapter);
    if (id) {
      setNewChapter('');
      setShowNewChapter(false);
      refreshChapters(selectedTitle);
      setSelectedChapter(id);
      setView('editor');
    }
  };

  const handleDeleteChapter = (id) => {
    if (!confirm(`Eliminare il capitolo "${id}"?`)) return;
    deleteChapter(selectedTitle, id);
    refreshChapters(selectedTitle);
    if (selectedChapter === id) {
      setSelectedChapter(null);
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      await importData(file);
      setImportError('');
      refreshTitles();
      setSelectedTitle(null);
      setSelectedChapter(null);
      alert('Dati importati con successo!');
    } catch (err) {
      setImportError(err.message);
    }
    e.target.value = '';
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* HEADER */}
      <header
        className={`flex items-center justify-between px-6 py-4 border-b ${
          theme === 'dark'
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold">📖 tcr-notes — Appunti 1FT</h1>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              theme === 'dark'
                ? 'bg-gray-700 text-gray-300'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {user}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={exportData}
            className={`px-3 py-1.5 text-sm rounded-lg transition ${
              theme === 'dark'
                ? 'bg-green-700 hover:bg-green-600 text-white'
                : 'bg-green-600 hover:bg-green-500 text-white'
            }`}
          >
            Esporta JSON
          </button>
          <label
            className={`px-3 py-1.5 text-sm rounded-lg cursor-pointer transition ${
              theme === 'dark'
                ? 'bg-purple-700 hover:bg-purple-600 text-white'
                : 'bg-purple-600 hover:bg-purple-500 text-white'
            }`}
          >
            Importa JSON
            <input type="file" accept=".json" className="hidden" onChange={handleImport} />
          </label>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          <button
            onClick={onLogout}
            className="px-3 py-1.5 text-sm rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
          >
            Esci
          </button>
        </div>
      </header>

      {importError && (
        <div className="px-6 py-2 bg-red-900/30 text-red-400 text-sm border-b border-red-800">
          Errore importazione: {importError}
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside
          className={`w-72 border-r overflow-y-auto flex flex-col ${
            theme === 'dark'
              ? 'bg-gray-800 border-gray-700'
              : 'bg-gray-100 border-gray-200'
          }`}
        >
          {/* Titoli */}
          <div className="p-3">
            <div className="flex items-center justify-between mb-3">
              <h2
                className={`text-xs font-bold uppercase tracking-wider opacity-60 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                Titoli
              </h2>
              <button
                onClick={() => setShowNewTitle((s) => !s)}
                className="text-xs px-2 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white transition"
              >
                + Nuovo
              </button>
            </div>

            {showNewTitle && (
              <div className="mb-3 space-y-2">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Nome titolo..."
                  className={`w-full px-3 py-1.5 text-sm rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateTitle()}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleCreateTitle}
                    className="flex-1 py-1 text-xs rounded bg-green-600 hover:bg-green-700 text-white"
                  >
                    Crea
                  </button>
                  <button
                    onClick={() => { setShowNewTitle(false); setNewTitle(''); }}
                    className="flex-1 py-1 text-xs rounded bg-gray-600 hover:bg-gray-700 text-white"
                  >
                    Annulla
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-1">
              {titles.map((t) => (
                <div key={t.id}>
                  <button
                    onClick={() => {
                      setSelectedTitle(t.id);
                      setSelectedChapter(null);
                      setView('editor');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition border ${
                      selectedTitle === t.id
                        ? theme === 'dark'
                          ? 'bg-blue-900/30 border-blue-700 text-blue-200'
                          : 'bg-blue-50 border-blue-200 text-blue-800'
                        : theme === 'dark'
                        ? 'hover:bg-gray-700 border-transparent text-gray-300'
                        : 'hover:bg-gray-200 border-transparent text-gray-700'
                    }`}
                  >
                    <span className="font-medium truncate">{t.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs opacity-50">{t.chapterCount} cap.</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteTitle(t.id); }}
                        className="text-red-400 hover:text-red-300 text-xs"
                        title="Elimina titolo"
                      >
                        🗑
                      </button>
                    </div>
                  </button>
                </div>
              ))}
              {titles.length === 0 && (
                <div className="px-2 text-sm opacity-50">Nessun titolo. Creane uno!</div>
              )}
            </div>
          </div>

          {/* Capitoli */}
          {selectedTitle && (
            <div className="p-3 border-t border-gray-700/30">
              <div className="flex items-center justify-between mb-3">
                <h2
                  className={`text-xs font-bold uppercase tracking-wider opacity-60 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  Capitoli — {selectedTitle}
                </h2>
                <button
                  onClick={() => setShowNewChapter((s) => !s)}
                  className="text-xs px-2 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white transition"
                >
                  + Nuovo
                </button>
              </div>

              {showNewChapter && (
                <div className="mb-3 space-y-2">
                  <input
                    type="text"
                    value={newChapter}
                    onChange={(e) => setNewChapter(e.target.value)}
                    placeholder="Nome capitolo..."
                    className={`w-full px-3 py-1.5 text-sm rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateChapter()}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleCreateChapter}
                      className="flex-1 py-1 text-xs rounded bg-green-600 hover:bg-green-700 text-white"
                    >
                      Crea
                    </button>
                    <button
                      onClick={() => { setShowNewChapter(false); setNewChapter(''); }}
                      className="flex-1 py-1 text-xs rounded bg-gray-600 hover:bg-gray-700 text-white"
                    >
                      Annulla
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                {chapters.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedChapter(c.id);
                      setView('editor');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition border ${
                      selectedChapter === c.id
                        ? theme === 'dark'
                          ? 'bg-emerald-900/30 border-emerald-700 text-emerald-200'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : theme === 'dark'
                        ? 'hover:bg-gray-700 border-transparent text-gray-300'
                        : 'hover:bg-gray-200 border-transparent text-gray-700'
                    }`}
                  >
                    <span className="truncate">{c.name}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteChapter(c.id); }}
                      className="text-red-400 hover:text-red-300 text-xs"
                      title="Elimina capitolo"
                    >
                      🗑
                    </button>
                  </button>
                ))}
                {chapters.length === 0 && (
                  <div className="px-2 text-sm opacity-50">Nessun capitolo.</div>
                )}
              </div>
            </div>
          )}
        </aside>

        {/* MAIN AREA */}
        <main className="flex-1 overflow-y-auto p-6">
          {selectedTitle && selectedChapter ? (
            <div className="max-w-4xl mx-auto">
              {/* Tabs */}
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={() => setView('editor')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition border ${
                    view === 'editor'
                      ? theme === 'dark'
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-blue-600 border-blue-500 text-white'
                      : theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  ✏️ Modifica
                </button>
                <button
                  onClick={() => setView('history')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition border ${
                    view === 'history'
                      ? theme === 'dark'
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-blue-600 border-blue-500 text-white'
                      : theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  🕐 Cronologia
                </button>
                <div className="flex-1" />
                <span className="text-sm opacity-60">
                  {selectedTitle} / {selectedChapter}
                </span>
              </div>

              {view === 'editor' ? (
                <Editor
                  titleId={selectedTitle}
                  chapterId={selectedChapter}
                  theme={theme}
                />
              ) : (
                <HistoryViewer
                  titleId={selectedTitle}
                  chapterId={selectedChapter}
                  theme={theme}
                  onRestore={() => setView('editor')}
                />
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full opacity-50 gap-4">
              <div className="text-4xl">📝</div>
              <div className="text-lg">
                {selectedTitle
                  ? 'Seleziona un capitolo per iniziare'
                  : 'Seleziona o crea un titolo per iniziare'}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
