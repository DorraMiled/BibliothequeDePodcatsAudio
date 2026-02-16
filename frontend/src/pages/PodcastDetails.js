import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import podcastService from '../services/podcastService';
import episodeService from '../services/episodesService';
import { getImageUrl } from '../utils/imageUtlis';
import EpisodeCard from '../components/EpisodeCard';
import AudioPlayer from '../components/AudioPlayer';
;

/**
 * Page de détail d'un podcast
 * Affiche les épisodes du podcast et permet d'en créer de nouveaux
 */
const PodcastDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // État pour stocker le podcast
  const [podcast, setPodcast] = useState(null);
  
  // État pour stocker les épisodes du podcast
  const [episodes, setEpisodes] = useState([]);
  
  // État pour l'épisode en cours de lecture
  const [currentEpisode, setCurrentEpisode] = useState(null);
  
  // État pour afficher/masquer le formulaire
  const [showForm, setShowForm] = useState(false);
  
  // État pour le mode édition
  const [editMode, setEditMode] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState(null);
  
  // État pour afficher/masquer le formulaire de modification du podcast
  const [showEditPodcast, setShowEditPodcast] = useState(false);
  const [podcastFormData, setPodcastFormData] = useState({
    title: '',
    image: null,
  });
  
  // État pour le formulaire
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    publicationDate: '',
    audioUrl: '',
  });
  
  // État pour gérer le chargement
  const [loading, setLoading] = useState(true);
  
  // État pour gérer les erreurs
  const [error, setError] = useState(null);
  
  // État pour les messages
  const [message, setMessage] = useState({ type: '', text: '' });

  /**
   * Charge le podcast et ses épisodes au montage
   */
  useEffect(() => {
    loadPodcastAndEpisodes();
  }, [id]);

  /**
   * Récupère les données du podcast et ses épisodes
   */
  const loadPodcastAndEpisodes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Charger le podcast
      const podcastData = await podcastService.getPodcastById(id);
      setPodcast(podcastData);
      setPodcastFormData({ title: podcastData.title, image: null });
      
      // Charger les épisodes du podcast
      const episodesData = await episodeService.getEpisodesByPodcast(id);
      setEpisodes(episodesData);
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
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
    if (!formData.title || !formData.description || !formData.publicationDate || !formData.audioUrl) {
      setMessage({ type: 'error', text: 'Veuillez remplir tous les champs' });
      return;
    }

    try {
      if (editMode && editingEpisode) {
        // Mode édition
        await episodeService.updateEpisode(editingEpisode._id, formData);
        setMessage({ type: 'success', text: 'Épisode modifié avec succès!' });
      } else {
        // Mode création
        await episodeService.createEpisode(id, formData);
        setMessage({ type: 'success', text: 'Épisode créé avec succès!' });
      }
      
      // Réinitialiser le formulaire
      setFormData({
        title: '',
        description: '',
        publicationDate: '',
        audioUrl: '',
      });
      
      setShowForm(false);
      setEditMode(false);
      setEditingEpisode(null);
      
      // Recharger les épisodes
      loadPodcastAndEpisodes();
      
      // Effacer le message après 3 secondes
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: `Erreur lors de ${editMode ? 'la modification' : 'la création'} de l'épisode: ` + (error.response?.data?.message || error.message) 
      });
    }
  };

  /**
   * Gère la lecture d'un épisode
   */
  const handlePlayEpisode = (episode) => {
    setCurrentEpisode(episode);
  };

  /**
   * Active le mode édition d'un épisode
   */
  const handleEditEpisode = (episode) => {
    setEditMode(true);
    setEditingEpisode(episode);
    
    // Convertir date en YYYY-MM-DD pour etre afficher lors de la modification'
    const publicationDate = episode.publicationDate || episode.publication_date;
    let formattedDate = '';
    if (publicationDate) {
      const date = new Date(publicationDate);
      formattedDate = date.toISOString().split('T')[0];
    }
    
    setFormData({
      title: episode.title,
      description: episode.description,
      publicationDate: formattedDate,
      audioUrl: episode.audioUrl || episode.audio_url,
    });
    setShowForm(true);
  };

  /**
   * Supprime un épisode
   */
  const handleDeleteEpisode = async (episodeId) => {
    try {
      await episodeService.deleteEpisode(episodeId);
      setMessage({ type: 'success', text: 'Épisode supprimé avec succès!' });
      loadPodcastAndEpisodes();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Erreur lors de la suppression: ' + (error.response?.data?.message || error.message) 
      });
    }
  };

  /**
   * Active le mode édition du podcast
   */
  const handleEditPodcast = () => {
    setShowEditPodcast(true);
  };

  /**
   * Supprime le podcast
   */
  const handleDeletePodcast = async () => {
    if (window.confirm('Voulez-vous vraiment supprimer ce podcast et tous ses épisodes ?')) {
      try {
        await podcastService.deletePodcast(id);
        setMessage({ type: 'success', text: 'Podcast supprimé avec succès!' });
        setTimeout(() => navigate('/'), 2000);
      } catch (error) {
        setMessage({ 
          type: 'error', 
          text: 'Erreur lors de la suppression: ' + (error.response?.data?.message || error.message) 
        });
      }
    }
  };

  /**
   * Soumet le formulaire de modification du podcast
   */
  const handleSubmitPodcast = async (e) => {
    e.preventDefault();
    
    try {
      const data = new FormData();
      data.append('title', podcastFormData.title);
      if (podcastFormData.image) {
        data.append('image', podcastFormData.image);
      }

      await podcastService.updatePodcast(id, data);
      setMessage({ type: 'success', text: 'Podcast modifié avec succès!' });
      setShowEditPodcast(false);
      loadPodcastAndEpisodes();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Erreur lors de la modification: ' + (error.response?.data?.message || error.message) 
      });
    }
  };

  /**
   * Gère les changements dans le formulaire du podcast
   */
  const handlePodcastInputChange = (e) => {
    const { name, value } = e.target;
    setPodcastFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Gère la sélection d'une image pour le podcast
   */
  const handlePodcastImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPodcastFormData((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  // État de chargement
  if (loading) {
    return (
      <div className="podcast-detail-page">
        <div className="loading">
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  // État d'erreur
  if (error || !podcast) {
    return (
      <div className="podcast-detail-page">
        <div className="error-message">
          <p>{error || 'Podcast introuvable'}</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="podcast-detail-page">
      {/* En-tête avec informations du podcast */}
      <div className="podcast-header">
        <button onClick={() => navigate('/')} className="btn-back">
          ← Retour
        </button>
        
        <div className="podcast-info-header">
          {podcast.imageUrl ? (
            <img src={getImageUrl(podcast.imageUrl)} alt={podcast.title} className="podcast-header-image" />
          ) : (
            <div className="podcast-header-placeholder">📻</div>
          )}
          
          <div className="podcast-header-details">
            <h1>{podcast.title}</h1>
            <p className="podcast-episode-count">
              {episodes.length} épisode{episodes.length > 1 ? 's' : ''}
            </p>
            <div className="podcast-header-actions">
              <button onClick={handleEditPodcast} className="btn-edit-podcast">
                ✏️ Modifier
              </button>
              <button onClick={handleDeletePodcast} className="btn-delete-podcast">
                🗑️ Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Affichage des messages */}
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Bouton pour créer un épisode */}
      <div className="action-buttons">
        <button 
          className="btn-primary"
          onClick={() => {
            setShowForm(!showForm);
            setEditMode(false);
            setEditingEpisode(null);
            setFormData({
              title: '',
              description: '',
              publicationDate: '',
              audioUrl: '',
            });
          }}
        >
          {showForm && !editMode ? '✖ Fermer' : '➕ Nouvel Épisode'}
        </button>
      </div>

      {/* Formulaire de modification du podcast */}
      {showEditPodcast && (
        <div className="episode-form">
          <h2>Modifier le podcast</h2>
          
          <form onSubmit={handleSubmitPodcast}>
            <div className="form-group">
              <label htmlFor="podcast-title">Titre du podcast </label>
              <input
                type="text"
                id="podcast-title"
                name="title"
                value={podcastFormData.title}
                onChange={handlePodcastInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="podcast-image">Nouvelle image (optionnel)</label>
              <input
                type="file"
                id="podcast-image"
                name="image"
                accept="image/*"
                onChange={handlePodcastImageChange}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                Enregistrer
              </button>
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={() => setShowEditPodcast(false)}
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Formulaire de création d'épisode */}
      {showForm && (
        <div className="episode-form">
          <h2>{editMode ? 'Modifier l\'épisode' : `Ajouter un épisode à ${podcast.title}`}</h2>
          
          <form onSubmit={handleSubmit}>
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
              {editMode ? 'Modifier l\'épisode' : 'Créer l\'épisode'}
            </button>
            
            {editMode && (
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={() => {
                  setEditMode(false);
                  setEditingEpisode(null);
                  setShowForm(false);
                }}
                style={{ marginLeft: '1rem' }}
              >
                Annuler
              </button>
            )}
          </form>
        </div>
      )}

      {/* Liste des épisodes */}
      <section className="episodes-section">
        <h2>Épisodes</h2>
        
        {episodes.length === 0 ? (
          <div className="empty-state">
            <p>Aucun épisode pour ce podcast</p>
            <p>Ajoutez votre premier épisode en cliquant sur le bouton ci-dessus</p>
          </div>
        ) : (
          <div className="episodes-list">
            {episodes.map((episode) => (
              <EpisodeCard 
                key={episode._id} 
                episode={{
                  ...episode,
                  onEdit: handleEditEpisode,
                  onDelete: handleDeleteEpisode
                }}
                onPlay={handlePlayEpisode}
              />
            ))}
          </div>
        )}
      </section>

      {/* Lecteur audio fixe en bas de page */}
      <div className="audio-player-container">
        <AudioPlayer episode={currentEpisode} />
      </div>
    </div>
  );
};

export default PodcastDetail;
