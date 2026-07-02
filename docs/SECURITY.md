# 🔒 Security Policy — tcr-notes

## Versione supportata

| Versione | Supportata |
|----------|------------|
| 0.2.x    | ✅ Sì |
| < 0.2.0  | ❌ No |

## Segnalazione di vulnerabilità

Se scopri una vulnerabilità di sicurezza all'interno di **tcr-notes**, ti preghiamo di segnalarla in modo responsabile.

### Come segnalare

1. **Non aprire una issue pubblica** su GitHub per problemi di sicurezza.
2. Invia una email all'autore del progetto descrivendo:
   - La natura della vulnerabilità
   - I passi per riprodurla
   - Eventuali impatti potenziali
   - Suggerimenti per la mitigazione (se disponibili)

### Cosa aspettarsi

- Conferma di ricezione entro **5 giorni lavorativi**
- Aggiornamenti sullo stato della segnalazione
- Riconoscimento pubblico (se desiderato) dopo la risoluzione

## Buone pratiche per gli utenti

- **Non condividere la password di classe** con soggetti esterni alla classe 1FT
- **Non committare mai il file `.env`** contenente le chiavi Supabase
- **Aggiornare regolarmente** la lista degli utenti autorizzati e bannati
- **Effettuare backup periodici** dei dati tramite la funzione Export JSON

## Limitazioni di sicurezza

- L'app utilizza la chiave `anon` di Supabase, che è pubblica nel frontend
- Le policy RLS (Row Level Security) sono configurate in modalità aperta per consentire l'accesso anonimo della classe
- In ambienti di produzione con dati sensibili, si consiglia di implementare autenticazione utente lato server

---

**tcr-notes v0.2.4** — autore PiBOH
