import { useMemo, useRef, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Gift, Heart, Sparkles, Star } from 'lucide-react';
import gsap from 'gsap';
import './App.css';
import heroArt from './assets/hero.png';
import { DreamCanvas } from './components/DreamCanvas';
import { MuteToggle } from './components/MuteToggle';
import { audioEngine } from './utils/audioEngine';

const PHOTOS = {
  tender: '/photo_2026-06-02_15-23-01.jpg',
  birthday: '/photo_2026-06-02_15-23-03.jpg',
  garden: '/photo_2026-06-02_15-23-07.jpg',
  sunlight: '/photo_2026-06-02_15-23-08.jpg',
  mirror: '/photo_2026-06-02_15-23-11.jpg',
  close: '/photo_2026-06-02_15-23-19.jpg',
};

// 6 Unique Photos (no duplicates)
const PHOTO_LIST = [
  PHOTOS.birthday,
  PHOTOS.garden,
  PHOTOS.tender,
  PHOTOS.sunlight,
  PHOTOS.mirror,
  PHOTOS.close,
];

const chapters = [
  {
    eyebrow: '01 / The Birthday Overture',
    title: 'Tonight, the world has one beautiful reason to glow.',
    copy:
      'This is not just a wish. It is a small gallery of every light you bring: softness, laughter, courage, and the kind of presence that makes ordinary days feel chosen.',
    cta: 'Begin the wish',
    backdrop: PHOTOS.birthday,
  },
  {
    eyebrow: '02 / Memory Constellation',
    title: 'Every photograph keeps a little piece of forever.',
    copy:
      'Tap each frame. Some memories are grand, some are quiet, but all of them say the same thing: you made the story warmer by being in it.',
    cta: 'Enter the blooming garden',
    backdrop: PHOTOS.garden,
  },
  {
    eyebrow: '03 / The Blooming Garden',
    title: 'Wherever your smile lands, something starts to bloom.',
    copy:
      'A birthday should feel alive. Touch the garden and let the page answer you with petals, golden sparks, and words that float like tiny blessings.',
    cta: 'Enter the 3D Sanctuary',
    backdrop: PHOTOS.sunlight,
  },
  {
    eyebrow: '04 / The 3D Photo Prism',
    title: 'Every angle reveals another beautiful facet of you.',
    copy:
      'Drag your finger across the crystal prism. Each rotation reflects a different side of your story, showing how one soul can hold an entire universe of lights.',
    cta: 'Ascend to the wish',
    backdrop: PHOTOS.tender,
  },
  {
    eyebrow: '05 / The Birthday Star',
    title: 'Make one wish. I will make the rest into a prayer.',
    copy:
      'May this year protect your heart, multiply your joy, surprise you gently, and return to you every ounce of love you give so freely.',
    cta: 'Reveal the birthday star',
    backdrop: PHOTOS.close,
  },
];

const memories = [
  {
    title: 'The Birthday Light',
    label: 'Cake, wishes, glow',
    note:
      'You, holding celebration like it belongs naturally in your hands. A whole birthday room made brighter because you were in it.',
    src: PHOTOS.birthday,
  },
  {
    title: 'The Green Day',
    label: 'Sun, palms, us',
    note:
      'A day with air, color, and that easy kind of happiness that does not need to explain itself.',
    src: PHOTOS.garden,
  },
  {
    title: 'The Quiet Smile',
    label: 'Softest second',
    note:
      'A candid little moment, almost shy, but full of the sweetness that makes memory stay.',
    src: PHOTOS.tender,
  },
  {
    title: 'The Sunlit Frame',
    label: 'Bright and fearless',
    note:
      'You smiling under the daylight, carrying warmth so naturally the whole picture feels alive.',
    src: PHOTOS.sunlight,
  },
  {
    title: 'The Secret Mirror',
    label: 'Close, playful, ours',
    note:
      'The kind of photo that feels like a private laugh saved inside glass.',
    src: PHOTOS.mirror,
  },
  {
    title: 'The Wind-Kissed One',
    label: 'Effortless beauty',
    note:
      'A bright little portrait of confidence, softness, and the beautiful chaos of real life.',
    src: PHOTOS.close,
  },
];

