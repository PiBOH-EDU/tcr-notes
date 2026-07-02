import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';

let globalTypingTimeout = null;

export default function Editor({ note, user, theme }) {
  const [content, setContent] = useState(note.content || '');
  const [lastEditedBy, setLastEditedBy] = useState(note.last_edited_by);
  const [typingUser, setTypingUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const broadcastChannelRef = useRef(null);
  const debounceRef = useRef(null);

  // Sincronizza stato locale quando cambia nota selezionata
  useEffect(() => {
    setContent(note.content || '');
    setLastEditedBy(note.last_edited_by);
  }, [note.id]);

  // Setup broadcast channel per "sta scrivendo"
  useEffect(() => {
    const channel = supabase.channel('notes-room');
    broadcastChannelRef.current = channel;

    channel
      .on('broadcast', { event: 'typing' }, (payload) => {
        const { user: typingName } = payload.payload;
        if (typingName !== user) {
          setTypingUser(typingName);
          if (globalTypingTimeout) clearTimeout(globalTypingTimeout);
          globalTypingTimeout = setTimeout(() => setTypingUser(null), 2000);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Salva su Supabase con debounce
  const saveNote = useCallback(
    async (newContent) => {
      setSaving(true);
      const { error } = await supabase
        .from('notes')
        .update({
          content: newContent,
          last_edited_by: user,
          updated_at: new Date().toISOString(),
        })
        .eq('id', note.id);

      if (!error) {
        setLastEditedBy(user);
      }
      setSaving(false);
    },
    [note.id, user]
  );

  const handleChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);

    // Invia broadcast "sta scrivendo"
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.send({
        type: 'broadcast',
        event: 'typing',
        payload: { user },
      });
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      saveNote(newContent);
    }, 800);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div
        className={`flex items-center justify-between mb-4 px-4 py-3 rounded-lg border ${
          theme === 'dark'
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold">{note.title}</span>
          {saving && (
            <span className="text-xs opacity-60">Salvataggio...</span>
          )}
        </div>
        <div className="text-sm">
          {typingUser ? (
            <span className="text-blue-400 font-medium animate-pulse">
              ✍️ {typingUser} sta scrivendo...
            </span>
          ) : lastEditedBy ? (
            <span className="opacity-70">
              Ultima modifica di:{" "}
              <span className="font-medium">{lastEditedBy}</span>
            </span>
          ) : (
            <span className="opacity-50">Nessuna modifica registrata</span>
          )}
        </div>
      </div>

      <textarea
        value={content}
        onChange={handleChange}
        className={`w-full h-[calc(100vh-260px)] p-4 rounded-xl border resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-base leading-relaxed ${
          theme === 'dark'
            ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500'
            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
        }`}
        placeholder="Inizia a scrivere gli appunti qui..."
        spellCheck={false}
      />
    </div>
  );
}
