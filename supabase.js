import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isValidUrl = (value) => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

// Validazione esplicita: se il .env manca, non è stato riavviato il server
// dopo la modifica, o contiene valori placeholder, evitiamo che createClient()
// lanci un errore "silenzioso" che fa crashare tutta l'app (schermata bianca).
export const supabaseConfigError =
  !supabaseUrl || !supabaseKey || !isValidUrl(supabaseUrl)
    ? 'Configurazione Supabase mancante o non valida. Controlla il file .env nella root del progetto (VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY) e RIAVVIA il server (npm run dev) dopo averlo modificato: Vite legge il .env solo all\'avvio.'
    : null;

if (supabaseConfigError) {
  console.error('[tcr-notes] ' + supabaseConfigError);
}

export const supabase = supabaseConfigError
  ? null
  : createClient(supabaseUrl, supabaseKey);
