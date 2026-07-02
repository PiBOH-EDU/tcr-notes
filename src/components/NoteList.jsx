export default function NoteList({ notes, selectedId, onSelect, theme, loading }) {
  if (loading) {
    return (
      <div className="p-4 text-sm opacity-60">Caricamento note...</div>
    );
  }

  return (
    <div className="p-3 space-y-2">
      <h2
        className={`text-xs font-bold uppercase tracking-wider opacity-60 mb-3 px-2 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}
      >
        Note
      </h2>
      {notes.map((note) => (
        <button
          key={note.id}
          onClick={() => onSelect(note)}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition border ${
            selectedId === note.id
              ? theme === 'dark'
                ? 'bg-blue-900/30 border-blue-700 text-blue-200'
                : 'bg-blue-50 border-blue-200 text-blue-800'
              : theme === 'dark'
              ? 'hover:bg-gray-700 border-transparent text-gray-300'
              : 'hover:bg-gray-200 border-transparent text-gray-700'
          }`}
        >
          <div className="font-medium truncate">{note.title}</div>
          {note.last_edited_by && (
            <div className="text-xs opacity-60 mt-0.5">
              Mod: {note.last_edited_by}
            </div>
          )}
        </button>
      ))}
      {notes.length === 0 && (
        <div className="px-2 text-sm opacity-50">Nessuna nota disponibile</div>
      )}
    </div>
  );
}
