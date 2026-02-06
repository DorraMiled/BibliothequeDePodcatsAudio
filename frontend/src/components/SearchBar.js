import React from 'react';

/**
 * Composant barre de recherche pour filtrer les épisodes
 * @param {string} value - Valeur actuelle de la recherche
 * @param {Function} onChange - Callback appelé lors du changement de valeur
 * @param {string} placeholder - Texte de placeholder
 */
const SearchBar = ({ value, onChange, placeholder = 'Rechercher...' }) => {
  return (
    <div className="search-bar">
      {/* Icône de recherche */}
      <span className="search-icon">🔍</span>
      
      {/* Champ de recherche */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="search-input"
      />
      
      {/* Bouton pour effacer la recherche */}
      {value && (
        <button 
          className="search-clear" 
          onClick={() => onChange('')}
          title="Effacer"
        >
          ✖
        </button>
      )}
    </div>
  );
};

export default SearchBar;
