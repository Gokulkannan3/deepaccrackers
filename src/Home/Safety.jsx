import React from "react";
import { motion } from "framer-motion";
import { Shield, AlertTriangle, CheckCircle, XCircle, Flame, Droplets, Eye, Users, Star, Zap } from "lucide-react";
import Navbar from "../Component/Navbar";
import BackgroundFireworks from "../Component/BackgroundFireworks";
import "../App.css";

const dosData = [
  {
    icon: CheckCircle,
    title: "Follow Instructions",
    description: "Display fireworks strictly as per the instructions mentioned on the pack.",
    color: "from-emerald-400 to-teal-500",
    glow: "#10b981",
    accent: "#34d399",
    num: "01",
  },
  {
    icon: Shield,
    title: "Branded Fireworks",
    description: "Buy fireworks from authorized / reputed manufacturers only like Deepa Crackers.",
    color: "from-cyan-400 to-sky-600",
    glow: "#06b6d4",
    accent: "#22d3ee",
    num: "02",
  },
  {
    icon: Eye,
    title: "Outdoor Use Only",
    description: "Use fireworks only outdoors in safe, open spaces away from dry grass and buildings.",
    color: "from-violet-400 to-purple-600",
    glow: "#8b5cf6",
    accent: "#a78bfa",
    num: "03",
  },
  {
    icon: Users,
    title: "Safe Distance",
    description: "Light only one firework at a time, by one person. Others should watch from a safe distance.",
    color: "from-amber-400 to-orange-500",
    glow: "#f59e0b",
    accent: "#fcd34d",
    num: "04",
  },
  {
    icon: Droplets,
    title: "Keep Water Ready",
    description: "Keep two buckets of water or sand handy in the event of fire or any mishap.",
    color: "from-teal-400 to-emerald-600",
    glow: "#14b8a6",
    accent: "#5eead4",
    num: "05",
  },
];

const dontsData = [
  {
    icon: XCircle,
    title: "Don't Make Tricks",
    description: "Never make your own fireworks or tamper with factory cracker casings.",
    color: "from-rose-500 to-red-600",
    glow: "#f43f5e",
    accent: "#fb7185",
    num: "01",
  },
  {
    icon: Flame,
    title: "Don't Relight Duds",
    description: "Never try to re-light or pick up fireworks that have not ignited fully.",
    color: "from-red-500 to-orange-500",
    glow: "#ef4444",
    accent: "#f87171",
    num: "02",
  },
  {
    icon: AlertTriangle,
    title: "Don't Wear Loose Clothes",
    description: "Do not wear loose synthetic or flammable clothing while using fireworks.",
    color: "from-orange-500 to-amber-500",
    glow: "#f97316",
    accent: "#fb923c",
    num: "03",
  },
  {
    icon: XCircle,
    title: "Don't Touch Leftovers",
    description: "After fireworks display, never pick up leftovers immediately; they may still be hot.",
    color: "from-pink-500 to-rose-600",
    glow: "#ec4899",
    accent: "#f472b6",
    num: "04",
  },
  {
    icon: Shield,
    title: "Don't Carry in Pockets",
    description: "Never carry fireworks or matches in your pockets or bags.",
    color: "from-fuchsia-500 to-pink-600",
    glow: "#d946ef",
    accent: "#e879f9",
    num: "05",
  },
];

