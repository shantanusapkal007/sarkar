// Clean MP3 Audio Engine
// Exclusively plays your slowed/reverb MP3 background lofi track at high volume.
// Completely disables all synthetic chimes to preserve the purity of Arijit's soundtrack.

class DreamAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    
    // Background MP3 lofi track
    this.bgAudio = new Audio('/bg_music.mp3');
    this.bgAudio.loop = true;
    
    // High volume setting (0.8 out of 1.0)
    this.bgAudio.volume = 0.8; 
  }

  // Initialize and play lofi MP3 on User Gesture
  init() {
    this.playBackgroundMusic();
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
    
    // MP3 play/pause control
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

  // Disabled as per user request to purely keep the lofi MP3 soundtrack
  playChime(index = -1) {
    // Silenced completely
  }

  // Climax swell: increase lofi music volume to absolute maximum (1.0)
  playClimaxSwell() {
    if (this.isMuted) return;
    
    // Swell lofi music to maximum volume (1.0)
    let vol = this.bgAudio.volume;
    const swellInterval = setInterval(() => {
      if (vol < 0.98) {
        vol += 0.02;
        this.bgAudio.volume = Math.min(1.0, vol);
      } else {
        clearInterval(swellInterval);
      }
    }, 100);
  }

  // Fade soundtrack out completely for Scene 7 Silence
  fadeToSilence() {
    // Slowly fade out the background music MP3 over 6 seconds
    let vol = this.bgAudio.volume;
    const fadeInterval = setInterval(() => {
      if (vol > 0.02) {
        vol -= 0.04;
        this.bgAudio.volume = Math.max(0, vol);
      } else {
        clearInterval(fadeInterval);
        this.bgAudio.pause();
      }
    }, 150);
  }
}

export const audioEngine = new DreamAudioEngine();
