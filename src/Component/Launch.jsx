import React, { useEffect, useRef, useState, useCallback } from "react";

/* ─────────────── Utility ─────────────── */
const rand = (a, b) => Math.random() * (b - a) + a;
const randInt = (a, b) => Math.floor(rand(a, b));

/* ─────────────── Firework Engine ─────────────── */
const PALETTES = [
  ["#ff0033", "#ffffff", "#ffd700", "#ff4466"],
  ["#ffd700", "#ffea00", "#ffffff", "#ff9900"],
  ["#ff1744", "#ffffff", "#ff5252", "#ffd700"],
  ["#06b6d4", "#ffffff", "#22d3ee", "#fbbf24"],
  ["#a855f7", "#ffffff", "#ec4899", "#ffd700"],
];
const GOLD = ["#ffffff", "#fff8dc", "#ffd700", "#ffec8b", "#ffaa00", "#ff4444"];

function useFireworksEngine(canvasRef) {
  const raf = useRef(null);
  const particles = useRef([]);
  const sparklers = useRef([]);
  const rockets = useRef([]);
  const frame = useRef(0);
  const W = useRef(0);
  const H = useRef(0);

  const spawnDust = useCallback((x, y, n, speed = 2.5, pal = null) => {
    const p = pal || GOLD;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = rand(0.3, speed);
      sparklers.current.push({
        x: x + rand(-3, 3), y: y + rand(-3, 3),
        vx: Math.cos(a) * s, vy: Math.sin(a) * s - rand(0.1, 1.2),
        color: p[randInt(0, p.length)], alpha: rand(0.85, 1),
        size: rand(1.2, 2.6), decay: rand(0.007, 0.014),
        gravity: rand(0.018, 0.04), drag: rand(0.975, 0.988),
        twS: rand(0.1, 0.22), twP: rand(0, Math.PI * 2),
      });
    }
  }, []);

  const burst = useCallback((x, y, pal, cnt = null) => {
    const mob = window.innerWidth < 768;
    const p = pal || PALETTES[randInt(0, PALETTES.length)];
    const n = cnt || (mob ? randInt(55, 75) : randInt(95, 130));
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + rand(-0.08, 0.08);
      const sp = rand(mob ? 2.0 : 2.6, mob ? 5.5 : 7.8);
      particles.current.push({
        x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
        color: p[randInt(0, p.length)], alpha: 1,
        size: rand(mob ? 2.2 : 2.8, mob ? 3.4 : 4.4),
        decay: rand(0.008, 0.016), gravity: rand(0.03, 0.065),
        trail: [], twinkle: Math.random() > 0.3,
        twS: rand(0.09, 0.18), twP: rand(0, Math.PI * 2), sdc: 0,
      });
    }
    spawnDust(x, y, mob ? randInt(45, 65) : randInt(85, 130), mob ? 3.5 : 5.0, GOLD);
    const ring = mob ? 16 : 26;
    for (let i = 0; i < ring; i++) {
      const a = (i / ring) * Math.PI * 2;
      particles.current.push({
        x, y,
        vx: Math.cos(a) * rand(mob ? 3.5 : 5.0, mob ? 6.0 : 8.5),
        vy: Math.sin(a) * rand(mob ? 3.5 : 5.0, mob ? 6.0 : 8.5),
        color: "#ffffff", alpha: 1, size: rand(1.4, 2.2),
        decay: rand(0.015, 0.028), gravity: 0.025,
        trail: [], twinkle: true, twS: 0.25, twP: rand(0, Math.PI * 2), sdc: 999,
      });
    }
  }, [spawnDust]);

  const launch = useCallback((tx, ty, pal) => {
    const sx = W.current * rand(0.2, 0.8);
    const sy = H.current + 10;
    const dur = rand(54, 76);
    rockets.current.push({
      x: sx, y: sy, vx: (tx - sx) / dur, vy: (ty - sy) / dur,
      trail: [], life: dur, palette: pal,
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      W.current = canvas.width;
      H.current = canvas.height;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const mob = window.innerWidth < 768;
    const ids = [];

    // Initial bursts
    ids.push(setTimeout(() => burst(W.current * 0.5, H.current * 0.22, PALETTES[0], 160), 200));
    ids.push(setTimeout(() => burst(W.current * 0.25, H.current * 0.20, PALETTES[1], 550), 600));
    ids.push(setTimeout(() => burst(W.current * 0.75, H.current * 0.20, PALETTES[2], 950), 1000));

    [[0.22, 0.26], [0.78, 0.26], [0.36, 0.16], [0.64, 0.16], [0.5, 0.13]].forEach(([tx, ty], i) => {
      ids.push(setTimeout(() => launch(W.current * tx, H.current * ty, PALETTES[i % PALETTES.length]), 1200 + i * 480));
    });
    ids.push(setInterval(() => launch(W.current * rand(0.15, 0.85), H.current * rand(0.1, 0.32), PALETTES[randInt(0, PALETTES.length)]), mob ? 950 : 750));
    ids.push(setInterval(() => {
      if (Math.random() > 0.3) {
        spawnDust(W.current * rand(0.05, 0.18), H.current - 10, mob ? 5 : 10, mob ? 4.5 : 6.5, GOLD);
        spawnDust(W.current * rand(0.82, 0.95), H.current - 10, mob ? 5 : 10, mob ? 4.5 : 6.5, GOLD);
      }
    }, 300));

    const draw = () => {
      frame.current++;
      ctx.clearRect(0, 0, W.current, H.current);
      ctx.globalCompositeOperation = "lighter";

      rockets.current = rockets.current.filter((r) => {
        r.trail.push({ x: r.x, y: r.y });
        if (r.trail.length > (mob ? 8 : 12)) r.trail.shift();
        r.x += r.vx; r.y += r.vy; r.life--;
        if (frame.current % 3 === 0) {
          sparklers.current.push({
            x: r.x + rand(-2, 2), y: r.y + rand(0, 6),
            vx: rand(-0.8, 0.8), vy: rand(1.0, 2.5),
            color: Math.random() > 0.4 ? "#ffd700" : "#ffffff",
            alpha: 1, size: rand(1.2, 2.2), decay: rand(0.018, 0.035),
            gravity: 0.03, drag: 0.975, twS: 0.2, twP: rand(0, Math.PI * 2),
          });
        }
        for (let i = 0; i < r.trail.length; i++) {
          const pt = r.trail[i];
          const a = (i / r.trail.length) * 0.75;
          ctx.beginPath(); ctx.arc(pt.x, pt.y, (i / r.trail.length) * 2.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(239,68,68,${a})`; ctx.fill();
        }
        ctx.beginPath(); ctx.arc(r.x, r.y, 3.2, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff"; ctx.fill();
        if (r.life <= 0) { burst(r.x, r.y, r.palette); return false; }
        return true;
      });

      particles.current = particles.current.filter((p) => {
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > (mob ? 3 : 5)) p.trail.shift();
        p.x += p.vx; p.y += p.vy; p.vy += p.gravity; p.vx *= 0.985; p.alpha -= p.decay;
        if (p.alpha <= 0) return false;
        p.sdc++;
        if (p.sdc === 4 && p.alpha > 0.35 && sparklers.current.length < (mob ? 180 : 350)) {
          p.sdc = 0;
          sparklers.current.push({ x: p.x, y: p.y, vx: rand(-0.5, 0.5), vy: rand(0.1, 1.0), color: "#ffd700", alpha: p.alpha * 0.85, size: rand(1.0, 1.8), decay: rand(0.012, 0.025), gravity: 0.025, drag: 0.985, twS: 0.18, twP: rand(0, Math.PI * 2) });
        }
        const tm = p.twinkle ? 0.4 + 0.6 * Math.sin(frame.current * p.twS + p.twP) : 1;
        const ea = Math.max(0, p.alpha * tm);
        p.trail.forEach((pt, i) => {
          ctx.beginPath(); ctx.arc(pt.x, pt.y, p.size * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = p.color; ctx.globalAlpha = (i / p.trail.length) * ea * 0.35; ctx.fill();
        });
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color; ctx.globalAlpha = ea; ctx.fill();
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff"; ctx.globalAlpha = ea * 0.85; ctx.fill();
        ctx.globalAlpha = 1; return true;
      });

      sparklers.current = sparklers.current.filter((s) => {
        s.x += s.vx; s.y += s.vy; s.vy += s.gravity; s.vx *= (s.drag || 0.98); s.alpha -= s.decay;
        if (s.alpha <= 0) return false;
        const tw = 0.35 + 0.65 * Math.sin(frame.current * s.twS + s.twP);
        const ea = Math.max(0, s.alpha * tw);
        ctx.beginPath(); ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = s.color; ctx.globalAlpha = ea; ctx.fill();
        if (tw > 0.7) {
          ctx.beginPath(); ctx.arc(s.x, s.y, s.size * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = "#ffffff"; ctx.globalAlpha = ea; ctx.fill();
        }
        ctx.globalAlpha = 1; return true;
      });

      ctx.globalCompositeOperation = "source-over";
      raf.current = requestAnimationFrame(draw);
    };
    raf.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf.current);
      ids.forEach((id) => { clearTimeout(id); clearInterval(id); });
      window.removeEventListener("resize", resize);
      particles.current = []; sparklers.current = []; rockets.current = [];
    };
  }, [burst, launch, spawnDust]);
}

/* ─────────────── Animated SVG Pictographs ─────────────── */

// Sparkler stick pictograph
function SparklerIcon({ style, delay = 0, color = "#ffd700" }) {
  return (
    <svg width="36" height="80" viewBox="0 0 36 80" style={{ ...style, animationDelay: `${delay}s` }} className="sparkler-icon">
      {/* Stick */}
      <rect x="16" y="40" width="4" height="38" rx="2" fill="#6b7280" />
      {/* Sparks radiating from top */}
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * 360;
        const len = 8 + (i % 3) * 4;
        const rad = (angle * Math.PI) / 180;
        const x2 = 18 + Math.cos(rad) * len;
        const y2 = 26 + Math.sin(rad) * len;
        return (
          <line key={i} x1="18" y1="26" x2={x2} y2={y2}
            stroke={i % 2 === 0 ? color : "#ffffff"} strokeWidth="1.5"
            strokeLinecap="round" opacity="0.9"
            style={{
              transformOrigin: "18px 26px",
              animation: `sparkFlicker ${0.4 + (i % 4) * 0.1}s ${i * 0.04}s ease-in-out infinite alternate`,
            }}
          />
        );
      })}
      {/* Center glow */}
      <circle cx="18" cy="26" r="4" fill={color} opacity="0.95"
        style={{ animation: `glowPulse 0.6s ${delay}s ease-in-out infinite alternate` }} />
      <circle cx="18" cy="26" r="2" fill="#ffffff" />
    </svg>
  );
}

// Rocket pictograph
function RocketIcon({ style, delay = 0 }) {
  return (
    <svg width="28" height="64" viewBox="0 0 28 64" style={{ ...style, animationDelay: `${delay}s` }} className="rocket-icon">
      {/* Body */}
      <ellipse cx="14" cy="24" rx="6" ry="12" fill="url(#rocketGrad)" />
      {/* Nose */}
      <path d="M14 4 L8 16 L20 16 Z" fill="url(#noseGrad)" />
      {/* Fins */}
      <path d="M8 30 L2 42 L8 38 Z" fill="#ef4444" opacity="0.9" />
      <path d="M20 30 L26 42 L20 38 Z" fill="#ef4444" opacity="0.9" />
      {/* Window */}
      <circle cx="14" cy="22" r="3" fill="#ffffff" opacity="0.3" />
      <circle cx="14" cy="22" r="1.5" fill="#ffffff" opacity="0.8" />
      {/* Flame */}
      <ellipse cx="14" cy="40" rx="4" ry="7" fill="url(#flameGrad)"
        style={{ animation: `flamePulse 0.3s ${delay}s ease-in-out infinite alternate` }} />
      <ellipse cx="14" cy="38" rx="2" ry="4" fill="#fbbf24"
        style={{ animation: `flamePulse 0.25s ${delay + 0.05}s ease-in-out infinite alternate` }} />
      <defs>
        <linearGradient id="rocketGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#f87171" />
        </linearGradient>
        <linearGradient id="noseGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#fca5a5" />
        </linearGradient>
        <linearGradient id="flameGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.3" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Flower pot fountain pictograph
function FlowerPotIcon({ style, delay = 0 }) {
  return (
    <svg width="44" height="64" viewBox="0 0 44 64" style={{ ...style, animationDelay: `${delay}s` }} className="flowerpot-icon">
      {/* Pot */}
      <path d="M10 46 L14 56 L30 56 L34 46 Z" fill="#7c3aed" />
      <rect x="8" y="42" width="28" height="5" rx="2" fill="#8b5cf6" />
      {/* Fountain sparks arcing up */}
      {[...Array(9)].map((_, i) => {
        const t = i / 8;
        const dx = (t - 0.5) * 40;
        const dy = -28 - Math.abs(t - 0.5) * 10;
        const colors = ["#ffd700", "#ff6600", "#ff0055", "#00f0ff", "#ffffff", "#a855f7", "#fbbf24", "#10b981", "#ef4444"];
        return (
          <line key={i}
            x1="22" y1="42"
            x2={22 + dx} y2={42 + dy}
            stroke={colors[i % colors.length]} strokeWidth="2" strokeLinecap="round"
            style={{
              animation: `fountainArc ${0.5 + (i % 3) * 0.15}s ${i * 0.06 + delay}s ease-out infinite`,
              transformOrigin: "22px 42px",
            }}
          />
        );
      })}
      {/* Sparkling tips */}
      {[...Array(9)].map((_, i) => {
        const t = i / 8;
        const dx = (t - 0.5) * 40;
        const dy = -28 - Math.abs(t - 0.5) * 10;
        const colors = ["#ffd700", "#ff6600", "#ff0055", "#00f0ff", "#ffffff", "#a855f7", "#fbbf24", "#10b981", "#ef4444"];
        return (
          <circle key={i} cx={22 + dx} cy={42 + dy} r="2.5" fill={colors[i % colors.length]}
            style={{ animation: `sparkFade ${0.5 + (i % 3) * 0.15}s ${i * 0.06 + delay}s ease-out infinite` }} />
        );
      })}
    </svg>
  );
}

// Bomb / sound cracker pictograph
function BombIcon({ style, delay = 0 }) {
  return (
    <svg width="36" height="48" viewBox="0 0 36 48" style={{ ...style, animationDelay: `${delay}s` }} className="bomb-icon">
      {/* Fuse */}
      <path d="M18 10 Q24 4 20 0" stroke="#fbbf24" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="20" cy="0" r="2.5" fill="#ef4444"
        style={{ animation: `sparkFade 0.4s ${delay}s ease-in-out infinite alternate` }} />
      {/* Body */}
      <circle cx="18" cy="24" r="14" fill="url(#bombGrad)"
        style={{ animation: `bombPulse 1.2s ${delay}s ease-in-out infinite alternate` }} />
      {/* Shine */}
      <ellipse cx="12" cy="16" rx="4" ry="3" fill="rgba(255,255,255,0.25)" transform="rotate(-30 12 16)" />
      {/* Label */}
      <text x="18" y="28" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white" opacity="0.9">💥</text>
      <defs>
        <radialGradient id="bombGrad" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#fca5a5" />
          <stop offset="60%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </radialGradient>
      </defs>
    </svg>
  );
}

// Star burst pictograph
function StarBurst({ x, y, r, color, delay }) {
  const pts = 8;
  const outer = r, inner = r * 0.45;
  let d = "";
  for (let i = 0; i < pts * 2; i++) {
    const angle = (i * Math.PI) / pts - Math.PI / 2;
    const rr = i % 2 === 0 ? outer : inner;
    const px = x + Math.cos(angle) * rr;
    const py = y + Math.sin(angle) * rr;
    d += (i === 0 ? "M" : "L") + `${px.toFixed(2)},${py.toFixed(2)}`;
  }
  d += "Z";
  return (
    <path d={d} fill={color}
      style={{
        transformOrigin: `${x}px ${y}px`,
        animation: `starSpin 3s ${delay}s linear infinite, glowPulse 1.2s ${delay}s ease-in-out infinite alternate`,
        opacity: 0.85,
      }} />
  );
}

// Ground chakkar (spinning wheel) pictograph
function ChakkarIcon({ style, delay = 0 }) {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" style={{ ...style, animationDelay: `${delay}s` }}>
      <g style={{ transformOrigin: "22px 22px", animation: `chakkarSpin 1.2s ${delay}s linear infinite` }}>
        {[...Array(8)].map((_, i) => {
          const a = (i / 8) * 360;
          const colors = ["#ffd700", "#ef4444", "#06b6d4", "#a855f7", "#10b981", "#f59e0b", "#ec4899", "#ffffff"];
          return (
            <path key={i}
              d={`M22 22 Q${22 + 18 * Math.cos(((a - 15) * Math.PI) / 180)} ${22 + 18 * Math.sin(((a - 15) * Math.PI) / 180)} ${22 + 18 * Math.cos((a * Math.PI) / 180)} ${22 + 18 * Math.sin((a * Math.PI) / 180)} Z`}
              fill={colors[i]} opacity="0.9"
            />
          );
        })}
        <circle cx="22" cy="22" r="3" fill="#ffffff" />
      </g>
    </svg>
  );
}

/* ─────────────── Stars Background ─────────────── */
function Stars() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {Array.from({ length: 80 }, (_, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${(i * 137.5) % 100}%`,
          top: `${(i * 79.3) % 100}%`,
          width: i % 8 === 0 ? 2.5 : 1,
          height: i % 8 === 0 ? 2.5 : 1,
          borderRadius: "50%",
          background: i % 4 === 0 ? "#ff4444" : i % 5 === 0 ? "#fbbf24" : "#ffffff",
          opacity: 0.3 + (i % 5) * 0.1,
          animation: `twinkle ${2 + (i % 3) * 0.6}s ${(i * 0.08) % 3}s ease-in-out infinite`,
        }} />
      ))}
    </div>
  );
}

/* ─────────────── Skyline ─────────────── */
function Skyline() {
  return (
    <svg viewBox="0 0 1440 320" preserveAspectRatio="xMidYMax slice"
      style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "42%", pointerEvents: "none", zIndex: 1 }}>
      <defs>
        <linearGradient id="skyGlow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#dc2626" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="1440" height="320" fill="url(#skyGlow)" />
      {[
        [0, 210, 90, 110], [100, 195, 65, 125], [175, 185, 80, 135],
        [265, 200, 60, 120], [335, 178, 95, 142], [440, 190, 70, 130],
        [520, 172, 100, 148], [630, 188, 65, 132], [705, 175, 85, 145],
        [800, 192, 70, 128], [880, 180, 90, 140], [980, 198, 60, 122],
        [1050, 172, 80, 148], [1140, 188, 70, 132], [1220, 202, 85, 118], [1315, 210, 90, 110],
      ].map(([x, y, w, h], i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={h} fill="#0a0a0a" />
          {Array.from({ length: Math.floor(h / 26) }, (_, r) =>
            Array.from({ length: Math.floor(w / 20) }, (_, c) => (
              <rect key={`${r}-${c}`} x={x + 4 + c * 20} y={y + 6 + r * 26} width={7} height={9}
                fill={(r + c) % 3 === 0 ? "#ff3333" : "#ffffff"} opacity={0.6} />
            ))
          )}
        </g>
      ))}
      <rect x="0" y="314" width="1440" height="6" fill="#111111" />
    </svg>
  );
}

