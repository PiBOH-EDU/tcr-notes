# Guida imgBB per tcr-notes

> **Per chi è questa guida?** Per chiunque non abbia mai usato imgBB o non sappia cosa sia un'API key. Passo dopo passo, senza dare nulla per scontato.

---

## Indice

1. [Cos'è imgBB e perché lo usiamo](#cosè-imgbb-e-perché-lo-usiamo)
2. [Prerequisiti](#prerequisiti)
3. [Passo 1: Creare un account imgBB](#passo-1-creare-un-account-imgbb)
4. [Passo 2: Ottenere la API Key](#passo-2-ottenere-la-api-key)
5. [Passo 3: Configurare il file .env](#passo-3-configurare-il-file-env)
6. [Passo 4: Testare l'upload](#passo-4-testare-lupload)
7. [Come funziona tecnicamente](#come-funziona-tecnicamente)
8. [Limiti del piano gratuito](#limiti-del-piano-gratuito)
9. [Troubleshooting](#troubleshooting)
10. [FAQ](#faq)
11. [Link utili](#link-utili)

---

## Cos'è imgBB e perché lo usiamo

**imgBB** è un servizio gratuito che permette di caricare immagini su Internet e ottenere un link (URL) pubblico per condividerle.

Nel progetto **tcr-notes** usiamo imgBB per due motivi:

1. **Le immagini non occupano spazio nel database Supabase** (che ha un limite di 500 MB).
2. **Le immagini non rallentano l'app**: prima venivano salvate direttamente nel testo degli appunti in formato base64 (un testo lunghissimo). Ora invece nel testo c'è solo un piccolo link, e l'immagine viene caricata da imgBB.

> 💡 **In parole povere**: invece di "incollare" l'immagine dentro l'appunto, la "appoggiamo" su imgBB e mettiamo solo il link.

---

## Prerequisiti

- Aver già configurato il file `.env` con i dati di Supabase (vedi `docs/GUIDA-SUPABASE.md`)
- Avere aperto il progetto in un editor di testo (VS Code, Notepad++, o qualsiasi altro)

---

## Passo 1: Creare un account imgBB

1. Apri il browser e vai su: **https://imgbb.com**
2. Clicca sul pulsante **"Sign up"** (o "Registrati") in alto a destra.
3. Puoi registrarti in tre modi:
   - Con **email e password**
   - Con **Google**
   - Con **Facebook**
4. Segui le istruzioni a schermo e conferma la tua email se richiesto.

> ✅ Una volta registrato, sarai loggato automaticamente.

---

## Passo 2: Ottenere la API Key

La **API Key** è come una "password segreta" che permette all'app tcr-notes di caricare immagini sul tuo account imgBB in automatico.

1. Vai su: **https://api.imgbb.com/**
   - Oppure, dal sito imgBB, clicca sul tuo nome utente in alto a destra → **"API"**.
2. Scorri la pagina fino alla sezione **"Get API Key"**.
3. Vedrai una casella con una stringa lunga di lettere e numeri, tipo:
   ```
   1234abcd5678efgh9012ijkl3456mnop
   ```
4. Clicca sul pulsante **"Copy"** (o selezionala e copiala con `Ctrl+C` / `Cmd+C`).

> ⚠️ **IMPORTANTE**: Tratta questa chiave come una password. Non condividerla in pubblico e non caricarla mai su GitHub. Il file `.env` è già protetto dal `.gitignore` per questo motivo.

---

## Passo 3: Configurare il file .env

Il file `.env` contiene tutte le "chiavi segrete" dell'app. Si trova nella cartella principale (root) del progetto, accanto a `package.json`.

1. Apri il file `.env` con il tuo editor di testo.
   - Se non esiste, crea un file nuovo chiamato esattamente `.env` (nota il punto all'inizio).
2. Aggiungi in fondo questa riga:
   ```env
   VITE_IMGBB_API_KEY=incolla_qui_la_tua_chiave
   ```
   Esempio:
   ```env
   VITE_SUPABASE_URL=https://tuoprogetto.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
   VITE_IMGBB_API_KEY=1234abcd5678efgh9012ijkl3456mnop
   ```
3. **Salva il file** (`Ctrl+S` / `Cmd+S`).

> 🔄 **RICORDA**: Vite (il sistema che fa girare l'app) legge il file `.env` solo quando parte. Se l'app era già avviata, devi fermarla (`Ctrl+C` nella console) e riavviarla con:
> ```bash
> npm run dev
> ```

---

## Passo 4: Testare l'upload

1. Avvia l'app (se non è già avviata):
   ```bash
   npm run dev
   ```
2. Accedi con le tue credenziali.
3. Apri un qualsiasi capitolo.
4. Clicca sul pulsante **"🌄 Img"** nella toolbar sopra l'editor.
5. Seleziona un'immagine dal tuo computer (deve essere **massimo 500 KB**).
6. Vedrai il pulsante cambiare in **"⏳ Caricamento..."** per qualche secondo.
7. Se tutto va bene, nel testo apparirà automaticamente qualcosa del tipo:
   ```markdown
   ![mia-immagine.png](https://i.ibb.co/xxxxxx/mia-immagine.png)
   ```
8. Passa alla modalità **"Rendering Markdown"** per vedere l'immagine visualizzata.

---

## Come funziona tecnicamente

Per i più curiosi, ecco cosa succede "dietro le quinte" quando premi il pulsante 🌄 Img:

1. **Selezione**: il browser apre la finestra di selezione file.
2. **Validazione**: l'app controlla che il file non superi i 500 KB.
3. **Lettura**: il browser legge l'immagine e la converte in una stringa base64 (un formato testuale molto lungo).
4. **Upload**: la stringa base64 viene inviata ai server di imgBB tramite la API Key.
5. **Risposta**: imgBB risponde con un URL pubblico (es. `https://i.ibb.co/xxxxxx/nome.png`).
6. **Inserimento**: l'app inserisce nel testo la sintassi markdown `![nome](url)`.

Tutto questo in 2-3 secondi.

---

## Limiti del piano gratuito

imgBB è gratuito, ma ha alcuni limiti da tenere a mente:

| Limite | Valore | Nota |
|--------|--------|------|
| **Dimensione max** | 32 MB per immagine | Noi limitiamo a 500 KB per sicurezza |
| **Formati supportati** | JPG, PNG, GIF, BMP, TIFF, WEBP | |
| **Durata immagini** | Non scadono (teoricamente) | imgBB si riserva di rimuovere immagini inattive da molto tempo |
| **Banda** | Illimitata | Puoi visualizzare l'immagine quante volte vuoi |
| **Account richiesto** | Sì | Serve la API key |

> ⚠️ **Attenzione**: imgBB è un servizio gratuito di terze parti. Non garantiamo che le immagini rimangano online per sempre. Per immagini molto importanti, conserva sempre una copia sul tuo computer.

---

## Troubleshooting

### ❌ "Chiave API imgBB mancante"
**Causa**: Non hai inserito `VITE_IMGBB_API_KEY` nel file `.env`, oppure hai dimenticato di riavviare il server.

**Soluzione**:
1. Controlla che nel file `.env` ci sia la riga `VITE_IMGBB_API_KEY=...`
2. Ferma il server (`Ctrl+C`) e riavvia (`npm run dev`).
3. Ricarica la pagina del browser.

---

### ❌ "Errore HTTP 400: Bad Request"
**Causa**: La chiave API è sbagliata, oppure l'immagine è in un formato non supportato.

**Soluzione**:
1. Verifica di aver copiato l'intera API key da https://api.imgbb.com/
2. Prova con un'altra immagine (JPG o PNG).
3. Controlla che l'immagine non sia corrotta.

---

### ❌ "File troppo grande! Dimensione massima: 500 KB"
**Causa**: L'immagine selezionata supera il limite di sicurezza impostato nell'app.

**Soluzione**:
1. Comprimi l'immagine con un servizio online (es. https://tinypng.com)
2. Oppure riduci le dimensioni dell'immagine con un editor (Paint, Photoshop, GIMP).

---

### ❌ L'immagine non si vede in modalità Rendering Markdown
**Causa**: Il link è stato inserito ma imgBB non ha ancora finito di processare l'immagine, oppure c'è un problema di rete.

**Soluzione**:
1. Aspetta 5-10 secondi e ricarica la pagina.
2. Clicca con il tasto destro sull'icona rotta → "Apri immagine in nuova scheda" per vedere se imgBB risponde.
3. Se il link inizia con `data:image/...` invece che `https://i.ibb.co/...`, significa che l'upload non è andato a buon fine e l'app ha inserito l'immagine in locale. Cancella quel testo e riprova.

---

### ❌ "Errore upload imgBB: ..."
**Causa**: imgBB potrebbe essere momentaneamente offline, oppure hai raggiunto un limite nascosto.

**Soluzione**:
1. Aspetta qualche minuto e riprova.
2. Controlla lo stato di imgBB su https://status.imgbb.com (se disponibile).
3. Se il problema persiste, puoi usare temporaneamente il metodo base64: apri l'immagine in un editor, convertila in base64 online, e incolla il link manualmente. Oppure segnala il problema su GitHub.

---

## FAQ

**D: Devo pagare per imgBB?**
R: No, il piano gratuito è sufficiente per l'uso scolastico di tcr-notes.

**D: Le immagini caricate sono pubbliche?**
R: Sì, chiunque abbia il link può vedere l'immagine. Non caricare foto personali, documenti sensibili o materiale coperto da copyright.

**D: Posso usare un altro servizio al posto di imgBB?**
R: Tecnicamente sì, ma richiede di modificare il codice in `src/lib/imgbb.js`. Se vuoi una guida per altri servizi (Imgur, Cloudinary, ecc.), apri una issue su GitHub.

**D: Cosa succede se cancello un'immagine da imgBB?**
R: Il link nell'appunto smetterà di funzionare e apparirà un'icona rotta. L'app non può sapere se un'immagine è stata cancellata.

**D: Perché il limite è 500 KB e non 32 MB?**
R: Per due motivi: (1) immagini più leggere = app più veloce, (2) evitiamo che qualcuno carichi file enormi per sbaglio.

---

## Link utili

- **Sito imgBB**: https://imgbb.com
- **Pagina API Key**: https://api.imgbb.com/
- **Guida Supabase** (per la configurazione del database): `docs/GUIDA-SUPABASE.md`
- **Segnala un problema**: https://github.com/PiBOH-EDU/tcr-notes/issues

---

> **Autore guida**: PiBOH  
> **Classe**: 1FT — ITT "Barsanti"  
> **A.S.**: 2025/2026
