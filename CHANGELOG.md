# Changelog

Tutte le modifiche significative a questo progetto saranno documentate in questo file.

Il formato è basato su [Keep a Changelog](https://keepachangelog.com/it/1.1.0/),
e questo progetto aderisce a [Semantic Versioning](https://semver.org/lang/it/).

## [Unreleased]

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
