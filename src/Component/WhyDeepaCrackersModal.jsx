import { useEffect, useState } from "react";
import { 
  ArrowRight,
  Sparkles,
  X
} from "lucide-react";

const DURATION_MS = 10000; // 10 seconds auto-dismiss

export default function WhyDeepaCrackersModal({ onClose }) {
  const [progress, setProgress] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(10);
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const showT = setTimeout(() => setVisible(true), 30);

    const start = Date.now();
    const tick = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / DURATION_MS) * 100, 100);
      setProgress(pct);
      setSecondsLeft(Math.max(0, Math.ceil((DURATION_MS - elapsed) / 1000)));

      if (pct >= 100) {
        clearInterval(tick);
        setExiting(true);
        setTimeout(() => onClose && onClose(), 450);
      }
    }, 40);

    return () => {
      clearTimeout(showT);
      clearInterval(tick);
    };
  }, [onClose]);

  const handleClose = () => {
    setExiting(true);
    setTimeout(() => onClose && onClose(), 350);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100000,
        background: "rgba(3, 1, 1, 0.88)",
        backdropFilter: "blur(14px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "10px",
        opacity: visible && !exiting ? 1 : 0,
        transform: visible && !exiting ? "scale(1)" : exiting ? "scale(0.95)" : "scale(0.9)",
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@500;700;800;900&family=Cinzel:wght@800;900&display=swap');
        
        @keyframes subtleGlow {
          0%, 100% { box-shadow: 0 20px 80px rgba(255, 85, 0, 0.3), 0 0 0 1.5px rgba(255, 170, 0, 0.3) inset; }
          50% { box-shadow: 0 25px 100px rgba(255, 120, 0, 0.5), 0 0 0 2px rgba(255, 220, 0, 0.6) inset; }
        }
        @keyframes floatItem {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes pulseBadge {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
      `}</style>

      {/* Main Container */}
      <div
        style={{
          width: "100%",
          maxWidth: "920px",
          maxHeight: "94vh",
          background: "linear-gradient(160deg, #1d0902 0%, #0e0401 45%, #050201 100%)",
          borderRadius: "26px",
          border: "2px solid rgba(255, 160, 0, 0.4)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          position: "relative",
          animation: "subtleGlow 4s ease-in-out infinite",
        }}
      >
        {/* Festive Golden Top Ribbon */}
        <div style={{
          height: "4px",
          width: "100%",
          background: "linear-gradient(90deg, #ff0055, #ff6600, #ffd700, #00ff88, #00d4ff, #ff6600)",
        }} />

        {/* Top Header */}
        <div style={{
          padding: "12px 20px",
          borderBottom: "1px solid rgba(255, 120, 0, 0.2)",
          background: "radial-gradient(ellipse at center top, rgba(255, 100, 0, 0.22), transparent 75%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "44px",
              height: "44px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #ff4500, #ffaa00)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
              boxShadow: "0 0 20px rgba(255, 100, 0, 0.6)",
              flexShrink: 0,
            }}>
              🏆
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <h2 style={{
                  margin: 0,
                  fontFamily: "'Cinzel', serif",
                  fontWeight: 900,
                  fontSize: "clamp(17px, 3.6vw, 23px)",
                  letterSpacing: "0.04em",
                  background: "linear-gradient(135deg, #ffffff 0%, #ffe600 45%, #ff7700 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>
                  DEEPA CRACKERS
                </h2>
                <span style={{
                  background: "linear-gradient(90deg, rgba(255,180,0,0.3), rgba(255,70,0,0.3))",
                  border: "1px solid rgba(255, 200, 0, 0.6)",
                  color: "#ffd700",
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 900,
                  fontSize: "11px",
                  padding: "2px 10px",
                  borderRadius: "20px",
                  letterSpacing: "0.06em",
                }}>
                  SINCE 1985 · 40 YRS TRUST
                </span>
              </div>
              <p style={{
                margin: "2px 0 0",
                fontSize: "11px",
                color: "rgba(255, 210, 170, 0.8)",
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 600,
              }}>
                RS Road, Thiruthuraipoondi & Sivakasi Wholesale Hub
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            aria-label="Close"
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 120, 0, 0.35)",
              color: "rgba(255, 200, 150, 0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s",
              flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,80,0,0.35)"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(255,200,150,0.9)"; }}
          >
            <X size={16} />
          </button>
        </div>

        {/* PICTORIAL GRAPHICAL SHOWCASE BODY (Images & Badges, No Sentences) */}
        <div style={{
          padding: "14px 18px",
          overflowY: "auto",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}>

          {/* MAIN PICTORIAL SOURCING & PRICE COMPARISON BANNER */}
          <div style={{
            background: "linear-gradient(135deg, rgba(20, 8, 3, 0.9), rgba(10, 4, 1, 0.95))",
            border: "1.5px solid rgba(255, 150, 0, 0.35)",
            borderRadius: "18px",
            padding: "10px 14px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}>
            {/* Visual Header */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "11px",
              fontWeight: 800,
              color: "#ffc107",
              fontFamily: "'Outfit', sans-serif",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}>
              <span>📊 FACTORY SOURCING & PRICE BLUEPRINT</span>
              <span style={{ color: "#00ff88" }}>✓ 100% TRANSPARENT</span>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "10px",
            }}>
              {/* Image Card 1: 80-90% Trap */}
              <div style={{
                background: "linear-gradient(135deg, rgba(239, 68, 68, 0.18), rgba(60, 10, 10, 0.4))",
                border: "1.5px solid rgba(239, 68, 68, 0.5)",
                borderRadius: "14px",
                padding: "10px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}>
                <div style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #ef4444, #991b1b)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: 900,
                  boxShadow: "0 0 15px rgba(239, 68, 68, 0.4)",
                  flexShrink: 0,
                }}>
                  <span style={{ fontSize: "14px", textDecoration: "line-through", opacity: 0.85 }}>90%</span>
                  <span style={{ fontSize: "18px", lineHeight: 1 }}>❌</span>
                </div>
                <div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: "13px", color: "#fca5a5" }}>
                    Fake 80%, 90% Discounts Trap
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "3px", fontSize: "11px", color: "#f87171", fontWeight: 700 }}>
                    <span>🏭 Factory</span>
                    <span>➔</span>
                    <span>👨‍💼 4 Middlemen</span>
                    <span>➔</span>
                    <span>📈 Inflated Cost</span>
                  </div>
                </div>
              </div>

              {/* Image Card 2: Real Price Direct Model */}
              <div style={{
                background: "linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(10, 50, 30, 0.4))",
                border: "2px solid rgba(16, 185, 129, 0.6)",
                borderRadius: "14px",
                padding: "10px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                boxShadow: "0 0 20px rgba(16, 185, 129, 0.2)",
              }}>
                <div style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #10b981, #047857)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: 900,
                  boxShadow: "0 0 15px rgba(16, 185, 129, 0.5)",
                  flexShrink: 0,
                }}>
                  <span style={{ fontSize: "10px", letterSpacing: "0.05em" }}>REAL</span>
                  <span style={{ fontSize: "20px", lineHeight: 1 }}>✅</span>
                </div>
                <div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: "13px", color: "#6ee7b7" }}>
                    Real Discounted Wholesale Price
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "3px", fontSize: "11px", color: "#34d399", fontWeight: 800 }}>
                    <span>🏭 Sivakasi</span>
                    <span>➔</span>
                    <span style={{ background: "rgba(255,180,0,0.3)", padding: "1px 5px", borderRadius: "4px", color: "#ffd700" }}>DEEPA SHOP</span>
                    <span>➔</span>
                    <span>👨‍👩‍👧 You</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 8 PICTORIAL VISUAL GRAPHIC TILES (Visual Badges, Icons & Stamps) */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "10px",
          }}>

            {/* Tile 1: 40 Yrs Shop */}
            <div style={{
              background: "linear-gradient(135deg, rgba(255, 180, 0, 0.12), rgba(40, 20, 5, 0.5))",
              border: "1.5px solid rgba(255, 180, 0, 0.4)",
              borderRadius: "16px",
              padding: "10px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}>
              <div style={{
                width: "48px", height: "48px", borderRadius: "14px",
                background: "linear-gradient(135deg, #ffd700, #ff8800)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "24px", color: "#fff", flexShrink: 0,
                boxShadow: "0 0 15px rgba(255, 180, 0, 0.4)",
              }}>
                🏛️
              </div>
              <div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: "13px", color: "#ffd700" }}>
                  SINCE 1985
                </div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "11px", color: "#fed7aa" }}>
                  40 YRS TRUSTED SHOP
                </div>
              </div>
            </div>

            {/* Tile 2: Wholesale Cum Retail */}
            <div style={{
              background: "linear-gradient(135deg, rgba(255, 107, 0, 0.12), rgba(40, 15, 5, 0.5))",
              border: "1.5px solid rgba(255, 107, 0, 0.4)",
              borderRadius: "16px",
              padding: "10px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}>
              <div style={{
                width: "48px", height: "48px", borderRadius: "14px",
                background: "linear-gradient(135deg, #ff6b00, #d946ef)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "24px", color: "#fff", flexShrink: 0,
                boxShadow: "0 0 15px rgba(255, 107, 0, 0.4)",
              }}>
                🏬
              </div>
              <div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: "13px", color: "#ff922b" }}>
                  WHOLESALE + RETAIL
                </div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "11px", color: "#fed7aa" }}>
                  Direct Shop & Counter Sales
                </div>
              </div>
            </div>

            {/* Tile 3: No Middleman */}
            <div style={{
              background: "linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(5, 30, 20, 0.5))",
              border: "1.5px solid rgba(16, 185, 129, 0.4)",
              borderRadius: "16px",
              padding: "10px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}>
              <div style={{
                width: "48px", height: "48px", borderRadius: "14px",
                background: "linear-gradient(135deg, #10b981, #06b6d4)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "24px", color: "#fff", flexShrink: 0,
                boxShadow: "0 0 15px rgba(16, 185, 129, 0.4)",
              }}>
                🚫
              </div>
              <div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: "13px", color: "#34d399" }}>
                  NO MIDDLEMAN
                </div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "11px", color: "#a7f3d0" }}>
                  0% Agent Commission
                </div>
              </div>
            </div>

            {/* Tile 4: GSTN Verified Badge */}
            <div style={{
              background: "linear-gradient(135deg, rgba(6, 182, 212, 0.12), rgba(5, 25, 35, 0.5))",
              border: "1.5px solid rgba(6, 182, 212, 0.4)",
              borderRadius: "16px",
              padding: "10px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}>
              <div style={{
                width: "48px", height: "48px", borderRadius: "14px",
                background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "24px", color: "#fff", flexShrink: 0,
                boxShadow: "0 0 15px rgba(6, 182, 212, 0.4)",
              }}>
                🪪
              </div>
              <div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: "12px", color: "#22d3ee" }}>
                  GSTN VERIFIED
                </div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "11px", color: "#bae6fd" }}>
                  33AAGPM1717Q1ZH
                </div>
              </div>
            </div>

            {/* Tile 5: Mobile Friendly View / Checkout */}
            <div style={{
              background: "linear-gradient(135deg, rgba(168, 85, 247, 0.12), rgba(25, 10, 40, 0.5))",
              border: "1.5px solid rgba(168, 85, 247, 0.4)",
              borderRadius: "16px",
              padding: "10px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}>
              <div style={{
                width: "48px", height: "48px", borderRadius: "14px",
                background: "linear-gradient(135deg, #a855f7, #ec4899)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "24px", color: "#fff", flexShrink: 0,
                boxShadow: "0 0 15px rgba(168, 85, 247, 0.4)",
              }}>
                📱
              </div>
              <div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: "12px", color: "#c084fc" }}>
                  MOBILE FRIENDLY
                </div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "11px", color: "#f5d0fe" }}>
                  1-Tap View / PDF Bill
                </div>
              </div>
            </div>

            {/* Tile 6: Guaranteed Delivery Date */}
            <div style={{
              background: "linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(40, 25, 5, 0.5))",
              border: "1.5px solid rgba(245, 158, 11, 0.4)",
              borderRadius: "16px",
              padding: "10px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}>
              <div style={{
                width: "48px", height: "48px", borderRadius: "14px",
                background: "linear-gradient(135deg, #f59e0b, #ef4444)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "24px", color: "#fff", flexShrink: 0,
                boxShadow: "0 0 15px rgba(245, 158, 11, 0.4)",
              }}>
                🚚
              </div>
              <div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: "12px", color: "#fbbf24" }}>
                  DELIVERY DATE
                </div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "11px", color: "#fef08a" }}>
                  Proper Commitment
                </div>
              </div>
            </div>

            {/* Tile 7: Guest Checkout (No Forced Signup) */}
            <div style={{
              background: "linear-gradient(135deg, rgba(236, 72, 153, 0.12), rgba(40, 10, 25, 0.5))",
              border: "1.5px solid rgba(236, 72, 153, 0.4)",
              borderRadius: "16px",
              padding: "10px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}>
              <div style={{
                width: "48px", height: "48px", borderRadius: "14px",
                background: "linear-gradient(135deg, #ec4899, #f43f5e)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "24px", color: "#fff", flexShrink: 0,
                boxShadow: "0 0 15px rgba(236, 72, 153, 0.4)",
              }}>
                🛒
              </div>
              <div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: "12px", color: "#f472b6" }}>
                  GUEST CHECKOUT
                </div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "11px", color: "#fbcfe8" }}>
                  No Forced Signup
                </div>
              </div>
            </div>

            {/* Tile 8: Trustworthy Website */}
            <div style={{
              background: "linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(5, 30, 20, 0.5))",
              border: "1.5px solid rgba(16, 185, 129, 0.4)",
              borderRadius: "16px",
              padding: "10px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}>
              <div style={{
                width: "48px", height: "48px", borderRadius: "14px",
                background: "linear-gradient(135deg, #10b981, #22c55e)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "24px", color: "#fff", flexShrink: 0,
                boxShadow: "0 0 15px rgba(16, 185, 129, 0.4)",
              }}>
                🔒
              </div>
              <div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: "12px", color: "#34d399" }}>
                  TRUSTWORTHY SITE
                </div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "11px", color: "#a7f3d0" }}>
                  Not a Fake Website
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Footer with 10-Second Progress Timer & Instant CTA */}
        <div style={{
          padding: "12px 20px",
          borderTop: "1px solid rgba(255, 120, 0, 0.2)",
          background: "linear-gradient(180deg, rgba(20, 8, 3, 0.8), rgba(8, 2, 1, 0.98))",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          flexShrink: 0,
        }}>
          {/* 10-Second Progress Line */}
          <div style={{
            height: "4px",
            width: "100%",
            background: "rgba(255, 255, 255, 0.08)",
            borderRadius: "4px",
            overflow: "hidden",
          }}>
            <div style={{
              height: "100%",
              width: `${progress}%`,
              background: "linear-gradient(90deg, #ff4500, #ffaa00, #00ff88)",
              transition: "width 0.04s linear",
              boxShadow: "0 0 10px #ff5500",
            }} />
          </div>

          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            flexWrap: "wrap",
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontFamily: "'Outfit', sans-serif",
              fontSize: "12px",
              color: "rgba(255, 180, 100, 0.9)",
              fontWeight: 700,
            }}>
              <Sparkles size={15} color="#ffd700" />
              <span>Opening Deepa Crackers catalog in <strong style={{ color: "#00ff88", fontSize: "14px" }}>{secondsLeft}s</strong></span>
            </div>

            <button
              onClick={handleClose}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "linear-gradient(135deg, #ff4500, #ff8800)",
                border: "1.5px solid rgba(255, 220, 100, 0.6)",
                color: "#ffffff",
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 900,
                fontSize: "12px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "8px 22px",
                borderRadius: "30px",
                cursor: "pointer",
                boxShadow: "0 4px 20px rgba(255, 85, 0, 0.45)",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
            >
              <span>Explore Products Now</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

