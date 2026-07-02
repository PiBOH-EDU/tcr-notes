import { useState, useEffect, useRef, useCallback } from 'react';
import { getChapter, saveChapter } from '../lib/storage';

export default function Editor({ titleId, chapterId, theme }) {
  const [content, setContent] = useState('');
  const [lastSaved, setLastSaved] = useState(null);
  const [saving, setSaving] = useState(false);
  const debounceRef = useRef(null);

  const loadContent = useCallback(() => {
    const chapter = getChapter(titleId, chapterId);
    if (chapter) {
      setContent(chapter.content || '');
      setLastSaved(chapter.updatedAt);
    }
  }, [titleId, chapterId]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  const handleSave = useCallback(
    (newContent) => {
      setSaving(true);
      const ok = saveChapter(titleId, chapterId, newContent);
      if (ok) {
        setLastSaved(new Date().toISOString());
      }
      setSaving(false);
    },
    [titleId, chapterId]
  );

  const handleChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);

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
        <div className="opacity-70">
          Ultimo salvataggio: {formatDate(lastSaved)}
        </div>
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
