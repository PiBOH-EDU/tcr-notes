-- ============================================================
-- MIGRAZIONE UTENTI SU SUPABASE (GDPR)
-- Esegui questo script nell'SQL Editor di Supabase
-- ============================================================

-- 1. Tabella utenti autorizzati
CREATE TABLE IF NOT EXISTS utenti_autorizzati (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identificativo text NOT NULL UNIQUE,
  nome_reale text,
  bannato boolean NOT NULL DEFAULT false,
  ruolo text NOT NULL DEFAULT 'editor' CHECK (ruolo IN ('editor', 'viewer')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Commento per documentazione
COMMENT ON TABLE utenti_autorizzati IS 'Lista utenti autorizzati all\'accesso. Gestita solo da admin su Supabase Dashboard.';

-- 2. Abilita RLS (Row Level Security)
ALTER TABLE utenti_autorizzati ENABLE ROW LEVEL SECURITY;

-- 3. Funzione RPC per il login — restituisce SOLO il risultato per l'identificativo richiesto
-- Nessun dato di altri utenti viene esposto
CREATE OR REPLACE FUNCTION check_user_access(p_identificativo text)
RETURNS TABLE(trovato boolean, bannato boolean, ruolo text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT true, u.bannato, u.ruolo
  FROM utenti_autorizzati u
  WHERE u.identificativo = p_identificativo;

  IF NOT FOUND THEN
    RETURN QUERY SELECT false, false, 'editor'::text;
  END IF;
END;
$$;

-- 4. Funzione RPC per la dashboard admin — restituisce identificativo/ruolo/bannato
-- SENZA nome_reale per rispettare il GDPR
CREATE OR REPLACE FUNCTION list_users_for_admin()
RETURNS TABLE(identificativo text, ruolo text, bannato boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT u.identificativo, u.ruolo, u.bannato
  FROM utenti_autorizzati u
  ORDER BY u.identificativo;
END;
$$;

-- 5. Permessi: l'anon key (frontend) può eseguire solo le funzioni RPC, NON leggere la tabella direttamente
GRANT EXECUTE ON FUNCTION check_user_access(text) TO anon;
GRANT EXECUTE ON FUNCTION check_user_access(text) TO authenticated;
GRANT EXECUTE ON FUNCTION list_users_for_admin() TO anon;
GRANT EXECUTE ON FUNCTION list_users_for_admin() TO authenticated;

-- 6. Esempio: inserisci i tuoi utenti (modifica con i dati reali, poi cancella queste righe)
-- INSERT INTO utenti_autorizzati (identificativo, nome_reale, ruolo, bannato) VALUES
--   ('rossi.mario', 'Rossi Mario', 'editor', false),
--   ('bianchi.lucia', 'Bianchi Lucia', 'viewer', false),
--   ('verdi.antonio', 'Verdi Antonio', 'editor', true);  -- bannato
