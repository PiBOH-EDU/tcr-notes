/* ============================================================
   LISTA UTENTI AUTORIZZATI — src/data/authorized.js
   ============================================================

   Formato identificativi: cognome.nome (tutto minuscolo, senza spazi)

   Esempi:
     "Rossi Mario"              -> "rossi.mario"
     "Bianchi Lucia"            -> "bianchi.lucia"
     "Verdi Antonio"            -> "verdi.antonio"
     "Bianchi Ginevra Anna"     -> "bianchi.ginevraanna"
     "De Luca Marco Giuseppe"   -> "deluca.marcogiuseppe"

   ISTRUZIONI per aggiungere un utente:
   1. Scrivi il cognome seguito da punto seguito dal nome (o nomi attaccati)
   2. Tutto minuscolo, nessuno spazio, nessun accento
   3. Ogni elemento deve essere separato da una virgola
   4. L'ultimo elemento NON deve avere la virgola finale

   FORMATO SEMPLICE (stringa) = lettura e scrittura (editor):
     export const AUTHORIZED = [
       "rossi.mario",
       "bianchi.lucia",
     ];

   FORMATO AVANZATO (oggetto) = permesso specifico:
     export const AUTHORIZED = [
       "rossi.mario",                          // default: editor
       { name: "bianchi.lucia", role: "viewer" }, // solo lettura
       { name: "verdi.antonio", role: "editor" }, // lettura+scrittura
     ];

   Ruoli disponibili:
     - "editor"  -> può leggere, scrivere, creare, eliminare
     - "viewer"  -> può solo leggere (nessuna modifica)

   NOTA: se lasci l'array vuoto ([]), TUTTI gli studenti con la
   password corretta potranno accedere come EDITOR (modalità classe aperta).
   Se inserisci anche un solo nome, SOLO quelli nella lista
   potranno accedere (modalità whitelist).
   ============================================================ */

export const AUTHORIZED = [
  { name: "bonaldo.pietro", role: "editor" },
  { name: "aluisio.gabriele", role: "editor" },
  { name: "bianco.nicola", role: "editor" },
  { name: "mardarie.denisandreiflorin", role: "editor" },
  { name: "mollo.michele", role: "editor" },
  { name: "cecchetto.jacopo", role: "editor" },
  { name: "pitzalis.vera", role: "editor" },
  { name: "berton.alexgiulio", role: "editor" },
  { name: "cauduro.elia", role: "editor" },
];
