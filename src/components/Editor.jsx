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
  const previewRef = useRef(null);

  // Undo / Redo stacks
  const undoStack = useRef([]);
  const redoStack = useRef([]);
  const lastSavedContent = useRef('');
  const isUndoing = useRef(false);

  const loadContent = useCallback(async () => {
    const chapter = await getChapter(chapterId);
    if (chapter) {
      const text = chapter.content || '';
      setContent(text);
      lastSavedContent.current = text;
      undoStack.current = [text];
      redoStack.current = [];
      setLastEditedBy(chapter.last_edited_by);
      setLastSaved(chapter.updated_at);
    }
  }, [chapterId]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  // Realtime updates from DB
  useEffect(() => {
    const channel = supabase
      .channel(`chapter-${chapterId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'chapters', filter: `id=eq.${chapterId}` },
        (payload) => {
          if (payload.new.last_edited_by !== user) {
            const text = payload.new.content || '';
            setContent(text);
            lastSavedContent.current = text;
            undoStack.current = [text];
            redoStack.current = [];
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

  // Broadcast typing
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

  // Keyboard shortcuts: undo/redo + enter edit from preview
  useEffect(() => {
    const handler = (e) => {
      // Ctrl/Cmd + Z = Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        performUndo();
        return;
      }
      // Ctrl/Cmd + Y  OR  Ctrl/Cmd + Shift + Z = Redo
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        performRedo();
        return;
      }
      // Any printable key while in markdown preview -> enter edit mode
      if (isMarkdownView && !isEditing && !e.ctrlKey && !e.metaKey && !e.altKey && e.key.length === 1) {
        e.preventDefault();
        setIsEditing(true);
        // Insert the pressed character after focus
        requestAnimationFrame(() => {
          if (textareaRef.current) {
            textareaRef.current.focus();
            const start = textareaRef.current.selectionStart;
            const end = textareaRef.current.selectionEnd;
            const newText = content.slice(0, start) + e.key + content.slice(end);
            updateContent(newText, true);
            textareaRef.current.setSelectionRange(start + 1, start + 1);
          }
        });
      }
      // Escape exits edit mode in markdown view
      if (e.key === 'Escape' && isMarkdownView && isEditing) {
        setIsEditing(false);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isMarkdownView, isEditing, content]);

  const updateContent = (newContent, skipUndo = false) => {
    setContent(newContent);

    if (!skipUndo && !isUndoing.current) {
      // Push to undo stack if different from last
      const last = undoStack.current[undoStack.current.length - 1];
      if (last !== newContent) {
        undoStack.current.push(newContent);
        // Limit stack size
        if (undoStack.current.length > 100) {
          undoStack.current = undoStack.current.slice(-100);
        }
        redoStack.current = [];
      }
    }

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
    }, 60000); // 1 minuto autosave
  };

  const handleSave = useCallback(
    async (newContent) => {
      setSaving(true);
      try {
        const updated = await saveChapter(chapterId, newContent, user);
        if (updated) {
          setLastEditedBy(updated.last_edited_by);
          setLastSaved(updated.updated_at);
          lastSavedContent.current = newContent;
        }
      } catch (err) {
        console.error(err);
      }
      setSaving(false);
    },
    [chapterId, user]
  );

  const performUndo = () => {
    if (undoStack.current.length <= 1) return;
    const current = undoStack.current.pop();
    redoStack.current.push(current);
    const prev = undoStack.current[undoStack.current.length - 1];
    isUndoing.current = true;
    setContent(prev);
    isUndoing.current = false;
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const performRedo = () => {
    if (redoStack.current.length === 0) return;
    const next = redoStack.current.pop();
    undoStack.current.push(next);
    isUndoing.current = true;
    setContent(next);
    isUndoing.current = false;
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleChange = (e) => {
    updateContent(e.target.value);
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
          {/* Undo / Redo buttons */}
          <button
            onClick={performUndo}
            disabled={undoStack.current.length <= 1}
            className={`px-1.5 py-0.5 rounded text-[10px] md:text-xs border transition ${
              undoStack.current.length <= 1
                ? 'opacity-40 cursor-not-allowed'
                : theme === 'dark'
                ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
            }`}
            title="Annulla (Ctrl+Z)"
          >
            ↩ Annulla
          </button>
          <button
            onClick={performRedo}
            disabled={redoStack.current.length === 0}
            className={`px-1.5 py-0.5 rounded text-[10px] md:text-xs border transition ${
              redoStack.current.length === 0
                ? 'opacity-40 cursor-not-allowed'
                : theme === 'dark'
                ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
            }`}
            title="Ripeti (Ctrl+Y / Ctrl+Shift+Z)"
          >
            ↪ Ripeti
          </button>
          <span className="w-px h-3 bg-gray-500/30 hidden sm:inline" />
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
          ref={previewRef}
          onClick={handleMarkdownClick}
          className={`w-full min-h-[50vh] md:min-h-[calc(100vh-340px)] p-3 md:p-4 rounded-xl border cursor-text overflow-y-auto prose prose-sm max-w-none ${
            theme === 'dark'
              ? 'bg-gray-800 border-gray-700 prose-invert'
              : 'bg-white border-gray-300'
          }`}
          tabIndex={0}
        >
          {content ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {content}
            </ReactMarkdown>
          ) : (
            <p className="opacity-50 italic">Clicca qui o premi un tasto per iniziare a scrivere...</p>
          )}
        </div>
      ) : (
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
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
