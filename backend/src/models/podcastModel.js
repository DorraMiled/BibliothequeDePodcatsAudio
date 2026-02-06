import db from "../config/db.js";

const createPodcast = async (title, imageUrl) => {
  const result = await db.query(
    "INSERT INTO podcasts (title, image) VALUES ($1, $2) RETURNING *",
    [title, imageUrl]
  );
  
  // Transformer les noms de colonnes pour correspondre au frontend
  const podcast = result.rows[0];
  return {
    _id: podcast.id,
    title: podcast.title,
    imageUrl: podcast.image
  };
};

const getAllPodcasts = async () => {
  const result = await db.query(`
    SELECT p.*, 
           COUNT(e.id) as episode_count
    FROM podcasts p
    LEFT JOIN episodes e ON p.id = e.podcast_id
    GROUP BY p.id
    ORDER BY p.id DESC
  `);
  
  // Transformer les noms de colonnes pour correspondre au frontend
  return result.rows.map(podcast => ({
    _id: podcast.id,
    title: podcast.title,
    imageUrl: podcast.image,
    episodes: Array(parseInt(podcast.episode_count)).fill(null)
  }));
};

const getPodcast = async (id) => {
  const result = await db.query(
    "SELECT * FROM podcasts WHERE id = $1",
    [id]
  );
  
  if (result.rows.length === 0) {
    return null;
  }
  
  const podcast = result.rows[0];
  return {
    _id: podcast.id,
    title: podcast.title,
    imageUrl: podcast.image
  };
};

const updatePodcast = async (id, title, imageUrl) => {
  // Si imageUrl n'est pas fourni, on ne met pas à jour l'image
  let query;
  let values;
  
  if (imageUrl !== undefined && imageUrl !== null) {
    query = "UPDATE podcasts SET title = $1, image = $2 WHERE id = $3 RETURNING *";
    values = [title, imageUrl, id];
  } else {
    query = "UPDATE podcasts SET title = $1 WHERE id = $2 RETURNING *";
    values = [title, id];
  }
  
  const result = await db.query(query, values);
  
  if (result.rows.length === 0) {
    return null;
  }
  
  const podcast = result.rows[0];
  return {
    _id: podcast.id,
    title: podcast.title,
    imageUrl: podcast.image
  };
};

const deletePodcast = async (id) => {
  const result = await db.query(
    "DELETE FROM podcasts WHERE id = $1 RETURNING *",
    [id]
  );
  
  return result.rows.length > 0;
};
export { createPodcast, getAllPodcasts, getPodcast, updatePodcast, deletePodcast };