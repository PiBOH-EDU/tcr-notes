# Informativa sulla Privacy (Privacy Policy)

> **App:** tcr-notes  
> **Versione:** 0.9.0  
> **Data ultimo aggiornamento:** 05/07/2026  
> **Titolare del trattamento:** Docente referente della classe 1FT — ITT "Barsanti" (A.S. 2025/2026)

---

## 1. Introduzione

La presente informativa descrive come vengono raccolti, utilizzati, conservati e protetti i dati personali degli utenti che accedono e utilizzano l'applicazione web **tcr-notes** (di seguito "l'App").

L'App è uno strumento didattico interno, destinato esclusivamente agli studenti della classe 1FT dell'ITT "Barsanti". Non è un servizio pubblico: l'accesso è consentito solo agli utenti autorizzati previa verifica dell'identità e inserimento di una password di classe.

---

## 2. Titolare del trattamento

Il Titolare del trattamento dei dati è il **docente referente del progetto** (di seguito "il Titolare"), quale responsabile dell'iniziativa didattica.

**Contatto per privacy:**  
Per esercitare i diritti previsti dal GDPR o per qualsiasi domanda relativa alla privacy, gli studenti possono rivolgersi direttamente al docente referente in sede scolastica o tramite i canali istituzionali della scuola.

---

## 3. Dati personali raccolti

L'App raccoglie e tratta le seguenti categorie di dati:

### 3.1 Dati di accesso (forniti dall'utente)

| Dato | Descrizione | Finalità |
|------|-------------|----------|
| **Identificativo normalizzato** | Stringa nel formato `cognome.nome` (es. `rossi.mario`), generata automaticamente dai campi "Nome" e "Cognome" inseriti al login. | Autenticazione, verifica autorizzazione, attribuzione delle modifiche agli appunti. |
| **Nome e cognome reali** | Inseriti opzionalmente dall'amministratore nella tabella Supabase (`nome_reale`). | Solo per uso amministrativo interno; **non visibili** nell'interfaccia pubblica dell'App. |

### 3.2 Dati di contenuto (generati dall'utente)

| Dato | Descrizione | Finalità |
|------|-------------|----------|
| **Appunti e testi** | Contenuti scritti dagli studenti nei capitoli degli appunti. | Condivisione didattica dei materiali tra i membri della classe. |
| **Immagini** | Immagini caricate tramite la toolbar markdown. | Integrazione visiva negli appunti. Le immagini vengono ospitate su imgBB e sono pubblicamente raggiungibili tramite URL. |
| **Cronologia modifiche** | Versioni precedenti dei testi, con indicazione dell'autore e della data/ora. | Tracciabilità delle modifiche e recupero di versioni precedenti. |

### 3.3 Dati tecnici e di navigazione (raccolti automaticamente)

| Dato | Descrizione | Fonte |
|------|-------------|-------|
| Indirizzo IP | Indirizzo di rete del dispositivo. | Server Supabase (log di sistema) e Vercel (hosting). |
| User-Agent | Informazioni sul browser e sul sistema operativo. | Server Vercel (log di accesso). |
| Timestamp | Data e ora delle operazioni. | Server Supabase (colonne `created_at`, `updated_at`). |

> **Nota:** i dati tecnici non vengono utilizzati per profilazione o marketing, ma solo per fini di sicurezza, diagnostica e funzionamento del servizio.

---

## 4. Finalità del trattamento

I dati personali sono trattati per le seguenti finalità:

1. **Autenticazione e autorizzazione:** verificare che l'utente sia uno studente della classe 1FT autorizzato all'accesso.
2. **Erogazione del servizio:** consentire la lettura, scrittura, modifica e condivisione degli appunti in tempo reale.
3. **Attribuzione delle modifiche:** indicare chi ha scritto o modificato un determinato contenuto (colonna `last_edited_by`).
4. **Sicurezza e integrità:** prevenire accessi non autorizzati e garantire la stabilità del sistema.
5. **Adempimenti legali:** gestire eventuali richieste da parte delle autorità competenti.

---

## 5. Base giuridica del trattamento

Il trattamento dei dati si basa su:

- **Art. 6, par. 1, lett. b) del GDPR:** il trattamento è necessario per l'esecuzione di un contratto o per l'esecuzione di misure precontrattuali adottate su richiesta dell'interessato (adesione volontaria all'iniziativa didattica di condivisione degli appunti).
- **Art. 6, par. 1, lett. f) del GDPR:** il trattamento è necessario per il perseguimento del legittimo interesse del Titolare (gestione di un'attività didattica interna alla scuola).

L'accesso all'App è **volontario**: lo studente non è obbligato a utilizzarla, ma se decide di farlo deve fornire i dati necessari all'autenticazione.

---

## 6. Periodo di conservazione

| Categoria di dato | Periodo di conservazione | Criterio |
|-------------------|--------------------------|----------|
| Identificativo e ruolo | Fino alla fine dell'anno scolastico 2025/2026, salvo rinnovo. | Durata dell'iniziativa didattica. |
| Appunti e contenuti | Fino a richiesta di cancellazione o fine anno scolastico. | Necessità didattica. |
| Cronologia modifiche | Massimo 50 versioni per capitolo (sovrascritte automaticamente). | Politica interna di retention. |
| Log tecnici | 7 giorni (Vercel) / variabile (Supabase). | Policy dei fornitori di hosting. |

Al termine del periodo di conservazione, i dati personali saranno cancellati o resi anonimi, salvo obblighi legali diversi.

---

## 7. Condivisione dei dati e subfornitori

I dati personali non vengono venduti, ceduti o comunicati a terzi per scopi di marketing.

Tuttavia, per il funzionamento tecnico dell'App, i dati vengono elaborati dai seguenti subfornitori (responsabili del trattamento ai sensi dell'art. 28 GDPR):

