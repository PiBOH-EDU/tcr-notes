```
    _   _____ _____ _____ _   _ _____ _____ ___  _   _ _____ _
   / \ |_   _|_   _| ____| \ | |__  /|_ _|/ _ \| \ | | ____| |
  / _ \  | |   | | |  _| |  \| | / /  | || | | |  \| |  _| | |
 / ___ \ | |   | | | |___| |\  |/ /_  | || |_| | |\  | |___|_|
/_/   \_\|_|   |_| |_____|_| \_/____||___|\___/|_| \_|_____(_)

Questa è ancora una release di anteprima, solo pochi sono autorizzati ad utilizzare il sito.
```


# 📚 tcr-notes

Appunti collaborativi in tempo reale per la classe **1FT** dell'ITT "Barsanti" (A.S. 2025/2026).

> **The Catcher in the Rye** — gestione appunti scolastici con sincronizzazione istantanea tra tutti i membri della classe.

---

## ✨ Funzionalità

- 🌗 **Dark/Light Mode** con persistenza
- 🔐 **Login sicuro** con password di classe e controllo lista autorizzati/bannati
- ⚡ **Realtime** — modifica un capitolo e i tuoi compagni lo vedono istantaneamente
- ✍️ **Tracciamento "chi sta scrivendo"** — vedi in tempo reale chi sta modificando il testo
- 📁 **Struttura gerarchica** — Titoli → Capitoli → Contenuto
- 🕐 **Cronologia versioni** — ogni salvataggio crea una versione ripristinabile (max 50)
- 💾 **Export/Import JSON** — backup completo dei dati
- 🎨 **UI moderna** con React + Tailwind CSS

---

## 🚀 Requisiti

