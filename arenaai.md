# arenaai.md — tcr-notes App

## Regole Fondamentali del Progetto

> **SE FUNZIONA NON SI TOCCA.**

- Ogni modifica al codice, alla struttura o alla logica deve essere documentata in questo file **prima** di essere applicata.
- Questo file è la storia del progetto: serve per poter ritornare sui passi senza problemi.
- Non rimuovere sezioni precedenti del changelog: aggiorna solo in coda.
- La versione corrente è indicata nel footer dell'app.

---

## Changelog

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
