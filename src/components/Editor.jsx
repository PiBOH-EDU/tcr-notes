import { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { supabase } from '../lib/supabase';
import { getChapter, saveChapter } from '../lib/storage';
import MarkdownToolbar from './MarkdownToolbar';

let globalTypingTimeout = null;

export default function Editor({ chapterId, user, theme }) {
  const [content, setContent] = useState('');
  const [lastEditedBy, setLastEditedBy] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);
  const [typingUser, setTypingUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [isMarkdownView, setIsMarkdownView] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const broadcastChannelRef = useRef(null);
  const debounceRef = useRef(null);
  const textareaRef = useRef(null);

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

  const handleMarkdownClick = () => {
    setIsEditing(true);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 0);
  };

  const handleTextareaBlur = () => {
    if (isMarkdownView) {
      setIsEditing(false);
    }
  };

  return (
    <div>
      {/* Status bar */}
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2 px-3 py-2 rounded-lg border text-xs md:text-sm ${
          theme === 'dark'
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}
      >
        <div className="flex items-center gap-2">
          {saving ? (
            <span className="text-yellow-400">💾 Salvataggio...</span>
          ) : (
            <span className="text-green-400">✓ Salvato</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Toggle Markdown */}
          <button
            onClick={() => {
              setIsMarkdownView(!isMarkdownView);
              setIsEditing(false);
            }}
            className={`relative inline-flex h-4 w-7 md:h-5 md:w-9 items-center rounded-full transition-colors focus:outline-none ${
              isMarkdownView
                ? 'bg-blue-600'
                : theme === 'dark'
                ? 'bg-gray-600'
                : 'bg-gray-300'
            }`}
            role="switch"
            aria-checked={isMarkdownView}
            title={isMarkdownView ? 'Markdown attivo' : 'Testo piano'}
          >
            <span
              className={`inline-block h-2.5 w-2.5 md:h-3 md:w-3 transform rounded-full bg-white transition ${
                isMarkdownView ? 'translate-x-3.5 md:translate-x-5' : 'translate-x-0.5 md:translate-x-1'
              }`}
            />
          </button>
          <span className="text-[10px] md:text-xs opacity-70">
            {isMarkdownView ? 'Markdown' : 'Testo'}
          </span>
        </div>
        <div className="truncate">
          {typingUser ? (
            <span className="text-blue-400 font-medium animate-pulse">
              ✍️ {typingUser} sta scrivendo...
            </span>
          ) : lastEditedBy ? (
            <span className="opacity-70">
              Ultima mod: <span className="font-medium">{lastEditedBy}</span>
            </span>
          ) : (
            <span className="opacity-50">Nessuna modifica</span>
          )}
        </div>
      </div>

      <div className="text-[10px] md:text-xs opacity-50 mb-1.5 text-right">
        {formatDate(lastSaved)}
      </div>

      {/* Toolbar */}
      {(!isMarkdownView || isEditing) && (
        <MarkdownToolbar textareaRef={textareaRef} theme={theme} />
      )}

      {/* Editor / Preview */}
      {isMarkdownView && !isEditing ? (
        <div
          onClick={handleMarkdownClick}
          className={`w-full min-h-[50vh] md:min-h-[calc(100vh-340px)] p-3 md:p-4 rounded-xl border cursor-text overflow-y-auto prose prose-sm max-w-none ${
            theme === 'dark'
              ? 'bg-gray-800 border-gray-700 prose-invert'
              : 'bg-white border-gray-300'
          }`}
        >
          {content ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {content}
            </ReactMarkdown>
          ) : (
            <p className="opacity-50 italic">Clicca qui per iniziare a scrivere...</p>
          )}
        </div>
      ) : (
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          onBlur={handleTextareaBlur}
          className={`w-full min-h-[50vh] md:h-[calc(100vh-340px)] p-3 md:p-4 rounded-xl border resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm md:text-base leading-relaxed ${
            theme === 'dark'
              ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
          }`}
          placeholder="Inizia a scrivere gli appunti qui..."
          spellCheck={false}
        />
      )}
    </div>
  );
}