function DoCard({ icon: Icon, title, description, color, glow, accent, num, idx }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: -1 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.6, delay: idx * 0.1, type: "spring", stiffness: 120 }}
      viewport={{ once: true }}
      whileHover={{ y: -10, scale: 1.03, rotate: 0.8 }}
      className="group relative rounded-3xl overflow-hidden cursor-pointer"
      style={{
        background: `linear-gradient(135deg, #080808 0%, #111 50%, #080808 100%)`,
        border: `1.5px solid ${glow}55`,
        boxShadow: `0 0 0 1px ${glow}15, 0 8px 32px ${glow}1a, inset 0 1px 0 ${accent}1a`,
      }}
    >
      <div className={`h-1.5 w-full bg-gradient-to-r ${color}`} style={{ boxShadow: `0 0 14px ${glow}` }} />
      <div
        className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center text-xs font-black"
        style={{ background: `${glow}20`, border: `1px solid ${glow}44`, color: accent, fontFamily: "monospace" }}
      >
        {num}
      </div>
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, ${glow} 0, ${glow} 1px, transparent 0, transparent 50%)`,
          backgroundSize: "12px 12px",
        }}
      />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at center, ${glow}15 0%, transparent 70%)` }}
      />
      <div className="relative z-10 p-6">
        <div
          className="w-15 h-15 rounded-2xl flex items-center justify-center mb-5 relative w-14 h-14"
          style={{
            background: `linear-gradient(135deg, ${glow}30, ${glow}10)`,
            border: `1.5px solid ${glow}55`,
            boxShadow: `0 0 24px ${glow}44`,
          }}
        >
          <Icon className="w-7 h-7" style={{ color: accent }} />
        </div>
        <h3 className="text-base font-black mb-2 tracking-tight" style={{ color: accent }}>
          {title}
        </h3>
        <p className="text-neutral-400 text-sm leading-relaxed">{description}</p>
        <div className="mt-5 h-px w-0 group-hover:w-full transition-all duration-500" style={{ background: `linear-gradient(to right, ${glow}, transparent)` }} />
      </div>
    </motion.div>
  );
}

