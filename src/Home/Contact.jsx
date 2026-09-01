import React from 'react';
import Navbar from '../Component/Navbar';
import BackgroundFireworks from '../Component/BackgroundFireworks';
import { MapPin, Phone, Mail, Globe, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Contact() {
  const contactCards = [
    {
      icon: MapPin,
      title: "Store Location",
      gradient: "from-amber-400 to-orange-500",
      glow: "#f59e0b",
      accent: "#fbbf24",
      content: ["Deepa Crackers", "RS Road, Thiruthuraipoondi", "Tamil Nadu"],
      badge: "📍",
    },
    {
      icon: Phone,
      title: "Phone Support",
      gradient: "from-emerald-400 to-teal-500",
      glow: "#10b981",
      accent: "#34d399",
      content: [{ text: "+91 8072 897 834", href: "tel:+918072897834" }],
      badge: "📞",
    },
    {
      icon: Mail,
      title: "Email Address",
      gradient: "from-fuchsia-400 to-rose-500",
      glow: "#d946ef",
      accent: "#e879f9",
      content: [{ text: "deepatraders1985@gmail.com", href: "mailto:deepatraders1985@gmail.com" }],
      badge: "✉️",
    },
  ];

  return (
    <div className="min-h-screen bg-[#040404] text-white flex flex-col selection:bg-amber-400 selection:text-slate-950 relative overflow-x-hidden">
      <BackgroundFireworks />

      {/* Ambient neon orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full" style={{ background: "radial-gradient(circle, #f59e0b18 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute -bottom-20 -right-40 w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle, #d946ef18 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute top-1/3 right-1/4 w-[350px] h-[350px] rounded-full" style={{ background: "radial-gradient(circle, #10b98114 0%, transparent 70%)", filter: "blur(60px)" }} />
      </div>

      {/* Dot-grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.05]"
        style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "28px 28px" }}
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-grow pt-28 pb-16 px-4 md:px-8 max-w-7xl mx-auto w-full space-y-12">

          {/* ── HERO ───────────────────────────────────── */}
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
                { label: "✨ Thiruthuraipoondi", bg: "#f59e0b", text: "#fbbf24" },
                { label: "🏪 Fireworks Hub", bg: "#10b981", text: "#34d399" },
                { label: "📞 Get In Touch", bg: "#d946ef", text: "#e879f9" },
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
                Contact
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
                <span className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-none uppercase" style={{ WebkitTextStroke: "2px white", color: "transparent" }}>CONTACT</span>
                <span className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-none uppercase -mt-2 sm:-mt-3" style={{ WebkitTextStroke: "2px white", color: "transparent" }}>US</span>
              </div>
            </div>

            <p className="text-xs md:text-sm text-neutral-400 max-w-xl mx-auto">
              Get in touch with <strong className="font-black" style={{ color: "#fbbf24" }}>Deepa Crackers, Thiruthuraipoondi</strong> for wholesale and retail enquiries.
            </p>

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

          {/* ── CONTACT CARDS ──────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {contactCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40, rotate: index % 2 === 0 ? -1.5 : 1.5 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ duration: 0.6, delay: index * 0.12, type: "spring", stiffness: 120 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.04 }}
                className="group relative rounded-3xl overflow-hidden text-center cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, #080808 0%, #111 50%, #080808 100%)`,
                  border: `1.5px solid ${card.glow}55`,
                  boxShadow: `0 0 0 1px ${card.glow}15, 0 8px 32px ${card.glow}18, inset 0 1px 0 ${card.accent}18`,
                }}
              >
                {/* Colored top bar */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${card.gradient}`} style={{ boxShadow: `0 0 14px ${card.glow}` }} />

                {/* Badge chip */}
                <div
                  className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-sm"
                  style={{ background: `${card.glow}20`, border: `1px solid ${card.glow}44` }}
                >
                  {card.badge}
                </div>

                {/* Diagonal stripe pattern */}
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

                <div className="relative z-10 p-7 space-y-4">
                  {/* Icon */}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto"
                    style={{
                      background: `linear-gradient(135deg, ${card.glow}30, ${card.glow}10)`,
                      border: `1.5px solid ${card.glow}55`,
                      boxShadow: `0 0 24px ${card.glow}44`,
                    }}
                  >
                    <card.icon className="h-7 w-7" style={{ color: card.accent }} />
                  </div>

                  <h2 className="text-base font-black uppercase tracking-widest" style={{ color: card.accent }}>{card.title}</h2>

                  <div className="space-y-1">
                    {card.content.map((item, idx) => (
                      <div key={idx}>
                        {typeof item === "string" ? (
                          <p className="text-xs text-neutral-400">{item}</p>
                        ) : (
                          <a href={item.href} className="text-xs font-black hover:underline block" style={{ color: card.accent }}>
                            {item.text}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Bottom sweep line */}
                  <div
                    className="h-px w-0 group-hover:w-full transition-all duration-500 mx-auto"
                    style={{ background: `linear-gradient(to right, transparent, ${card.glow}, transparent)` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* ── MAP BOX ─────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #080808, #111, #080808)",
              border: "1.5px solid #ffffff12",
              boxShadow: "0 0 60px #00000066, inset 0 1px 0 #ffffff08",
            }}
          >
            {/* Multi-color top bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-rose-500 via-cyan-400 to-purple-500" />
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/08 to-transparent" />

            {/* Hatching pattern */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.025]"
              style={{ backgroundImage: "repeating-linear-gradient(45deg, #ffffff 0, #ffffff 1px, transparent 0, transparent 50%)", backgroundSize: "14px 14px" }}
            />

            {/* Corner brackets */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-amber-500/50 rounded-tl-lg" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-amber-500/50 rounded-tr-lg" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-amber-500/50 rounded-bl-lg" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-amber-500/50 rounded-br-lg" />

            <div className="relative z-10 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "#f59e0b20", border: "1px solid #f59e0b55", boxShadow: "0 0 16px #f59e0b30" }}
                >
                  <Globe className="h-5 w-5" style={{ color: "#fbbf24" }} />
                </div>
                <div>
                  <h2 className="text-base font-black uppercase tracking-widest text-white">Find Deepa Crackers</h2>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Store Location Map</p>
                </div>
                <div className="ml-auto hidden sm:flex gap-1.5">
                  {["#ef4444", "#f59e0b", "#10b981"].map((c, i) => (
                    <div key={i} className="w-2 h-2 rounded-full" style={{ background: c, boxShadow: `0 0 6px ${c}` }} />
                  ))}
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #ffffff10", boxShadow: "inset 0 0 40px #00000055" }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15694.0254217144!2d79.638421!3d10.528431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a554ff015555555%3A0x123456789abcdef!2sThiruthuraipoondi%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="350"
                  style={{ border: 0, display: "block" }}
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>

            {/* Bottom bar */}
            <div className="h-1 w-full bg-gradient-to-r from-purple-500 via-cyan-400 to-amber-400" />
          </motion.div>
        </main>

        {/* ── FOOTER ───────────────────────────────────── */}
        <footer
          className="relative mx-4 mb-8 mt-8 rounded-3xl overflow-hidden"
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

          <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <h2 className="text-2xl font-black mb-1 uppercase tracking-widest" style={{ color: "#fbbf24", textShadow: "0 0 20px #f59e0b55" }}>
                DEEPA CRACKERS
              </h2>
              <div className="h-px w-24 bg-gradient-to-r from-amber-500 to-transparent mb-3" />
              <p className="text-neutral-400 text-xs leading-relaxed mb-2">
                Spark joy, spread light—fireworks crafted for your family festival celebration.
              </p>
              <p className="text-neutral-300 text-xs font-black uppercase">📍 RS Road, THIRUTHURAIPOONDI</p>
              <div className="flex gap-2 mt-4">
                {["🔥", "🎆", "🪔", "✨"].map((e, i) => <span key={i} className="text-lg">{e}</span>)}
              </div>
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
