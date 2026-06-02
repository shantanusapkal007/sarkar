import { useMemo, useRef, useState } from 'react';
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
  mirrorEcho: '/photo_2026-06-02_15-23-16.jpg',
  close: '/photo_2026-06-02_15-23-19.jpg',
};

const PHOTO_LIST = [
  PHOTOS.birthday,
  PHOTOS.garden,
  PHOTOS.tender,
  PHOTOS.sunlight,
  PHOTOS.mirror,
  PHOTOS.close,
  PHOTOS.mirrorEcho,
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
    cta: 'Take me to the wish',
    backdrop: PHOTOS.sunlight,
  },
  {
    eyebrow: '04 / The Birthday Star',
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
  {
    title: 'The Echo',
    label: 'Again, because it matters',
    note:
      'Some moments deserve to appear twice, like a favorite line in a song.',
    src: PHOTOS.mirrorEcho,
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
  const backdrop = scene < 5 ? chapter.backdrop : PHOTOS.birthday;

  const floatingWords = useMemo(
    () => ['softness', 'light', 'laughter', 'courage', 'home', 'grace', 'forever'],
    []
  );

  const beginExperience = () => {
    audioEngine.init();
    setAudioActive(true);
    audioEngine.playChime(5);
    setScene(2);
  };

  const advance = () => {
    audioEngine.playChime(scene + 3);
    setScene((current) => Math.min(current + 1, 5));
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
    if (scene !== 3) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const clientX = event.touches?.[0]?.clientX ?? event.clientX;
    const clientY = event.touches?.[0]?.clientY ?? event.clientY;
    const mark = {
      id: `${Date.now()}-${Math.random()}`,
      x: clientX - rect.left,
      y: clientY - rect.top,
      size: Math.floor(Math.random() * 54) + 46,
      delay: Math.random() * 0.16,
    };

    setUserTouch({ x: clientX, y: clientY, time: Date.now() });
    setGardenMarks((items) => [...items.slice(-18), mark]);
    audioEngine.playChime(Math.floor(Math.random() * 8));
  };

  const revealFinale = () => {
    if (triggerExplosion) return;
    setTriggerExplosion(true);
    audioEngine.playClimaxSwell();

    setTimeout(() => {
      setScene(5);
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

      <DreamCanvas scene={triggerExplosion ? 6 : scene} triggerExplosion={triggerExplosion} userTouch={userTouch} />
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
                transition={{ delay: 0.18 }}
              >
                {chapter.eyebrow}
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32 }}
              >
                {chapter.title}
              </motion.h1>
              <motion.p
                className="chapter-copy"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.48 }}
              >
                {chapter.copy}
              </motion.p>

              <motion.div
                className="scene-meter"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.58 }}
              >
                {chapters.map((item, index) => (
                  <span
                    key={item.eyebrow}
                    className={index + 1 <= scene ? 'is-lit' : ''}
                    aria-label={`Scene ${index + 1}`}
                  />
                ))}
              </motion.div>

              {scene === 1 ? (
                <motion.button
                  className="primary-action"
                  onClick={beginExperience}
                  whileTap={{ scale: 0.96 }}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.72 }}
                >
                  {chapter.cta}
                  <ArrowRight size={18} />
                </motion.button>
              ) : scene === 4 ? (
                <motion.button
                  className="primary-action"
                  onClick={revealFinale}
                  whileTap={{ scale: 0.96 }}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.72 }}
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
                  transition={{ delay: 0.72 }}
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
                  className="hero-photo-theatre"
                  onMouseMove={handleArtworkMove}
                  onMouseLeave={resetArtwork}
                  onTouchMove={handleArtworkMove}
                  onTouchEnd={resetArtwork}
                  initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: 0.25, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
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
                </motion.div>
              )}

              {scene === 2 && (
                <div className="memory-wall">
                  {memories.map((memory, index) => (
                    <motion.button
                      key={`${memory.title}-${memory.src}`}
                      className={`memory-card card-${index}`}
                      onClick={() => {
                        audioEngine.playChime(index + 1);
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
              )}

              {scene === 3 && (
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
                        left: mark.x,
                        top: mark.y,
                        width: mark.size,
                        height: mark.size,
                      }}
                      initial={{ scale: 0, opacity: 0, rotate: -35 }}
                      animate={{ scale: [0, 1.15, 0.9], opacity: [0, 1, 0], rotate: 35 }}
                      transition={{ duration: 2.5, delay: mark.delay, ease: 'easeOut' }}
                    />
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
              )}

              {scene === 4 && (
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
                <h1>Happy Birthday, My Love</h1>
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