function DontCard({ icon: Icon, title, description, color, glow, accent, num, idx }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: 1 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.6, delay: idx * 0.1, type: "spring", stiffness: 120 }}
      viewport={{ once: true }}
      whileHover={{ y: -10, scale: 1.03, rotate: -0.8 }}
      className="group relative rounded-3xl overflow-hidden cursor-pointer"
      style={{
        background: `linear-gradient(135deg, #0d0404 0%, #110808 50%, #0d0404 100%)`,
        border: `1.5px solid ${glow}55`,
        boxShadow: `0 0 0 1px ${glow}15, 0 8px 32px ${glow}1a, inset 0 1px 0 ${accent}1a`,
      }}
    >
      <div className={`h-1.5 w-full bg-gradient-to-r ${color}`} style={{ boxShadow: `0 0 14px ${glow}` }} />
      <div
        className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center text-xs font-black"
        style={{ background: `${glow}20`, border: `1px solid ${glow}44`, color: accent, fontFamily: "monospace" }}
      >
        {num}
      </div>
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(-45deg, ${glow} 0, ${glow} 1px, transparent 0, transparent 50%)`,
          backgroundSize: "10px 10px",
        }}
      />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at center, ${glow}15 0%, transparent 70%)` }}
      />
      <div className="relative z-10 p-6">
        <div className="relative w-fit mb-5">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${glow}30, ${glow}10)`,
              border: `1.5px solid ${glow}55`,
              boxShadow: `0 0 24px ${glow}44`,
            }}
          >
            <Icon className="w-7 h-7" style={{ color: accent }} />
          </div>
          <div
            className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black text-white"
            style={{ background: glow, boxShadow: `0 0 10px ${glow}` }}
          >
            ✕
          </div>
        </div>
        <h3 className="text-base font-black mb-2 tracking-tight" style={{ color: accent }}>
          {title}
        </h3>
        <p className="text-neutral-400 text-sm leading-relaxed">{description}</p>
        <div className="mt-5 h-px w-0 group-hover:w-full transition-all duration-500" style={{ background: `linear-gradient(to right, ${glow}, transparent)` }} />
      </div>
    </motion.div>
  );
}

export default function Safety() {
  return (
    <div className="min-h-screen bg-[#040404] text-white overflow-x-hidden relative selection:bg-amber-400 selection:text-slate-950">
      <BackgroundFireworks />

      {/* Ambient neon orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-32 -left-48 w-[600px] h-[600px] rounded-full" style={{ background: "radial-gradient(circle, #f59e0b20 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute bottom-0 -right-32 w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle, #ef444420 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full" style={{ background: "radial-gradient(circle, #8b5cf618 0%, transparent 70%)", filter: "blur(60px)" }} />
      </div>

      {/* Dot-grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.05]"
        style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "28px 28px" }}
      />

      <div className="relative z-10">
        <Navbar />

        {/* ── HERO ─────────────────────────────────────── */}
        <section className="pt-32 pb-16 px-4 sm:px-6 relative">
          <div className="max-w-7xl mx-auto mb-10">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
            </div>
          </div>

          <div className="max-w-7xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
              className="space-y-6"
            >
              {/* Multi-badge pill row */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                {[
                  { label: "🔥 Deepa Crackers", bg: "#f59e0b", text: "#fbbf24" },
                  { label: "✅ Safety Protocol", bg: "#10b981", text: "#34d399" },
                  { label: "🪔 Diwali 2025", bg: "#8b5cf6", text: "#a78bfa" },
                ].map((b, i) => (
                  <span
                    key={i}
                    className="px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-full"
                    style={{ background: `${b.bg}20`, border: `1px solid ${b.bg}55`, color: b.text, boxShadow: `0 0 16px ${b.bg}20` }}
                  >
                    {b.label}
                  </span>
                ))}
              </div>

              {/* Giant stacked headline with ghost outline */}
              <div className="relative">
                <h1
                  className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-none uppercase"
                  style={{
                    background: "linear-gradient(135deg, #fbbf24 0%, #f97316 35%, #ef4444 70%, #f43f5e 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    filter: "drop-shadow(0 0 40px #f59e0b60)",
                  }}
                >
                  Safety
                </h1>
                <h1
                  className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-none uppercase -mt-2 sm:-mt-3"
                  style={{
                    background: "linear-gradient(135deg, #a78bfa 0%, #818cf8 40%, #38bdf8 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    filter: "drop-shadow(0 0 40px #8b5cf660)",
                  }}
                >
                  Guidelines
                </h1>
                {/* Ghost outline for depth */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none opacity-[0.05]" aria-hidden>
                  <span className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-none uppercase" style={{ WebkitTextStroke: "2px white", color: "transparent" }}>SAFETY</span>
                  <span className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-none uppercase -mt-2 sm:-mt-3" style={{ WebkitTextStroke: "2px white", color: "transparent" }}>GUIDELINES</span>
                </div>
              </div>

              <p className="text-base md:text-xl font-bold text-amber-300/90 tracking-wide">
                🪔 Safe Celebrations &nbsp;•&nbsp; Happy Diwali &nbsp;•&nbsp; Celebrate Responsibly
              </p>
              <p className="text-sm text-neutral-400 max-w-3xl mx-auto leading-relaxed">
                There are certain essential Do&apos;s &amp; Don&apos;ts to follow while purchasing, bursting, and storing crackers. A little
                negligence or carelessness can cause injury. Always celebrate responsibly!
              </p>

              {/* Color dot divider */}
              <div className="flex items-center justify-center gap-4 pt-2">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-500" />
                <div className="flex gap-1.5">
                  {["#ef4444", "#f59e0b", "#10b981", "#06b6d4", "#8b5cf6"].map((c, i) => (
                    <div key={i} className="w-2 h-2 rounded-full" style={{ background: c, boxShadow: `0 0 8px ${c}` }} />
                  ))}
                </div>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-500" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── DO'S ─────────────────────────────────────── */}
        <section className="py-12 px-4 sm:px-6 relative">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="mb-12 flex flex-col sm:flex-row items-start sm:items-end gap-4"
            >
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3 text-[10px] font-black uppercase tracking-widest" style={{ background: "#10b98120", border: "1px solid #10b98155", color: "#34d399" }}>
                  <CheckCircle className="w-3 h-3" /> Do&apos;s for Safe Celebration
                </div>
                <h2
                  className="text-4xl md:text-6xl font-black leading-none uppercase"
                  style={{
                    background: "linear-gradient(90deg, #34d399, #10b981, #059669)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    filter: "drop-shadow(0 0 30px #10b98166)",
                  }}
                >
                  DO&apos;S
                </h2>
              </div>
              <div className="flex-1 flex items-end pb-2">
                <div className="h-[3px] w-full rounded-full" style={{ background: "linear-gradient(90deg, #10b981, #34d399, #06b6d4, transparent)", boxShadow: "0 0 12px #10b981" }} />
              </div>
              <div className="hidden sm:block pb-1">
                <Zap className="w-8 h-8 text-emerald-400 fill-emerald-400/30" />
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {dosData.map((item, idx) => (
                <DoCard key={idx} {...item} idx={idx} />
              ))}
            </div>
          </div>
        </section>

        {/* ── EMOJI SEPARATOR ──────────────────────────── */}
        <div className="relative py-6 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4">
            <div
              className="h-14 rounded-2xl relative overflow-hidden"
              style={{ background: "linear-gradient(90deg, #ef444410, #f59e0b18, #10b98110)", border: "1px solid #ffffff08" }}
            >
              <div className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 20px, #ffffff04 20px, #ffffff04 21px)" }} />
              <div className="absolute inset-0 flex items-center justify-center gap-3 sm:gap-5">
                {["🔥", "🪔", "⚡", "✨", "🎆", "🎇", "💥", "🎉", "🌟"].map((e, i) => (
                  <motion.span
                    key={i}
                    className="text-lg sm:text-xl"
                    animate={{ y: [-3, 3, -3] }}
                    transition={{ duration: 2 + i * 0.2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {e}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── DON'TS ───────────────────────────────────── */}
        <section className="py-12 px-4 sm:px-6 relative">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="mb-12 flex flex-col sm:flex-row-reverse items-start sm:items-end gap-4"
            >
              <div className="text-right">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3 text-[10px] font-black uppercase tracking-widest" style={{ background: "#f43f5e20", border: "1px solid #f43f5e55", color: "#fb7185" }}>
                  <XCircle className="w-3 h-3" /> Don&apos;ts to Avoid Mishaps
                </div>
                <h2
                  className="text-4xl md:text-6xl font-black leading-none uppercase"
                  style={{
                    background: "linear-gradient(90deg, #f43f5e, #ef4444, #dc2626)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    filter: "drop-shadow(0 0 30px #ef444466)",
                  }}
                >
                  DON&apos;TS
                </h2>
              </div>
              <div className="flex-1 flex items-end pb-2">
                <div className="h-[3px] w-full rounded-full" style={{ background: "linear-gradient(270deg, #f43f5e, #ef4444, #f97316, transparent)", boxShadow: "0 0 12px #ef4444" }} />
              </div>
              <div className="hidden sm:block pb-1">
                <AlertTriangle className="w-8 h-8 text-rose-400 fill-rose-400/20" />
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {dontsData.map((item, idx) => (
                <DontCard key={idx} {...item} idx={idx} />
              ))}
            </div>
          </div>
        </section>

        {/* ── WARNING BANNER ───────────────────────────── */}
        <section className="py-12 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
              viewport={{ once: true }}
              className="relative rounded-3xl overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #1a0800 0%, #0d0d0d 40%, #1a0800 100%)",
                border: "1.5px solid #f59e0b55",
                boxShadow: "0 0 60px #f59e0b22, 0 0 120px #ef444410, inset 0 1px 0 #fbbf2420",
              }}
            >
              {/* Multi-layer top bars */}
              <div className="h-1 w-full bg-gradient-to-r from-red-600 via-amber-400 to-rose-500" style={{ boxShadow: "0 0 20px #f59e0b" }} />
              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              {/* Hatching */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: "repeating-linear-gradient(45deg, #f59e0b 0, #f59e0b 1px, transparent 0, transparent 50%)", backgroundSize: "16px 16px" }} />

              {/* Corner brackets */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-amber-500/50 rounded-tl-lg" />
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-amber-500/50 rounded-tr-lg" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-amber-500/50 rounded-bl-lg" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-amber-500/50 rounded-br-lg" />

              <div className="relative z-10 p-10 text-center">
                <motion.div
                  animate={{ rotate: [-5, 5, -5] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-block mb-4"
                >
                  <AlertTriangle className="w-14 h-14 mx-auto" style={{ color: "#fbbf24", filter: "drop-shadow(0 0 20px #f59e0b)" }} />
                </motion.div>

                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="h-px w-12 bg-amber-500/60" />
                  <h3
                    className="text-2xl md:text-3xl font-black uppercase tracking-wide"
                    style={{
                      background: "linear-gradient(90deg, #fbbf24, #ffffff, #fb923c)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Important Statutory Reminder
                  </h3>
                  <div className="h-px w-12 bg-amber-500/60" />
                </div>

                <p className="text-sm md:text-base text-neutral-300 leading-relaxed max-w-2xl mx-auto">
                  Always prioritize family safety over celebrations. Ensure young children are accompanied by adults while
                  lighting sparklers. Keep a first aid kit and clean cold water handy at all times.
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs font-black uppercase tracking-widest">
                  {[
                    { label: "First Aid Kit", icon: "🩺", color: "#10b981" },
                    { label: "Cold Water", icon: "💧", color: "#06b6d4" },
                    { label: "Adult Supervision", icon: "👁️", color: "#f59e0b" },
                    { label: "Stay Alert", icon: "⚡", color: "#ef4444" },
                  ].map((t, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-full flex items-center gap-1.5"
                      style={{ background: `${t.color}18`, border: `1px solid ${t.color}44`, color: t.color }}
                    >
                      {t.icon} {t.label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="h-1 w-full bg-gradient-to-r from-rose-500 via-amber-400 to-red-600" style={{ boxShadow: "0 0 20px #ef4444" }} />
            </motion.div>
          </div>
        </section>

        {/* ── FOOTER ───────────────────────────────────── */}
        <footer
          className="relative mt-16 mx-4 mb-8 rounded-3xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #060606 0%, #0d0d0d 50%, #060606 100%)",
            border: "1px solid #ffffff10",
            boxShadow: "0 -4px 60px #00000066, inset 0 1px 0 #ffffff08",
          }}
        >
          {/* Multi-color top rule */}
          <div className="h-1.5 w-full bg-gradient-to-r from-red-500 via-amber-400 via-emerald-400 via-cyan-400 to-purple-500" />

          {/* Dot pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

          <div className="relative z-10 max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <h2 className="text-2xl font-black mb-1 uppercase tracking-widest" style={{ color: "#fbbf24", textShadow: "0 0 20px #f59e0b55" }}>
                DEEPA CRACKERS
              </h2>
              <div className="h-px w-24 bg-gradient-to-r from-amber-500 to-transparent mb-3" />
              <p className="text-neutral-400 text-xs font-medium">Thiruthuraipoondi &amp; Sivakasi Direct</p>
              <p className="text-neutral-500 text-xs mt-2 leading-relaxed">
                Spark joy, spread light—genuine Sivakasi fireworks crafted for safe festive celebrations.
              </p>
              <div className="flex gap-2 mt-4">
                {["🔥", "🎆", "🪔", "✨"].map((e, i) => <span key={i} className="text-lg">{e}</span>)}
              </div>
            </div>

            <div>
              <h2 className="text-base font-black text-white mb-1 uppercase tracking-widest">Contact Information</h2>
              <div className="h-px w-16 bg-gradient-to-r from-cyan-500 to-transparent mb-3" />
              <p className="text-neutral-400 text-xs">Deepa Crackers Retail &amp; Wholesale</p>
              <p className="text-neutral-400 text-xs mt-1">RS Road, THIRUTHURAIPOONDI, Tamil Nadu</p>
              <a href="tel:+918072897834" className="block mt-2 text-xs font-black" style={{ color: "#fbbf24" }}>+91 8072 897 834</a>
              <p className="text-neutral-500 text-xs mt-1">deepatraders1985@gmail.com</p>
            </div>

            <div>
              <h2 className="text-base font-black text-white mb-1 uppercase tracking-widest">Quick Navigation</h2>
              <div className="h-px w-16 bg-gradient-to-r from-purple-500 to-transparent mb-3" />
              <ul className="space-y-1.5 text-xs text-neutral-400">
                {[
                  { label: "Home", href: "/" },
                  { label: "Track Order", href: "/status" },
                  { label: "Safety Tips", href: "/safety-tips" },
                  { label: "About Us", href: "/about-us" },
                  { label: "Contact Us", href: "/contact-us" },
                ].map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="hover:text-amber-400 transition flex items-center gap-1.5 group">
                      <span className="w-1 h-1 rounded-full bg-amber-500/40 group-hover:bg-amber-400 transition" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/[0.06] py-5 text-center text-xs text-neutral-600">
            © {new Date().getFullYear()}{" "}
            <span className="font-black" style={{ color: "#fbbf24" }}>Deepa Crackers</span>
            {" "}— THIRUTHURAIPOONDI. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}
