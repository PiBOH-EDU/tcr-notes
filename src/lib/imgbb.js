/**
 * Modulo per l'upload di immagini su imgBB.
 * Documentazione API: https://api.imgbb.com/
 */

const IMGBB_API_URL = 'https://api.imgbb.com/1/upload';

/**
 * Carica un'immagine su imgBB e restituisce l'URL pubblico.
 *
 * @param {string} base64Image - Immagine in formato base64 (con o senza prefisso data:image/...;base64,)
 * @param {string} apiKey - La tua API key di imgBB
 * @returns {Promise<string>} URL pubblico dell'immagine caricata
 */
export async function uploadImageToImgBB(base64Image, apiKey) {
  if (!apiKey || apiKey === 'your-imgbb-api-key') {
    throw new Error(
      'Chiave API imgBB mancante. Aggiungi VITE_IMGBB_API_KEY nel file .env nella root del progetto. Vedi docs/GUIDA-IMGBB.md per i dettagli.'
    );
  }

  // imgBB accetta la stringa base64 senza il prefisso data:image/...;base64,
  const base64Data = base64Image.includes(',')
    ? base64Image.split(',')[1]
    : base64Image;

  const formData = new FormData();
  formData.append('key', apiKey);
  formData.append('image', base64Data);

  const response = await fetch(IMGBB_API_URL, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Errore HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(
      data.error?.message || "Errore sconosciuto durante l'upload su imgBB."
    );
  }

  // display_url è più adatto per l'embedding (diretto, senza pagina intermedia)
  return data.data.display_url || data.data.url;
}
