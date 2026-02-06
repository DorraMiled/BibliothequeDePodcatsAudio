import express from 'express';
import cors from "cors";
import podcastRoutes from "./routes/podcastRoute.js";
import episodeRoutes from "./routes/episodeRoute.js";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import path from 'path';
import pool from "./config/db.js";
dotenv.config();

const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(cors());
app.use(express.json());

// Middleware pour parser le JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Servir les fichiers statiques (images uploadées)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


// Test de connexion à la base de données
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error(' Erreur de connexion à la base:', err);
  } else {
    console.log('Connexion a la base de donnees reussie');
  }
});


//test si backend marche 
app.get('/', (req, res) => {
  res.send("Hello from the backend!");
});

// Routes
app.use("/api/podcasts", podcastRoutes);
app.use("/api/episodes", episodeRoutes);

// Gestion des erreurs globale
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err);
  res.status(500).json({ 
    message: 'Erreur interne du serveur', 
    error: err.message 
  });
});

app.listen(PORT, () => {
  console.log(` Backend server is running on http://localhost:${PORT}`);
});