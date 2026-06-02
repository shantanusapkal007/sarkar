import { useEffect, useRef } from 'react';

export const DreamCanvas = ({ scene, triggerExplosion, userTouch }) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const shootingStarsRef = useRef([]);
  const petalsRef = useRef([]);
  const ripplesRef = useRef([]);
  const sceneRef = useRef(scene);

  // Sync scene changes
  useEffect(() => {
    sceneRef.current = scene;
    initSceneParticles(scene);
    // The particle initializer reads refs and should not restart this effect on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);

  // Handle Scene 5 Climax star explosion
  useEffect(() => {
    if (triggerExplosion) {
      spawnExplosion();
    }
  }, [triggerExplosion]);

  // Spawn touch-based petals or ripples
  useEffect(() => {
    if (!userTouch) return;
    const { x, y } = userTouch;
    const currentScene = sceneRef.current;
    
    if (currentScene === 3) {
      // Spawn gorgeous 3D rose petals on tap
      for (let i = 0; i < 6; i++) {
        petalsRef.current.push(create3DPetal(x, y, true));
      }
    } else if (currentScene === 4) {
      // Spawn river ripples
      for (let i = 0; i < 4; i++) {
        ripplesRef.current.push(createRipple(x, y));
      }
    }
  }, [userTouch]);

  // Particle Initializers
  function initSceneParticles(currentScene) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width;
    const h = canvas.height;
    
    particlesRef.current = [];
    shootingStarsRef.current = [];
    
    if (currentScene === 1 || currentScene === 2) {
      // Starry sky background stars
      for (let i = 0; i < 70; i++) {
        particlesRef.current.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: Math.random() * 1.5 + 0.5,
          alpha: Math.random(),
          speed: Math.random() * 0.015 + 0.005,
          color: Math.random() > 0.4 ? '#ffffff' : 'var(--champagne-gold)' 
        });
      }
    } else if (currentScene === 3) {
      // Initialize floating 3D rose petals
      petalsRef.current = [];
      for (let i = 0; i < 20; i++) {
        petalsRef.current.push(create3DPetal(Math.random() * w, Math.random() * h, false));
      }
    } else if (currentScene === 5) {
      // Warm room lights (large soft drifting bokeh circles)
      for (let i = 0; i < 12; i++) {
        particlesRef.current.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: Math.random() * 40 + 20,
          alpha: Math.random() * 0.35 + 0.1,
          speedY: -(Math.random() * 0.3 + 0.1),
          speedX: (Math.random() - 0.5) * 0.15,
          pulse: Math.random() * 0.015,
          pulseDir: 1,
          color: Math.random() > 0.5 ? 'rgba(252, 211, 77, 0.2)' : 'rgba(255, 180, 180, 0.15)' // gold/rose-gold
        });
      }
    } else if (currentScene === 6) {
      // Slow beautiful champagne dust
      for (let i = 0; i < 30; i++) {
        particlesRef.current.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: Math.random() * 2 + 0.5,
          alpha: Math.random() * 0.6 + 0.2,
          speedY: -(Math.random() * 0.15 + 0.05),
          color: 'rgba(252, 211, 77, 0.3)'
        });
      }
    }
  }

  // Math-based 3D Rose Petal Generator (pitch, roll, yaw projections)
  function create3DPetal(x, y, isTouch = false) {
    return {
      x,
      y,
      baseSize: Math.random() * 12 + 8,
      alpha: Math.random() * 0.7 + 0.3,
      speedY: Math.random() * 0.6 + 0.3,
      speedX: -(Math.random() * 0.5 + 0.1),
      
      // 3D rotations
      pitch: Math.random() * Math.PI,
      roll: Math.random() * Math.PI,
      yaw: Math.random() * Math.PI,
      
      // Rotation velocities
      pitchSpeed: (Math.random() * 0.02 + 0.01),
      rollSpeed: (Math.random() * 0.025 + 0.01),
      yawSpeed: (Math.random() * 0.015 - 0.007),
      
      isTouch,
      // Luxury color tones (burgundy, soft champagne, rose pink)
      color: Math.random() > 0.6 ? '#fecdd3' : (Math.random() > 0.5 ? '#fda4af' : '#ffe4e6')
    };
  }

  function createRipple(x, y) {
    return {
      x,
      y,
      size: Math.random() * 2 + 0.5,
      alpha: 1,
      speedY: (Math.random() - 0.5) * 0.2,
      speedX: -(Math.random() * 1.8 + 0.6), 
      life: 1.0,
      decay: Math.random() * 0.01 + 0.008
    };
  }

  function spawnExplosion() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width;
    const h = canvas.height;
    
    particlesRef.current = [];
    const centerX = w / 2;
    const centerY = h / 2;
    
    // Spawn 220 golden/crimson stardust explosion elements
    for (let i = 0; i < 220; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 1.5;
      
      particlesRef.current.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 2.5 + 0.5,
        alpha: 1,
        decay: Math.random() * 0.007 + 0.003,
        orbit: Math.random() > 0.5,
        angle: angle,
        radius: 0,
        orbitSpeed: (Math.random() * 0.008 + 0.004) * (Math.random() > 0.5 ? 1 : -1),
        color: Math.random() > 0.4 ? `rgba(252, 211, 77, ${Math.random() * 0.7 + 0.3})` : `rgba(251, 113, 133, ${Math.random() * 0.6 + 0.3})` // gold or rose
      });
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.parentNode.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      
      initSceneParticles(sceneRef.current);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // 60FPS High-Performance Render Loop
    const render = () => {
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      const currentScene = sceneRef.current;
      
      ctx.clearRect(0, 0, w, h);

      // Periodically spawn shooting stars in Scene 1 & 2
      if ((currentScene === 1 || currentScene === 2) && Math.random() < 0.003 && shootingStarsRef.current.length < 2) {
        shootingStarsRef.current.push({
          x: Math.random() * w * 0.5 + w * 0.5,
          y: 0,
          vx: -(Math.random() * 3 + 3),
          vy: Math.random() * 2 + 2,
          length: Math.random() * 50 + 30,
          alpha: 1
        });
      }

      // Render Twinkling Starfield
      if (currentScene === 1 || currentScene === 2) {
        particlesRef.current.forEach(p => {
          p.alpha += p.speed;
          if (p.alpha > 1 || p.alpha < 0.15) {
            p.speed = -p.speed;
          }
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0.1, p.alpha);
          ctx.fill();
        });

        // Render Shooting Stars
        shootingStarsRef.current = shootingStarsRef.current.filter(s => {
          ctx.beginPath();
          const grad = ctx.createLinearGradient(s.x, s.y, s.x + s.length, s.y - s.length * 0.7);
          grad.addColorStop(0, '#ffffff');
          grad.addColorStop(0.3, 'rgba(252, 211, 77, 0.45)');
          grad.addColorStop(1, 'rgba(252, 211, 77, 0)');
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.2;
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s.x + s.length, s.y - s.length * 0.7);
          ctx.stroke();

          s.x += s.vx;
          s.y += s.vy;
          s.alpha -= 0.018;

          return s.x > -s.length && s.y < h + s.length;
        });
      }

      // Render Floating 3D Rose Petals (Scene 3 Garden)
      if (currentScene === 3) {
        petalsRef.current = petalsRef.current.filter(p => {
          ctx.save();
          ctx.translate(p.x, p.y);
          
          // Project 3D rotations into 2D scale matrices!
          const scaleX = Math.cos(p.roll);
          const scaleY = Math.cos(p.pitch);
          
          ctx.scale(scaleX, scaleY);
          ctx.rotate(p.yaw);
          
          // Volumetric shading: darken color based on Y tilt (pitch)
          ctx.globalAlpha = p.alpha;
          
          // Draw detailed luxury petal path
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(-p.baseSize / 2, p.baseSize / 3, -p.baseSize / 2, p.baseSize, 0, p.baseSize * 1.2);
          ctx.bezierCurveTo(p.baseSize / 2, p.baseSize, p.baseSize / 2, p.baseSize / 3, 0, 0);
          
          ctx.fillStyle = p.color;
          ctx.fill();
          
          // Add a subtle darker pink/burgundy fold outline for 3D realism
          ctx.strokeStyle = 'rgba(225, 29, 72, 0.15)';
          ctx.lineWidth = 0.5;
          ctx.stroke();

          ctx.restore();

          // Increment angles for continuous 3D rotation
          p.pitch += p.pitchSpeed;
          p.roll += p.rollSpeed;
          p.yaw += p.yawSpeed;

          p.x += p.speedX;
          p.y += p.speedY;

          // Wrap or release
          if (p.isTouch && p.y > h + 20) return false;
          if (!p.isTouch && p.y > h + 20) {
            p.y = -20;
            p.x = Math.random() * w;
          }
          if (p.x < -20) p.x = w + 20;
          
          return true;
        });
      }

      // Render River Ripples (Scene 4 River)
      if (currentScene === 4) {
        // Draw underlying warm glowing water bed
        ctx.beginPath();
        const riverGrad = ctx.createLinearGradient(0, h * 0.5, w, h * 0.55);
        riverGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        riverGrad.addColorStop(0.3, 'rgba(252, 211, 77, 0.02)');
        riverGrad.addColorStop(0.5, 'rgba(251, 113, 133, 0.03)'); // subtle rose-gold current
        riverGrad.addColorStop(0.7, 'rgba(252, 211, 77, 0.02)');
        riverGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = riverGrad;
        ctx.fillRect(0, h * 0.35, w, h * 0.3);

        ripplesRef.current = ripplesRef.current.filter(r => {
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.size * (2 - r.life), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(252, 211, 77, ${r.life * 0.35})`;
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#fcd34d';
          ctx.fill();
          ctx.shadowBlur = 0; // reset

          r.x += r.speedX;
          r.y += r.speedY;
          r.life -= r.decay;

          return r.life > 0 && r.x > -20;
        });
      }

      // Render Room Bokeh Lights (Scene 5 Room)
      if (currentScene === 5) {
        particlesRef.current.forEach(p => {
          p.alpha += p.pulse * p.pulseDir;
          if (p.alpha > 0.4 || p.alpha < 0.08) {
            p.pulseDir = -p.pulseDir;
          }
          
          ctx.save();
          ctx.beginPath();
          const radial = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          radial.addColorStop(0, p.color);
          radial.addColorStop(0.5, p.color.replace('0.2', '0.06').replace('0.15', '0.04'));
          radial.addColorStop(1, 'rgba(0,0,0,0)');
          
          ctx.fillStyle = radial;
          ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          p.x += p.speedX;
          p.y += p.speedY;

          if (p.y < -p.size * 2) {
            p.y = h + p.size * 2;
            p.x = Math.random() * w;
          }
        });
      }

      // Render Climax Golden Storm explosion (Scene 6)
      if (currentScene === 6) {
        particlesRef.current = particlesRef.current.filter(p => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          
          ctx.shadowBlur = 6;
          ctx.shadowColor = '#fcd34d';
          ctx.fill();
          ctx.shadowBlur = 0; // reset

          if (p.orbit) {
            p.angle += p.orbitSpeed;
            p.radius += 1.3;
            p.x = w / 2 + Math.cos(p.angle) * p.radius;
            p.y = h / 2 + Math.sin(p.angle) * p.radius;
            p.alpha -= 0.003;
          } else {
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.985;
            p.vy *= 0.985;
            p.vy -= 0.015; // float upward
            p.alpha -= p.decay;
          }

          return p.alpha > 0 && p.x > -20 && p.x < w + 20 && p.y > -20 && p.y < h + 20;
        });
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
    // The render loop owns resize and particle initialization for the lifetime of the canvas.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="canvas-container">
      <canvas ref={canvasRef} />
    </div>
  );
};
