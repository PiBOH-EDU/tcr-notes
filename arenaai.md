# arenaai.md — tcr-notes App

## Regole Fondamentali del Progetto

> **SE FUNZIONA NON SI TOCCA.**

- Ogni modifica al codice, alla struttura o alla logica deve essere documentata in questo file **prima** di essere applicata.
- Questo file è la storia del progetto: serve per poter ritornare sui passi senza problemi.
- Non rimuovere sezioni precedenti del changelog: aggiorna solo in coda.
- La versione corrente è indicata nel footer dell'app.

---

## Changelog

### v0.0.2.1 — Storage locale gerarchico + fix autorizzazioni
- **Autore:** PiBOH
- **Data:** 2026-07-02

#### Aggiunte
- Rimosse tutte le dipendenze e i riferimenti a Supabase.
- Implementato sistema di storage completamente locale via `localStorage` (`src/lib/storage.js`).
- Struttura dati gerarchica: `titles` → `chapters` → `content` + `history`.
- Aggiunta gestione titoli: creazione, eliminazione, lista nella sidebar.
- Aggiunta gestione capitoli: creazione, eliminazione, selezione.
- Aggiunta cronologia automatica per ogni capitolo (ultime 50 versioni).
- Aggiunta visualizzazione cronologia con possibilità di ripristino versioni precedenti.
- Aggiunti pulsanti Esporta/Importa JSON per backup e ripristino dei dati.
- Fix controllo autorizzazioni: se `AUTHORIZED` contiene nomi, solo quelli possono accedere (oltre alla password). Se è vuoto, la password è sufficiente.
- Aggiornati commenti in `authorized.js` e `banned.js` con istruzioni chiare su come aggiungere utenti.
- Fix stile inline in `index.html` per evitare flash bianco all'avvio.
- Aggiornata versione ovunque a **0.0.2.1**.
