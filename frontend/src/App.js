import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Episodes from './pages/Episodes';
import PodcastDetail from './pages/PodcastDetails';
import './App.css';

function App() {
  return (
     <Router>
      <div className="app">
        {/* Navigation principale */}
        <nav className="navbar">
          <div className="navbar-brand">
            <h1>📻 Bibliothèque Podcasts</h1>
          </div>
          
          <div className="navbar-menu">
            <Link to="/" className="navbar-link">
              🏠 Accueil
            </Link>
            <Link to="/episodes" className="navbar-link">
              🎧 Tous les Épisodes
            </Link>
          </div>
        </nav>

        {/* Contenu principal avec routes */}
        <main className="main-content">
          <Routes>
            {/* Page d'accueil - Gestion des podcasts */}
            <Route path="/" element={<Home />} />
            
            {/* Page de détail d'un podcast */}
            <Route path="/podcasts/:id" element={<PodcastDetail />} />
            
            {/* Page des épisodes - Liste et lecture */}
            <Route path="/episodes" element={<Episodes />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="footer">
          <p></p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
