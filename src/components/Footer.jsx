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
      <p className="mt-1 opacity-70">Versione 0.0.2.1 autore PiBOH</p>
    </footer>
  );
}
