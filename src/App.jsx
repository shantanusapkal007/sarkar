import React, { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Gift, Heart, Sparkles, Star } from 'lucide-react';
import gsap from 'gsap';
import './App.css';
import heroArt from './assets/hero.png';
import { DreamCanvas } from './components/DreamCanvas';
import { MuteToggle } from './components/MuteToggle';
import { audioEngine } from './utils/audioEngine';

const PUBLIC_PHOTOS = [
  '/photo_2026-06-02_14-25-51.jpg',
  '/photo_2026-06-02_14-25-54.jpg',
  '/photo_2026-06-02_14-25-59.jpg',
  '/photo_2026-06-02_14-26-02.jpg',
  '/photo_2026-06-02_14-26-06.jpg',
  '/photo_2026-06-02_14-26-10.jpg',
];

const chapters = [
  {
    eyebrow: '01 / Arrival',
    title: 'The night learned your name.',
    copy:
      'Some people arrive like noise. You arrived like light, slow and impossible to ignore.',
    cta: 'Open the first light',
  },
  {
    eyebrow: '02 / Memory Gallery',
    title: 'Every small moment became a constellation.',
    copy:
      'The smiles, the silences, the unfinished stories, the ordinary days that quietly became precious.',
    cta: 'Walk through the gallery',
  },
  {
    eyebrow: '03 / Garden',
    title: 'Wherever you are loved, something blooms.',
    copy:
      'Touch the garden and let the page answer in petals, gold dust, and little echoes of joy.',
    cta: 'Enter the letter',
  },
  {
    eyebrow: '04 / Wish',
    title: 'Today belongs to you.',
    copy:
      'May this birthday bring you softness where you need rest, courage where you need fire, and happiness that stays.',
    cta: 'Reveal the birthday star',
  },
];

const memories = [
  {
    title: 'Your Glow',
    note: 'The kind of brightness that makes even a quiet day feel dressed for celebration.',
    src: PUBLIC_PHOTOS[0],
  },
  {
    title: 'Your Grace',
    note: 'A calm strength, a beautiful heart, and the rare magic of making people feel seen.',
    src: PUBLIC_PHOTOS[1],
  },
  {
    title: 'Your Laugh',
    note: 'A little universe opening. Warm, honest, unforgettable.',
    src: PUBLIC_PHOTOS[2],
  },
  {
    title: 'Your Journey',
    note: 'Every year adds another layer to the art you already are.',
    src: PUBLIC_PHOTOS[3],
  },
];

