import axios from 'axios';

/**
 * Instance axios configurée pour communiquer avec l'API backend
 * Base URL: /api (redirigé vers le backend via le proxy Vite)
 */
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Intercepteur pour gérer les erreurs globalement
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erreur API:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
