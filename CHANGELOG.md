# Changelog

Tutte le modifiche significative a questo progetto saranno documentate in questo file.

Il formato è basato su [Keep a Changelog](https://keepachangelog.com/it/1.1.0/),
e questo progetto aderisce a [Semantic Versioning](https://semver.org/lang/it/).

## [Unreleased]

## [0.4.6] - 2026-07-03

### Aggiunto
- Menu Info: voce "🐛 Segnala un bug / Richiedi una funzionalità" che rimanda alla pagina issue template di GitHub.
- Toolbar markdown: placeholder descrittivi al posto di stringhe vuote ("grassetto", "corsivo", "barrato", "Titolo principale", "Sottotitolo", "Sezione", "Elemento elenco", "Primo elemento", "Citazione famosa", "codice qui", "codice", "testo del link", "Testo centrato", "Testo a destra").

### Modificato
- Etichette toggle editor: "Testo piano" e "Rendering Markdown" al posto di "Testo" e "Markdown".

## [0.4.5] - 2026-07-03

### Sicurezza
- Fix 4 vulnerabilità Dependabot:
  - `vite`: `server.fs.deny` bypass on Windows alternate paths (HIGH)
  - `vite`: Path Traversal in Optimized Deps `.map` Handling (MODERATE)
  - `launch-editor`: NTLMv2 hash disclosure via UNC path handling on Windows (MODERATE)
  - `esbuild`: enables any website to send any requests to the development server and read the response (MODERATE)
- Aggiornato `vite` da 5.4.21 a 6.4.3 (versione patchata).

### Nota
- Tutte le vulnerabilità riguardavano il **server di sviluppo locale**, non la build di produzione su Vercel. Nessun impatto sugli utenti finali.

## [0.4.4] - 2026-07-03

### Aggiunto
- Pulsanti Annulla (↩) e Ripeti (↪) nella status bar dell'editor con scorciatoie da tastiera:
  - `Ctrl+Z` = Annulla
  - `Ctrl+Y` oppure `Ctrl+Shift+Z` = Ripeti
- Stack undo/redo con storico fino a 100 stati, resettato al cambio capitolo.

### Modificato
- **Fix modalità Markdown**: ora premendo un tasto qualsiasi mentre si visualizza l'anteprima si entra automaticamente in modalità editing e il carattere viene inserito. `Escape` torna all'anteprima.
- Rimosso blur automatico che chiudeva l'editor inaspettatamente.
- Autosave aumentato da 1 secondo a **1 minuto** (60 secondi).
- Limite dimensione immagini ridotto da 1.5 MB a **1 MB**.

## [0.4.3] - 2026-07-03

### Aggiunto
- Menu Info (ℹ️) nell'header con dropdown che mostra versione, autore e link a tutta la documentazione (SECURITY, DISCLAIMER, LIMITATIONS, CODE OF CONDUCT, CHANGELOG, GUIDA SUPABASE, LICENSE).
- Limite dimensione immagini: massimo 1.5 MB per file, con alert esplicativo se superato.

### Modificato
- UI mobile completamente rivista: header più compatto, bottoni ridimensionati, spaziature ottimizzate.
- Status bar dell'editor più compatta su mobile con testi ridotti.
- Toggle Markdown più piccolo su schermi stretti.
- Toolbar markdown: separatori nascosti su mobile per risparmiare spazio.
- Breadcrumb e tab Modifica/Cronologia impilati verticalmente su mobile.
- Preview markdown con altezza minima adattiva (`min-h-[50vh]` su mobile, `calc(100vh-340px)` su desktop).
- Esporta/Importa nascosti su schermi < 1024px (lg) per alleggerire l'header.

## [0.4.2] - 2026-07-03

### Aggiunto
- File `docs/LIMITATIONS.md` con elenco dettagliato di tutte le limitazioni derivanti dall'uso di servizi esterni pubblici (Supabase, Vercel, browser).
- Link a `LIMITATIONS.md` in `README.md`, `GUIDA-SUPABASE.md`, `docs/DISCLAIMER.md` e `docs/SECURITY.md`.

## [0.4.1] - 2026-07-03

### Aggiunto
- Possibilità di rinominare titoli e capitoli direttamente dalla sidebar (pulsante ✏️ accanto al cestino).
- Input inline con salva (Enter o ✓) e annulla (Escape o ✕) per la rinomina.

## [0.4.0] - 2026-07-03

### Aggiunto
- Toolbar markdown nell'editor con pulsanti per grassetto, corsivo, barrato, titoli (H1/H2/H3), elenchi, citazioni, blocchi codice, link, immagini, allineamento centro/destra.
- Supporto upload immagini inline (conversione base64) direttamente nell'editor.
- Supporto HTML in markdown tramite `rehype-raw` per allineamento testo e altre formattazioni avanzate.
- Interfaccia completamente responsive: sidebar diventa drawer con hamburger menu su mobile.
- Indicatori utenti online con contatore e lista dropdown.
- Issue template personalizzati (bug report, feature request, config) in `.github/ISSUE_TEMPLATE/`.
- Persistenza checkbox documenti in `localStorage`: dopo la prima accettazione non è più necessario flaggare ad ogni login.

### Modificato
- Migliorata visualizzazione markdown con classe `prose` di Tailwind Typography.
- Header ottimizzato per mobile con icone compatte e pulsanti raggruppati.
- Ottimizzato layout della sidebar e dell'area principale per schermi piccoli.

## [0.3.1] - 2026-07-02

### Aggiunto
- Supporto per formattazione markdown con `react-markdown` e `remark-gfm`.
- Toggle visualizzazione Markdown / Testo piano nell'editor.
- Plugin Tailwind Typography per rendering markdown stilizzato.

## [0.3.1] - 2026-07-02

### Aggiunto
- Supporto per la visualizzazione degli utenti online tramite Supabase Presence.

## [0.2.4.1] - 2026-07-02

### Corretto
- **Schermata bianca dopo la configurazione del `.env`**: `src/lib/supabase.js` chiamava `createClient()` in modo eager al caricamento del modulo. Poiché `Dashboard.jsx` ed `Editor.jsx` (che importano il client Supabase) sono importati staticamente da `App.jsx`, il modulo veniva eseguito anche prima del login, e un `.env` mancante/malformato faceva crashare l'intera app React lasciando visibile solo lo sfondo statico di `index.html`. Aggiunta validazione esplicita delle variabili d'ambiente con messaggio d'errore chiaro invece del crash silenzioso.
- Aggiunto `ErrorBoundary` (`src/components/ErrorBoundary.jsx`) attorno ad `<App />` in `main.jsx`: qualsiasi errore di rendering ora mostra un messaggio diagnostico invece di una pagina bianca.
- **Nome reale residuo negli esempi**: il placeholder in `Login.jsx` per l'inserimento di nomi multipli usava `"DenisAndreiFlorin"`, coincidente con un utente reale presente in `authorized.js`. Sostituito con un nome interamente fittizio (`"PaoloGiuseppe"`).

### Nota
- Ricorda: Vite legge il file `.env` solo all'avvio del server (`npm run dev`). Se lo modifichi mentre il server è già attivo, riavvialo — pulire cache/cronologia del browser non ha alcun effetto su questo tipo di problema.

## [0.2.4] - 2026-07-02

### Aggiunto
- Campo checkbox obbligatorio nella schermata di login per confermare la lettura dei file `SECURITY.md` e `DISCLAIMER.md`.
- File `docs/SECURITY.md` con policy di sicurezza, istruzioni per la segnalazione vulnerabilità e buone pratiche.
- File `docs/DISCLAIMER.md` con avvertenza legale completa, esclusione di responsabilità e note sui servizi di terze parti.
- File `CHANGELOG.md` strutturato secondo le norme di Keep a Changelog.

### Modificato
- Schermata di login: invertito ordine campi — **Nome/i** sopra e **Cognome** sotto, con istruzioni chiare per l'inserimento di nomi multipli.
- Messaggio di errore per utenti non autorizzati: aggiunto il suggerimento di controllare l'inserimento corretto dei dati utente.
- Nomi negli esempi di `authorized.js`, `banned.js`, `README.md` e `GUIDA-SUPABASE.md`: sostituiti nomi reali con nomi fittizi standard (es. rossi.mario, bianchi.lucia, neri.giovanni).

## [0.0.2.3] - 2026-07-02

### Aggiunto
- README.md con panoramica progetto, requisiti, avvio e deploy.
- GUIDA-SUPABASE.md dettagliato con guida passo-passo alla configurazione del server Supabase.
- Nomi predefiniti nella lista autorizzati.

### Modificato
- Commenti in `authorized.js` e `banned.js` resi più chiari per prevenire errori di sintassi.

## [0.0.2.2] - 2026-07-02

### Aggiunto
- Ripristino integrazione Supabase Realtime per sincronizzazione in tempo reale.
- Struttura database gerarchica: `titles` → `chapters` → `history`.
- Cronologia automatica delle modifiche (massimo 50 versioni per capitolo).
- Export/Import JSON per backup e ripristino completo del database.
- Realtime broadcast "typing" per mostrare chi sta scrivendo.

### Modificato
- Controllo autorizzazioni: modalità whitelist quando `AUTHORIZED` contiene elementi; modalità aperta quando è vuoto.

## [0.0.2.1] - 2026-07-02

### Aggiunto
- Sistema di storage completamente locale via `localStorage`.
- Gestione titoli e capitoli con struttura gerarchica.
- Cronologia versioni locale.
- Export/Import JSON locale.

### Rimosso
- Dipendenze e riferimenti a Supabase (sostituiti in v0.0.2.2).

## [0.0.1_ALPHA] - 2026-07-02

### Aggiunto
- Creazione progetto React + Vite + Tailwind CSS.
- Implementazione Dark/Light Mode con persistenza localStorage (default: dark).
- Schermata di login doppia: Nome/i e Cognome + Password di classe ("Barsanti1FT").
- Controllo accessi su liste `AUTORIZZATI.md` e `BANNATI.md`.
- Dashboard con lista note e editor collaborativo.
- Tracciamento "chi sta scrivendo" tramite Supabase Broadcast.
- Tracciamento "ultima modifica di" tramite colonna `last_edited_by`.
- Footer con nota di copyright e versione.
- File `.env.example` e query SQL per setup Supabase.
