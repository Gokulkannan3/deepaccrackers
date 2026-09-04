import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star, Zap, ArrowRight } from "lucide-react";
import PageShell from "./PageShell";

/* ── Shared hero badge row ── */
function Badges({ items }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {items.map((b, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 + 0.2, type: "spring", stiffness: 200 }}
          className="px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] rounded-full cursor-default"
          style={{
            background: `${b.bg}1a`,
            border: `1px solid ${b.bg}55`,
            color: b.text,
            boxShadow: `0 0 18px ${b.bg}18`,
          }}
        >
          {b.label}
        </motion.span>
      ))}
    </div>
  );
}

/* ── Animated dot divider ── */
function DotDivider() {
  return (
    <div className="flex items-center justify-center gap-4">
      <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-500 opacity-60" />
      <div className="flex gap-1.5">
        {["#ef4444", "#f59e0b", "#10b981", "#06b6d4", "#d946ef"].map((c, i) => (
          <div key={i} className="w-2 h-2 rounded-full"
            style={{
              background: c, boxShadow: `0 0 8px ${c}`,
              animation: `glowPulse ${1.2 + i * 0.2}s ${i * 0.1}s ease-in-out infinite alternate`,
            }} />
        ))}
      </div>
      <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-500 opacity-60" />
    </div>
  );
}

/* ── Animated counter ── */
function Counter({ to, suffix = "", duration = 2 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / (duration * 1000), 1);
      setVal(Math.floor(progress * to));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, to, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ── Stat card ── */
function StatCard({ value, suffix, label, color, icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6, scale: 1.03 }}
      className="relative rounded-2xl overflow-hidden group cursor-default"
      style={{
        background: "linear-gradient(135deg, #0a0a0a, #111, #0a0a0a)",
        border: `1.5px solid ${color}44`,
        boxShadow: `0 0 0 1px ${color}15, 0 6px 28px ${color}18`,
      }}
    >
      <div className="h-1 w-full" style={{ background: color, boxShadow: `0 0 12px ${color}` }} />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at center, ${color}12 0%, transparent 70%)` }}
      />
      <div className="relative z-10 p-5 text-center space-y-1">
        <div className="text-3xl mb-2">{icon}</div>
        <div className="text-3xl font-black" style={{ color }}>
          <Counter to={value} suffix={suffix} />
        </div>
        <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">{label}</p>
      </div>
    </motion.div>
  );
}

/* ── Value card (Motto / Vision / Mission) ── */
function ValueCard({ card, i }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: i * 0.1, type: "spring", stiffness: 120 }}
      viewport={{ once: true }}
      whileHover={{ y: -10, scale: 1.03 }}
      className="group relative rounded-3xl overflow-hidden cursor-pointer"
      style={{
        background: "linear-gradient(135deg, #080808 0%, #111 50%, #080808 100%)",
        border: `1.5px solid ${card.glow}55`,
        boxShadow: `0 0 0 1px ${card.glow}12, 0 8px 32px ${card.glow}18, inset 0 1px 0 ${card.accent}15`,
      }}
    >
      {/* Top bar */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${card.gradient}`} style={{ boxShadow: `0 0 16px ${card.glow}` }} />

      {/* Number stamp */}
      <div className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center text-xs font-black"
        style={{ background: `${card.glow}20`, border: `1px solid ${card.glow}44`, color: card.accent, fontFamily: "monospace" }}>
        {card.num}
      </div>

      {/* Diagonal pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `repeating-linear-gradient(45deg, ${card.glow} 0, ${card.glow} 1px, transparent 0, transparent 50%)`, backgroundSize: "12px 12px" }} />

      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at center, ${card.glow}14 0%, transparent 70%)` }} />

      <div className="relative z-10 p-6">
        {/* Icon */}
        <div className="flex items-center gap-3 mb-4">
          <span className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
            style={{ background: `linear-gradient(135deg, ${card.glow}30, ${card.glow}10)`, border: `1.5px solid ${card.glow}55`, boxShadow: `0 0 22px ${card.glow}44` }}>
            {card.icon}
          </span>
          <h3 className="text-base font-black uppercase tracking-wide" style={{ color: card.accent }}>{card.title}</h3>
        </div>

        <div className="h-px mb-4" style={{ background: `linear-gradient(to right, ${card.glow}55, transparent)` }} />
        <p className="text-[12px] text-neutral-400 leading-relaxed">{card.content}</p>

        {/* Sweep underline on hover */}
        <div className="mt-5 h-px w-0 group-hover:w-full transition-all duration-500"
          style={{ background: `linear-gradient(to right, ${card.glow}, transparent)` }} />
      </div>
    </motion.div>
  );
}

