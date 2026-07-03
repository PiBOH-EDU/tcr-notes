# arenaai.md — tcr-notes App

## Regole Fondamentali del Progetto

> **SE FUNZIONA NON SI TOCCA.**

- Ogni modifica al codice, alla struttura o alla logica deve essere documentata in questo file **prima** di essere applicata.
- Questo file è la storia del progetto: serve per poter ritornare sui passi senza problemi.
- Non rimuovere sezioni precedenti del changelog: aggiorna solo in coda.
- La versione corrente è indicata nel footer dell'app.

---

## Changelog

### [0.2.4.1-sync] — Sincronizzazione workspace con repository remoto
- **Data:** 2026-07-02
- **Modifiche:**
  - Sincronizzati tutti i file dal repository GitHub `PiBOH-EDU/tcr-notes` (branch main).
  - Aggiornati: `package.json`, `src/lib/supabase.js`, `src/main.jsx`, `src/components/Editor.jsx`, `src/components/Login.jsx`, `src/components/Dashboard.jsx`, `src/components/Footer.jsx`, `src/lib/storage.js`, `tailwind.config.js`, `README.md`, `CHANGELOG.md`, `arenaai.md`, `CODE OF CONDUCT.md`, `LICENSE`, `.gitignore`, `docs/SECURITY.md`, `docs/DISCLAIMER.md`.
  - Aggiunti nuovi file dal repo: `src/components/ErrorBoundary.jsx`.
  - Build di produzione eseguito con successo per verificare integrità post-sincronizzazione.

### [0.4.0-sync] — Sincronizzazione liste utenti dal repository remoto
- **Data:** 2026-07-03
- **Modifiche:**
  - Sincronizzato `src/data/authorized.js` dal repository GitHub `PiBOH-EDU/tcr-notes` (branch main).
  - Sincronizzato `src/data/banned.js` dal repository remoto.
  - Build di produzione eseguito per verificare integrità post-sincronizzazione.

### [0.4.4] — Fix markdown editing, undo/redo, autosave 1min, limite 1MB
- **Autore:** PiBOH
- **Data:** 2026-07-03

#### Aggiunte
- Sistema Undo/Redo con stack custom (max 100 stati): pulsanti ↩ Annulla / ↪ Ripeti nella status bar.
- Scorciatoie da tastiera: `Ctrl+Z` (annulla), `Ctrl+Y` / `Ctrl+Shift+Z` (ripeti).
- Listener keydown globale: premendo un tasto in modalità anteprima Markdown si entra automaticamente in edit e il carattere viene inserito.
- `Escape` per tornare all'anteprima Markdown dall'editor.

#### Modifiche
- Fix modalità Markdown: rimosso `onBlur` automatico che chiudeva inaspettatamente l'editor. Ora l'utente controlla esplicitamente quando uscire (toggle o Escape).
- Autosave aumentato da 1 secondo a **60 secondi** (1 minuto).
- Limite upload immagini ridotto da 1.5 MB a **1 MB**.
- Aggiornata versione ovunque a **0.4.4**.

### [0.4.3] — Menu Info, limite immagini 1.5MB, mobile UI overhaul
- **Autore:** PiBOH
- **Data:** 2026-07-03

#### Aggiunte
- Componente `InfoMenu.jsx` con dropdown che mostra versione, autore, classe e link a tutta la documentazione (SECURITY, DISCLAIMER, LIMITATIONS, CODE OF CONDUCT, CHANGELOG, GUIDA SUPABASE, LICENSE).
- Controllo dimensione immagini in `MarkdownToolbar.jsx`: massimo 1.5 MB, alert con dimensione effettiva del file se superato.

