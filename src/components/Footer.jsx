export default function Footer({ theme }) {
  return (
    <footer
      className={`px-6 py-4 text-xs text-center border-t ${
        theme === 'dark'
          ? 'bg-gray-900 border-gray-800 text-gray-400'
          : 'bg-gray-100 border-gray-200 text-gray-500'
      }`}
    >
      <p>
        Materiale privato protetto da copyright. Accesso e modifica riservati
        esclusivamente ai soggetti autorizzati della classe 1FT (A.S. 2025/2026)
        indicati nel file AUTORIZZATI.md. La visualizzazione non autorizzata è
        vietata.
      </p>
      <p className={`mt-1 text-[11px] ${theme === 'dark' ? 'text-yellow-500/70' : 'text-yellow-700/70'}`}>
        ⚠️ Non inserire dati personali, numeri di telefono o informazioni sensibili negli appunti.
      </p>
      <p className="mt-1 opacity-70">Versione 0.4.9 autore PiBOH</p>
    </footer>
  );
}
