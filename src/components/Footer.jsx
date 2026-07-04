export default function Footer({ theme }) {
  return (
    <footer
      className={`px-4 py-2 text-[11px] text-center border-t leading-tight ${
        theme === 'dark'
          ? 'bg-gray-900 border-gray-800 text-gray-400'
          : 'bg-gray-100 border-gray-200 text-gray-500'
      }`}
    >
      <p className="opacity-80">
        Materiale privato — accesso riservato alla classe 1FT (A.S. 2025/2026)
      </p>
      <p className={`mt-0.5 ${theme === 'dark' ? 'text-yellow-500/70' : 'text-yellow-700/70'}`}>
        ⚠️ Non inserire dati personali negli appunti
      </p>
      <p className="mt-0.5 opacity-60">v0.6.3 · PiBOH</p>
    </footer>
  );
}
