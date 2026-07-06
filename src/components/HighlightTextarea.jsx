import { forwardRef } from 'react';

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function highlight(text) {
  let html = escapeHtml(text);
  // Commenti HTML (multilinea) — grigio scuro, corsivo, senza opacity
  html = html.replace(
    /(&lt;!--)([\s\S]*?)(--&gt;)/g,
    '<span class="text-gray-500">$1</span><span class="text-gray-400 italic">$2</span><span class="text-gray-500">$3</span>'
  );
  // Grassetto — delimitatori grigio scuro, contenuto in grassetto
  html = html.replace(
    /(\*\*)(.+?)(\*\*)/g,
    '<span class="text-gray-500">$1</span><span class="font-bold">$2</span><span class="text-gray-500">$3</span>'
  );
  // Barrato — delimitatori grigio scuro, contenuto barrato (stesso colore testo)
  html = html.replace(
    /(~~)(.+?)(~~)/g,
    '<span class="text-gray-500">$1</span><span class="line-through">$2</span><span class="text-gray-500">$3</span>'
  );
  // Codice inline — delimitatori grigio scuro, contenuto con sfondo solido
  html = html.replace(
    /(`)([^`]+)(`)/g,
    '<span class="text-gray-500">$1</span><span class="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded px-1 py-0.5 font-mono text-sm">$2</span><span class="text-gray-500">$3</span>'
  );
  return html;
}

const HighlightTextarea = forwardRef(function HighlightTextarea(
  { value, onChange, placeholder, spellCheck, theme, readOnly, remoteCursor },
  ref
) {
  const handleScroll = (e) => {
    const pre = e.target.previousElementSibling;
    if (pre) {
      pre.scrollTop = e.target.scrollTop;
      pre.scrollLeft = e.target.scrollLeft;
    }
    // Sincronizza anche il cursore remoto
    const cursorOverlay = e.target.parentElement.querySelector('.remote-cursor-overlay');
    if (cursorOverlay) {
      cursorOverlay.scrollTop = e.target.scrollTop;
      cursorOverlay.scrollLeft = e.target.scrollLeft;
    }
  };

  // Calcola riga e colonna del cursore remoto
  const getRemoteCursorPos = () => {
    if (!remoteCursor || remoteCursor.position == null) return { row: 0, col: 0 };
    const pos = remoteCursor.position;
    const textBefore = value.slice(0, pos);
    const row = (textBefore.match(/\n/g) || []).length;
    const lastNewline = textBefore.lastIndexOf('\n');
    const col = lastNewline === -1 ? pos : pos - lastNewline - 1;
    return { row, col };
  };

  const { row: remoteRow, col: remoteCol } = getRemoteCursorPos();
  const lineHeightEm = 1.625; // leading-relaxed
  const charWidthEm = 0.6; // approssimativo per font-mono

  return (
    <div
      className={`relative w-full min-h-[50vh] md:h-[calc(100vh-340px)] rounded-xl border ${
        theme === 'dark'
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-300'
      }`}
    >
      {/* Layer evidenziato (sotto) */}
      <pre
        className={`absolute inset-0 overflow-auto m-0 p-3 md:p-4 font-mono text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words select-none ${
          theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
        }`}
        dangerouslySetInnerHTML={{ __html: highlight(value) + '<br>' }}
      />

      {/* Overlay cursore remoto (sincronizzato con scroll) */}
      {remoteCursor && (
        <div
          className="remote-cursor-overlay absolute inset-0 overflow-hidden m-0 pointer-events-none select-none"
          style={{ padding: 'inherit' }}
        >
          {/* Linea verticale alla posizione esatta del cursore */}
          <div
            className="absolute flex items-start"
            style={{
              top: `${remoteRow * lineHeightEm}em`,
              left: `${remoteCol * charWidthEm}em`,
              height: `${lineHeightEm}em`,
            }}
          >
            <div className="w-0.5 h-full bg-blue-500 animate-pulse" />
            <div className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-600 text-white whitespace-nowrap">
              ✍️ {remoteCursor.name}
            </div>
          </div>
        </div>
      )}

      {/* Layer input (sopra, trasparente) */}
      <textarea
        ref={ref}
        value={value}
        onChange={onChange}
        onScroll={handleScroll}
        className={`absolute inset-0 w-full h-full bg-transparent text-transparent caret-blue-500 p-3 md:p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm md:text-base leading-relaxed placeholder:text-gray-400 dark:placeholder:text-gray-500 ${readOnly ? 'cursor-default' : ''}`}
        placeholder={placeholder}
        spellCheck={spellCheck}
        readOnly={readOnly}
      />
    </div>
  );
});

export default HighlightTextarea;