- [Node.js](https://nodejs.org/) 18+
- Account [Supabase](https://supabase.com/) (gratuito)
- Account [Vercel](https://vercel.com/) (opzionale, per il deploy)

---

## 🔧 Configurazione Supabase (passo-passo)

### 1. Crea un progetto Supabase

1. Vai su [supabase.com](https://supabase.com) e registrati/accedi
2. Clicca **"New Project"**
3. Scegli un nome (es. `tcr-notes`) e una password per il database
4. Attendi la fine del provisioning (circa 1-2 minuti)

### 2. Crea le tabelle

1. Dal menu laterale, vai su **SQL Editor** → **New query**
2. Incolla il contenuto del file [`supabase-setup.sql`](./supabase-setup.sql) presente in questo repository
3. Clicca **Run** — le tabelle `titles`, `chapters` e `history` verranno create automaticamente

### 3. Verifica il Realtime

1. Vai su **Database** → **Replication**
2. Assicurati che la tabella `titles` e `chapters` siano abilitate per il Realtime
3. Se non lo sono, vai in **SQL Editor** ed esegui:

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE public.titles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chapters;
```

### 4. Ottieni le credenziali API

1. Vai su **Project Settings** (icona ingranaggio in basso a sinistra)
2. Seleziona **API**
3. Copia questi due valori:
   - **Project URL** (es. `https://abcdefgh12345678.supabase.co`)
   - **anon public** API Key (es. `eyJhbGciOiJIUzI1NiIs...`)

### 5. Configura il file `.env`

Nella root del progetto, crea un file chiamato `.env`:

```env
VITE_SUPABASE_URL=https://TUO-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

> ⚠️ **Non committare mai il file `.env` su GitHub!** È già incluso nel `.gitignore`.

---

## 🖥️ Avvio in locale

```bash
# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev
```

L'app sarà disponibile su `http://localhost:5173`

---

## 🏗️ Build di produzione

```bash
npm run build
```

I file statici verranno generati nella cartella `dist/`.

---

## 🚀 Deploy su Vercel

1. Pusha il codice su GitHub
2. Vai su [vercel.com](https://vercel.com) → **Add New Project**
3. Importa il repository `tcr-notes`
4. In **Environment Variables**, aggiungi:
   - `VITE_SUPABASE_URL` → il tuo Project URL
   - `VITE_SUPABASE_ANON_KEY` → la tua anon key
5. Clicca **Deploy**

---

## 👥 Gestione utenti autorizzati e bannati

### Aggiungere un utente autorizzato

Apri il file [`src/data/authorized.js`](./src/data/authorized.js) e aggiungi l'identificativo nel formato:

```javascript
export const AUTHORIZED = [
  "rossi.mario",
  "bianchi.lucia",
  "verdi.antonio",
];
```

**Regole del formato:**
- Tutto in **minuscolo**
- **Cognome** seguito da **punto** seguito da **nome** (o nomi attaccati)
- **Nessuno spazio**, **nessun accento**

**Esempi pratici:**

| Nome reale | Identificativo |
|------------|----------------|
| Rossi Mario | `rossi.mario` |
| Bianchi Lucia | `bianchi.lucia` |
| Verdi Antonio | `verdi.antonio` |
| Bianchi Ginevra Anna | `bianchi.ginevraanna` |
| De Luca Marco Giuseppe | `deluca.marcogiuseppe` |

> **Nota:** se lasci `AUTHORIZED = []` (vuoto), **chiunque** con la password di classe potrà accedere.

### Bannare un utente

Apri il file [`src/data/banned.js`](./src/data/banned.js) e aggiungi allo stesso modo:

```javascript
export const BANNED = [
  "neri.giovanni",
];
```

Un utente bannato è **bloccato sempre**, anche se inserito in `authorized.js` o se conosce la password.

---

## 📂 Struttura del database

```
titles
├── id (UUID)
├── name (TEXT, unico)
└── created_at

chapters
├── id (UUID)
├── title_id (UUID → titles)
├── name (TEXT)
├── content (TEXT)
├── last_edited_by (TEXT)
├── updated_at
└── created_at

history
├── id (UUID)
├── chapter_id (UUID → chapters)
├── content (TEXT)
├── edited_by (TEXT)
└── created_at
```

---

## 🛠️ Troubleshooting

### L'app rimane bianca / non carica
- **Se hai appena creato o modificato il file `.env`, riavvia il server** (`Ctrl+C` poi `npm run dev`). Vite legge le variabili d'ambiente solo all'avvio: modificare il `.env` a server già attivo non ha effetto, e pulire cache/cronologia del browser non risolve, perché non è un problema del browser.
- Verifica che il file si chiami esattamente `.env` (su Windows l'estensione potrebbe essere nascosta e diventare `.env.txt`) e sia nella root del progetto, allo stesso livello di `package.json`.
- Verifica che contenga esattamente `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`, senza virgolette o spazi finali.
- Se il deploy è su Vercel, le stesse variabili vanno impostate anche lì (Project Settings → Environment Variables) seguite da un nuovo deploy.
- Controlla la console del browser (F12): dalla v0.2.4.1 un messaggio d'errore chiaro compare invece della pagina bianca se la configurazione Supabase non è valida.

### "Failed to fetch" o errori Supabase
- Verifica che le tabelle siano state create correttamente (SQL Editor)
- Controlla che le credenziali nel `.env` siano corrette

### Non vedo le modifiche in tempo reale degli altri
- Verifica che il Realtime sia abilitato per le tabelle `titles` e `chapters`
- Controlla che tutti gli utenti usino lo stesso progetto Supabase

### Errore "utente non autorizzato" nonostante il nome sia corretto
- Controlla che nel file `authorized.js` il nome sia scritto esattamente come viene generato dal login (`cognome.nome`, tutto minuscolo, senza spazi)

---

## 📄 Licenza

Vedi il file LICENSE [qui](https://raw.githubusercontent.com/PiBOH-EDU/tcr-notes/refs/heads/main/LICENSE)

---

**Versione 0.3.1** — autore PiBOH
