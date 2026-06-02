// Interactive Web Audio API Synthesizer & MP3 Audio Engine
// Combines your slowed/reverb MP3 background lofi track with responsive physical chimes.
// Fully optimized for mobile platforms.

class DreamAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterVolume = null;
    this.delayNode = null;
    this.isMuted = false;
    
    // Background MP3 lofi track
    this.bgAudio = new Audio('/bg_music.mp3');
    this.bgAudio.loop = true;
    this.bgAudio.volume = 0.25; // elegant low background level
    
    // Luxury Pentatonic Notes for crystal chimes (C Major Pentatonic)
    this.chimeScale = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 1174.66, 1318.51, 1567.98];
  }

  // Initialize Audio Context and play lofi MP3 on User Gesture
  init() {
    if (this.ctx) {
      // If already created, ensure context is resumed
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.playBackgroundMusic();
      return;
    }
    
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      this.playBackgroundMusic();
      return;
    }

    try {
      this.ctx = new AudioContextClass();
      
      // Master Gain for chimes
      this.masterVolume = this.ctx.createGain();
      this.masterVolume.gain.setValueAtTime(0.3, this.ctx.currentTime);
      
      // Create Delay Node (Reverb effect for chimes)
      this.delayNode = this.ctx.createDelay(2.0);
      this.delayNode.delayTime.setValueAtTime(0.6, this.ctx.currentTime);
      
      this.delayFeedback = this.ctx.createGain();
      this.delayFeedback.gain.setValueAtTime(0.4, this.ctx.currentTime);
      
      // Hook up Delay Node loop
      this.delayNode.connect(this.delayFeedback);
      this.delayFeedback.connect(this.delayNode);
      
      // Connect components
      this.delayNode.connect(this.masterVolume);
      this.masterVolume.connect(this.ctx.destination);
      
      this.playBackgroundMusic();
    } catch (e) {
      console.warn("Web Audio chimes failed to initialize, playing MP3 only: ", e);
      this.playBackgroundMusic();
    }
  }

  playBackgroundMusic() {
    if (this.isMuted) return;
    this.bgAudio.play().catch(err => {
      console.log("Audio autoplay waiting for user interaction: ", err);
    });
  }

  // Set Mute state
  setMute(state) {
    this.isMuted = state;
    const now = this.ctx ? this.ctx.currentTime : 0;
    
    // Chime mute
    if (this.masterVolume && this.ctx) {
      const targetChimeGain = this.isMuted ? 0 : 0.3;
      this.masterVolume.gain.linearRampToValueAtTime(targetChimeGain, this.ctx.currentTime + 0.4);
    }
    
    // MP3 mute
    if (this.isMuted) {
      this.bgAudio.pause();
    } else {
      this.bgAudio.play().catch(() => {});
    }
  }

  toggleMute() {
    this.setMute(!this.isMuted);
    return this.isMuted;
  }

  // Play a soft crystal pentatonic chime overlayed on music
  playChime(index = -1) {
    if (!this.ctx || this.isMuted) return;
    
    const noteFreq = index >= 0 && index < this.chimeScale.length 
      ? this.chimeScale[index] 
      : this.chimeScale[Math.floor(Math.random() * this.chimeScale.length)];

    const now = this.ctx.currentTime;
    
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const chimeGain = this.ctx.createGain();
    
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(noteFreq, now);
    
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(noteFreq * 2, now); // Octave sparkle
    
    chimeGain.gain.setValueAtTime(0, now);
    chimeGain.gain.linearRampToValueAtTime(0.08, now + 0.04); 
    chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6); 
    
    osc1.connect(chimeGain);
    osc2.connect(chimeGain);
    
    chimeGain.connect(this.masterVolume);
    chimeGain.connect(this.delayNode);
    
    osc1.start(now);
    osc2.start(now);
    
    osc1.stop(now + 1.8);
    osc2.stop(now + 1.8);
  }

  // Climax swell: increase lofi music volume and trigger grand arpeggios
  playClimaxSwell() {
    if (this.isMuted) return;
    
    // Swell lofi music to make it majestic and epic
    let vol = this.bgAudio.volume;
    const swellInterval = setInterval(() => {
      if (vol < 0.65) {
        vol += 0.05;
        this.bgAudio.volume = vol;
      } else {
        clearInterval(swellInterval);
      }
    }, 150);

    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Layer with majestic chime arpeggio sweep
    const climaxChords = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50, 1318.51]; // C4, E4, G4, C5, E5, G5, C6, E6
    
    climaxChords.forEach((freq, idx) => {
      const delay = idx * 0.12; 
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now + delay);
      
      gainNode.gain.setValueAtTime(0, now + delay);
      gainNode.gain.linearRampToValueAtTime(0.05, now + delay + 0.2); 
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + delay + 5.0); 
      
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1000, now);
      
      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.masterVolume);
      gainNode.connect(this.delayNode);
      
      osc.start(now + delay);
      osc.stop(now + delay + 6.0);
    });

    // Play sparkling arpeggios
    for (let i = 0; i < 15; i++) {
      setTimeout(() => {
        this.playChime(i % this.chimeScale.length);
      }, 400 + i * 180);
    }
  }

  // Fade soundtrack out completely for Scene 7 Silence
  fadeToSilence() {
    // Slowly fade out the background music MP3 over 6 seconds
    let vol = this.bgAudio.volume;
    const fadeInterval = setInterval(() => {
      if (vol > 0.01) {
        vol -= 0.02;
        this.bgAudio.volume = Math.max(0, vol);
      } else {
        clearInterval(fadeInterval);
        this.bgAudio.pause();
      }
    }, 150);
    
    if (!this.ctx) return;
    
    // Play a single, very quiet, extremely distant chime in the background silence
    this.silenceInterval = setInterval(() => {
      if (this.isMuted) return;
      this.playChime(0); 
    }, 10000);
  }
}

export const audioEngine = new DreamAudioEngine();
