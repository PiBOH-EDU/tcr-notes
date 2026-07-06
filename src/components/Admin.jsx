import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { getRecentHistory } from '../lib/storage';
import { listAuthorizedUsers, getUserRoleFromList } from '../lib/auth';

export default function Admin({ theme }) {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(() => {
    return localStorage.getItem('tcr-admin-auth') === 'true';
  });
  const [authError, setAuthError] = useState('');

  const [supabaseStatus, setSupabaseStatus] = useState('checking');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [recentHistory, setRecentHistory] = useState([]);
  const [titles, setTitles] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [authorizedList, setAuthorizedList] = useState([]);
  const [workflowRuns, setWorkflowRuns] = useState([]);
  const [loading, setLoading] = useState(true);

  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || '';

  // Login admin
  const handleLogin = (e) => {
    e.preventDefault();
    if (ADMIN_PASSWORD && password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      localStorage.setItem('tcr-admin-auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Password admin errata o non configurata.');
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('tcr-admin-auth');
    setAuthenticated(false);
    setPassword('');
  };

  const handleRefresh = () => {
    if (!authenticated) return;
    setLoading(true);
    loadDataRef.current();
  };

  const loadDataRef = useRef(null);

  // Carica dati dashboard
  useEffect(() => {
    if (!authenticated) return;

    const loadData = async () => {
      setLoading(true);

      // Stato Supabase
      try {
        const timeout = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), 3000)
        );
        const check = supabase.from('titles').select('id', { head: true, count: 'exact' });
        const { error } = await Promise.race([check, timeout]);
        if (error) throw error;
        setSupabaseStatus('online');
      } catch {
        setSupabaseStatus('offline');
      }

      // Titoli e capitoli (per risolvere nomi)
      const { data: tData } = await supabase.from('titles').select('*');
      const { data: cData } = await supabase.from('chapters').select('*');
      setTitles(tData || []);
      setChapters(cData || []);

      // Lista utenti autorizzati (da Supabase, GDPR-safe)
      try {
        const users = await listAuthorizedUsers();
        setAuthorizedList(users);
      } catch {
        setAuthorizedList([]);
      }

      // Log recenti
      try {
        const hist = await getRecentHistory(20);
        setRecentHistory(hist);
      } catch {
        setRecentHistory([]);
      }

      // Workflow GitHub Actions
      try {
        const res = await fetch('https://api.github.com/repos/PiBOH-EDU/tcr-notes/actions/runs?per_page=5');
        if (res.ok) {
          const data = await res.json();
          setWorkflowRuns(data.workflow_runs || []);
        }
      } catch {
        setWorkflowRuns([]);
      }

      setLoading(false);
    };

    loadDataRef.current = loadData;
    loadData();

    // Check Supabase ogni 30 secondi
    const interval = setInterval(async () => {
      try {
        const timeout = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), 3000)
        );
        const check = supabase.from('titles').select('id', { head: true, count: 'exact' });
        const { error } = await Promise.race([check, timeout]);
        if (error) throw error;
        setSupabaseStatus('online');
      } catch {
        setSupabaseStatus('offline');
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [authenticated]);

  // Ricevi posizione utenti dal broadcast typing
  useEffect(() => {
    if (!authenticated) return;
    const channel = supabase.channel('notes-room');
    channel
      .on('broadcast', { event: 'typing' }, (payload) => {
        const { user: typingName, titleId, chapterId, titleName, chapterName } = payload.payload;
        setOnlineUsers((prev) => {
          const filtered = prev.filter((u) => u.name !== typingName);
          return [...filtered, { name: typingName, titleId, chapterId, titleName, chapterName, lastSeen: Date.now() }];
        });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [authenticated]);

  // Pulisci utenti inattivi
  useEffect(() => {
    if (!authenticated) return;
    const interval = setInterval(() => {
      setOnlineUsers((prev) => prev.filter((u) => Date.now() - u.lastSeen < 30000));
    }, 10000);
    return () => clearInterval(interval);
  }, [authenticated]);

  const getUserLocation = (u) => {
    if (u.titleName && u.chapterName) return `${u.titleName} > ${u.chapterName}`;
    if (u.titleName) return u.titleName;
    if (!u.titleId && !u.chapterId) return 'Homepage';
    const title = titles.find((t) => t.id === u.titleId);
    const chapter = chapters.find((c) => c.id === u.chapterId);
    if (title && chapter) return `${title.name} > ${chapter.name}`;
    if (title) return title.name;
    return 'Homepage';
  };

  const getUserRole = (name) => getUserRoleFromList(name, authorizedList);

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
          <button
            onClick={handleRefresh}
            className="text-xs px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white transition"
            title="Aggiorna dati"
          >
            🔄 Aggiorna
          </button>
          <button
            onClick={() => { window.location.pathname = '/'; }}
            className="text-xs px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
          >
            ← Torna all'app
          </button>
          <button
            onClick={handleAdminLogout}
            className="text-xs px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
          >
            Esci
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
              <div className="text-lg font-bold mt-1 text-purple-400">{authorizedList.length}</div>
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
                <span className="text-[10px] opacity-50">da Supabase (GDPR-safe)</span>
              </div>
              <div className="overflow-x-auto max-h-80 overflow-y-auto">
                <table className="w-full text-left">
                  <thead className="sticky top-0 bg-inherit">
                    <tr>
                      <th className={tableHeader}>Nome</th>
                      <th className={tableHeader}>Ruolo</th>
                      <th className={tableHeader}>Stato</th>
                    </tr>
                  </thead>
                  <tbody>
                    {authorizedList.map((entry, idx) => (
                      <tr key={idx}>
                        <td className={tableCell}>{entry.identificativo}</td>
                        <td className={tableCell}>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                            entry.ruolo === 'viewer'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-green-500/20 text-green-400'
                          }`}>
                            {entry.ruolo === 'viewer' ? '👁️ Viewer' : '✏️ Editor'}
                          </span>
                        </td>
                        <td className={tableCell}>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                            entry.bannato
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-green-500/20 text-green-400'
                          }`}>
                            {entry.bannato ? '🚫 Bannato' : '✅ Attivo'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Workflow GitHub Actions */}
            <div className={cardBase}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold">🔄 Workflow GitHub</h2>
                <span className="text-[10px] opacity-50">ultimi 5 run</span>
              </div>
              {workflowRuns.length === 0 ? (
                <div className="text-sm opacity-50 py-4 text-center">Nessun workflow trovato</div>
              ) : (
                <div className="overflow-x-auto max-h-80 overflow-y-auto">
                  <table className="w-full text-left">
                    <thead className="sticky top-0 bg-inherit">
                      <tr>
                        <th className={tableHeader}>Workflow</th>
                        <th className={tableHeader}>Stato</th>
                        <th className={tableHeader}>Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {workflowRuns.map((run) => (
                        <tr key={run.id}>
                          <td className={tableCell}>
                            <a
                              href={run.html_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:underline"
                            >
                              {run.name}
                            </a>
                          </td>
                          <td className={tableCell}>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                              run.conclusion === 'success'
                                ? 'bg-green-500/20 text-green-400'
                                : run.conclusion === 'failure'
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {run.conclusion === 'success' ? '✅ Successo'
                                : run.conclusion === 'failure' ? '❌ Fallito'
                                : run.status === 'in_progress' ? '⏳ In corso'
                                : run.status}
                            </span>
                          </td>
                          <td className={`${tableCell} text-xs opacity-70`}>{formatDate(run.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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
