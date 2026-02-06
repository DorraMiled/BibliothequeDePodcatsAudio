import { addEpisode, listEpisodes, getEpisodeById as getEpisodeByIdService, updateEpisode as updateEpisodeService, deleteEpisode as deleteEpisodeService } from "../services/episodeService.js";

const createEpisode = async (req, res) => {
  try {
    const { title, description, publicationDate, audioUrl } = req.body;
    const { podcastId } = req.params;

    // Vérification des champs requis
    if (!title || !description || !publicationDate || !audioUrl) {
      return res.status(400).json({ 
        message: 'Tous les champs sont requis (title, description, publicationDate, audioUrl)' 
      });
    }

    const episodeData = {
      podcast_id: podcastId,
      title,
      description,
      publication_date: publicationDate,
      audio_url: audioUrl
    };

    const episode = await addEpisode(episodeData);
    res.status(201).json(episode);
  } catch (error) {
    console.error('Erreur lors de la création de l\'\u00e9pisode:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la création de l\'\u00e9pisode', 
      error: error.message 
    });
  }
};

const getEpisodes = async (req, res) => {
  try {
    const { search } = req.query;
    const episodes = await listEpisodes(search);
    res.json(episodes);
  } catch (error) {
    console.error('Erreur lors de la récupération des épisodes:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des épisodes', 
      error: error.message 
    });
  }
};

const getEpisodesByPodcast = async (req, res) => {
  try {
    const { podcastId } = req.params;
    const episodes = await listEpisodes(null, podcastId);
    res.json(episodes);
  } catch (error) {
    console.error('Erreur lors de la récupération des épisodes:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des épisodes', 
      error: error.message 
    });
  }
};

const getEpisodeById = async (req, res) => {
  try {
    const { id } = req.params;
    const episode = await getEpisodeByIdService(id);
    
    if (!episode) {
      return res.status(404).json({ message: 'Épisode non trouvé' });
    }
    
    res.json(episode);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'épisode:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération de l\'épisode', 
      error: error.message 
    });
  }
};

const updateEpisode = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, publicationDate, audioUrl } = req.body;

    const episodeData = {
      title,
      description,
      publication_date: publicationDate,
      audio_url: audioUrl
    };

    const episode = await updateEpisodeService(id, episodeData);
    
    if (!episode) {
      return res.status(404).json({ message: 'Épisode non trouvé' });
    }
    
    res.json(episode);
  } catch (error) {
    console.error('Erreur lors de la modification de l\'épisode:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la modification de l\'épisode', 
      error: error.message 
    });
  }
};

const deleteEpisode = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteEpisodeService(id);
    
    if (!result) {
      return res.status(404).json({ message: 'Épisode non trouvé' });
    }
    
    res.json({ message: 'Épisode supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'épisode:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la suppression de l\'épisode', 
      error: error.message 
    });
  }
};

export { createEpisode, getEpisodes, getEpisodesByPodcast, getEpisodeById, updateEpisode, deleteEpisode };