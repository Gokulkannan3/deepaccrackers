import { useEffect, useRef, useState, useCallback } from "react";

const rand = (a, b) => Math.random() * (b - a) + a;
const randInt = (a, b) => Math.floor(rand(a, b));

// Vibrant Festive Fireworks Palettes
const FIREWORK_PALETTES = [
  ["#ffd700", "#ff9100", "#ff3d00", "#ffffff"], // Royal Gold & Amber
  ["#ff007f", "#ff4081", "#e040fb", "#ffffff"], // Vivid Magenta Pink
  ["#00e5ff", "#00b0ff", "#76ff03", "#ffffff"], // Electric Cyan & Emerald
  ["#ff9100", "#ffea00", "#ffffff", "#ff1744"], // Festive Sunburst
  ["#b388ff", "#7c4dff", "#00e5ff", "#ffffff"], // Cosmic Violet
];

function useSmoothFireworks(canvasRef) {
  const animRef = useRef(null);
  const rockets = useRef([]);
  const sparks = useRef([]);
  const fountains = useRef([]);
  const stars = useRef([]);
  const frame = useRef(0);
  const W = useRef(0);
  const H = useRef(0);
  const isMobile = useRef(false);

  // Trigger aerial rocket burst (lightweight & mobile optimized)
  const explodeRocket = useCallback((x, y, palette) => {
    const pal = palette || FIREWORK_PALETTES[randInt(0, FIREWORK_PALETTES.length)];
    const count = isMobile.current ? randInt(22, 34) : randInt(40, 60);
    const burstSpeed = isMobile.current ? rand(3.0, 5.5) : rand(3.5, 6.5);

    for (let i = 0; i < count; i++) {
      const angle = rand(0, Math.PI * 2);
      const speed = rand(0.6, burstSpeed);
      sparks.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: pal[randInt(0, pal.length)],
        alpha: 1,
        size: rand(2.0, 3.4),
        decay: rand(0.018, 0.032),
        gravity: 0.05,
        drag: 0.98,
        twinkle: Math.random() > 0.4,
        tail: [],
      });
    }
  }, []);

  // Launch a sky rocket from bottom
  const launchRocket = useCallback((targetX, targetY) => {
    const startX = targetX ? targetX + rand(-25, 25) : rand(W.current * 0.15, W.current * 0.85);
    const startY = H.current + 10;
    const destX = targetX || rand(W.current * 0.2, W.current * 0.8);
    const destY = targetY || rand(H.current * 0.12, H.current * 0.4);

    const dx = destX - startX;
    const dy = destY - startY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const speed = rand(9, 13);
    const duration = dist / speed;

    rockets.current.push({
      x: startX,
      y: startY,
      vx: dx / duration,
      vy: dy / duration,
      targetY: destY,
      tail: [],
      palette: FIREWORK_PALETTES[randInt(0, FIREWORK_PALETTES.length)],
    });
  }, []);

  // Corner flower pot (anar) fountains
  const emitFountain = useCallback((cx, cy, direction = 1) => {
    const sparkCount = isMobile.current ? 1 : 2;
    for (let i = 0; i < sparkCount; i++) {
      const angle = -Math.PI / 2 + rand(-0.35, 0.35) * direction;
      const speed = rand(3.5, 8);
      fountains.current.push({
        x: cx + rand(-5, 5),
        y: cy,
        vx: Math.cos(angle) * speed * 0.55,
        vy: Math.sin(angle) * speed,
        color: Math.random() > 0.3 ? "#ffd700" : (Math.random() > 0.5 ? "#ff9100" : "#ffffff"),
        alpha: 1,
        size: rand(1.6, 2.8),
        decay: rand(0.026, 0.045),
        gravity: 0.14,
        tail: [],
      });
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      isMobile.current = width < 768;

      canvas.width = width;
      canvas.height = height;
      W.current = width;
      H.current = height;

      // Twinkling background stars
      stars.current = [];
      const starCount = isMobile.current ? 20 : 35;
      for (let i = 0; i < starCount; i++) {
        stars.current.push({
          x: rand(0, W.current),
          y: rand(0, H.current * 0.7),
          size: rand(0.8, 1.8),
          alpha: rand(0.2, 0.8),
          pulseSpeed: rand(0.02, 0.04),
        });
      }
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    let lastLaunch = 0;
    const tailMax = isMobile.current ? 3 : 5;

    const draw = () => {
      frame.current++;
      const now = Date.now();

      // Clear with dark festive background
      ctx.fillStyle = "rgba(7, 2, 1, 0.24)";
      ctx.fillRect(0, 0, W.current, H.current);

      // 1. Ambient Starlight Twinkles
      stars.current.forEach((st) => {
        st.alpha += Math.sin(frame.current * st.pulseSpeed) * 0.012;
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.size, 0, Math.PI * 2);
        ctx.fillStyle = "#ffd54f";
        ctx.globalAlpha = Math.max(0.1, Math.min(st.alpha, 0.85));
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // 2. Corner Anar Fountains
      if (frame.current % 2 === 0) {
        emitFountain(W.current * 0.06, H.current - 8, 1);
        emitFountain(W.current * 0.94, H.current - 8, -1);
      }

      // 3. Sky Rockets Launch
      if (now - lastLaunch > rand(450, 750)) {
        launchRocket();
        lastLaunch = now;
      }

      // 4. Update & Draw Rockets
      rockets.current = rockets.current.filter((r) => {
        r.tail.push({ x: r.x, y: r.y });
        if (r.tail.length > tailMax) r.tail.shift();

        r.x += r.vx;
        r.y += r.vy;

        // Tail
        r.tail.forEach((pt, i) => {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, (i / r.tail.length) * 2, 0, Math.PI * 2);
          ctx.fillStyle = "#ffaa00";
          ctx.globalAlpha = (i / r.tail.length) * 0.75;
          ctx.fill();
        });

        // Head spark
        ctx.beginPath();
        ctx.arc(r.x, r.y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.globalAlpha = 1;
        ctx.fill();

        if (r.y <= r.targetY || r.vy >= 0) {
          explodeRocket(r.x, r.y, r.palette);
          return false;
        }
        return true;
      });

      // 5. Update & Draw Fountains
      fountains.current = fountains.current.filter((p) => {
        p.tail.push({ x: p.x, y: p.y });
        if (p.tail.length > 3) p.tail.shift();

        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.alpha -= p.decay;

        if (p.alpha <= 0 || p.y > H.current + 10) return false;

        p.tail.forEach((pt, i) => {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, p.size * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = (i / p.tail.length) * p.alpha * 0.45;
          ctx.fill();
        });

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();

        return true;
      });

      // 6. Update & Draw Sparks
      sparks.current = sparks.current.filter((p) => {
        p.tail.push({ x: p.x, y: p.y });
        if (p.tail.length > tailMax) p.tail.shift();

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= p.drag;
        p.vy = p.vy * p.drag + p.gravity;
        p.alpha -= p.decay;

        if (p.alpha <= 0) return false;

        p.tail.forEach((pt, i) => {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, p.size * 0.45, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = (i / p.tail.length) * p.alpha * 0.35;
          ctx.fill();
        });

        const tw = p.twinkle ? 0.7 + 0.3 * Math.sin(frame.current * 0.3) : 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha * tw);
        ctx.fill();

        return true;
      });

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      sparks.current = [];
      rockets.current = [];
      fountains.current = [];
    };
  }, [launchRocket, explodeRocket, emitFountain]);

  const triggerClickExplosion = useCallback((x, y) => {
    explodeRocket(x, y);
  }, [explodeRocket]);

  return { triggerClickExplosion };
}