function App() {
  const [scene, setScene] = useState(1);
  const [audioActive, setAudioActive] = useState(false);
  const [activeMemory, setActiveMemory] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const [gardenMarks, setGardenMarks] = useState([]);
  const [triggerExplosion, setTriggerExplosion] = useState(false);
  const [userTouch, setUserTouch] = useState(null);
  const artworkRef = useRef(null);

  const chapter = chapters[Math.max(0, scene - 1)] || chapters[chapters.length - 1];

  const floatingWords = useMemo(
    () => ['kindness', 'light', 'laughter', 'courage', 'home', 'grace'],
    []
  );

  const beginExperience = () => {
    audioEngine.init();
    setAudioActive(true);
    audioEngine.playChime(4);
    setScene(2);
  };

  const advance = () => {
    audioEngine.playChime(scene + 2);
    setScene((current) => Math.min(current + 1, 5));
  };

  const handleArtworkMove = (event) => {
    const rect = artworkRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clientX = event.touches?.[0]?.clientX ?? event.clientX;
    const clientY = event.touches?.[0]?.clientY ?? event.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 18;
    const rotateX = -((y / rect.height) - 0.5) * 18;

    gsap.to(artworkRef.current, {
      rotateX,
      rotateY,
      transformPerspective: 900,
      duration: 0.5,
      ease: 'power2.out',
    });
  };

  const resetArtwork = () => {
    if (!artworkRef.current) return;
    gsap.to(artworkRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.8,
      ease: 'power3.out',
    });
  };

  const handleGardenTouch = (event) => {
    if (scene !== 3) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const clientX = event.touches?.[0]?.clientX ?? event.clientX;
    const clientY = event.touches?.[0]?.clientY ?? event.clientY;
    const mark = {
      id: `${Date.now()}-${Math.random()}`,
      x: clientX - rect.left,
      y: clientY - rect.top,
      size: Math.floor(Math.random() * 48) + 42,
      delay: Math.random() * 0.2,
    };

    setUserTouch({ x: clientX, y: clientY, time: Date.now() });
    setGardenMarks((items) => [...items.slice(-14), mark]);
    audioEngine.playChime(Math.floor(Math.random() * 7));
  };

  const revealFinale = () => {
    if (triggerExplosion) return;
    setTriggerExplosion(true);
    audioEngine.playClimaxSwell();

    setTimeout(() => {
      setScene(5);
      audioEngine.fadeToSilence();
    }, 5200);
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
    <main className={`birthday-site scene-${scene}`}>
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />
      <div className="paper-grain" />

      <DreamCanvas scene={scene} triggerExplosion={triggerExplosion} userTouch={userTouch} />
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
              initial={{ y: 44, rotate: -4, scale: 0.9 }}
              animate={{ y: 0, rotate: 0, scale: 1 }}
              exit={{ y: 36, rotate: 4, scale: 0.92 }}
              transition={{ type: 'spring', damping: 22, stiffness: 120 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="memory-photo">
                {renderImage(activeMemory.src, activeMemory.title)}
              </div>
              <p className="memory-kicker">A framed little universe</p>
              <h2>{activeMemory.title}</h2>
              <p>{activeMemory.note}</p>
              <button onClick={() => setActiveMemory(null)}>Return</button>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {scene < 5 && (
          <motion.section
            key={scene}
            className="stage"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -28 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="copy-column">
              <motion.p
                className="eyebrow"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {chapter.eyebrow}
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                {chapter.title}
              </motion.h1>
              <motion.p
                className="chapter-copy"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {chapter.copy}
              </motion.p>

              {scene === 1 ? (
                <motion.button
                  className="primary-action"
                  onClick={beginExperience}
                  whileTap={{ scale: 0.96 }}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  Begin the wish
                  <ArrowRight size={18} />
                </motion.button>
              ) : scene === 4 ? (
                <motion.button
                  className="primary-action"
                  onClick={revealFinale}
                  whileTap={{ scale: 0.96 }}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  {chapter.cta}
                  <Star size={18} />
                </motion.button>
              ) : (
                <motion.button
                  className="primary-action"
                  onClick={advance}
                  whileTap={{ scale: 0.96 }}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  {chapter.cta}
                  <ArrowRight size={18} />
                </motion.button>
              )}
            </div>

            <div className="art-column">
              {scene === 1 && (
                <motion.div
                  ref={artworkRef}
                  className="hero-artwork"
                  onMouseMove={handleArtworkMove}
                  onMouseLeave={resetArtwork}
                  onTouchMove={handleArtworkMove}
                  onTouchEnd={resetArtwork}
                  initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: 0.35, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="halo-ring" />
                  <img src={heroArt} alt="Floating birthday artwork" />
                  <div className="birthday-plaque">
                    <Gift size={18} />
                    <span>Happy Birthday</span>
                  </div>
                </motion.div>
              )}

              {scene === 2 && (
                <div className="memory-grid">
                  {memories.map((memory, index) => (
                    <motion.button
                      key={memory.title}
                      className="memory-card"
                      onClick={() => {
                        setActiveMemory(memory);
                      }}
                      initial={{ opacity: 0, y: 24, rotate: index % 2 ? 2 : -2 }}
                      animate={{ opacity: 1, y: 0, rotate: index % 2 ? 1.5 : -1.5 }}
                      transition={{ delay: index * 0.12 }}
                    >
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <div>{renderImage(memory.src, memory.title)}</div>
                      <strong>{memory.title}</strong>
                    </motion.button>
                  ))}
                </div>
              )}

              {scene === 3 && (
                <div className="garden-panel" onMouseDown={handleGardenTouch} onTouchStart={handleGardenTouch}>
                  {gardenMarks.map((mark) => (
                    <motion.span
                      key={mark.id}
                      className="garden-bloom"
                      style={{
                        left: mark.x,
                        top: mark.y,
                        width: mark.size,
                        height: mark.size,
                      }}
                      initial={{ scale: 0, opacity: 0, rotate: -35 }}
                      animate={{ scale: [0, 1.1, 0.9], opacity: [0, 1, 0], rotate: 35 }}
                      transition={{ duration: 2.4, delay: mark.delay, ease: 'easeOut' }}
                    />
                  ))}
                  {floatingWords.map((word, index) => (
                    <motion.span
                      key={word}
                      className={`floating-word word-${index}`}
                      animate={{ y: [0, -20, 0], opacity: [0.45, 0.9, 0.45] }}
                      transition={{ repeat: Infinity, duration: 4 + index * 0.5, ease: 'easeInOut' }}
                    >
                      {word}
                    </motion.span>
                  ))}
                  <Heart className="garden-heart" size={58} />
                  <p>Tap the garden</p>
                </div>
              )}

              {scene === 4 && (
                <motion.div
                  className="wish-orb"
                  animate={{
                    scale: triggerExplosion ? [1, 1.3, 0.85, 1.05] : [1, 1.04, 1],
                    rotate: triggerExplosion ? [0, 18, -10, 0] : [0, 4, -4, 0],
                  }}
                  transition={{ repeat: triggerExplosion ? 0 : Infinity, duration: triggerExplosion ? 2 : 4 }}
                >
                  <div className="orb-core">
                    <Sparkles size={54} />
                    <span>Make a wish</span>
                  </div>
                  <div className="orb-ring ring-a" />
                  <div className="orb-ring ring-b" />
                </motion.div>
              )}
            </div>
          </motion.section>
        )}

        {scene === 5 && (
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
              transition={{ delay: 0.25, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="final-image">
                {renderImage(PUBLIC_PHOTOS[5], 'Birthday portrait')}
              </div>
              <div className="final-copy">
                <p className="eyebrow">For your birthday</p>
                <h1>Happy Birthday, My Love</h1>
                <p>
                  May this year be gentle with your heart, generous with your dreams,
                  and full of moments that remind you how deeply you are cherished.
                </p>
                <p className="signature">
                  You are not just wished well today. You are celebrated, treasured,
                  and loved in every quiet way.
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
