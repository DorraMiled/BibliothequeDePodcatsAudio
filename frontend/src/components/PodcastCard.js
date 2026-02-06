import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUtlis';

/**
 * Composant carte pour afficher un podcast
 * @param {Object} podcast - Données du podcast à afficher
 */
const PodcastCard = ({ podcast }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/podcasts/${podcast._id}`);
  };

  return (
    <div className="podcast-card" onClick={handleClick}>
      {/* Image du podcast */}
      <div className="podcast-image">
        {podcast.imageUrl ? (
          <img src={getImageUrl(podcast.imageUrl)} alt={podcast.title} />
        ) : (
          <div className="podcast-placeholder">
            <span>📻</span>
          </div>
        )}
      </div>

      {/* Informations du podcast */}
      <div className="podcast-info">
        <h3 className="podcast-title">{podcast.title}</h3>
        
        {/* Nombre d'épisodes si disponible */}
        {podcast.episodes && (
          <p className="podcast-episodes">
            {podcast.episodes.length} épisode{podcast.episodes.length > 1 ? 's' : ''}
          </p>
        )}
      </div>
    </div>
  );
};

export default PodcastCard;