export default function Launch({ onComplete }) {
  const canvasRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  const { triggerClickExplosion } = useSmoothFireworks(canvasRef);

  useEffect(() => {
    const timers = [];
    const t = (fn, ms) => {
      const id = setTimeout(fn, ms);
      timers.push(id);
      return id;
    };

    // Reduced Snappy Show Duration: 2.6s Total
    const TOTAL_MS = 2600;
    const start = Date.now();
    const tick = setInterval(() => {
      const pct = Math.min(((Date.now() - start) / TOTAL_MS) * 100, 100);
      setProgress(pct);
      if (pct >= 100) clearInterval(tick);
    }, 20);
    timers.push(tick);

    // Smooth exit starts at 2.25s
    t(() => setExiting(true), 2250);

    // Complete callback at 2.6s
    t(() => onComplete && onComplete(), 2600);

    return () => timers.forEach((id) => {
      clearTimeout(id);
      clearInterval(id);
    });
  }, [onComplete]);

  const handleSkip = (e) => {
    e.stopPropagation();
    setExiting(true);
    setTimeout(() => onComplete && onComplete(), 200);
  };

  const handleUserInteract = (e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    if (clientX && clientY) triggerClickExplosion(clientX, clientY);
  };

  return (
    <div
      onClick={handleUserInteract}
      onTouchStart={handleUserInteract}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "radial-gradient(ellipse at 50% 48%, #1f0701 0%, #0b0301 55%, #020100 100%)",
        overflow: "hidden",
        transform: exiting ? "scale(1.03) translateY(-14px)" : "scale(1) translateY(0)",
        opacity: exiting ? 0 : 1,
        transition: "transform 0.38s cubic-bezier(0.65, 0, 0.35, 1), opacity 0.38s cubic-bezier(0.65, 0, 0.35, 1)",
        cursor: "crosshair",
        userSelect: "none",
        touchAction: "manipulation",
        WebkitTapHighlightColor: "transparent",
        willChange: "transform, opacity",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@800;900&family=Outfit:wght@600;800;900&display=swap');

        @keyframes smoothFlame {
          0%, 100% {
            transform: scale(1) rotate(-1deg);
            filter: drop-shadow(0 0 10px #ff8800) drop-shadow(0 0 20px #ffcc00);
          }
          33% {
            transform: scale(1.04, 1.1) rotate(1.2deg) translateY(-2px);
            filter: drop-shadow(0 0 16px #ff6600) drop-shadow(0 0 30px #ffee33);
          }
          66% {
            transform: scale(0.97, 1.03) rotate(-1.2deg);
            filter: drop-shadow(0 0 12px #ff7700) drop-shadow(0 0 24px #ffaa00);
          }
        }

        @keyframes sparkPulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.15); opacity: 1; }
        }

        @keyframes festiveTitleGlow {
          0%, 100% {
            filter: drop-shadow(0 0 12px rgba(255, 215, 0, 0.55)) drop-shadow(0 0 25px rgba(255, 100, 0, 0.35));
          }
          50% {
            filter: drop-shadow(0 0 20px rgba(255, 235, 100, 0.8)) drop-shadow(0 0 40px rgba(255, 70, 0, 0.6));
          }
        }

        @keyframes rocketBob {
          0%, 100% { transform: translateY(0) rotate(45deg); }
          50% { transform: translateY(-3px) rotate(48deg); }
        }

        @keyframes smoothFadeIn {
          0% {
            opacity: 0;
            transform: translateY(12px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>

      {/* Silky Smooth Fireworks Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* Top Header Bar with Skip Button */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 18px",
          background: "linear-gradient(180deg, rgba(8, 3, 2, 0.85), transparent)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#ff9900",
              boxShadow: "0 0 10px #ff9900",
              animation: "sparkPulse 1.6s ease-in-out infinite",
            }}
          />
          <span
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "clamp(9px, 2.4vw, 11px)",
              fontWeight: 800,
              color: "#ffd700",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              textShadow: "0 0 8px rgba(255, 215, 0, 0.5)",
            }}
          >
            DEEPA CRACKERS
          </span>
        </div>

        <button
          onClick={handleSkip}
          onTouchStart={handleSkip}
          style={{
            background: "linear-gradient(135deg, rgba(255, 140, 0, 0.3), rgba(255, 40, 0, 0.4))",
            border: "1.2px solid rgba(255, 200, 50, 0.65)",
            color: "#ffffff",
            padding: "5px 14px",
            borderRadius: "24px",
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 800,
            fontSize: "10px",
            letterSpacing: "0.1em",
            cursor: "pointer",
            backdropFilter: "blur(6px)",
            boxShadow: "0 0 14px rgba(255, 120, 0, 0.25)",
            transition: "transform 0.15s",
          }}
        >
          SKIP ➔
        </button>
      </div>

      {/* CENTER CONTENT: Golden Diya Lamp + Company Name */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
          padding: "16px",
          textAlign: "center",
          pointerEvents: "none",
          animation: "smoothFadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
      >
        {/* Clean Golden Diya Lamp */}
        <div
          style={{
            position: "relative",
            width: "100px",
            height: "80px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "8px",
          }}
        >
          {/* Living Flame */}
          <div
            style={{
              position: "absolute",
              top: "-14px",
              width: "30px",
              height: "46px",
              borderRadius: "50% 50% 35% 35% / 60% 60% 40% 40%",
              background: "radial-gradient(ellipse at 50% 65%, #ffffff 0%, #fff176 30%, #ff9100 65%, #d50000 95%)",
              animation: "smoothFlame 1.8s ease-in-out infinite",
              transformOrigin: "bottom center",
              willChange: "transform, filter",
              zIndex: 3,
            }}
          >
            {/* White-Hot Flame Core */}
            <div
              style={{
                position: "absolute",
                bottom: "4px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "11px",
                height: "17px",
                borderRadius: "50%",
                background: "#ffffff",
                boxShadow: "0 0 8px #ffffff, 0 0 14px #ffee55",
              }}
            />
          </div>

          {/* Diya Brass Vessel */}
          <svg
            width="100"
            height="55"
            viewBox="0 0 120 70"
            fill="none"
            style={{
              marginTop: "18px",
              filter: "drop-shadow(0 4px 10px rgba(255, 100, 0, 0.4))",
              zIndex: 2,
            }}
          >
            <defs>
              <linearGradient id="diyaGoldMobile" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff275" />
                <stop offset="25%" stopColor="#ffd700" />
                <stop offset="60%" stopColor="#e65100" />
                <stop offset="100%" stopColor="#7f0000" />
              </linearGradient>
              <linearGradient id="rimGoldMobile" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffd700" />
                <stop offset="50%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#ff9100" />
              </linearGradient>
            </defs>

            <path
              d="M10 24 C18 54, 102 54, 110 24 C100 40, 20 40, 10 24 Z"
              fill="url(#diyaGoldMobile)"
              stroke="#ffd700"
              strokeWidth="1.5"
            />
            <ellipse
              cx="60"
              cy="24"
              rx="50"
              ry="12"
              fill="#5d1000"
              stroke="url(#rimGoldMobile)"
              strokeWidth="2"
            />
            <ellipse
              cx="60"
              cy="25"
              rx="40"
              ry="8"
              fill="radial-gradient(circle, #ffea00 0%, #b71c1c 80%)"
            />
            <path
              d="M44 48 L76 48 L82 56 L38 56 Z"
              fill="url(#diyaGoldMobile)"
              stroke="#ffb300"
              strokeWidth="1"
            />
          </svg>
        </div>

        {/* Heritage Trust Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "4px 14px",
            borderRadius: "20px",
            background: "rgba(255, 140, 0, 0.2)",
            border: "1px solid rgba(255, 215, 0, 0.55)",
            marginBottom: "6px",
          }}
        >
          <span style={{ fontSize: "12px" }}>🪔</span>
          <span
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(9px, 2.2vw, 11px)",
              color: "#ffd700",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            SINCE 1985 · 40 YEARS OF JOY
          </span>
        </div>

        {/* Grand Company Name */}
        <h1
          style={{
            margin: "0 0 4px",
            fontFamily: "'Cinzel', serif",
            fontWeight: 900,
            fontSize: "clamp(28px, 7vw, 56px)",
            lineHeight: 1,
            letterSpacing: "0.04em",
            background: "linear-gradient(135deg, #ffffff 0%, #ffea79 25%, #ff9100 65%, #ffd700 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "festiveTitleGlow 2.5s ease-in-out infinite",
          }}
        >
          DEEPA CRACKERS
        </h1>

        {/* Tamil Subtitle */}
        <div
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(12px, 2.6vw, 16px)",
            color: "rgba(255, 235, 205, 0.92)",
            letterSpacing: "0.1em",
            marginBottom: "10px",
            textShadow: "0 0 10px rgba(255, 120, 0, 0.5)",
          }}
        >
          தீபா பட்டாசு · திருத்துறைப்பூண்டி & சிவகாசி
        </div>

        {/* Badges */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            flexWrap: "wrap",
            maxWidth: "520px",
          }}
        >
          <span
            style={{
              background: "rgba(16, 185, 129, 0.2)",
              border: "1px solid rgba(52, 211, 153, 0.6)",
              color: "#6ee7b7",
              padding: "3px 10px",
              borderRadius: "6px",
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 800,
              fontSize: "9px",
              letterSpacing: "0.04em",
            }}
          >
            ✓ Sivakasi Factory Direct
          </span>
          <span
            style={{
              background: "rgba(245, 158, 11, 0.2)",
              border: "1px solid rgba(251, 191, 36, 0.6)",
              color: "#fef3c7",
              padding: "3px 10px",
              borderRadius: "6px",
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 800,
              fontSize: "9px",
              letterSpacing: "0.04em",
            }}
          >
            ✓ 0% Middlemen Cut
          </span>
          <span
            style={{
              background: "rgba(14, 165, 233, 0.2)",
              border: "1px solid rgba(56, 189, 248, 0.6)",
              color: "#e0f2fe",
              padding: "3px 10px",
              borderRadius: "6px",
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 800,
              fontSize: "9px",
              letterSpacing: "0.04em",
            }}
          >
            ✓ Wholesale Price
          </span>
        </div>
      </div>

      {/* Bottom Progress Bar with Rocket Indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          background: "linear-gradient(0deg, rgba(8, 3, 2, 0.95), transparent)",
          padding: "10px 18px 14px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "10px",
            color: "rgba(255, 200, 140, 0.9)",
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: "6px",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <span>🚀</span>
            <span>Launching Celebration...</span>
          </span>
          <span style={{ color: "#ffd700", fontWeight: 900 }}>{Math.round(progress)}%</span>
        </div>

        {/* Progress Track */}
        <div
          style={{
            position: "relative",
            height: "4px",
            background: "rgba(255, 255, 255, 0.12)",
            borderRadius: "4px",
            overflow: "visible",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "linear-gradient(90deg, #ff1744, #ff9100, #ffd600, #00e676)",
              borderRadius: "4px",
              transition: "width 0.02s linear",
              boxShadow: "0 0 10px #ff9100",
            }}
          />

          {/* Travelling Rocket / Spark Head */}
          <div
            style={{
              position: "absolute",
              left: `calc(${progress}% - 7px)`,
              top: "-6px",
              width: "14px",
              height: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "11px",
              pointerEvents: "none",
              filter: "drop-shadow(0 0 5px #ffea00)",
              animation: "rocketBob 0.8s ease-in-out infinite",
              transition: "left 0.02s linear",
            }}
          >
            ✨
          </div>
        </div>
      </div>
    </div>
  );
}
