import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { getChapter, saveChapter } from '../lib/storage';

let globalTypingTimeout = null;

export default function Editor({ chapterId, user, theme }) {
  const [content, setContent] = useState('');
  const [lastEditedBy, setLastEditedBy] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);
  const [typingUser, setTypingUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const broadcastChannelRef = useRef(null);
  const debounceRef = useRef(null);

  const loadContent = useCallback(async () => {
    const chapter = await getChapter(chapterId);
    if (chapter) {
      setContent(chapter.content || '');
      setLastEditedBy(chapter.last_edited_by);
      setLastSaved(chapter.updated_at);
    }
  }, [chapterId]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  // Realtime: aggiornamenti dal DB
  useEffect(() => {
    const channel = supabase
      .channel(`chapter-${chapterId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'chapters', filter: `id=eq.${chapterId}` },
        (payload) => {
          if (payload.new.last_edited_by !== user) {
            setContent(payload.new.content || '');
            setLastEditedBy(payload.new.last_edited_by);
            setLastSaved(payload.new.updated_at);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chapterId, user]);

  // Broadcast: chi sta scrivendo
  useEffect(() => {
    const channel = supabase.channel('notes-room');
    broadcastChannelRef.current = channel;

    channel
      .on('broadcast', { event: 'typing' }, (payload) => {
        const { user: typingName, chapterId: cid } = payload.payload;
        if (typingName !== user && cid === chapterId) {
          setTypingUser(typingName);
          if (globalTypingTimeout) clearTimeout(globalTypingTimeout);
          globalTypingTimeout = setTimeout(() => setTypingUser(null), 2000);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chapterId, user]);

  const handleSave = useCallback(
    async (newContent) => {
      setSaving(true);
      try {
        const updated = await saveChapter(chapterId, newContent, user);
        if (updated) {
          setLastEditedBy(updated.last_edited_by);
          setLastSaved(updated.updated_at);
        }
      } catch (err) {
        console.error(err);
      }
      setSaving(false);
    },
    [chapterId, user]
  );

  const handleChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);

    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.send({
        type: 'broadcast',
        event: 'typing',
        payload: { user, chapterId },
      });
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      handleSave(newContent);
    }, 1000);
  };

  const formatDate = (iso) => {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleString('it-IT');
  };

  return (
    <div>
      <div
        className={`flex items-center justify-between mb-3 px-4 py-2 rounded-lg border text-sm ${
          theme === 'dark'
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}
      >
        <div className="flex items-center gap-3">
          {saving ? (
            <span className="text-yellow-400">💾 Salvataggio...</span>
          ) : (
            <span className="text-green-400">✓ Salvato</span>
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

      <div className="text-xs opacity-50 mb-2 text-right">
        Salvato: {formatDate(lastSaved)}
      </div>

      <textarea
        value={content}
        onChange={handleChange}
        className={`w-full h-[calc(100vh-300px)] p-4 rounded-xl border resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-base leading-relaxed ${
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