| Subfornitore | Servizio | Sede | Dati trattati | Privacy Policy |
|--------------|----------|------|---------------|----------------|
| **Supabase Inc.** | Database, autenticazione anonima, Realtime | Stati Uniti | Identificativi, contenuti, cronologia, log tecnici. | [supabase.com/privacy](https://supabase.com/privacy) |
| **Vercel Inc.** | Hosting frontend, CDN | Stati Uniti | Log di accesso (IP, User-Agent, timestamp). | [vercel.com/legal/privacy-policy](https://vercel.com/legal/privacy-policy) |
| **imgBB (by ImageBB / Sirena Software)** | Hosting immagini | Stati Uniti | Immagini caricate dagli utenti (pubbliche via URL). | [imgbb.com/privacy](https://imgbb.com/privacy) |
| **GitHub Inc.** | Hosting repository codice sorgente | Stati Uniti | Solo codice sorgente e documentazione (nessun dato personale degli studenti). | [github.com/privacy](https://github.com/privacy) |

> ⚠️ **Nota sui trasferimenti extra-UE:** i subfornitori indicati hanno sede negli Stati Uniti. I trasferimenti di dati si basano sulle Clausole Contrattuali Standard (SCC) approvate dalla Commissione Europea, integrate nei contratti dei rispettivi fornitori.

---

## 8. Diritti degli interessati

Ai sensi degli artt. 15-22 del GDPR, lo studente (o il suo esercitante la potestà genitoriale, se minorenne) ha diritto di:

1. **Accesso (art. 15):** ottenere la conferma che sia in corso un trattamento dei propri dati e, in tal caso, accedervi.
2. **Rettifica (art. 16):** ottenere la rettifica dei dati personali inesatti o l'integrazione di quelli incompleti.
3. **Cancellazione ("diritto all'oblio", art. 17):** ottenere la cancellazione dei dati personali, salvo obblighi legali di conservazione.
4. **Limitazione del trattamento (art. 18):** ottenere la limitazione del trattamento nei casi previsti dalla legge.
5. **Portabilità (art. 20):** ricevere i propri dati in formato strutturato, di uso comune e leggibile da dispositivo automatico, o trasmetterli a un altro titolare.
6. **Opposizione (art. 21):** opporsi in qualsiasi momento al trattamento basato sul legittimo interesse.
7. **Reclamo (art. 77):** proporre reclamo all'Autorità Garante per la Protezione dei Dati Personali ([www.garanteprivacy.it](https://www.garanteprivacy.it)).

Per esercitare questi diritti, contatta il docente referente del progetto.

---

## 9. Cookie e tecnologie di memorizzazione locale

L'App **non utilizza cookie di profilazione o tracciamento**.

Utilizza esclusivamente **memorizzazione locale nel browser** (`localStorage`) per motivi di funzionalità e preferenze utente:

| Chiave | Contenuto | Scopo | Durata |
|--------|-----------|-------|--------|
| `tcr-theme` | `dark` o `light` | Memorizzare la preferenza del tema scuro/chiaro. | Permanente fino a cancellazione manuale. |
| `tcr-user` | Identificativo normalizzato (es. `rossi.mario`) | Mantenere la sessione di login. | Permanente fino a logout. |
| `tcr-auth` | `true` | Indicare che l'utente è autenticato. | Permanente fino a logout. |
| `tcr-role` | `editor` o `viewer` | Memorizzare il ruolo dell'utente. | Permanente fino a logout. |
| `tcr-docs-accepted` | `true` | Memorizzare l'accettazione dei documenti legali. | Permanente fino a cancellazione manuale. |
| `tcr-privacy-accepted` | `true` | Memorizzare l'accettazione della privacy policy. | Permanente fino a cancellazione manuale. |

Questi dati rimangono **esclusivamente sul dispositivo dell'utente** e non vengono trasmessi ai server se non per le finalità di autenticazione già descritte.

---

## 10. Misure di sicurezza

Il Titolare adotta le seguenti misure tecniche e organizzative per proteggere i dati personali:

- **Autenticazione a due fattori implicita:** oltre all'identificativo, è richiesta una password di classe condivisa solo tra gli studenti della 1FT.
- **Lista autorizzata (whitelist):** solo gli utenti inseriti nella tabella `utenti_autorizzati` di Supabase possono accedere.
- **Row Level Security (RLS):** il database Supabase è protetto da policy RLS che impediscono l'accesso diretto ai dati da parte di utenti non autorizzati.
- **Comunicazioni cifrate:** tutte le comunicazioni tra browser e server avvengono tramite protocollo HTTPS (TLS 1.2+).
- **Nessun dato personale nel codice sorgente:** nomi, cognomi e liste di studenti non sono presenti nel repository GitHub, ma gestiti esclusivamente su Supabase.
- **Backup:** i contenuti degli appunti possono essere esportati in formato JSON per backup locale.

---

## 11. Modifiche alla presente informativa

Il Titolare si riserva il diritto di aggiornare la presente informativa in qualsiasi momento, ad esempio in caso di modifiche legislative o di nuove funzionalità dell'App.

Le modifiche saranno pubblicate in questa pagina e, se significative, saranno comunicate agli utenti all'accesso successivo.

---

## 12. Accettazione

Utilizzando l'App, l'utente dichiara di aver letto, compreso e accettato la presente informativa sulla privacy.

---

*Documento redatto in conformità al Regolamento (UE) 2016/679 (GDPR) e al D.Lgs. 196/2003 (Codice Privacy) come modificato dal D.Lgs. 101/2018.*
