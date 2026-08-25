import React, { useEffect, useRef, useState, useCallback } from "react";

const rand = (a, b) => Math.random() * (b - a) + a;
const randInt = (a, b) => Math.floor(rand(a, b));

// Vibrant Festival & Sparkler Palettes (Gold, Crimson, Diamond White, Amber)
const BURST_PALETTES = [
  ["#ff0033", "#ffffff", "#ffd700", "#ff4466", "#ffffff"],
  ["#ffd700", "#ffea00", "#ffffff", "#ff9900", "#fff8dc"],
  ["#ff1744", "#ffffff", "#ff5252", "#ffd700", "#ffffff"],
  ["#ffffff", "#ffd700", "#ff0055", "#fff0f5", "#ffcc00"],
];

const GOLD_SPARKLER_COLORS = [
  "#ffffff", "#fff8dc", "#ffd700", "#ffec8b", "#ffe4b5", "#ffaa00", "#ff4444"
];

// ── Ultra-Smooth, Elegant & Slower 60FPS High-Density Sparkler Engine ──
function useSkyFireworksEngine(canvasRef) {
  const animRef = useRef(null);
  const particles = useRef([]);
  const sparklers = useRef([]); // Shimmering sparkler dust & embers
  const rockets = useRef([]);
  const frame = useRef(0);
  const W = useRef(0);
  const H = useRef(0);

  // Spawn dense sparkling glitter shower with gentle, slow drift
  const spawnSparklerDust = useCallback((x, y, count, spreadSpeed = 2.5, customPalette = null) => {
    const pal = customPalette || GOLD_SPARKLER_COLORS;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = rand(0.3, spreadSpeed);
      sparklers.current.push({
        x: x + rand(-3, 3),
        y: y + rand(-3, 3),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - rand(0.1, 1.2), // gentle upward spark float
        color: pal[randInt(0, pal.length)],
        alpha: rand(0.85, 1.0),
        size: rand(1.2, 2.6),
        decay: rand(0.007, 0.014), // Slower fade for lasting sparkle
        gravity: rand(0.018, 0.04), // Slower floating descent
        drag: rand(0.975, 0.988),
        twinkleSpeed: rand(0.1, 0.22), // Slower, softer twinkling
        twinklePhase: rand(0, Math.PI * 2),
      });
    }
  }, []);

  const burst = useCallback((x, y, palette, countOverride = null) => {
    const isMob = (typeof window !== "undefined" ? window.innerWidth : 1000) < 768;
    const pal = palette || BURST_PALETTES[randInt(0, BURST_PALETTES.length)];
    const defaultCount = isMob ? randInt(55, 75) : randInt(95, 130);
    const count = countOverride ? (isMob ? Math.floor(countOverride * 0.6) : countOverride) : defaultCount;

    // 1. Primary shell burst stars with relaxed bloom speed
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + rand(-0.08, 0.08);
      const speed = rand(isMob ? 2.0 : 2.6, isMob ? 5.5 : 7.8); // Slower bloom
      particles.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: pal[randInt(0, pal.length)],
        alpha: 1,
        size: rand(isMob ? 2.2 : 2.8, isMob ? 3.4 : 4.4),
        decay: rand(0.008, 0.016), // Slower decay (hangs in the air)
        gravity: rand(0.03, 0.065), // Gentler gravity
        trail: [],
        twinkle: Math.random() > 0.3,
        twinkleSpeed: rand(0.09, 0.18),
        twinklePhase: rand(0, Math.PI * 2),
        sparkDropCounter: 0,
      });
    }

    // 2. Extra dense, crackling golden & diamond sparkler cloud
    const sparklerCount = isMob ? randInt(45, 65) : randInt(85, 130);
    spawnSparklerDust(x, y, sparklerCount, isMob ? 3.5 : 5.0, GOLD_SPARKLER_COLORS);

    // 3. Crisp white center sparkle ring
    const ringCount = isMob ? 16 : 26;
    for (let i = 0; i < ringCount; i++) {
      const angle = (i / ringCount) * Math.PI * 2;
      particles.current.push({
        x,
        y,
        vx: Math.cos(angle) * rand(isMob ? 3.5 : 5.0, isMob ? 6.0 : 8.5),
        vy: Math.sin(angle) * rand(isMob ? 3.5 : 5.0, isMob ? 6.0 : 8.5),
        color: "#ffffff",
        alpha: 1,
        size: rand(1.4, 2.2),
        decay: rand(0.015, 0.028),
        gravity: 0.025,
        trail: [],
        twinkle: true,
        twinkleSpeed: 0.25,
        twinklePhase: rand(0, Math.PI * 2),
        sparkDropCounter: 999,
      });
    }
  }, [spawnSparklerDust]);

  const launchSkyBurst = useCallback((tx, ty, pal) => {
    const sx = W.current * rand(0.2, 0.8);
    const sy = H.current + 10;
    const dur = rand(54, 76); // Slower, graceful rocket ascent (~1.0s to 1.3s)
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

    const ids = [];
    const isMob = window.innerWidth < 768;

    // Gracefully timed welcoming multi-point sparkler bursts
    ids.push(setTimeout(() => burst(W.current * 0.5, H.current * 0.22, BURST_PALETTES[0], 160), 150));
    ids.push(setTimeout(() => burst(W.current * 0.25, H.current * 0.20, BURST_PALETTES[1], 550), 550));
    ids.push(setTimeout(() => burst(W.current * 0.75, H.current * 0.20, BURST_PALETTES[2], 950), 950));

    // Staggered sky rockets bursting across positions with relaxed timing
    const skyPositions = [
      [0.22, 0.26],
      [0.78, 0.26],
      [0.36, 0.16],
      [0.64, 0.16],
      [0.5, 0.13],
    ];

    skyPositions.forEach(([tx, ty], i) => {
      ids.push(
        setTimeout(() => {
          launchSkyBurst(
            W.current * tx,
            H.current * ty,
            BURST_PALETTES[i % BURST_PALETTES.length]
          );
        }, 1100 + i * 480)
      );
    });

    // Slower continuous celebration loops
    ids.push(
      setInterval(() => {
        launchSkyBurst(
          W.current * rand(0.15, 0.85),
          H.current * rand(0.1, 0.32),
          BURST_PALETTES[randInt(0, BURST_PALETTES.length)]
        );
      }, isMob ? 950 : 750)
    );

    // Bottom-corner ambient flowerpot / sparkler fountains with gentle cadence
    ids.push(
      setInterval(() => {
        if (Math.random() > 0.3) {
          // Left corner fountain
          spawnSparklerDust(W.current * rand(0.05, 0.18), H.current - 10, isMob ? 5 : 10, isMob ? 4.5 : 6.5, GOLD_SPARKLER_COLORS);
          // Right corner fountain
          spawnSparklerDust(W.current * rand(0.82, 0.95), H.current - 10, isMob ? 5 : 10, isMob ? 4.5 : 6.5, GOLD_SPARKLER_COLORS);
        }
      }, 300)
    );

    const draw = () => {
      frame.current++;
      ctx.clearRect(0, 0, W.current, H.current);

      // Hardware-accelerated additive blending for radiant glowing sparklers
      ctx.globalCompositeOperation = "lighter";

      // 1. Draw Rising Rockets & emit ascending sparkler trail
      rockets.current = rockets.current.filter((r) => {
        r.trail.push({ x: r.x, y: r.y });
        if (r.trail.length > (isMob ? 8 : 12)) r.trail.shift();
        r.x += r.vx;
        r.y += r.vy;
        r.life--;

        // Emit sparkling micro-embers from rocket tail (slower, floating sparks)
        if (frame.current % 3 === 0) {
          sparklers.current.push({
            x: r.x + rand(-2, 2),
            y: r.y + rand(0, 6),
            vx: rand(-0.8, 0.8),
            vy: rand(1.0, 2.5),
            color: Math.random() > 0.4 ? "#ffd700" : "#ffffff",
            alpha: 1,
            size: rand(1.2, 2.2),
            decay: rand(0.018, 0.035),
            gravity: 0.03,
            drag: 0.975,
            twinkleSpeed: 0.2,
            twinklePhase: rand(0, Math.PI * 2),
          });
        }

        // Rocket Trail
        for (let i = 0; i < r.trail.length; i++) {
          const pt = r.trail[i];
          const a = (i / r.trail.length) * 0.75;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, (i / r.trail.length) * 2.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(239, 68, 68, ${a})`;
          ctx.fill();
        }

        // Rocket Head Spark
        ctx.beginPath();
        ctx.arc(r.x, r.y, 3.2, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();

        if (r.life <= 0) {
          burst(r.x, r.y, r.palette);
          return false;
        }
        return true;
      });

      // 2. Draw Primary Firework Stars (and shed sparkler dust while flying)
      particles.current = particles.current.filter((p) => {
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > (isMob ? 3 : 5)) p.trail.shift();
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.985;
        p.alpha -= p.decay;

        if (p.alpha <= 0) return false;

        // Occasionally drop a glittering sparkler ember in flight
        p.sparkDropCounter++;
        if (p.sparkDropCounter === 4 && p.alpha > 0.35 && sparklers.current.length < (isMob ? 180 : 350)) {
          p.sparkDropCounter = 0;
          sparklers.current.push({
            x: p.x,
            y: p.y,
            vx: rand(-0.5, 0.5),
            vy: rand(0.1, 1.0),
            color: "#ffd700",
            alpha: p.alpha * 0.85,
            size: rand(1.0, 1.8),
            decay: rand(0.012, 0.025),
            gravity: 0.025,
            drag: 0.985,
            twinkleSpeed: 0.18,
            twinklePhase: rand(0, Math.PI * 2),
          });
        }

        const tm = p.twinkle
          ? 0.4 + 0.6 * Math.sin(frame.current * p.twinkleSpeed + p.twinklePhase)
          : 1;

        const effAlpha = Math.max(0, p.alpha * tm);

        // Short glow trail
        p.trail.forEach((pt, i) => {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, p.size * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = (i / p.trail.length) * effAlpha * 0.35;
          ctx.fill();
        });

        // Particle Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = effAlpha;
        ctx.fill();

        // Inner Bright White Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.globalAlpha = effAlpha * 0.85;
        ctx.fill();

        ctx.globalAlpha = 1;
        return true;
      });

      // 3. Draw Ultra-Smooth Sparkling Glitter Shower (Sparklers)
      sparklers.current = sparklers.current.filter((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.vy += s.gravity;
        s.vx *= s.drag;
        s.alpha -= s.decay;

        if (s.alpha <= 0) return false;

        const twinkle = 0.35 + 0.65 * Math.sin(frame.current * s.twinkleSpeed + s.twinklePhase);
        const effAlpha = Math.max(0, s.alpha * twinkle);

        // Sparkling point
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = effAlpha;
        ctx.fill();

        // High-twinkle white highlight
        if (twinkle > 0.7) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = "#ffffff";
          ctx.globalAlpha = effAlpha;
          ctx.fill();
        }

        ctx.globalAlpha = 1;
        return true;
      });

      ctx.globalCompositeOperation = "source-over";
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
      sparklers.current = [];
      rockets.current = [];
    };
  }, [burst, launchSkyBurst, spawnSparklerDust]);
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
    const totalMs = 5500;
    const start = Date.now();
    const tick = setInterval(() => {
      const pct = Math.min(((Date.now() - start) / totalMs) * 100, 100);
      setProgress(pct);
      if (pct >= 100) clearInterval(tick);
    }, 30);
    ids.push(tick);

    // Exit
    t(() => setExiting(true), 5100);
    t(() => onComplete && onComplete(), 5500);

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
