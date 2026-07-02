/* ============================================================
   LISTA UTENTI AUTORIZZATI — src/data/authorized.js
   ============================================================

   Formato identificativi: cognome.nome (tutto minuscolo, senza spazi)
   Esempio: per "Rossi Mario" -> "rossi.mario"
   Esempio doppio nome: per "De Luca Anna Maria" -> "deluca.annamaria"
   Esempio triplo nome: per "Mardarie Denis Andrei Florin" -> "mardarie.denisandreiflorin"

   ISTRUZIONI per aggiungere un utente:
   1. Scrivi il cognome seguito da punto seguito dal nome (o nomi attaccati)
   2. Tutto minuscolo, nessuno spazio, nessun accento
   3. Ogni elemento deve essere separato da una virgola
   4. L'ultimo elemento NON deve avere la virgola finale

   ESEMPIO CORRETTO:
     export const AUTHORIZED = [
       "rossi.mario",
       "bianchi.luca",
       "verdi.giulia",
     ];

   NOTA: se lasci l'array vuoto ([]), TUTTI gli studenti con la
   password corretta potranno accedere (modalità classe aperta).
   Se inserisci anche un solo nome, SOLO quelli nella lista
   potranno accedere (modalità whitelist).
   ============================================================ */

export const AUTHORIZED = [
  "bonaldo.pietro",
  "aluisio.gabriele",
  "bianco.nicola",
  "mardarie.denisandreiflorin",
  "mollo.michele",
  "cecchetto.jacopo",
];