#### Modifiche
- `Dashboard.jsx`: header rivisto — più compatto su mobile, badge utente nascosto su < sm, pulsanti Esporta/Importa nascosti su < lg, InfoMenu aggiunto.
- `Editor.jsx`: status bar responsive (flex-col su mobile, flex-row su sm), toggle markdown ridimensionato, testi più piccoli su mobile.
- `MarkdownToolbar.jsx`: separatori verticali nascosti su mobile (`hidden sm:inline`), bottoni con `whitespace-nowrap`.
- Altezze editor/preview adattive: `min-h-[50vh]` su mobile vs `calc(100vh-340px)` su desktop.
- Aggiornata versione ovunque a **0.4.3**.

### [0.4.2] — Documentazione limitazioni servizi esterni
- **Autore:** PiBOH
- **Data:** 2026-07-03

#### Aggiunte
- Creato `docs/LIMITATIONS.md` con tabella completa dei vincoli di Supabase Free Tier (500MB, 2GB bandwidth, 200 connessioni, pausa dopo 7gg, ecc.), Vercel Hobby (cold start, no SLA, ecc.), browser (localStorage 5-10MB, immagini base64), sicurezza (no E2E, no audit log, RLS aperte).
- Aggiunte raccomandazioni pratiche per gli utenti (export regolare, non caricare immagini grandi, monitorare spazio).
- Link a `LIMITATIONS.md` inseriti in `README.md` (sezione Documentazione), `GUIDA-SUPABASE.md` (prima dei prerequisiti), `docs/DISCLAIMER.md` (sezione servizi terze parti), `docs/SECURITY.md` (sezione limitazioni).
- Aggiornata versione ovunque a **0.4.2**.

### [0.4.1] — Rinomina titoli e capitoli
- **Autore:** PiBOH
- **Data:** 2026-07-03

#### Aggiunte
- Funzioni `renameTitle(id, newName)` e `renameChapter(id, newName)` in `src/lib/storage.js` per aggiornare i nomi su Supabase.
- UI di rinomina inline nella sidebar: pulsante ✏️ accanto a ogni titolo e capitolo.
- Input editabile con salvataggio su Enter/✓ e annullamento su Escape/✕.
- Stati `editingTitleId`, `editingChapterId`, `editTitleValue`, `editChapterValue` in `Dashboard.jsx`.
- Aggiornata versione ovunque a **0.4.1**.

### [0.4.0] — Toolbar markdown, responsive mobile, upload immagini, issue templates
- **Autore:** PiBOH
- **Data:** 2026-07-03

#### Aggiunte
- Componente `MarkdownToolbar` con pulsanti per formattazione: grassetto, corsivo, barrato, H1/H2/H3, elenchi puntati/numerati, citazioni, blocchi codice inline e multilinea, link, upload immagini (base64 inline), allineamento centro/destra.
- Supporto HTML in markdown tramite dipendenza `rehype-raw` per allineamento testo e formattazioni avanzate.
- Upload immagini: input file nascosto che converte in data URL base64 e inserisce sintassi markdown `![nome](data:image/...)"`.
- Dashboard completamente responsive: sidebar diventa drawer overlay su mobile attivabile da hamburger menu; header compatto con icone; overlay chiude sidebar al tap fuori.
- Indicatori utenti online: contatore con pallino verde pulsante in header; lista dropdown al click.
- Issue template GitHub in `.github/ISSUE_TEMPLATE/`: `bug_report.yml`, `feature_request.yml`, `config.yml` in stile XTetris.
- Persistenza checkbox documenti in `localStorage` (`tcr-docs-accepted`): dopo la prima accettazione il checkbox rimane pre-flaggato.

#### Modifiche
- `Editor.jsx`: integrata toolbar, aggiunto `rehype-raw`, migliorata preview markdown con classi `prose`.
- `Dashboard.jsx`: layout responsive con classi Tailwind `md:` e stati `sidebarOpen`/`showOnlineList`.
- `Login.jsx`: checkbox usa `localStorage` per persistenza.
- `package.json`: aggiunta dipendenza `rehype-raw`, versione bump a **0.4.0**.

### [0.2.4.1] — Fix schermata bianca da .env + nome reale residuo
- **Autore:** PiBOH
- **Data:** 2026-07-02

