'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Interactive 3D Rotating Particle Globe (Earth Model)
 * - Pure frameless 3D glowing sphere floating in dark space
 * - Continuous axial rotation tilted at ~23.5° (Earth's axial tilt)
 * - Over 1,100 glowing particles arranged via Fibonacci sphere distribution
 * - Latitude and meridian rings giving authentic digital Earth structure
 * - Orbiting satellite path with glowing orbital nodes
 * - Palette: Electric blue (#58A6FF), subtle violet (#7C83FF), and warm orange (#F0883E) highlights
 * - Full interactive drag-to-spin with momentum, mouse repulsion, and click impulse waves
 * - Viewport-aware rendering loop (pauses when off-screen)
 * - Accessible (respects prefers-reduced-motion)
 */
export default function ParticleGlobe({ className = '' }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Mutable animation state stored in ref to prevent React re-renders on animation frames
  const simRef = useRef({
    width: 480,
    height: 480,
    dpr: 1,
    inView: true,
    reducedMotion: false,
    radius: 175,
    // Rotation state (Earth-like tilt)
    rotY: 0,
    rotX: 0.12,
    axialTilt: 0.41, // ~23.5 degrees
    velRotY: 0.005,
    velRotX: 0,
    baseSpinSpeed: 0.0045,
    isDragging: false,
    lastPointerX: 0,
    lastPointerY: 0,
    // Mouse hover state
    mouseX: -9999,
    mouseY: -9999,
    mouseActive: false,
    // Click impulse waves
    impulses: [],
    // Geometries
    particles: [],
    rings: [],
    meridians: [],
    orbitAngle: 0,
    lastTime: performance.now(),
  });

  // Generate 3D sphere particles and coordinate rings
  const initGeometry = useCallback((radius, isMobile) => {
    const N = isMobile ? 650 : 1100;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const particles = [];

    // 1. Fibonacci Sphere Surface Points
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2; // -1 to 1
      const radAtY = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = goldenAngle * i;
      const x = Math.cos(theta) * radAtY;
      const z = Math.sin(theta) * radAtY;

      // Color assignment:
      // ~1.6% warm orange city/landmark hubs (#F0883E)
      // Balance between electric blue (#58A6FF) and subtle violet (#7C83FF)
      const hash = (i * 31 + 17) % 97;
      const isOrange = hash === 0 || (hash === 43 && i % 3 === 0);
      const isCyan = hash === 11 || hash === 29;

      let cr, cg, cb;
      if (isOrange) {
        cr = 240;
        cg = 136;
        cb = 62;
      } else if (isCyan) {
        cr = 121;
        cg = 184;
        cb = 255;
      } else {
        // Gradient from violet to electric blue based on latitude
        const latT = Math.sin(Math.abs(y) * Math.PI * 0.5);
        cr = Math.round(88 + (124 - 88) * latT);
        cg = Math.round(166 + (131 - 166) * latT);
        cb = 255;
      }

      particles.push({
        x0: x * radius,
        y0: y * radius,
        z0: z * radius,
        cr,
        cg,
        cb,
        isOrange,
        isCyan,
        // Screen projection cache
        sx: 0,
        sy: 0,
        zCam: 0,
        radiusScreen: 1.5,
        alpha: 0,
        visible: false,
        // Interactive displacement
        dispR: 0,
        velDisp: 0,
      });
    }

    // 2. Latitude Rings (Equator, Tropics, Arctic Circles)
    const ringLats = [0, 0.40, -0.40, 0.82, -0.82]; // radians
    const rings = ringLats.map((lat) => {
      const rRing = radius * Math.cos(lat);
      const yRing = radius * Math.sin(lat);
      const steps = isMobile ? 32 : 48;
      const pts = [];
      for (let s = 0; s <= steps; s++) {
        const ang = (s / steps) * Math.PI * 2;
        pts.push({
          x0: Math.cos(ang) * rRing,
          y0: yRing,
          z0: Math.sin(ang) * rRing,
          sx: 0,
          sy: 0,
          zCam: 0,
        });
      }
      return { isEquator: lat === 0, pts };
    });

    // 3. Meridian Longitude Rings (Poles to Poles)
    const meridianAngles = [0, Math.PI * 0.25, Math.PI * 0.5, Math.PI * 0.75];
    const meridians = meridianAngles.map((longAng) => {
      const steps = isMobile ? 32 : 48;
      const pts = [];
      for (let s = 0; s <= steps; s++) {
        const phi = (s / steps) * Math.PI * 2;
        const x = radius * Math.sin(phi) * Math.cos(longAng);
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(longAng);
        pts.push({ x0: x, y0: y, z0: z, sx: 0, sy: 0, zCam: 0 });
      }
      return { pts };
    });

    return { particles, rings, meridians };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (typeof window !== 'undefined') {
      simRef.current.reducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;
    }

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      const size = Math.max(260, Math.min(Math.round(rect.width), Math.round(rect.height) || 480));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const isMobile = size < 400;
      const radius = size * (isMobile ? 0.36 : 0.38);

      simRef.current.width = size;
      simRef.current.height = size;
      simRef.current.dpr = dpr;
      simRef.current.radius = radius;

      const { particles, rings, meridians } = initGeometry(radius, isMobile);
      simRef.current.particles = particles;
      simRef.current.rings = rings;
      simRef.current.meridians = meridians;
    };

    resizeCanvas();

    const resizeObserver = new ResizeObserver(() => resizeCanvas());
    resizeObserver.observe(container);

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

      // Update rotation & Earth-like inertia
      if (!sim.reducedMotion) {
        if (!sim.isDragging) {
          // Gently restore natural Earth spin around Y
          sim.velRotY += (sim.baseSpinSpeed - sim.velRotY) * 0.035 * dt;
          sim.velRotX *= Math.pow(0.92, dt);
          sim.rotY += sim.velRotY * dt;
          sim.rotX += sim.velRotX * dt;
        } else {
          sim.rotY += sim.velRotY;
          sim.rotX += sim.velRotX;
          sim.velRotY *= 0.88;
          sim.velRotX *= 0.88;
        }

        // Keep pitch angle within reasonable natural bounds
        sim.rotX = Math.max(-0.65, Math.min(0.65, sim.rotX));
      }

      // Orbit angle for satellite node
      sim.orbitAngle += (sim.reducedMotion ? 0.006 : 0.016) * dt;

      // Update click impulses
      for (let k = sim.impulses.length - 1; k >= 0; k--) {
        const imp = sim.impulses[k];
        imp.radius += 5.5 * dt;
        imp.strength *= Math.pow(0.93, dt);
        if (imp.radius > imp.maxRadius || imp.strength < 0.2) {
          sim.impulses.splice(k, 1);
        }
      }

      const {
        width: w,
        height: h,
        radius: R,
        particles,
        rings,
        meridians,
        rotY,
        rotX,
        axialTilt,
        orbitAngle,
        impulses,
        mouseX,
        mouseY,
        mouseActive,
      } = sim;

      const centerX = w / 2;
      const centerY = h / 2;
      const fov = 520;
      const camDist = 520;

      ctx.clearRect(0, 0, w, h);

      // Precalculate rotation matrix components
      // 1. Earth daily rotation (around Y)
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      // 2. Earth axial tilt (around Z)
      const cosZ = Math.cos(axialTilt);
      const sinZ = Math.sin(axialTilt);
      // 3. User pitch / camera tilt (around X)
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      // 3D rotation function: applies spin -> axial tilt -> pitch
      const projectPoint = (x0, y0, z0, disp = 0) => {
        let x = x0;
        let y = y0;
        let z = z0;

        if (disp !== 0) {
          const mag = Math.hypot(x, y, z) || 1;
          const factor = (mag + disp) / mag;
          x *= factor;
          y *= factor;
          z *= factor;
        }

        // 1. Spin around Y axis
        const x1 = x * cosY + z * sinY;
        const y1 = y;
        const z1 = -x * sinY + z * cosY;

        // 2. Axial tilt around Z axis
        const x2 = x1 * cosZ - y1 * sinZ;
        const y2 = x1 * sinZ + y1 * cosZ;
        const z2 = z1;

        // 3. Pitch tilt around X axis
        const x3 = x2;
        const y3 = y2 * cosX - z2 * sinX;
        const z3 = y2 * sinX + z2 * cosX;

        // Perspective projection: camera at (0, 0, camDist)
        const zCam = camDist - z3;
        const scale = fov / Math.max(40, zCam);
        const sx = centerX + x3 * scale;
        const sy = centerY + y3 * scale;

        return { sx, sy, z3, scale };
      };

      // PASS 1: Project Latitude and Longitude Rings
      const transformRingPts = (pts) => {
        for (let i = 0; i < pts.length; i++) {
          const p = pts[i];
          const pr = projectPoint(p.x0, p.y0, p.z0);
          p.sx = pr.sx;
          p.sy = pr.sy;
          p.zCam = pr.z3;
        }
      };

      for (let r = 0; r < rings.length; r++) {
        transformRingPts(rings[r].pts);
      }
      for (let m = 0; m < meridians.length; m++) {
        transformRingPts(meridians[m].pts);
      }

      // Draw faint coordinate grid lines on the back hemisphere (depth)
      ctx.lineWidth = 0.5;
      const drawRingSegments = (pts, isFront, isEquator) => {
        for (let i = 0; i < pts.length - 1; i++) {
          const pA = pts[i];
          const pB = pts[i + 1];
          const avgZ = (pA.zCam + pB.zCam) * 0.5;

          if ((isFront && avgZ >= -10) || (!isFront && avgZ < -10)) {
            const zNorm = (avgZ + R) / (R * 2); // 0 to 1
            const alpha = isFront
              ? isEquator
                ? 0.22 * zNorm + 0.05
                : 0.12 * zNorm + 0.02
              : 0.035;

            ctx.strokeStyle = isEquator
              ? `rgba(88, 166, 255, ${alpha.toFixed(3)})`
              : `rgba(124, 131, 255, ${alpha.toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(pA.sx, pA.sy);
            ctx.lineTo(pB.sx, pB.sy);
            ctx.stroke();
          }
        }
      };

      // Draw back grid lines
      for (let r = 0; r < rings.length; r++) {
        drawRingSegments(rings[r].pts, false, rings[r].isEquator);
      }
      for (let m = 0; m < meridians.length; m++) {
        drawRingSegments(meridians[m].pts, false, false);
      }

      // PASS 2: Project Particles & Apply Interactive Cursor Repulsion / Waves
      const springK = 0.08;
      const springDamp = Math.pow(0.82, dt);
      const repelDist = 95;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Screen projection without offset to detect cursor proximity
        const basePr = projectPoint(p.x0, p.y0, p.z0, p.dispR);
        p.sx = basePr.sx;
        p.sy = basePr.sy;
        p.zCam = basePr.z3;

        let targetDisp = 0;

        // Mouse hover interaction: surface reacts dynamically under cursor
        if (mouseActive && basePr.z3 > -30) {
          const mdx = p.sx - mouseX;
          const mdy = p.sy - mouseY;
          const mDist = Math.hypot(mdx, mdy);

          if (mDist < repelDist) {
            const u = 1 - mDist / repelDist;
            targetDisp += Math.pow(u, 1.8) * 20;
          }
        }

        // Expanding impulse ripple waves
        if (impulses.length > 0 && basePr.z3 > -40) {
          for (let k = 0; k < impulses.length; k++) {
            const imp = impulses[k];
            const dist = Math.hypot(p.sx - imp.x, p.sy - imp.y);
            const ringDist = Math.abs(dist - imp.radius);
            if (ringDist < 36) {
              const ringFactor = Math.cos((ringDist / 36) * (Math.PI / 2));
              targetDisp += ringFactor * imp.strength;
            }
          }
        }

        // Spring-damper physics on particle radius displacement
        if (!sim.reducedMotion) {
          const force = (targetDisp - p.dispR) * springK;
          p.velDisp = (p.velDisp + force * dt) * springDamp;
          p.dispR += p.velDisp * dt;
        } else {
          p.dispR = 0;
        }

        // Recompute projection with updated physical displacement
        const pr = projectPoint(p.x0, p.y0, p.z0, p.dispR);
        p.sx = pr.sx;
        p.sy = pr.sy;
        p.zCam = pr.z3;

        // Depth ratio: -1 (far back) to +1 (closest in front)
        const depth = Math.max(-1, Math.min(1, pr.z3 / R));
        const depth01 = (depth + 1) * 0.5; // 0 (back) to 1 (front)

        // Sizing & Alpha
        p.radiusScreen = Math.max(
          0.75,
          (1.1 + depth01 * 1.55) * (p.isOrange ? 1.3 : p.isCyan ? 1.15 : 1.0)
        );

        const baseAlpha = p.isOrange ? 0.95 : p.isCyan ? 0.90 : 0.75;
        p.alpha = Math.max(0.08, baseAlpha * (0.16 + Math.pow(depth01, 1.5) * 0.84));
        p.visible = p.sx >= -20 && p.sx <= w + 20 && p.sy >= -20 && p.sy <= h + 20;
      }

      // PASS 3: Draw Back Particles (Darker, smaller, subtle atmospheric occlusion)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (!p.visible || p.zCam >= -10) continue;

        ctx.fillStyle = `rgba(${p.cr}, ${p.cg}, ${p.cb}, ${p.alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, p.radiusScreen, 0, Math.PI * 2);
        ctx.fill();
      }

      // PASS 4: Draw Front Grid Lines
      for (let r = 0; r < rings.length; r++) {
        drawRingSegments(rings[r].pts, true, rings[r].isEquator);
      }
      for (let m = 0; m < meridians.length; m++) {
        drawRingSegments(meridians[m].pts, true, false);
      }

      // PASS 5: Draw Front Particles with Soft Bokeh Halo & Brilliant Highlights
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (!p.visible || p.zCam < -10) continue;

        // Soft outer glow halo for prominent front particles
        if (p.alpha > 0.45) {
          ctx.fillStyle = `rgba(${p.cr}, ${p.cg}, ${p.cb}, ${(p.alpha * 0.24).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, p.radiusScreen * 2.3, 0, Math.PI * 2);
          ctx.fill();
        }

        // Crisp core particle
        ctx.fillStyle = `rgba(${p.cr}, ${p.cg}, ${p.cb}, ${p.alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, p.radiusScreen, 0, Math.PI * 2);
        ctx.fill();
      }

      // PASS 6: Draw Orbiting Satellite Nodes (Futuristic Tech Orbital Ring)
      const orbitR = R * 1.34;
      const numSats = 2;
      for (let s = 0; s < numSats; s++) {
        const ang = orbitAngle + (s * Math.PI);
        // Tilted orbit plane
        const ox0 = Math.cos(ang) * orbitR;
        const oy0 = Math.sin(ang) * orbitR * 0.32;
        const oz0 = Math.sin(ang) * orbitR * 0.95;

        // Rotate orbit point with axial tilt
        const opr = projectPoint(ox0, oy0, oz0);

        if (opr.z3 > -40) {
          // Satellite pulse halo
          const pulse = (Math.sin(orbitAngle * 4 + s) + 1) * 0.5;
          ctx.fillStyle = `rgba(88, 166, 255, ${(0.18 + pulse * 0.2).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(opr.sx, opr.sy, 5.5 + pulse * 3, 0, Math.PI * 2);
          ctx.fill();

          // Satellite core dot
          ctx.fillStyle = s === 0 ? '#58A6FF' : '#F0883E';
          ctx.beginPath();
          ctx.arc(opr.sx, opr.sy, 2.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [initGeometry]);

  // Pointer drag to spin interaction
  const handlePointerDown = (e) => {
    const container = containerRef.current;
    if (!container) return;
    container.setPointerCapture?.(e.pointerId);

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    simRef.current.isDragging = true;
    simRef.current.lastPointerX = e.clientX;
    simRef.current.lastPointerY = e.clientY;
    simRef.current.velRotY = 0;
    simRef.current.velRotX = 0;
    setIsDragging(true);

    // Also trigger expanding ripple pulse on click
    simRef.current.impulses.push({
      x,
      y,
      radius: 4,
      maxRadius: simRef.current.radius * 1.4,
      strength: 24,
    });
  };

  const handlePointerMove = (e) => {
    const sim = simRef.current;
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    sim.mouseX = x;
    sim.mouseY = y;
    sim.mouseActive = true;

    if (sim.isDragging) {
      const dx = e.clientX - sim.lastPointerX;
      const dy = e.clientY - sim.lastPointerY;
      sim.lastPointerX = e.clientX;
      sim.lastPointerY = e.clientY;

      const sensitivity = 0.007;
      sim.velRotY = dx * sensitivity;
      sim.velRotX = dy * sensitivity;
    }
  };

  const handlePointerUp = (e) => {
    const container = containerRef.current;
    container?.releasePointerCapture?.(e.pointerId);
    simRef.current.isDragging = false;
    setIsDragging(false);
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
    simRef.current.mouseActive = true;
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    simRef.current.mouseActive = false;
    simRef.current.isDragging = false;
    setIsDragging(false);
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className={`relative w-full max-w-[480px] aspect-square flex items-center justify-center select-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      } ${className}`}
      aria-label="Interactive 3D Rotating Particle Earth Model"
    >
      {/* Planetary Atmosphere Backlight Halo (No card box - completely frameless) */}
      <div className="absolute inset-8 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(88,166,255,0.14)_0%,rgba(124,131,255,0.06)_40%,transparent_70%)] blur-2xl pointer-events-none -z-10" />

      {/* Interactive 3D Canvas */}
      <canvas
        ref={canvasRef}
        className="block w-full h-full touch-none"
      />

      {/* Subtle interaction hint that fades when user interacts */}
      <div
        className={`absolute -bottom-2 px-3 py-1 rounded-full bg-[#121215]/60 border border-white/[0.06] backdrop-blur-md text-[11px] font-mono text-[#71717A] pointer-events-none transition-opacity duration-500 ${
          isHovered || isDragging ? 'opacity-80' : 'opacity-40 hover:opacity-80'
        }`}
      >
        <span className="text-[#58A6FF]">●</span> Drag to rotate • Click to pulse
      </div>
    </div>
  );
}

