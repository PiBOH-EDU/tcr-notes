/**
 * Modulo autenticazione — verifica accesso utenti via Supabase RPC.
 * Sostituisce i file locali authorized.js e banned.js per GDPR.
 */

import { supabase } from './supabase';

/**
 * Verifica se un identificativo è autorizzato, bannato, e il suo ruolo.
 * Usa la funzione RPC check_user_access() per non esporre mai
 * l'intera tabella al frontend.
 *
 * @param {string} identificativo — formato "cognome.nome"
 * @returns {Promise<{trovato: boolean, bannato: boolean, ruolo: string}>}
 */
export async function checkUserAccess(identificativo) {
  if (!supabase) {
    throw new Error('Client Supabase non inizializzato. Controlla il file .env.');
  }

  const { data, error } = await supabase.rpc('check_user_access', {
    p_identificativo: identificativo,
  });

  if (error) {
    throw new Error('Errore verifica accesso: ' + error.message);
  }

  // La funzione restituisce sempre almeno una riga
  if (!data || data.length === 0) {
    return { trovato: false, bannato: false, ruolo: 'editor' };
  }

  return data[0];
}

/**
 * Recupera la lista completa degli utenti autorizzati (per admin).
 * Restituisce solo identificativo, ruolo e bannato (NO nome_reale per GDPR).
 *
 * @returns {Promise<Array<{identificativo: string, ruolo: string, bannato: boolean}>>}
 */
export async function listAuthorizedUsers() {
  if (!supabase) {
    throw new Error('Client Supabase non inizializzato.');
  }

  const { data, error } = await supabase.rpc('list_users_for_admin');

  if (error) {
    throw new Error('Errore caricamento utenti: ' + error.message);
  }

  return data || [];
}

/**
 * Trova il ruolo di un singolo utente dalla lista caricata.
 * Utility sincrona per evitare chiamate multiple nel render.
 *
 * @param {string} name — identificativo cognome.nome
 * @param {Array} list — risultato di listAuthorizedUsers()
 * @returns {string} 'editor' | 'viewer'
 */
export function getUserRoleFromList(name, list) {
  if (!list || list.length === 0) return 'editor';
  const entry = list.find(
    (u) => u.identificativo?.toLowerCase() === name?.toLowerCase()
  );
  return entry?.ruolo || 'editor';
}
