# Changelog

Tutte le modifiche significative a questo progetto saranno documentate in questo file.

Il formato è basato su [Keep a Changelog](https://keepachangelog.com/it/1.1.0/),
e questo progetto aderisce a [Semantic Versioning](https://semver.org/lang/it/).

## [Unreleased]

## [0.11.2] - 2026-07-05

### Corretto
- Icona APK Android: generata cartella `android-assets/` con icone in tutte le risoluzioni. Il workflow copia le icone nelle cartelle `mipmap-*` prima del build.
- Bump versione a **0.11.2** ovunque.

## [0.11.1] - 2026-07-05

### Corretto
- APK: `server.url` in `capacitor.config.json` — l'app carica sempre la versione live del sito.
- Login: rimosso banner stato (ora solo nel footer).
- Login: aggiunto toggle "👁️ Mostra/Nascondi password".
- Footer: ripristinata scritta "⚠️ Non inserire dati personali".
- Admin: aggiunto pulsante "🔄 Aggiorna".
- Logo sincronizzato dal repository remoto.
- Bump versione a **0.11.1** ovunque.

## [0.11.0] - 2026-07-05

### Aggiunto
- Logo ufficiale `logo.png` integrato in login (desktop + mobile), favicon, e menu info.
- Link esterni si aprono nel browser esterno (plugin `@capacitor/browser` nell'APK).
- Sidebar mobile si chiude automaticamente quando si seleziona un capitolo.
- Menu Info — sezione "Download" con link diretto all'APK Android.
- Footer — status badge da `state.json` (manutenzione/test/issue/offline) su riga dedicata.
- Cursore remoto preciso: calcola riga e colonna esatta.
- Testo in tempo reale: il contenuto si aggiorna dal broadcast typing se non si sta scrivendo.

### Modificato
- Workflow APK: usa `assembleDebug` (non richiede keystore).
- `docs/GUIDA-APK.md`: aggiunta sezione debug vs release.
- Bump versione a **0.11.0** ovunque.

## [0.10.4] - 2026-07-05

### Modificato
- `docs/GUIDA-APK.md`: aggiunta sezione "Pulizia cache npm e Gradle" con comandi per risolvere build falliti.
- Bump versione a **0.10.4** ovunque.

## [0.10.3] - 2026-07-05

### Modificato
- `Login.jsx`: su desktop layout a **due colonne** — sinistra branding con gradiente e decorazioni, destra form di login. Mobile rimane invariato.
- Bump versione a **0.10.3** ovunque.

## [0.10.2] - 2026-07-05

### Corretto
- Workflow APK Android: rimosso flag `--no-interactive` inesistente in `@capacitor/cli`.
- Aggiunto `capacitor.config.json` nella root del repository.
- Workflow semplificato: build web → install Capacitor → add android → sync → build APK.
- Aggiornata `docs/GUIDA-APK.md` per riflettere il nuovo flusso.
- Bump versione a **0.10.2** ovunque.

## [0.10.1] - 2026-07-05

### Modificato
- Package ID APK Android cambiato in `com.tcrnotes.app` (workflow + guida).
- Bump versione a **0.10.1** ovunque.

## [0.10.0] - 2026-07-05

### Aggiunto
- **Login desktop**: card più larga e spaziature maggiori su schermi `md:`+. Mobile invariato.
- **`.github/PULL_REQUEST_TEMPLATE/pull_request_template.md`**: template custom per le pull request.
- **Ordinamento capitoli** (issue #2): dropdown con Alfabetico / Più vecchi / Più recenti. Default: **Più recenti prima**.
- **APK Android** (issue #1): workflow `.github/workflows/build-apk.yml` con Capacitor. Guida `docs/GUIDA-APK.md`.
- **Favicon PNG**: `public/favicon.png` generata da `favicon.svg`.
- **Admin — workflow GitHub**: sezione che mostra lo stato degli ultimi workflow run via API GitHub.
- **Admin — bannati visibili**: colonna stato (Attivo/Bannato) nella tabella utenti autorizzati.

### Modificato
- **Admin — accesso diretto**: `/admin` accessibile direttamente con solo password, senza login studente.
- **Admin — persistenza auth**: `localStorage` (`tcr-admin-auth`) mantiene la sessione admin anche dopo refresh.
- **Supabase status check**: `Promise.race` con timeout 3s rileva correttamente l'offline.
- **Realtime posizione**: il broadcast include `titleName` e `chapterName`, risolvendo il bug "sempre Homepage".
- **Cursore remoto**: linea verticale colorata posizionata alla riga del cursore remoto.
- Sincronizzati `README.md` (ASCII art) e `public/state.json` dal repo remoto.
- Bump versione a **0.10.0** ovunque.

## [0.9.1] - 2026-07-05

### Modificato
- `Login.jsx`: unite le due checkbox (documenti legali + Privacy) in **una sola checkbox obbligatoria**.
  - Nuova chiave `localStorage`: `tcr-all-legal-accepted` (obbliga tutti a rifare il consenso).
  - Testo unico che elenca `SECURITY.md`, `DISCLAIMER.md`, `CODE OF CONDUCT.md` e `PRIVACY.md`.
  - Rimosso stato `acceptedPrivacy` separato.
- Bump versione a **0.9.1** in `package.json`, `Footer.jsx`, `InfoMenu.jsx`, `CHANGELOG.md`, `arenaai.md`.

## [0.9.0] - 2026-07-05

### Aggiunto
- `docs/PRIVACY.md`: informativa sulla privacy completa conforme al GDPR, con titolare del trattamento, dati raccolti, finalità, base giuridica, periodo di conservazione, diritti degli interessati, elenco subfornitori (Supabase, Vercel, imgBB, GitHub) e cookie/localStorage.
- `docs/GUIDA-SUPABASE-USER.md`: guida passo-passo per l'amministratore su come aggiungere utenti autorizzati nella tabella `utenti_autorizzati` di Supabase (Table Editor e SQL Editor).
- `Login.jsx`: seconda checkbox obbligatoria per l'accettazione della Privacy Policy (`PRIVACY.md`), con persistenza in `localStorage` (`tcr-privacy-accepted`).
- `InfoMenu.jsx`: aggiunto link a `PRIVACY.md` nella sezione Documentazione.

### Modificato
- Bump versione a **0.9.0** in `package.json`, `Footer.jsx`, `InfoMenu.jsx`, `CHANGELOG.md`, `arenaai.md`.

## [0.8.0] - 2026-07-04

### Sicurezza
- Rimossi `src/data/authorized.js` e `src/data/banned.js` — nessun dato personale su GitHub.
- Tabella `utenti_autorizzati` su Supabase con funzioni RPC `check_user_access()` e `list_users_for_admin()`.
- RLS abilitata: nessun accesso diretto anon alla tabella, solo via RPC.

### Aggiunto
- `src/lib/auth.js`: `checkUserAccess()`, `listAuthorizedUsers()`, `getUserRoleFromList()`.
- `supabase-users.sql`: script SQL completo per setup tabella + funzioni RPC.

### Modificato
- `Login.jsx`: login asincrono via Supabase RPC invece di array locali.
- `Admin.jsx`: carica utenti autorizzati da Supabase, rimosso import `AUTHORIZED`.

## [0.7.1] - 2026-07-04

### Modificato
- Routing admin: da `/#/admin` a `/admin` grazie a `vercel.json` (rewrite SPA).
- `App.jsx` e `Admin.jsx`: usano `window.location.pathname` invece di `window.location.hash`.

## [0.7.0] - 2026-07-04

### Aggiunto
- `src/components/Admin.jsx`: dashboard admin segreta accessibile via `/#/admin`.
  - Protezione con password `VITE_ADMIN_PASSWORD`.
  - Card KPI: stato Supabase, utenti online, utenti autorizzati, modifiche recenti.
  - Tabella utenti online con nome, posizione (Homepage/Titolo/Capitolo), ruolo.
  - Tabella utenti autorizzati con ruolo (viewer/editor).
  - Tabella log modifiche recenti (ultime 20 revisioni).
- `src/lib/storage.js`: funzione `getRecentHistory()` per recuperare log globali.
- `src/App.jsx`: routing via hash per accedere a `/admin`.
- Nessun link visibile all'admin — l'URL è segreto.

## [0.6.9] - 2026-07-04

### Aggiunto
- `.github/workflows/keepalive.yml`: workflow GitHub Actions per evitare la pausa di Supabase dopo 7 giorni. Esegue una query giornaliera al database.
- Usa i secret `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` (nomi uniformi con il `.env`).

## [0.6.8] - 2026-07-04

### Modificato
- Sincronizzato `authorized.js` dal repository remoto.
- `Dashboard.jsx`: aggiunto badge ruolo accanto al nome utente (`👁️ Viewer` / `✏️ Editor`).

## [0.6.7] - 2026-07-04

### Sicurezza
- Rimossa password reale da tutti i file visibili (CHANGELOG.md, LIMITATIONS.md, MANUAL.md).
- Password spostata in variabile d'ambiente `VITE_CLASS_PASSWORD` (vedi `.env.example` per il formato).

### Aggiunto
- `authorized.js`: supporto permessi `viewer` (solo lettura) / `editor` (lettura+scrittura).
- `Login.jsx` / `App.jsx` / `Dashboard.jsx` / `Editor.jsx`: sistema ruoli completo.
- Posizione utenti online: la lista mostra dove si trova ogni persona (Homepage / Titolo / Titolo > Capitolo).
- Cursore remoto in testo piano: badge "✍️ [nome] al carattere N" in alto a destra della textarea.
- `Editor.jsx`: status bar mostra posizione cursore dell'utente che sta scrivendo.

### Modificato
- Icona immagini: 🖼 → 🌄 in tutta l'app.
- Tooltip toggle immagini: "Clicca qui e Nascondi/Mostra immagini nella preview".
- `Login.jsx`: rimosso banner avviso dati personali (già nel footer).
- `HighlightTextarea.jsx` / `Editor.jsx`: rimossa penombra (opacity) dal codice inline, ora sfondo solido.

## [0.6.6] - 2026-07-04

### Modificato
- `HighlightTextarea.jsx`: rimosse tutte le classi `opacity-*` (penombra). Ora si usano colori grigio diretti più scuri:
  - Commenti: `text-gray-400 italic`
  - Delimitatori `**` / `~~` / `` ` ``: `text-gray-500`
  - Barrato: solo `line-through` (stesso colore del testo, più leggibile)
  - Codice inline: sfondo `bg-gray-500/15` tenue invece di penombra.

## [0.6.5] - 2026-07-04

### Modificato
- `Editor.jsx`: aggiunti componenti custom `code` e `pre` per ReactMarkdown.
  - Codice inline (`<code>`): sfondo semi-trasparente, bordi arrotondati, font monospace.
  - Blocchi di codice (`<pre>`): sfondo pieno (grigio scuro in dark / grigio chiaro in light), padding, scroll orizzontale.

## [0.6.4] - 2026-07-04

### Modificato
- `Footer.jsx`: layout su una sola riga a 3 colonne (sinistra: copyright, centro: versione, destra: avviso dati personali).
- `index.html`: aggiunta favicon 📚 (libro) visibile nella scheda del browser.

## [0.6.3] - 2026-07-04

### Sicurezza
- Rimossa password reale da `docs/MANUAL.md` — sostituita con placeholder.

### Aggiunto
- `public/state.json`: campi `_readme` e `_comment_*` con spiegazione dei campi e degli stati disponibili.
- `HighlightTextarea.jsx`: evidenziazione per codice inline (`` `codice` ``) con sfondo semi-trasparente, simile a GitHub.
- `Editor.jsx`: possibilità di **selezionare il testo** nella preview Markdown senza switchare in edit mode.
- `Editor.jsx`: toggle **"Mostra immagini"** (`🖼 On/Off`) nella status bar, default attivo.
- `Dashboard.jsx`: il menu utenti online si chiude cliccando fuori (come InfoMenu).

### Modificato
- `MarkdownToolbar.jsx`: limite upload immagini da **500 KB a 5 MB**.
- `Editor.jsx`: uniformata dimensione testo per blocchi di codice e liste alla dimensione normale.
- `Editor.jsx`: fix numerazione liste ordinate (`prose-ol:list-decimal`).
- `Footer.jsx`: altezza ridotta, testi più compatti.

## [0.6.2] - 2026-07-04

### Aggiunto
- `public/state.json`: file di configurazione per lo stato dell'app (online, maintenance, testing, issue, offline). Modificabile senza rebuild.
- Banner di stato visibile nella schermata di login con icona, titolo e messaggio personalizzato.
- Se lo stato è `offline`, il form di login viene disabilitato e mostra "App temporaneamente offline".
- Colori del banner adattivi al tema (dark/light) e al tipo (info, warning, error).

## [0.6.1] - 2026-07-04

### Aggiunto
- `docs/MANUAL.md`: manuale utente completo per principianti con guida all'uso di tutte le funzionalità (login, dashboard, editor, toolbar, salvataggio, undo/redo, immagini, export/import, cronologia, FAQ).
- `docs/SECURITY.md`: aggiunta sezione "API Key imgBB" con raccomandazioni sulla chiave e sulla natura pubblica delle immagini caricate.
- `docs/DISCLAIMER.md`: aggiunto imgBB all'elenco dei servizi di terze parti.
- `docs/LIMITATIONS.md`: aggiunta sezione "imgBB (Hosting immagini)" con limiti del piano gratuito, privacy e raccomandazioni.
- `InfoMenu.jsx`: aggiunto link al manuale utente nel dropdown.

## [0.6.0] - 2026-07-03

### Aggiunto
- **Highlight con simboli visibili**: il componente `HighlightTextarea` ora mostra i delimitatori markdown (`**`, `~~`, `<!-- -->`) in penombra, evidenziando solo il contenuto (grassetto, barrato, corsivo). Comportamento analogo all'editor integrato di GitHub.
- **Cursore preciso in Markdown rendering**: cliccando su un punto specifico della preview Markdown, il cursore si posiziona nel punto testuale corrispondente della textarea (stima via `caretPositionFromPoint` / `caretRangeFromPoint`). I click sui link continuano ad aprire normalmente il collegamento.

## [0.5.0] - 2026-07-03

### Aggiunto
- **Highlight inline nel Testo piano**: il textarea evidenzia in tempo reale `**grassetto**`, `~~barrato~~` e `<!-- commenti -->` (penombra).
- Componente `HighlightTextarea` con doppio layer (textarea trasparente sopra + pre formattato sotto).
- **Badge promemoria Supabase**: banner rosso animato che appare se il progetto Supabase è in pausa o irraggiungibile. Check automatico ogni 5 minuti.

### Modificato
- **No-save se invariato**: se il testo non è stato modificato rispetto all'ultimo salvataggio, lo stato rimane "✅ Salvato" e non viene inviata alcuna richiesta a Supabase.
- Rimosso pulsante "❌ Align" dalla toolbar.

## [0.4.9] - 2026-07-03

### Aggiunto
- Avviso su dati personali: banner nella schermata di login e nota nel footer che ricordano di non inserire dati sensibili negli appunti.
- Sezione in `docs/LIMITATIONS.md` sulla riservatezza dei contenuti.

## [0.4.8] - 2026-07-03

### Aggiunto
- Pulsante **💾 Salva** nella status bar dell'editor per salvataggio manuale immediato.
- Scorciatoia da tastiera `Ctrl+S` (o `Cmd+S`) per salvare manualmente.

### Modificato
- Menu Info: rimosso link a "GUIDA SUPABASE", aggiunto "(GitHub)" alla voce di feedback.

## [0.4.7] - 2026-07-03

### Aggiunto
- Stato "📝 Modificato" nell'editor: quando si scrive compare un indicatore arancione fino al salvataggio.
- Pulsante allinea a sinistra (⬅️ Sinistra) e pulsante "❌ Align" per rimuovere i tag di allineamento dal testo selezionato.
- Componente `MarkdownLink` che aggiunge automaticamente `https://` ai link senza protocollo, evitando redirect relativi al dominio.

### Modificato
- Cliccando sulla preview Markdown si passa direttamente a **Testo piano** (non più solo edit mode dentro Markdown).
- Fix stato salvataggio: ora l'indicatore passa correttamente da ✅ Salvato → 📝 Modificato → ⏳ Salvataggio... → ✅ Salvato.
- Emoji stati salvataggio aggiornate: 📝 Modificato, ⏳ Salvataggio..., ✅ Salvato.
- Limite upload immagini ridotto a **500 KB**.
- Toolbar: aggiunto bottone allinea sinistra e rimuovi allineamento.

## [0.4.6] - 2026-07-03

### Aggiunto
- Menu Info: voce "🐛 Segnala un bug / Richiedi una funzionalità" che rimanda alla pagina issue template di GitHub.
- Toolbar markdown: placeholder descrittivi al posto di stringhe vuote.

### Modificato
- Etichette toggle editor: "Testo piano" e "Rendering Markdown".

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
- Schermata di login doppia: Nome/i e Cognome + Password di classe.
- Controllo accessi su liste `AUTORIZZATI.md` e `BANNATI.md`.
- Dashboard con lista note e editor collaborativo.
- Tracciamento "chi sta scrivendo" tramite Supabase Broadcast.
- Tracciamento "ultima modifica di" tramite colonna `last_edited_by`.
- Footer con nota di copyright e versione.
- File `.env.example` e query SQL per setup Supabase.
