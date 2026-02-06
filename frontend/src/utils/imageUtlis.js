/**
 *  gérer les URLs d'images
 * Convertit les chemins relatifs en URLs absolues vers le backend
 */

const BACKEND_URL = 'http://localhost:3000';

/**
 * Obtient l'URL complète d'une image
 * @param {string} imageUrl - URL de l'image
 * @returns {string} URL complète de l'image
 */
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  
  // Si l'URL commence par http:// ou https:// ==> URL complète
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // un chemin relatif, on ajoute l'URL du backend
  return `${BACKEND_URL}${imageUrl}`;
};
