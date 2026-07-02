/* ============================================================
   LISTA UTENTI BANNATI — src/data/banned.js
   ============================================================

   Formato identificativi: cognome.nome (tutto minuscolo, senza spazi)
   Esempio: per "Neri Giovanni" -> "neri.giovanni"

   ISTRUZIONI per bannare un utente:
   1. Scrivi il cognome.nome in formato minuscolo senza spazi
   2. Aggiungi la stringa tra virgolette dentro l'array BANNED

   ESEMPIO:
     export const BANNED = [
       "neri.giovanni",
       "rossi.paolo",
     ];

   NOTA: un utente bannato NON può mai accedere, anche se inserito
   nella lista AUTHORIZED o se conosce la password.
   ============================================================ */

export const BANNED = [
  // Aggiungi qui i nomi bannati, es: "neri.giovanni"
];
