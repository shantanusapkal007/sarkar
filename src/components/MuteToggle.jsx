import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

export const MuteToggle = ({ audioActive }) => {
  const [muted, setMuted] = useState(false);

  const handleToggle = (e) => {
    e.stopPropagation(); // prevent triggering parent clicks
    
    // Make sure context is initialized
    audioEngine.init();
    
    const isMutedNow = audioEngine.toggleMute();
    setMuted(isMutedNow);
  };

  if (!audioActive) return null;

  return (
    <button 
      onClick={handleToggle}
      className="star-btn glass-panel"
      aria-label={muted ? "Unmute dreamscape" : "Mute dreamscape"}
      style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 50,
        width: '44px',
        height: '44px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        color: muted ? 'rgba(255,255,255,0.4)' : 'var(--champagne-gold)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      <div 
        style={{
          transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          transform: muted ? 'scale(0.9)' : 'scale(1)',
        }}
      >
        {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </div>
    </button>
  );
};
