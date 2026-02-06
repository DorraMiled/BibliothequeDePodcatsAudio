import React, { useState } from 'react';
import podcastService from '../services/podcastService';
/**
 * Composant formulaire pour créer un nouveau podcast
 * @param {Function} onPodcastCreated - Callback appelé après la création réussie d'un podcast
 */
const PodcastForm = ({ onPodcastCreated }) => {
  // État local pour gérer les données du formulaire
  const [formData, setFormData] = useState({
    title: '',
    image: null,
  });
  
  // État pour gérer les messages d'erreur et de succès
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // État pour l'aperçu de l'image
  const [imagePreview, setImagePreview] = useState(null);

  /**
   * Gère les changements dans les champs de texte du formulaire
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Gère la sélection d'une image
   */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      
      // Créer un aperçu de l'image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * Soumet le formulaire pour créer un nouveau podcast
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation des champs requis
    if (!formData.title || !formData.image) {
      setMessage({ type: 'error', text: 'Veuillez remplir tous les champs' });
      return;
    }

    try {
      // Créer un objet FormData pour l'upload de fichier
      const data = new FormData();
      data.append('title', formData.title);
      data.append('image', formData.image);

      // Appel au service pour créer le podcast
      await podcastService.createPodcast(data);
      
      // Réinitialiser le formulaire
      setFormData({ title: '', image: null });
      setImagePreview(null);
      setMessage({ type: 'success', text: 'Podcast créé avec succès!' });
      
      // Appeler le callback si fourni
      if (onPodcastCreated) {
        onPodcastCreated();
      }
      
      // Effacer le message après 3 secondes
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Erreur lors de la création du podcast: ' + (error.response?.data?.message || error.message) 
      });
    }
  };

  return (
    <div className="podcast-form">
      <h2>Ajouter un nouveau podcast</h2>
      
      {/* Affichage des messages */}
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Champ titre */}
        <div className="form-group">
          <label htmlFor="title">Titre du podcast *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Entrez le titre du podcast"
            required
          />
        </div>

        {/* Champ image */}
        <div className="form-group">
          <label htmlFor="image">Image du podcast *</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
          
          {/* Aperçu de l'image */}
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Aperçu" />
            </div>
          )}
        </div>

        {/* Bouton de soumission */}
        <button type="submit" className="btn-primary">
          Créer le podcast
        </button>
      </form>
    </div>
  );
};

export default PodcastForm;
