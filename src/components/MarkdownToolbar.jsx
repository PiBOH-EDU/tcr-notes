export default function MarkdownToolbar({ textareaRef, theme }) {
  const insert = (before, after = '') => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const text = ta.value;
    const selected = text.slice(start, end);
    const replacement = before + selected + after;
    ta.setRangeText(replacement, start, end, 'end');
    ta.focus();
    ta.dispatchEvent(new Event('input', { bubbles: true }));
  };

  const insertImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const MAX_SIZE = 1.5 * 1024 * 1024; // 1.5 MB
      if (file.size > MAX_SIZE) {
        alert(`File troppo grande! Dimensione massima: 1.5 MB. Il tuo file è ${(file.size / 1024 / 1024).toFixed(2)} MB.`);
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target.result;
        insert(`![${file.name}](${dataUrl})`, '');
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const btnClass = `px-2 py-1 rounded text-xs font-medium transition border whitespace-nowrap ${
    theme === 'dark'
      ? 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600'
      : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
  }`;

  return (
    <div className="flex flex-wrap items-center gap-1 mb-2">
      <button type="button" onClick={() => insert('**', '**')} className={btnClass} title="Grassetto">
        <b>B</b>
      </button>
      <button type="button" onClick={() => insert('*', '*')} className={btnClass} title="Corsivo">
        <i>I</i>
      </button>
      <button type="button" onClick={() => insert('~~', '~~')} className={btnClass} title="Barrato">
        <s>S</s>
      </button>
      <span className="w-px h-4 bg-gray-500/30 mx-0.5 hidden sm:inline" />
      <button type="button" onClick={() => insert('# ', '')} className={btnClass} title="Titolo H1">
        H1
      </button>
      <button type="button" onClick={() => insert('## ', '')} className={btnClass} title="Titolo H2">
        H2
      </button>
      <button type="button" onClick={() => insert('### ', '')} className={btnClass} title="Titolo H3">
        H3
      </button>
      <span className="w-px h-4 bg-gray-500/30 mx-0.5 hidden sm:inline" />
      <button type="button" onClick={() => insert('- ', '')} className={btnClass} title="Elenco puntato">
        • List
      </button>
      <button type="button" onClick={() => insert('1. ', '')} className={btnClass} title="Elenco numerato">
        1. List
      </button>
      <button type="button" onClick={() => insert('> ', '')} className={btnClass} title="Citazione">
        " Quote
      </button>
      <span className="w-px h-4 bg-gray-500/30 mx-0.5 hidden sm:inline" />
      <button type="button" onClick={() => insert('```\n', '\n```')} className={btnClass} title="Blocco codice">
        {'</>'}
      </button>
      <button type="button" onClick={() => insert('`', '`')} className={btnClass} title="Codice inline">
        `code`
      </button>
      <span className="w-px h-4 bg-gray-500/30 mx-0.5 hidden sm:inline" />
      <button type="button" onClick={() => insert('[', '](url)')} className={btnClass} title="Link">
        Link
      </button>
      <button type="button" onClick={insertImage} className={btnClass} title="Carica immagine (max 1.5MB)">
        🖼 Img
      </button>
      <span className="w-px h-4 bg-gray-500/30 mx-0.5 hidden sm:inline" />
      <button type="button" onClick={() => insert('<div align="center">\n', '\n</div>')} className={btnClass} title="Allinea al centro">
        ⬜ Centro
      </button>
      <button type="button" onClick={() => insert('<div align="right">\n', '\n</div>')} className={btnClass} title="Allinea a destra">
        ⬜ Destra
      </button>
    </div>
  );
}
