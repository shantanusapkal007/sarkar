import { useEffect, useRef } from 'react';

export const DreamCanvas = ({ scene, triggerExplosion, userTouch }) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const shootingStarsRef = useRef([]);
  const petalsRef = useRef([]);
  const ripplesRef = useRef([]);
  const sceneRef = useRef(scene);
  const timeRef = useRef(0);

  // Smooth mouse tracker (tracks cursor/touch coordinate relative to window)
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, active: false });

  // Sync scene changes
  useEffect(() => {
    sceneRef.current = scene;
    initSceneParticles(scene);
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
      for (let i = 0; i < 8; i++) {
        petalsRef.current.push(create3DPetal(x, y, true));
      }
    } else if (currentScene === 4) {
      // Spawn river ripples
      for (let i = 0; i < 4; i++) {
        ripplesRef.current.push(createRipple(x, y));
      }
    }
  }, [userTouch]);

  // Track global cursor coordinates directly for fluid, zero-latency golden thread bending
  useEffect(() => {
    const handleMove = (e) => {
      const clientX = e.touches?.[0]?.clientX ?? e.clientX;
      const clientY = e.touches?.[0]?.clientY ?? e.clientY;
      
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      // Translate to canvas space
      mouseRef.current.targetX = clientX - rect.left;
      mouseRef.current.targetY = clientY - rect.top;
      mouseRef.current.active = true;
    };

    const handleLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove, { passive: true });
    window.addEventListener('mouseleave', handleLeave);
    window.addEventListener('touchend', handleLeave);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('mouseleave', handleLeave);
      window.removeEventListener('touchend', handleLeave);
    };
  }, []);

  // Particle Initializers
  function initSceneParticles(currentScene) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);
    
    particlesRef.current = [];
    shootingStarsRef.current = [];
    
    if (currentScene === 1 || currentScene === 2) {
      // Starry sky background stars with Z-depth (Idea 4 Bokeh)
      for (let i = 0; i < 55; i++) {
        const depth = Math.random(); // 0 (far, sharp) to 1 (close, bokeh)
        particlesRef.current.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: Math.random() * 1.6 + 0.4,
          z: depth,
          alpha: Math.random() * 0.75 + 0.1,
          speed: (Math.random() * 0.012 + 0.004) * (depth * 0.5 + 0.5),
          color: Math.random() > 0.45 ? '#ffffff' : '#fcd34d' // white or champagne gold
        });
      }
    } else if (currentScene === 3) {
      // Initialize floating 3D rose petals
      petalsRef.current = [];
      for (let i = 0; i < 14; i++) {
        petalsRef.current.push(create3DPetal(Math.random() * w, Math.random() * h, false));
      }
    } else if (currentScene === 5) {
      // Warm room lights (large soft drifting bokeh circles - Idea 4)
      for (let i = 0; i < 10; i++) {
        const depth = Math.random(); // 0 to 1
        particlesRef.current.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: (Math.random() * 32 + 18) * (depth * 1.2 + 0.5),
          z: depth,
          alpha: Math.random() * 0.28 + 0.08,
          speedY: -(Math.random() * 0.24 + 0.08) * (depth * 0.8 + 0.4),
          speedX: (Math.random() - 0.5) * 0.12,
          pulse: Math.random() * 0.012 + 0.003,
          pulseDir: 1,
          color: Math.random() > 0.5 ? 'rgba(252, 211, 77, 0.18)' : 'rgba(251, 113, 133, 0.14)' // gold or rose-gold
        });
      }
    } else if (currentScene === 6 || currentScene === 7) {
      // Slow champagne dust
      for (let i = 0; i < 22; i++) {
        const depth = Math.random();
        particlesRef.current.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: Math.random() * 2.2 + 0.4,
          z: depth,
          alpha: Math.random() * 0.65 + 0.15,
          speedY: -(Math.random() * 0.18 + 0.04),
          color: 'rgba(252, 211, 77, 0.32)'
        });
      }
    }
  }

  // Math-based 3D Rose Petal Generator
  function create3DPetal(x, y, isTouch = false) {
    return {
      x,
      y,
      baseSize: Math.random() * 11 + 7,
      alpha: Math.random() * 0.68 + 0.32,
      speedY: Math.random() * 0.52 + 0.28,
      speedX: -(Math.random() * 0.42 + 0.08),
      
      // 3D rotations
      pitch: Math.random() * Math.PI,
      roll: Math.random() * Math.PI,
      yaw: Math.random() * Math.PI,
      
      // Rotation velocities
      pitchSpeed: Math.random() * 0.018 + 0.008,
      rollSpeed: Math.random() * 0.022 + 0.008,
      yawSpeed: Math.random() * 0.014 - 0.007,
      
      isTouch,
      // Luxury color tones (burgundy, soft champagne, rose pink)
      color: Math.random() > 0.6 ? '#fecdd3' : (Math.random() > 0.5 ? '#fda4af' : '#ffe4e6')
    };
  }

  function createRipple(x, y) {
    return {
      x,
      y,
      size: Math.random() * 2.2 + 0.4,
      alpha: 1,
      speedY: (Math.random() - 0.5) * 0.18,
      speedX: -(Math.random() * 1.6 + 0.4), 
      life: 1.0,
      decay: Math.random() * 0.012 + 0.006
    };
  }

  function spawnExplosion() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);
    
    particlesRef.current = [];
    const centerX = w / 2;
    const centerY = h / 2;
    
    // Spawn 230 golden/rose stardust explosion elements
    for (let i = 0; i < 230; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4.6 + 1.2;
      
      particlesRef.current.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 2.8 + 0.4,
        alpha: 1,
        decay: Math.random() * 0.006 + 0.002,
        orbit: Math.random() > 0.45,
        angle: angle,
        radius: 0,
        orbitSpeed: (Math.random() * 0.007 + 0.003) * (Math.random() > 0.5 ? 1 : -1),
        color: Math.random() > 0.4 ? `rgba(252, 211, 77, ${Math.random() * 0.7 + 0.3})` : `rgba(251, 113, 133, ${Math.random() * 0.6 + 0.3})`
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

      // Interpolate cursor coords to make bending silk ribbon look organic
      const m = mouseRef.current;
      m.x += (m.targetX - m.x) * 0.08;
      m.y += (m.targetY - m.y) * 0.08;

      // Periodically spawn shooting stars in Scene 1 & 2
      if ((currentScene === 1 || currentScene === 2) && Math.random() < 0.003 && shootingStarsRef.current.length < 2) {
        shootingStarsRef.current.push({
          x: Math.random() * w * 0.5 + w * 0.5,
          y: 0,
          vx: -(Math.random() * 3.5 + 2.5),
          vy: Math.random() * 2 + 1.8,
          length: Math.random() * 45 + 25,
          alpha: 1
        });
      }

      // ----------------------------------------------------
      // Idea 5: Shimmering Golden Ribbon splines in background
      // ----------------------------------------------------
      if (currentScene <= 5) {
        timeRef.current += 0.012;
        const time = timeRef.current;
        
        ctx.save();
        // Render three layered waves with offset phase velocities
        for (let layer = 0; layer < 3; layer++) {
          ctx.beginPath();
          ctx.lineWidth = 1.2 - layer * 0.3;
          ctx.strokeStyle = layer === 0 
            ? 'rgba(252, 211, 77, 0.15)'  // Golden
            : (layer === 1 ? 'rgba(251, 113, 133, 0.11)' : 'rgba(255, 255, 255, 0.07)'); // Rose / Pearl
          
          const wavePhase = time * (0.8 + layer * 0.18) + layer * Math.PI * 0.45;
          ctx.moveTo(0, h * 0.55 + Math.sin(wavePhase) * 24);
          
          const segments = 14;
          for (let i = 1; i <= segments; i++) {
            const px = (w / segments) * i;
            let py = h * 0.55 + Math.sin(wavePhase + (i * 0.52)) * 32;
            
            // Attract ribbon mathematically toward user cursor coordinate if active
            if (m.active) {
              const dx = px - m.x;
              const dy = py - m.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              const maxDist = 340;
              if (dist < maxDist) {
                const attractionFactor = (1.0 - dist / maxDist) * 0.38;
                py += (m.y - py) * attractionFactor;
              }
            }
            ctx.lineTo(px, py);
          }
          ctx.stroke();
        }
        ctx.restore();
      }

      // Render Twinkling Starfield with Depth of Field Bokeh (Scene 1 & 2)
      if (currentScene === 1 || currentScene === 2) {
        particlesRef.current.forEach(p => {
          p.alpha += p.speed;
          if (p.alpha > 0.88 || p.alpha < 0.12) {
            p.speed = -p.speed;
          }
          
          ctx.beginPath();
          ctx.globalAlpha = Math.max(0.08, p.alpha);
          
          if (p.z > 0.76) {
            // Cinematic Bokeh Star: Draw blurred radial gradient (Idea 4)
            const bokehRadius = p.size * (p.z * 5.2 + 2);
            const radialGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, bokehRadius);
            radialGrad.addColorStop(0, p.color);
            radialGrad.addColorStop(0.35, p.color);
            radialGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            ctx.fillStyle = radialGrad;
            ctx.arc(p.x, p.y, bokehRadius, 0, Math.PI * 2);
          } else {
            // Background Star: Sharp twinkle
            ctx.fillStyle = p.color;
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          }
          ctx.fill();
        });

        // Render Shooting Stars
        shootingStarsRef.current = shootingStarsRef.current.filter(s => {
          ctx.beginPath();
          const grad = ctx.createLinearGradient(s.x, s.y, s.x + s.length, s.y - s.length * 0.7);
          grad.addColorStop(0, '#ffffff');
          grad.addColorStop(0.3, 'rgba(252, 211, 77, 0.42)');
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
          
          // Project 3D rotations into 2D scale matrices
          const scaleX = Math.cos(p.roll);
          const scaleY = Math.cos(p.pitch);
          
          ctx.scale(scaleX, scaleY);
          ctx.rotate(p.yaw);
          ctx.globalAlpha = p.alpha;
          
          // Draw detailed luxury rose petal path
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(-p.baseSize / 2, p.baseSize / 3, -p.baseSize / 2, p.baseSize, 0, p.baseSize * 1.25);
          ctx.bezierCurveTo(p.baseSize / 2, p.baseSize, p.baseSize / 2, p.baseSize / 3, 0, 0);
          
          ctx.fillStyle = p.color;
          ctx.fill();
          
          // Subtle darker pink fold outline for 3D realism
          ctx.strokeStyle = 'rgba(225, 29, 72, 0.16)';
          ctx.lineWidth = 0.55;
          ctx.stroke();

          ctx.restore();

          // Increment angles for 3D spatial rotation
          p.pitch += p.pitchSpeed;
          p.roll += p.rollSpeed;
          p.yaw += p.yawSpeed;

          p.x += p.speedX;
          p.y += p.speedY;

          // Wrap or recycle petals
          if (p.isTouch && p.y > h + 22) return false;
          if (!p.isTouch && p.y > h + 22) {
            p.y = -22;
            p.x = Math.random() * w;
          }
          if (p.x < -22) p.x = w + 22;
          
          return true;
        });
      }

      // Render River Ripples (Scene 4 River)
      if (currentScene === 4) {
        // Draw underlying warm flowing water current bed
        ctx.beginPath();
        const riverGrad = ctx.createLinearGradient(0, h * 0.5, w, h * 0.54);
        riverGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        riverGrad.addColorStop(0.35, 'rgba(252, 211, 77, 0.035)');
        riverGrad.addColorStop(0.5, 'rgba(251, 113, 133, 0.045)'); // delicate rose-gold sweep
        riverGrad.addColorStop(0.65, 'rgba(252, 211, 77, 0.035)');
        riverGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = riverGrad;
        ctx.fillRect(0, h * 0.36, w, h * 0.28);

        ripplesRef.current = ripplesRef.current.filter(r => {
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.size * (2.2 - r.life), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(252, 211, 77, ${r.life * 0.38})`;
          ctx.shadowBlur = 9;
          ctx.shadowColor = '#fcd34d';
          ctx.fill();
          ctx.shadowBlur = 0; // reset

          r.x += r.speedX;
          r.y += r.speedY;
          r.life -= r.decay;

          return r.life > 0 && r.x > -20;
        });
      }

      // Render Cinematic Depth of Field Bokeh Room Lights (Scene 5)
      if (currentScene === 5) {
        particlesRef.current.forEach(p => {
          p.alpha += p.pulse * p.pulseDir;
          if (p.alpha > 0.36 || p.alpha < 0.06) {
            p.pulseDir = -p.pulseDir;
          }
          
          ctx.save();
          ctx.beginPath();
          ctx.globalAlpha = Math.max(0.04, p.alpha);
          
          // Draw cinematic warm light bokeh using layered smooth gradients
          const radial = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          radial.addColorStop(0, p.color);
          radial.addColorStop(0.42, p.color.replace('0.18', '0.06').replace('0.14', '0.04'));
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

      // Render Climax Golden Storm stardust explosion (Scene 6)
      if (currentScene === 6 || currentScene === 7) {
        particlesRef.current = particlesRef.current.filter(p => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          
          ctx.shadowBlur = 7;
          ctx.shadowColor = '#fcd34d';
          ctx.fill();
          ctx.shadowBlur = 0; // reset

          if (p.orbit) {
            p.angle += p.orbitSpeed;
            p.radius += 1.4;
            p.x = w / 2 + Math.cos(p.angle) * p.radius;
            p.y = h / 2 + Math.sin(p.angle) * p.radius;
            p.alpha -= 0.003;
          } else {
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.985;
            p.vy *= 0.985;
            p.vy -= 0.018; // float upward slowly
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="canvas-container">
      <canvas ref={canvasRef} />
    </div>
  );
};
