const STORAGE_KEY = 'tcr-notes-data';

function getData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      return { version: '0.0.2.1', titles: {} };
    }
  }
  return { version: '0.0.2.1', titles: {} };
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function slugify(str) {
  return str.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
}

/* ===================== TITOLI ===================== */

export function getTitles() {
  const data = getData();
  return Object.entries(data.titles).map(([id, t]) => ({
    id,
    name: id,
    createdAt: t.createdAt,
    chapterCount: Object.keys(t.chapters || {}).length,
  }));
}

export function createTitle(name) {
  const data = getData();
  const id = slugify(name);
  if (!id || data.titles[id]) return null;
  data.titles[id] = {
    createdAt: new Date().toISOString(),
    chapters: {},
  };
  saveData(data);
  return id;
}

export function deleteTitle(id) {
  const data = getData();
  if (data.titles[id]) {
    delete data.titles[id];
    saveData(data);
    return true;
  }
  return false;
}

/* ===================== CAPITOLI ===================== */

export function getChapters(titleId) {
  const data = getData();
  const title = data.titles[titleId];
  if (!title) return [];
  return Object.entries(title.chapters || {}).map(([id, c]) => ({
    id,
    name: id,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  }));
}

export function createChapter(titleId, name) {
  const data = getData();
  const title = data.titles[titleId];
  if (!title) return null;
  const id = slugify(name);
  if (!id || title.chapters[id]) return null;
  title.chapters[id] = {
    content: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    history: [],
  };
  saveData(data);
  return id;
}

export function deleteChapter(titleId, chapterId) {
  const data = getData();
  const title = data.titles[titleId];
  if (title && title.chapters[chapterId]) {
    delete title.chapters[chapterId];
    saveData(data);
    return true;
  }
  return false;
}

/* ===================== CONTENUTO & CRONOLOGIA ===================== */

export function getChapter(titleId, chapterId) {
  const data = getData();
  return data.titles[titleId]?.chapters[chapterId] || null;
}

export function saveChapter(titleId, chapterId, content) {
  const data = getData();
  const chapter = data.titles[titleId]?.chapters[chapterId];
  if (!chapter) return false;

  // Salva versione corrente in cronologia
  chapter.history.push({
    timestamp: new Date().toISOString(),
    content: chapter.content,
  });

  // Limita a 50 entry
  if (chapter.history.length > 50) {
    chapter.history = chapter.history.slice(-50);
  }

  chapter.content = content;
  chapter.updatedAt = new Date().toISOString();
  saveData(data);
  return true;
}

export function getHistory(titleId, chapterId) {
  const data = getData();
  const chapter = data.titles[titleId]?.chapters[chapterId];
  if (!chapter) return [];
  return [...chapter.history].reverse();
}

export function restoreHistory(titleId, chapterId, historyIndex) {
  const data = getData();
  const chapter = data.titles[titleId]?.chapters[chapterId];
  if (!chapter || !chapter.history[historyIndex]) return false;

  // Salva corrente in cronologia prima di ripristinare
  chapter.history.push({
    timestamp: new Date().toISOString(),
    content: chapter.content,
  });

  chapter.content = chapter.history[historyIndex].content;
  chapter.updatedAt = new Date().toISOString();
  saveData(data);
  return true;
}

/* ===================== EXPORT / IMPORT ===================== */

export function exportData() {
  const data = getData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `tcr-notes-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!data || typeof data.titles !== 'object') {
          throw new Error('Formato file non valido');
        }
        saveData(data);
        resolve();
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Errore lettura file'));
    reader.readAsText(file);
  });
}
