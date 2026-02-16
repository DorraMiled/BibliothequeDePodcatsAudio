import api from './api';

/**
 * Service pour gérer les opérations liées aux podcasts
 */
const podcastService = {
  /**
   * Récupère tous les podcasts de la bibliothèque
   * @returns {Promise} Liste des podcasts
   */
  getAllPodcasts: async () => {
    try {
      const response = await api.get('/podcasts');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Récupère un podcast spécifique par son ID
   * @param {string} id - ID du podcast
   * @returns {Promise} Détails du podcast
   */
  getPodcastById: async (id) => {
    try {
      const response = await api.get(`/podcasts/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Crée un nouveau podcast dans la bibliothèque
   * @param {FormData} formData - Données du podcast (titre et image)
   * @returns {Promise} Podcast créé
   */
  createPodcast: async (formData) => {
    try {
      const response = await api.post('/podcasts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Met à jour un podcast existant
   * @param {string} id - ID du podcast à modifier
   * @param {FormData} formData - Nouvelles données du podcast
   * @returns {Promise} Podcast mis à jour
   */
  updatePodcast: async (id, formData) => {
    try {
      const response = await api.put(`/podcasts/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Supprime un podcast de la bibliothèque
   * @param {string} id - ID du podcast à supprimer
   * @returns {Promise} Confirmation de suppression
   */
  deletePodcast: async (id) => {
    try {
      const response = await api.delete(`/podcasts/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default podcastService;
