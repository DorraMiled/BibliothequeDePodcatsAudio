import { createEpisode, getEpisodes, getEpisode, updateEpisode as updateEpisodeModel, deleteEpisode as deleteEpisodeModel } from "../models/episodeModel.js";

const addEpisode = (episode) => {
  return createEpisode(episode);
};

const listEpisodes = (search, podcastId = null) => {
  return getEpisodes(search, podcastId);
};

const getEpisodeById = (id) => {
  return getEpisode(id);
};

const updateEpisode = (id, episodeData) => {
  return updateEpisodeModel(id, episodeData);
};

const deleteEpisode = (id) => {
  return deleteEpisodeModel(id);
};

export { addEpisode, listEpisodes, getEpisodeById, updateEpisode, deleteEpisode };