#### Corretto
- Schermata bianca al posto del login dopo aver configurato `.env`: `src/lib/supabase.js` eseguiva `createClient()` in modo eager al caricamento del modulo (import statico da `Dashboard.jsx`/`Editor.jsx`, caricati comunque da `App.jsx` anche prima del login). Un `.env` mancante o malformato faceva crashare tutta l'app React, lasciando visibile solo lo sfondo statico di `index.html`. Aggiunta validazione esplicita con messaggio d'errore chiaro.
- Aggiunto `ErrorBoundary` attorno ad `<App />` per evitare pagine bianche su qualsiasi errore di rendering futuro.
- Placeholder in `Login.jsx` per nomi multipli usava per errore `"DenisAndreiFlorin"`, coincidente con un utente reale in `authorized.js`. Sostituito con nome fittizio.
- **Causa radice del problema riportato:** Vite legge il `.env` solo all'avvio del server — va riavviato (`npm run dev`) dopo ogni modifica al file; pulire cache/cronologia browser non ha effetto.
- Aggiornata versione ovunque a **0.2.4.1**.

### [0.2.4] — Checkbox docs, nomi fittizi, SECURITY & DISCLAIMER
- **Autore:** PiBOH
- **Data:** 2026-07-02

#### Aggiunte
- Campo checkbox obbligatorio in login per confermare lettura di `SECURITY.md` e `DISCLAIMER.md`.
- File `docs/SECURITY.md` con policy di sicurezza e segnalazione vulnerabilità.
- File `docs/DISCLAIMER.md` con avvertenza legale completa ed esclusione di responsabilità.
- File `CHANGELOG.md` strutturato secondo le norme di Keep a Changelog.

#### Modifiche
- Login: campo Nome/i sopra, Cognome sotto, con spiegazione per nomi multipli.
- Messaggio errore autorizzati: aggiunto "Controlla di aver inserito correttamente i dati utente."
- Sostituiti nomi reali con nomi fittizi standard in tutti gli esempi (rossi.mario, bianchi.lucia, verdi.antonio, ecc.).
- Aggiornata versione ovunque a **0.2.4**.

### [0.0.2.3] — README + GUIDA-SUPABASE.md + nomi predefiniti + fix crash
- **Autore:** PiBOH
- **Data:** 2026-07-02

#### Aggiunte
- Creato `README.md` con panoramica progetto, requisiti, avvio e deploy.
- Creato `GUIDA-SUPABASE.md` dettagliato con guida passo-passo alla configurazione del server Supabase.
- Aggiunti nomi predefiniti in `authorized.js`.
- Aggiornati commenti in `authorized.js` e `banned.js`.
- Aggiornata versione ovunque a **0.0.2.3**.

### v0.0.2.2 — Ripristino Supabase + struttura gerarchica realtime
- **Autore:** PiBOH
- **Data:** 2026-07-02

#### Aggiunte
- Ripristinata integrazione Supabase Realtime per sincronizzazione in tempo reale.
- Struttura database gerarchica: `titles` → `chapters` → `history`.
- Tabella `titles`: contiene gli argomenti principali (es. "test1").
- Tabella `chapters`: contiene i sotto-capitoli con `content`, `last_edited_by`, `updated_at`.
- Tabella `history`: cronologia automatica delle modifiche (max 50 versioni per capitolo).
- Realtime su `titles` e `chapters`: quando un utente crea/modifica/elimina, tutti gli altri vedono l'aggiornamento istantaneamente.
- Realtime broadcast "typing": mostra "✍️ [utente] sta scrivendo..." quando un compagno modifica il testo.
- Sincronizzazione contenuto in tempo reale: se un altro utente salva, il contenuto si aggiorna automaticamente nell'editor.
- Export/Import JSON per backup e ripristino completo del database.
- Fix controllo autorizzazioni: se `AUTHORIZED` è vuoto → password sufficiente; se ha elementi → solo whitelist può entrare; bannati bloccati sempre.
- Aggiornata versione ovunque a **0.0.2.2**.
