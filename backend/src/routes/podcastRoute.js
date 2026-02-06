import { Router } from "express";
import * as controller from "../controllers/podcastController.js";
import * as episodeController from "../controllers/episodeController.js";
import upload from "../config/upload.js";

const router = Router();

// Routes des podcasts
router.post("/", upload.single('image'), controller.createPodcast);
router.get("/", controller.getPodcasts);
router.get("/:id", controller.getPodcastById);
router.put("/:id", upload.single('image'), controller.updatePodcast);
router.delete("/:id", controller.deletePodcast);

// Routes des épisodes imbriquées dans les podcasts
router.post("/:podcastId/episodes", episodeController.createEpisode);
router.get("/:podcastId/episodes", episodeController.getEpisodesByPodcast);

export default router;
