import { supabase } from './supabase';

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

/* ===================== EXPORT / IMPORT ===================== */

export async function exportAllData() {
  const [{ data: titles }, { data: chapters }, { data: history }] = await Promise.all([
    supabase.from('titles').select('*'),
    supabase.from('chapters').select('*'),
    supabase.from('history').select('*'),
  ]);

  const blob = new Blob(
    [JSON.stringify({ version: '0.0.2.2', titles, chapters, history }, null, 2)],
    { type: 'application/json' }
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `tcr-notes-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
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
