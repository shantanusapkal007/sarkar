import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Sun, ArrowRight, Eye, Music, Volume2, VolumeX } from 'lucide-react';
import { DreamCanvas } from './components/DreamCanvas';
import { MuteToggle } from './components/MuteToggle';
import { audioEngine } from './utils/audioEngine';

// Photo assets defined at the root path (Vite public folder)
const PHOTO_PATHS = {
  constellation1: '/photo_2026-06-02_14-25-51.jpg',
  constellation2: '/photo_2026-06-02_14-25-54.jpg',
  garden1: '/photo_2026-06-02_14-25-59.jpg',
  garden2: '/photo_2026-06-02_14-26-02.jpg',
  river: '/photo_2026-06-02_14-26-06.jpg',
  birthday: '/photo_2026-06-02_14-26-10.jpg'
};

function App() {
  const [scene, setScene] = useState(1);
  const [audioActive, setAudioActive] = useState(false);
  const [userTouch, setUserTouch] = useState(null);
  const [triggerExplosion, setTriggerExplosion] = useState(false);
  
  // Interactive flow triggers
  const [constellationsExplored, setConstellationsExplored] = useState({ c1: false, c2: false });
  const [activePhoto, setActivePhoto] = useState(null); 
  const [gardenBlooms, setGardenBlooms] = useState([]); 
  const [butterfliesTapped, setButterfliesTapped] = useState({ b1: false, b2: false });
  const [riverProgress, setRiverProgress] = useState(0); 
  const [unspokenLights, setUnspokenLights] = useState({ l1: false, l2: false, l3: false, l4: false });
  
  // Track image load errors to render elegant fallbacks
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (key) => {
    setImageErrors(prev => ({ ...prev, [key]: true }));
  };

  // Capture gestures to trigger canvas ripples/petals
  const handleTouch = (e) => {
    const touch = e.touches ? e.touches[0] : e;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    setUserTouch({ x, y, time: Date.now() });

    // In Scene 3 (Garden): spawn gorgeous glowing SVG blooming flower objects
    if (scene === 3) {
      const newFlower = {
        id: Date.now() + Math.random(),
        x,
        y,
        size: Math.random() * 40 + 30,
        rotation: Math.random() * 360,
        color: Math.random() > 0.5 ? 'var(--lavender-mist)' : 'var(--champagne-gold)'
      };
      setGardenBlooms(prev => [...prev, newFlower]);
      audioEngine.playChime(Math.floor(Math.random() * 4));
      
      // Clean up flowers after bloom animation to save memory
      setTimeout(() => {
        setGardenBlooms(prev => prev.filter(f => f.id !== newFlower.id));
      }, 2000);
    }
  };

  // Scene 1: Enter Dreamscape on Tapping Shooting Star
  const handleStart = () => {
    audioEngine.init();
    setAudioActive(true);
    setScene(2);
  };

  // Scene 2 constellation click
  const handleConstellationClick = (key, photoUrl) => {
    setConstellationsExplored(prev => ({ ...prev, [key]: true }));
    audioEngine.playChime(Math.floor(Math.random() * 4) + 4);
    setActivePhoto(photoUrl);
  };

  // Scene 3 butterfly click
  const handleButterflyClick = (key, photoUrl) => {
    setButterfliesTapped(prev => ({ ...prev, [key]: true }));
    audioEngine.playChime(Math.floor(Math.random() * 4) + 2);
    setActivePhoto(photoUrl);
  };

  // Scene 5 light click
  const handleLightClick = (key) => {
    setUnspokenLights(prev => ({ ...prev, [key]: true }));
    audioEngine.playChime(Math.floor(Math.random() * 6));
  };

  // Scene 6 star click (climax)
  const handleBirthdayStarClick = () => {
    if (triggerExplosion) return;
    setTriggerExplosion(true);
    audioEngine.playClimaxSwell();

    // After 10 seconds, automatically fade to Scene 7 stillness
    setTimeout(() => {
      setScene(7);
      audioEngine.fadeToSilence();
    }, 11000);
  };

  // Render a gorgeous glassmorphic Ghibli-esque card when user's photo is not loaded
  const renderFallbackArt = (title, subtitle, iconType) => {
    return (
      <div 
        className="glass-panel" 
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          color: 'var(--soft-ivory)',
          textAlign: 'center',
          background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.05) 0%, rgba(0, 0, 0, 0.3) 100%)',
          border: '1.5px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
        }}
      >
        <motion.div
          animate={{ 
            scale: [1, 1.08, 1],
            rotate: [0, 8, -8, 0]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 6,
            ease: "easeInOut"
          }}
          style={{ marginBottom: '24px', color: 'var(--champagne-gold)' }}
        >
          {iconType === 'constellation' && (
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="glow-text">
              <path d="M12 3l1.912 5.886h6.192l-5.01 3.639 1.913 5.886-5.007-3.64-5.007 3.64 1.913-5.886-5.01-3.639h6.192L12 3z" />
              <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.15)" strokeDasharray="3 3" />
            </svg>
          )}
          {iconType === 'bloom' && (
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <circle cx="12" cy="12" r="4" fill="rgba(252, 211, 77, 0.2)" />
              <path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          )}
          {iconType === 'heart' && (
            <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="glow-text" style={{ filter: 'drop-shadow(0 0 15px var(--champagne-gold-glow))' }}>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="rgba(252, 211, 77, 0.15)" />
            </svg>
          )}
        </motion.div>
        
        <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.65rem', fontWeight: 300, letterSpacing: '0.08em', color: 'var(--soft-ivory)' }}>
          {title}
        </h4>
        
        <div style={{ width: '40px', height: '1px', backgroundColor: 'var(--champagne-gold-glow)', margin: '16px 0' }} />
        
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--lavender-mist)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          {subtitle}
        </p>
      </div>
    );
  };

  return (
    <div 
      onTouchStart={handleTouch}
      onMouseDown={handleTouch}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        background: 'var(--bg-midnight-gradient)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'background 5.0s cubic-bezier(0.16, 1, 0.3, 1)',
        ...(scene === 7 && { background: '#FAF9F6', color: '#3f3844' }) // soft luxury ivory warm ending
      }}
    >
      {/* Background drifting ambient blur lights for depth */}
      {scene !== 7 && (
        <>
          <div className="ambient-light ambient-gold" style={{ top: '10%', left: '5%', animation: 'float 22s infinite ease-in-out' }} />
          <div className="ambient-light ambient-lavender" style={{ bottom: '15%', right: '8%', animation: 'float 28s infinite ease-in-out' }} />
        </>
      )}

      {/* Cloud Parallax overlay */}
      {scene <= 2 && (
        <div 
          style={{
            position: 'absolute',
            bottom: 0, left: 0, width: '100%', height: '220px',
            pointerEvents: 'none', zIndex: 2,
            opacity: 0.12,
            background: 'linear-gradient(to top, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 100%)'
          }}
        >
          {/* Animated SVG Clouds */}
          <svg width="100%" height="100%" viewBox="0 0 1440 200" preserveAspectRatio="none" style={{ position: 'absolute', bottom: 0 }}>
            <path d="M0,120 C180,90 320,150 480,120 C640,90 800,160 960,130 C1120,100 1260,140 1440,110 L1440,200 L0,200 Z" fill="#fafaf9" />
          </svg>
        </div>
      )}

      {/* Custom Particle Canvas layer */}
      <DreamCanvas scene={scene} triggerExplosion={triggerExplosion} userTouch={userTouch} />

      {/* Floating Audio mute/unmute starry controls */}
      <MuteToggle audioActive={audioActive} />

      {/* Fullscreen Dreamy Photo Discovered Modal */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePhoto(null)}
            style={{
              position: 'absolute',
              top: 0, left: 0, width: '100%', height: '100%',
              backgroundColor: 'rgba(5, 6, 12, 0.95)',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              backdropFilter: 'blur(15px)',
              WebkitBackdropFilter: 'blur(15px)',
            }}
          >
            <motion.div
              initial={{ scale: 0.88, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.88, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 120 }}
              onClick={(e) => e.stopPropagation()} 
              className="glass-panel"
              style={{
                width: '100%',
                maxWidth: '380px',
                aspectRatio: '3/4.2',
                padding: '20px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1px solid rgba(255,255,255,0.15)',
                boxShadow: '0 25px 60px rgba(0,0,0,0.6)'
              }}
            >
              <div className="dream-frame" style={{ width: '100%', height: '82%', overflow: 'hidden' }}>
                {!imageErrors[activePhoto] ? (
                  <img 
                    src={activePhoto} 
                    alt="Memory Discovered" 
                    onError={() => handleImageError(activePhoto)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  renderFallbackArt("A Celestial Moment", "REVEALED IN THE DREAM", "constellation")
                )}
              </div>
              
              <div style={{ padding: '14px 4px 4px', textAlign: 'center' }}>
                <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '1.25rem', color: 'var(--soft-ivory)', letterSpacing: '0.04em' }}>
                  "Some moments never left."
                </p>
                <button 
                  onClick={() => setActivePhoto(null)}
                  style={{
                    background: 'none', border: 'none', color: 'var(--champagne-gold)',
                    fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em',
                    marginTop: '10px', cursor: 'pointer', outline: 'none'
                  }}
                >
                  Return to Dream
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Narrative Scene State Router */}
      <AnimatePresence mode="wait">
        
        {/* Scene 1: Poetic Starry Opening */}
        {scene === 1 && (
          <motion.div
            key="scene-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.2 }}
            style={{
              width: '100%',
              maxWidth: '340px',
              textAlign: 'center',
              zIndex: 10,
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* Dior luxury centered text layout */}
            <div style={{ marginBottom: '60px' }}>
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 1.8 }}
                className="poem-title glow-text"
                style={{ fontSize: '2.1rem', letterSpacing: '0.08em', fontWeight: 300 }}
              >
                Some people arrive quietly.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.0, duration: 1.8 }}
                className="poem-line"
                style={{ color: 'var(--lavender-mist)', fontSize: '1.5rem', marginTop: '12px' }}
              >
                And somehow become an entire universe.
              </motion.p>
            </div>

            {/* Pulsing Shooting Star portal button */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: [0.92, 1.08, 0.92],
                opacity: 1,
                boxShadow: ['0 0 20px var(--champagne-gold-glow)', '0 0 45px var(--champagne-gold-glow)', '0 0 20px var(--champagne-gold-glow)']
              }}
              transition={{
                scale: { repeat: Infinity, duration: 3.2, ease: 'easeInOut' },
                boxShadow: { repeat: Infinity, duration: 3.2, ease: 'easeInOut' },
                opacity: { delay: 3.6, duration: 1.2 }
              }}
              onClick={handleStart}
              className="glass-panel"
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: '1.5px solid var(--champagne-gold)',
                color: 'var(--champagne-gold)',
              }}
            >
              <Sparkles size={28} className="glow-text" />
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              transition={{ delay: 4.8, duration: 1.0 }}
              className="sub-text hint-fade"
              style={{ marginTop: '24px', fontSize: '0.65rem' }}
            >
              Touch the star to start
            </motion.p>
          </motion.div>
        )}

        {/* Scene 2: Celestial Constellations */}
        {scene === 2 && (
          <motion.div
            key="scene-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8 }}
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '60px 24px 40px',
              zIndex: 10
            }}
          >
            {/* Top poetry */}
            <div style={{ textAlign: 'center', maxWidth: '330px' }}>
              <p className="poem-line" style={{ fontSize: '1.4rem', fontStyle: 'italic' }}>
                "Memories don't live in photographs.
              </p>
              <p className="poem-line" style={{ fontSize: '1.4rem', color: 'var(--lavender-mist)', marginTop: '4px' }}>
                They live in the feelings they leave behind."
              </p>
            </div>

            {/* Draggable Celestial Sky Map */}
            <div 
              style={{
                width: '100%',
                height: '340px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Constellation connectors (SVG paths) */}
              <svg 
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  top: 0, left: 0,
                  pointerEvents: 'none'
                }}
              >
                <motion.line 
                  x1="30%" y1="25%" x2="70%" y2="65%" 
                  stroke="rgba(252, 211, 77, 0.1)" 
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 4 }}
                />
                <motion.line 
                  x1="70%" y1="65%" x2="25%" y2="80%" 
                  stroke="rgba(252, 211, 77, 0.1)" 
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 4, delay: 1.2 }}
                />
              </svg>

              {/* Constellation Star Node 1 */}
              <motion.div
                onClick={() => handleConstellationClick('c1', PHOTO_PATHS.constellation1)}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  position: 'absolute',
                  top: '25%',
                  left: '30%',
                  cursor: 'pointer',
                  zIndex: 20
                }}
              >
                <div 
                  className="glass-panel" 
                  style={{
                    padding: '14px',
                    borderRadius: '50%',
                    border: '1.5px solid var(--champagne-gold)',
                    background: 'rgba(252, 211, 77, 0.08)',
                    boxShadow: constellationsExplored.c1 ? 'none' : '0 0 25px var(--champagne-gold-glow)',
                    animation: 'pulse 2.2s infinite ease-in-out'
                  }}
                >
                  <Sparkles size={18} style={{ color: 'var(--champagne-gold)' }} />
                </div>
                <p className="sub-text" style={{ position: 'absolute', top: '-26px', left: '-25px', width: '90px', fontSize: '0.6rem' }}>
                  I. RADIANCE
                </p>
              </motion.div>

              {/* Constellation Star Node 2 */}
              <motion.div
                onClick={() => handleConstellationClick('c2', PHOTO_PATHS.constellation2)}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  position: 'absolute',
                  bottom: '30%',
                  right: '25%',
                  cursor: 'pointer',
                  zIndex: 20
                }}
              >
                <div 
                  className="glass-panel" 
                  style={{
                    padding: '14px',
                    borderRadius: '50%',
                    border: '1.5px solid var(--champagne-gold)',
                    background: 'rgba(252, 211, 77, 0.08)',
                    boxShadow: constellationsExplored.c2 ? 'none' : '0 0 25px var(--champagne-gold-glow)',
                    animation: 'pulse 2.6s infinite ease-in-out'
                  }}
                >
                  <Sparkles size={18} style={{ color: 'var(--champagne-gold)' }} />
                </div>
                <p className="sub-text" style={{ position: 'absolute', bottom: '-26px', left: '-30px', width: '100px', fontSize: '0.6rem' }}>
                  II. GRACE
                </p>
              </motion.div>
            </div>

            {/* Portal bridge trigger */}
            <div style={{ height: '70px', display: 'flex', alignItems: 'center' }}>
              <AnimatePresence>
                {constellationsExplored.c1 && constellationsExplored.c2 && (
                  <motion.button
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    onClick={() => setScene(3)}
                    className="glass-panel text-btn"
                    style={{
                      padding: '14px 32px',
                      borderRadius: '35px',
                      color: 'var(--soft-ivory)',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1.5px solid rgba(252, 211, 77, 0.3)',
                      fontFamily: 'var(--font-sans)',
                      letterSpacing: '0.18em',
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      cursor: 'pointer',
                      boxShadow: '0 10px 35px rgba(0,0,0,0.5)',
                    }}
                  >
                    DESCEND INTO THE FLOATING GARDEN <ArrowRight size={14} style={{ color: 'var(--champagne-gold)' }} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Scene 3: The Floating Garden of Moments */}
        {scene === 3 && (
          <motion.div
            key="scene-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8 }}
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '60px 24px 40px',
              zIndex: 10
            }}
          >
            {/* Top poetry */}
            <div style={{ textAlign: 'center', maxWidth: '335px' }}>
              <p className="poem-line" style={{ fontSize: '1.4rem' }}>
                "You weren't just part of the story.
              </p>
              <p className="poem-line" style={{ fontSize: '1.4rem', color: 'var(--champagne-gold)', marginTop: '4px' }}>
                You became the season everything started blooming."
              </p>
            </div>

            {/* Glowing spawning SVG flower board */}
            <div 
              style={{
                position: 'relative',
                width: '100%',
                height: '350px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Blooming SVG layered flowers spawned on user click */}
              {gardenBlooms.map(f => (
                <motion.div
                  key={f.id}
                  initial={{ scale: 0, opacity: 0, rotate: f.rotation - 45 }}
                  animate={{ scale: 1, opacity: [0, 0.9, 0], rotate: f.rotation }}
                  transition={{ duration: 2.0, ease: 'easeOut' }}
                  style={{
                    position: 'absolute',
                    left: f.x - f.size / 2,
                    top: f.y - f.size / 2,
                    width: f.size,
                    height: f.size,
                    pointerEvents: 'none'
                  }}
                >
                  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke={f.color} strokeWidth="1.5">
                    {/* Layered luxury flower petals */}
                    <circle cx="12" cy="12" r="3" fill="rgba(255,255,255,0.1)" />
                    <path d="M12 2C9.5 2 9.5 7 12 7C14.5 7 14.5 2 12 2Z" fill="rgba(255,255,255,0.05)" />
                    <path d="M12 22C9.5 22 9.5 17 12 17C14.5 17 14.5 22 12 22Z" fill="rgba(255,255,255,0.05)" />
                    <path d="M2 12C2 9.5 7 9.5 7 12C7 14.5 2 14.5 2 12Z" fill="rgba(255,255,255,0.05)" />
                    <path d="M22 12C22 9.5 17 9.5 17 12C17 14.5 22 14.5 22 12Z" fill="rgba(255,255,255,0.05)" />
                    <circle cx="12" cy="12" r="1.5" fill="var(--champagne-gold)" />
                  </svg>
                </motion.div>
              ))}

              {/* Butterflies carrying memories (swimming in sine paths) */}
              {/* Butterfly 1 */}
              <motion.div
                onClick={(e) => { e.stopPropagation(); handleButterflyClick('b1', PHOTO_PATHS.garden1); }}
                animate={{
                  x: [0, 30, -25, 0],
                  y: [0, -45, 15, 0],
                }}
                transition={{ repeat: Infinity, duration: 8.5, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  top: '15%', left: '20%',
                  cursor: 'pointer', zIndex: 30
                }}
              >
                <div 
                  className="glass-panel"
                  style={{
                    padding: '12px 20px',
                    borderRadius: '18px',
                    border: '1px solid rgba(255,255,255,0.15)',
                    boxShadow: butterfliesTapped.b1 ? 'none' : '0 4px 20px rgba(192, 132, 252, 0.3)',
                    color: 'var(--lavender-mist)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Sparkles size={14} />
                  <span style={{ fontSize: '0.7rem', letterSpacing: '0.15em', fontWeight: 300 }}>III. HER LAUGH</span>
                </div>
              </motion.div>

              {/* Butterfly 2 */}
              <motion.div
                onClick={(e) => { e.stopPropagation(); handleButterflyClick('b2', PHOTO_PATHS.garden2); }}
                animate={{
                  x: [0, -35, 20, 0],
                  y: [0, 30, -45, 0],
                }}
                transition={{ repeat: Infinity, duration: 9.5, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  bottom: '25%', right: '15%',
                  cursor: 'pointer', zIndex: 30
                }}
              >
                <div 
                  className="glass-panel"
                  style={{
                    padding: '12px 20px',
                    borderRadius: '18px',
                    border: '1px solid rgba(255,255,255,0.15)',
                    boxShadow: butterfliesTapped.b2 ? 'none' : '0 4px 20px rgba(252, 211, 77, 0.25)',
                    color: 'var(--soft-ivory)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Heart size={12} style={{ color: 'var(--champagne-gold)' }} />
                  <span style={{ fontSize: '0.7rem', letterSpacing: '0.15em', fontWeight: 300 }}>IV. HER PATH</span>
                </div>
              </motion.div>

              <p className="sub-text hint-fade" style={{ fontSize: '0.6rem', position: 'absolute', bottom: '6%', opacity: 0.45 }}>
                Grow flowers by touching screen. Tap floaters to bloom memories.
              </p>
            </div>

            {/* Portal bridge */}
            <div style={{ height: '70px', display: 'flex', alignItems: 'center' }}>
              <AnimatePresence>
                {butterfliesTapped.b1 && butterfliesTapped.b2 && (
                  <motion.button
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    onClick={() => setScene(4)}
                    className="glass-panel text-btn"
                    style={{
                      padding: '14px 32px',
                      borderRadius: '35px',
                      color: 'var(--soft-ivory)',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1.5px solid rgba(252, 211, 77, 0.3)',
                      fontFamily: 'var(--font-sans)',
                      letterSpacing: '0.18em',
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      cursor: 'pointer',
                      boxShadow: '0 10px 35px rgba(0,0,0,0.5)',
                    }}
                  >
                    ENTER THE RIVER OF TIME <ArrowRight size={14} style={{ color: 'var(--champagne-gold)' }} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Scene 4: The River of Time */}
        {scene === 4 && (
          <motion.div
            key="scene-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8 }}
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '60px 24px 40px',
              zIndex: 10
            }}
          >
            {/* Top poetry */}
            <div style={{ textAlign: 'center', maxWidth: '330px' }}>
              <p className="poem-line" style={{ fontSize: '1.4rem' }}>
                "Time kept moving.
              </p>
              <p className="poem-line" style={{ fontSize: '1.4rem', color: 'var(--lavender-mist)', marginTop: '4px' }}>
                Yet some moments never left."
              </p>
            </div>

            {/* Glowing undulating SVG water waves */}
            <div 
              style={{
                width: '100%',
                height: '260px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}
            >
              {/* Continuous Wave SVG */}
              <svg 
                width="100%" height="80px" viewBox="0 0 1440 74" fill="none" 
                style={{ 
                  position: 'absolute', 
                  top: '25%', 
                  opacity: 0.15,
                  pointerEvents: 'none'
                }}
              >
                <path d="M0,32 C120,42 240,48 360,42 C480,36 600,24 720,28 C840,32 960,48 1080,48 C1200,48 1320,38 1440,28 L1440,74 L0,74 Z" fill="rgba(252, 211, 77, 0.4)" />
              </svg>

              {/* Draggable Water current block */}
              <motion.div
                drag="x"
                dragConstraints={{ left: -140, right: 140 }}
                onDrag={(e, info) => {
                  const touch = e.touches ? e.touches[0] : e;
                  const rect = e.currentTarget.getBoundingClientRect();
                  setUserTouch({ 
                    x: touch.clientX - rect.left + Math.random() * 20 - 10, 
                    y: touch.clientY - rect.top + Math.random() * 20 - 10 
                  });

                  const progressValue = Math.min(100, Math.floor(Math.abs(info.offset.x) / 1.4));
                  setRiverProgress(progressValue);

                  if (Math.random() < 0.18) {
                    audioEngine.playChime(3);
                  }
                }}
                className="glass-panel"
                style={{
                  width: '260px',
                  height: '72px',
                  borderRadius: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'grab',
                  border: '1.5px solid rgba(252, 211, 77, 0.5)',
                  boxShadow: '0 0 25px var(--champagne-gold-glow)',
                  background: 'rgba(252, 211, 77, 0.05)',
                  position: 'relative',
                  touchAction: 'none' 
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--champagne-gold)' }}>
                  <Sparkles size={18} className="glow-text" style={{ animation: 'spin 14s infinite linear' }} />
                  <span style={{ fontSize: '0.75rem', letterSpacing: '0.22em', fontWeight: 300 }}>DRAG THE WATER</span>
                </div>
              </motion.div>

              {/* Shimmering progress indicator */}
              <div 
                style={{ 
                  width: '130px', 
                  height: '1.5px', 
                  backgroundColor: 'rgba(255,255,255,0.08)', 
                  marginTop: '36px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div 
                  style={{
                    width: `${riverProgress}%`,
                    height: '100%',
                    backgroundColor: 'var(--champagne-gold)',
                    boxShadow: '0 0 10px var(--champagne-gold)',
                    transition: 'width 0.15s ease-out'
                  }}
                />
              </div>

              <p className="sub-text hint-fade" style={{ fontSize: '0.6rem', marginTop: '18px', opacity: 0.45 }}>
                Sweep your finger back and forth to ripply unlock memories.
              </p>
            </div>

            {/* Photo revealed down stream */}
            <div style={{ height: '70px', display: 'flex', alignItems: 'center' }}>
              <AnimatePresence>
                {riverProgress >= 70 && (
                  <motion.button
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    onClick={() => {
                      setActivePhoto(PHOTO_PATHS.river);
                      setTimeout(() => setScene(5), 2000); 
                    }}
                    className="glass-panel text-btn"
                    style={{
                      padding: '14px 32px',
                      borderRadius: '35px',
                      color: 'var(--soft-ivory)',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1.5px solid rgba(252, 211, 77, 0.3)',
                      fontFamily: 'var(--font-sans)',
                      letterSpacing: '0.18em',
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      cursor: 'pointer',
                      boxShadow: '0 10px 35px rgba(0,0,0,0.5)',
                    }}
                  >
                    DISCOVER SWEPT MEMORY <ArrowRight size={14} style={{ color: 'var(--champagne-gold)' }} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Scene 5: The Room of Unspoken Things */}
        {scene === 5 && (
          <motion.div
            key="scene-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8 }}
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '60px 24px 40px',
              zIndex: 10
            }}
          >
            {/* Top poetry */}
            <div style={{ textAlign: 'center', maxWidth: '330px' }}>
              <p className="poem-line" style={{ fontSize: '1.4rem' }}>
                "In the velvet quiet of unspoken thoughts,
              </p>
              <p className="poem-line" style={{ fontSize: '1.4rem', color: 'var(--lavender-mist)', marginTop: '4px' }}>
                some feelings rise like glowing lanterns."
              </p>
            </div>

            {/* Room with beautifully animated hanging/swaying Ghibli Lanterns */}
            <div 
              style={{
                width: '100%',
                height: '340px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Hanging Lantern 1 (Sways) */}
              <motion.div
                onClick={() => handleLightClick('l1')}
                style={{
                  position: 'absolute',
                  top: '10%', left: '15%',
                  cursor: 'pointer', zIndex: 30,
                  transformOrigin: 'top center',
                  display: 'flex', flexDirection: 'column', alignItems: 'center'
                }}
                animate={{ rotate: [0, 6, -6, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
              >
                {/* Thin golden cord hanging down */}
                <div style={{ width: '1px', height: '35px', backgroundColor: 'rgba(252,211,77,0.3)' }} />
                
                <div 
                  className="glass-panel"
                  style={{
                    padding: unspokenLights.l1 ? '12px 18px' : '14px 14px',
                    borderRadius: unspokenLights.l1 ? '16px' : '50%',
                    border: '1px solid rgba(252, 211, 77, 0.4)',
                    background: unspokenLights.l1 ? 'rgba(255,255,255,0.01)' : 'rgba(252, 211, 77, 0.08)',
                    boxShadow: unspokenLights.l1 ? 'none' : '0 0 25px rgba(252, 211, 77, 0.5)',
                    transition: 'all 0.5s ease',
                    textAlign: 'center',
                    maxWidth: '140px'
                  }}
                >
                  {unspokenLights.l1 ? (
                    <p style={{ fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--soft-ivory)', fontFamily: 'var(--font-serif)' }}>
                      "The smile that stayed."
                    </p>
                  ) : (
                    <Sparkles size={16} style={{ color: 'var(--champagne-gold)' }} />
                  )}
                </div>
              </motion.div>

              {/* Hanging Lantern 2 */}
              <motion.div
                onClick={() => handleLightClick('l2')}
                style={{
                  position: 'absolute',
                  top: '35%', right: '12%',
                  cursor: 'pointer', zIndex: 30,
                  transformOrigin: 'top center',
                  display: 'flex', flexDirection: 'column', alignItems: 'center'
                }}
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{ repeat: Infinity, duration: 5.2, ease: 'easeInOut' }}
              >
                <div style={{ width: '1px', height: '25px', backgroundColor: 'rgba(252,211,77,0.3)' }} />
                
                <div 
                  className="glass-panel"
                  style={{
                    padding: unspokenLights.l2 ? '12px 18px' : '14px 14px',
                    borderRadius: unspokenLights.l2 ? '16px' : '50%',
                    border: '1px solid rgba(252, 211, 77, 0.4)',
                    background: unspokenLights.l2 ? 'rgba(255,255,255,0.01)' : 'rgba(252, 211, 77, 0.08)',
                    boxShadow: unspokenLights.l2 ? 'none' : '0 0 25px rgba(252, 211, 77, 0.5)',
                    transition: 'all 0.5s ease',
                    textAlign: 'center',
                    maxWidth: '150px'
                  }}
                >
                  {unspokenLights.l2 ? (
                    <p style={{ fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--soft-ivory)', fontFamily: 'var(--font-serif)' }}>
                      "The moment that became home."
                    </p>
                  ) : (
                    <Sparkles size={16} style={{ color: 'var(--champagne-gold)' }} />
                  )}
                </div>
              </motion.div>

              {/* Hanging Lantern 3 */}
              <motion.div
                onClick={() => handleLightClick('l3')}
                style={{
                  position: 'absolute',
                  bottom: '10%', left: '18%',
                  cursor: 'pointer', zIndex: 30,
                  transformOrigin: 'top center',
                  display: 'flex', flexDirection: 'column', alignItems: 'center'
                }}
                animate={{ rotate: [0, 4, -4, 0] }}
                transition={{ repeat: Infinity, duration: 5.8, ease: 'easeInOut' }}
              >
                <div style={{ width: '1px', height: '30px', backgroundColor: 'rgba(252,211,77,0.3)' }} />
                
                <div 
                  className="glass-panel"
                  style={{
                    padding: unspokenLights.l3 ? '12px 18px' : '14px 14px',
                    borderRadius: unspokenLights.l3 ? '16px' : '50%',
                    border: '1px solid rgba(252, 211, 77, 0.4)',
                    background: unspokenLights.l3 ? 'rgba(255,255,255,0.01)' : 'rgba(252, 211, 77, 0.08)',
                    boxShadow: unspokenLights.l3 ? 'none' : '0 0 25px rgba(252, 211, 77, 0.5)',
                    transition: 'all 0.5s ease',
                    textAlign: 'center',
                    maxWidth: '150px'
                  }}
                >
                  {unspokenLights.l3 ? (
                    <p style={{ fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--soft-ivory)', fontFamily: 'var(--font-serif)' }}>
                      "The memory that never faded."
                    </p>
                  ) : (
                    <Sparkles size={16} style={{ color: 'var(--champagne-gold)' }} />
                  )}
                </div>
              </motion.div>

              {/* Hanging Lantern 4 */}
              <motion.div
                onClick={() => handleLightClick('l4')}
                style={{
                  position: 'absolute',
                  top: '15%', right: '28%',
                  cursor: 'pointer', zIndex: 30,
                  transformOrigin: 'top center',
                  display: 'flex', flexDirection: 'column', alignItems: 'center'
                }}
                animate={{ rotate: [0, -6, 6, 0] }}
                transition={{ repeat: Infinity, duration: 6.5, ease: 'easeInOut' }}
              >
                <div style={{ width: '1px', height: '40px', backgroundColor: 'rgba(252,211,77,0.3)' }} />
                
                <div 
                  className="glass-panel"
                  style={{
                    padding: unspokenLights.l4 ? '12px 18px' : '14px 14px',
                    borderRadius: unspokenLights.l4 ? '16px' : '50%',
                    border: '1px solid rgba(252, 211, 77, 0.4)',
                    background: unspokenLights.l4 ? 'rgba(255,255,255,0.01)' : 'rgba(252, 211, 77, 0.08)',
                    boxShadow: unspokenLights.l4 ? 'none' : '0 0 25px rgba(252, 211, 77, 0.5)',
                    transition: 'all 0.5s ease',
                    textAlign: 'center',
                    maxWidth: '160px'
                  }}
                >
                  {unspokenLights.l4 ? (
                    <p style={{ fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--soft-ivory)', fontFamily: 'var(--font-serif)' }}>
                      "The laugh that made everything lighter."
                    </p>
                  ) : (
                    <Sparkles size={16} style={{ color: 'var(--champagne-gold)' }} />
                  )}
                </div>
              </motion.div>
            </div>

            {/* Portal to Climax */}
            <div style={{ height: '70px', display: 'flex', alignItems: 'center' }}>
              <AnimatePresence>
                {unspokenLights.l1 && unspokenLights.l2 && unspokenLights.l3 && unspokenLights.l4 && (
                  <motion.button
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    onClick={() => setScene(6)}
                    className="glass-panel text-btn"
                    style={{
                      padding: '14px 32px',
                      borderRadius: '35px',
                      color: 'var(--soft-ivory)',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1.5px solid rgba(252, 211, 77, 0.3)',
                      fontFamily: 'var(--font-sans)',
                      letterSpacing: '0.18em',
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      cursor: 'pointer',
                      boxShadow: '0 10px 35px rgba(0,0,0,0.5)',
                    }}
                  >
                    SUMMON THE BIRTHDAY STAR <ArrowRight size={14} style={{ color: 'var(--champagne-gold)' }} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Scene 6: The Birthday Star (Climax) */}
        {scene === 6 && (
          <motion.div
            key="scene-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.2 }}
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '24px',
              zIndex: 10,
            }}
          >
            {!triggerExplosion ? (
              <div style={{ textAlign: 'center', maxWidth: '340px' }}>
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 1.6 }}
                  className="poem-line"
                  style={{ color: 'var(--soft-ivory)', letterSpacing: '0.04em' }}
                >
                  Once every year,
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6, duration: 1.6 }}
                  className="poem-line"
                  style={{ color: 'var(--lavender-mist)', marginTop: '8px', letterSpacing: '0.04em' }}
                >
                  the universe celebrates
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.8, duration: 1.6 }}
                  className="poem-line glow-text"
                  style={{ color: 'var(--champagne-gold)', marginTop: '8px', letterSpacing: '0.04em' }}
                >
                  one of its most beautiful creations.
                </motion.p>

                {/* Pulsing heart beat star */}
                <motion.div
                  onClick={handleBirthdayStarClick}
                  animate={{
                    scale: [0.92, 1.12, 0.92],
                    boxShadow: ['0 0 25px var(--champagne-gold-glow)', '0 0 55px var(--champagne-gold-glow)', '0 0 25px var(--champagne-gold-glow)']
                  }}
                  transition={{ repeat: Infinity, duration: 2.0, ease: 'easeInOut' }}
                  className="glass-panel"
                  style={{
                    width: '94px',
                    height: '94px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    border: '2px solid var(--champagne-gold)',
                    color: 'var(--champagne-gold)',
                    margin: '64px auto 0'
                  }}
                >
                  {/* Glowing Compass star SVG */}
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="glow-text" style={{ animation: 'spin 16s infinite linear' }}>
                    <path d="M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2z" />
                  </svg>
                </motion.div>
                
                <p className="sub-text hint-fade" style={{ fontSize: '0.65rem', marginTop: '24px', opacity: 0.4 }}>
                  Touch the Birthday Star
                </p>
              </div>
            ) : (
              // Breathtaking grand visual Photo frame revealed inside Orbit Golden storm
              <motion.div
                initial={{ scale: 0.1, rotate: -35, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ 
                  type: 'spring', 
                  damping: 14, 
                  stiffness: 40,
                  duration: 2.8 
                }}
                className="glass-panel luxury-sweep"
                style={{
                  width: '100%',
                  maxWidth: '380px',
                  aspectRatio: '3/4.4',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 0 50px rgba(252, 211, 77, 0.4), var(--glass-glow)',
                  border: '1.5px solid var(--champagne-gold)',
                  background: 'rgba(5, 6, 12, 0.5)'
                }}
              >
                <div className="dream-frame" style={{ width: '100%', height: '80%', overflow: 'hidden' }}>
                  {!imageErrors.birthday ? (
                    <img 
                      src={PHOTO_PATHS.birthday} 
                      alt="Happy Birthday" 
                      onError={() => handleImageError('birthday')}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    renderFallbackArt("Happy Birthday ❤️", "OF ALL THE SEASONS, YOU REMAIN THE ONE", "heart")
                  )}
                </div>
                
                <div style={{ padding: '16px 4px 4px', textAlign: 'center' }}>
                  <p 
                    className="poem-title gold-glow-text" 
                    style={{ 
                      fontSize: '1.95rem', 
                      margin: 0,
                      fontWeight: 300,
                      letterSpacing: '0.06em',
                      animation: 'pulse 2.5s infinite ease-in-out'
                    }}
                  >
                    Happy Birthday
                  </p>
                  <p className="sub-text" style={{ fontSize: '0.7rem', marginTop: '6px', color: 'var(--soft-ivory)', letterSpacing: '0.22em' }}>
                    THE LIGHT OF OUR UNIVERSE
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Scene 7: Ethereal Final Poem Space */}
        {scene === 7 && (
          <motion.div
            key="scene-7"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 6.5 }}
            style={{
              width: '100%',
              maxWidth: '350px',
              textAlign: 'center',
              zIndex: 10,
              padding: '24px',
              color: '#3f3844' 
            }}
          >
            {/* Sequential slow text fades */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.2, duration: 2.5 }}
              className="poem-line"
              style={{ color: '#4a4150', fontSize: '1.65rem', lineHeight: 1.4, letterSpacing: '0.04em' }}
            >
              "Of all the beautiful moments,
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 4.8, duration: 2.5 }}
              className="poem-line"
              style={{ color: '#4a4150', fontSize: '1.65rem', lineHeight: 1.4, marginTop: '8px', letterSpacing: '0.04em' }}
            >
              all the changing seasons,
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 7.4, duration: 2.5 }}
              className="poem-line"
              style={{ color: '#4a4150', fontSize: '1.65rem', lineHeight: 1.4, marginTop: '8px', letterSpacing: '0.04em' }}
            >
              all the passing years,
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 10.0, duration: 2.8 }}
              className="poem-line"
              style={{ color: '#aa3bff', fontSize: '1.9rem', fontWeight: 400, marginTop: '18px', letterSpacing: '0.04em' }}
            >
              you remain my favorite."
            </motion.p>

            <motion.p
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 14.0, duration: 3.5 }}
              className="poem-title"
              style={{ color: '#aa3bff', fontSize: '2.6rem', fontWeight: 300, margin: '52px 0 28px', letterSpacing: '0.06em' }}
            >
              Happy Birthday ❤️
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.75 }}
              transition={{ delay: 18.5, duration: 4.5 }}
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.2rem',
                fontStyle: 'italic',
                color: '#5a5160',
                lineHeight: 1.55,
                maxWidth: '290px',
                margin: '0 auto'
              }}
            >
              "May your life be filled with wonder, your heart with happiness, and your days with the same light you bring into the lives of others."
            </motion.p>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

export default App;
