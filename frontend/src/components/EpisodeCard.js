import React from 'react';
import { getImageUrl } from '../utils/imageUtlis';

/**
 * Composant carte pour afficher un épisode
 * @param {Object} episode - Données de l'épisode à afficher
 * @param {Function} onPlay - Callback appelé lors du clic sur le bouton lecture
 */
const EpisodeCard = ({ episode, onPlay }) => {
  /**
   * Formate la date de publication en format lisible
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="episode-card">
      {/* En-tête avec image du podcast */}
      <div className="episode-header">
        {episode.podcast?.imageUrl ? (
          <img 
            src={getImageUrl(episode.podcast.imageUrl)} 
            alt={episode.podcast.title} 
            className="episode-podcast-image"
          />
        ) : (
          <div className="episode-podcast-placeholder">📻</div>
        )}
        
        <div className="episode-header-info">
          {/* Nom du podcast parent */}
          {episode.podcast && (
            <p className="episode-podcast-name">{episode.podcast.title}</p>
          )}
          
          {/* Titre de l'épisode */}
          <h3 className="episode-title">{episode.title}</h3>
        </div>
      </div>

      {/* Description de l'épisode */}
      <p className="episode-description">{episode.description}</p>

      {/* Footer avec date et boutons d'action */}
      <div className="episode-footer">
        <span className="episode-date">
          📅 {formatDate(episode.publicationDate)}
        </span>
        
        <div className="episode-actions">
          {/* Bouton de lecture */}
          <button 
            className="btn-play" 
            onClick={() => onPlay && onPlay(episode)}
            title="Lancer la lecture"
          >
            ▶️ Lire
          </button>
          
          {/* Bouton de modification */}
          {episode.onEdit && (
            <button 
              className="btn-edit" 
              onClick={(e) => {
                e.stopPropagation();
                episode.onEdit(episode);
              }}
              title="Modifier"
            >
              ✏️
            </button>
          )}
          
          {/* Bouton de suppression */}
          {episode.onDelete && (
            <button 
              className="btn-delete" 
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('Voulez-vous vraiment supprimer cet épisode ?')) {
                  episode.onDelete(episode._id);
                }
              }}
              title="Supprimer"
            >
              🗑️
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EpisodeCard;
