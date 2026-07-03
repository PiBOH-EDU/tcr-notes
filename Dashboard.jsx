import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import {
  getTitles,
  createTitle,
  deleteTitle,
  renameTitle,
  getChapters,
  createChapter,
  deleteChapter,
  renameChapter,
  exportAllData,
  importAllData,
} from '../lib/storage';
import ThemeToggle from './ThemeToggle';
import Editor from './Editor';
import HistoryViewer from './HistoryViewer';

export default function Dashboard({ user, theme, toggleTheme, onLogout }) {
  const [titles, setTitles] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [view, setView] = useState('editor');
  const [newTitle, setNewTitle] = useState('');
  const [newChapter, setNewChapter] = useState('');
  const [showNewTitle, setShowNewTitle] = useState(false);
  const [showNewChapter, setShowNewChapter] = useState(false);
  const [importError, setImportError] = useState('');
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [showOnlineList, setShowOnlineList] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingTitleId, setEditingTitleId] = useState(null);
  const [editingChapterId, setEditingChapterId] = useState(null);
  const [editTitleValue, setEditTitleValue] = useState('');
  const [editChapterValue, setEditChapterValue] = useState('');

  // --- Supabase Presence: chi è online ---
  useEffect(() => {
    const presenceChannel = supabase.channel('online-users', {
      config: { presence: { key: user } },
    });

    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        const users = Object.keys(state);
        setOnlineUsers(users);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({ user, online_at: new Date().toISOString() });
        }
      });

    return () => {
      presenceChannel.untrack();
      supabase.removeChannel(presenceChannel);
    };
  }, [user]);

  const refreshTitles = useCallback(async () => {
    const data = await getTitles();
    setTitles(data);
    setLoading(false);
  }, []);

  const refreshChapters = useCallback(async (titleId) => {
    const data = await getChapters(titleId);
    setChapters(data);
  }, []);

  useEffect(() => {
    refreshTitles();

    const channel = supabase
      .channel('titles-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'titles' },
        () => refreshTitles()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'chapters' },
        () => {
          if (selectedTitle) refreshChapters(selectedTitle);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshTitles, refreshChapters, selectedTitle]);

  useEffect(() => {
    if (selectedTitle) {
      refreshChapters(selectedTitle);
    } else {
      setChapters([]);
    }
  }, [selectedTitle, refreshChapters]);

  const handleCreateTitle = async () => {
    try {
      await createTitle(newTitle);
      setNewTitle('');
      setShowNewTitle(false);
      await refreshTitles();
    } catch (err) {
      alert('Errore: ' + err.message);
    }
  };

  const handleDeleteTitle = async (id, name) => {
    if (!confirm(`Eliminare il titolo "${name}" e tutti i suoi capitoli?`)) return;
    try {
      await deleteTitle(id);
      await refreshTitles();
      if (selectedTitle === id) {
        setSelectedTitle(null);
        setSelectedChapter(null);
      }
    } catch (err) {
      alert('Errore: ' + err.message);
    }
  };

  const handleCreateChapter = async () => {
    if (!selectedTitle) return;
    try {
      await createChapter(selectedTitle, newChapter);
      setNewChapter('');
      setShowNewChapter(false);
      await refreshChapters(selectedTitle);
    } catch (err) {
      alert('Errore: ' + err.message);
    }
  };

  const handleDeleteChapter = async (id, name) => {
    if (!confirm(`Eliminare il capitolo "${name}"?`)) return;
    try {
      await deleteChapter(id);
      await refreshChapters(selectedTitle);
      if (selectedChapter === id) {
        setSelectedChapter(null);
      }
    } catch (err) {
      alert('Errore: ' + err.message);
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      await importAllData(file);
      setImportError('');
      await refreshTitles();
      setSelectedTitle(null);
      setSelectedChapter(null);
      alert('Dati importati con successo!');
    } catch (err) {
      setImportError(err.message);
    }
    e.target.value = '';
  };

  const handleRenameTitle = async (id) => {
    if (!editTitleValue.trim()) return;
    try {
      await renameTitle(id, editTitleValue.trim());
      setEditingTitleId(null);
      setEditTitleValue('');
      await refreshTitles();
    } catch (err) {
      alert('Errore: ' + err.message);
    }
  };

  const handleRenameChapter = async (id) => {
    if (!editChapterValue.trim()) return;
    try {
      await renameChapter(id, editChapterValue.trim());
      setEditingChapterId(null);
      setEditChapterValue('');
      await refreshChapters(selectedTitle);
    } catch (err) {
      alert('Errore: ' + err.message);
    }
  };

  const startEditTitle = (t) => {
    setEditingTitleId(t.id);
    setEditTitleValue(t.name);
  };

  const startEditChapter = (c) => {
    setEditingChapterId(c.id);
    setEditChapterValue(c.name);
  };

  const cancelEdit = () => {
    setEditingTitleId(null);
    setEditingChapterId(null);
    setEditTitleValue('');
    setEditChapterValue('');
  };

  const selectTitle = (id) => {
    setSelectedTitle(id);
    setSelectedChapter(null);
    setView('editor');
    setSidebarOpen(false);
  };

  const selectChapter = (id) => {
    setSelectedChapter(id);
    setView('editor');
    setSidebarOpen(false);
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* HEADER */}
      <header
        className={`flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b ${
          theme === 'dark'
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}
      >
        <div className="flex items-center gap-3">
          {/* Hamburger mobile */}
          <button
            onClick={() => setSidebarOpen((s) => !s)}
            className="md:hidden p-2 rounded-lg border"
            aria-label="Menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg md:text-xl font-bold truncate">📖 tcr-notes</h1>
          <span
            className={`hidden sm:inline text-xs px-2 py-1 rounded-full ${
              theme === 'dark'
                ? 'bg-gray-700 text-gray-300'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {user}
          </span>
          {/* Online indicator mobile */}
          <button
            onClick={() => setShowOnlineList((s) => !s)}
            className="sm:hidden relative"
            title="Utenti online"
          >
            <span className="flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            {showOnlineList && (
              <div className={`absolute top-6 left-0 z-50 w-40 rounded-lg border shadow-lg p-2 text-xs ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <div className="font-semibold mb-1">Online ({onlineUsers.length})</div>
                {onlineUsers.map((u) => (
                  <div key={u} className="truncate">{u}</div>
                ))}
              </div>
            )}
          </button>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          {/* Online desktop */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => setShowOnlineList((s) => !s)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs border transition ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-gray-300'
                  : 'bg-gray-100 border-gray-300 text-gray-700'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              {onlineUsers.length} online
            </button>
            {showOnlineList && (
              <div className={`absolute top-14 right-20 z-50 w-48 rounded-lg border shadow-lg p-2 text-xs ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <div className="font-semibold mb-1">Utenti online</div>
                {onlineUsers.map((u) => (
                  <div key={u} className="truncate">{u}</div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={exportAllData}
            className={`hidden md:inline-flex px-3 py-1.5 text-sm rounded-lg transition ${
              theme === 'dark'
                ? 'bg-green-700 hover:bg-green-600 text-white'
                : 'bg-green-600 hover:bg-green-500 text-white'
            }`}
          >
            Esporta
          </button>
          <label
            className={`hidden md:inline-flex px-3 py-1.5 text-sm rounded-lg cursor-pointer transition ${
              theme === 'dark'
                ? 'bg-purple-700 hover:bg-purple-600 text-white'
                : 'bg-purple-600 hover:bg-purple-500 text-white'
            }`}
          >
            Importa
            <input type="file" accept=".json" className="hidden" onChange={handleImport} />
          </label>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          <button
            onClick={onLogout}
            className="px-3 py-1.5 text-sm rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
          >
            <span className="hidden md:inline">Esci</span>
            <span className="md:hidden">🚪</span>
          </button>
        </div>
      </header>

      {importError && (
        <div className="px-6 py-2 bg-red-900/30 text-red-400 text-sm border-b border-red-800">
          Errore importazione: {importError}
        </div>
      )}

      <div className="flex flex-1 overflow-hidden relative">
        {/* SIDEBAR — mobile overlay, desktop fixed */}
        <aside
          className={`absolute md:relative z-40 w-72 h-full border-r overflow-y-auto flex flex-col transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          } ${
            theme === 'dark'
              ? 'bg-gray-800 border-gray-700'
              : 'bg-gray-100 border-gray-200'
          }`}
        >
          {/* Close mobile sidebar */}
          <div className="md:hidden flex items-center justify-between p-3 border-b border-gray-700/30">
            <span className="text-sm font-semibold">Menu</span>
            <button onClick={() => setSidebarOpen(false)} className="p-1 rounded hover:bg-gray-700">
              ✕
            </button>
          </div>

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
                  {editingTitleId === t.id ? (
                    <div className="flex items-center gap-1 px-2 py-1.5">
                      <input
                        type="text"
                        value={editTitleValue}
                        onChange={(e) => setEditTitleValue(e.target.value)}
                        className={`flex-1 px-2 py-1 text-sm rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleRenameTitle(t.id);
                          if (e.key === 'Escape') cancelEdit();
                        }}
                        autoFocus
                      />
                      <button
                        onClick={() => handleRenameTitle(t.id)}
                        className="px-1.5 py-1 text-xs rounded bg-green-600 hover:bg-green-700 text-white"
                        title="Salva"
                      >
                        ✓
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-1.5 py-1 text-xs rounded bg-gray-600 hover:bg-gray-700 text-white"
                        title="Annulla"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => selectTitle(t.id)}
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
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => { e.stopPropagation(); startEditTitle(t); }}
                          className="text-blue-400 hover:text-blue-300 text-xs"
                          title="Rinomina titolo"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteTitle(t.id, t.name); }}
                          className="text-red-400 hover:text-red-300 text-xs"
                          title="Elimina titolo"
                        >
                          🗑
                        </button>
                      </div>
                    </button>
                  )}
                </div>
              ))}
              {titles.length === 0 && !loading && (
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
                  Capitoli
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
                  <div key={c.id}>
                    {editingChapterId === c.id ? (
                      <div className="flex items-center gap-1 px-2 py-1.5">
                        <input
                          type="text"
                          value={editChapterValue}
                          onChange={(e) => setEditChapterValue(e.target.value)}
                          className={`flex-1 px-2 py-1 text-sm rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            theme === 'dark'
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleRenameChapter(c.id);
                            if (e.key === 'Escape') cancelEdit();
                          }}
                          autoFocus
                        />
                        <button
                          onClick={() => handleRenameChapter(c.id)}
                          className="px-1.5 py-1 text-xs rounded bg-green-600 hover:bg-green-700 text-white"
                          title="Salva"
                        >
                          ✓
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-1.5 py-1 text-xs rounded bg-gray-600 hover:bg-gray-700 text-white"
                          title="Annulla"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => selectChapter(c.id)}
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
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => { e.stopPropagation(); startEditChapter(c); }}
                            className="text-blue-400 hover:text-blue-300 text-xs"
                            title="Rinomina capitolo"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteChapter(c.id, c.name); }}
                            className="text-red-400 hover:text-red-300 text-xs"
                            title="Elimina capitolo"
                          >
                            🗑
                          </button>
                        </div>
                      </button>
                    )}
                  </div>
                ))}
                {chapters.length === 0 && (
                  <div className="px-2 text-sm opacity-50">Nessun capitolo.</div>
                )}
              </div>
            </div>
          )}
        </aside>

        {/* Overlay mobile */}
        {sidebarOpen && (
          <div
            className="absolute inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* MAIN AREA */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {selectedTitle && selectedChapter ? (
            <div className="max-w-4xl mx-auto">
              {/* Tabs */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <button
                  onClick={() => setView('editor')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition border ${
                    view === 'editor'
                      ? 'bg-blue-600 border-blue-500 text-white'
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
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  🕐 Cronologia
                </button>
                <div className="flex-1" />
                <span className="text-sm opacity-60 truncate max-w-[150px] md:max-w-none">
                  {titles.find((t) => t.id === selectedTitle)?.name} /{' '}
                  {chapters.find((c) => c.id === selectedChapter)?.name}
                </span>
              </div>

              {view === 'editor' ? (
                <Editor
                  chapterId={selectedChapter}
                  user={user}
                  theme={theme}
                />
              ) : (
                <HistoryViewer
                  chapterId={selectedChapter}
                  user={user}
                  theme={theme}
                  onRestore={() => setView('editor')}
                />
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full opacity-50 gap-4">
              <div className="text-4xl">📝</div>
              <div className="text-lg text-center px-4">
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
