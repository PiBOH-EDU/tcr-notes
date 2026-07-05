import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { getRecentHistory } from '../lib/storage';
import { AUTHORIZED } from '../data/authorized';

export default function Admin({ theme, user }) {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');

  const [supabaseStatus, setSupabaseStatus] = useState('checking');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [recentHistory, setRecentHistory] = useState([]);
  const [titles, setTitles] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || '';

  // Login admin
  const handleLogin = (e) => {
    e.preventDefault();
    if (ADMIN_PASSWORD && password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Password admin errata o non configurata.');
    }
  };

  // Carica dati dashboard
  useEffect(() => {
    if (!authenticated) return;

    const loadData = async () => {
      setLoading(true);

      // Stato Supabase
      try {
        await supabase.from('titles').select('id', { head: true, count: 'exact' });
        setSupabaseStatus('online');
      } catch {
        setSupabaseStatus('offline');
      }

      // Titoli e capitoli (per risolvere nomi)
      const { data: tData } = await supabase.from('titles').select('*');
      const { data: cData } = await supabase.from('chapters').select('*');
      setTitles(tData || []);
      setChapters(cData || []);

      // Log recenti
      try {
        const hist = await getRecentHistory(20);
        setRecentHistory(hist);
      } catch {
        setRecentHistory([]);
      }

      setLoading(false);
    };

    loadData();

    // Check Supabase ogni 30 secondi
    const interval = setInterval(async () => {
      try {
        await supabase.from('titles').select('id', { head: true, count: 'exact' });
        setSupabaseStatus('online');
      } catch {
        setSupabaseStatus('offline');
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [authenticated]);

  // Presence utenti online
  useEffect(() => {
    if (!authenticated) return;

    const presenceChannel = supabase.channel('online-users', {
      config: { presence: { key: user } },
    });

    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        const users = Object.keys(state).map((name) => ({
          name,
          lastSeen: Date.now(),
        }));
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
  }, [authenticated, user]);

  // Ricevi posizione utenti dal broadcast typing
  useEffect(() => {
    if (!authenticated) return;
    const channel = supabase.channel('notes-room');
    channel
      .on('broadcast', { event: 'typing' }, (payload) => {
        const { user: typingName, titleId, chapterId } = payload.payload;
        if (typingName !== user) {
          setOnlineUsers((prev) => {
            const filtered = prev.filter((u) => u.name !== typingName);
            return [...filtered, { name: typingName, titleId, chapterId, lastSeen: Date.now() }];
          });
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [authenticated, user]);

  // Pulisci utenti inattivi
  useEffect(() => {
    if (!authenticated) return;
    const interval = setInterval(() => {
      setOnlineUsers((prev) => prev.filter((u) => Date.now() - u.lastSeen < 30000));
    }, 10000);
    return () => clearInterval(interval);
  }, [authenticated]);

  const getUserLocation = (u) => {
    if (!u.titleId && !u.chapterId) return 'Homepage';
    const title = titles.find((t) => t.id === u.titleId);
    const chapter = chapters.find((c) => c.id === u.chapterId);
    if (title && chapter) return `${title.name} > ${chapter.name}`;
    if (title) return title.name;
    return 'Homepage';
  };

  const getUserRole = (name) => {
    const entry = AUTHORIZED.find((a) => {
      if (typeof a === 'string') return a.toLowerCase() === name.toLowerCase();
      return a.name?.toLowerCase() === name.toLowerCase();
    });
    if (!entry) return 'editor';
    if (typeof entry === 'string') return 'editor';
    return entry.role || 'editor';
  };

  const getChapterName = (chapterId) => {
    const c = chapters.find((x) => x.id === chapterId);
    return c?.name || `Capitolo #${chapterId}`;
  };

  const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('it-IT');
  };

  const cardBase = `rounded-xl border p-4 ${
    theme === 'dark'
      ? 'bg-gray-800 border-gray-700'
      : 'bg-white border-gray-200'
  }`;

  const tableHeader = `text-left text-xs font-bold uppercase tracking-wider opacity-60 px-3 py-2 ${
    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
  }`;

  const tableCell = `px-3 py-2 text-sm border-t ${
    theme === 'dark' ? 'border-gray-700/50' : 'border-gray-100'
  }`;

  if (!authenticated) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
        <div className={`w-full max-w-sm p-8 rounded-2xl shadow-2xl border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h1 className="text-2xl font-bold mb-2 text-center">🔒 Admin</h1>
          <p className="text-xs text-center opacity-70 mb-6">Dashboard riservata all'amministratore</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password admin"
              className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
              }`}
            />
            {authError && <div className="text-red-500 text-sm text-center">{authError}</div>}
            <button type="submit" className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition">
              Accedi
            </button>
          </form>
          <button
            onClick={() => { window.location.pathname = '/'; }}
            className="w-full mt-3 text-xs opacity-60 hover:opacity-100 transition"
          >
            ← Torna a tcr-notes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 md:p-6 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">🔒 Dashboard Admin</h1>
          <p className="text-xs opacity-60 mt-0.5">Panoramica completa sistema tcr-notes</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-full ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
            👤 {user}
          </span>
          <button
            onClick={() => { window.location.pathname = '/'; }}
            className="text-xs px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
          >
            ← Torna all'app
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 opacity-60">Caricamento dashboard...</div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className={`${cardBase} border-l-4 ${supabaseStatus === 'online' ? 'border-l-green-500' : 'border-l-red-500'}`}>
              <div className="text-xs opacity-60 uppercase tracking-wider">Stato Supabase</div>
              <div className={`text-lg font-bold mt-1 ${supabaseStatus === 'online' ? 'text-green-400' : 'text-red-400'}`}>
                {supabaseStatus === 'online' ? '🟢 Online' : '🔴 Offline'}
              </div>
              <div className="text-[10px] opacity-50 mt-1">Aggiornato ogni 30s</div>
            </div>

            <div className={`${cardBase} border-l-4 border-l-blue-500`}>
              <div className="text-xs opacity-60 uppercase tracking-wider">Utenti Online</div>
              <div className="text-lg font-bold mt-1 text-blue-400">{onlineUsers.length}</div>
              <div className="text-[10px] opacity-50 mt-1">In tempo reale</div>
            </div>

            <div className={`${cardBase} border-l-4 border-l-purple-500`}>
              <div className="text-xs opacity-60 uppercase tracking-wider">Autorizzati</div>
              <div className="text-lg font-bold mt-1 text-purple-400">{AUTHORIZED.length}</div>
              <div className="text-[10px] opacity-50 mt-1">Viewer + Editor</div>
            </div>

            <div className={`${cardBase} border-l-4 border-l-amber-500`}>
              <div className="text-xs opacity-60 uppercase tracking-wider">Modifiche Recenti</div>
              <div className="text-lg font-bold mt-1 text-amber-400">{recentHistory.length}</div>
              <div className="text-[10px] opacity-50 mt-1">Ultime 20 revisioni</div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Utenti Online */}
            <div className={cardBase}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold">👥 Utenti Online</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">{onlineUsers.length} attivi</span>
              </div>
              {onlineUsers.length === 0 ? (
                <div className="text-sm opacity-50 py-4 text-center">Nessun utente online</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr>
                        <th className={tableHeader}>Nome</th>
                        <th className={tableHeader}>Posizione</th>
                        <th className={tableHeader}>Ruolo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {onlineUsers.map((u) => (
                        <tr key={u.name}>
                          <td className={tableCell}>
                            <span className="relative inline-flex h-2 w-2 mr-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            {u.name}
                          </td>
                          <td className={`${tableCell} opacity-80`}>{getUserLocation(u)}</td>
                          <td className={tableCell}>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                              getUserRole(u.name) === 'viewer'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-green-500/20 text-green-400'
                            }`}>
                              {getUserRole(u.name) === 'viewer' ? '👁️ Viewer' : '✏️ Editor'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Utenti Autorizzati */}
            <div className={cardBase}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold">📋 Utenti Autorizzati</h2>
                <span className="text-[10px] opacity-50">da authorized.js</span>
              </div>
              <div className="overflow-x-auto max-h-80 overflow-y-auto">
                <table className="w-full text-left">
                  <thead className="sticky top-0 bg-inherit">
                    <tr>
                      <th className={tableHeader}>Nome</th>
                      <th className={tableHeader}>Ruolo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {AUTHORIZED.map((entry, idx) => {
                      const name = typeof entry === 'string' ? entry : entry.name;
                      const role = typeof entry === 'string' ? 'editor' : (entry.role || 'editor');
                      return (
                        <tr key={idx}>
                          <td className={tableCell}>{name}</td>
                          <td className={tableCell}>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                              role === 'viewer'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-green-500/20 text-green-400'
                            }`}>
                              {role === 'viewer' ? '👁️ Viewer' : '✏️ Editor'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Log Modifiche Recenti */}
            <div className={`${cardBase} xl:col-span-2`}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold">🕐 Log Modifiche Recenti</h2>
                <span className="text-[10px] opacity-50">tabella history</span>
              </div>
              {recentHistory.length === 0 ? (
                <div className="text-sm opacity-50 py-4 text-center">Nessuna modifica recente</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr>
                        <th className={tableHeader}>Utente</th>
                        <th className={tableHeader}>Capitolo</th>
                        <th className={tableHeader}>Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentHistory.map((h) => (
                        <tr key={h.id}>
                          <td className={tableCell}>{h.edited_by || '—'}</td>
                          <td className={`${tableCell} opacity-80`}>{getChapterName(h.chapter_id)}</td>
                          <td className={`${tableCell} text-xs opacity-70`}>{formatDate(h.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
