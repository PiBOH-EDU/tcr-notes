```
    _   _____ _____ _____ _   _ ____ _____ ___  _   _ _____ _
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

## 🔧 Configurazione

Per la configurazione completa di Supabase (tabelle, Realtime, credenziali, `.env`), consulta la [**GUIDA-SUPABASE.md**](./docs/GUIDA-SUPABASE.md).

Per configurare l'upload delle immagini via imgBB, consulta la [**GUIDA-IMGBB.md**](./docs/GUIDA-IMGBB.md).

> ⚠️ Prima di iniziare, leggi anche [**docs/LIMITATIONS.md**](./docs/LIMITATIONS.md) per conoscere i vincoli del piano gratuito.

---

## 🖥️ Avvio in locale

```bash
npm install
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
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Clicca **Deploy**

---

## 👥 Gestione utenti

Gli utenti si gestiscono nei file:

- [`src/data/authorized.js`](./src/data/authorized.js) — lista degli autorizzati
- [`src/data/banned.js`](./src/data/banned.js) — lista dei bannati

**Formato:** `cognome.nome` (tutto minuscolo, senza spazi).

| Nome reale | Identificativo |
|------------|----------------|
| Rossi Mario | `rossi.mario` |
| Bianchi Ginevra Anna | `bianchi.ginevraanna` |

> Se `AUTHORIZED` è vuoto (`[]`), chiunque con la password può accedere.

---

## 🛠️ Troubleshooting

Problemi comuni:

- **Schermata bianca** → riavvia il server dopo aver creato/modificato `.env` (`npm run dev`). Vite legge le variabili solo all'avvio.
- **Errori Supabase** → verifica tabelle e credenziali nella [GUIDA-SUPABASE.md](./docs/GUIDA-SUPABASE.md).
- **Upload immagini non funziona** → controlla la [GUIDA-IMGBB.md](./docs/GUIDA-IMGBB.md).
- **Realtime non funziona** → controlla che tutti usino lo stesso progetto Supabase.

Per la risoluzione dettagliata, vedi la [GUIDA-SUPABASE.md](./GUIDA-SUPABASE.md).

---

## 📄 Documentazione

| File | Contenuto |
|------|-----------|
| [`docs/MANUAL.md`](./docs/MANUAL.md) | Manuale utente completo |
| [`docs/GUIDA-SUPABASE.md`](./docs/GUIDA-SUPABASE.md) | Configurazione passo-passo del backend |
| [`docs/GUIDA-IMGBB.md`](./docs/GUIDA-IMGBB.md) | Configurazione upload immagini su imgBB |
| [`docs/SECURITY.md`](./docs/SECURITY.md) | Policy di sicurezza |
| [`docs/DISCLAIMER.md`](./docs/DISCLAIMER.md) | Avvertenza legale |
| [`docs/LIMITATIONS.md`](./docs/LIMITATIONS.md) | Limitazioni dei servizi esterni |
| [`CHANGELOG.md`](./CHANGELOG.md) | Storia delle versioni |

---

## 📄 Licenza

Vedi il file [LICENSE](https://raw.githubusercontent.com/PiBOH-EDU/tcr-notes/refs/heads/main/LICENSE).

---

**Versione 0.6.6** — autore PiBOH
