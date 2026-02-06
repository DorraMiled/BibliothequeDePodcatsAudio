import db from "../config/db.js";

const createEpisode = async (episode) => {
  const { title, description, publication_date, audio_url, podcast_id } = episode;

  const result = await db.query(
    `INSERT INTO episodes 
    (title, description, publication_date, audio_url, podcast_id)
    VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [title, description, publication_date, audio_url, podcast_id]
  );

  const newEpisode = result.rows[0];
  
  // Récupérer les infos du podcast associé
  const podcastResult = await db.query(
    "SELECT * FROM podcasts WHERE id = $1",
    [podcast_id]
  );
  const podcast = podcastResult.rows[0];

  return {
    _id: newEpisode.id,
    title: newEpisode.title,
    description: newEpisode.description,
    publicationDate: newEpisode.publication_date,
    audioUrl: newEpisode.audio_url,
    podcast: podcast ? {
      _id: podcast.id,
      title: podcast.title,
      imageUrl: podcast.image
    } : null
  };
};

const getEpisodes = async (search, podcastId = null) => {
  let query = `
    SELECT e.*, 
           p.id as podcast_id,
           p.title as podcast_title,
           p.image as podcast_image
    FROM episodes e
    LEFT JOIN podcasts p ON e.podcast_id = p.id
    WHERE 1=1
  `;
  let values = [];
  let paramCount = 1;

  if (podcastId) {
    query += ` AND e.podcast_id = $${paramCount}`;
    values.push(podcastId);
    paramCount++;
  }

  if (search) {
    query += ` AND (e.title ILIKE $${paramCount} OR e.description ILIKE $${paramCount} OR p.title ILIKE $${paramCount})`;
    values.push(`%${search}%`);
    paramCount++;
  }

  query += ` ORDER BY e.publication_date DESC`;

  const result = await db.query(query, values);
  
  // Transformer les noms de colonnes pour correspondre au frontend
  return result.rows.map(episode => ({
    _id: episode.id,
    title: episode.title,
    description: episode.description,
    publicationDate: episode.publication_date,
    audioUrl: episode.audio_url,
    podcast: {
      _id: episode.podcast_id,
      title: episode.podcast_title,
      imageUrl: episode.podcast_image
    }
  }));
};

const getEpisode = async (id) => {
  const result = await db.query(`
    SELECT e.*, 
           p.id as podcast_id,
           p.title as podcast_title,
           p.image as podcast_image
    FROM episodes e
    LEFT JOIN podcasts p ON e.podcast_id = p.id
    WHERE e.id = $1
  `, [id]);
  
  if (result.rows.length === 0) {
    return null;
  }
  
  const episode = result.rows[0];
  return {
    _id: episode.id,
    title: episode.title,
    description: episode.description,
    publicationDate: episode.publication_date,
    audioUrl: episode.audio_url,
    podcast: {
      _id: episode.podcast_id,
      title: episode.podcast_title,
      imageUrl: episode.podcast_image
    }
  };
};

const updateEpisode = async (id, episodeData) => {
  const { title, description, publication_date, audio_url } = episodeData;
  
  const result = await db.query(
    `UPDATE episodes 
     SET title = $1, description = $2, publication_date = $3, audio_url = $4
     WHERE id = $5 RETURNING *`,
    [title, description, publication_date, audio_url, id]
  );
  
  if (result.rows.length === 0) {
    return null;
  }
  
  const episode = result.rows[0];
  
  // Récupérer les infos du podcast
  const podcastResult = await db.query(
    "SELECT * FROM podcasts WHERE id = $1",
    [episode.podcast_id]
  );
  const podcast = podcastResult.rows[0];
  
  return {
    _id: episode.id,
    title: episode.title,
    description: episode.description,
    publicationDate: episode.publication_date,
    audioUrl: episode.audio_url,
    podcast: podcast ? {
      _id: podcast.id,
      title: podcast.title,
      imageUrl: podcast.image
    } : null
  };
};

const deleteEpisode = async (id) => {
  const result = await db.query(
    "DELETE FROM episodes WHERE id = $1 RETURNING *",
    [id]
  );
  
  return result.rows.length > 0;
};


export { createEpisode, getEpisodes, getEpisode,updateEpisode, deleteEpisode };