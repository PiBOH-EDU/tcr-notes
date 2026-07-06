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

### [0.6.0] — Highlight con simboli visibili, cursore preciso in Markdown, versionamento schematico
- **Autore:** PiBOH
- **Data:** 2026-07-03

#### Aggiunte
- `HighlightTextarea.jsx`: evidenziazione "GitHub-style" dove i delimitatori markdown (`**`, `~~`, `<!-- -->`) restano visibili ma attenuati (`opacity-60`), mentre il contenuto è formattato (grassetto, barrato, corsivo penombra).
- `Editor.jsx`: cliccando nella preview Markdown, il cursore viene posizionato nel punto testuale corrispondente della textarea (stima via `caretPositionFromPoint` / `caretRangeFromPoint` + TreeWalker sui text nodes). Ignora il click se su un link.

#### Modifiche
- Bump versione schematica a **0.6.0** (`package.json`, `Footer.jsx`, `InfoMenu.jsx`, `CHANGELOG.md`, `arenaai.md`).

### [0.5.0] — Highlight inline, no-save unchanged, badge Supabase, rimosso ❌ Align
- **Autore:** PiBOH
- **Data:** 2026-07-03

#### Aggiunte
- Componente `HighlightTextarea.jsx` con doppio layer: textarea trasparente (`caret-blue-500`) sopra e `<pre>` formattato sotto. Evidenzia in tempo reale:
  - `**testo**` → grassetto
  - `~~testo~~` → barrato (opacity 60)
  - `<!-- commento -->` → penombra (opacity 30, italic)
  - Non applicato a link, headings, liste, codice, immagini.
- **Badge promemoria Supabase**: banner rosso animato (`animate-pulse`) che appare se il progetto Supabase è in pausa o irraggiungibile. Check al mount e ogni 5 minuti via `setInterval`.

#### Modifiche
- `Editor.jsx`: `updateContent` e `triggerSave` ora controllano se `newContent === lastSavedContent.current` e skipano salvataggio/stato dirty se invariato.
- `MarkdownToolbar.jsx`: rimosso pulsante "❌ Align".
- `Dashboard.jsx`: aggiunto stato `supabaseStatus` e banner condizionale.
- Aggiornata versione ovunque a **0.5.0**.

### [0.4.9] — Avviso dati personali
- **Autore:** PiBOH
- **Data:** 2026-07-03

#### Aggiunte
- Banner avviso nella schermata di login: "⚠️ Attenzione: non inserire dati personali, numeri di telefono, indirizzi o informazioni sensibili negli appunti. Il contenuto è condiviso con tutta la classe."
- Nota nel footer con lo stesso avviso.
- Sezione in `docs/LIMITATIONS.md` sulla riservatezza dei contenuti.

#### Modifiche
- Aggiornata versione ovunque a **0.4.9**.

### [0.4.8] — Salvataggio manuale, menu info aggiornato
- **Autore:** PiBOH
- **Data:** 2026-07-03

#### Aggiunte
- Pulsante **💾 Salva** nella status bar dell'editor per salvataggio manuale immediato.
- Scorciatoia da tastiera `Ctrl+S` / `Cmd+S` per salvare manualmente.

#### Modifiche
- Menu Info: rimosso link a "GUIDA SUPABASE", aggiunto "(GitHub)" alla voce di feedback.
- Versione **0.4.8**.

### [0.4.7-sync2] — README snellito, rimosse ripetizioni
- **Data:** 2026-07-03
- **Modifiche:**
  - Riscritto `README.md` rimuovendo la sezione "Configurazione Supabase (passo-passo)" (già in `GUIDA-SUPABASE.md`), la sezione "Struttura del database" e il troubleshooting dettagliato (già nella guida).
  - Aggiunta tabella riassuntiva della documentazione.
  - Sezione "Gestione utenti" ridotta ai soli riferimenti ai file e al formato.
  - Versione nel README aggiornata a 0.4.7.

