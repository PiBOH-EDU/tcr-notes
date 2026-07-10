import { supabase } from './supabase';
import { APP_VERSION, EXPORT_FORMAT_VERSION } from '../version';

/* ===================== TITOLI ===================== */

export async function getTitles() {
  const { data, error } = await supabase
    .from('titles')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function createTitle(name) {
  const { data, error } = await supabase
    .from('titles')
    .insert({ name })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTitle(id) {
  const { error } = await supabase.from('titles').delete().eq('id', id);
  if (error) throw error;
  return true;
}

export async function renameTitle(id, newName) {
  const { data, error } = await supabase
    .from('titles')
    .update({ name: newName })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

/* ===================== CAPITOLI ===================== */

export async function getChapters(titleId) {
  const { data, error } = await supabase
    .from('chapters')
    .select('*')
    .eq('title_id', titleId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function createChapter(titleId, name) {
  const { data, error } = await supabase
    .from('chapters')
    .insert({ title_id: titleId, name, content: '' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteChapter(id) {
  const { error } = await supabase.from('chapters').delete().eq('id', id);
  if (error) throw error;
  return true;
}

export async function renameChapter(id, newName) {
  const { data, error } = await supabase
    .from('chapters')
    .update({ name: newName })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

/* ===================== CONTENUTO & CRONOLOGIA ===================== */

export async function getChapter(chapterId) {
  const { data, error } = await supabase
    .from('chapters')
    .select('*')
    .eq('id', chapterId)
    .single();
  if (error) throw error;
  return data;
}

export async function saveChapter(chapterId, content, editedBy) {
  // Salva versione corrente in cronologia
  const current = await getChapter(chapterId);
  if (current && current.content !== content) {
    await supabase.from('history').insert({
      chapter_id: chapterId,
      content: current.content,
      edited_by: current.last_edited_by || editedBy,
    });

    // Pulisci vecchie entry (mantieni ultime 50)
    const { data: old } = await supabase
      .from('history')
      .select('id')
      .eq('chapter_id', chapterId)
      .order('created_at', { ascending: false });

    if (old && old.length > 50) {
      const toDelete = old.slice(50).map((h) => h.id);
      await supabase.from('history').delete().in('id', toDelete);
    }
  }

  // Aggiorna capitolo
  const { data, error } = await supabase
    .from('chapters')
    .update({ content, last_edited_by: editedBy, updated_at: new Date().toISOString() })
    .eq('id', chapterId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getHistory(chapterId) {
  const { data, error } = await supabase
    .from('history')
    .select('*')
    .eq('chapter_id', chapterId)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  return data || [];
}

export async function restoreHistory(chapterId, historyId, editedBy) {
  // Recupera versione storica
  const { data: hist, error: histErr } = await supabase
    .from('history')
    .select('*')
    .eq('id', historyId)
    .single();
  if (histErr || !hist) throw new Error('Versione non trovata');

  // Salva corrente in cronologia prima di ripristinare
  const current = await getChapter(chapterId);
  await supabase.from('history').insert({
    chapter_id: chapterId,
    content: current.content,
    edited_by: current.last_edited_by || editedBy,
  });

  // Ripristina
  const { data, error } = await supabase
    .from('chapters')
    .update({
      content: hist.content,
      last_edited_by: editedBy,
      updated_at: new Date().toISOString(),
    })
    .eq('id', chapterId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

/* ===================== ADMIN ===================== */

export async function getRecentHistory(limit = 20) {
  const { data, error } = await supabase
    .from('history')
    .select('id, chapter_id, edited_by, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data || [];
}

export async function exportAllData() {
  const [{ data: titles }, { data: chapters }, { data: history }] = await Promise.all([
    supabase.from('titles').select('*'),
    supabase.from('chapters').select('*'),
    supabase.from('history').select('*'),
  ]);

  const blob = new Blob(
    [JSON.stringify({
      appVersion: APP_VERSION,
      formatVersion: EXPORT_FORMAT_VERSION,
      exportedAt: new Date().toISOString(),
      titles, chapters, history,
    }, null, 2)],
    { type: 'application/json' }
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `tcr-notes-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);

  // Smoke test (solo in dev): verifica che IL BLOB effettivamente scritto
  // abbia lo schema dichiarato. Se qualcuno modifica i campi della export
  // senza bumpare EXPORT_FORMAT_VERSION, l'assert avvisa in console.
  // NB: in produzione (`import.meta.env.DEV === false`) il blocco è rimosso
  // dal tree-shaking di Vite, quindi nessun overhead né log-spam.
  if (import.meta.env.DEV) {
    const serialized = await blob.text();
    const parsed = JSON.parse(serialized);
    if (parsed.appVersion !== APP_VERSION || parsed.formatVersion !== EXPORT_FORMAT_VERSION) {
      console.warn(`[tcr-notes] exportAllData: schema mismatch — appVersion="${parsed.appVersion}" (atteso "${APP_VERSION}"), formatVersion="${parsed.formatVersion}" (atteso "${EXPORT_FORMAT_VERSION}"). Bumpa EXPORT_FORMAT_VERSION in src/version.js se hai modificato i campi.`);
    }
  }
}

export async function importAllData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!data || !Array.isArray(data.titles)) {
          throw new Error('Formato file non valido');
        }

        // Avviso non bloccante: il file proviene da un formato/versione nota
        // diversa da quella corrente. L'import riesce comunque perché lo
        // schema è backward-compatible, ma l'utente (o lo sviluppatore) viene
        // avvisato per evitare sorprese silenziose.
        //
        // Mappatura campi:
        //   - formatVersion: schema del backup (EXPORT_FORMAT_VERSION corrente)
        //   - version:       campo legacy dei backup < 0.11.6 (es. '0.0.2.2')
        //   - appVersion:    campo nuovo dei backup >= 0.11.6 (APP_VERSION corrente)
        // Li controlliamo separatamente così durante il debug è chiaro
        // *quale* campo sorgente ha generato il mismatch.
        if (data.formatVersion && data.formatVersion !== EXPORT_FORMAT_VERSION) {
          console.warn(`[tcr-notes] Import da formatVersion '${data.formatVersion}' (attuale '${EXPORT_FORMAT_VERSION}').`);
        }
        if (data.version !== undefined && data.version !== APP_VERSION) {
          console.warn(`[tcr-notes] Import da version legacy '${data.version}' (attuale appVersion '${APP_VERSION}').`);
        }
        if (data.appVersion !== undefined && data.appVersion !== APP_VERSION) {
          console.warn(`[tcr-notes] Import da appVersion '${data.appVersion}' (attuale '${APP_VERSION}').`);
        }

        // Inserisce tutto (ignora conflitti su nomi unici)
        if (data.titles?.length) {
          await supabase.from('titles').upsert(data.titles, { onConflict: 'name' });
        }
        if (data.chapters?.length) {
          await supabase.from('chapters').upsert(data.chapters, { onConflict: 'id' });
        }
        if (data.history?.length) {
          await supabase.from('history').upsert(data.history, { onConflict: 'id' });
        }

        resolve();
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Errore lettura file'));
    reader.readAsText(file);
  });
}
