import { addPodcast, getPodcasts as getPodcastsService, getPodcastById as getPodcastByIdService, updatePodcast as updatePodcastService, deletePodcast as deletePodcastService } from "../services/podcastService.js";

const createPodcast = async (req, res) => {
  try {
    const { title } = req.body;
    
    // Vérifier si le titre est fourni
    if (!title) {
      return res.status(400).json({ message: 'Le titre est requis' });
    }

    // Gérer l'URL de l'image (fichier uploadé ou URL fournie)
    let imageUrl = null;
    if (req.file) {
      // Si un fichier est uploadé
      imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.image_url) {
      // Si une URL est fournie
      imageUrl = req.body.image_url;
    }

    const podcast = await addPodcast(title, imageUrl);
    res.status(201).json(podcast);
  } catch (error) {
    console.error('Erreur lors de la création du podcast:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la création du podcast', 
      error: error.message 
    });
  }
};

const getPodcasts = async (req, res) => {
  try {
    const podcasts = await getPodcastsService();
    res.json(podcasts);
  } catch (error) {
    console.error('Erreur lors de la récupération des podcasts:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des podcasts', 
      error: error.message 
    });
  }
};

const getPodcastById = async (req, res) => {
  try {
    const { id } = req.params;
    const podcast = await getPodcastByIdService(id);
    
    if (!podcast) {
      return res.status(404).json({ message: 'Podcast non trouvé' });
    }
    
    res.json(podcast);
  } catch (error) {
    console.error('Erreur lors de la récupération du podcast:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération du podcast', 
      error: error.message 
    });
  }
};

const updatePodcast = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    
    let imageUrl = req.body.image_url;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const podcast = await updatePodcastService(id, title, imageUrl);
    
    if (!podcast) {
      return res.status(404).json({ message: 'Podcast non trouvé' });
    }
    
    res.json(podcast);
  } catch (error) {
    console.error('Erreur lors de la modification du podcast:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la modification du podcast', 
      error: error.message 
    });
  }
};

const deletePodcast = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deletePodcastService(id);
    
    if (!result) {
      return res.status(404).json({ message: 'Podcast non trouvé' });
    }
    
    res.json({ message: 'Podcast supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du podcast:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la suppression du podcast', 
      error: error.message 
    });
  }
};

export { createPodcast, getPodcasts, getPodcastById, updatePodcast, deletePodcast };