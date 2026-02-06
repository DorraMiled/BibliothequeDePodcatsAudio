import React, { useState, useEffect } from 'react';
import episodeService from '../services/episodesService';
import podcastService from '../services/podcastService';

/**
 * Composant formulaire pour créer un nouvel épisode
 * @param {Function} onEpisodeCreated - Callback appelé après la création réussie d'un épisode
 */
const EpisodeForm = ({ onEpisodeCreated }) => {
  // État local pour gérer les données du formulaire
  const [formData, setFormData] = useState({
    podcastId: '',
    title: '',
    description: '',
    publicationDate: '',
    audioUrl: '',
  });
  
  // État pour la liste des podcasts disponibles
  const [podcasts, setPodcasts] = useState([]);
  
  // État pour gérer les messages d'erreur et de succès
  const [message, setMessage] = useState({ type: '', text: '' });

  /**
   * Charge la liste des podcasts au montage du composant
   */
  useEffect(() => {
    loadPodcasts();
  }, []);

  /**
   * Récupère tous les podcasts disponibles
   */
  const loadPodcasts = async () => {
    try {
      const data = await podcastService.getAllPodcasts();
      setPodcasts(data);
    } catch (error) {
      console.error('Erreur lors du chargement des podcasts:', error);
    }
  };

  /**
   * Gère les changements dans les champs du formulaire
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Soumet le formulaire pour créer un nouvel épisode
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation des champs requis
    if (!formData.podcastId || !formData.title || !formData.description || 
        !formData.publicationDate || !formData.audioUrl) {
      setMessage({ type: 'error', text: 'Veuillez remplir tous les champs' });
      return;
    }

    try {
      // Préparer les données de l'épisode
      const episodeData = {
        title: formData.title,
        description: formData.description,
        publicationDate: formData.publicationDate,
        audioUrl: formData.audioUrl,
      };

      // Appel au service pour créer l'épisode
      await episodeService.createEpisode(formData.podcastId, episodeData);
      
      // Réinitialiser le formulaire
      setFormData({
        podcastId: '',
        title: '',
        description: '',
        publicationDate: '',
        audioUrl: '',
      });
      
      setMessage({ type: 'success', text: 'Épisode créé avec succès!' });
      
      // Appeler le callback si fourni
      if (onEpisodeCreated) {
        onEpisodeCreated();
      }
      
      // Effacer le message après 3 secondes
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Erreur lors de la création de l\'épisode: ' + (error.response?.data?.message || error.message) 
      });
    }
  };

  return (
    <div className="episode-form">
      <h2>Ajouter un nouvel épisode</h2>
      
      {/* Affichage des messages */}
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Sélection du podcast */}
        <div className="form-group">
          <label htmlFor="podcastId">Podcast *</label>
          <select
            id="podcastId"
            name="podcastId"
            value={formData.podcastId}
            onChange={handleInputChange}
            required
          >
            <option value="">Sélectionnez un podcast</option>
            {podcasts.map((podcast) => (
              <option key={podcast._id} value={podcast._id}>
                {podcast.title}
              </option>
            ))}
          </select>
        </div>

        {/* Champ titre */}
        <div className="form-group">
          <label htmlFor="title">Titre de l'épisode *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Entrez le titre de l'épisode"
            required
          />
        </div>

        {/* Champ description */}
        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Décrivez l'épisode"
            rows="4"
            required
          />
        </div>

        {/* Champ date de publication */}
        <div className="form-group">
          <label htmlFor="publicationDate">Date de publication *</label>
          <input
            type="date"
            id="publicationDate"
            name="publicationDate"
            value={formData.publicationDate}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Champ URL audio */}
        <div className="form-group">
          <label htmlFor="audioUrl">URL de l'audio *</label>
          <input
            type="url"
            id="audioUrl"
            name="audioUrl"
            value={formData.audioUrl}
            onChange={handleInputChange}
            placeholder="https://example.com/audio.mp3"
            required
          />
        </div>

        {/* Bouton de soumission */}
        <button type="submit" className="btn-primary">
          Créer l'épisode
        </button>
      </form>
    </div>
  );
};

export default EpisodeForm;
