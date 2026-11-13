'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

const MODES = [
  { id: 'combined', label: '{ < > }', title: 'Curly Braces & Angle Brackets' },
  { id: 'braces', label: '{ }', title: 'Curly Braces' },
  { id: 'angles', label: '< >', title: 'Angle Brackets' },
];

const TOTAL_DOTS = 320;

const ROLE_COLORS = {
  orange: ['#F0883E', '#FFA657'],
  blue: ['#58A6FF', '#79B8FF'],
  white: ['#F5F5F5', '#D4D4D8'],
};

function evalCubicBezier(p0, p1, p2, p3, t) {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const t2 = t * t;
  return {
    x: mt2 * mt * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t2 * t * p3.x,
    y: mt2 * mt * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t2 * t * p3.y,
  };
}

/**
 * Sample points at uniform arc-length intervals along cubic Bezier and line segments.
 */
function samplePathUniform(segments, count, offsetSpread = 0, seedBase = 0) {
  const raw = [];

  for (const seg of segments) {
    const steps = seg.type === 'cubic' ? 72 : 32;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const pt =
        seg.type === 'cubic'
          ? evalCubicBezier(seg.p0, seg.p1, seg.p2, seg.p3, t)
          : {
              x: seg.p0.x + (seg.p1.x - seg.p0.x) * t,
              y: seg.p0.y + (seg.p1.y - seg.p0.y) * t,
            };
      if (raw.length === 0 || i > 0) {
        raw.push(pt);
      }
    }
  }

  const lengths = [0];
  let totalLen = 0;
  for (let i = 1; i < raw.length; i++) {
    totalLen += Math.hypot(raw[i].x - raw[i - 1].x, raw[i].y - raw[i - 1].y);
    lengths.push(totalLen);
  }

  const sampled = [];
  if (count <= 0 || totalLen === 0) return sampled;

  let rawIdx = 0;
  for (let i = 0; i < count; i++) {
    const targetLen = count === 1 ? totalLen / 2 : (i / (count - 1)) * totalLen;
    while (rawIdx < lengths.length - 2 && lengths[rawIdx + 1] < targetLen) {
      rawIdx++;
    }
    const segLen = lengths[rawIdx + 1] - lengths[rawIdx] || 1;
    const frac = Math.max(0, Math.min(1, (targetLen - lengths[rawIdx]) / segLen));
    const pA = raw[rawIdx];
    const pB = raw[rawIdx + 1] || pA;

    const x = pA.x + (pB.x - pA.x) * frac;
    const y = pA.y + (pB.y - pA.y) * frac;

    const tx = pB.x - pA.x;
    const ty = pB.y - pA.y;
    const tMag = Math.hypot(tx, ty) || 1;
    const nx = -ty / tMag;
    const ny = tx / tMag;

    // Multi-strand perpendicular offset gives strokes crisp volumetric thickness
    const parity = i % 3 === 0 ? 0 : i % 2 === 0 ? 1 : -1;
    const pseudoJitter = Math.sin((i + seedBase) * 12.9898) * 0.5;
    const offset = (parity * 0.65 + pseudoJitter * 0.35) * offsetSpread;

    sampled.push({
      x: x + nx * offset,
      y: y + ny * offset,
    });
  }

  return sampled;
}

function getLeftCurlySegments(cx, cy, w, h) {
  return [
    {
      type: 'cubic',
      p0: { x: cx + w * 0.42, y: cy - h * 0.5 },
      p1: { x: cx + w * 0.02, y: cy - h * 0.5 },
      p2: { x: cx - w * 0.06, y: cy - h * 0.41 },
      p3: { x: cx - w * 0.06, y: cy - h * 0.25 },
    },
    {
      type: 'cubic',
      p0: { x: cx - w * 0.06, y: cy - h * 0.25 },
      p1: { x: cx - w * 0.06, y: cy - h * 0.1 },
      p2: { x: cx - w * 0.14, y: cy - h * 0.025 },
      p3: { x: cx - w * 0.46, y: cy },
    },
    {
      type: 'cubic',
      p0: { x: cx - w * 0.46, y: cy },
      p1: { x: cx - w * 0.14, y: cy + h * 0.025 },
      p2: { x: cx - w * 0.06, y: cy + h * 0.1 },
      p3: { x: cx - w * 0.06, y: cy + h * 0.25 },
    },
    {
      type: 'cubic',
      p0: { x: cx - w * 0.06, y: cy + h * 0.25 },
      p1: { x: cx - w * 0.06, y: cy + h * 0.41 },
      p2: { x: cx + w * 0.02, y: cy + h * 0.5 },
      p3: { x: cx + w * 0.42, y: cy + h * 0.5 },
    },
  ];
}

