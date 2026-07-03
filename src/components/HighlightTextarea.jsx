import { forwardRef } from 'react';

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function highlight(text) {
  let html = escapeHtml(text);
  // Commenti HTML (multilinea)
  html = html.replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="opacity-30 italic">$1</span>');
  // Grassetto
  html = html.replace(/\*\*(.+?)\*\*/g, '<span class="font-bold">$1</span>');
  // Barrato
  html = html.replace(/~~(.+?)~~/g, '<span class="line-through opacity-60">$1</span>');
  return html;
}

const HighlightTextarea = forwardRef(function HighlightTextarea(
  { value, onChange, placeholder, spellCheck, theme },
  ref
) {
  const handleScroll = (e) => {
    const pre = e.target.previousElementSibling;
    if (pre) {
      pre.scrollTop = e.target.scrollTop;
      pre.scrollLeft = e.target.scrollLeft;
    }
  };

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
      {/* Layer input (sopra, trasparente) */}
      <textarea
        ref={ref}
        value={value}
        onChange={onChange}
        onScroll={handleScroll}
        className={`absolute inset-0 w-full h-full bg-transparent text-transparent caret-blue-500 p-3 md:p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm md:text-base leading-relaxed placeholder:text-gray-400 dark:placeholder:text-gray-500`}
        placeholder={placeholder}
        spellCheck={spellCheck}
      />
    </div>
  );
});

export default HighlightTextarea;
