export default function Footer({ theme }) {
  return (
    <footer
      className={`px-3 md:px-4 py-1.5 text-[10px] md:text-[11px] border-t leading-tight ${
        theme === 'dark'
          ? 'bg-gray-900 border-gray-800 text-gray-400'
          : 'bg-gray-100 border-gray-200 text-gray-500'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5 max-w-7xl mx-auto">
        <span className="opacity-80 truncate">
          Materiale privato — accesso riservato alla classe 1FT (A.S. 2025/2026)
        </span>
        <span className="opacity-60 shrink-0">
          v0.10.3 · PiBOH
        </span>
        <span className={`shrink-0 ${theme === 'dark' ? 'text-yellow-500/70' : 'text-yellow-700/70'}`}>
          ⚠️ Non inserire dati personali negli appunti
        </span>
      </div>
    </footer>
  );
}