function getRightCurlySegments(cx, cy, w, h) {
  return getLeftCurlySegments(cx, cy, w, h).map((seg) => ({
    ...seg,
    p0: { x: 2 * cx - seg.p0.x, y: seg.p0.y },
    p1: { x: 2 * cx - seg.p1.x, y: seg.p1.y },
    p2: { x: 2 * cx - seg.p2.x, y: seg.p2.y },
    p3: { x: 2 * cx - seg.p3.x, y: seg.p3.y },
  }));
}

function getLessThanSegments(cx, cy, w, h) {
  return [
    {
      type: 'line',
      p0: { x: cx + w * 0.45, y: cy - h * 0.5 },
      p1: { x: cx - w * 0.45, y: cy },
    },
    {
      type: 'line',
      p0: { x: cx - w * 0.45, y: cy },
      p1: { x: cx + w * 0.45, y: cy + h * 0.5 },
    },
  ];
}

function getGreaterThanSegments(cx, cy, w, h) {
  return [
    {
      type: 'line',
      p0: { x: cx - w * 0.45, y: cy - h * 0.5 },
      p1: { x: cx + w * 0.45, y: cy },
    },
    {
      type: 'line',
      p0: { x: cx + w * 0.45, y: cy },
      p1: { x: cx - w * 0.45, y: cy + h * 0.5 },
    },
  ];
}

function buildFormationTargets(mode, width, height) {
  const cx = width / 2;
  const cy = height / 2 - 8;
  const spread = Math.max(2.5, Math.min(width, height) * 0.009);

  if (mode === 'braces') {
    const braceW = Math.min(width * 0.19, 88);
    const braceH = Math.min(height * 0.64, 240);
    const offsetX = Math.min(width * 0.19, 92);

    const leftPts = samplePathUniform(
      getLeftCurlySegments(cx - offsetX, cy, braceW, braceH),
      160,
      spread * 1.25,
      1
    );
    const rightPts = samplePathUniform(
      getRightCurlySegments(cx + offsetX, cy, braceW, braceH),
      160,
      spread * 1.25,
      2
    );

    return [
      ...leftPts.map((pt, idx) => ({ ...pt, role: idx % 4 === 0 ? 'white' : 'orange' })),
      ...rightPts.map((pt, idx) => ({ ...pt, role: idx % 4 === 0 ? 'white' : 'orange' })),
    ];
  }

  if (mode === 'angles') {
    const angleW = Math.min(width * 0.21, 95);
    const angleH = Math.min(height * 0.54, 200);
    const offsetX = Math.min(width * 0.16, 76);

    const ltPts = samplePathUniform(
      getLessThanSegments(cx - offsetX, cy, angleW, angleH),
      160,
      spread * 1.25,
      3
    );
    const gtPts = samplePathUniform(
      getGreaterThanSegments(cx + offsetX, cy, angleW, angleH),
      160,
      spread * 1.25,
      4
    );

    return [
      ...ltPts.map((pt, idx) => ({ ...pt, role: idx % 4 === 0 ? 'white' : 'blue' })),
      ...gtPts.map((pt, idx) => ({ ...pt, role: idx % 4 === 0 ? 'white' : 'blue' })),
    ];
  }

  // Default: 'combined' -> { < > }
  const braceW = Math.min(width * 0.145, 68);
  const braceH = Math.min(height * 0.6, 225);
  const braceOffsetX = Math.min(width * 0.31, 148);

  const angleW = Math.min(width * 0.125, 56);
  const angleH = Math.min(height * 0.36, 136);
  const angleOffsetX = Math.min(width * 0.11, 52);

  const leftBracePts = samplePathUniform(
    getLeftCurlySegments(cx - braceOffsetX, cy, braceW, braceH),
    96,
    spread,
    10
  );
  const rightBracePts = samplePathUniform(
    getRightCurlySegments(cx + braceOffsetX, cy, braceW, braceH),
    96,
    spread,
    20
  );
  const ltPts = samplePathUniform(
    getLessThanSegments(cx - angleOffsetX, cy, angleW, angleH),
    64,
    spread,
    30
  );
  const gtPts = samplePathUniform(
    getGreaterThanSegments(cx + angleOffsetX, cy, angleW, angleH),
    64,
    spread,
    40
  );

  return [
    ...leftBracePts.map((pt, idx) => ({ ...pt, role: idx % 4 === 0 ? 'white' : 'orange' })),
    ...rightBracePts.map((pt, idx) => ({ ...pt, role: idx % 4 === 0 ? 'white' : 'orange' })),
    ...ltPts.map((pt, idx) => ({ ...pt, role: idx % 4 === 0 ? 'white' : 'blue' })),
    ...gtPts.map((pt, idx) => ({ ...pt, role: idx % 4 === 0 ? 'white' : 'blue' })),
  ];
}

