// Single source of truth per la versione dell'app e del formato di export.
//
// APP_VERSION viene letta da package.json a build-time: Vite lo converte in
// una stringa costante nel bundle finale, quindi non c'è overhead runtime
// né rischio di leak di dati sensibili da package.json (che Vite importa
// solo per il campo version).
//
// EXPORT_FORMAT_VERSION rappresenta invece lo schema del backup JSON.
// Va bumpato SOLO quando la struttura di titles/chapters/history cambia.
// Esempio: se in futuro aggiungi `tags` ai capitoli, bumpa a '1.1.0'.

import pkg from '../package.json';

// NB: Vite sostituisce `pkg.version` con una stringa costante a build-time.
// Se modifichi package.json mentre `npm run dev` è attivo, riavvia il
// dev server: Vite non ri-legge il JSON a caldo.

export const APP_VERSION = pkg.version;

// 1.0.0 = schema base corrente. Non è stato cambiato, solo
// disaccoppiato dalla versione app per evitare futuri drift.
export const EXPORT_FORMAT_VERSION = '1.0.0';
