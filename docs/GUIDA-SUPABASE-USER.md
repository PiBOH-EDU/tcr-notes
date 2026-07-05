# Guida passo-passo: Aggiungere utenti autorizzati su Supabase

> **Destinatario:** amministratore dell'app tcr-notes  
> **Versione app:** 0.9.0  
> **Ultimo aggiornamento:** 2026-07-05

---

## Indice

1. [Prima di iniziare](#1-prima-di-iniziare)
2. [Accedi alla dashboard Supabase](#2-accedi-alla-dashboard-supabase)
3. [Metodo A — Inserimento rapido (Table Editor)](#3-metodo-a--inserimento-rapido-table-editor)
4. [Metodo B — Inserimento avanzato (SQL Editor)](#4-metodo-b--inserimento-avanzato-sql-editor)
5. [Verifica dell'inserimento](#5-verifica-dellinserimento)
6. [Formato dei dati](#6-formato-dei-dati)
7. [Esempi pratici](#7-esempi-pratici)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. Prima di iniziare

Dalla versione **0.8.0** gli utenti autorizzati non sono più memorizzati in file JavaScript nel codice sorgente, ma in una **tabella Supabase** chiamata `utenti_autorizzati`.

Questo garantisce:

- **Privacy (GDPR):** i nomi reali degli studenti non sono visibili su GitHub.
- **Sicurezza:** l'accesso alla tabella è protetto da RLS (Row Level Security); il frontend può interrogare i dati solo tramite funzioni RPC controllate.
- **Flessibilità:** puoi aggiungere, modificare o rimuovere utenti in qualsiasi momento senza dover ricompilare o rilasciare una nuova versione dell'app.

### Cosa ti serve

- L'indirizzo (URL) del progetto Supabase
- La password di accesso alla dashboard Supabase (o un account con ruolo `Owner` / `Admin`)
- La lista degli studenti da autorizzare (formato: `cognome.nome`)

> ⚠️ **Importante:** inserisci i dati reali solo su Supabase. **Non** scrivere mai nomi, cognomi o altri dati personali nei file del repository GitHub.

---

## 2. Accedi alla dashboard Supabase

1. Apri il browser e vai all'indirizzo del tuo progetto Supabase:  
   `https://supabase.com/dashboard/project/<PROJECT_REF>`
2. Effettua il login con le tue credenziali.
3. Dal menu laterale sinistro, seleziona **"Database"** (icona 🗄️).

---

## 3. Metodo A — Inserimento rapido (Table Editor)

Questo è il modo più semplice per aggiungere uno o pochi utenti.

### Passo 1: Apri la tabella

1. Nel menu laterale, clicca su **"Table Editor"**.
2. Cerca la tabella **`utenti_autorizzati`** nell'elenco e cliccalaci sopra.

### Passo 2: Inserisci una riga

1. Clicca il pulsante **"Insert row"** (in alto a sinistra, icona ➕).
2. Si apre un pannello laterale con i campi da compilare.

### Passo 3: Compila i campi

| Campo | Tipo | Obbligatorio | Descrizione |
|-------|------|--------------|-------------|
| `id` | uuid | Sì (auto) | Lascia vuoto: viene generato automaticamente da Supabase. |
| `identificativo` | text | Sì | Il nome utente in formato `cognome.nome` (tutto minuscolo, senza spazi, senza accenti). Es. `rossi.mario`. |
| `nome_reale` | text | No | Nome e cognome reali dello studente (es. `Mario Rossi`). Serve solo all'amministratore per riconoscere l'utente. **Non viene mai mostrato nell'app pubblica.** |
| `bannato` | boolean | Sì (default) | `false` = utente attivo; `true` = utente bloccato. |
| `ruolo` | text | Sì | `editor` (può leggere e scrivere) oppure `viewer` (sola lettura). |
| `created_at` | timestamptz | Sì (auto) | Lascia vuoto: viene impostato automaticamente. |

### Passo 4: Salva

1. Clicca **"Save"** in basso a destra del pannello.
2. La riga apparirà immediatamente nella tabella.

> 💡 **Suggerimento:** puoi duplicare una riga esistente (tasto destro → "Duplicate row") e modificare solo i campi che cambiano, per velocizzare l'inserimento di molti utenti.

---

## 4. Metodo B — Inserimento avanzato (SQL Editor)

Questo metodo è utile quando devi inserire **molti utenti contemporaneamente** (es. a inizio anno scolastico).

### Passo 1: Apri l'SQL Editor

1. Nel menu laterale, clicca su **"SQL Editor"** (icona 📝).
2. Clicca **"New query"**.

### Passo 2: Scrivi la query di inserimento

Usa il comando `INSERT INTO`. Ecco un esempio con nomi fittizi:

```sql
INSERT INTO public.utenti_autorizzati (identificativo, nome_reale, bannato, ruolo)
VALUES
  ('rossi.mario', 'Mario Rossi', false, 'editor'),
  ('bianchi.lucia', 'Lucia Bianchi', false, 'editor'),
  ('verdi.antonio', 'Antonio Verdi', false, 'viewer'),
  ('neri.giovanni', 'Giovanni Neri', false, 'editor'),
  ('gialli.paola', 'Paola Gialli', false, 'viewer');
```

### Passo 3: Esegui la query

1. Clicca il pulsante **"Run"** (▶️) in alto a destra.
2. Se tutto è corretto, vedrai il messaggio:  
   `Success. No rows returned` (o un conteggio delle righe inserite).

### Inserimento con ON CONFLICT (utile per aggiornare)

Se vuoi inserire utenti nuovi e aggiornare quelli esistenti senza ottenere errori di chiave duplicata:

```sql
INSERT INTO public.utenti_autorizzati (identificativo, nome_reale, bannato, ruolo)
VALUES
  ('rossi.mario', 'Mario Rossi', false, 'editor'),
  ('bianchi.lucia', 'Lucia Bianchi', false, 'editor')
ON CONFLICT (identificativo)
DO UPDATE SET
  nome_reale = EXCLUDED.nome_reale,
  bannato = EXCLUDED.bannato,
  ruolo = EXCLUDED.ruolo;
```

---

## 5. Verifica dell'inserimento

### Verifica visiva

1. Torna su **"Table Editor"** → **`utenti_autorizzati`**.
2. Controlla che le righe siano presenti e i campi siano corretti.

### Verifica funzionale (test di login)

1. Apri l'app tcr-notes in una scheda in incognito del browser.
2. Prova a effettuare il login con uno degli identificativi appena inseriti:
   - **Nome/i:** `Mario`
   - **Cognome:** `Rossi`
   - **Password di classe:** (quella configurata in `.env`)
3. Se il login riesce, l'utente è stato inserito correttamente.

---

## 6. Formato dei dati

### `identificativo` (campo chiave)

- **Pattern:** `cognome.nome`
- **Regole:**
  - Tutto in **minuscolo**
  - **Nessuno spazio** (né tra cognome e punto, né tra punto e nome)
  - **Nessun accento** (es. `à` → `a`, `è` → `e`)
  - Se ci sono più nomi, scriverli **attaccati** (es. `AnnaMaria` → `rossi.annamaria`)
  - Se il cognome è composto, scriverlo **attaccato** (es. `De Luca` → `deluca.mario`)

### `ruolo`

| Valore | Permessi | Badge visibile |
|--------|----------|----------------|
| `editor` | Legge e scrive appunti, crea titoli/capitoli, carica immagini. | ✏️ Editor |
| `viewer` | Legge solo appunti, non può modificare nulla. | 👁️ Viewer |

### `bannato`

- `false` (default): l'utente può accedere normalmente.
- `true`: l'utente viene bloccato al login con il messaggio "Accesso negato: utente bannato."

---

## 7. Esempi pratici

### Esempio 1 — Studente con nome semplice

| Campo | Valore |
|-------|--------|
| identificativo | `rossi.mario` |
| nome_reale | `Mario Rossi` |
| bannato | `false` |
| ruolo | `editor` |

Login: Nome `Mario`, Cognome `Rossi` → normalizzato in `rossi.mario` ✅

### Esempio 2 — Studente con doppio nome

| Campo | Valore |
|-------|--------|
| identificativo | `bianchi.annamaria` |
| nome_reale | `Anna Maria Bianchi` |
| bannato | `false` |
| ruolo | `editor` |

Login: Nome `AnnaMaria`, Cognome `Bianchi` → normalizzato in `bianchi.annamaria` ✅  
⚠️ Attenzione: se lo studente inserisce `Anna Maria` (con spazio), la normalizzazione rimuove lo spazio e diventa `bianchi.annamaria` — quindi funziona comunque.

### Esempio 3 — Studente con cognome composto

| Campo | Valore |
|-------|--------|
| identificativo | `verdi.antonio` |
| nome_reale | `Antonio De Verdi` |
| bannato | `false` |
| ruolo | `viewer` |

Login: Nome `Antonio`, Cognome `DeVerdi` → normalizzato in `deverdi.antonio` ⚠️  
**Nota:** in questo caso l'amministratore deve decidere se registrare l'identificativo come `deverdi.antonio` o `de.verdi.antonio`. L'importante è che lo studente sappia esattamente come inserire cognome e nome.

### Esempio 4 — Utente bannato

| Campo | Valore |
|-------|--------|
| identificativo | `neri.giovanni` |
| nome_reale | `Giovanni Neri` |
| bannato | `true` |
| ruolo | `editor` |

Questo utente vedrà il messaggio "Accesso negato: utente bannato." anche se inserisce la password corretta.

---

## 8. Troubleshooting

### "Accesso negato: non sei nella lista degli autorizzati"

1. Controlla nella tabella `utenti_autorizzati` che l'`identificativo` sia esattamente uguale a quello generato dal login (`cognome.nome` in minuscolo, senza spazi).
2. Verifica che il campo `bannato` sia `false`.
3. Controlla che lo studente non stia inserendo accenti o spazi nel campo Nome o Cognome (la normalizzazione li rimuove, ma è bene essere sicuri).

### "Errore di connessione al server"

1. Verifica che il progetto Supabase sia online (dashboard accessibile).
2. Controlla che le variabili d'ambiente `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` nel file `.env` siano corrette.
3. Se il progetto Supabase è in pausa (dopo 7 giorni di inattività), riattivalo dalla dashboard.

### Non vedo la tabella `utenti_autorizzati`

1. Assicurati di aver eseguito lo script `supabase-users.sql` durante la configurazione iniziale.
2. Se il database è stato creato da zero, esegui lo script completo disponibile nel repository: `supabase-users.sql`.

### Ho inserito un utente ma il ruolo è sbagliato

1. Vai su **Table Editor** → `utenti_autorizzati`.
2. Trova la riga dell'utente.
3. Clicca due volte sul campo `ruolo` e cambialo in `editor` o `viewer`.
4. Premi `Invio` per salvare.

---

## Riepilogo comandi SQL utili

```sql
-- Elenco di tutti gli utenti autorizzati (escluso nome_reale per privacy)
SELECT identificativo, ruolo, bannato, created_at
FROM public.utenti_autorizzati
ORDER BY identificativo;

-- Conta utenti per ruolo
SELECT ruolo, COUNT(*) FROM public.utenti_autorizzati
WHERE bannato = false
GROUP BY ruolo;

-- Cerca un utente specifico
SELECT * FROM public.utenti_autorizzati
WHERE identificativo = 'rossi.mario';

-- Aggiorna il ruolo di un utente
UPDATE public.utenti_autorizzati
SET ruolo = 'viewer'
WHERE identificativo = 'rossi.mario';

-- Banna un utente
UPDATE public.utenti_autorizzati
SET bannato = true
WHERE identificativo = 'rossi.mario';
```

---

**Fine della guida.** Per dubbi o problemi, apri una issue su GitHub: `https://github.com/PiBOH-EDU/tcr-notes/issues`
