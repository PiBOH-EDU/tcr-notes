# ⚠️ Limitazioni — Servizi Esterni Pubblici

> Questo documento elenca tutte le limitazioni tecniche, operative e di servizio derivanti dall'utilizzo di piattaforme esterne gratuite per il funzionamento di **tcr-notes**.

---

## 📋 Indice

1. [Supabase (Database + Realtime)](#1-supabase-database--realtime)
2. [Vercel (Hosting)](#2-vercel-hosting)
3. [Browser / Client](#3-browser--client)
4. [Limitazioni di sicurezza](#4-limitazioni-di-sicurezza)
5. [Cosa NON è garantito](#5-cosa-non-è-garantito)
6. [Raccomandazioni](#6-raccomandazioni)

---

## 1. Supabase (Database + Realtime)

### Piano Gratuito (Free Tier)

tcr-notes si appoggia al **piano gratuito** di Supabase. Questo comporta i seguenti vincoli:

| Limite | Valore | Impatto |
|--------|--------|---------|
| **Database size** | 500 MB | Al raggiungimento del limite, le scritture falliscono |
| **Bandwidth** | 2 GB/mese | Eccessivo traffico realtime può esaurirlo |
| **API requests** | ~100.000/mese | Chiamate massive in batch possono superarlo |
| **Realtime connections** | 200 simultanee | Max 200 utenti connessi contemporaneamente |
| **Realtime messages** | ~2.000.000/mese | Broadcast "typing" frequente consuma il budget |
| **Row Level Security (RLS)** | Policy aperte | Chiunque con la chiave `anon` può leggere/scrivere |
| **Backup automatici** | Non inclusi | I dati non vengono backuppati automaticamente da Supabase |
| **Inattività progetto** | Pausa dopo 7 giorni | Il progetto va in pausa se inattivo; richiede riattivazione manuale |
| **Rate limiting** | Presente | Troppo traffico in poco tempo blocca temporaneamente le richieste |

### Realtime

- La sincronizzazione in tempo reale dipende dalla connessione internet di ciascun utente.
- In caso di disconnessione momentanea, le modifiche possono non essere ricevute fino al refresh della pagina.
- Il broadcast "chi sta scrivendo" ha un ritardo di ~1-2 secondi e può non essere affidabile al 100%.

### Database

- Le tabelle utilizzano policy RLS aperte (`Allow all`) per permettere l'accesso anonimo della classe. Questo significa che **chiunque conosca la chiave `anon`** (pubblica nel codice) può teoricamente leggere e modificare i dati.
- Non è implementata l'autenticazione utente lato server (OAuth, JWT session, ecc.).
- La chiave `service_role` non deve MAI essere esposta nel frontend — se lo fosse, chiunque avrebbe accesso totale.

---

## 2. Vercel (Hosting)

Se l'app è deployata su Vercel (piano gratuito):

| Limite | Valore | Impatto |
|--------|--------|---------|
| **Build time** | 45 minuti | Build troppo lunghe falliscono |
| **Function duration** | 10 secondi (Hobby) | API serverless timeout rapido |
| **Function memory** | 1024 MB | Limita elaborazioni pesanti |
| **Bandwidth** | 100 GB/mese | Traffico elevato può esaurirlo |
| **Team members** | 1 (Hobby) | Solo l'owner può gestire il deploy |
| **Deployment rollbacks** | Limitati | Non è garantito un numero illimitato di rollback |

- Il piano gratuito non include SLA (Service Level Agreement) — l'app può essere offline senza preavviso.
- Le funzioni serverless "dormono" dopo inattività: il primo accesso dopo un po' può essere lento (cold start).

---

## 3. Browser / Client

- **localStorage**: ha un limite di ~5-10 MB per dominio. I dati possono essere cancellati dall'utente o dal browser in qualsiasi momento.
- **IndexedDB / Cache**: può essere svuotata dal browser o dalle impostazioni privacy.
- **Immagini base64**: le immagini caricate inline occupano spazio nel database (ogni carattere base64 = ~1.37 byte). Immagini grandi possono esaurire rapidamente i 500 MB di Supabase.
- **Connessione internet**: senza connessione, l'app non funziona (non è un'app offline/PWA).

---

## 4. Limitazioni di sicurezza

- **Nessuna crittografia end-to-end**: i dati viaggiano in chiaro tra client e Supabase (HTTPS sì, ma il contenuto è leggibile da Supabase).
- **Nessun audit log**: non è tracciato chi ha fatto cosa e quando in modo dettagliato.
- **Password di classe condivisa**: chiunque conosca `Barsanti1FT` può tentare l'accesso (se non bannato e se la whitelist è vuota).
- **Client-side validation**: i controlli su `authorized.js` e `banned.js` sono nel codice frontend — un utente esperto potrebbe bypassarli (la vera sicurezza è la password + whitelist).

---

## 5. Cosa NON è garantito

❌ **Persistenza dei dati a tempo indeterminato** — Supabase o Vercel possono chiudere il servizio, cancellare il progetto inattivo, o modificare i termini del piano gratuito.

❌ **Disponibilità 24/7** — i servizi gratuiti non hanno garanzie di uptime. L'app può essere offline per manutenzione dei provider.

❌ **Backup automatici** — non è previsto alcun backup automatico. È responsabilità degli utenti esportare regolarmente i dati in JSON.

❌ **Supporto tecnico** — non esiste un help desk. Eventuali problemi vanno segnalati tramite GitHub Issues.

❌ **Scalabilità** — l'architettura è pensata per una classe di ~30 studenti, non per centinaia di utenti simultanei.

❌ **Recupero dati cancellati** — se un titolo/capitolo viene eliminato, non c'è un cestino. La cronologia salva solo il contenuto testuale, non la struttura.

❌ **Riservatezza dei contenuti** — gli appunti sono visibili a tutti i membri della classe. Non inserire dati personali, numeri di telefono, indirizzi o informazioni sensibili.

---

## 6. Raccomandazioni

- ✅ **Esporta regolarmente** i dati in JSON dalla dashboard.
- ✅ **Non caricare immagini troppo grandi** — preferisci link esterni (Imgur, ecc.) se possibile.
- ✅ **Monitora lo spazio** su Supabase Dashboard → Database → Size.
- ✅ **Riattiva il progetto** su Supabase se va in pausa per inattività.
- ✅ **Non condividere la password di classe** con soggetti esterni.

---

**tcr-notes** — autore PiBOH