// Idea 3: Masked GSAP Staggered Word Reveal Component
const MaskedText = ({ text, className = '' }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = containerRef.current.querySelectorAll('.masked-word');
            gsap.fromTo(
              elements,
              { y: '110%', opacity: 0 },
              {
                y: '0%',
                opacity: 1,
                duration: 0.85,
                stagger: 0.04,
                ease: 'power4.out',
                overwrite: 'auto'
              }
            );
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [text]);

  const words = text.split(' ');

  return (
    <span ref={containerRef} className={`masked-text-container ${className}`} style={{ display: 'block', overflow: 'hidden' }}>
      {words.map((word, index) => (
        <span
          key={index}
          className="masked-word-wrapper"
          style={{
            display: 'inline-block',
            overflow: 'hidden',
            marginRight: '0.24em',
            verticalAlign: 'bottom'
          }}
        >
          <span
            className="masked-word"
            style={{
              display: 'inline-block',
              transform: 'translateY(110%)',
              opacity: 0,
              willChange: 'transform, opacity'
            }}
          >
            {word}
          </span>
        </span>
      ))}
    </span>
  );
};

function App() {
  const [scene, setScene] = useState(1);
  const [activeSection, setActiveSection] = useState(1);
  const [audioActive, setAudioActive] = useState(false);
  const [activeMemory, setActiveMemory] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const [gardenMarks, setGardenMarks] = useState([]);
  const [triggerExplosion, setTriggerExplosion] = useState(false);
  const [userTouch, setUserTouch] = useState(null);
  
  const artworkRef = useRef(null);
  const prismRef = useRef(null);
  const isDraggingPrism = useRef(false);
  const startX = useRef(0);
  const currentRotationY = useRef(0);

  const backdrop = scene < 6 ? chapters[activeSection - 1]?.backdrop : PHOTOS.birthday;

  const floatingWords = useMemo(
    () => ['softness', 'light', 'laughter', 'courage', 'home', 'grace', 'forever'],
    []
  );

  // Opens the website at the absolute top section
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Set up general touch / click listener to auto-start MP3 and respect browser policies
  useEffect(() => {
    const handleGesture = () => {
      if (!audioActive) {
        audioEngine.init();
        setAudioActive(true);
      }
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('scroll', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
    };

    window.addEventListener('click', handleGesture);
    window.addEventListener('scroll', handleGesture);
    window.addEventListener('touchstart', handleGesture, { passive: true });

    return () => {
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('scroll', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
    };
  }, [audioActive]);

  // Viewport IntersectionObserver to track and transition particle canvas states dynamically
  useEffect(() => {
    if (scene >= 6) return;

    const stages = document.querySelectorAll('.stage');
    const observerOptions = {
      root: null,
      rootMargin: '-35% 0px -35% 0px', // Trigger when section centers in middle 30% of viewport
      threshold: 0.05,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute('data-section-index'), 10);
          if (!isNaN(index)) {
            setActiveSection(index);
          }
        }
      });
    }, observerOptions);

    stages.forEach((stage) => observer.observe(stage));

    return () => observer.disconnect();
  }, [scene]);

  // Smooth scroll helper to navigate between sections
  const scrollToSection = (index) => {
    const targetSection = document.querySelector(`[data-section-index="${index}"]`);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleBegin = () => {
    audioEngine.init();
    setAudioActive(true);
    scrollToSection(2);
  };

  const handleToGarden = () => scrollToSection(3);
  const handleToPrism = () => scrollToSection(4);
  const handleToWish = () => scrollToSection(5);

  // Idea 1: Smooth 3D Card Hover / Touch Coordinates Tilt depth binding
  const handleCardTilt = (event, element) => {
    const rect = element.getBoundingClientRect();
    const clientX = event.touches?.[0]?.clientX ?? event.clientX;
    const clientY = event.touches?.[0]?.clientY ?? event.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    // Elegant 11 degrees maximum rotation sweep
    const rotateY = ((x / rect.width) - 0.5) * 11;
    const rotateX = -((y / rect.height) - 0.5) * 11;
    
    gsap.to(element, {
      rotateX,
      rotateY,
      transformPerspective: 800,
      duration: 0.35,
      ease: 'power2.out',
    });
  };

  const handleCardReset = (element) => {
    gsap.to(element, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.65,
      ease: 'power3.out',
    });
  };

  const handleArtworkMove = (event) => {
    const rect = artworkRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clientX = event.touches?.[0]?.clientX ?? event.clientX;
    const clientY = event.touches?.[0]?.clientY ?? event.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 20;
    const rotateX = -((y / rect.height) - 0.5) * 20;

    gsap.to(artworkRef.current, {
      rotateX,
      rotateY,
      transformPerspective: 1000,
      duration: 0.5,
      ease: 'power2.out',
    });
  };

  const resetArtwork = () => {
    if (!artworkRef.current) return;
    gsap.to(artworkRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.85,
      ease: 'power3.out',
    });
  };

  const handleGardenTouch = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const clientX = event.touches?.[0]?.clientX ?? event.clientX;
    const clientY = event.touches?.[0]?.clientY ?? event.clientY;
    const mark = {
      id: `${Date.now()}-${Math.random()}`,
      x: clientX - rect.left,
      y: clientY - rect.top,
      size: Math.floor(Math.random() * 40) + 38,
      delay: Math.random() * 0.12,
    };

    setUserTouch({ x: clientX - rect.left, y: clientY - rect.top, time: Date.now() });
    setGardenMarks((items) => [...items.slice(-18), mark]);
  };

  // 3D Photo Prism Drag Helpers
  const handlePrismStart = (event) => {
    isDraggingPrism.current = true;
    startX.current = event.touches?.[0]?.clientX ?? event.clientX;
  };

  const handlePrismMove = (event) => {
    if (!isDraggingPrism.current || !prismRef.current) return;
    const clientX = event.touches?.[0]?.clientX ?? event.clientX;
    const deltaX = clientX - startX.current;
    
    const targetRotation = currentRotationY.current + deltaX * 0.6;
    
    gsap.to(prismRef.current, {
      rotateY: targetRotation,
      transformPerspective: 1200,
      duration: 0.4,
      ease: 'power2.out'
    });
  };

  const handlePrismEnd = () => {
    if (!isDraggingPrism.current) return;
    isDraggingPrism.current = false;
    
    if (prismRef.current) {
      const computedRotation = gsap.getProperty(prismRef.current, "rotateY") || 0;
      currentRotationY.current = computedRotation;
    }
  };

  const revealFinale = () => {
    if (triggerExplosion) return;
    setTriggerExplosion(true);
    audioEngine.playClimaxSwell();

    // Scroll to the bottom wish orb to keep focus on the stardust wave explosion
    const orb = document.querySelector('.wish-orb');
    if (orb) {
      orb.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    setTimeout(() => {
      setScene(6);
      setTriggerExplosion(false);
      audioEngine.fadeToSilence();
    }, 5400);
  };

  const renderImage = (src, alt, className = '') => {
    if (!src || imageErrors[src]) {
      return <img src={heroArt} alt={alt} className={className} />;
    }

    return (
      <img
        src={src}
        alt={alt}
        className={className}
        onError={() => setImageErrors((errors) => ({ ...errors, [src]: true }))}
      />
    );
  };

  return (
    <main
      className={`birthday-site scene-${scene}`}
      style={{ '--backdrop-photo': `url(${backdrop})` }}
    >
      <div className="scene-photo-bg" />
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />
      <div className="paper-grain" />

      {/* Viewport particle layer engine */}
      <DreamCanvas 
        scene={triggerExplosion ? 6 : (scene === 6 ? 7 : activeSection)} 
        triggerExplosion={triggerExplosion} 
        userTouch={userTouch} 
      />
      
      <MuteToggle audioActive={audioActive} />

      <AnimatePresence>
        {activeMemory && (
          <motion.div
            className="memory-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveMemory(null)}
          >
            <motion.article
              className="memory-polaroid"
              initial={{ y: 46, rotate: -4, scale: 0.88 }}
              animate={{ y: 0, rotate: 0, scale: 1 }}
              exit={{ y: 38, rotate: 4, scale: 0.92 }}
              transition={{ type: 'spring', damping: 22, stiffness: 120 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="memory-photo">
                {renderImage(activeMemory.src, activeMemory.title)}
              </div>
              <p className="memory-kicker">{activeMemory.label}</p>
              <h2>{activeMemory.title}</h2>
              <p>{activeMemory.note}</p>
              <button onClick={() => setActiveMemory(null)}>Return to the gallery</button>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {scene < 6 ? (
          <div className="story-scroll-container">
            
            {/* Section 01: The Overture */}
            <section className="stage overture-stage" data-section-index="1">
              <div className="copy-column">
                <p className="eyebrow">{chapters[0].eyebrow}</p>
                <MaskedText text={chapters[0].title} className="stage-title" />
                <p className="chapter-copy">{chapters[0].copy}</p>
                
                <motion.button
                  className="primary-action"
                  onClick={handleBegin}
                  whileTap={{ scale: 0.96 }}
                >
                  {chapters[0].cta}
                  <ArrowRight size={18} />
                </motion.button>
              </div>

              <div className="art-column">
                <div
                  ref={artworkRef}
                  className="hero-photo-theatre"
                  onMouseMove={handleArtworkMove}
                  onMouseLeave={resetArtwork}
                  onTouchMove={handleArtworkMove}
                  onTouchEnd={resetArtwork}
                >
                  <div className="halo-ring" />
                  <motion.figure
                    className="hero-main-photo"
                    animate={{ y: [0, -12, 0] }}
                    transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                  >
                    {renderImage(PHOTOS.birthday, 'Birthday celebration portrait')}
                  </motion.figure>
                  <motion.figure
                    className="hero-float-photo float-a"
                    animate={{ y: [0, 18, 0], rotate: [-8, -4, -8] }}
                    transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut' }}
                  >
                    {renderImage(PHOTOS.tender, 'Candid traditional moment')}
                  </motion.figure>
                  <motion.figure
                    className="hero-float-photo float-b"
                    animate={{ y: [0, -16, 0], rotate: [8, 4, 8] }}
                    transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
                  >
                    {renderImage(PHOTOS.close, 'Close sunny portrait')}
                  </motion.figure>
                  <div className="birthday-plaque">
                    <Gift size={18} />
                    <span>Happy Birthday</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 02: Memory Constellation */}
            <section className="stage constellation-stage" data-section-index="2">
              <div className="copy-column">
                <p className="eyebrow">{chapters[1].eyebrow}</p>
                <MaskedText text={chapters[1].title} className="stage-title" />
                <p className="chapter-copy">{chapters[1].copy}</p>
                
                <motion.button
                  className="primary-action"
                  onClick={handleToGarden}
                  whileTap={{ scale: 0.96 }}
                >
                  {chapters[1].cta}
                  <ArrowRight size={18} />
                </motion.button>
              </div>

              <div className="art-column">
                <div className="memory-wall">
                  {memories.map((memory, index) => (
                    <motion.button
                      key={`${memory.title}-${memory.src}`}
                      className="memory-card"
                      onMouseMove={(e) => handleCardTilt(e, e.currentTarget)}
                      onMouseLeave={(e) => handleCardReset(e.currentTarget)}
                      onTouchMove={(e) => handleCardTilt(e, e.currentTarget)}
                      onTouchEnd={(e) => handleCardReset(e.currentTarget)}
                      onClick={() => {
                        setActiveMemory(memory);
                      }}
                      initial={{ opacity: 0, y: 30, rotate: index % 2 ? 2.5 : -2.5 }}
                      animate={{ opacity: 1, y: 0, rotate: index % 2 ? 1.2 : -1.2 }}
                      whileHover={{ y: -8, rotate: 0, scale: 1.025 }}
                      transition={{ delay: index * 0.08, type: 'spring', damping: 18 }}
                    >
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <div>{renderImage(memory.src, memory.title)}</div>
                      <strong>{memory.title}</strong>
                    </motion.button>
                  ))}
                </div>
              </div>
            </section>

            {/* Section 03: The Blooming Garden */}
            <section className="stage garden-stage" data-section-index="3">
              <div className="copy-column">
                <p className="eyebrow">{chapters[2].eyebrow}</p>
                <MaskedText text={chapters[2].title} className="stage-title" />
                <p className="chapter-copy">{chapters[2].copy}</p>
                
                <motion.button
                  className="primary-action"
                  onClick={handleToPrism}
                  whileTap={{ scale: 0.96 }}
                >
                  {chapters[2].cta}
                  <ArrowRight size={18} />
                </motion.button>
              </div>

              <div className="art-column">
                <div
                  className="garden-panel"
                  onMouseDown={handleGardenTouch}
                  onTouchStart={handleGardenTouch}
                  style={{ '--garden-photo': `url(${PHOTOS.garden})` }}
                >
                  <div className="garden-backdrop" />
                  {gardenMarks.map((mark) => (
                    <motion.span
                      key={mark.id}
                      className="garden-bloom"
                      style={{
                        left: mark.x - mark.size/2,
                        top: mark.y - mark.size/2,
                        width: mark.size,
                        height: mark.size,
                      }}
                      initial={{ scale: 0, opacity: 0, rotate: -35 }}
                      animate={{ scale: [0, 1.15, 0.9], opacity: [0, 1, 0], rotate: 45 }}
                      transition={{ duration: 2.2, delay: mark.delay, ease: 'easeOut' }}
                    >
                      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="var(--rose-gold)" strokeWidth="1.2">
                        <circle cx="12" cy="12" r="3.5" fill="rgba(251, 113, 133, 0.18)" />
                        <path d="M12 2C9.5 2 9.5 7 12 7C14.5 7 14.5 2 12 2Z" fill="rgba(252, 211, 77, 0.08)" />
                        <path d="M12 22C9.5 22 9.5 17 12 17C14.5 17 14.5 22 12 22Z" fill="rgba(252, 211, 77, 0.08)" />
                        <path d="M2 12C2 9.5 7 9.5 7 12C7 14.5 2 14.5 2 12Z" fill="rgba(252, 211, 77, 0.08)" />
                        <path d="M22 12C22 9.5 17 9.5 17 12C17 14.5 22 14.5 22 12Z" fill="rgba(252, 211, 77, 0.08)" />
                        <circle cx="12" cy="12" r="1.2" fill="var(--champagne-gold)" />
                      </svg>
                    </motion.span>
                  ))}
                  {floatingWords.map((word, index) => (
                    <motion.span
                      key={word}
                      className={`floating-word word-${index}`}
                      animate={{ y: [0, -22, 0], opacity: [0.45, 0.92, 0.45] }}
                      transition={{ repeat: Infinity, duration: 4 + index * 0.45, ease: 'easeInOut' }}
                    >
                      {word}
                    </motion.span>
                  ))}
                  <div className="garden-photo-strip">
                    {[PHOTOS.sunlight, PHOTOS.mirror, PHOTOS.close].map((photo, index) => (
                      <motion.figure
                        key={photo}
                        animate={{ y: [0, index % 2 ? 12 : -12, 0] }}
                        transition={{ repeat: Infinity, duration: 5 + index, ease: 'easeInOut' }}
                      >
                        {renderImage(photo, `Garden memory ${index + 1}`)}
                      </motion.figure>
                    ))}
                  </div>
                  <Heart className="garden-heart" size={62} />
                  <p>Tap to grow a wish</p>
                </div>
              </div>
            </section>

            {/* Section 04: The 3D Photo Prism */}
            <section className="stage prism-stage" data-section-index="4">
              <div className="copy-column">
                <p className="eyebrow">{chapters[3].eyebrow}</p>
                <MaskedText text={chapters[3].title} className="stage-title" />
                <p className="chapter-copy">{chapters[3].copy}</p>
                
                <motion.button
                  className="primary-action"
                  onClick={handleToWish}
                  whileTap={{ scale: 0.96 }}
                >
                  {chapters[3].cta}
                  <ArrowRight size={18} />
                </motion.button>
              </div>

              <div className="art-column">
                <div 
                  className="prism-section"
                  onTouchStart={handlePrismStart}
                  onTouchMove={handlePrismMove}
                  onTouchEnd={handlePrismEnd}
                  onMouseDown={handlePrismStart}
                  onMouseMove={handlePrismMove}
                  onMouseUp={handlePrismEnd}
                  onMouseLeave={handlePrismEnd}
                  style={{
                    width: '100%',
                    height: '370px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    perspective: '1200px',
                    overflow: 'visible',
                    touchAction: 'none'
                  }}
                >
                  <div
                    ref={prismRef}
                    className="prism-3d-wrapper"
                    style={{
                      width: '210px',
                      height: '290px',
                      position: 'relative',
                      transformStyle: 'preserve-3d',
                      cursor: 'grab'
                    }}
                  >
                    {/* Panel 1 (0 deg) */}
                    <div 
                      className="glass-panel prism-face"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        transform: 'rotateY(0deg) translateZ(135px)',
                        transformStyle: 'preserve-3d',
                        backfaceVisibility: 'hidden'
                      }}
                    >
                      <div className="dream-frame" style={{ width: '100%', height: '62%' }}>
                        {renderImage(PHOTOS.sunlight, 'Prism Face 1')}
                      </div>
                      <div className="prism-poetry-container" style={{ padding: '8px 2px 2px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <span className="urdu-couplet" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', color: 'var(--champagne-gold)', fontStyle: 'italic' }}>
                          "तुम हँसो तो ये कायनात मुस्कुराए"
                        </span>
                        <span className="roman-couplet" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                          Tum hansdo toh yeh kaaynaat muskuraaye
                        </span>
                      </div>
                    </div>

                    {/* Panel 2 (120 deg) */}
                    <div 
                      className="glass-panel prism-face"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        transform: 'rotateY(120deg) translateZ(135px)',
                        transformStyle: 'preserve-3d',
                        backfaceVisibility: 'hidden'
                      }}
                    >
                      <div className="dream-frame" style={{ width: '100%', height: '62%' }}>
                        {renderImage(PHOTOS.close, 'Prism Face 2')}
                      </div>
                      <div className="prism-poetry-container" style={{ padding: '8px 2px 2px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <span className="urdu-couplet" style={{ fontFamily: 'var(--font-serif)', fontSize: '0.98rem', color: 'var(--champagne-gold)', fontStyle: 'italic' }}>
                          "हज़ार मौसम बदले मगर सादगी बेमिसाल रही"
                        </span>
                        <span className="roman-couplet" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                          Hazaar mausam badle, saadgi bemisaal rahi
                        </span>
                      </div>
                    </div>

                    {/* Panel 3 (240 deg) */}
                    <div 
                      className="glass-panel prism-face"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        transform: 'rotateY(240deg) translateZ(135px)',
                        transformStyle: 'preserve-3d',
                        backfaceVisibility: 'hidden'
                      }}
                    >
                      <div className="dream-frame" style={{ width: '100%', height: '62%' }}>
                        {renderImage(PHOTOS.birthday, 'Prism Face 3')}
                      </div>
                      <div className="prism-poetry-container" style={{ padding: '8px 2px 2px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <span className="urdu-couplet" style={{ fontFamily: 'var(--font-serif)', fontSize: '0.98rem', color: 'var(--champagne-gold)', fontStyle: 'italic' }}>
                          "तेरी सादगी में ही मेरा सारा जहां बसता है"
                        </span>
                        <span className="roman-couplet" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                          Teri saadgi mein hi mera saara jahan basta hai
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 05: The Birthday Star / Make a wish */}
            <section className="stage wish-stage" data-section-index="5">
              <div className="copy-column">
                <p className="eyebrow">{chapters[4].eyebrow}</p>
                <MaskedText text={chapters[4].title} className="stage-title" />
                <p className="chapter-copy">{chapters[4].copy}</p>
                
                {/* CLIMAX BUTTON AT THE VERY END OF ALL SCROLL SECTIONS */}
                <motion.button
                  className="primary-action"
                  onClick={revealFinale}
                  whileTap={{ scale: 0.96 }}
                >
                  {chapters[4].cta}
                  <Star size={18} />
                </motion.button>
              </div>

              <div className="art-column">
                <motion.div
                  className="wish-orb"
                  animate={{
                    scale: triggerExplosion ? [1, 1.26, 0.88, 1.06] : [1, 1.04, 1],
                    rotate: triggerExplosion ? [0, 18, -10, 0] : [0, 3, -3, 0],
                  }}
                  transition={{ repeat: triggerExplosion ? 0 : Infinity, duration: triggerExplosion ? 2 : 4 }}
                >
                  <div className="orb-core">
                    {renderImage(PHOTOS.birthday, 'Birthday wish portrait')}
                    <span>Make a wish</span>
                  </div>
                  <div className="orb-ring ring-a" />
                  <div className="orb-ring ring-b" />
                  {[PHOTOS.tender, PHOTOS.garden, PHOTOS.sunlight, PHOTOS.close].map((photo, index) => (
                    <motion.figure
                      key={photo}
                      className={`orb-photo orb-${index}`}
                      animate={{ y: [0, index % 2 ? -10 : 10, 0] }}
                      transition={{ repeat: Infinity, duration: 4 + index * 0.7, ease: 'easeInOut' }}
                    >
                      {renderImage(photo, `Orbiting memory ${index + 1}`)}
                    </motion.figure>
                  ))}
                  <Sparkles className="orb-spark" size={42} />
                </motion.div>
              </div>
            </section>
          </div>
        ) : (
          <motion.section
            key="finale"
            className="finale"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.3 }}
          >
            <motion.div
              className="final-frame"
              initial={{ y: 42, scale: 0.92 }}
              animate={{ y: 0, scale: 1 }}
              transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="final-gallery">
                {PHOTO_LIST.map((photo, index) => (
                  <motion.figure
                    key={`${photo}-${index}`}
                    className={index === 0 ? 'is-featured' : ''}
                    initial={{ opacity: 0, y: 26, rotate: index % 2 ? 3 : -3 }}
                    animate={{ opacity: 1, y: 0, rotate: index % 2 ? 1.5 : -1.5 }}
                    transition={{ delay: 0.25 + index * 0.07 }}
                  >
                    {renderImage(photo, `Final birthday memory ${index + 1}`)}
                  </motion.figure>
                ))}
              </div>

              <div className="final-copy">
                <p className="eyebrow">For your birthday</p>
                <MaskedText text="Happy Birthday, My Love" className="final-title" />
                <p>
                  I hope this year meets you with the same tenderness you give the world.
                  May it bring you mornings that feel peaceful, evenings that feel safe,
                  and dreams that arrive sooner than you expected.
                </p>
                <p>
                  You are the smile inside so many memories, the calm inside so many
                  storms, and the reason ordinary moments turn into something worth
                  saving.
                </p>
                <p className="signature">
                  Today, I celebrate you fully: your heart, your courage, your beauty,
                  and the gentle magic only you carry.
                </p>
              </div>
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}

export default App;
