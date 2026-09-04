import React from "react";
import { motion } from "framer-motion";
import { Shield, AlertTriangle, CheckCircle, XCircle, Flame, Droplets, Eye, Users, Star, Zap } from "lucide-react";
import PageShell from "./PageShell";

/* ── Shared card for Do's ── */
function DoCard({ icon: Icon, title, description, color, glow, accent, num, idx }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: idx * 0.08, type: "spring", stiffness: 120 }}
      viewport={{ once: true }}
      whileHover={{ y: -10, scale: 1.03 }}
      className="group relative rounded-3xl overflow-hidden cursor-pointer"
      style={{
        background: "linear-gradient(135deg, #060c0a 0%, #0d1210 50%, #060c0a 100%)",
        border: `1.5px solid ${glow}55`,
        boxShadow: `0 0 0 1px ${glow}12, 0 8px 32px ${glow}18`,
      }}
    >
      <div className={`h-1.5 w-full bg-gradient-to-r ${color}`} style={{ boxShadow: `0 0 16px ${glow}` }} />
      {/* Num stamp */}
      <div className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center text-xs font-black"
        style={{ background: `${glow}20`, border: `1px solid ${glow}44`, color: accent, fontFamily: "monospace" }}>
        {num}
      </div>
      {/* Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `repeating-linear-gradient(45deg, ${glow} 0, ${glow} 1px, transparent 0, transparent 50%)`, backgroundSize: "12px 12px" }} />
      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at center, ${glow}12 0%, transparent 70%)` }} />

      <div className="relative z-10 p-6">
        {/* Check badge */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-13 h-13 w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${glow}30, ${glow}10)`, border: `1.5px solid ${glow}55`, boxShadow: `0 0 24px ${glow}44` }}>
            <Icon className="w-6 h-6" style={{ color: accent }} />
          </div>
          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white"
            style={{ background: glow, boxShadow: `0 0 8px ${glow}` }}>✓</div>
        </div>
        <h3 className="text-base font-black mb-2 tracking-tight" style={{ color: accent }}>{title}</h3>
        <p className="text-neutral-400 text-[12px] leading-relaxed">{description}</p>
        <div className="mt-5 h-px w-0 group-hover:w-full transition-all duration-500"
          style={{ background: `linear-gradient(to right, ${glow}, transparent)` }} />
      </div>
    </motion.div>
  );
}

/* ── Shared card for Don'ts ── */
function DontCard({ icon: Icon, title, description, color, glow, accent, num, idx }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: idx * 0.08, type: "spring", stiffness: 120 }}
      viewport={{ once: true }}
      whileHover={{ y: -10, scale: 1.03 }}
      className="group relative rounded-3xl overflow-hidden cursor-pointer"
      style={{
        background: "linear-gradient(135deg, #0d0404 0%, #120808 50%, #0d0404 100%)",
        border: `1.5px solid ${glow}55`,
        boxShadow: `0 0 0 1px ${glow}12, 0 8px 32px ${glow}18`,
      }}
    >
      <div className={`h-1.5 w-full bg-gradient-to-r ${color}`} style={{ boxShadow: `0 0 16px ${glow}` }} />
      <div className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center text-xs font-black"
        style={{ background: `${glow}20`, border: `1px solid ${glow}44`, color: accent, fontFamily: "monospace" }}>
        {num}
      </div>
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `repeating-linear-gradient(-45deg, ${glow} 0, ${glow} 1px, transparent 0, transparent 50%)`, backgroundSize: "10px 10px" }} />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at center, ${glow}12 0%, transparent 70%)` }} />

      <div className="relative z-10 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${glow}30, ${glow}10)`, border: `1.5px solid ${glow}55`, boxShadow: `0 0 24px ${glow}44` }}>
            <Icon className="w-6 h-6" style={{ color: accent }} />
          </div>
          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white"
            style={{ background: glow, boxShadow: `0 0 8px ${glow}` }}>✕</div>
        </div>
        <h3 className="text-base font-black mb-2 tracking-tight" style={{ color: accent }}>{title}</h3>
        <p className="text-neutral-400 text-[12px] leading-relaxed">{description}</p>
        <div className="mt-5 h-px w-0 group-hover:w-full transition-all duration-500"
          style={{ background: `linear-gradient(to right, ${glow}, transparent)` }} />
      </div>
    </motion.div>
  );
}

