import React, { useEffect, useRef, useState, useCallback } from "react";

const rand = (a, b) => Math.random() * (b - a) + a;
const randInt = (a, b) => Math.floor(rand(a, b));

// Strict Red, White, and Black Firework Palettes
const BURST_PALETTES = [
  ["#ff0033", "#ffffff", "#cc0022", "#ffffff", "#ff4466"],
  ["#ffffff", "#ef4444", "#ffffff", "#990022", "#dc2626"],
  ["#ff1744", "#ffffff", "#b71c1c", "#ffffff", "#ff5252"],
  ["#ffffff", "#ffffff", "#ff0033", "#ffffff", "#cc0000"],
];

// ── Multi-Point Sky Fireworks Engine ────────────────────────
function useSkyFireworksEngine(canvasRef) {
  const animRef = useRef(null);
  const particles = useRef([]);
  const rockets = useRef([]);
  const frame = useRef(0);
  const W = useRef(0);
  const H = useRef(0);

  const burst = useCallback((x, y, palette, countOverride = null) => {
    const pal = palette || BURST_PALETTES[randInt(0, BURST_PALETTES.length)];
    const count = countOverride || randInt(110, 160);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + rand(-0.06, 0.06);
      const speed = rand(3, 11);
      particles.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: pal[randInt(0, pal.length)],
        alpha: 1,
        size: rand(2.0, 4.5),
        decay: rand(0.013, 0.024),
        gravity: rand(0.06, 0.12),
        tail: [],
        twinkle: Math.random() > 0.45,
        twinkleSpeed: rand(0.09, 0.22),
        twinklePhase: rand(0, Math.PI * 2),
      });
    }
    // Crisp white ring
    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2;
      particles.current.push({
        x,
        y,
        vx: Math.cos(angle) * rand(7, 12),
        vy: Math.sin(angle) * rand(7, 12),
        color: "#ffffff",
        alpha: 1,
        size: rand(1.4, 2.5),
        decay: rand(0.025, 0.04),
        gravity: 0.03,
        tail: [],
        twinkle: false,
        twinkleSpeed: 0,
        twinklePhase: 0,
      });
    }
  }, []);

  const launchSkyBurst = useCallback((tx, ty, pal) => {
    const sx = W.current * rand(0.2, 0.8);
    const sy = H.current + 10;
    const dur = rand(38, 55);
    rockets.current.push({
      x: sx,
      y: sy,
      vx: (tx - sx) / dur,
      vy: (ty - sy) / dur,
      trail: [],
      life: dur,
      palette: pal,
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      W.current = canvas.width;
      H.current = canvas.height;
    };
    resize();
    window.addEventListener("resize", resize);

    const ids = [];

    // Instant initial center welcoming bursts
    ids.push(setTimeout(() => burst(W.current * 0.5, H.current * 0.22, BURST_PALETTES[0], 220), 150));
    ids.push(setTimeout(() => burst(W.current * 0.28, H.current * 0.18, BURST_PALETTES[1], 180), 400));
    ids.push(setTimeout(() => burst(W.current * 0.72, H.current * 0.18, BURST_PALETTES[2], 180), 650));

    // Staggered sky rockets bursting across multiple positions
    const skyPositions = [
      [0.2, 0.26],
      [0.8, 0.26],
      [0.38, 0.14],
      [0.62, 0.14],
      [0.15, 0.18],
      [0.85, 0.18],
      [0.5, 0.12],
    ];

    skyPositions.forEach(([tx, ty], i) => {
      ids.push(
        setTimeout(() => {
          launchSkyBurst(
            W.current * tx,
            H.current * ty,
            BURST_PALETTES[i % BURST_PALETTES.length]
          );
        }, 800 + i * 280)
      );
    });

    // Continuous celebration loops
    ids.push(
      setInterval(() => {
        launchSkyBurst(
          W.current * rand(0.12, 0.88),
          H.current * rand(0.08, 0.35),
          BURST_PALETTES[randInt(0, BURST_PALETTES.length)]
        );
      }, 380)
    );

    const draw = () => {
      frame.current++;
      ctx.clearRect(0, 0, W.current, H.current);

      // 1. Draw Rising Rockets
      rockets.current = rockets.current.filter((r) => {
        r.trail.push({ x: r.x, y: r.y });
        if (r.trail.length > 12) r.trail.shift();
        r.x += r.vx;
        r.y += r.vy;
        r.life--;

        r.trail.forEach((pt, i) => {
          const a = (i / r.trail.length) * 0.75;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, (i / r.trail.length) * 3.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(239, 68, 68, ${a})`;
          ctx.fill();
        });
        ctx.beginPath();
        ctx.arc(r.x, r.y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "#ff0033";
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        if (r.life <= 0) {
          burst(r.x, r.y, r.palette);
          return false;
        }
        return true;
      });

      // 2. Draw Firework Particles
      particles.current = particles.current.filter((p) => {
        p.tail.push({ x: p.x, y: p.y });
        if (p.tail.length > 5) p.tail.shift();
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.985;
        p.alpha -= p.decay;
        if (p.alpha <= 0) return false;

        const tm = p.twinkle
          ? 0.5 + 0.5 * Math.sin(frame.current * p.twinkleSpeed + p.twinklePhase)
          : 1;

        p.tail.forEach((pt, i) => {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, p.size * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = (i / p.tail.length) * p.alpha * 0.35 * tm;
          ctx.fill();
        });
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * tm;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
        return true;
      });

      animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      ids.forEach((id) => {
        clearTimeout(id);
        clearInterval(id);
      });
      window.removeEventListener("resize", resize);
      particles.current = [];
      rockets.current = [];
    };
  }, [burst, launchSkyBurst]);
}

// ── Stars ───────────────────────────────────────────────────
function Stars() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {Array.from({ length: 70 }, (_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${(i * 137.5) % 100}%`,
            top: `${(i * 79.3) % 100}%`,
            width: i % 8 === 0 ? 2 : 1,
            height: i % 8 === 0 ? 2 : 1,
            borderRadius: "50%",
            background: i % 4 === 0 ? "#ff4444" : "#ffffff",
            opacity: 0.35,
            animation: `twinkle ${2 + (i % 3) * 0.6}s ${(i * 0.08) % 3}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ── Skyline ─────────────────────────────────────────────────
function Skyline() {
  return (
    <svg
      viewBox="0 0 1440 320"
      preserveAspectRatio="xMidYMax slice"
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "45%",
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      <defs>
        <linearGradient id="skyGlowRed" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#dc2626" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="1440" height="320" fill="url(#skyGlowRed)" />

      {/* Buildings */}
      {[
        [0, 210, 90, 110],
        [100, 195, 65, 125],
        [175, 185, 80, 135],
        [265, 200, 60, 120],
        [335, 178, 95, 142],
        [440, 190, 70, 130],
        [520, 172, 100, 148],
        [630, 188, 65, 132],
        [705, 175, 85, 145],
        [800, 192, 70, 128],
        [880, 180, 90, 140],
        [980, 198, 60, 122],
        [1050, 172, 80, 148],
        [1140, 188, 70, 132],
        [1220, 202, 85, 118],
        [1315, 210, 90, 110],
      ].map(([x, y, w, h], i) => (
        <g key={`b${i}`}>
          <rect x={x} y={y} width={w} height={h} fill="#0d0d0d" />
          {Array.from({ length: Math.floor(h / 26) }, (_, r) =>
            Array.from({ length: Math.floor(w / 20) }, (_, c) => (
              <rect
                key={`${r}${c}`}
                x={x + 4 + c * 20}
                y={y + 6 + r * 26}
                width={7}
                height={9}
                fill={(r + c) % 3 === 0 ? "#ff3333" : "#ffffff"}
                opacity={0.7}
              />
            ))
          )}
        </g>
      ))}

      <rect x="0" y="314" width="1440" height="6" fill="#141414" />
      <line x1="0" y1="314" x2="1440" y2="314" stroke="#262626" strokeWidth="1" />
    </svg>
  );
}

// ── Reveal Text Word ────────────────────────────────────────
function Word({ text, delay, gradient }) {
  return (
    <span style={{ display: "block" }}>
      {text.split("").map((ch, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            opacity: 0,
            fontSize: "clamp(34px,9vw,96px)",
            fontWeight: 900,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            background: gradient,
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "0.04em",
            animation: `drop .35s cubic-bezier(.23,1.5,.6,1) both`,
            animationDelay: `${delay + i * 0.03}s`,
            animationFillMode: "forwards",
          }}
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </span>
  );
}

// ── Main Launch Screen Component ─────────────────────────────
export default function Launch({ onComplete }) {
  const canvasRef = useRef(null);

  const [showContent, setShowContent] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [progress, setProgress] = useState(0);

  useSkyFireworksEngine(canvasRef);

  useEffect(() => {
    const ids = [];
    const t = (fn, ms) => {
      const id = setTimeout(fn, ms);
      ids.push(id);
      return id;
    };

    // Instant smooth content reveal on first firework
    t(() => setShowContent(true), 250);

    // Progress bar
    const totalMs = 5000;
    const start = Date.now();
    const tick = setInterval(() => {
      const pct = Math.min(((Date.now() - start) / totalMs) * 100, 100);
      setProgress(pct);
      if (pct >= 100) clearInterval(tick);
    }, 30);
    ids.push(tick);

    // Exit
    t(() => setExiting(true), 4600);
    t(() => onComplete && onComplete(), 5000);

    return () => ids.forEach((id) => {
      clearTimeout(id);
      clearInterval(id);
    });
  }, [onComplete]);

  const handleSkip = () => {
    setExiting(true);
    setTimeout(() => onComplete && onComplete(), 150);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "#000000",
        overflow: "hidden",
        transform: exiting ? "translateY(-100%)" : "translateY(0)",
        transition: "transform 0.4s cubic-bezier(0.76,0,0.24,1)",
      }}
    >
      <style>{`
        @keyframes twinkle { 0%,100%{opacity:.2} 50%{opacity:.85} }
        @keyframes drop    { 0%{opacity:0; transform:translateY(-20px)} 100%{opacity:1; transform:translateY(0)} }
        @keyframes fadeUp  { 0%{opacity:0; transform:translateY(10px)} 100%{opacity:1; transform:translateY(0)} }
      `}</style>

      {/* Stars */}
      <Stars />

      {/* Skyline */}
      <Skyline />

      {/* 60fps Canvas for Multi-Point Sky Fireworks */}
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none" }}
      />

      {/* Content reveal */}
      {showContent && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 9,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 20px",
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(11px,1.8vw,14px)",
              color: "#ef4444",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              margin: "0 0 8px",
              animation: "fadeUp .35s .02s ease both",
              opacity: 0,
              animationFillMode: "forwards",
            }}
          >
            Thiruthuraipoondi &nbsp;·&nbsp; Direct Sivakasi Sourcing
          </p>

          <h1 style={{ margin: "0 0 4px", lineHeight: 1.0 }}>
            <Word
              text="DEEPA"
              delay={0.05}
              gradient="linear-gradient(135deg, #ffffff 0%, #ef4444 60%, #ffffff 100%)"
            />
            <Word
              text="CRACKERS"
              delay={0.2}
              gradient="linear-gradient(135deg, #ffffff 0%, #dc2626 60%, #ffffff 100%)"
            />
          </h1>

          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "clamp(12px,2vw,15px)",
              color: "#a3a3a3",
              letterSpacing: "0.02em",
              maxWidth: 420,
              lineHeight: 1.5,
              margin: "10px 0 18px",
              animation: "fadeUp .4s .35s ease both",
              opacity: 0,
              animationFillMode: "forwards",
            }}
          >
            Illuminating celebrations with supreme quality fireworks direct from Sivakasi.
          </p>

          <div
            style={{
              animation: "fadeUp .4s .5s ease both",
              opacity: 0,
              animationFillMode: "forwards",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 20px",
                borderRadius: "8px",
                border: "1px solid #dc2626",
                background: "#7f1d1d33",
                color: "#ffffff",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              Entering Store
            </div>
          </div>
        </div>
      )}

      {/* Top Bar with Skip button */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 20px",
          borderBottom: "1px solid #1f1f1f",
          background: "rgba(0,0,0,0.85)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#ef4444",
              boxShadow: "0 0 8px #ef4444",
            }}
          />
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "11px",
              letterSpacing: "0.15em",
              color: "#ffffff",
              textTransform: "uppercase",
              fontWeight: 900,
            }}
          >
            Deepa Crackers
          </span>
        </div>

        <button
          onClick={handleSkip}
          style={{
            cursor: "pointer",
            background: "#dc2626",
            border: "1px solid #ef4444",
            color: "#ffffff",
            fontSize: "10px",
            fontWeight: 800,
            padding: "4px 12px",
            borderRadius: "6px",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Skip ➔
        </button>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          background: "rgba(0,0,0,0.9)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "6px 20px 4px",
            fontSize: 9,
            color: "#737373",
            fontFamily: "monospace",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          <span>Igniting Celebrations</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div
          style={{
            height: 2,
            background: "#171717",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "linear-gradient(90deg, #991b1b, #ef4444, #ffffff)",
              transition: "width .05s linear",
              boxShadow: "0 0 10px #ef4444",
            }}
          />
        </div>
      </div>
    </div>
  );
}
