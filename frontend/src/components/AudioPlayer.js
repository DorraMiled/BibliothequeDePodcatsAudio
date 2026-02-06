import React, { useRef, useState, useEffect } from 'react';
import { getImageUrl } from '../utils/imageUtlis';

/**
 * Composant lecteur audio pour lire les episodes de podcast
 * @param {Object} episode - episode actuellement en cours de lecture
 */
const AudioPlayer = ({ episode }) => {
  // Référence à l'élément audio HTML
  const audioRef = useRef(null);
  
  //  gerer la lecture/pause
  const [isPlaying, setIsPlaying] = useState(false);
  
  //  gerer le temps de lecture
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  //  gerer le volume
  const [volume, setVolume] = useState(1);

  /**
   * Reinitialise le lecteur lorsqu'un nouvel épisode est charge
   */
  useEffect(() => {
    if (audioRef.current && episode) {
      audioRef.current.load();
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [episode]);

  /**
   * gerer la lecture/pause
   */
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  /**
   * Met a jour le temps actuel pendant la lecture
   */
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  /**
   * Charge les metadonnees de l'audio
   */
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  /**
   * Gererle changement de position dans l'audio
   */
  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  /**
   * Gerer le changement  volume
   */
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  };

  /**
   * Formater le temps de l'audio
   */
  const formatTime = (time) => {
    if (isNaN(time)) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Si aucun épisode n'est selectionne
  if (!episode) {
    return (
      <div className="audio-player audio-player-empty">
        <p>Sélectionnez un épisode pour commencer la lecture</p>
      </div>
    );
  }

  return (
    <div className="audio-player">
      {/* elemment audio HTML5 */}
      <audio
        ref={audioRef}
        src={episode.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Informations sur episode en cours */}
      <div className="audio-player-info">
        {episode.podcast?.imageUrl && (
          <img 
            src={getImageUrl(episode.podcast.imageUrl)} 
            alt={episode.podcast?.title} 
            className="audio-player-image"
          />
        )}
        <div className="audio-player-details">
          <p className="audio-player-podcast">{episode.podcast?.title || 'Podcast'}</p>
          <p className="audio-player-title">{episode.title}</p>
        </div>
      </div>

      {/* Controler  lecture */}
      <div className="audio-player-controls">
        {/* Bouton lecture/pause */}
        <button 
          className="btn-play-pause" 
          onClick={togglePlayPause}
          title={isPlaying ? 'Pause' : 'Lecture'}
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>

        {/* Barre de progression */}
        <div className="audio-player-progress">
          <span className="audio-player-time">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="audio-player-slider"
          />
          <span className="audio-player-time">{formatTime(duration)}</span>
        </div>

        {/* Controler  volume */}
        <div className="audio-player-volume">
          <span>🔊</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="audio-player-volume-slider"
          />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
