# 📘 GUIDA SUPABASE — Configurazione Server per tcr-notes

> Questa guida spiega passo dopo passo come configurare il backend Supabase per l'app **tcr-notes v0.2.4**.

---

## 📋 Indice

1. [Prerequisiti](#1-prerequisiti)
2. [Creazione del progetto Supabase](#2-creazione-del-progetto-supabase)
3. [Configurazione del database](#3-configurazione-del-database)
4. [Abilitazione Realtime](#4-abilitazione-realtime)
5. [Recupero credenziali API](#5-recupero-credenziali-api)
6. [Configurazione file .env](#6-configurazione-file-env)
7. [Verifica funzionamento](#7-verifica-funzionamento)
8. [Risoluzione problemi](#8-risoluzione-problemi)

---

## 1. Prerequisiti

Prima di iniziare, assicurati di avere:

- Un account email valido
- Accesso a internet
- Il codice sorgente di **tcr-notes** scaricato sul tuo computer

---

## 2. Creazione del progetto Supabase

### Passo 2.1 — Registrazione

1. Apri il browser e vai su [https://supabase.com](https://supabase.com)
2. Clicca sul pulsante **"Start your project"** o **"Sign In"**
3. Registrati con:
   - **GitHub** (consigliato — più veloce)
   - oppure con **email e password**

### Passo 2.2 — Nuovo progetto

1. Dalla dashboard di Supabase, clicca **"New Project"**
2. Compila i campi richiesti:

| Campo | Valore suggerito |
|-------|------------------|
| **Organization** | Lascia quella di default o creane una nuova |
| **Project name** | `tcr-notes` |
| **Database password** | Scegli una password sicura (salvala!) |
| **Region** | Seleziona la regione più vicina a te (es. `West Europe` per l'Italia) |

3. Clicca **"Create new project"**
4. ⏳ Attendi il provisioning del database (indicatore verde in alto a sinistra)

> ⚠️ **IMPORTANTE:** Salva la password del database in un posto sicuro. Non potrai più vederla dopo questa schermata.

---

## 3. Configurazione del database

### Passo 3.1 — Aprire l'SQL Editor

1. Dal menu laterale sinistro, clicca su **"SQL Editor"**
2. Clicca **"New query"**
3. Si apre un editor di testo con un pulsante **"Run"** in basso a destra

### Passo 3.2 — Creare le tabelle

1. Copia l'intero contenuto del file [`supabase-setup.sql`](./supabase-setup.sql) presente nella cartella del progetto
2. Incollalo nell'editor di Supabase
3. Clicca **"Run"**

Il risultato atteso è una serie di messaggi verdi di conferma:
```
Success. No rows returned
```

### Passo 3.3 — Verifica tabelle create

1. Dal menu laterale, vai su **"Table Editor"**
2. Dovresti vedere tre tabelle:
   - ✅ `titles`
   - ✅ `chapters`
   - ✅ `history`

Se le tabelle non compaiono, ricarica la pagina o ripeti il Passo 3.2.

---

## 4. Abilitazione Realtime

Il Realtime permette alla app di ricevere aggiornamenti istantanei quando un altro utente modifica qualcosa.

### Passo 4.1 — Verifica Realtime attivo

1. Dal menu laterale, vai su **"Database"** → **"Replication"**
2. Clicca sulla scheda **"Source"**
3. Verifica che ci sia una riga con:
   - **Source:** `supabase_realtime`
   - **Status:** `Enabled`

Se non è abilitato, clicca su **"Enable realtime"**.

### Passo 4.2 — Aggiungere tabelle al Realtime

1. Nella stessa pagina **Replication**, clicca sulla scheda **"Tables"**
2. Cerca `titles` e `chapters` nella lista
3. Per ogni tabella, clicca sull'interruttore a sinistra per abilitarla

> Alternativa via SQL (se l'interruttore non funziona):
> ```sql
> ALTER PUBLICATION supabase_realtime ADD TABLE public.titles;
> ALTER PUBLICATION supabase_realtime ADD TABLE public.chapters;
> ```

### Passo 4.3 — Verifica finale Realtime

Le tabelle abilitate devono avere l'icona verde accanto. Se vedi il simbolo ⚡, il Realtime è attivo.

---

## 5. Recupero credenziali API

Queste credenziali permettono all'app di comunicare con il tuo database Supabase.

### Passo 5.1 — Project Settings

1. Clicca sull'icona **⚙️ (Settings)** in basso a sinistra nel menu laterale
2. Dal sottomenu, seleziona **"API"**

### Passo 5.2 — Copia i valori

Nella sezione **Project API keys**, troverai:

| Valore | Dove si trova | Esempio |
|--------|--------------|---------|
| **Project URL** | Prima riga, sotto "Project URL" | `https://abcdefgh12345678.supabase.co` |
| **anon public** | Sotto "Project API keys" | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

1. Clicca il pulsante **"Copy"** accanto a **Project URL**
2. Incollalo in un file temporaneo (es. Blocco Note)
3. Clicca il pulsante **"Copy"** accanto alla chiave **anon public**
4. Incollala nello stesso file temporaneo

> 🔒 **Sicurezza:** La chiave `anon` è pubblica — può essere inclusa nel codice frontend. Non condividerla pubblicamente se non necessario.

---

## 6. Configurazione file .env

### Passo 6.1 — Creare il file

1. Nella cartella principale del progetto `tcr-notes/`, crea un file chiamato `.env`
2. Se stai usando Windows, assicurati che il file si chiami esattamente `.env` (con il punto iniziale)

### Passo 6.2 — Inserire le credenziali

Apri il file `.env` con un editor di testo e incolla:

```env
VITE_SUPABASE_URL=https://TUO-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

Sostituisci i valori con quelli copiati al Passo 5.2.

**Esempio reale:**
```env
VITE_SUPABASE_URL=https://abcdefgh12345678.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoMTIzNDU2Nzg...
```

### Passo 6.3 — Verifica

1. Salva il file `.env`
2. Assicurati che sia nella stessa cartella di `package.json` e `vite.config.js`
3. **Non aggiungere questo file a Git** — è già escluso dal `.gitignore`

---

## 7. Verifica funzionamento

### Passo 7.1 — Installazione dipendenze

Apri il terminale nella cartella del progetto ed esegui:

```bash
npm install
```

### Passo 7.2 — Avvio in locale

```bash
npm run dev
```

L'app dovrebbe aprirsi automaticamente su `http://localhost:5173`

### Passo 7.3 — Test sincronizzazione

1. Apri l'app in **due finestre del browser diverse** (o in una finestra normale e una in incognito)
2. Accedi con lo stesso account o con account diversi
3. Crea un titolo nella prima finestra
4. Verifica che il titolo appaia istantaneamente nella seconda finestra
5. Crea un capitolo e scrivi del testo
6. Verifica che il testo si sincronizzi tra le due finestre

Se tutto funziona, la configurazione Supabase è completata! ✅

---

## 8. Risoluzione problemi

### ❌ "Failed to fetch" o "Network Error"

| Causa | Soluzione |
|-------|-----------|
| URL errato | Verifica che `VITE_SUPABASE_URL` sia corretto nel `.env` |
| Chiave errata | Verifica che `VITE_SUPABASE_ANON_KEY` sia la chiave `anon public`, non `service_role` |
| Progetto in pausa | Vai su Supabase → Dashboard → riattiva il progetto |

### ❌ Le tabelle non esistono

| Causa | Soluzione |
|-------|-----------|
| Query non eseguita | Riesegui il file `supabase-setup.sql` nell'SQL Editor |
| Schema errato | Assicurati che le tabelle siano nel schema `public` |

### ❌ Non vedo le modifiche in tempo reale

| Causa | Soluzione |
|-------|-----------|
| Realtime disabilitato | Vai su Database → Replication → abilita `titles` e `chapters` |
| Connessione persa | Ricarica la pagina e riaccedi |
| Progetti diversi | Assicurati che tutti usino lo stesso `VITE_SUPABASE_URL` |

### ❌ "Row Level Security" blocca le operazioni

Se vedi errori RLS, le policy nel file SQL potrebbero non essere state applicate. Esegui questa query nell'SQL Editor:

```sql
CREATE POLICY "Allow all" ON public.titles FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON public.chapters FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON public.history FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
```

---

## 📎 Riferimenti rapidi

| File | Scopo |
|------|-------|
| `supabase-setup.sql` | Query SQL per creare tabelle e policy |
| `.env` | Contiene le credenziali API (non committare!) |
| `.env.example` | Template del file `.env` |

---

**Guida scritta per tcr-notes v0.2.4** — autore PiBOH