/* ── Blast particles for CTA section ── */
function BlastParticles() {
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    const iv = setInterval(() => {
      setParticles(prev => [
        ...prev.slice(-20),
        ...Array.from({ length: 5 }, () => ({
          id: Date.now() + Math.random(),
          top: Math.random() * 80 + 10,
          left: Math.random() * 90,
          color: ["#ef4444", "#f59e0b", "#10b981", "#06b6d4", "#d946ef", "#fff"][Math.floor(Math.random() * 6)],
        })),
      ]);
    }, 700);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map(p => (
        <div key={p.id}
          className="absolute w-3 h-3 rounded-full"
          style={{
            top: `${p.top}%`, left: `${p.left}%`,
            background: p.color, boxShadow: `0 0 10px ${p.color}`,
            animation: "blast 1.4s ease-out forwards",
          }} />
      ))}
    </div>
  );
}

/* ── Pictographic cracker SVG row ── */
function PictographRow() {
  const icons = [
    { emoji: "🪔", label: "Diya", color: "#f59e0b" },
    { emoji: "🎇", label: "Sparkler", color: "#ffffff" },
    { emoji: "🎆", label: "Firework", color: "#06b6d4" },
    { emoji: "🚀", label: "Rocket", color: "#ef4444" },
    { emoji: "🌟", label: "Star", color: "#fbbf24" },
  ];
  return (
    <div className="flex items-end justify-center gap-6 sm:gap-10 py-4">
      {icons.map((ic, i) => (
        <div key={i} className="flex flex-col items-center gap-1.5 group cursor-default">
          <div className="text-3xl sm:text-4xl transition-transform group-hover:scale-125 group-hover:-translate-y-2 duration-300"
            style={{ animation: `floatUp ${2 + i * 0.4}s ${i * 0.2}s ease-in-out infinite`, filter: `drop-shadow(0 0 8px ${ic.color}88)` }}>
            {ic.emoji}
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ color: ic.color }}>
            {ic.label}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── Data ── */
const CARDS = [
  {
    title: "Our Motto", icon: "🛡️", glow: "#f59e0b", accent: "#fbbf24",
    gradient: "from-amber-400 to-orange-500", num: "01",
    content: "SAFETY FIRST. Deepa Crackers adopts several stringent quality testing measures and safety norms defined by the fireworks explosive act.",
  },
  {
    title: "Our Vision", icon: "✨", glow: "#06b6d4", accent: "#22d3ee",
    gradient: "from-cyan-400 to-blue-500", num: "02",
    content: "To make genuine, high-quality fireworks easily accessible across Thiruthuraipoondi and all parts of Tamil Nadu with total reliability.",
  },
  {
    title: "Our Mission", icon: "🚀", glow: "#d946ef", accent: "#e879f9",
    gradient: "from-fuchsia-400 to-rose-500", num: "03",
    content: "Respect consumer benefit, safety, superior quality, beautiful packaging, effective service, and reasonable wholesale/retail pricing.",
  },
];

const STATS = [
  { value: 40, suffix: "+", label: "Years of Trust", color: "#fbbf24", icon: "🏆" },
  { value: 500, suffix: "+", label: "Products in Stock", color: "#34d399", icon: "📦" },
  { value: 10000, suffix: "+", label: "Happy Customers", color: "#22d3ee", icon: "😊" },
  { value: 100, suffix: "%", label: "Quality Assured", color: "#e879f9", icon: "✅" },
];

const TAG_PILLS = [
  { label: "Legal Certified", color: "#10b981" },
  { label: "Quality Tested", color: "#f59e0b" },
  { label: "Wholesale Available", color: "#06b6d4" },
  { label: "Direct Transport", color: "#d946ef" },
  { label: "Sivakasi Direct", color: "#ef4444" },
];

/* ── Main Component ── */
export default function About() {
  return (
    <PageShell orbColor1="#f59e0b" orbColor2="#d946ef" orbColor3="#10b981">
      <div className="pt-24 pb-8 px-4 md:px-8 max-w-7xl mx-auto w-full space-y-16">

        {/* ── HERO ─────────────────────────────────────── */}
        <section className="text-center space-y-6 pt-6">
          {/* Decorative star rule */}
          <div className="flex items-center gap-3 max-w-xs mx-auto">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
          </div>

          <Badges items={[
            { label: "🏆 Since 1985", bg: "#f59e0b", text: "#fbbf24" },
            { label: "🪔 Thiruthuraipoondi", bg: "#10b981", text: "#34d399" },
            { label: "🎆 Sivakasi Direct", bg: "#d946ef", text: "#e879f9" },
          ]} />

          {/* Giant headline */}
          <div className="relative">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tight leading-none uppercase"
              style={{
                background: "linear-gradient(135deg, #fbbf24 0%, #f97316 35%, #ef4444 70%, #f43f5e 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                filter: "drop-shadow(0 0 50px rgba(245,158,11,0.45))",
              }}
            >
              About
            </motion.h1>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12 }}
              className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tight leading-none uppercase -mt-3 sm:-mt-4"
              style={{
                background: "linear-gradient(135deg, #a78bfa 0%, #818cf8 40%, #38bdf8 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                filter: "drop-shadow(0 0 50px rgba(139,92,246,0.45))",
              }}
            >
              Us
            </motion.h1>
            {/* Ghost outline for depth */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none opacity-[0.03]" aria-hidden>
              <span className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tight leading-none uppercase" style={{ WebkitTextStroke: "2px white", color: "transparent" }}>ABOUT</span>
              <span className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tight leading-none uppercase -mt-3 sm:-mt-4" style={{ WebkitTextStroke: "2px white", color: "transparent" }}>US</span>
            </div>
          </div>

          {/* Pictographic icons */}
          <PictographRow />

          <DotDivider />
        </section>

        {/* ── BANNER IMAGE (desktop) ── */}
        <div className="hidden md:block w-full h-64 overflow-hidden rounded-3xl relative"
          style={{ border: "1.5px solid rgba(255,255,255,0.08)", boxShadow: "0 0 80px rgba(245,158,11,0.1)", background: "#080808" }}>
          <div className="h-[3px] w-full bg-gradient-to-r from-amber-400 via-rose-500 via-purple-500 to-cyan-400 absolute top-0 z-10" />
          {/* Corner brackets */}
          {[["top-3 left-3 border-t-2 border-l-2 rounded-tl-lg"], ["top-3 right-3 border-t-2 border-r-2 rounded-tr-lg"],
          ["bottom-3 left-3 border-b-2 border-l-2 rounded-bl-lg"], ["bottom-3 right-3 border-b-2 border-r-2 rounded-br-lg"]].map((cls, i) => (
            <div key={i} className={`absolute w-7 h-7 border-amber-500/50 z-10 ${cls[0]}`} />
          ))}
          <img src="/aboutbanner.png" alt="About Deepa Crackers" className="w-full h-full object-cover" />
        </div>

        {/* ── STORY / ABOUT SECTION ── */}
        <section className="grid md:grid-cols-2 gap-8 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, type: "spring" }}
            className="relative w-full h-96 rounded-3xl overflow-hidden"
            style={{ border: "1.5px solid rgba(255,255,255,0.08)", boxShadow: "0 0 60px rgba(0,0,0,0.6)" }}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-rose-500 to-cyan-400 z-10" />
            <img src="/aboutimage.jpg" alt="About Us" className="w-full h-full object-cover" />
          </motion.div>

          {/* Text card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, type: "spring" }}
            className="relative rounded-3xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #0a0a0a 0%, #111 50%, #0a0a0a 100%)",
              border: "1.5px solid rgba(245,158,11,0.3)",
              boxShadow: "0 0 50px rgba(245,158,11,0.08), inset 0 1px 0 rgba(251,191,36,0.08)",
            }}
          >
            <div className="h-[3px] w-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400"
              style={{ boxShadow: "0 0 14px rgba(245,158,11,0.6)" }} />
            {/* Diagonal hatch */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
              style={{ backgroundImage: "repeating-linear-gradient(45deg, #f59e0b 0, #f59e0b 1px, transparent 0, transparent 50%)", backgroundSize: "14px 14px" }} />

            <div className="relative z-10 p-6 md:p-8 space-y-4">
              <div>
                <h2 className="text-2xl font-black leading-tight"
                  style={{ background: "linear-gradient(90deg, #ffffff, #fbbf24, #f87171)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  About Deepa Crackers
                </h2>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-sm font-black text-amber-400">🪔 THIRUTHURAIPOONDI</span>
                  <span className="text-neutral-600">•</span>
                  <span className="text-sm font-black text-rose-400">Festive Brilliance &amp; Safety</span>
                </div>
                <div className="h-px w-full mt-3" style={{ background: "linear-gradient(to right, rgba(245,158,11,0.4), transparent)" }} />
              </div>

              <p className="text-[12px] md:text-sm leading-relaxed text-neutral-300">
                Deepa Crackers is a premier supplier of high-quality fireworks, ground chakkars, sparklers, and multi-color sky shots based in Thiruthuraipoondi. From traditional Indian festival celebrations to modern extravaganzas, our products bring sparkle to every family moment.
              </p>
              <p className="text-[12px] md:text-sm leading-relaxed text-neutral-400">
                100% legal compliance, strict quality control, vivid colors, and dazzling festive fun — with a strong distribution network across Tamil Nadu.
              </p>

              {/* Tag pills */}
              <div className="flex flex-wrap gap-2 pt-2">
                {TAG_PILLS.map((t, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                    style={{ background: `${t.color}18`, border: `1px solid ${t.color}44`, color: t.color }}>
                    {t.label}
                  </span>
                ))}
              </div>

              <a href="tel:+918072897834"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black text-white transition-all hover:scale-105 mt-2"
                style={{ background: "linear-gradient(135deg, #dc2626, #f59e0b)", boxShadow: "0 0 24px rgba(220,38,38,0.35)" }}>
                📞 Call Us Now
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </section>

        {/* ── STATS GRID ── */}
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-[3px] w-12 rounded-full bg-gradient-to-r from-transparent to-amber-500" />
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-wide"
              style={{ background: "linear-gradient(90deg, #fbbf24, #f97316, #d946ef)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              By The Numbers
            </h2>
            <div className="h-[3px] flex-1 rounded-full" style={{ background: "linear-gradient(to right, #f59e0b, #d946ef, transparent)" }} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((s, i) => <StatCard key={i} {...s} />)}
          </div>
        </section>

        {/* ── MOTTO / VISION / MISSION ── */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="h-[3px] w-12 rounded-full bg-gradient-to-r from-transparent to-amber-500" />
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-wide"
              style={{ background: "linear-gradient(90deg, #fbbf24, #f97316, #d946ef)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Our Values
            </h2>
            <div className="h-[3px] flex-1 rounded-full" style={{ background: "linear-gradient(to right, #f59e0b, #d946ef, transparent)" }} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {CARDS.map((card, i) => <ValueCard key={i} card={card} i={i} />)}
          </div>
        </section>

        {/* ── CTA / FESTIVE BANNER ── */}
        <section className="py-14 overflow-hidden rounded-3xl relative px-6 text-center"
          style={{
            background: "linear-gradient(135deg, #0d0800 0%, #0d0d0d 40%, #0d0800 100%)",
            border: "1.5px solid rgba(245,158,11,0.35)",
            boxShadow: "0 0 80px rgba(245,158,11,0.1), 0 0 160px rgba(239,68,68,0.07)",
          }}>
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-red-500 via-amber-400 via-emerald-400 via-cyan-400 to-purple-500"
            style={{ boxShadow: "0 0 20px rgba(245,158,11,0.7)" }} />
          <BlastParticles />

          <div className="relative z-10 max-w-3xl mx-auto space-y-5">
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-12 bg-amber-500/50" />
              <Zap className="w-6 h-6 text-amber-400 fill-amber-400/30" />
              <div className="h-px w-12 bg-amber-500/50" />
            </div>

            <h2 className="text-2xl md:text-4xl font-black leading-tight"
              style={{ background: "linear-gradient(135deg, #fbbf24 0%, #f97316 40%, #06b6d4 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", filter: "drop-shadow(0 0 30px rgba(245,158,11,0.4))" }}>
              🎆 Exclusive Festive Discounts &amp; Direct Transport!
            </h2>
            <p className="text-[12px] md:text-sm text-neutral-300 leading-relaxed">
              Celebrate with <strong className="font-black" style={{ color: "#fbbf24" }}>Deepa Crackers, Thiruthuraipoondi</strong>. Your one-stop shop for elite fireworks and festive delights.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="tel:+918072897834"
                className="px-6 py-3 rounded-2xl text-white font-black text-sm flex items-center gap-2 transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #dc2626, #f59e0b)", boxShadow: "0 0 30px rgba(239,68,68,0.3), 0 4px 20px rgba(245,158,11,0.2)", border: "1px solid rgba(251,191,36,0.3)" }}>
                📞 +91 8072 897 834
              </a>
              <a href="mailto:deepatraders1985@gmail.com"
                className="px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #10b981, #06b6d4)", color: "#020d08", boxShadow: "0 0 30px rgba(16,185,129,0.3)", border: "1px solid rgba(52,211,153,0.3)" }}>
                📧 Email Us
              </a>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-purple-500 via-cyan-400 to-amber-400" />
        </section>
      </div>

      <style>{`
        @keyframes blast {
          0% { transform: scale(0.3); opacity: 1; }
          60% { transform: scale(1.8); opacity: 0.7; }
          100% { transform: scale(2.8); opacity: 0; }
        }
        @keyframes floatUp {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes glowPulse {
          0% { opacity: 0.5; }
          100% { opacity: 1; box-shadow: inherit; }
        }
        @keyframes orbFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-18px) scale(1.03); }
        }
      `}</style>
    </PageShell>
  );
}