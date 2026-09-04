import React from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Globe, Star } from "lucide-react";
import PageShell from "./PageShell";

/* ── Animated contact card ── */
function ContactCard({ card, index }) {
  const Icon = card.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: index * 0.12, type: "spring", stiffness: 120 }}
      viewport={{ once: true }}
      whileHover={{ y: -10, scale: 1.04 }}
      className="group relative rounded-3xl overflow-hidden text-center cursor-pointer"
      style={{
        background: "linear-gradient(135deg, #080808 0%, #111 50%, #080808 100%)",
        border: `1.5px solid ${card.glow}55`,
        boxShadow: `0 0 0 1px ${card.glow}12, 0 8px 32px ${card.glow}18, inset 0 1px 0 ${card.accent}15`,
      }}
    >
      {/* Top color bar */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${card.gradient}`} style={{ boxShadow: `0 0 16px ${card.glow}` }} />

      {/* Badge chip */}
      <div className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-sm"
        style={{ background: `${card.glow}20`, border: `1px solid ${card.glow}44` }}>
        {card.badge}
      </div>

      {/* Diagonal stripe */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `repeating-linear-gradient(45deg, ${card.glow} 0, ${card.glow} 1px, transparent 0, transparent 50%)`, backgroundSize: "12px 12px" }} />

      {/* Hover radial glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at center, ${card.glow}14 0%, transparent 70%)` }} />

      <div className="relative z-10 p-7 space-y-4">
        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto"
          style={{ background: `linear-gradient(135deg, ${card.glow}30, ${card.glow}10)`, border: `1.5px solid ${card.glow}55`, boxShadow: `0 0 26px ${card.glow}44` }}>
          <Icon className="h-7 w-7" style={{ color: card.accent }} />
        </div>

        <h2 className="text-base font-black uppercase tracking-widest" style={{ color: card.accent }}>{card.title}</h2>

        <div className="space-y-1.5">
          {card.content.map((item, idx) => (
            <div key={idx}>
              {typeof item === "string" ? (
                <p className="text-[12px] text-neutral-400">{item}</p>
              ) : (
                <a href={item.href}
                  className="text-[12px] font-black hover:underline block transition-colors"
                  style={{ color: card.accent }}
                  target={item.target}>
                  {item.text}
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Bottom sweep */}
        <div className="h-px w-0 group-hover:w-full transition-all duration-500 mx-auto"
          style={{ background: `linear-gradient(to right, transparent, ${card.glow}, transparent)` }} />
      </div>
    </motion.div>
  );
}

/* ── Quick action pill buttons ── */
function QuickAction({ icon, label, href, color, gradient }) {
  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.06, y: -3 }}
      whileTap={{ scale: 0.97 }}
      className="flex flex-col items-center gap-2 p-4 rounded-2xl cursor-pointer"
      style={{
        background: "linear-gradient(135deg, #0a0a0a, #111)",
        border: `1.5px solid ${color}44`,
        boxShadow: `0 0 20px ${color}15`,
      }}
    >
      <div className="text-2xl" style={{ filter: `drop-shadow(0 0 8px ${color}88)`, animation: "floatUp 2s ease-in-out infinite" }}>
        {icon}
      </div>
      <span className="text-[10px] font-black uppercase tracking-wider" style={{ color }}>{label}</span>
    </motion.a>
  );
}

const CONTACT_CARDS = [
  {
    icon: MapPin,
    title: "Store Location",
    gradient: "from-amber-400 to-orange-500",
    glow: "#f59e0b", accent: "#fbbf24",
    badge: "📍",
    content: [
      "Deepa Crackers",
      "RS Road, Thiruthuraipoondi",
      "Tamil Nadu — 614713",
      { text: "View on Google Maps →", href: "https://maps.google.com/?q=Thiruthuraipoondi+Tamil+Nadu", target: "_blank" },
    ],
  },
  {
    icon: Phone,
    title: "Phone Support",
    gradient: "from-emerald-400 to-teal-500",
    glow: "#10b981", accent: "#34d399",
    badge: "📞",
    content: [
      { text: "+91 8072 897 834", href: "tel:+918072897834" },
      "Mon–Sat: 9 AM – 8 PM",
      "Festival Season: Open All Days",
    ],
  },
  {
    icon: Mail,
    title: "Email Address",
    gradient: "from-fuchsia-400 to-rose-500",
    glow: "#d946ef", accent: "#e879f9",
    badge: "✉️",
    content: [
      { text: "deepatraders1985@gmail.com", href: "mailto:deepatraders1985@gmail.com" },
      "Reply within 24 hours",
    ],
  },
];

