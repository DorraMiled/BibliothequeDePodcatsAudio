import { Router } from "express";
import * as controller from "../controllers/episodeController.js";  
const router = Router();

// Routes pour les opérations globales sur les épisodes
router.get("/", controller.getEpisodes);

// Routes pour les opérations sur un épisode spécifique
router.get("/:id", controller.getEpisodeById);
router.put("/:id", controller.updateEpisode);
router.delete("/:id", controller.deleteEpisode);

export default router;
