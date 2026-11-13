'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Sparkles, Waves } from 'lucide-react';

/**
 * Interactive 3D Particle Wave Component
 * Recreates the organic, undulating 3D particle mesh from visual reference:
 * - Thousands of glowing particles in electric blue (#58A6FF) and subtle violet (#7C83FF)
 * - Occasional limited orange (#F0883E) highlights on wave crests
 * - Smooth 3D perspective projection with depth sizing and fog
 * - Realistic mouse interaction: cursor ripples, repels nearby particles, and forms organic waves
 * - Spring-damper return physics to smoothly restore resting wave state
 * - Click/touch impulse ripple physics
 * - Viewport-aware rendering loop (pauses when off-screen)
 * - Accessible (respects prefers-reduced-motion)
 */
export default function ParticleWave({ className = '', asCard = true }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [particleCount, setParticleCount] = useState(1872);
  const [isInteracting, setIsInteracting] = useState(false);

  // Mutable animation state stored in ref to prevent React re-renders on animation frames
  const simRef = useRef({
    width: 500,
    height: 440,
    dpr: 1,
    inView: true,
    reducedMotion: false,
    cols: 52,
    rows: 36,
    particles: [],
    impulses: [],
    // Camera settings
    fov: 360,
    camY: 135,
    tilt: 0.27,
    // Mouse state
    mouseX: -9999,
    mouseY: -9999,
    targetMouseX: -9999,
    targetMouseY: -9999,
    prevMouseX: -9999,
    prevMouseY: -9999,
    mouseSpeed: 0,
    mouseActive: false,
    // Time tracking
    tick: 0,
    lastTime: performance.now(),
  });

  // Initialize particle grid with 3D base coordinates and spring-damper states
  const initParticles = useCallback((cols, rows, width) => {
    const particles = [];
    const spanX = width * 1.32;
    const zMin = 220;
    const zMax = 860;

    for (let r = 0; r < rows; r++) {
      const zProgress = rows > 1 ? r / (rows - 1) : 0;
      // Exponential distribution for natural perspective depth spacing
      const z = zMin + Math.pow(zProgress, 1.15) * (zMax - zMin);

      for (let c = 0; c < cols; c++) {
        const xProgress = cols > 1 ? c / (cols - 1) : 0.5;
        const x = (xProgress - 0.5) * spanX;

        // Deterministic role assignment:
        // ~1.5% rare amber highlights, left side violet, right side electric blue
        const hash = (c * 17 + r * 31) % 97;
        const isOrange = hash === 0 || (hash === 47 && r % 4 === 0);

        // Precompute color channels (RGB)
        // Violet: #7C83FF -> (124, 131, 255)
        // Electric Blue: #58A6FF -> (88, 166, 255)
        // Highlight Orange: #F0883E -> (240, 136, 62)
        let cr, cg, cb;
        if (isOrange) {
          cr = 240;
          cg = 136;
          cb = 62;
        } else {
          // Smooth horizontal gradient from subtle violet (left) to electric blue (right)
          const t = Math.min(1, Math.max(0, xProgress * 1.15 - 0.08));
          cr = Math.round(124 + (88 - 124) * t);
          cg = Math.round(131 + (166 - 131) * t);
          cb = 255;
        }

        particles.push({
          col: c,
          row: r,
          x0: x,
          z0: z,
          cr,
          cg,
          cb,
          isOrange,
          // Physical spring-damper offsets for cursor response
          offsetX: 0,
          offsetY: 0,
          liftY: 0,
          velX: 0,
          velY: 0,
          velLift: 0,
          // Screen projection cache
          sx: 0,
          sy: 0,
          radius: 1.5,
          alpha: 0,
          visible: false,
        });
      }
    }

    return particles;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Detect reduced motion preference
    if (typeof window !== 'undefined') {
      simRef.current.reducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;
    }

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      const w = Math.max(280, Math.round(rect.width));
      const h = Math.max(280, Math.round(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const isMobile = w < 640;
      // Grid dimensions: ~1,872 particles on desktop, ~816 on mobile for 120fps performance
      const cols = isMobile ? 34 : 52;
      const rows = isMobile ? 24 : 36;

      simRef.current.width = w;
      simRef.current.height = h;
      simRef.current.dpr = dpr;
      simRef.current.cols = cols;
      simRef.current.rows = rows;
      const particles = initParticles(cols, rows, w);
      simRef.current.particles = particles;
      setParticleCount(particles.length);
    };

    resizeCanvas();

    const resizeObserver = new ResizeObserver(() => resizeCanvas());
    resizeObserver.observe(container);

    // Pause rendering when outside the viewport to save CPU and battery
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        simRef.current.inView = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    let rafId = 0;

    const render = (now) => {
      rafId = requestAnimationFrame(render);
      const sim = simRef.current;
      if (!sim.inView) return;

      const dt = Math.min((now - sim.lastTime) / 16.667, 2.0);
      sim.lastTime = now;

      // Update ambient time
      const timeSpeed = sim.reducedMotion ? 0.003 : 0.016;
      sim.tick += timeSpeed * dt;
      const t = sim.tick;

      // Smooth mouse coordinates with inertia
      if (sim.mouseActive) {
        const lerpFactor = Math.min(1, 0.18 * dt);
        sim.mouseX += (sim.targetMouseX - sim.mouseX) * lerpFactor;
        sim.mouseY += (sim.targetMouseY - sim.mouseY) * lerpFactor;
        const dx = sim.mouseX - sim.prevMouseX;
        const dy = sim.mouseY - sim.prevMouseY;
        sim.mouseSpeed = Math.hypot(dx, dy);
        sim.prevMouseX = sim.mouseX;
        sim.prevMouseY = sim.mouseY;
      } else {
        sim.mouseSpeed *= Math.pow(0.85, dt);
      }

      // Update active click/tap impulses
      for (let k = sim.impulses.length - 1; k >= 0; k--) {
        const imp = sim.impulses[k];
        imp.radius += 6.5 * dt;
        imp.strength *= Math.pow(0.93, dt);
        if (imp.radius > imp.maxRadius || imp.strength < 0.3) {
          sim.impulses.splice(k, 1);
        }
      }

      const { width: w, height: h, particles, cols, rows, fov, camY, tilt, impulses } = sim;
      const cosT = Math.cos(tilt);
      const sinT = Math.sin(tilt);
      // Position horizon line near upper edge so waves drape across middle and lower plane
      const yHorizon = h * 0.02;

      ctx.clearRect(0, 0, w, h);

      // Spring-damper physics parameters
      const springK = 0.085;
      const springDamp = Math.pow(0.82, dt);
      const repelRadius = Math.min(160, Math.max(100, w * 0.32));

      // PASS 1: Calculate 3D Wave Surface, Mouse Interaction & Perspective Projection
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Harmonic Wave Elevation Formula (multi-wave undulating diagonal swell)
        const wave1 = Math.sin((p.x0 * 0.8 + p.z0 * 0.6) * 0.0036 - t * 1.15) * 36;
        const wave2 = Math.cos((p.x0 * 0.5 - p.z0 * 0.8) * 0.0030 + t * 0.8) * 22;
        const wave3 =
          Math.sin(p.x0 * 0.0045 + t * 0.45) *
          Math.cos(p.z0 * 0.0038 - t * 0.55) *
          14;
        const baseHeight = wave1 + wave2 + wave3;

        // Apply physical mouse displacement and interactive wave crest
        let targetOffsetX = 0;
        let targetOffsetY = 0;
        let targetLiftY = 0;

        if (sim.mouseActive && p.visible) {
          const mdx = p.sx - sim.mouseX;
          const mdy = p.sy - sim.mouseY;
          const mDist = Math.hypot(mdx, mdy);

          if (mDist < repelRadius && mDist > 0.1) {
            const u = mDist / repelRadius; // 0 (center) to 1 (edge)
            // Smooth bell curve falloff
            const influence = Math.pow(Math.cos((u * Math.PI) / 2), 2);

            // Repel particles slightly away from cursor
            const pushMag = influence * (16 + Math.min(sim.mouseSpeed * 0.5, 18));
            targetOffsetX = (mdx / mDist) * pushMag;
            targetOffsetY = (mdy / mDist) * (pushMag * 0.65);

            // Create organic ripple wave around cursor (dip in center, wave crest at radius perimeter)
            const rippleAmp = 28 + Math.min(sim.mouseSpeed * 1.1, 35);
            targetLiftY = Math.sin(u * Math.PI) * influence * rippleAmp;
          }
        }

        // Apply expanding click impulse ripples
        if (impulses.length > 0 && p.visible) {
          for (let k = 0; k < impulses.length; k++) {
            const imp = impulses[k];
            const dist = Math.hypot(p.sx - imp.x, p.sy - imp.y);
            const ringDist = Math.abs(dist - imp.radius);
            if (ringDist < 42) {
              const ringFactor = Math.cos((ringDist / 42) * (Math.PI / 2));
              targetLiftY += ringFactor * imp.strength;
            }
          }
        }

        // Advance spring-damper offsets toward targets
        if (!sim.reducedMotion) {
          const forceX = (targetOffsetX - p.offsetX) * springK;
          const forceY = (targetOffsetY - p.offsetY) * springK;
          const forceLift = (targetLiftY - p.liftY) * springK;

          p.velX = (p.velX + forceX * dt) * springDamp;
          p.velY = (p.velY + forceY * dt) * springDamp;
          p.velLift = (p.velLift + forceLift * dt) * springDamp;

          p.offsetX += p.velX * dt;
          p.offsetY += p.velY * dt;
          p.liftY += p.velLift * dt;
        } else {
          p.offsetX = 0;
          p.offsetY = 0;
          p.liftY = 0;
        }

        // Combine base wave elevation with interactive lift
        const yWorld = baseHeight + p.liftY;

        // Transform world coordinates into tilted camera space
        const dy = yWorld - camY;
        const yCam = dy * cosT - p.z0 * sinT;
        const zCam = dy * sinT + p.z0 * cosT;

        if (zCam > 18) {
          const scale = fov / zCam;
          // Apply screen projection with physical cursor offset
          p.sx = w / 2 + p.x0 * scale + p.offsetX;
          p.sy = yHorizon - yCam * scale + p.offsetY;

          // Depth fog ratio (0 near -> 1 deep distance)
          const zProgress = Math.max(0, Math.min(1, (zCam - 200) / 750));

          // Boundary edge vignette (fades seamlessly on all 4 sides)
          const marginX = w * 0.08;
          const edgeFadeX = Math.min(
            1,
            Math.max(0, (p.sx + marginX) / (marginX * 1.5)),
            Math.max(0, (w + marginX - p.sx) / (marginX * 1.5))
          );
          const edgeFadeY = Math.min(
            1,
            Math.max(0, (p.sy - h * 0.18) / (h * 0.22)),
            Math.max(0, (h * 1.05 - p.sy) / (h * 0.16))
          );

          // Radius scales naturally with 3D perspective
          p.radius = Math.max(0.7, (2.5 - zProgress * 1.45) * (p.isOrange ? 1.25 : 1));

          // Alpha fade into deep distance and canvas perimeter
          const baseAlpha = p.isOrange ? 0.95 : 0.70;
          p.alpha = Math.max(0, baseAlpha * (1 - zProgress * 0.68) * edgeFadeX * edgeFadeY);
          p.visible = p.alpha > 0.01 && p.sx >= -30 && p.sx <= w + 30 && p.sy >= -30 && p.sy <= h + 30;
        } else {
          p.visible = false;
        }
      }

      // PASS 2: Draw Subtle Spatial Mesh Lines Along Wave Rows
      ctx.lineWidth = 0.55;
      for (let r = 0; r < rows; r++) {
        const rowStart = r * cols;
        for (let c = 0; c < cols - 1; c++) {
          const pA = particles[rowStart + c];
          const pB = particles[rowStart + c + 1];

          if (pA.visible && pB.visible) {
            const lineDist = Math.hypot(pB.sx - pA.sx, pB.sy - pA.sy);
            // Connect points that are reasonably adjacent in projected space
            if (lineDist < 46) {
              const lineAlpha = Math.min(pA.alpha, pB.alpha) * 0.16;
              if (lineAlpha > 0.015) {
                ctx.strokeStyle = `rgba(${pA.cr}, ${pA.cg}, ${pA.cb}, ${lineAlpha.toFixed(3)})`;
                ctx.beginPath();
                ctx.moveTo(pA.sx, pA.sy);
                ctx.lineTo(pB.sx, pB.sy);
                ctx.stroke();
              }
            }
          }
        }
      }

      // PASS 3: Render Glowing Particles with Soft Bokeh Halo
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (!p.visible) continue;

        // Soft outer glow halo (high-efficiency bloom alternative)
        ctx.fillStyle = `rgba(${p.cr}, ${p.cg}, ${p.cb}, ${(p.alpha * 0.22).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, p.radius * 2.3, 0, Math.PI * 2);
        ctx.fill();

        // Crisp illuminated core particle
        ctx.fillStyle = `rgba(${p.cr}, ${p.cg}, ${p.cb}, ${p.alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [initParticles]);

  // Pointer interaction handlers
  const handlePointerMove = (e) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    simRef.current.targetMouseX = x;
    simRef.current.targetMouseY = y;
    if (!simRef.current.mouseActive) {
      simRef.current.mouseX = x;
      simRef.current.mouseY = y;
      simRef.current.prevMouseX = x;
      simRef.current.prevMouseY = y;
      simRef.current.mouseActive = true;
      setIsInteracting(true);
    }
  };

  const handlePointerEnter = (e) => {
    handlePointerMove(e);
  };

  const handlePointerLeave = () => {
    simRef.current.mouseActive = false;
    setIsInteracting(false);
  };

  // Click or tap creates an expanding 3D ripple impulse
  const handlePointerDown = (e) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    simRef.current.impulses.push({
      x,
      y,
      radius: 4,
      maxRadius: Math.max(rect.width, rect.height) * 0.85,
      strength: 38,
    });
  };

  const content = (
    <>
      {/* Background Subtle Tech Radial Glow & Grid Texture */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />
      <div className="absolute top-0 right-1/4 w-52 h-44 bg-[radial-gradient(ellipse_at_top,rgba(88,166,255,0.08),transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-52 h-44 bg-[radial-gradient(ellipse_at_top,rgba(124,131,255,0.08),transparent_70%)] pointer-events-none" />

      {/* Interactive 3D Canvas */}
      <canvas
        ref={canvasRef}
        className="block w-full h-full touch-none"
      />

      {/* Top macOS-style Terminal Header Bar */}
      <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between pointer-events-none select-none z-10">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]/80 inline-block" />
          </div>
          <span className="text-[11px] font-mono text-[#A1A1AA] ml-2 hidden sm:inline-block">
            interactive-3d-wave.tsx
          </span>
        </div>

        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#141417]/85 border border-white/[0.08] backdrop-blur-md">
          <span
            className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
              isInteracting ? 'bg-[#58A6FF] animate-pulse' : 'bg-[#3FB950]'
            }`}
          />
          <span className="text-[11px] font-mono text-[#A1A1AA]">
            {isInteracting ? 'rippling wave' : `${particleCount} particles`}
          </span>
        </div>
      </div>

      {/* Bottom Interactive Toolbar & Hint */}
      <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between gap-2 pointer-events-none select-none z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#141417]/85 border border-white/[0.08] backdrop-blur-md">
          <Waves size={12} className="text-[#58A6FF]" />
          <span className="text-[11px] font-mono text-[#A1A1AA]">
            3D Particle Mesh
          </span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#141417]/85 border border-white/[0.08] backdrop-blur-md">
          <Sparkles size={11} className="text-[#F0883E]" />
          <span className="text-[11px] font-mono text-[#71717A] hidden xs:inline">
            Hover to ripple • Click to splash
          </span>
          <span className="text-[11px] font-mono text-[#71717A] xs:hidden">
            Touch to wave
          </span>
        </div>
      </div>
    </>
  );

  if (!asCard) {
    return (
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
        className={`relative w-full h-full overflow-hidden select-none ${className}`}
        aria-hidden="true"
      >
        <canvas ref={canvasRef} className="block w-full h-full touch-none" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      className={`relative w-full h-[360px] sm:h-[420px] lg:h-[450px] rounded-2xl overflow-hidden select-none cursor-pointer border border-[#242426] bg-[#0b0b0d]/90 shadow-2xl transition-all duration-300 hover:border-[#38383e] hover:shadow-[0_0_50px_rgba(88,166,255,0.08)] ${className}`}
      aria-label="Interactive 3D Particle Wave Mesh Visualization"
    >
      {content}
    </div>
  );
}
