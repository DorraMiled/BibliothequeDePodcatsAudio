import { createPodcast, getAllPodcasts, getPodcast, updatePodcast as updatePodcastModel, deletePodcast as deletePodcastModel } from "../models/podcastModel.js";

const addPodcast = (title, imageUrl) => {
  return createPodcast(title, imageUrl);
};

const getPodcasts = () => {
  return getAllPodcasts();
};

const getPodcastById = (id) => {
  return getPodcast(id);
};

const updatePodcast = (id, title, imageUrl) => {
  return updatePodcastModel(id, title, imageUrl);
};

const deletePodcast = (id) => {
  return deletePodcastModel(id);
};

export { addPodcast, getPodcasts, getPodcastById, updatePodcast, deletePodcast };