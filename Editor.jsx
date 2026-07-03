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
        className={`flex flex-wrap items-center justify-between gap-2 mb-3 px-4 py-2 rounded-lg border text-sm ${
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
        <div className="flex items-center gap-3">
          {/* Toggle Markdown / Testo piano */}
          <button
            onClick={() => {
              setIsMarkdownView(!isMarkdownView);
              setIsEditing(false);
            }}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isMarkdownView
                ? 'bg-blue-600'
                : theme === 'dark'
                ? 'bg-gray-600'
                : 'bg-gray-300'
            }`}
            role="switch"
            aria-checked={isMarkdownView}
            title={isMarkdownView ? 'Visualizzazione Markdown attiva' : 'Visualizzazione testo piano'}
          >
            <span
              className={`inline-block h-3 w-3 transform rounded-full bg-white transition ${
                isMarkdownView ? 'translate-x-5' : 'translate-x-1'
              }`}
            />
          </button>
          <span className="text-xs opacity-70">
            {isMarkdownView ? 'Markdown' : 'Testo piano'}
          </span>
        </div>
        <div className="text-sm">
          {typingUser ? (
            <span className="text-blue-400 font-medium animate-pulse">
              ✍️ {typingUser} sta scrivendo...
            </span>
          ) : lastEditedBy ? (
            <span className="opacity-70">
              Ultima modifica di:{' '}
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

      {/* Toolbar */}
      {(!isMarkdownView || isEditing) && (
        <MarkdownToolbar textareaRef={textareaRef} theme={theme} />
      )}

      {/* Editor / Preview */}
      {isMarkdownView && !isEditing ? (
        <div
          onClick={handleMarkdownClick}
          className={`w-full min-h-[calc(100vh-340px)] p-4 rounded-xl border cursor-text overflow-y-auto prose prose-sm max-w-none ${
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
          className={`w-full h-[calc(100vh-340px)] p-4 rounded-xl border resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-base leading-relaxed ${
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
