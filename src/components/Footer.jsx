export default function Footer({ theme }) {
  return (
    <footer
      className={`text-center text-xs py-3 border-t ${
        theme === 'dark'
          ? 'bg-gray-900 border-gray-800 text-gray-500'
          : 'bg-gray-50 border-gray-200 text-gray-400'
      }`}
    >
      <p>
        Materiale privato protetto da copyright. Accesso e modifica riservati
        esclusivamente ai soggetti autorizzati della classe 1FT (A.S. 2025/2026)
        indicati nel file AUTORIZZATI.md. La visualizzazione non autorizzata è
        vietata.
      </p>
      <p className="mt-1">Versione 0.2.5 — autore PiBOH</p>
    </footer>
  );
}