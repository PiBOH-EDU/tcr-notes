# 📘 Manuale Utente — tcr-notes

> Guida completa all'uso dell'app per la classe **1FT** dell'ITT "Barsanti" (A.S. 2025/2026).
> Se non hai mai usato tcr-notes, inizia da qui.

---

## Indice

1. [Cos'è tcr-notes](#cosè-tcr-notes)
2. [Primo accesso](#primo-accesso)
3. [La Dashboard](#la-dashboard)
4. [L'Editor](#leditor)
5. [Formattare il testo (Toolbar)](#formattare-il-testo-toolbar)
6. [Salvataggio](#salvataggio)
7. [Annulla e Ripeti](#annulla-e-ripeti)
8. [Caricare immagini](#caricare-immagini)
9. [Esportare e Importare i dati](#esportare-e-importare-i-dati)
10. [Cronologia versioni](#cronologia-versioni)
11. [Tema scuro / chiaro](#tema-scuro--chiaro)
12. [Utenti online](#utenti-online)
13. [Menu Info](#menu-info)
14. [Scorciatoie da tastiera](#scorciatoie-da-tastiera)
15. [FAQ](#faq)

---

## Cos'è tcr-notes

**tcr-notes** è un'app per prendere e condividere appunti scolastici in tempo reale.

- Tutti i compagni della classe possono leggere e modificare gli stessi appunti contemporaneamente.
- Le modifiche si vedono istantaneamente (quasi come Google Docs).
- Gli appunti sono organizzati per **Titoli** (argomenti) e **Capitoli** (sotto-argomenti).
- Il libro di riferimento è *The Catcher in the Rye*.

---

## Primo accesso

### 1. Apri l'app
Vai all'indirizzo del sito (fornito dal professore o dall'autore).

### 2. Inserisci i tuoi dati
Nella schermata di login vedrai tre campi:

| Campo | Cosa scrivere | Esempio |
|-------|---------------|---------|
| **Nome/i** | Il tuo nome (o nomi, se ne hai più di uno). Tutto attaccato, minuscolo, senza accenti. | `mario`, `paologiuseppe` |
| **Cognome** | Il tuo cognome. Tutto attaccato, minuscolo, senza accenti. | `rossi` |
| **Password** | La password di classe (te la dirà il professore). | `[password-fornita-dal-professore]` |

> 💡 **Formato nome utente**: `cognome.nome` (es. `rossi.mario`). L'app lo crea automaticamente.

### 3. Accetta i documenti
Spunta la casella per confermare di aver letto `SECURITY.md` e `DISCLAIMER.md`. Dopo la prima volta, la casella rimarrà pre-selezionata.

### 4. Clicca "Accedi"
Se i tuoi dati sono corretti e sei nella lista degli autorizzati, entrerai nella **Dashboard**.

> ⚠️ **Problemi comuni**:
> - "Utente non autorizzato" → controlla di aver scritto nome e cognome correttamente (tutto minuscolo, senza spazi).
> - "Password errata" → la password è `Barsanti1FT` (attenzione alle maiuscole).

---

## La Dashboard

Una volta dentro, vedrai questa struttura:

```
┌─────────────────────────────────────────────┐
│  🍔  tcr-notes    👤 rossi.mario   ℹ️ Info  │  ← Header
├──────────┬──────────────────────────────────┤
│ TITOLI   │  Titolo > Capitolo selezionato   │
│          │                                  │
│ + Nuovo  │  [Editor o anteprima]            │
│          │                                  │
│ 📁 Analisi│  Status: ✅ Salvato              │
│   📄 Cap.1│                                  │
│   📄 Cap.2│                                  │
│ 📁 Temi  │                                  │
│   📄 Cap.1│                                  │
│          │                                  │
└──────────┴──────────────────────────────────┘
```

### Sidebar (a sinistra)
- Mostra tutti i **Titoli** (cartelle) e i **Capitoli** (fogli) dentro ogni titolo.
- Clicca su un capitolo per aprirlo nell'editor.
- **+ Nuovo Titolo**: crea un nuovo argomento.
- **+** accanto a un titolo: crea un nuovo capitolo dentro quel titolo.
- **✏️**: rinomina il titolo o capitolo.
- **🗑️**: elimina il titolo o capitolo (attento, non c'è cestino!).

> 📱 **Su mobile**: la sidebar è nascosta di default. Clicca l'icona 🍔 (hamburger) in alto a sinistra per aprirla.

### Area principale (a destra)
- Mostra il contenuto del capitolo selezionato.
- L'editor ha due modalità: **Testo piano** e **Rendering Markdown**.

---

## L'Editor

L'editor è il cuore dell'app. Qui scrivi e modifichi gli appunti.

### Due modalità

| Modalità | Come si attiva | A cosa serve |
|----------|----------------|--------------|
| **Rendering Markdown** | Toggle blu acceso | Vedi il testo formattato (grassetto, titoli, immagini, ecc.) |
| **Testo piano** | Toggle blu spento | Vedi il codice markdown grezzo con evidenziazione colorata |

#### Come switchare
- Clicca il **toggle** in alto a destra nella status bar (accanto a "Rendering Markdown" / "Testo piano").
- Oppure premi **Escape** quando sei in modalità editing per tornare alla preview.

### Cliccare nella preview per editare
Quando sei in **Rendering Markdown**, puoi cliccare direttamente su un punto del testo: l'app passerà automaticamente a **Testo piano** e posizionerà il cursore esattamente nel punto cliccato.

> 🖱️ Se clicchi su un **link**, si aprirà il link in una nuova scheda (non passerà in edit mode).

### Testo piano con evidenziazione
In modalità Testo piano, il testo è colorato per aiutarti a vedere la formattazione:

- `**grassetto**` → il testo dentro è in grassetto, gli asterischi sono visibili ma attenuati
- `~~barrato~~` → il testo dentro è barrato, le tilde sono visibili ma attenuate
- `<!-- commento -->` → tutto in penombra (serve per note private)

---

## Formattare il testo (Toolbar)

Quando sei in **Testo piano**, sopra l'editor appare una barra di strumenti:

| Pulsante | Effetto | Sintassi inserita |
|----------|---------|-------------------|
| **B** | Grassetto | `**testo**` |
| *I* | Corsivo | `*testo*` |
| ~~S~~ | Barrato | `~~testo~~` |
| H1 | Titolo grande | `# Titolo` |
| H2 | Titolo medio | `## Sottotitolo` |
| H3 | Titolo piccolo | `### Sezione` |
| • List | Elenco puntato | `- elemento` |
| 1. List | Elenco numerato | `1. elemento` |
| " Quote | Citazione | `> citazione` |
| `</>` | Blocco codice | \`\`\`codice\`\`\` |
| `code` | Codice inline | `` `codice` `` |
| Link | Link ipertestuale | `[testo](https://...)` |
| 🖼 Img | Carica immagine | `![nome](url)` |
| ⬅️ Sinistra | Allinea a sinistra | `<div align="left">...</div>` |
| ⬜ Centro | Allinea al centro | `<div align="center">...</div>` |
| ⬜ Destra | Allinea a destra | `<div align="right">...</div>` |

### Come usare la toolbar
1. Seleziona una parte di testo (o posiziona il cursore dove vuoi).
2. Clicca il pulsante desiderato.
3. Il testo selezionato verrà "avvolto" dalla sintassi markdown.
4. Se non hai selezionato nulla, verrà inserito un **placeholder** (es. `**grassetto**`) che puoi sostituire scrivendo.

---

## Salvataggio

Non devi preoccuparti troppo di salvare: l'app lo fa **automaticamente**.

### Autosave
- Dopo che smetti di scrivere, l'app aspetta **60 secondi** e poi salva automaticamente.
- Se chiudi la pagina prima che passino 60 secondi, le modifiche potrebbero non essere salvate.

### Salvataggio manuale
- Clicca il pulsante **💾 Salva** nella status bar.
- Oppure premi **Ctrl+S** (o **Cmd+S** su Mac).

### Indicatori di stato
Nella status bar in alto vedi lo stato del salvataggio:

| Indicatore | Significato |
|------------|-------------|
| ✅ **Salvato** | Tutto è salvato su Supabase |
| 📝 **Modificato** | Hai scritto qualcosa di nuovo, non ancora salvato |
| ⏳ **Salvataggio...** | Sto inviando i dati al server |

> 💡 Se non hai modificato nulla rispetto all'ultimo salvataggio, l'app **non invia alcuna richiesta** (risparmia banda).

---

## Annulla e Ripeti

Hai sbagliato a cancellare qualcosa? Nessun problema.

| Azione | Pulsante | Scorciatoia |
|--------|----------|-------------|
| **Annulla** | ↩ Annulla | `Ctrl+Z` |
| **Ripeti** | ↪ Ripeti | `Ctrl+Y` o `Ctrl+Shift+Z` |

L'app ricorda fino a **100 azioni** (puoi tornare indietro di 100 passi).

> ⚠️ Lo storico si azzera quando cambi capitolo.

---

## Caricare immagini

1. Clicca il pulsante **🖼 Img** nella toolbar.
2. Seleziona un'immagine dal tuo computer.
3. L'immagine deve essere **massimo 500 KB**.
4. L'app la carica su **imgBB** e inserisce automaticamente il link nell'appunto.

Il risultato sarà qualcosa del tipo:
```markdown
![mia-foto.jpg](https://i.ibb.co/xxxxxx/mia-foto.jpg)
```

> ⚠️ **Le immagini su imgBB sono pubbliche**. Non caricare foto personali, documenti sensibili o materiale coperto da copyright.

Se l'upload non funziona, controlla di aver configurato la API key di imgBB nel file `.env` (vedi [`GUIDA-IMGBB.md`](./GUIDA-IMGBB.md)).

---

## Esportare e Importare i dati

### Esporta (backup)
1. Clicca **"Esporta JSON"** nell'header (in alto a destra).
2. Verrà scaricato un file `.json` con TUTTI gli appunti, titoli, capitoli e cronologia.
3. Conservalo sul tuo computer come backup.

### Importa (ripristino)
1. Clicca **"Importa JSON"** nell'header.
2. Seleziona un file `.json` precedentemente esportato.
3. ⚠️ **ATTENZIONE**: l'importazione **sovrascrive** tutti i dati attuali. Usala con cautela.

> 💡 È buona norma esportare i dati una volta alla settimana.

---

## Cronologia versioni

Ogni volta che salvi, l'app memorizza la versione precedente.

- Puoi vedere fino a **50 versioni** di ogni capitolo.
- Per accedere alla cronologia: cerca la scheda **"Cronologia"** accanto a "Modifica" (se presente nell'interfaccia).
- Clicca su una versione precedente per vedere com'era il testo in quel momento.

> 💡 La cronologia è utile se qualcuno cancella accidentalmente qualcosa di importante.

---

## Tema scuro / chiaro

L'app usa il **tema scuro** di default.

- Per cambiare tema, cerca il pulsante 🌙/☀️ nell'header (se presente) o nelle impostazioni.
- La preferenza viene salvata nel browser (ricorderà il tuo tema anche se chiudi e riapri il sito).

---

## Utenti online

Nell'header vedi un pallino verde con un numero:

- Indica quanti compagni sono collegati in questo momento.
- Clicca sopra per vedere la lista dei nomi.

### "Sta scrivendo..."
Quando un compagno sta modificando un capitolo, vedrai comparire:
```
✍️ bianchi.lucia sta scrivendo...
```

Questo compare nella status bar sopra l'editor e scompare dopo 2 secondi che smette di scrivere.

---

## Menu Info

Clicca **ℹ️ Info** nell'header per aprire un menu con:

- **Versione** dell'app
- **Autore** (PiBOH)
- **Link alla documentazione**:
  - SECURITY.md
  - DISCLAIMER.md
  - LIMITATIONS.md
  - CODE OF CONDUCT.md
  - CHANGELOG.md
  - LICENSE
- **Feedback**: link per segnalare bug o richiedere funzionalità su GitHub

---

## Scorciatoie da tastiera

| Scorciatoia | Azione |
|-------------|--------|
| `Ctrl + S` | Salva manualmente |
| `Ctrl + Z` | Annulla |
| `Ctrl + Y` | Ripeti |
| `Ctrl + Shift + Z` | Ripeti (alternativa) |
| `Esc` | Torna alla preview Markdown (se in editing) |
| `Qualsiasi tasto` | Inizia a scrivere nella preview Markdown (entra in edit mode) |

> Su Mac, usa `Cmd` al posto di `Ctrl`.

---

## FAQ

**D: Ho chiuso la pagina senza salvare. Ho perso tutto?**
R: Se sono passati meno di 60 secondi dall'ultima modifica, potresti aver perso le modifiche più recenti. L'app salva automaticamente ogni minuto. Per sicurezza, premi `Ctrl+S` prima di chiudere.

**D: Posso usare tcr-notes dal telefono?**
R: Sì, l'app è responsive. Su mobile la sidebar diventa un menu a scomparsa (🍔). Alcune funzioni (Esporta/Importa) sono nascoste su schermi piccoli per risparmiare spazio.

**D: Un compagno ha cancellato i miei appunti!**
R: Controlla la **Cronologia** del capitolo: troverai le versioni precedenti e potrai copiare il testo perso. In futuro, esporta regolarmente i dati in JSON.

**D: Posso scrivere in italiano e inserire caratteri speciali?**
R: Sì, tutti i caratteri Unicode sono supportati. Per il login, però, usa solo lettere minuscole senza accenti e senza spazi.

**D: Cosa significa "Rendering Markdown"?**
R: Markdown è un linguaggio semplice per formattare il testo. In "Rendering Markdown" vedi il testo formattato (grassetto, titoli, immagini). In "Testo piano" vedi il codice sottostante (con `**` per il grassetto, ecc.).

**D: Le immagini che carico restano per sempre?**
R: Sono ospitate su imgBB (servizio gratuito). In teoria non scadono, ma imgBB si riserva di rimuovere immagini inattive da molto tempo. Non caricare nulla di cui non hai una copia di backup.

**D: Posso usare tcr-notes senza connessione internet?**
R: No, l'app richiede una connessione attiva per sincronizzarsi con Supabase.

**D: Cosa succede se il progetto Supabase va in pausa?**
R: Se il progetto è inattivo per 7 giorni, Supabase lo mette in pausa. Vedrai un banner rosso nell'app. Chiunque ha accesso al progetto Supabase può riattivarlo dalla dashboard di Supabase.

**D: Sono nella lista autorizzati ma non riesco ad entrare.**
R: Controlla di aver scritto nome e cognome esattamente come nella lista: tutto minuscolo, senza spazi, senza accenti. Se il tuo nome è "Mario Rossi", devi scrivere `rossi.mario`.

---

> **Autore manuale**: PiBOH  
> **Classe**: 1FT — ITT "Barsanti"  
> **A.S.**: 2025/2026  
> **Versione app**: 0.6.1
