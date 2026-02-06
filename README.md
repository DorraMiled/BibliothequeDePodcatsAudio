# 📻 Bibliothèque de Podcasts

Une application full-stack de gestion de bibliothèque de podcasts permettant de gérer des podcasts et leurs épisodes avec lecture audio intégrée.

## 📋 Description

Application web moderne permettant de créer, gérer et écouter une collection personnalisée de podcasts. L'application offre une interface intuitive pour organiser vos podcasts  et leurs épisodes avec un lecteur audio intégré.

## ✨ Fonctionnalités

### Gestion des Podcasts
- ✅ Créer un podcast (titre, image)
- ✅ Modifier un podcast
- ✅ Supprimer un podcast
- ✅ Afficher la liste de tous les podcasts
- ✅ Voir les détails d'un podcast avec ses épisodes

### Gestion des Épisodes
- ✅ Ajouter un épisode à un podcast (titre, description, date de publication, URL audio)
- ✅ Modifier un épisode
- ✅ Supprimer un épisode
- ✅ Lister tous les épisodes avec recherche par titre
- ✅ Filtrer les épisodes par podcast

### Lecteur Audio
- ✅ Lecture d'un épisode avec contrôles (play/pause, barre de progression)
- ✅ Affichage des informations de l'épisode en cours de lecture
- ✅ Lecteur fixe en bas de page

### Persistance
- ✅ Base de données PostgreSQL
- ✅ Toutes les données sont persistées (podcasts, épisodes)

## 🛠️ Technologies Utilisées

### Backend
- **Node.js** - Environnement d'exécution JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Base de données relationnelle
- **pg** - Client PostgreSQL pour Node.js
- **Multer** - Upload de fichiers (images)
- **CORS** - Gestion des requêtes cross-origin
- **dotenv** - Gestion des variables d'environnement
- **Nodemon** - Rechargement automatique en développement

### Frontend
- **React 19** - Bibliothèque UI
- **React Router DOM** - Navigation
- **Axios** - Client HTTP
- **React Scripts** - Configuration Create React App

## 📁 Structure du Projet

```
BibliothequePodcasts/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js              # Configuration PostgreSQL
│   │   │   └── multer.js          # Configuration upload fichiers
│   │   ├── controllers/
│   │   │   ├── episodeController.js
│   │   │   └── podcastController.js
│   │   ├── models/
│   │   │   ├── episodeModel.js
│   │   │   └── podcastModel.js
│   │   ├── routes/
│   │   │   ├── episodeRoute.js
│   │   │   └── podcastRoute.js
│   │   ├── services/
│   │   │   ├── episodeService.js
│   │   │   └── podcastService.js
│   │   └── index.js               # Point d'entrée
│   ├── uploads/                   # Images uploadées
│   ├── package.json
│   └── .env                       # Variables d'environnement
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AudioPlayer.js     # Lecteur audio
│   │   │   ├── EpisodeCard.js     # Carte épisode
│   │   │   ├── PodcastCard.js     # Carte podcast
│   │   │   ├── PodcastForm.js     # Formulaire podcast
│   │   │   └── EpisodeForm.js     # Formulaire épisode
│   │   ├── pages/
│   │   │   ├── Home.js            # Page d'accueil
│   │   │   ├── PodcastDetails.js  # Détails podcast
│   │   │   └── Episodes.js        # Liste des épisodes
│   │   ├── services/
│   │   │   ├── api.js             # Configuration Axios
│   │   │   ├── podcastService.js
│   │   │   └── episodesService.js
│   │   ├── utils/
│   │   │   └── imageUtlis.js      # Utilitaires images
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
└── README.md
```

## 🚀 Installation

### Prérequis

- Node.js (v14 ou supérieur)
- PostgreSQL (v12 ou supérieur)
- npm ou yarn

### 1. Cloner le projet

```bash
git clone https://github.com/DorraMiled/BibliothequeDePodcatsAudio.git
cd BibliothequeDePodcatsAudio
```

### 2. Configuration de la Base de Données

Créer une base de données PostgreSQL :

```sql
CREATE DATABASE Podcastdb;
```

Créer les tables :

```sql
-- Table des podcasts
CREATE TABLE podcasts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  image VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des épisodes
CREATE TABLE episodes (
  id SERIAL PRIMARY KEY,
  podcast_id INTEGER REFERENCES podcasts(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  publication_date DATE,
  audio_url VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Configuration du Backend

```bash
cd backend
npm install
```


Mettre à jour `backend/src/config/db.js` avec vos identifiants PostgreSQL.

### 4. Configuration du Frontend

```bash
cd ../frontend
npm install
```

Le proxy vers le backend est déjà configuré dans `package.json` (port 3000).

## 🎮 Utilisation

### Démarrer le Backend

```bash
cd backend
npm run dev
```

Le serveur démarre sur `http://localhost:3000`

### Démarrer le Frontend

```bash
cd frontend
npm start
```

L'application s'ouvre sur `http://localhost:3000`

## 📡 API Routes

### Podcasts

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/podcasts` | Liste tous les podcasts |
| GET | `/api/podcasts/:id` | Récupère un podcast |
| POST | `/api/podcasts` | Crée un podcast (avec image) |
| PUT | `/api/podcasts/:id` | Modifie un podcast |
| DELETE | `/api/podcasts/:id` | Supprime un podcast |

### Épisodes

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/episodes` | Liste tous les épisodes |
| GET | `/api/episodes/:id` | Récupère un épisode |
| POST | `/api/podcasts/:podcastId/episodes` | Crée un épisode |
| PUT | `/api/episodes/:id` | Modifie un épisode |
| DELETE | `/api/episodes/:id` | Supprime un épisode |
| GET | `/api/podcasts/:podcastId/episodes` | Épisodes d'un podcast |

## 📦 Scripts Disponibles

### Backend

```bash
npm start          # Démarrer en production
npm run dev        # Démarrer en mode développement (nodemon)
```

### Frontend

```bash
npm start          # Démarrer le serveur de développement
npm run build      # Créer le build de production
npm test           # Lancer les tests
```

## 🎨 Fonctionnalités de l'Interface

### Page d'Accueil
- Grille de tous les podcasts
- Formulaire de création de podcast
- Compteur d'épisodes par podcast
- Images des podcasts

### Page Détails Podcast
- Informations du podcast
- Liste des épisodes du podcast
- Formulaire d'ajout d'épisode
- Modification/Suppression d'épisode
- Lecteur audio intégré

### Page Épisodes
- Liste complète des épisodes
- Recherche par titre
- Lecture audio
- Filtrage en temps réel

## 🔧 Configuration Avancée

### Upload d'Images

Les images sont stockées dans `backend/uploads/`. Configuration Multer :
- Taille max : 5MB
- Formats acceptés : JPEG, JPG, PNG, GIF, WEBP

### Proxy Frontend → Backend

Le proxy est configuré dans `frontend/package.json` :

```json
"proxy": "http://localhost:3000"
```