/* ─────────────── Letter Drop ─────────────── */
function Word({ text, delay, gradient }) {
  return (
    <span style={{ display: "block" }}>
      {text.split("").map((ch, i) => (
        <span key={i} style={{
          display: "inline-block", opacity: 0,
          fontSize: "clamp(36px,10vw,100px)", fontWeight: 900,
          fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
          background: gradient, backgroundSize: "200% auto",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          backgroundClip: "text", letterSpacing: "0.04em",
          animation: "drop .38s cubic-bezier(.23,1.5,.6,1) both",
          animationDelay: `${delay + i * 0.035}s`,
          animationFillMode: "forwards",
        }}>
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </span>
  );
}

/* ─────────────── Animated Diya / Lamp Icon ─────────────── */
function DiyaSVG({ style }) {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" style={style}>
      {/* Flame */}
      <ellipse cx="26" cy="12" rx="5" ry="8" fill="url(#flameG)"
        style={{ animation: "flamePulse 0.7s ease-in-out infinite alternate" }} />
      <ellipse cx="26" cy="14" rx="2.5" ry="4" fill="#fbbf24"
        style={{ animation: "flamePulse 0.5s 0.1s ease-in-out infinite alternate" }} />
      {/* Bowl */}
      <path d="M10 28 Q12 40 26 40 Q40 40 42 28 Z" fill="url(#diyaGrad)" />
      <ellipse cx="26" cy="28" rx="16" ry="4" fill="#b45309" />
      {/* Wick */}
      <rect x="24" y="18" width="4" height="10" rx="2" fill="#92400e" />
      {/* Glow */}
      <circle cx="26" cy="20" r="12" fill="#f59e0b" opacity="0.08"
        style={{ animation: "glowPulse 1s ease-in-out infinite alternate" }} />
      <defs>
        <linearGradient id="flameG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fef9c3" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="diyaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ─────────────── Pictograph Panel (centre) ─────────────── */
function PictographPanel({ show }) {
  if (!show) return null;
  return (
    <div style={{
      display: "flex", alignItems: "flex-end", justifyContent: "center",
      gap: "clamp(10px, 3vw, 32px)", margin: "0 0 16px",
      animation: "fadeUp .5s .55s ease both", opacity: 0, animationFillMode: "forwards",
    }}>
      {/* Left sparkler */}
      <SparklerIcon delay={0.1} color="#ffd700"
        style={{ transform: "rotate(-10deg)", transformOrigin: "bottom center" }} />

      {/* Chakkar */}
      <ChakkarIcon delay={0.2}
        style={{ transform: "translateY(8px)" }} />

      {/* Centre: Diya */}
      <DiyaSVG style={{ filter: "drop-shadow(0 0 12px #f59e0b)" }} />

      {/* Rocket (going up) */}
      <RocketIcon delay={0.15}
        style={{ transform: "translateY(-4px) rotate(-8deg)", filter: "drop-shadow(0 0 8px #ef4444)" }} />

      {/* Flower pot */}
      <FlowerPotIcon delay={0.3}
        style={{ transform: "translateY(6px)" }} />

      {/* Right sparkler */}
      <SparklerIcon delay={0.2} color="#a855f7"
        style={{ transform: "rotate(10deg)", transformOrigin: "bottom center" }} />
    </div>
  );
}

/* ─────────────── Feature Pills ─────────────── */
const PILLS = [
  { icon: "🏭", text: "Direct Sivakasi Factory" },
  { icon: "✅", text: "100% Genuine Quality" },
  { icon: "🎁", text: "Best Festival Prices" },
];

function FeaturePills({ show }) {
  if (!show) return null;
  return (
    <div style={{
      display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center",
      animation: "fadeUp .4s .72s ease both", opacity: 0, animationFillMode: "forwards",
    }}>
      {PILLS.map((p, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "6px 14px", borderRadius: 999,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.12)",
          backdropFilter: "blur(8px)",
          color: "#ffffff", fontSize: "clamp(10px,1.6vw,12px)", fontWeight: 700,
          letterSpacing: "0.03em",
          animation: `fadeUp .4s ${0.72 + i * 0.08}s ease both`,
          animationFillMode: "forwards", opacity: 0,
        }}>
          <span style={{ fontSize: 14 }}>{p.icon}</span>
          <span>{p.text}</span>
        </div>
      ))}
    </div>
  );
}

/* ─────────────── Main Launch Component ─────────────── */
export default function Launch({ onComplete }) {
  const canvasRef = useRef(null);
  const [showContent, setShowContent] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0); // 0=idle, 1=content, 2=complete

  useFireworksEngine(canvasRef);

  useEffect(() => {
    const ids = [];
    const t = (fn, ms) => { const id = setTimeout(fn, ms); ids.push(id); };

    t(() => { setShowContent(true); setPhase(1); }, 300);
    t(() => setPhase(2), 2500);

    const TOTAL = 5800;
    const start = Date.now();
    const tick = setInterval(() => {
      const pct = Math.min(((Date.now() - start) / TOTAL) * 100, 100);
      setProgress(pct);
      if (pct >= 100) clearInterval(tick);
    }, 30);
    ids.push(tick);

    t(() => setExiting(true), 5300);
    t(() => onComplete?.(), 5800);

    return () => ids.forEach((id) => { clearTimeout(id); clearInterval(id); });
  }, [onComplete]);

  const handleSkip = () => {
    setExiting(true);
    setTimeout(() => onComplete?.(), 200);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 99999,
      background: "radial-gradient(ellipse at 50% 30%, #0f0005 0%, #000000 70%)",
      overflow: "hidden",
      transform: exiting ? "scale(1.04)" : "scale(1)",
      opacity: exiting ? 0 : 1,
      transition: "opacity 0.5s ease, transform 0.5s ease",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800;900&display=swap');

        @keyframes twinkle    { 0%,100%{opacity:.15} 50%{opacity:.9} }
        @keyframes drop       { 0%{opacity:0;transform:translateY(-24px) scaleX(0.8)} 100%{opacity:1;transform:translateY(0) scaleX(1)} }
        @keyframes fadeUp     { 0%{opacity:0;transform:translateY(14px)} 100%{opacity:1;transform:translateY(0)} }
        @keyframes flamePulse { 0%{transform:scaleX(1) scaleY(1)} 100%{transform:scaleX(1.18) scaleY(0.88)} }
        @keyframes glowPulse  { 0%{opacity:.6;r:10} 100%{opacity:1;r:14} }
        @keyframes bombPulse  { 0%{transform:scale(1)} 100%{transform:scale(1.06)} }
        @keyframes sparkFlicker { 0%{opacity:.4;stroke-width:1} 100%{opacity:1;stroke-width:2} }
        @keyframes fountainArc  { 0%{opacity:1;transform:scaleY(1)} 80%{opacity:.6} 100%{opacity:0;transform:scaleY(0.3)} }
        @keyframes sparkFade    { 0%{opacity:1;transform:scale(1)} 100%{opacity:0;transform:scale(0.3)} }
        @keyframes starSpin     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes chakkarSpin  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes floatUp      { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-8px)} }
        @keyframes rocketRise   { 0%,100%{transform:translateY(0px) rotate(-8deg)} 50%{transform:translateY(-12px) rotate(-8deg)} }
        @keyframes progressGlow { 0%{box-shadow:0 0 8px #ef4444} 100%{box-shadow:0 0 20px #ef4444, 0 0 40px #ffd70040} }

        .sparkler-icon { animation: floatUp 2s ease-in-out infinite; }
        .rocket-icon   { animation: rocketRise 1.6s ease-in-out infinite; }
        .flowerpot-icon { animation: floatUp 2.4s 0.3s ease-in-out infinite; }
        .bomb-icon     { animation: floatUp 2s 0.6s ease-in-out infinite; }
      `}</style>

      {/* Stars */}
      <Stars />

      {/* Skyline */}
      <Skyline />

      {/* Canvas fireworks */}
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none" }} />

      {/* ── Top Bar ── */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, zIndex: 10,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "10px 18px",
        background: "linear-gradient(to bottom, rgba(0,0,0,0.9), transparent)",
      }}>
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Animated sparkle circle */}
          <div style={{
            width: 34, height: 34, borderRadius: "50%",
            background: "linear-gradient(135deg, #f59e0b, #ef4444, #a855f7)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 14px rgba(245,158,11,0.6)",
            animation: "glowPulse 1.5s ease-in-out infinite alternate",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                fill="#ffffff" />
            </svg>
          </div>
          <div>
            <div style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 900,
              fontSize: "clamp(12px,2vw,14px)", color: "#ffffff", letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}>Deepa Crackers</div>
            <div style={{ fontSize: 9, color: "#f59e0b", letterSpacing: "0.15em", fontWeight: 700 }}>
              SINCE 1985 · THIRUTHURAIPOONDI
            </div>
          </div>
        </div>

        {/* Skip button */}
        <button onClick={handleSkip} style={{
          cursor: "pointer", background: "rgba(220,38,38,0.15)",
          border: "1px solid #ef4444", color: "#f87171",
          fontSize: 11, fontWeight: 800, padding: "5px 14px",
          borderRadius: 8, letterSpacing: "0.08em", textTransform: "uppercase",
          transition: "all 0.2s",
          backdropFilter: "blur(8px)",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "#dc2626"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(220,38,38,0.15)"; e.currentTarget.style.color = "#f87171"; }}
        >
          Skip ➔
        </button>
      </div>

      {/* ── Center Content ── */}
      {showContent && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 9,
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", padding: "0 20px", textAlign: "center",
          pointerEvents: "none",
          gap: 4,
        }}>

          {/* Tagline */}
          <p style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700,
            fontSize: "clamp(10px,1.8vw,13px)", color: "#ef4444",
            letterSpacing: "0.28em", textTransform: "uppercase", margin: "0 0 10px",
            animation: "fadeUp .3s .05s ease both", opacity: 0, animationFillMode: "forwards",
          }}>
            🪔 Illuminating Every Celebration
          </p>

          {/* Pictographs */}
          <PictographPanel show={true} />

          {/* Title words */}
          <h1 style={{ margin: "0 0 6px", lineHeight: 1.0 }}>
            <Word text="DEEPA" delay={0.06}
              gradient="linear-gradient(135deg, #ffffff 0%, #fbbf24 40%, #ef4444 80%, #ffffff 100%)" />
            <Word text="CRACKERS" delay={0.22}
              gradient="linear-gradient(135deg, #ffffff 0%, #ef4444 50%, #dc2626 80%, #ffffff 100%)" />
          </h1>

          {/* Sub text */}
          <p style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "clamp(11px,1.9vw,14px)", color: "#a3a3a3",
            letterSpacing: "0.02em", maxWidth: 420, lineHeight: 1.6,
            margin: "8px 0 14px",
            animation: "fadeUp .4s .4s ease both", opacity: 0, animationFillMode: "forwards",
          }}>
            Supreme quality fireworks — direct from Sivakasi. No middlemen. Pure celebration.
          </p>

          {/* Feature pills */}
          <FeaturePills show={true} />

          {/* Entering badge */}
          <div style={{
            marginTop: 18,
            animation: "fadeUp .4s .9s ease both", opacity: 0, animationFillMode: "forwards",
          }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "8px 22px", borderRadius: 10,
              border: "1px solid #dc2626",
              background: "rgba(127,29,29,0.2)",
              backdropFilter: "blur(8px)",
              color: "#ffffff", fontSize: 11, fontWeight: 800,
              letterSpacing: "0.14em", textTransform: "uppercase",
            }}>
              {/* Animated dots */}
              <span style={{ display: "flex", gap: 4 }}>
                {[0, 1, 2].map(i => (
                  <span key={i} style={{
                    width: 5, height: 5, borderRadius: "50%",
                    background: "#ef4444",
                    display: "inline-block",
                    animation: `sparkFade 0.8s ${i * 0.2}s ease-in-out infinite alternate`,
                    boxShadow: "0 0 6px #ef4444",
                  }} />
                ))}
              </span>
              Entering Store
            </div>
          </div>
        </div>
      )}

      {/* ── Bottom Progress Bar ── */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 10,
        background: "linear-gradient(to top, rgba(0,0,0,0.95), transparent)",
        paddingTop: 20,
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between",
          padding: "4px 20px 6px",
          fontSize: 9, color: "#525252",
          fontFamily: "monospace", letterSpacing: "0.08em", textTransform: "uppercase",
        }}>
          <span>🎆 Igniting Celebrations</span>
          <span style={{ color: progress > 80 ? "#ef4444" : "#525252" }}>{Math.round(progress)}%</span>
        </div>
        <div style={{ height: 3, background: "#171717", position: "relative", overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${progress}%`,
            background: "linear-gradient(90deg, #7f1d1d, #dc2626, #f59e0b, #ffffff)",
            transition: "width .05s linear",
            animation: "progressGlow 1s ease-in-out infinite alternate",
          }} />
          {/* Moving sparkle tip */}
          <div style={{
            position: "absolute", top: -3, left: `${progress}%`,
            width: 8, height: 8, borderRadius: "50%",
            background: "#ffffff", boxShadow: "0 0 10px #ef4444, 0 0 20px #ffd700",
            transform: "translateX(-50%)",
            transition: "left .05s linear",
            display: progress > 1 ? "block" : "none",
          }} />
        </div>
      </div>
    </div>
  );
}
