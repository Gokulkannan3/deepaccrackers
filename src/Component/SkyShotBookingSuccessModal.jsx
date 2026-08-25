import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Download, Sparkles, X, FileText, Check, ArrowRight, PartyPopper } from "lucide-react";
import { API_BASE_URL } from "../../Config";

const rand = (a, b) => Math.random() * (b - a) + a;
const randInt = (a, b) => Math.floor(rand(a, b));

const BURST_COLORS = [
  { r: 255, g: 215, b: 0, hex: "#ffd700" },   // Gold
  { r: 255, g: 255, b: 255, hex: "#ffffff" }, // Diamond White
  { r: 255, g: 0, b: 85, hex: "#ff0055" },    // Crimson Red
  { r: 16, g: 185, b: 129, hex: "#10b981" },  // Emerald
  { r: 0, g: 240, b: 255, hex: "#00f0ff" },   // Cyan
  { r: 255, g: 153, b: 0, hex: "#ff9900" },   // Flame Orange
  { r: 236, g: 72, b: 153, hex: "#ec4899" },  // Pink
];

export default function SkyShotBookingSuccessModal({
  isOpen,
  onClose,
  orderId,
  customerName,
  totalAmount,
}) {
  const canvasRef = useRef(null);
  const [showCard, setShowCard] = useState(false);
  const [downloadingAgain, setDownloadingAgain] = useState(false);
  const [copied, setCopied] = useState(false);

  // Trigger Sky Shot Canvas Animation when opened
  useEffect(() => {
    if (!isOpen) {
      setShowCard(false);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId = null;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let rockets = [];
    let particles = [];
    let sparklers = [];
    let flashes = [];

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize, { passive: true });

    // Target center coordinates for the Sky Shot explosion
    const targetX = width / 2;
    const targetY = height * 0.42;

    // Launch the big Sky Shot Rocket from bottom center
    rockets.push({
      x: width / 2,
      y: height + 10,
      vx: 0,
      vy: (targetY - (height + 10)) / 38,
      life: 38,
      trail: [],
    });

    const triggerSkyShotBurst = (bx, by) => {
      // 1. Center Radiant Flash
      flashes.push({
        x: bx,
        y: by,
        radius: 30,
        maxRadius: 180,
        alpha: 1,
        decay: 0.04,
      });

      // 2. Primary Sky Shot Star Burst (90 particles)
      const count = 90;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + rand(-0.06, 0.06);
        const speed = rand(3.5, 11);
        const col = BURST_COLORS[randInt(0, BURST_COLORS.length)];
        particles.push({
          x: bx,
          y: by,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: col,
          alpha: 1,
          size: rand(2.4, 4.5),
          decay: rand(0.012, 0.022),
          gravity: 0.05,
          drag: 0.98,
          trail: [],
          twinkleSpeed: rand(0.15, 0.35),
          twinklePhase: rand(0, Math.PI * 2),
        });
      }

      // 3. Dense Golden Sparkler Rain (120 sparklers)
      for (let i = 0; i < 120; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = rand(0.5, 6.5);
        const col = Math.random() > 0.3 ? BURST_COLORS[0] : BURST_COLORS[1];
        sparklers.push({
          x: bx + rand(-4, 4),
          y: by + rand(-4, 4),
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - rand(0.2, 1.8),
          color: col,
          alpha: 1,
          size: rand(1.2, 2.8),
          decay: rand(0.008, 0.018),
          gravity: rand(0.02, 0.05),
          drag: 0.985,
          twinkleSpeed: rand(0.2, 0.4),
          twinklePhase: rand(0, Math.PI * 2),
        });
      }

      // Reveal confirmation card right at the peak of burst
      setTimeout(() => setShowCard(true), 250);
    };

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      // 1. Draw Flash
      flashes = flashes.filter((f) => {
        f.radius += (f.maxRadius - f.radius) * 0.15;
        f.alpha -= f.decay;
        if (f.alpha <= 0) return false;

        const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.radius);
        grad.addColorStop(0, `rgba(255, 255, 255, ${f.alpha * 0.95})`);
        grad.addColorStop(0.4, `rgba(255, 215, 0, ${f.alpha * 0.7})`);
        grad.addColorStop(1, `rgba(255, 0, 85, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
        ctx.fill();
        return true;
      });

      // 2. Draw Rocket Ascent
      rockets = rockets.filter((r) => {
        r.trail.push({ x: r.x, y: r.y });
        if (r.trail.length > 10) r.trail.shift();
        r.x += r.vx;
        r.y += r.vy;
        r.life--;

        // Tail Sparks
        for (let i = 0; i < r.trail.length; i++) {
          const pt = r.trail[i];
          const a = (i / r.trail.length) * 0.8;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, (i / r.trail.length) * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 215, 0, ${a})`;
          ctx.fill();
        }

        // Head
        ctx.beginPath();
        ctx.arc(r.x, r.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();

        if (r.life <= 0) {
          triggerSkyShotBurst(r.x, r.y);
          return false;
        }
        return true;
      });

      // 3. Draw Stars
      particles = particles.filter((p) => {
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 4) p.trail.shift();
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= p.drag;
        p.alpha -= p.decay;

        if (p.alpha <= 0) return false;

        const tm = 0.5 + 0.5 * Math.sin(frame * p.twinkleSpeed + p.twinklePhase);
        const effAlpha = Math.max(0, p.alpha * tm);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${effAlpha})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${effAlpha * 0.9})`;
        ctx.fill();

        return true;
      });

      // 4. Draw Floating Sparkler Shower
      sparklers = sparklers.filter((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.vy += s.gravity;
        s.vx *= s.drag;
        s.alpha -= s.decay;

        if (s.alpha <= 0) return false;

        const twinkle = 0.4 + 0.6 * Math.sin(frame * s.twinkleSpeed + s.twinklePhase);
        const effAlpha = Math.max(0, s.alpha * twinkle);

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.color.r}, ${s.color.g}, ${s.color.b}, ${effAlpha})`;
        ctx.fill();

        return true;
      });

      ctx.globalCompositeOperation = "source-over";
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen]);

  const handleDownloadAgain = async () => {
    if (!orderId) return;
    setDownloadingAgain(true);
    try {
      const pdfRes = await fetch(`${API_BASE_URL}/api/direct/invoice/${orderId}`);
      if (pdfRes.ok) {
        const blob = await pdfRes.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Deepa_Crackers_Invoice_${orderId}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        alert("Invoice file is generating. Please try again in a few seconds.");
      }
    } catch (err) {
      console.error("Download invoice error:", err);
      alert("Error downloading invoice. Please try again.");
    } finally {
      setDownloadingAgain(false);
    }
  };

  const handleCopyOrderId = () => {
    if (!orderId) return;
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100000] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-hidden">
      {/* 60FPS Fullscreen Sky Shot Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* Celebratory Confirmation Card Blooming from Center Burst */}
      <AnimatePresence>
        {showCard && (
          <motion.div
            initial={{ scale: 0.4, opacity: 0, y: 30 }}
            animate={{
              scale: 1,
              opacity: 1,
              y: 0,
              transition: { type: "spring", stiffness: 220, damping: 18 },
            }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            className="relative z-20 w-full max-w-md bg-[#0a0a0a] border-2 border-amber-400/80 rounded-3xl p-5 sm:p-7 text-center text-white shadow-[0_0_80px_rgba(245,158,11,0.35)] overflow-hidden"
          >
            {/* Top decorative gold-crimson gradient line */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-red-600 via-amber-400 via-emerald-400 to-rose-600" />

            {/* Close cross button */}
            <button
              onClick={onClose}
              className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white flex items-center justify-center hover:bg-neutral-800 transition"
            >
              <X size={16} />
            </button>

            {/* Glowing Festival Celebration Badge */}
            <div className="relative mx-auto mb-4 w-18 h-18 sm:w-20 sm:h-20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500 via-red-500 to-emerald-400 animate-spin blur-[8px] opacity-75" style={{ animationDuration: "8s" }} />
              <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-neutral-950 border-2 border-amber-400 flex items-center justify-center shadow-inner">
                <PartyPopper className="w-8 h-8 sm:w-9 sm:h-9 text-amber-400 animate-bounce" />
              </div>
            </div>

            {/* Sky Shot Success Headings */}
            <div className="space-y-1 mb-4">
              <span className="inline-block px-3 py-0.5 rounded-full bg-emerald-950 border border-emerald-500 text-[10px] font-black text-emerald-300 uppercase tracking-wider mb-1">
                ✨ SKY SHOT CELEBRATION
              </span>
              <h2 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-amber-300 via-white to-amber-200 bg-clip-text text-transparent tracking-tight">
                BOOKED SUCCESSFULLY!
              </h2>
              <p className="text-xs sm:text-sm font-bold text-amber-400">
                Check downloads to see the bill 📄
              </p>
            </div>

            {/* Tamil Confirmation Text Box */}
            <div className="p-3 rounded-2xl bg-neutral-900/90 border border-neutral-800 text-left space-y-1 mb-4 shadow-inner">
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-black">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>ஆர்டர் வெற்றிகரமாக பதிவு செய்யப்பட்டது!</span>
              </div>
              <p className="text-[11px] text-neutral-300 leading-relaxed pl-5">
                உங்கள் ஆர்டர் விவரங்கள் மற்றும் பில் PDF தானாக பதிவிறக்கம் செய்யப்பட்டுள்ளது (Check your Downloads folder).
              </p>
            </div>

            {/* Order Details & PDF Download Pill */}
            <div className="p-3 rounded-2xl bg-neutral-950 border border-amber-500/30 flex items-center justify-between gap-2 mb-5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-red-950 border border-red-600/60 flex items-center justify-center text-red-400 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="text-left min-w-0">
                  <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Order ID / Bill</p>
                  <p className="text-xs font-mono font-black text-white truncate">{orderId || "DC-CONFIRMED"}</p>
                </div>
              </div>

              <button
                onClick={handleCopyOrderId}
                className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-white/15 text-[10px] font-bold text-neutral-300 flex items-center gap-1 shrink-0 transition"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : null}
                <span>{copied ? "Copied" : "Copy ID"}</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={handleDownloadAgain}
                disabled={downloadingAgain}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 via-amber-500 to-red-600 hover:from-red-500 hover:to-amber-400 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{downloadingAgain ? "Downloading Bill..." : "Download Bill Again (PDF)"}</span>
              </button>

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
