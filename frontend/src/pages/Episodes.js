import React, { useState, useEffect } from 'react';
import episodeService from '../services/episodesService';
import SearchBar from '../components/SearchBar';
import EpisodeCard from '../components/EpisodeCard';
import AudioPlayer from '../components/AudioPlayer';

/**
 * Page affichant tous les épisodes avec recherche et lecture
 * Permet de filtrer les épisodes et de les écouter
 */
const Episodes = () => {
  // État pour stocker tous les épisodes
  const [episodes, setEpisodes] = useState([]);
  
  // État pour les épisodes filtrés
  const [filteredEpisodes, setFilteredEpisodes] = useState([]);
  
  // État pour la recherche
  const [searchQuery, setSearchQuery] = useState('');
  
  // État pour l'épisode en cours de lecture
  const [currentEpisode, setCurrentEpisode] = useState(null);
  
  // État pour gérer le chargement
  const [loading, setLoading] = useState(true);
  
  // État pour gérer les erreurs
  const [error, setError] = useState(null);

  /**
   * Charge tous les épisodes au montage du composant
   */
  useEffect(() => {
    loadEpisodes();
  }, []);

  /**
   * Filtre les épisodes lorsque la recherche change
   */
  useEffect(() => {
    filterEpisodes();
  }, [searchQuery, episodes]);

  /**
   * Récupère tous les épisodes depuis l'API
   */
  const loadEpisodes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await episodeService.getAllEpisodes();
      setEpisodes(data);
      setFilteredEpisodes(data);
    } catch (err) {
      setError('Erreur lors du chargement des épisodes');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Filtre les épisodes en fonction de la recherche
   * La recherche s'effectue sur le titre, la description et le nom du podcast
   */
  const filterEpisodes = () => {
    if (!searchQuery.trim()) {
      setFilteredEpisodes(episodes);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = episodes.filter((episode) => {
      // Recherche dans le titre de l'épisode
      const titleMatch = episode.title.toLowerCase().includes(query);
      
      // Recherche dans la description
      const descriptionMatch = episode.description.toLowerCase().includes(query);
      
      // Recherche dans le nom du podcast
      const podcastMatch = episode.podcast?.title?.toLowerCase().includes(query);

      return titleMatch || descriptionMatch || podcastMatch;
    });

    setFilteredEpisodes(filtered);
  };

  /**
   * Gère la lecture d'un épisode
   */
  const handlePlayEpisode = (episode) => {
    setCurrentEpisode(episode);
  };

  return (
    <div className="episodes-page">
      {/* En-tête de la page */}
      <header className="page-header">
        <h1>🎧 Tous les Épisodes</h1>
        <p>Parcourez et écoutez tous vos épisodes de podcasts</p>
      </header>

      {/* Barre de recherche */}
      <div className="search-section">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Rechercher un épisode, un podcast, une description..."
        />
        
        {/* Indicateur de résultats */}
        {searchQuery && (
          <p className="search-results-count">
            {filteredEpisodes.length} résultat{filteredEpisodes.length > 1 ? 's' : ''} trouvé{filteredEpisodes.length > 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Liste des épisodes */}
      <section className="episodes-section">
        {/* État de chargement */}
        {loading && (
          <div className="loading">
            <p>Chargement des épisodes...</p>
          </div>
        )}
        
        {/* Message d'erreur */}
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={loadEpisodes} className="btn-retry">
              Réessayer
            </button>
          </div>
        )}
        
        {/* Liste des épisodes filtrés */}
        {!loading && !error && (
          <>
            {filteredEpisodes.length === 0 ? (
              <div className="empty-state">
                {searchQuery ? (
                  <>
                    <p>Aucun épisode ne correspond à votre recherche</p>
                    <p>Essayez avec d'autres mots-clés</p>
                  </>
                ) : (
                  <>
                    <p>Aucun épisode disponible</p>
                    <p>Ajoutez des épisodes depuis la page d'accueil</p>
                  </>
                )}
              </div>
            ) : (
              <div className="episodes-list">
                {filteredEpisodes.map((episode) => (
                  <EpisodeCard 
                    key={episode._id} 
                    episode={episode}
                    onPlay={handlePlayEpisode}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* Lecteur audio fixe en bas de page */}
      <div className="audio-player-container">
        <AudioPlayer episode={currentEpisode} />
      </div>
    </div>
  );
};

export default Episodes;
