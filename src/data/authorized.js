/* ============================================================
   LISTA UTENTI AUTORIZZATI — src/data/authorized.js
   ============================================================

   Formato identificativi: cognome.nome (tutto minuscolo, senza spazi)
   Esempio: per "Rossi Mario" -> "rossi.mario"
   Esempio doppio nome: per "De Luca Anna Maria" -> "deluca.annamaria"

   ISTRUZIONI per aggiungere un utente:
   1. Scrivi il cognome seguito da punto seguito dal nome, tutto minuscolo
   2. Non usare spazi, accenti o caratteri speciali
   3. Aggiungi la stringa tra virgolette dentro l'array AUTHORIZED

   ESEMPIO:
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
  // Aggiungi qui i nomi autorizzati, es: "rossi.mario"
];
