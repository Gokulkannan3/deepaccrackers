import { useEffect, useRef, useState, useCallback } from "react";

const rand = (a, b) => Math.random() * (b - a) + a;
const randInt = (a, b) => Math.floor(rand(a, b));

const GENTLE_CHAKKAR_PALETTES = [
  ["#ffd700", "#ffaa00", "#ff6600", "#ffffff"],
  ["#ffe066", "#ffa726", "#ff7043", "#ffffff"],
  ["#ffd54f", "#ffca28", "#ff9800", "#ffffff"],
  ["#00e5ff", "#76ff03", "#ffd700", "#ffffff"],
];

function useSlowChakkarCanvas(canvasRef) {
  const animRef = useRef(null);
  const sparks = useRef([]);
  const frame = useRef(0);
  const angle = useRef(0);
  const spinSpeed = useRef(0.035);
  const startTime = useRef(Date.now());
  const W = useRef(0), H = useRef(0);

  const emitDynamicSparks = useCallback((cx, cy, currentAngle, distanceScale) => {
    const pal = GENTLE_CHAKKAR_PALETTES[randInt(0, GENTLE_CHAKKAR_PALETTES.length)];
    const arms = 4; // 4-nozzle star wheel
    const radius = 48;

    // As distanceScale increases from 0.2 (short) to 1.0 (long), velocity and particle count grow
    const minVel = 1.5 + 4.5 * distanceScale;
    const maxVel = 4.0 + 15.0 * distanceScale;
    const sparkCount = Math.round(3 + 8 * distanceScale);

    for (let a = 0; a < arms; a++) {
      const armAngle = currentAngle + (a * (Math.PI * 2)) / arms;
      const nozzleX = cx + Math.cos(armAngle) * radius;
      const nozzleY = cy + Math.sin(armAngle) * radius;

      // Tangential velocity with growing outward radial push
      const tangentAngle = armAngle + Math.PI / 2 + rand(-0.3, 0.3);

      for (let i = 0; i < sparkCount; i++) {
        const vel = rand(minVel, maxVel);
        sparks.current.push({
          x: nozzleX,
          y: nozzleY,
          vx: Math.cos(tangentAngle) * vel + rand(-0.9, 0.9),
          vy: Math.sin(tangentAngle) * vel + rand(-0.9, 0.9),
          color: pal[randInt(0, pal.length)],
          alpha: 1,
          size: rand(2.2, 3.5 + 1.8 * distanceScale),
          decay: rand(0.012, 0.024) / (0.8 + 0.5 * distanceScale), // Longer life for long-distance sparks
          gravity: 0.035,
          twinkle: Math.random() > 0.3,
          tail: [],
        });
      }
    }
  }, []);

  useEffect(() => {
    startTime.current = Date.now();
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

    const draw = () => {
      frame.current++;
      ctx.fillStyle = "rgba(7, 2, 1, 0.22)";
      ctx.fillRect(0, 0, W.current, H.current);

      // Strictly fixed in the exact dead center of the screen
      const cx = W.current / 2;
      const cy = H.current / 2;

      // Dynamic distance scaling from short (0.15) to long (1.0) over 4.2 seconds
      const elapsed = Date.now() - startTime.current;
      const distanceScale = Math.min(Math.max((elapsed - 300) / 3800, 0.15), 1.0);

      // Rotate wheel
      angle.current += spinSpeed.current;
      emitDynamicSparks(cx, cy, angle.current, distanceScale);

      // Draw and update sparks
      sparks.current = sparks.current.filter((p) => {
        p.tail.push({ x: p.x, y: p.y });
        if (p.tail.length > 5) p.tail.shift();

        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.988;
        p.alpha -= p.decay;

        if (p.alpha <= 0) return false;

        // Spark trail
        p.tail.forEach((pt, i) => {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, p.size * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = (i / p.tail.length) * p.alpha * 0.4;
          ctx.fill();
        });

        // Spark head with soft twinkling glow
        const tw = p.twinkle ? 0.6 + 0.4 * Math.sin(frame.current * 0.25) : 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * tw;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 12;
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
      window.removeEventListener("resize", resize);
      sparks.current = [];
    };
  }, [emitDynamicSparks]);
}

export default function Launch({ onComplete }) {
  const canvasRef = useRef(null);
  const [showBrand, setShowBrand] = useState(false);
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  useSlowChakkarCanvas(canvasRef);

  useEffect(() => {
    const timers = [];
    const t = (fn, ms) => {
      const id = setTimeout(fn, ms);
      timers.push(id);
      return id;
    };

    // Brand begins fading in smoothly right while spinning and sparkling (at 0.6s)
    t(() => setShowBrand(true), 600);

    // 5-Second Total Launcher Progress
    const TOTAL_MS = 5000;
    const start = Date.now();
    const tick = setInterval(() => {
      const pct = Math.min(((Date.now() - start) / TOTAL_MS) * 100, 100);
      setProgress(pct);
      if (pct >= 100) clearInterval(tick);
    }, 35);
    timers.push(tick);

    // Exit transition at 4.5s
    t(() => setExiting(true), 4500);

    // Complete at 5.0s
    t(() => onComplete && onComplete(), 5000);

    return () => timers.forEach((id) => {
      clearTimeout(id);
      clearInterval(id);
    });
  }, [onComplete]);

  const handleSkip = () => {
    setExiting(true);
    setTimeout(() => onComplete && onComplete(), 300);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "radial-gradient(circle at 50% 46%, #250901 0%, #0d0401 50%, #020100 100%)",
        overflow: "hidden",
        transform: exiting ? "translateY(-100%) scale(0.96)" : "translateY(0) scale(1)",
        opacity: exiting ? 0 : 1,
        transition: "all 0.5s cubic-bezier(0.7, 0, 0.2, 1)",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@800;900&family=Outfit:wght@600;800;900&display=swap');

        @keyframes slowChakkarSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes gentleAuraPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
          50% { transform: translate(-50%, -50%) scale(1.35); opacity: 0.85; }
        }

        @keyframes titleGlow {
          0%, 100% { filter: drop-shadow(0 0 16px rgba(255, 200, 0, 0.6)) drop-shadow(0 0 35px rgba(255, 100, 0, 0.4)); }
          50% { filter: drop-shadow(0 0 28px rgba(255, 220, 0, 0.9)) drop-shadow(0 0 55px rgba(255, 70, 0, 0.7)); }
        }

        @keyframes smoothFadeIn {
          0% {
            opacity: 0;
            transform: translateY(18px) scale(0.95);
            filter: blur(8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
        }
      `}</style>

      {/* Gentle Sparkle Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* Top Bar */}
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
          padding: "14px 22px",
          background: "linear-gradient(180deg, rgba(10, 4, 1, 0.85), transparent)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#ff9900",
              boxShadow: "0 0 12px #ff9900",
            }}
          />
          <span
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "12px",
              fontWeight: 900,
              color: "#ffd700",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            DEEPA CRACKERS · SPARKLING GROUND WHEEL
          </span>
        </div>

        <button
          onClick={handleSkip}
          style={{
            background: "rgba(255, 140, 0, 0.2)",
            border: "1.5px solid rgba(255, 180, 0, 0.5)",
            color: "#ffffff",
            padding: "5px 16px",
            borderRadius: "20px",
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 800,
            fontSize: "11px",
            letterSpacing: "0.1em",
            cursor: "pointer",
            backdropFilter: "blur(6px)",
            boxShadow: "0 0 15px rgba(255,100,0,0.3)",
            transition: "all 0.2s",
          }}
        >
          SKIP ➔
        </button>
      </div>

      {/* CENTER SLOW-SPINNING CHAKKAR WHEEL (Fixed Exactly at 50% / 50%) */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "100px",
          height: "100px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 4,
          pointerEvents: "none",
        }}
      >
        {/* Soft Golden Fire Aura */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: "240px",
            height: "240px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255, 150, 0, 0.45) 0%, rgba(255, 80, 0, 0.2) 50%, transparent 75%)",
            animation: "gentleAuraPulse 2.8s ease-in-out infinite",
          }}
        />

        {/* 3D Diwali Chakkar Physical Graphic - Elegant Centered Slow Rotation */}
        <div
          style={{
            width: "96px",
            height: "96px",
            borderRadius: "50%",
            background: "radial-gradient(circle, #ffd700 0%, #ff6600 45%, #a61c00 85%, #3d0700 100%)",
            border: "3px solid #ffe600",
            boxShadow: "0 0 35px #ff7700, 0 0 70px rgba(255,120,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            transformOrigin: "center center",
            animation: "slowChakkarSpin 2.8s linear infinite",
          }}
        >
          {/* Wheel Spokes */}
          <div style={{ position: "absolute", width: "100%", height: "2.5px", background: "#ffe600", opacity: 0.9 }} />
          <div style={{ position: "absolute", width: "2.5px", height: "100%", background: "#ffe600", opacity: 0.9 }} />
          <div style={{ position: "absolute", width: "100%", height: "2.5px", background: "#ffe600", transform: "rotate(45deg)", opacity: 0.9 }} />
          <div style={{ position: "absolute", width: "2.5px", height: "100%", background: "#ffe600", transform: "rotate(-45deg)", opacity: 0.9 }} />

          {/* Glowing Center Core */}
          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              background: "radial-gradient(circle, #ffffff 0%, #ffea00 55%, #ff3300 100%)",
              boxShadow: "0 0 20px #ffffff, 0 0 35px #ffaa00",
              zIndex: 2,
            }}
          />
        </div>
      </div>

      {/* COMPANY NAME FADE-IN DISPLAY (Fades in smoothly over the slow sparkles) */}
      {showBrand && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            textAlign: "center",
            pointerEvents: "none",
            animation: "smoothFadeIn 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
          }}
        >
          {/* Heritage Trust Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "5px 18px",
              borderRadius: "24px",
              background: "linear-gradient(90deg, rgba(255,180,0,0.35), rgba(255,70,0,0.35))",
              border: "1.5px solid rgba(255, 200, 0, 0.75)",
              boxShadow: "0 0 25px rgba(255,150,0,0.5)",
              marginBottom: "12px",
              backdropFilter: "blur(8px)",
            }}
          >
            <span style={{ fontSize: "15px" }}>🪔</span>
            <span
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 900,
                fontSize: "clamp(11px, 2.4vw, 13px)",
                color: "#ffd700",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              SINCE 1985 · 40 YRS CELEBRATION
            </span>
          </div>

          {/* Grand Brand Name with Golden Shimmer */}
          <h1
            style={{
              margin: "0 0 6px",
              fontFamily: "'Cinzel', serif",
              fontWeight: 900,
              fontSize: "clamp(42px, 9.5vw, 84px)",
              lineHeight: 0.95,
              letterSpacing: "0.04em",
              background: "linear-gradient(135deg, #ffffff 0%, #ffea79 30%, #ff7700 70%, #ffd000 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "titleGlow 2.5s ease-in-out infinite",
            }}
          >
            DEEPA CRACKERS
          </h1>

          <div
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(14px, 3.2vw, 20px)",
              color: "rgba(255, 220, 180, 0.95)",
              letterSpacing: "0.12em",
              marginBottom: "14px",
              textShadow: "0 0 15px rgba(255,100,0,0.6)",
            }}
          >
            தீபா பட்டாசு · திருத்துறைப்பூண்டி & சிவகாசி
          </div>

          {/* Sourcing Badges */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                background: "rgba(16, 185, 129, 0.3)",
                border: "1px solid rgba(16, 185, 129, 0.7)",
                color: "#6ee7b7",
                padding: "5px 14px",
                borderRadius: "8px",
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 800,
                fontSize: "11px",
                backdropFilter: "blur(6px)",
              }}
            >
              ✓ Direct Sivakasi Factory
            </span>
            <span
              style={{
                background: "rgba(255, 140, 0, 0.3)",
                border: "1px solid rgba(255, 140, 0, 0.7)",
                color: "#fed7aa",
                padding: "5px 14px",
                borderRadius: "8px",
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 800,
                fontSize: "11px",
                backdropFilter: "blur(6px)",
              }}
            >
              ✓ 0% Middlemen Cut
            </span>
            <span
              style={{
                background: "rgba(56, 189, 248, 0.3)",
                border: "1px solid rgba(56, 189, 248, 0.7)",
                color: "#bae6fd",
                padding: "5px 14px",
                borderRadius: "8px",
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 800,
                fontSize: "11px",
                backdropFilter: "blur(6px)",
              }}
            >
              ✓ Genuine Wholesale Price
            </span>
          </div>
        </div>
      )}

      {/* Bottom 5-Second Progress Bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          background: "linear-gradient(0deg, rgba(6, 2, 1, 0.95), transparent)",
          padding: "10px 22px 12px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "10px",
            color: "rgba(255, 180, 120, 0.8)",
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: "6px",
          }}
        >
          <span>Spinning Deepa Chakkar Celebration</span>
          <span>{Math.round(progress)}%</span>
        </div>

        <div
          style={{
            height: "4px",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "4px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "linear-gradient(90deg, #ff1744, #ff9100, #ffd600, #00ff88)",
              transition: "width 0.035s linear",
              boxShadow: "0 0 15px #ff9100",
            }}
          />
        </div>
      </div>
    </div>
  );
}