/* ── Floating emoji ticker ── */
function EmojiTicker() {
  const icons = ["🔥", "🪔", "⚡", "✨", "🎆", "🎇", "💥", "🎉", "🌟", "🛡️"];
  return (
    <div className="relative py-5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-14 rounded-2xl relative overflow-hidden"
          style={{ background: "linear-gradient(90deg, rgba(239,68,68,0.06), rgba(245,158,11,0.1), rgba(16,185,129,0.06))", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(255,255,255,0.02) 20px, rgba(255,255,255,0.02) 21px)" }} />
          <div className="absolute inset-0 flex items-center justify-center gap-3 sm:gap-6">
            {icons.map((e, i) => (
              <motion.span key={i} className="text-lg sm:text-xl"
                animate={{ y: [-3, 3, -3] }}
                transition={{ duration: 2 + i * 0.25, repeat: Infinity, ease: "easeInOut" }}>
                {e}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Data ── */
const dosData = [
  { icon: CheckCircle, title: "Follow Instructions", description: "Display fireworks strictly as per the instructions mentioned on the pack.", color: "from-emerald-400 to-teal-500", glow: "#10b981", accent: "#34d399", num: "01" },
  { icon: Shield, title: "Branded Fireworks", description: "Buy fireworks from authorized / reputed manufacturers only like Deepa Crackers.", color: "from-cyan-400 to-sky-600", glow: "#06b6d4", accent: "#22d3ee", num: "02" },
  { icon: Eye, title: "Outdoor Use Only", description: "Use fireworks only outdoors in safe, open spaces away from dry grass and buildings.", color: "from-violet-400 to-purple-600", glow: "#8b5cf6", accent: "#a78bfa", num: "03" },
  { icon: Users, title: "Safe Distance", description: "Light only one firework at a time, by one person. Others should watch from a safe distance.", color: "from-amber-400 to-orange-500", glow: "#f59e0b", accent: "#fcd34d", num: "04" },
  { icon: Droplets, title: "Keep Water Ready", description: "Keep two buckets of water or sand handy in the event of fire or any mishap.", color: "from-teal-400 to-emerald-600", glow: "#14b8a6", accent: "#5eead4", num: "05" },
];

const dontsData = [
  { icon: XCircle, title: "Don't Make Tricks", description: "Never make your own fireworks or tamper with factory cracker casings.", color: "from-rose-500 to-red-600", glow: "#f43f5e", accent: "#fb7185", num: "01" },
  { icon: Flame, title: "Don't Relight Duds", description: "Never try to re-light or pick up fireworks that have not ignited fully.", color: "from-red-500 to-orange-500", glow: "#ef4444", accent: "#f87171", num: "02" },
  { icon: AlertTriangle, title: "Don't Wear Loose Clothes", description: "Do not wear loose synthetic or flammable clothing while using fireworks.", color: "from-orange-500 to-amber-500", glow: "#f97316", accent: "#fb923c", num: "03" },
  { icon: XCircle, title: "Don't Touch Leftovers", description: "After fireworks display, never pick up leftovers immediately; they may still be hot.", color: "from-pink-500 to-rose-600", glow: "#ec4899", accent: "#f472b6", num: "04" },
  { icon: Shield, title: "Don't Carry in Pockets", description: "Never carry fireworks or matches in your pockets or bags.", color: "from-fuchsia-500 to-pink-600", glow: "#d946ef", accent: "#e879f9", num: "05" },
];

export default function Safety() {
  return (
    <PageShell orbColor1="#f59e0b" orbColor2="#ef4444" orbColor3="#8b5cf6">
      <div className="pt-24 pb-8 space-y-0">

        {/* ── HERO ── */}
        <section className="pt-6 pb-12 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            {/* Star rule */}
            <div className="flex items-center gap-3 mb-8 max-w-xs mx-auto">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
            </div>

            <div className="text-center space-y-6">
              {/* Badges */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                {[
                  { label: "🔥 Deepa Crackers", bg: "#f59e0b", text: "#fbbf24" },
                  { label: "✅ Safety Protocol", bg: "#10b981", text: "#34d399" },
                  { label: "🪔 Diwali 2025", bg: "#8b5cf6", text: "#a78bfa" },
                ].map((b, i) => (
                  <motion.span key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 + 0.2 }}
                    className="px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] rounded-full"
                    style={{ background: `${b.bg}1a`, border: `1px solid ${b.bg}55`, color: b.text, boxShadow: `0 0 18px ${b.bg}18` }}>
                    {b.label}
                  </motion.span>
                ))}
              </div>

              {/* Giant headline */}
              <div className="relative">
                <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
                  className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tight leading-none uppercase"
                  style={{ background: "linear-gradient(135deg, #fbbf24 0%, #f97316 35%, #ef4444 70%, #f43f5e 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", filter: "drop-shadow(0 0 50px rgba(245,158,11,0.5))" }}>
                  Safety
                </motion.h1>
                <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.12 }}
                  className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tight leading-none uppercase -mt-3 sm:-mt-4"
                  style={{ background: "linear-gradient(135deg, #a78bfa 0%, #818cf8 40%, #38bdf8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", filter: "drop-shadow(0 0 50px rgba(139,92,246,0.5))" }}>
                  Guidelines
                </motion.h1>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none opacity-[0.04]" aria-hidden>
                  <span className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tight leading-none uppercase" style={{ WebkitTextStroke: "2px white", color: "transparent" }}>SAFETY</span>
                  <span className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tight leading-none uppercase -mt-3 sm:-mt-4" style={{ WebkitTextStroke: "2px white", color: "transparent" }}>GUIDELINES</span>
                </div>
              </div>

              <p className="text-sm md:text-base font-bold text-amber-300/90 tracking-wide">
                🪔 Safe Celebrations &nbsp;•&nbsp; Happy Diwali &nbsp;•&nbsp; Celebrate Responsibly
              </p>
              <p className="text-[12px] text-neutral-400 max-w-3xl mx-auto leading-relaxed">
                Essential Do&apos;s &amp; Don&apos;ts for safe firework use. A little negligence can cause injury — always celebrate responsibly!
              </p>

              <div className="flex items-center justify-center gap-4">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-500 opacity-60" />
                <div className="flex gap-1.5">
                  {["#ef4444", "#f59e0b", "#10b981", "#06b6d4", "#8b5cf6"].map((c, i) => (
                    <div key={i} className="w-2 h-2 rounded-full" style={{ background: c, boxShadow: `0 0 8px ${c}` }} />
                  ))}
                </div>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-500 opacity-60" />
              </div>
            </div>
          </div>
        </section>

        {/* ── DO'S ── */}
        <section className="py-10 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto space-y-8">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
              className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3 text-[10px] font-black uppercase tracking-widest"
                  style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.4)", color: "#34d399" }}>
                  <CheckCircle className="w-3 h-3" /> Do&apos;s for Safe Celebration
                </div>
                <h2 className="text-4xl md:text-6xl font-black leading-none uppercase"
                  style={{ background: "linear-gradient(90deg, #34d399, #10b981, #059669)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", filter: "drop-shadow(0 0 30px rgba(16,185,129,0.5))" }}>
                  DO&apos;S
                </h2>
              </div>
              <div className="flex-1 flex items-end pb-2">
                <div className="h-[3px] w-full rounded-full" style={{ background: "linear-gradient(90deg, #10b981, #34d399, #06b6d4, transparent)", boxShadow: "0 0 12px #10b981" }} />
              </div>
              <Zap className="hidden sm:block w-8 h-8 pb-1 text-emerald-400 fill-emerald-400/30" />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {dosData.map((item, idx) => <DoCard key={idx} {...item} idx={idx} />)}
            </div>
          </div>
        </section>

        {/* ── EMOJI TICKER ── */}
        <EmojiTicker />

        {/* ── DON'TS ── */}
        <section className="py-10 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto space-y-8">
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
              className="flex flex-col sm:flex-row-reverse items-start sm:items-end gap-4">
              <div className="text-right">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3 text-[10px] font-black uppercase tracking-widest"
                  style={{ background: "rgba(244,63,94,0.12)", border: "1px solid rgba(244,63,94,0.4)", color: "#fb7185" }}>
                  <XCircle className="w-3 h-3" /> Don&apos;ts to Avoid Mishaps
                </div>
                <h2 className="text-4xl md:text-6xl font-black leading-none uppercase"
                  style={{ background: "linear-gradient(90deg, #f43f5e, #ef4444, #dc2626)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", filter: "drop-shadow(0 0 30px rgba(239,68,68,0.5))" }}>
                  DON&apos;TS
                </h2>
              </div>
              <div className="flex-1 flex items-end pb-2">
                <div className="h-[3px] w-full rounded-full" style={{ background: "linear-gradient(270deg, #f43f5e, #ef4444, #f97316, transparent)", boxShadow: "0 0 12px #ef4444" }} />
              </div>
              <AlertTriangle className="hidden sm:block w-8 h-8 pb-1 text-rose-400 fill-rose-400/20" />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {dontsData.map((item, idx) => <DontCard key={idx} {...item} idx={idx} />)}
            </div>
          </div>
        </section>

        {/* ── WARNING BANNER ── */}
        <section className="py-10 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.75, type: "spring" }}
              viewport={{ once: true }}
              className="relative rounded-3xl overflow-hidden"
              style={{ background: "linear-gradient(135deg, #1a0800 0%, #0d0d0d 40%, #1a0800 100%)", border: "1.5px solid rgba(245,158,11,0.4)", boxShadow: "0 0 80px rgba(245,158,11,0.12), 0 0 160px rgba(239,68,68,0.07)" }}
            >
              <div className="h-[3px] w-full bg-gradient-to-r from-red-600 via-amber-400 to-rose-500" style={{ boxShadow: "0 0 20px #f59e0b" }} />
              <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
                style={{ backgroundImage: "repeating-linear-gradient(45deg, #f59e0b 0, #f59e0b 1px, transparent 0, transparent 50%)", backgroundSize: "16px 16px" }} />
              {/* Corner brackets */}
              {[["top-4 left-4 border-t-2 border-l-2 rounded-tl-lg"], ["top-4 right-4 border-t-2 border-r-2 rounded-tr-lg"],
              ["bottom-4 left-4 border-b-2 border-l-2 rounded-bl-lg"], ["bottom-4 right-4 border-b-2 border-r-2 rounded-br-lg"]].map((cls, i) => (
                <div key={i} className={`absolute w-7 h-7 border-amber-500/50 z-10 ${cls[0]}`} />
              ))}

              <div className="relative z-10 p-8 md:p-10 text-center">
                <motion.div animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }} className="inline-block mb-4">
                  <AlertTriangle className="w-14 h-14 mx-auto" style={{ color: "#fbbf24", filter: "drop-shadow(0 0 20px rgba(245,158,11,0.6))" }} />
                </motion.div>

                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="h-px w-12 bg-amber-500/50" />
                  <h3 className="text-xl md:text-2xl font-black uppercase tracking-wide"
                    style={{ background: "linear-gradient(90deg, #fbbf24, #ffffff, #fb923c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    Important Statutory Reminder
                  </h3>
                  <div className="h-px w-12 bg-amber-500/50" />
                </div>

                <p className="text-[12px] md:text-sm text-neutral-300 leading-relaxed max-w-2xl mx-auto">
                  Always prioritize family safety over celebrations. Ensure young children are accompanied by adults while lighting sparklers. Keep a first aid kit and clean cold water handy at all times.
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest">
                  {[
                    { label: "First Aid Kit", icon: "🩺", color: "#10b981" },
                    { label: "Cold Water", icon: "💧", color: "#06b6d4" },
                    { label: "Adult Supervision", icon: "👁️", color: "#f59e0b" },
                    { label: "Stay Alert", icon: "⚡", color: "#ef4444" },
                  ].map((t, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-full flex items-center gap-1.5"
                      style={{ background: `${t.color}18`, border: `1px solid ${t.color}44`, color: t.color }}>
                      {t.icon} {t.label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="h-[3px] w-full bg-gradient-to-r from-rose-500 via-amber-400 to-red-600" style={{ boxShadow: "0 0 20px #ef4444" }} />
            </motion.div>
          </div>
        </section>
      </div>

      <style>{`
        @keyframes orbFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-18px) scale(1.03); }
        }
      `}</style>
    </PageShell>
  );
}