const QUICK_ACTIONS = [
  { icon: "📞", label: "Call Now", href: "tel:+918072897834", color: "#fbbf24" },
  { icon: "💬", label: "WhatsApp", href: "https://wa.me/918072897834", color: "#34d399" },
  { icon: "✉️", label: "Email", href: "mailto:deepatraders1985@gmail.com", color: "#e879f9" },
  { icon: "🗺️", label: "Directions", href: "https://maps.google.com/?q=Thiruthuraipoondi+Tamil+Nadu", color: "#22d3ee" },
];

export default function Contact() {
  return (
    <PageShell orbColor1="#f59e0b" orbColor2="#d946ef" orbColor3="#10b981">
      <div className="pt-24 pb-8 px-4 md:px-8 max-w-7xl mx-auto w-full space-y-14">

        {/* ── HERO ── */}
        <section className="text-center space-y-6 pt-6">
          <div className="flex items-center gap-3 max-w-xs mx-auto">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
          </div>

          {/* Badge pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { label: "✨ Thiruthuraipoondi", bg: "#f59e0b", text: "#fbbf24" },
              { label: "🏪 Fireworks Hub", bg: "#10b981", text: "#34d399" },
              { label: "📞 Get In Touch", bg: "#d946ef", text: "#e879f9" },
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
              style={{ background: "linear-gradient(135deg, #fbbf24 0%, #f97316 35%, #ef4444 70%, #f43f5e 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", filter: "drop-shadow(0 0 50px rgba(245,158,11,0.45))" }}>
              Contact
            </motion.h1>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.12 }}
              className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tight leading-none uppercase -mt-3 sm:-mt-4"
              style={{ background: "linear-gradient(135deg, #a78bfa 0%, #818cf8 40%, #38bdf8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", filter: "drop-shadow(0 0 50px rgba(139,92,246,0.45))" }}>
              Us
            </motion.h1>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none opacity-[0.03]" aria-hidden>
              <span className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tight leading-none uppercase" style={{ WebkitTextStroke: "2px white", color: "transparent" }}>CONTACT</span>
              <span className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tight leading-none uppercase -mt-3 sm:-mt-4" style={{ WebkitTextStroke: "2px white", color: "transparent" }}>US</span>
            </div>
          </div>

          <p className="text-[12px] md:text-sm text-neutral-400 max-w-xl mx-auto">
            Get in touch with <strong className="font-black" style={{ color: "#fbbf24" }}>Deepa Crackers, Thiruthuraipoondi</strong> for wholesale and retail enquiries.
          </p>

          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-500 opacity-60" />
            <div className="flex gap-1.5">
              {["#ef4444", "#f59e0b", "#10b981", "#06b6d4", "#d946ef"].map((c, i) => (
                <div key={i} className="w-2 h-2 rounded-full" style={{ background: c, boxShadow: `0 0 8px ${c}` }} />
              ))}
            </div>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-500 opacity-60" />
          </div>
        </section>

        {/* ── QUICK ACTION BUTTONS ── */}
        <div className="grid grid-cols-4 sm:grid-cols-4 gap-3 max-w-md mx-auto">
          {QUICK_ACTIONS.map((qa, i) => (
            <motion.a key={i} href={qa.href} target={qa.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              whileHover={{ scale: 1.06, y: -3 }} whileTap={{ scale: 0.97 }}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl cursor-pointer"
              style={{ background: "linear-gradient(135deg, #0a0a0a, #111)", border: `1.5px solid ${qa.color}44`, boxShadow: `0 0 18px ${qa.color}15` }}>
              <div className="text-2xl" style={{ filter: `drop-shadow(0 0 8px ${qa.color}88)` }}>{qa.icon}</div>
              <span className="text-[9px] font-black uppercase tracking-wider" style={{ color: qa.color }}>{qa.label}</span>
            </motion.a>
          ))}
        </div>

        {/* ── CONTACT CARDS ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {CONTACT_CARDS.map((card, i) => <ContactCard key={i} card={card} index={i} />)}
        </div>

        {/* ── MAP SECTION ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden"
          style={{ background: "linear-gradient(135deg, #080808, #111, #080808)", border: "1.5px solid rgba(255,255,255,0.08)", boxShadow: "0 0 80px rgba(0,0,0,0.6)" }}
        >
          <div className="h-[3px] w-full bg-gradient-to-r from-amber-400 via-rose-500 via-cyan-400 to-purple-500" />

          {/* Hatch */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
            style={{ backgroundImage: "repeating-linear-gradient(45deg, #ffffff 0, #ffffff 1px, transparent 0, transparent 50%)", backgroundSize: "14px 14px" }} />

          {/* Corner brackets */}
          {[["top-4 left-4 border-t-2 border-l-2 rounded-tl-lg"], ["top-4 right-4 border-t-2 border-r-2 rounded-tr-lg"],
          ["bottom-4 left-4 border-b-2 border-l-2 rounded-bl-lg"], ["bottom-4 right-4 border-b-2 border-r-2 rounded-br-lg"]].map((cls, i) => (
            <div key={i} className={`absolute w-7 h-7 border-amber-500/50 z-10 ${cls[0]}`} />
          ))}

          <div className="relative z-10 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.4)", boxShadow: "0 0 18px rgba(245,158,11,0.25)" }}>
                <Globe className="h-5 w-5" style={{ color: "#fbbf24" }} />
              </div>
              <div>
                <h2 className="text-base font-black uppercase tracking-widest text-white">Find Deepa Crackers</h2>
                <p className="text-[10px] text-neutral-500 uppercase tracking-widest">RS Road, Thiruthuraipoondi, Tamil Nadu</p>
              </div>
              <div className="ml-auto hidden sm:flex gap-1.5">
                {["#ef4444", "#f59e0b", "#10b981"].map((c, i) => (
                  <div key={i} className="w-2 h-2 rounded-full" style={{ background: c, boxShadow: `0 0 6px ${c}` }} />
                ))}
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)", boxShadow: "inset 0 0 40px rgba(0,0,0,0.5)" }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15694.0254217144!2d79.638421!3d10.528431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a554ff015555555%3A0x123456789abcdef!2sThiruthuraipoondi%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%" height="360" style={{ border: 0, display: "block" }}
                allowFullScreen loading="lazy"
                title="Deepa Crackers Location"
              />
            </div>
          </div>
          <div className="h-[3px] w-full bg-gradient-to-r from-purple-500 via-cyan-400 to-amber-400" />
        </motion.div>

        {/* ── HOURS + NOTE ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            {
              title: "🕐 Store Hours", color: "#fbbf24",
              rows: [
                ["Monday – Saturday", "9:00 AM – 8:00 PM"],
                ["Sunday", "10:00 AM – 6:00 PM"],
                ["Diwali Season", "Open ALL Day"],
                ["Other Festivals", "Extended Hours"],
              ],
            },
            {
              title: "📋 Order Note", color: "#34d399",
              rows: [
                ["Minimum Order", "No minimum"],
                ["Wholesale Enquiry", "Call / WhatsApp us"],
                ["Transport", "All over Tamil Nadu"],
                ["Payment", "Advance on bulk orders"],
              ],
            },
          ].map((section, si) => (
            <motion.div key={si}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: si * 0.1, duration: 0.55 }} viewport={{ once: true }}
              className="rounded-2xl overflow-hidden"
              style={{ background: "linear-gradient(135deg, #0a0a0a, #111)", border: `1.5px solid ${section.color}33`, boxShadow: `0 0 30px ${section.color}0f` }}>
              <div className="h-1 w-full" style={{ background: section.color, boxShadow: `0 0 10px ${section.color}` }} />
              <div className="p-5 space-y-3">
                <h3 className="text-sm font-black uppercase tracking-wider" style={{ color: section.color }}>{section.title}</h3>
                <div className="space-y-2">
                  {section.rows.map(([k, v], ri) => (
                    <div key={ri} className="flex justify-between items-center py-1.5 border-b border-white/[0.04] last:border-0">
                      <span className="text-[11px] text-neutral-400">{k}</span>
                      <span className="text-[11px] font-black text-white">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes floatUp {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-7px); }
        }
        @keyframes orbFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-18px) scale(1.03); }
        }
      `}</style>
    </PageShell>
  );
}
