import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import ThemeToggle from './ThemeToggle';
import Editor from './Editor';
import NoteList from './NoteList';

export default function Dashboard({ user, theme, toggleTheme, onLogout }) {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes();

    const channel = supabase
      .channel('notes-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notes' },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setNotes((prev) =>
              prev.map((n) => (n.id === payload.new.id ? payload.new : n))
            );
            if (selectedNote && selectedNote.id === payload.new.id) {
              // Se l'update è da un altro utente, aggiorna la nota selezionata
              if (payload.new.last_edited_by !== user) {
                setSelectedNote(payload.new);
              }
            }
          } else if (payload.eventType === 'INSERT') {
            setNotes((prev) => [...prev, payload.new]);
          } else if (payload.eventType === 'DELETE') {
            setNotes((prev) => prev.filter((n) => n.id !== payload.old.id));
            if (selectedNote && selectedNote.id === payload.old.id) {
              setSelectedNote(null);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, selectedNote?.id]);

  const fetchNotes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: true });
    if (!error && data) {
      setNotes(data);
      if (data.length > 0 && !selectedNote) {
        setSelectedNote(data[0]);
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <header
        className={`flex items-center justify-between px-6 py-4 border-b ${
          theme === 'dark'
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold">
            📖 The Catcher in the Rye — Appunti 1FT
          </h1>
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
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          <button
            onClick={onLogout}
            className="px-3 py-1.5 text-sm rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
          >
            Esci
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside
          className={`w-64 border-r overflow-y-auto ${
            theme === 'dark'
              ? 'bg-gray-800 border-gray-700'
              : 'bg-gray-100 border-gray-200'
          }`}
        >
          <NoteList
            notes={notes}
            selectedId={selectedNote?.id}
            onSelect={setSelectedNote}
            theme={theme}
            loading={loading}
          />
        </aside>
        <main className="flex-1 overflow-y-auto p-6">
          {selectedNote ? (
            <Editor note={selectedNote} user={user} theme={theme} />
          ) : (
            <div className="flex items-center justify-center h-full opacity-50">
              Seleziona una nota per iniziare
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