### [0.4.7-sync] — Sincronizzazione liste utenti dal repository remoto
- **Data:** 2026-07-03
- **Modifiche:**
  - Sincronizzato `src/data/authorized.js` dal repository GitHub `PiBOH-EDU/tcr-notes` (branch main).
  - Sincronizzato `src/data/banned.js` dal repository remoto.
  - Build di produzione eseguito per verificare integrità post-sincronizzazione.

### [0.4.7] — Fix stati salvataggio, click preview → testo piano, link markdown, limite 500KB
- **Autore:** PiBOH
- **Data:** 2026-07-03

#### Aggiunte
- Stato `saveState` in `Editor.jsx` con 3 stati: `saved` (✅), `dirty` (📝), `saving` (⏳). Ora quando l'utente scrive compare immediatamente "📝 Modificato", poi "⏳ Salvataggio..." durante il save, e infine "✅ Salvato".
- Componente `MarkdownLink` che intercetta i link in rendering e aggiunge `https://` se manca il protocollo, fixando il problema dei redirect relativi al dominio dell'app.
- Pulsante "⬅️ Sinistra" nella toolbar per allineamento a sinistra.
- Pulsante "❌ Align" che rimuove i tag `<div align="...">` dal testo selezionato.

#### Modifiche
- `handleMarkdownClick`: cliccando sulla preview Markdown si passa direttamente a **Testo piano** (`setIsMarkdownView(false)`), non più solo edit mode dentro la preview.
- Limite upload immagini ridotto a **500 KB**.
- Aggiornata versione ovunque a **0.4.7**.

### [0.4.6] — Etichette toggle, placeholder toolbar, link feedback
- **Autore:** PiBOH
- **Data:** 2026-07-03

#### Aggiunte
- Menu Info: sezione "Feedback" con link agli issue template.
- Toolbar markdown: placeholder descrittivi.

#### Modifiche
- Toggle editor: "Testo piano" / "Rendering Markdown".
- Versione **0.4.6**.

### [0.4.5] — Fix vulnerabilità Dependabot (vite, esbuild, launch-editor)
- **Autore:** PiBOH
- **Data:** 2026-07-03

#### Sicurezza
- Fix 4 alert Dependabot:
  - `vite` HIGH: `server.fs.deny` bypass on Windows alternate paths
  - `vite` MODERATE: Path Traversal in Optimized Deps `.map` Handling
  - `launch-editor` MODERATE: NTLMv2 hash disclosure via UNC path handling
  - `esbuild` MODERATE: enables any website to send any requests to the development server
- Aggiornato `vite` da 5.4.21 a 6.4.3 (versione patchata). `npm audit` riporta ora **0 vulnerabilità**.
- Nota: tutte le vulnerabilità riguardavano il **server di sviluppo locale**, non la build di produzione su Vercel.
- Aggiornata versione ovunque a **0.4.5**.

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

### [0.6.1-sync] — Sincronizzazione completa con repository remoto + imgBB integration
- **Data:** 2026-07-04
- **Modifiche:**
  - Sincronizzati tutti i file dal repository GitHub `PiBOH-EDU/tcr-notes` (branch main), inclusi root e sottocartelle.
  - Integrato **imgBB** come servizio di hosting immagini al posto dell'upload base64 inline su Supabase.
  - Creato `src/lib/imgbb.js` con funzione `uploadImageToImgBB(base64Image, apiKey)`.
  - Modificato `MarkdownToolbar.jsx`: upload immagini ora invia a imgBB e inserisce URL pubblico in markdown `![nome](url)`.
  - Aggiornato `.env.example` con `VITE_IMGBB_API_KEY`.
  - Creato `docs/GUIDA-IMGBB.md` con guida passo-passo per principianti.
  - Spostato `GUIDA-SUPABASE.md` in `docs/GUIDA-SUPABASE.md`.
  - Build di produzione eseguito per verificare integrità post-modifica.

### [0.10.1] — Fix package ID APK Android
- **Autore:** PiBOH
- **Data:** 2026-07-05

