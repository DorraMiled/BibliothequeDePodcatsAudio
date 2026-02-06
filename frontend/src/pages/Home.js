import { useEffect, useState } from "react";
import PodcastCard from "../components/PodcastCard";
import EpisodeForm from "../components/EpisodeForm";
import PodcastForm from "../components/PodcastForm";
import podcastService from "../services/podcastService";



const Home = () => {
    // pour stocker la liste des pod
    const [podcasts, setPodcasts] = useState([]);
    const [loading, setLoading] = useState(false);//gerer chaargement 
    const [error, setError] = useState(null);//gerer les erreurs

  const [showPodcastForm, setShowPodcastForm] = useState(false);
    const [showEpisodeForm, setShowEpisodeForm] = useState(false);

    useEffect(() => { loadPodcasts() },[]);//charger les podcasts au chargement du composant
    
    //recuperer la liste des podcasts
     const loadPodcasts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await podcastService.getAllPodcasts();
      setPodcasts(data);
    } catch (err) {
      setError('Erreur lors du chargement des podcasts');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  //des callback appelees apres la creation des podcasts ou episodes pour rafraichir les listes et forms 
    const handlePodcastCreated = () => {
    loadPodcasts();
    setShowPodcastForm(false);
  };

    const handleEpisodeCreated = () => {
    loadPodcasts();
    setShowEpisodeForm(false);
  };

  return (
 <div className="home-page">
     
      <header className="page-header">
        <h1>📻 Bibliothèque de Podcasts</h1>
        <p>Gérez vos podcasts et épisodes </p>
      </header>

      
      <div className="action-buttons">
          {!showEpisodeForm && (

        <button 
          className="btn-primary"
          onClick={() => setShowPodcastForm(!showPodcastForm)}
        >
          {showPodcastForm ? '✖ Fermer' : '➕ Nouveau Podcast'}
        </button>
          )}
         {!showPodcastForm && (
        <button 
          className="btn-secondary"
          onClick={() => setShowEpisodeForm(!showEpisodeForm)}
        >
          {showEpisodeForm ? '✖ Fermer' : '➕ Nouvel Épisode'}
        </button>
         )}
      </div>

      {/* Formulaires */}
      <div className="forms-section">
        {showPodcastForm && (
          <PodcastForm onPodcastCreated={handlePodcastCreated} />
        )}
        
        {showEpisodeForm && (
          <EpisodeForm onEpisodeCreated={handleEpisodeCreated} />
        )}
      </div>

      {/* Section des podcasts */}
      <section className="podcasts-section">
        <h2>Mes Podcasts</h2>
        
        {/* État de chargement */}
        {loading && (
          <div className="loading">
            <p>Chargement des podcasts...</p>
          </div>
        )}
        
        {/* Message d'erreur */}
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={loadPodcasts} className="btn-retry">
              Réessayer
            </button>
          </div>
        )}
        
        {/* Liste des podcasts */}
        {!loading && !error && (
          <>
            {podcasts.length === 0 ? (
              <div className="empty-state">
                <p>Aucun podcast dans votre bibliothèque</p>
                <p>Commencez par ajouter votre premier podcast!</p>
              </div>
            ) : (
              <div className="podcasts-grid">
                {podcasts.map((podcast) => (
                  <PodcastCard 
                    key={podcast._id} 
                    podcast={podcast}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );

};
export default Home;
