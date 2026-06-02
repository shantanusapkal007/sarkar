import React, { useEffect, useRef } from 'react';

export const DreamCanvas = ({ scene, triggerExplosion, userTouch }) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const shootingStarsRef = useRef([]);
  const petalsRef = useRef([]);
  const ripplesRef = useRef([]);
  const sceneRef = useRef(scene);

  // Sync scene prop to ref for thread-safe animation loop
  useEffect(() => {
    sceneRef.current = scene;
    initSceneParticles(scene);
  }, [scene]);

  // Handle explosion trigger from parent (Scene 6 climax)
  useEffect(() => {
    if (triggerExplosion) {
      spawnExplosion();
    }
  }, [triggerExplosion]);

  // Track touches to spawn garden petals or river ripples
  useEffect(() => {
    if (!userTouch) return;
    const { x, y } = userTouch;
    const currentScene = sceneRef.current;
    
    if (currentScene === 3) {
      // Spawn blooming garden petals
      for (let i = 0; i < 8; i++) {
        petalsRef.current.push(createPetal(x, y, true));
      }
    } else if (currentScene === 4) {
      // Spawn river ripples
      for (let i = 0; i < 5; i++) {
        ripplesRef.current.push(createRipple(x, y));
      }
    }
  }, [userTouch]);

  // Particle Initializers
  const initSceneParticles = (currentScene) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width;
    const h = canvas.height;
    
    particlesRef.current = [];
    shootingStarsRef.current = [];
    
    if (currentScene === 1 || currentScene === 2) {
      // Create starry sky background particles
      for (let i = 0; i < 80; i++) {
        particlesRef.current.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: Math.random() * 1.5 + 0.5,
          alpha: Math.random(),
          speed: Math.random() * 0.02 + 0.005,
          color: Math.random() > 0.3 ? '#ffffff' : '#fcd34d' // white or gold
        });
      }
    } else if (currentScene === 3) {
      // Initialize floating petals
      petalsRef.current = [];
      for (let i = 0; i < 25; i++) {
        petalsRef.current.push(createPetal(Math.random() * w, Math.random() * h, false));
      }
    } else if (currentScene === 5) {
      // Create drifting lantern lights (large warm soft bokeh)
      for (let i = 0; i < 15; i++) {
        particlesRef.current.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: Math.random() * 30 + 15,
          alpha: Math.random() * 0.4 + 0.1,
          speedY: -(Math.random() * 0.4 + 0.15),
          speedX: (Math.random() - 0.5) * 0.2,
          pulse: Math.random() * 0.02,
          pulseDir: 1,
          color: Math.random() > 0.5 ? 'rgba(252, 211, 77, 0.25)' : 'rgba(255, 255, 255, 0.2)' // soft gold/ivory
        });
      }
    } else if (currentScene === 7) {
      // Slowly drifting white dust in the white screen
      for (let i = 0; i < 40; i++) {
        particlesRef.current.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: Math.random() * 2 + 1,
          alpha: Math.random() * 0.5 + 0.2,
          speedY: -(Math.random() * 0.1 + 0.05),
          speedX: (Math.random() - 0.5) * 0.05,
          color: 'rgba(107, 99, 117, 0.4)' // soft elegant gray-purple dust
        });
      }
    }
  };

  const createPetal = (x, y, isTouch = false) => {
    return {
      x,
      y,
      size: Math.random() * 6 + 4,
      alpha: Math.random() * 0.6 + 0.4,
      speedY: Math.random() * 0.8 + 0.4,
      speedX: -(Math.random() * 0.6 + 0.2),
      angle: Math.random() * Math.PI * 2,
      spinSpeed: (Math.random() - 0.5) * 0.02,
      isTouch,
      color: Math.random() > 0.5 ? '#e9d5ff' : '#fafaf9' // soft lavender or soft ivory
    };
  };

  const createRipple = (x, y) => {
    return {
      x,
      y,
      size: Math.random() * 1.5 + 0.5,
      alpha: 1,
      speedY: (Math.random() - 0.5) * 0.3,
      speedX: -(Math.random() * 1.5 + 0.5), // flow to the left
      life: 1.0,
      decay: Math.random() * 0.015 + 0.01
    };
  };

  const spawnExplosion = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width;
    const h = canvas.height;
    
    // Clear other particles and launch a massive golden dust orbital vortex
    particlesRef.current = [];
    
    const centerX = w / 2;
    const centerY = h / 2;
    
    // Spawn 250 golden explosion particles
    for (let i = 0; i < 250; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      
      particlesRef.current.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3 + 1,
        alpha: 1,
        decay: Math.random() * 0.008 + 0.004,
        orbit: Math.random() > 0.6,
        angle: angle,
        radius: 0,
        orbitSpeed: (Math.random() * 0.01 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
        color: `rgba(252, 211, 77, ${Math.random() * 0.8 + 0.2})` // champagne gold particles
      });
    }
  };

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
      
      // Re-initialize for new sizes
      initSceneParticles(sceneRef.current);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Canvas render frame loop
    const render = () => {
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      const currentScene = sceneRef.current;
      
      ctx.clearRect(0, 0, w, h);

      // Periodically spawn shooting stars in Scene 1 & 2
      if ((currentScene === 1 || currentScene === 2) && Math.random() < 0.004 && shootingStarsRef.current.length < 2) {
        shootingStarsRef.current.push({
          x: Math.random() * w * 0.6 + w * 0.4,
          y: 0,
          vx: -(Math.random() * 4 + 4),
          vy: Math.random() * 3 + 3,
          length: Math.random() * 60 + 40,
          alpha: 1
        });
      }

      // Render Twinkling Stars
      if (currentScene === 1 || currentScene === 2) {
        particlesRef.current.forEach(p => {
          p.alpha += p.speed;
          if (p.alpha > 1 || p.alpha < 0.1) {
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
          grad.addColorStop(0.3, 'rgba(252, 211, 77, 0.6)');
          grad.addColorStop(1, 'rgba(252, 211, 77, 0)');
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.5;
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s.x + s.length, s.y - s.length * 0.7);
          ctx.stroke();

          s.x += s.vx;
          s.y += s.vy;
          s.alpha -= 0.015;

          return s.x > -s.length && s.y < h + s.length;
        });
      }

      // Render Floating Garden Petals
      if (currentScene === 3) {
        petalsRef.current = petalsRef.current.filter(p => {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          
          ctx.beginPath();
          // Draw organic Ghibli flower petal path
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(-p.size / 2, p.size / 2, 0, p.size);
          ctx.quadraticCurveTo(p.size / 2, p.size / 2, 0, 0);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.fill();
          
          ctx.restore();

          p.x += p.speedX;
          p.y += p.speedY;
          p.angle += p.spinSpeed;

          // Wrap or clear
          if (p.isTouch && p.y > h + 20) return false;
          if (!p.isTouch && p.y > h + 20) {
            p.y = -20;
            p.x = Math.random() * w;
          }
          if (p.x < -20) {
            p.x = w + 20;
          }
          return true;
        });
      }

      // Render River Ripples
      if (currentScene === 4) {
        // Render simple glowing river current in background
        ctx.beginPath();
        const riverGrad = ctx.createLinearGradient(0, h * 0.5, w, h * 0.6);
        riverGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        riverGrad.addColorStop(0.3, 'rgba(252, 211, 77, 0.02)');
        riverGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.04)');
        riverGrad.addColorStop(0.7, 'rgba(192, 132, 252, 0.02)');
        riverGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = riverGrad;
        ctx.fillRect(0, h * 0.35, w, h * 0.3);

        ripplesRef.current = ripplesRef.current.filter(r => {
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.size * (2 - r.life), 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(252, 211, 77, ' + (r.life * 0.4) + ')';
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'rgba(252, 211, 77, 0.8)';
          ctx.fill();
          ctx.shadowBlur = 0; // reset shadow

          r.x += r.speedX;
          r.y += r.speedY;
          r.life -= r.decay;

          return r.life > 0 && r.x > -20;
        });
      }

      // Render Room of Unspoken Things Lanterns
      if (currentScene === 5) {
        particlesRef.current.forEach(p => {
          p.alpha += p.pulse * p.pulseDir;
          if (p.alpha > 0.45 || p.alpha < 0.1) {
            p.pulseDir = -p.pulseDir;
          }
          
          ctx.save();
          ctx.beginPath();
          const radial = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          radial.addColorStop(0, p.color);
          radial.addColorStop(0.5, p.color.replace('0.25', '0.08').replace('0.2', '0.06'));
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

      // Render Climax Golden Storm explosion
      if (currentScene === 6) {
        particlesRef.current = particlesRef.current.filter(p => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#fcd34d';
          ctx.fill();
          ctx.shadowBlur = 0; // reset shadow

          if (p.orbit) {
            // Orbital sweep around center
            p.angle += p.orbitSpeed;
            p.radius += 1.5;
            p.x = w / 2 + Math.cos(p.angle) * p.radius;
            p.y = h / 2 + Math.sin(p.angle) * p.radius;
            p.alpha -= 0.0035;
          } else {
            // Standard explosive linear velocity
            p.x += p.vx;
            p.y += p.vy;
            // apply gentle drag/gravity to float upward
            p.vx *= 0.98;
            p.vy *= 0.98;
            p.vy -= 0.02; // float up
            p.alpha -= p.decay;
          }

          return p.alpha > 0 && p.x > -20 && p.x < w + 20 && p.y > -20 && p.y < h + 20;
        });
      }

      // Render Final Scene quiet gray-purple dust
      if (currentScene === 7) {
        particlesRef.current.forEach(p => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.fill();

          p.x += p.speedX;
          p.y += p.speedY;

          if (p.y < -20) {
            p.y = h + 20;
            p.x = Math.random() * w;
          }
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
  }, []);

  return (
    <div className="canvas-container">
      <canvas ref={canvasRef} />
    </div>
  );
};
