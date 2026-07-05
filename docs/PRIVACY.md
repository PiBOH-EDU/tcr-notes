# 🔒 Informativa sulla Privacy (Privacy Policy) — tcr-notes

Benvenuto su **tcr-notes**, un'applicazione web collaborativa dedicata alla gestione in tempo reale degli appunti scolastici per la classe **1FT dell'ITT "Barsanti" (A.S. 2025/2026)** e per gli studenti promossi da questa classe che continuano a collaborare al progetto.

La trasparenza e la protezione dei tuoi dati sono fondamentali. In questa pagina ti spieghiamo in modo semplice e chiaro quali dati raccogliamo, come li usiamo e quali sono i tuoi diritti in base al Regolamento Europeo sulla Protezione dei Dati (GDPR).

---

## 1. Titolare del Trattamento
Il trattamento dei dati personali viene gestito internamente e in modo condiviso per fini esclusivamente didattici legati alle attività della classe.
* **Referente per la protezione dei dati / Amministratore:** [piboh.github@gmail.com]
* Per qualsiasi domanda, richiesta di modifica o cancellazione dei dati, puoi scrivere direttamente a questo indirizzo email.

---

## 2. Dati Personali Raccolti
L'applicazione riduce al minimo la raccolta di dati personali (principio di *minimizzazione* del GDPR). I dati trattati sono:
* **Identificativi per il login:** Per accedere non vengono utilizzati il tuo nome e cognome reali in chiaro all'interno del codice pubblico. Vengono usate stringhe pseudonimizzate, identificativi univoci o sistemi di hash che non permettono a utenti esterni di risalire direttamente alla tua identità reale.
* **Contenuti inseriti:** I testi degli appunti scolastici che scrivi e la cronologia delle modifiche associata al tuo account (necessaria per la funzione "chi sta scrivendo" e per il ripristino delle versioni precedenti).
* **Immagini caricate:** Eventuali immagini o schemi didattici che decidi di caricare all'interno degli appunti.

---

## 3. Finalità e Base Giuridica del Trattamento
I tuoi dati vengono raccolti e trattati unicamente per le seguenti finalità:
* **Scopi didattici:** Consentire lo studio e la collaborazione sui compiti e sui testi scolastici.
* **Funzionamento tecnico:** Permettere la sincronizzazione istantanea delle modifiche tra i compiti dei vari compagni e monitorare lo stato dell'applicazione.

La **base giuridica** di questo trattamento è l'esecuzione di un'attività di natura didattica e formativa, unita al legittimo interesse del gruppo classe di utilizzare uno strumento digitale collaborativo sicuro.

---

## 4. Servizi Terzi e Trasferimento Dati
L'applicazione è sviluppata con React e Tailwind CSS ed è un'architettura decentralizzata che si appoggia ad alcuni servizi esterni per poter funzionare. Di conseguenza, i dati sopra elencati transitano o vengono ospitati sui server dei seguenti fornitori:

* **Supabase:** Utilizzato per la gestione del database sicuro, dell'autenticazione degli utenti e della sincronizzazione Realtime del testo.
* **imgBB:** Utilizzato come spazio di hosting esterno per salvare le immagini che decidi di caricare nell'applicazione.
* **Vercel:** Utilizzato per l'hosting del sito web e per la pubblicazione online (deploy) dell'interfaccia grafica dell'applicazione.

Ognuno di questi servizi adotta le proprie misure di sicurezza e policy di protezione dati.

---

## 5. Periodo di Conservazione dei Dati
I dati raccolti non saranno conservati per sempre. Verranno mantenuti solo per il tempo strettamente necessario a completare le attività didattiche del ciclo di studi corrente:
* I dati verranno conservati fino al termine dell'anno scolastico 2025/2026 o, per gli studenti promossi che proseguono la collaborazione, fino alla conclusione naturale del progetto o alla sua dismissione.
* In caso di dismissione, tutti i dati personali e i log verranno eliminati permanentemente dai database.

---

## 6. Diritti degli Utenti (GDPR)
In quanto utente del servizio e interessato al trattamento, il GDPR ti garantisce i seguenti diritti, che puoi esercitare in qualsiasi momento inviando un'email a `[piboh.github@gmail.com]`:
* **Diritto di Accesso:** Puoi chiedere di sapere quali dati personali sono memorizzati nel sistema e associati a te.
* **Diritto di Rettifica:** Puoi richiedere la correzione di dati inesatti o l'aggiornamento di informazioni obsolete.
* **Diritto alla Cancellazione (Diritto all'Oblio):** Puoi richiedere l'eliminazione definitiva del tuo profilo e dei tuoi dati di accesso.
* **Diritto di Opposizione:** Puoi opporti in qualsiasi momento al trattamento dei tuoi dati per motivi legati alla tua situazione particolare.

---

## 7. Nota Importante sulla Sicurezza del Repository GitHub
Questo codice sorgente è ospitato all'interno di un repository pubblico su GitHub per permettere la trasparenza dello sviluppo. 

**Nessun dato personale sensibile, lista di nomi e cognomi reali, registro o informazione personale in chiaro degli studenti viene inserita o memorizzata nei file di codice sorgente pubblici.** 
Le liste di autorizzazione o di controllo degli accessi utilizzano criteri di pseudonimizzazione o sono protette da variabili d'ambiente protette e configurazioni server-side sul database di Supabase non accessibili al pubblico.
