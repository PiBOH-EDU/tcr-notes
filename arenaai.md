# arenaai.md — trc-notes App

## Regole Fondamentali del Progetto

> **SE FUNZIONA NON SI TOCCA.**

- Ogni modifica al codice, alla struttura o alla logica deve essere documentata in questo file **prima** di essere applicata.
- Questo file è la storia del progetto: serve per poter ritornare sui passi senza problemi.
- Non rimuovere sezioni precedenti del changelog: aggiorna solo in coda.
- La versione corrente è indicata nel footer dell'app.

---

## Changelog

### v0.0.1_ALPHA — Setup Iniziale
- **Autore:** PiBOH
- **Data:** 2026-07-02

#### Aggiunte
- Creazione progetto React + Vite + Tailwind CSS.
- Integrazione Supabase Realtime (DB + Broadcast).
- Implementazione Dark/Light Mode con persistenza localStorage (default: dark).
- Schermata di login doppia: Nome e Cognome + Password di classe ("Barsanti1FT").
- Controllo accessi su liste AUTORIZZATI.md e BANNATI.md (case-insensitive).
- Dashboard con lista note e editor collaborativo in tempo reale.
- Tracciamento "chi sta scrivendo" tramite Supabase Broadcast.
- Tracciamento "ultima modifica di" tramite colonna `last_edited_by` su Supabase.
- Footer con nota di copyright e versione.
- File `.env.example` e query SQL per setup Supabase.

### v0.0.1_ALPHA — Rinominato progetto in trc-notes + fix tema bianco
- **Data:** 2026-07-02
- **Modifiche:**
  - Rinominata cartella progetto da `catcher-notes` a `trc-notes` (nome repo).
  - Aggiornati `package.json`, `index.html`, titoli UI e `arenaai.md`.
  - Aggiunta classe `dark` di default al `<body>` in `index.html` per evitare flash bianco all'avvio.

### v0.0.1_ALPHA — Login con campi separati Cognome / Nome
- **Data:** 2026-07-02
- **Modifiche:**
  - Sostituito il campo singolo "Nome e Cognome" con due campi separati: **Cognome** e **Nome (o nomi)**.
  - Aggiornata la funzione `normalizeName(cognome, nome)` per combinare i due campi nel formato `cognome.nome` (minuscolo, senza spazi).
  - Migliorata l'usabilità e ridotti gli errori di input da parte degli utenti.
- **Data:** 2026-07-02
- **Modifiche:**
  - Aggiornata la logica di login per normalizzare l'input utente nel formato `cognome.nome` (tutto minuscolo, senza spazi).
  - Esempio: "Mario Rossi" -> `rossi.mario`.
  - I controlli su `AUTHORIZED` e `BANNATI` avvengono ora sul formato normalizzato.
  - Aggiornati i commenti in `src/data/authorized.js` e `src/data/banned.js` per documentare il formato atteso.
  - Il nome normalizzato viene salvato in `localStorage` e usato per il tracciamento Realtime.
- **Data:** 2026-07-02
- **Modifiche:**
  - Sostituiti `AUTORIZZATI.md` e `BANNATI.md` con i file ufficiali caricati dall'utente.
  - `AUTORIZZATI.md` ora autorizza genericamente tutti i membri della classe 1FT; la verifica avviene tramite password condivisa.
  - Aggiornata logica login: accetta qualsiasi nome (obbligatorio) con password corretta, a meno che il nome non sia esplicitamente nella lista `BANNATI.md`.
  - Aggiornati `src/data/authorized.js` e `src/data/banned.js` per riflettere la nuova struttura.
  - Aggiornato `src/components/Login.jsx` con la nuova logica di autorizzazione.