export default function AntigravityCodeField() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  const [mode, setMode] = useState('combined');
  const [isHovered, setIsHovered] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const stateRef = useRef({
    width: 480,
    height: 420,
    dots: [],
    targets: [],
    isAssembled: false,
    mode: 'combined',
    mouseX: -9999,
    mouseY: -9999,
    mouseInside: false,
    inView: true,
    reducedMotion: false,
    burstTimer: 0,
  });

  const isAssembled = isHovered || isLocked;

  useEffect(() => {
    setIsTouchDevice(
      typeof window !== 'undefined' &&
        ('ontouchstart' in window || navigator.maxTouchPoints > 0)
    );
    if (typeof window !== 'undefined') {
      stateRef.current.reducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;
    }
  }, []);

  const syncTargets = useCallback((nextMode, w, h) => {
    const targets = buildFormationTargets(nextMode, w, h);
    stateRef.current.targets = targets;

    const { dots } = stateRef.current;
    for (let i = 0; i < dots.length; i++) {
      const t = targets[i % targets.length];
      dots[i].tx = t.x;
      dots[i].ty = t.y;
      const palette = ROLE_COLORS[t.role] || ROLE_COLORS.white;
      dots[i].color = palette[i % palette.length];
      dots[i].role = t.role;
    }
  }, []);

  useEffect(() => {
    const prevAssembled = stateRef.current.isAssembled;
    stateRef.current.isAssembled = isAssembled;
    stateRef.current.mode = mode;

    const { width, height, dots } = stateRef.current;
    syncTargets(mode, width, height);

    if (!prevAssembled && isAssembled) {
      stateRef.current.burstTimer = 18;
    } else if (prevAssembled && !isAssembled) {
      const cx = width / 2;
      const cy = height / 2;
      for (const dot of dots) {
        const dx = dot.x - cx;
        const dy = dot.y - cy;
        const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.9;
        const speed = 0.8 + Math.random() * 1.8;
        dot.vx = Math.cos(angle) * speed;
        dot.vy = Math.sin(angle) * speed - 0.5;
      }
    }
  }, [isAssembled, mode, syncTargets]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const initDots = (w, h) => {
      const targets = buildFormationTargets(stateRef.current.mode, w, h);
      stateRef.current.targets = targets;

      const dots = [];
      for (let i = 0; i < TOTAL_DOTS; i++) {
        const t = targets[i % targets.length];
        const palette = ROLE_COLORS[t.role] || ROLE_COLORS.white;
        const layer = 0.45 + Math.random() * 0.55;
        dots.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.45,
          vy: -0.15 - Math.random() * 0.45,
          idleVx: (Math.random() - 0.5) * 0.4,
          idleVy: -0.18 - Math.random() * 0.35,
          tx: t.x,
          ty: t.y,
          radius: 1.35 + layer * 1.55,
          layer,
          alpha: 0.35 + layer * 0.45,
          phase: Math.random() * Math.PI * 2,
          freq: 0.015 + Math.random() * 0.02,
          stiffness: 0.055 + Math.random() * 0.04,
          friction: 0.8 + Math.random() * 0.055,
          color: palette[i % palette.length],
          role: t.role,
        });
      }
      stateRef.current.dots = dots;
    };

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      const w = Math.max(260, Math.round(rect.width));
      const h = Math.max(260, Math.round(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      stateRef.current.width = w;
      stateRef.current.height = h;

      if (stateRef.current.dots.length === 0) {
        initDots(w, h);
      } else {
        syncTargets(stateRef.current.mode, w, h);
      }
    };

    resizeCanvas();

    const resizeObserver = new ResizeObserver(() => resizeCanvas());
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        stateRef.current.inView = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    let rafId = 0;
    let tick = 0;
    let lastTime = performance.now();

    const render = (now) => {
      rafId = requestAnimationFrame(render);
      const dt = Math.min((now - lastTime) / 16.667, 2.2);
      lastTime = now;

      const st = stateRef.current;
      if (!st.inView) return;

      tick += dt;
      if (st.burstTimer > 0) st.burstTimer = Math.max(0, st.burstTimer - dt);

      const {
        width,
        height,
        dots,
        isAssembled: assembled,
        mouseX,
        mouseY,
        mouseInside,
        reducedMotion,
      } = st;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2 - 8;

      if (assembled) {
        const grad = ctx.createRadialGradient(
          cx,
          cy,
          10,
          cx,
          cy,
          Math.min(width, height) * 0.45
        );
        grad.addColorStop(0, 'rgba(88, 166, 255, 0.08)');
        grad.addColorStop(0.55, 'rgba(240, 136, 62, 0.04)');
        grad.addColorStop(1, 'rgba(9, 9, 9, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];

        if (reducedMotion) {
          d.x = assembled ? d.tx : d.x;
          d.y = assembled ? d.ty : d.y;
        } else if (assembled) {
          const microX = Math.cos(tick * d.freq + d.phase) * 0.9;
          const microY = Math.sin(tick * d.freq * 1.1 + d.phase) * 0.9;
          const dx = d.tx + microX - d.x;
          const dy = d.ty + microY - d.y;
          const dist = Math.hypot(dx, dy);

          let swirlX = 0;
          let swirlY = 0;
          if (dist > 24 && st.burstTimer > 0) {
            const swirlFactor = Math.min(0.035, dist * 0.00018);
            swirlX = -dy * swirlFactor;
            swirlY = dx * swirlFactor;
          }

          d.vx += (dx * d.stiffness + swirlX) * dt;
          d.vy += (dy * d.stiffness + swirlY) * dt;

          if (mouseInside) {
            const mdx = d.x - mouseX;
            const mdy = d.y - mouseY;
            const mDist = Math.hypot(mdx, mdy);
            const repelRadius = 56;
            if (mDist > 0.1 && mDist < repelRadius) {
              const force = ((repelRadius - mDist) / repelRadius) * 2.4 * dt;
              d.vx += (mdx / mDist) * force;
              d.vy += (mdy / mDist) * force;
            }
          }

          const damp = Math.pow(d.friction, dt);
          d.vx *= damp;
          d.vy *= damp;
          d.x += d.vx * dt;
          d.y += d.vy * dt;
        } else {
          const wobbleX = Math.sin(tick * d.freq + d.phase) * 0.14;
          const wobbleY = Math.cos(tick * d.freq * 0.9 + d.phase) * 0.12;

          const blend = Math.min(1, 0.03 * dt);
          d.vx += (d.idleVx + wobbleX - d.vx) * blend;
          d.vy += (d.idleVy + wobbleY - d.vy) * blend;

          if (mouseInside) {
            const mdx = d.x - mouseX;
            const mdy = d.y - mouseY;
            const mDist = Math.hypot(mdx, mdy);
            if (mDist > 1 && mDist < 80) {
              const push = ((80 - mDist) / 80) * 0.45 * dt;
              d.vx += (mdx / mDist) * push;
              d.vy += (mdy / mDist) * push;
            }
          }

          d.x += d.vx * dt;
          d.y += d.vy * dt;

          const margin = 12;
          if (d.y < -margin) d.y = height + margin;
          if (d.y > height + margin) d.y = -margin;
          if (d.x < -margin) d.x = width + margin;
          if (d.x > width + margin) d.x = -margin;
        }

        let edgeFade = 1;
        if (!assembled) {
          const edgeDist = Math.min(d.x, width - d.x, d.y, height - d.y);
          edgeFade = Math.max(0.15, Math.min(1, edgeDist / 36));
        }

        const targetAlpha = assembled ? 0.92 : d.alpha;
        const drawAlpha = targetAlpha * edgeFade;
        const drawR = assembled ? Math.max(1.85, d.radius * 0.95) : d.radius;

        ctx.globalAlpha = drawAlpha * (assembled ? 0.24 : 0.14);
        ctx.fillStyle = d.color;
        ctx.beginPath();
        ctx.arc(d.x, d.y, drawR * 2.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = drawAlpha;
        ctx.beginPath();
        ctx.arc(d.x, d.y, drawR, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;

      if (assembled && st.burstTimer > 0) {
        const progress = 1 - st.burstTimer / 18;
        ctx.save();
        ctx.strokeStyle = `rgba(88, 166, 255, ${(0.28 * (1 - progress)).toFixed(3)})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(cx, cy, 20 + progress * 120, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [syncTargets]);

  const handlePointerMove = (e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    stateRef.current.mouseX = e.clientX - rect.left;
    stateRef.current.mouseY = e.clientY - rect.top;
    stateRef.current.mouseInside = true;
  };

  const handlePointerEnter = (e) => {
    handlePointerMove(e);
    setIsHovered(true);
  };

  const handlePointerLeave = () => {
    stateRef.current.mouseInside = false;
    stateRef.current.mouseX = -9999;
    stateRef.current.mouseY = -9999;
    setIsHovered(false);
  };

  const handleCanvasClick = () => {
    if (isTouchDevice && !isAssembled) {
      setIsLocked(true);
      return;
    }
    const currentIdx = MODES.findIndex((m) => m.id === mode);
    const nextMode = MODES[(currentIdx + 1) % MODES.length].id;
    setMode(nextMode);
    stateRef.current.burstTimer = 18;
  };

  const currentModeObj = MODES.find((m) => m.id === mode) || MODES[0];

  return (
    <div
      ref={containerRef}
      onMouseEnter={handlePointerEnter}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      onClick={handleCanvasClick}
      role="region"
      aria-label="Interactive Antigravity Code Particle Field"
      className={`relative w-full h-[360px] sm:h-[420px] lg:h-[450px] rounded-2xl overflow-hidden select-none cursor-pointer border transition-colors duration-500 ${
        isAssembled
          ? 'bg-[#0d0d0f]/90 border-[#3a3a40] shadow-[0_0_50px_rgba(88,166,255,0.08)]'
          : 'bg-[#0b0b0c]/75 border-[#242426] shadow-2xl'
      }`}
    >
      {/* Subtle Grid Dot Texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Interactive Canvas */}
      <canvas ref={canvasRef} className="block w-full h-full" />

      {/* Top Subtle Status Indicator */}
      <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141414]/80 border border-white/[0.08] backdrop-blur-md">
          <span
            className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
              isAssembled ? 'bg-[#58A6FF] animate-pulse' : 'bg-[#F0883E]/80'
            }`}
          />
          <span className="text-[11px] font-mono text-[#A1A1AA]">
            {isAssembled ? `forming ${currentModeObj.label}` : 'antigravity field'}
          </span>
        </div>

        <span className="text-[11px] font-mono text-[#71717A] bg-[#141414]/70 px-2.5 py-1 rounded-full border border-white/[0.06] backdrop-blur-md">
          {TOTAL_DOTS} particles
        </span>
      </div>

      {/* Bottom Interactive Shape Switcher & Hint */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute bottom-3.5 left-4 right-4 flex flex-wrap items-center justify-between gap-2"
      >
        <div className="inline-flex items-center gap-1 p-1 rounded-full bg-[#141414]/85 border border-white/[0.08] backdrop-blur-md">
          {MODES.map((m) => {
            const active = mode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                title={m.title}
                onClick={() => {
                  setMode(m.id);
                  if (isTouchDevice) setIsLocked(true);
                  stateRef.current.burstTimer = 18;
                }}
                className={`px-2.5 py-1 rounded-full text-[11px] font-mono transition-all ${
                  active
                    ? 'bg-[#58A6FF]/15 text-[#58A6FF] border border-[#58A6FF]/40 font-semibold'
                    : 'text-[#A1A1AA] hover:text-[#F5F5F5] border border-transparent'
                }`}
              >
                {m.label}
              </button>
            );
          })}
          {isLocked && (
            <button
              type="button"
              onClick={() => setIsLocked(false)}
              className="px-2.5 py-1 rounded-full text-[11px] font-mono text-[#F0883E] hover:bg-[#F0883E]/10 transition-colors"
              title="Release particles back to antigravity drift"
            >
              release
            </button>
          )}
        </div>

        <span className="text-[11px] text-[#71717A] font-mono pointer-events-none hidden sm:inline">
          {isAssembled ? 'Click canvas to morph shape' : 'Hover to assemble code'}
        </span>
      </div>
    </div>
  );
}

