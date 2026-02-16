import api from './api';

/**
 * Service pour gérer les opérations liées aux épisodes
 */
const episodeService = {
  /**
   * Récupère tous les épisodes de tous les podcasts
   * @returns {Promise} Liste de tous les épisodes
   */
  getAllEpisodes: async () => {
    try {
      const response = await api.get('/episodes');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Récupère tous les épisodes d'un podcast spécifique
   * @param {string} podcastId - ID du podcast
   * @returns {Promise} Liste des épisodes du podcast
   */
  getEpisodesByPodcast: async (podcastId) => {
    try {
      const response = await api.get(`/podcasts/${podcastId}/episodes`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Récupère un épisode spécifique
   * @param {string} episodeId - ID de l'épisode
   * @returns {Promise} Détails de l'épisode
   */
  getEpisodeById: async (episodeId) => {
    try {
      const response = await api.get(`/episodes/${episodeId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Crée un nouvel épisode pour un podcast
   * @param {string} podcastId - ID du podcast parent
   * @param {Object} episodeData - Données de l'épisode (titre, description, date, URL audio)
   * @returns {Promise} Épisode créé
   */
  createEpisode: async (podcastId, episodeData) => {
    try {
      const response = await api.post(`/podcasts/${podcastId}/episodes`, episodeData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Met à jour un épisode existant
   * @param {string} episodeId - ID de l'épisode à modifier
   * @param {Object} episodeData - Nouvelles données de l'épisode
   * @returns {Promise} Épisode mis à jour
   */
  updateEpisode: async (episodeId, episodeData) => {
    try {
      const response = await api.put(`/episodes/${episodeId}`, episodeData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Supprime un épisode
   * @param {string} episodeId - ID de l'épisode à supprimer
   * @returns {Promise} Confirmation de suppression
   */
  deleteEpisode: async (episodeId) => {
    try {
      const response = await api.delete(`/episodes/${episodeId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default episodeService;
