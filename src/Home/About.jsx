import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Zap } from 'lucide-react';
import Navbar from '../Component/Navbar';
import BackgroundFireworks from '../Component/BackgroundFireworks';

export default function About() {
  const [blasts, setBlasts] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newBlasts = Array.from({ length: 8 }).map(() => ({
        id: Date.now() + Math.random(),
        top: Math.random() * 70 + 10,
        left: Math.random() * 90,
        color: ['#ef4444', '#f59e0b', '#10b981', '#06b6d4', '#d946ef', '#ec4899', '#ffffff'][Math.floor(Math.random() * 7)],
      }));
      setBlasts((prev) => [...prev, ...newBlasts]);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const cards = [
    {
      title: "Our Motto",
      icon: "🛡️",
      glow: "#f59e0b",
      accent: "#fbbf24",
      gradient: "from-amber-400 to-orange-500",
      num: "01",
      content: "Our motto is SAFETY FIRST. Deepa Crackers adopts several stringent quality testing measures and safety norms defined by the fireworks explosive act.",
    },
    {
      title: "Our Vision",
      icon: "✨",
      glow: "#06b6d4",
      accent: "#22d3ee",
      gradient: "from-cyan-400 to-blue-500",
      num: "02",
      content: "Our vision is to make genuine, high-quality fireworks easily accessible across Thiruthuraipoondi and all parts of Tamil Nadu with total reliability.",
    },
    {
      title: "Our Mission",
      icon: "🚀",
      glow: "#d946ef",
      accent: "#e879f9",
      gradient: "from-fuchsia-400 to-rose-500",
      num: "03",
      content: "We respect consumer benefit, safety, superior quality, beautiful packaging, effective service, and reasonable wholesale/retail pricing.",
    },
  ];

  return (
    <div className="min-h-screen text-white flex flex-col bg-[#040404] selection:bg-amber-400 selection:text-slate-950 relative overflow-x-hidden">
      <BackgroundFireworks />

      {/* Ambient neon orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full" style={{ background: "radial-gradient(circle, #f59e0b18 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute bottom-0 -right-40 w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle, #d946ef18 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute top-1/2 left-1/3 w-[400px] h-[400px] rounded-full" style={{ background: "radial-gradient(circle, #10b98114 0%, transparent 70%)", filter: "blur(60px)" }} />
      </div>

      {/* Dot-grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.05]"
        style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "28px 28px" }}
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <div className="flex-grow pt-28 pb-16 px-4 md:px-8 max-w-7xl mx-auto w-full space-y-14">

          {/* ── HERO ─────────────────────────────── */}
          <div className="text-center space-y-6">
            {/* Decorative rule */}
            <div className="flex items-center gap-3 max-w-xs mx-auto">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
            </div>

            {/* Badge row */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                { label: "🏆 Since 1985", bg: "#f59e0b", text: "#fbbf24" },
                { label: "🪔 Thiruthuraipoondi", bg: "#10b981", text: "#34d399" },
                { label: "🎆 Sivakasi Direct", bg: "#d946ef", text: "#e879f9" },
              ].map((b, i) => (
                <span
                  key={i}
                  className="px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-full"
                  style={{ background: `${b.bg}20`, border: `1px solid ${b.bg}55`, color: b.text, boxShadow: `0 0 16px ${b.bg}18` }}
                >
                  {b.label}
                </span>
              ))}
            </div>

            {/* Giant stacked headline */}
            <div className="relative">
              <h1
                className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-none uppercase"
                style={{
                  background: "linear-gradient(135deg, #fbbf24 0%, #f97316 35%, #ef4444 70%, #f43f5e 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 40px #f59e0b55)",
                }}
              >
                About
              </h1>
              <h1
                className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-none uppercase -mt-2 sm:-mt-3"
                style={{
                  background: "linear-gradient(135deg, #a78bfa 0%, #818cf8 40%, #38bdf8 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 40px #8b5cf655)",
                }}
              >
                Us
              </h1>
              {/* Ghost outline */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none opacity-[0.04]" aria-hidden>
                <span className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-none uppercase" style={{ WebkitTextStroke: "2px white", color: "transparent" }}>ABOUT</span>
                <span className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-none uppercase -mt-2 sm:-mt-3" style={{ WebkitTextStroke: "2px white", color: "transparent" }}>US</span>
              </div>
            </div>

            {/* Color dot divider */}
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-500" />
              <div className="flex gap-1.5">
                {["#ef4444", "#f59e0b", "#10b981", "#06b6d4", "#d946ef"].map((c, i) => (
                  <div key={i} className="w-2 h-2 rounded-full" style={{ background: c, boxShadow: `0 0 8px ${c}` }} />
                ))}
              </div>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-500" />
            </div>
          </div>

          {/* ── BANNER ───────────────────────────── */}
          <div
            className="hidden md:block w-full h-64 md:h-72 overflow-hidden rounded-3xl relative"
            style={{
              border: "1.5px solid #ffffff12",
              boxShadow: "0 0 60px #f59e0b15, inset 0 1px 0 #ffffff08",
              background: "#080808",
            }}
          >
            <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-rose-500 via-purple-500 to-cyan-400 absolute top-0 left-0 right-0 z-10" />
            {/* Corner brackets */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-amber-500/50 rounded-tl-lg z-10" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-amber-500/50 rounded-tr-lg z-10" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-amber-500/50 rounded-bl-lg z-10" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-amber-500/50 rounded-br-lg z-10" />
            <img src="/aboutbanner.png" alt="About banner" className="w-full h-full object-cover rounded-3xl" />
          </div>

          {/* ── STORY SECTION ────────────────────── */}
          <section className="grid md:grid-cols-2 gap-8 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, type: "spring" }}
              className="relative w-full h-96 rounded-3xl overflow-hidden"
              style={{
                border: "1.5px solid #ffffff10",
                boxShadow: "0 0 40px #00000066, inset 0 1px 0 #ffffff08",
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-rose-500 to-cyan-400 z-10" />
              <img src="/aboutimage.jpg" alt="About Us" className="w-full h-full object-cover" />
              {/* Corner brackets */}
              <div className="absolute top-3 left-3 w-7 h-7 border-t-2 border-l-2 border-amber-500/60 rounded-tl-lg z-10" />
              <div className="absolute top-3 right-3 w-7 h-7 border-t-2 border-r-2 border-amber-500/60 rounded-tr-lg z-10" />
              <div className="absolute bottom-3 left-3 w-7 h-7 border-b-2 border-l-2 border-amber-500/60 rounded-bl-lg z-10" />
              <div className="absolute bottom-3 right-3 w-7 h-7 border-b-2 border-r-2 border-amber-500/60 rounded-br-lg z-10" />
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, type: "spring" }}
              className="relative rounded-3xl overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #0a0a0a 0%, #111 50%, #0a0a0a 100%)",
                border: "1.5px solid #f59e0b44",
                boxShadow: "0 0 40px #f59e0b15, inset 0 1px 0 #fbbf2415",
              }}
            >
              {/* Top bar */}
              <div className="h-1.5 w-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400" style={{ boxShadow: "0 0 12px #f59e0b" }} />

              {/* Hatching pattern */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{ backgroundImage: "repeating-linear-gradient(45deg, #f59e0b 0, #f59e0b 1px, transparent 0, transparent 50%)", backgroundSize: "14px 14px" }}
              />

              {/* Corner brackets */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-amber-500/40 rounded-tl-lg" />
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-amber-500/40 rounded-tr-lg" />

              <div className="relative z-10 p-6 md:p-8 space-y-4">
                <div>
                  <h2
                    className="text-3xl font-black leading-tight"
                    style={{
                      background: "linear-gradient(90deg, #ffffff, #fbbf24, #f87171)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    About Deepa Crackers
                  </h2>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-sm font-black text-amber-400">🪔 THIRUTHURAIPOONDI</span>
                    <span className="text-neutral-600">•</span>
                    <span className="text-sm font-black text-rose-400">Festive Brilliance &amp; Safety</span>
                  </div>
                  <div className="h-px w-full mt-3" style={{ background: "linear-gradient(to right, #f59e0b55, transparent)" }} />
                </div>

                <p className="text-xs md:text-sm leading-relaxed text-neutral-300">
                  Deepa Crackers is a premier supplier of high quality fireworks, ground chakkars, sparklers, and multi-color sky shots based in Thiruthuraipoondi. From traditional Indian festival celebrations to modern extravaganzas, our products bring sparkle to every family moment.
                </p>
                <p className="text-xs md:text-sm leading-relaxed text-neutral-300">
                  Our products represent 100% legal compliance, strict quality control, vivid colors, and dazzling festive fun.
                </p>
                <p className="text-xs md:text-sm leading-relaxed text-neutral-300">
                  With a strong distribution network across Thiruthuraipoondi and Tamil Nadu, we proudly serve wholesale and retail buyers with customized orders and unmatched value.
                </p>

                {/* Tag pills */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {[
                    { label: "Legal Certified", color: "#10b981" },
                    { label: "Quality Tested", color: "#f59e0b" },
                    { label: "Wholesale Available", color: "#06b6d4" },
                    { label: "Direct Transport", color: "#d946ef" },
                  ].map((t, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                      style={{ background: `${t.color}18`, border: `1px solid ${t.color}44`, color: t.color }}
                    >
                      {t.label}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </section>

          {/* ── DISCOUNT / BLAST SECTION ─────────── */}
          <section
            className="py-16 overflow-hidden rounded-3xl relative px-6 text-center"
            style={{
              background: "linear-gradient(135deg, #0d0800 0%, #0d0d0d 40%, #0d0800 100%)",
              border: "1.5px solid #f59e0b44",
              boxShadow: "0 0 60px #f59e0b15, 0 0 120px #ef444410",
            }}
          >
            {/* Multi-color animated top bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-amber-400 via-emerald-400 via-cyan-400 to-purple-500" style={{ boxShadow: "0 0 20px #f59e0b" }} />

            {/* Blast particles */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
              {blasts.map((blast) => (
                <div
                  key={blast.id}
                  className="absolute w-3.5 h-3.5 rounded-full animate-blast shadow-lg"
                  style={{
                    top: `${blast.top}%`,
                    left: `${blast.left}%`,
                    backgroundColor: blast.color,
                    boxShadow: `0 0 14px ${blast.color}`,
                  }}
                />
              ))}
            </div>

            {/* Hatching */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.03]"
              style={{ backgroundImage: "repeating-linear-gradient(45deg, #f59e0b 0, #f59e0b 1px, transparent 0, transparent 50%)", backgroundSize: "16px 16px" }}
            />

            {/* Corner brackets */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-amber-500/50 rounded-tl-lg" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-amber-500/50 rounded-tr-lg" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-amber-500/50 rounded-bl-lg" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-amber-500/50 rounded-br-lg" />

            <div className="relative z-10 max-w-3xl mx-auto space-y-5">
              <div className="flex items-center justify-center gap-3">
                <div className="h-px w-12 bg-amber-500/60" />
                <Zap className="w-6 h-6 text-amber-400 fill-amber-400/30" />
                <div className="h-px w-12 bg-amber-500/60" />
              </div>

              <h2
                className="text-2xl md:text-4xl font-black leading-tight"
                style={{
                  background: "linear-gradient(135deg, #fbbf24 0%, #f97316 40%, #06b6d4 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 30px #f59e0b55)",
                }}
              >
                🎆 Exclusive Festive Discounts &amp; Direct Transport!
              </h2>

              <p className="text-xs md:text-sm text-neutral-300 leading-relaxed">
                Celebrate Diwali with <strong className="font-black" style={{ color: "#fbbf24" }}>Deepa Crackers, Thiruthuraipoondi</strong>. Your one-stop shop for elite fireworks and festive delights.
              </p>
              <p className="text-xs text-neutral-400">
                Explore ground chakkars, flower pots, rockets, gift boxes, skyshots, sparklers, and more with simple online product enquiry and direct transport delivery.
              </p>

              {/* CTA row */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="tel:+918072897834"
                  className="px-6 py-3 rounded-2xl text-white font-black text-sm flex items-center gap-2 transition-all hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, #dc2626, #f59e0b)",
                    boxShadow: "0 0 30px #ef444440, 0 4px 20px #f59e0b30",
                    border: "1px solid #fbbf2440",
                  }}
                >
                  📞 +91 8072 897 834
                </a>
                <a
                  href="mailto:deepatraders1985@gmail.com"
                  className="px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 transition-all hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, #10b981, #06b6d4)",
                    color: "#020d08",
                    boxShadow: "0 0 30px #10b98140",
                    border: "1px solid #34d39940",
                  }}
                >
                  📧 deepatraders1985@gmail.com
                </a>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-cyan-400 to-amber-400" />
          </section>

          {/* ── MOTTO / VISION / MISSION ─────────── */}
          <section>
            {/* Section header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[3px] w-12 rounded-full bg-gradient-to-r from-transparent to-amber-500" />
              <h2
                className="text-2xl md:text-3xl font-black uppercase tracking-wide"
                style={{
                  background: "linear-gradient(90deg, #fbbf24, #f97316, #d946ef)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Our Values
              </h2>
              <div className="h-[3px] flex-1 rounded-full" style={{ background: "linear-gradient(to right, #f59e0b, #d946ef, transparent)" }} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {cards.map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40, rotate: i % 2 === 0 ? -1 : 1 }}
                  whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.12, type: "spring", stiffness: 120 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10, scale: 1.03 }}
                  className="group relative rounded-3xl overflow-hidden cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #080808 0%, #111 50%, #080808 100%)",
                    border: `1.5px solid ${card.glow}55`,
                    boxShadow: `0 0 0 1px ${card.glow}15, 0 8px 32px ${card.glow}18, inset 0 1px 0 ${card.accent}18`,
                  }}
                >
                  <div className={`h-1.5 w-full bg-gradient-to-r ${card.gradient}`} style={{ boxShadow: `0 0 14px ${card.glow}` }} />

                  {/* Number stamp */}
                  <div
                    className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center text-xs font-black"
                    style={{ background: `${card.glow}20`, border: `1px solid ${card.glow}44`, color: card.accent, fontFamily: "monospace" }}
                  >
                    {card.num}
                  </div>

                  {/* Diagonal pattern */}
                  <div
                    className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{
                      backgroundImage: `repeating-linear-gradient(45deg, ${card.glow} 0, ${card.glow} 1px, transparent 0, transparent 50%)`,
                      backgroundSize: "12px 12px",
                    }}
                  />

                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse at center, ${card.glow}15 0%, transparent 70%)` }}
                  />

                  <div className="relative z-10 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                        style={{
                          background: `linear-gradient(135deg, ${card.glow}30, ${card.glow}10)`,
                          border: `1.5px solid ${card.glow}55`,
                          boxShadow: `0 0 20px ${card.glow}40`,
                        }}
                      >
                        {card.icon}
                      </span>
                      <h3 className="text-lg font-black uppercase tracking-wide" style={{ color: card.accent }}>{card.title}</h3>
                    </div>

                    <div className="h-px mb-4" style={{ background: `linear-gradient(to right, ${card.glow}55, transparent)` }} />

                    <p className="text-xs text-neutral-400 leading-relaxed">{card.content}</p>

                    <div
                      className="mt-5 h-px w-0 group-hover:w-full transition-all duration-500"
                      style={{ background: `linear-gradient(to right, ${card.glow}, transparent)` }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* ── FOOTER ───────────────────────────── */}
        <footer
          className="relative mx-4 mb-8 mt-8 rounded-3xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #060606 0%, #0d0d0d 50%, #060606 100%)",
            border: "1px solid #ffffff10",
            boxShadow: "0 -4px 60px #00000066, inset 0 1px 0 #ffffff08",
          }}
        >
          <div className="h-1.5 w-full bg-gradient-to-r from-red-500 via-amber-400 via-emerald-400 via-cyan-400 to-purple-500" />
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

          <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <h2 className="text-2xl font-black mb-1 uppercase tracking-widest" style={{ color: "#fbbf24", textShadow: "0 0 20px #f59e0b55" }}>DEEPA CRACKERS</h2>
              <div className="h-px w-24 bg-gradient-to-r from-amber-500 to-transparent mb-3" />
              <p className="text-neutral-400 text-xs leading-relaxed mb-2">Spark joy, spread light—fireworks crafted for your family festival celebration.</p>
              <p className="text-neutral-300 text-xs font-black uppercase">📍 RS Road, THIRUTHURAIPOONDI</p>
              <div className="flex gap-2 mt-4">{["🔥", "🎆", "🪔", "✨"].map((e, i) => <span key={i} className="text-lg">{e}</span>)}</div>
            </div>

            <div>
              <h2 className="text-base font-black text-white mb-1 uppercase tracking-widest">Contact Us</h2>
              <div className="h-px w-16 bg-gradient-to-r from-cyan-500 to-transparent mb-3" />
              <p className="text-xs text-neutral-400">RS Road, Thiruthuraipoondi,</p>
              <p className="text-xs text-neutral-400">Tamil Nadu</p>
              <a href="tel:+918072897834" className="text-xs font-black block mt-2 hover:underline" style={{ color: "#fbbf24" }}>+91 8072 897 834</a>
              <a href="mailto:deepatraders1985@gmail.com" className="text-xs font-black block mt-1 text-neutral-300 hover:underline">deepatraders1985@gmail.com</a>
            </div>

            <div>
              <h2 className="text-base font-black text-white mb-1 uppercase tracking-widest">Quick Navigation</h2>
              <div className="h-px w-16 bg-gradient-to-r from-purple-500 to-transparent mb-3" />
              <ul className="space-y-1.5 text-xs text-neutral-400">
                {["/", "/status", "/safety-tips", "/about-us", "/contact-us"].map((href, i) => (
                  <li key={href}>
                    <a href={href} className="hover:text-amber-400 transition flex items-center gap-1.5 group">
                      <span className="w-1 h-1 rounded-full bg-amber-500/40 group-hover:bg-amber-400 transition" />
                      {["Home", "Track Order", "Safety Tips", "About Us", "Contact Us"][i]}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/[0.06] py-5 text-center text-xs text-neutral-600">
            © {new Date().getFullYear()} <span className="font-black" style={{ color: "#fbbf24" }}>Deepa Crackers</span> — THIRUTHURAIPOONDI. All rights reserved.
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes blast {
          0% { transform: scale(0.5); opacity: 1; }
          40% { transform: scale(1.6); opacity: 0.9; }
          100% { transform: scale(2.8); opacity: 0; }
        }
        .animate-blast { animation: blast 1.3s ease-out forwards; }
      `}</style>
    </div>
  );
}