#### Modifiche
- `.github/workflows/build-apk.yml`: package ID cambiato da `com.piboh.tcrnotes` a `com.tcrnotes.app`.
- `docs/GUIDA-APK.md`: aggiornati tutti i riferimenti al package ID.
- Bump versione schematica a **0.10.1** (`package.json`, `Footer.jsx`, `InfoMenu.jsx`, `CHANGELOG.md`, `arenaai.md`).
- Build di produzione eseguito per verificare integrità.

### [0.10.0] — Login desktop, PR template, ordinamento capitoli, TWA Android, fix realtime, fix admin, fix Supabase status
- **Autore:** PiBOH
- **Data:** 2026-07-05

#### Aggiunto
- **Login responsive desktop**: interfaccia login separata per desktop (`md:` breakpoint) — card più larga, spaziature maggiori, layout più imponente. Mobile rimane invariato.
- **`.github/PULL_REQUEST_TEMPLATE/pull_request_template.md`**: template custom per le pull request.
- **Ordinamento capitoli** (issue #2): dropdown con 3 opzioni — Alfabetico, Più vecchi prima, Più recenti prima. Default: **Più recenti prima**.
- **APK Android** (issue #1): workflow GitHub Actions `build-apk.yml` con Capacitor per generare APK. Guida dedicata `docs/GUIDA-APK.md`.
- **Favicon PNG**: `public/favicon.png` generata da `favicon.svg`.
- **Admin — stato workflow GitHub**: sezione nell'admin dashboard che mostra lo stato degli ultimi workflow run via API GitHub.
- **Admin — bannati visibili**: colonna `bannato` nella tabella utenti autorizzati dell'admin.

#### Modificato
- **Admin — accesso diretto e login semplificato**: l'admin accede a `/admin` direttamente con solo password `VITE_ADMIN_PASSWORD`, senza passare dal login studente e senza inserire nome/cognome.
- **Admin — persistenza auth**: fix del bug per cui ricaricando `/admin` richiedeva il login. Ora l'admin rimane autenticato tramite `localStorage` (`tcr-admin-auth`).
- **Supabase status check**: fix del controllo stato — ora usa `Promise.race` con `fetch` diretto e `AbortController` (timeout 3s) per rilevare correttamente la connessione assente.
- **Realtime posizione utenti**: fix del bug che mostrava sempre "Homepage" — ora il broadcast `typing` include anche `titleName` e `chapterName`, così il ricevente mostra la posizione corretta senza dipendere dalla lista capitoli caricata.
- **Cursore remoto**: fix del bug per cui il cursore remoto non appariva visivamente nel testo — ora mostra una linea verticale colorata posizionata alla riga approssimativa del cursore.
- Sincronizzati `README.md` (ASCII art aggiornata) e `public/state.json` dal repository remoto.
- Bump versione schematica a **0.10.0** (`package.json`, `Footer.jsx`, `InfoMenu.jsx`, `CHANGELOG.md`, `arenaai.md`).
- Build di produzione eseguito per verificare integrità.

### [0.9.1] — Checkbox unica login per documenti legali + Privacy Policy
- **Autore:** PiBOH
- **Data:** 2026-07-05

#### Modifiche
- `Login.jsx`: unite le due checkbox (documenti legali + Privacy) in **una sola checkbox obbligatoria**.
  - Nuova chiave `localStorage`: `tcr-all-legal-accepted` (obbliga tutti a rifare il consenso, più sicuro per GDPR).
  - Testo unico che elenca `SECURITY.md`, `DISCLAIMER.md`, `CODE OF CONDUCT.md` e `PRIVACY.md`.
  - Rimosso stato `acceptedPrivacy` separato e relativa chiave `tcr-privacy-accepted`.
  - Messaggio di errore aggiornato.
- Bump versione schematica a **0.9.1** (`package.json`, `Footer.jsx`, `InfoMenu.jsx`, `CHANGELOG.md`, `arenaai.md`).
- Build di produzione eseguito per verificare integrità.

### [0.9.0] — Privacy Policy, guida utenti Supabase, check GDPR esteso
- **Autore:** PiBOH
- **Data:** 2026-07-05

#### Privacy / GDPR
- Creato `docs/PRIVACY.md`: informativa privacy completa conforme al GDPR per l'uso didattico dell'app.
  - Titolare del trattamento, dati raccolti, finalità, base giuridica, periodo di conservazione.
  - Diritti degli interessati (accesso, rettifica, cancellazione, opposizione, portabilità).
  - Elenco subfornitori (Supabase, Vercel, imgBB, GitHub) e trasferimenti dati.
  - Cookie, localStorage e misure di sicurezza.
- `Login.jsx`: aggiunta **seconda checkbox obbligatoria** per la Privacy Policy.
  - Nuovo stato `acceptedPrivacy` con persistenza `localStorage` (`tcr-privacy-accepted`).
  - Link a `PRIVACY.md` su GitHub accanto agli altri documenti legali.
  - Messaggio di errore aggiornato per includere il mancato consenso privacy.
- `InfoMenu.jsx`: aggiunto link a `PRIVACY.md` nella sezione Documentazione.

#### Documentazione
- Creato `docs/GUIDA-SUPABASE-USER.md`: guida passo-passo per l'amministratore su come aggiungere utenti autorizzati alla tabella `utenti_autorizzati` di Supabase.
  - Accesso alla dashboard Supabase.
  - Inserimento via Table Editor (modo facile) e via SQL Editor (modo avanzato/batch).
  - Formato identificativo `cognome.nome`, ruoli `editor`/`viewer`, campo `bannato`.
  - Esempi con nomi fittizi.
  - Verifica inserimento e troubleshooting.

#### Modifiche
- Bump versione schematica a **0.9.0** (`package.json`, `Footer.jsx`, `InfoMenu.jsx`, `CHANGELOG.md`, `arenaai.md`).
- Build di produzione eseguito per verificare integrità.

### [0.8.0] — Migrazione utenti autorizzati/bannati da file locali a Supabase (GDPR)
- **Autore:** PiBOH
- **Data:** 2026-07-04

#### Sicurezza / Privacy
- Rimossi `src/data/authorized.js` e `src/data/banned.js` dal repository — nessun dato personale visibile su GitHub.
- Creata tabella `utenti_autorizzati` su Supabase con campi: `identificativo`, `nome_reale`, `bannato`, `ruolo`.
- Implementate funzioni RPC `check_user_access()` e `list_users_for_admin()` con `SECURITY DEFINER`:
  - `check_user_access` restituisce solo `trovato/bannato/ruolo` per un singolo identificativo (nessuna esposizione di altri utenti).
  - `list_users_for_admin` restituisce `identificativo/ruolo/bannato` (senza `nome_reale` per GDPR).
- RLS abilitata sulla tabella: nessun accesso diretto `SELECT` per l'anon key, solo via RPC.

#### Refactoring
- `src/lib/auth.js` (nuovo): `checkUserAccess(identificativo)` e `listAuthorizedUsers()`.
- `src/components/Login.jsx`: login ora chiama `checkUserAccess()` via Supabase RPC invece di leggere array locali.
- `src/components/Dashboard.jsx`: carica lista autorizzati da Supabase all'avvio, rimosso import `AUTHORIZED`.
- `src/components/Admin.jsx`: carica lista autorizzati da Supabase, rimosso import `AUTHORIZED`.
- `supabase-users.sql` (nuovo): script SQL completo per setup tabella + funzioni RPC.
- Aggiornata versione a **0.8.0**.
- Build di produzione eseguito per verificare integrità.

### [0.7.1] — Fix routing admin: da /#/admin a /admin
- **Autore:** PiBOH
- **Data:** 2026-07-04

#### Modifiche
- Creato `vercel.json`: rewrite SPA — tutte le route vengono servite da `index.html`, quindi `/admin` funziona correttamente su Vercel.
- `App.jsx`: routing cambiato da `window.location.hash` a `window.location.pathname`.
- `Admin.jsx`: pulsante "Torna all'app" usa `window.location.pathname = '/'` invece del hash.
- Aggiornata versione a **0.7.1**.
- Build di produzione eseguito per verificare integrità.

### [0.7.0] — Pagina Admin segreta (/admin)
- **Autore:** PiBOH
- **Data:** 2026-07-04

#### Aggiunte
- `src/components/Admin.jsx`: dashboard admin segreta accessibile via `/#/admin`.
  - Protezione con password `VITE_ADMIN_PASSWORD` (da `.env`).
  - Sezione **Stato Supabase**: card con stato online/offline e ultimo check.
  - Sezione **Utenti Online**: tabella con nome, posizione (Homepage / Titolo / Capitolo), ruolo, ultima attività.
  - Sezione **Utenti Autorizzati**: tabella con nome e ruolo (editor/viewer).
  - Sezione **Log Modifiche Recenti**: ultime 20 revisioni dalla tabella `history` con utente, capitolo e data.
  - Layout responsive a griglia con card colorate per tipo.
- `src/lib/storage.js`: funzione `getRecentHistory(limit = 20)` per recuperare le ultime modifiche globali.
- `src/App.jsx`: routing via `window.location.hash` — se l'hash è `#/admin` e l'utente è autenticato, mostra `Admin` invece di `Dashboard`.
- `.env.example`: aggiunta `VITE_ADMIN_PASSWORD=your-admin-password`.
- Nessun link visibile all'admin nell'interfaccia utente — l'URL è conosciuto solo dall'amministratore.
- Aggiornata versione a **0.7.0** (nuova feature significativa).
- Build di produzione eseguito per verificare integrità.

### [0.6.9] — GitHub Actions keepalive per Supabase
- **Autore:** PiBOH
- **Data:** 2026-07-04

#### Aggiunte
- `.github/workflows/keepalive.yml`: workflow GitHub Actions che ogni giorno a mezzanotte UTC esegue una query `SELECT id FROM titles LIMIT 1` a Supabase per evitare la pausa dopo 7 giorni di inattività.
- Il workflow usa i secret `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` (nomi uniformi con il `.env`).
- Aggiornata versione ovunque a **0.6.9**.
- Build di produzione eseguito per verificare integrità.

### [0.6.8] — Sincronizzazione authorized.js + badge ruolo utente nell'header
- **Autore:** PiBOH
- **Data:** 2026-07-04

#### Modifiche
- Sincronizzato `src/data/authorized.js` dal repository GitHub `PiBOH-EDU/tcr-notes` (branch main).
- `Dashboard.jsx`: aggiunto badge ruolo accanto al nome utente nell'header:
  - `👁️ Viewer` (giallo) per utenti con permesso di sola lettura
  - `✏️ Editor` (verde) per utenti con permesso di modifica
- Aggiornata versione ovunque a **0.6.8**.
- Build di produzione eseguito per verificare integrità.

### [0.6.7-sync] — Sincronizzazione state.json e authorized.js dal repository remoto
- **Data:** 2026-07-04
- **Modifiche:**
  - Sincronizzato `public/state.json` dal repository GitHub `PiBOH-EDU/tcr-notes` (branch main).
  - Sincronizzato `src/data/authorized.js` dal repository remoto.
  - Build di produzione eseguito per verificare integrità post-sincronizzazione.

### [0.6.7-fix] — Fix sicurezza: password rimossa da .env.example e CHANGELOG
- **Data:** 2026-07-04
- **Modifiche:**
  - `.env.example`: sostituita password reale con placeholder `your-class-password`.
  - `CHANGELOG.md`: rimosso riferimento specifico alla password.
  - Build di produzione eseguito per verificare integrità.

### [0.6.7] — Icona immagini 🌄, permessi utente (viewer/editor), posizione online, cursore remoto, rimosso avviso login
- **Autore:** PiBOH
- **Data:** 2026-07-04

#### Modifiche
- `Editor.jsx` / `MarkdownToolbar.jsx` / `MANUAL.md`: icona immagini cambiata da 🖼 a 🌄. Tooltip toggle: "Clicca qui e Nascondi/Mostra immagini nella preview".
- `Login.jsx`: rimosso banner avviso dati personali (già presente nel footer).
- `authorized.js`: supporto per permessi utente. Ogni voce può essere:
  - Stringa `'rossi.mario'` → default `editor` (retrocompatibilità)
  - Oggetto `{ name: 'rossi.mario', role: 'viewer' }` → solo lettura
  - Oggetto `{ name: 'rossi.mario', role: 'editor' }` → lettura e scrittura
- `Login.jsx`: estrae il ruolo dall'utente autorizzato e lo passa a `onLogin(name, role)`.
- `App.jsx`: passa `role` a `Dashboard`.
- `Dashboard.jsx`: se `role === 'viewer'`, nasconde i pulsanti "+ Nuovo" (titoli/capitoli), "Esporta", "Importa", e disabilita elimina/rinomina.
- `Editor.jsx`: se `role === 'viewer'`, la textarea è `readOnly`, toolbar nascosta, pulsante Salva nascosto, stato mostrato come "🔒 Solo lettura".
- `Dashboard.jsx` / `Editor.jsx`: broadcast "typing" esteso con `titleId`, `chapterId`, `cursorPosition`. La lista utenti online mostra dove si trova ogni persona (`Homepage`, `Titolo > Capitolo`, o `Titolo` se nessun capitolo selezionato).
- `Editor.jsx`: nella status bar, quando un utente sta scrivendo, mostra anche la posizione del cursore (carattere N).
- `HighlightTextarea.jsx`: aggiunto overlay cursore remoto — un piccolo elemento posizionato assolutamente che mostra il nome dell'utente e una linea verticale colorata dove sta scrivendo.
- Aggiornata versione ovunque a **0.6.7**.
- Build di produzione eseguito per verificare integrità.

### [0.6.6] — Highlight testo piano: rimossa penombra, colori più scuri
- **Autore:** PiBOH
- **Data:** 2026-07-04

#### Modifiche
- `HighlightTextarea.jsx`: rimosse tutte le classi `opacity-*` (penombra). Ora i delimitatori e il testo evidenziato usano colori grigio diretti più scuri/marcato:
  - Commenti `<!-- -->`: `text-gray-400 italic` (senza opacity)
  - Delimitatori `**`, `~~`, `` ` ``: `text-gray-500` (senza opacity)
  - Barrato: solo `line-through` (stesso colore del testo, più leggibile)
  - Codice inline: `bg-gray-500/15` + bordi arrotondati (sfondo tenue invece di penombra)
- Aggiornata versione ovunque a **0.6.6**.
- Build di produzione eseguito per verificare integrità.

### [0.6.5] — Fix stile codice nel rendering Markdown
- **Autore:** PiBOH
- **Data:** 2026-07-04

#### Modifiche
- `Editor.jsx`: aggiunto componente custom `code` per ReactMarkdown che distingue codice inline (`<code>`) da blocchi di codice (`<pre><code>`).
  - Inline: sfondo semi-trasparente (`bg-gray-500/20`), bordi arrotondati, font monospace, padding.
  - Blocco: sfondo pieno (`bg-gray-900` dark / `bg-gray-100` light), bordi arrotondati, padding maggiore, scroll orizzontale.
- Aggiornata versione ovunque a **0.6.5**.
- Build di produzione eseguito per verificare integrità.

### [0.6.4] — Footer su una riga + Favicon browser
- **Autore:** PiBOH
- **Data:** 2026-07-04

#### Modifiche
- `Footer.jsx`: layout su **una sola riga** a 3 colonne:
  - Sinistra: "Materiale privato — accesso riservato alla classe 1FT (A.S. 2025/2026)"
  - Centro: "v0.6.4 · PiBOH"
  - Destra: "⚠️ Non inserire dati personali negli appunti"
  - Responsive: su schermi stretti i testi si riducono e vanno a capo se necessario.
- `index.html`: aggiunta favicon 📚 (libro) come SVG inline, visibile nella scheda del browser.
- Aggiornata versione ovunque a **0.6.4**.
- Build di produzione eseguito per verificare integrità.

### [0.6.3] — Fix password in MANUAL, state.json commentato, img 5MB, highlight codice, selezione testo preview, toggle immagini, fix menu online, footer compatto, uniforma font code/liste, fix liste numerate
- **Autore:** PiBOH
- **Data:** 2026-07-04

#### Sicurezza
- `docs/MANUAL.md`: rimossa password reale `Barsanti1FT`. Sostituita con placeholder `[password-fornita-dal-professore]`.

#### Aggiunte
- `public/state.json`: aggiunto campo `_readme` con spiegazione dei campi e degli stati disponibili.
- `HighlightTextarea.jsx`: evidenziazione per codice inline (`` `codice` ``) con sfondo semi-trasparente e bordi arrotondati, simile a GitHub.
- `Editor.jsx`: 
  - Possibilità di **selezionare il testo** nella preview Markdown senza switchare in edit mode (se c'è una selezione attiva, il click viene ignorato).
  - Toggle **"Mostra immagini"** nella status bar (default: attivo). Quando disattivato, le immagini nella preview vengono sostituite da un placeholder testuale `[Immagine nascosta]`.
- `Dashboard.jsx`: il menu utenti online ora si chiude cliccando fuori (come il menu Info).

#### Modifiche
- `MarkdownToolbar.jsx`: limite upload immagini aumentato da **500 KB a 5 MB**.
- `Footer.jsx`: altezza ridotta — padding diminuiti, testi più compatti.
- `Editor.jsx`: uniformata la dimensione del testo per blocchi di codice (`prose-pre:text-base`) e liste (`prose-li:text-base`, `prose-ol:text-base`) alla dimensione del testo normale.
- `Editor.jsx`: fix rendering liste numerate — aggiunte classi CSS esplicite `list-decimal` per garantire la numerazione corretta in sequenza.
- Aggiornata versione ovunque a **0.6.3**.
- Build di produzione eseguito per verificare integrità.

### [0.6.2] — Sistema di stato app visibile nel login
- **Autore:** PiBOH
- **Data:** 2026-07-04

#### Aggiunte
- `public/state.json`: file di configurazione per lo stato dell'app. Modificabile senza rebuild (servito staticamente).
  - `status`: `online` | `maintenance` | `testing` | `issue` | `offline`
  - `message`: testo personalizzato da mostrare nel banner
  - `banner`: booleano per forzare la visibilità
  - `bannerType`: `info` | `warning` | `error` per il colore del banner
- `Login.jsx`: fetch di `/state.json` al mount. Mostra banner colorato in base allo stato:
  - `online` → nessun banner (a meno che `banner: true`)
  - `maintenance` → banner giallo/arancione
  - `testing` → banner blu
  - `issue` → banner rosso
  - `offline` → banner rosso scuro + form di login disabilitato
- Aggiornata versione ovunque a **0.6.2**.
- Build di produzione eseguito per verificare integrità.

### [0.6.1] — Integrazione imgBB nei documenti + Manuale utente
- **Autore:** PiBOH
- **Data:** 2026-07-04

#### Aggiunte
- `docs/MANUAL.md`: manuale utente completo per principianti. Copre login, dashboard, editor (testo piano / rendering markdown), toolbar, salvataggio, undo/redo, export/import, cronologia, impostazioni, FAQ.
- `docs/SECURITY.md`: aggiunta sezione "API Key imgBB" — ricorda di non committare la chiave, trattarla come password, e nota che le immagini su imgBB sono pubbliche.
- `docs/DISCLAIMER.md`: aggiunto **imgBB** all'elenco dei servizi di terze parti.
- `docs/LIMITATIONS.md`: aggiunta sezione **5. imgBB (Hosting immagini)** con limiti del piano gratuito, privacy delle immagini pubbliche, durata, e raccomandazioni.

#### Modifiche
- Aggiornati i riferimenti alla versione nei documenti (dove presenti) a **0.6.1**.
- Build di produzione eseguito per verificare integrità.
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
