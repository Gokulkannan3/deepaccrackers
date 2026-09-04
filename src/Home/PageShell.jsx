import React from "react";
import Navbar from "../Component/Navbar";
import BackgroundFireworks from "../Component/BackgroundFireworks";
import WhatsAppButton from "../Component/WhatsAppButton";

// ── Shared Page Layout Shell ──────────────────────────────────
// Provides: ambient orbs, dot grid, navbar, fireworks bg, footer, WhatsApp btn
// Usage: <PageShell>...</PageShell>

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Track Order", href: "/status" },
  { label: "Safety Tips", href: "/safety-tips" },
  { label: "About Us", href: "/about-us" },
  { label: "Contact Us", href: "/contact-us" },
];

function Footer() {
  return (
    <footer
      className="relative mx-3 sm:mx-4 mb-6 mt-8 rounded-3xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #050505 0%, #0c0c0c 50%, #050505 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 -4px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      {/* Rainbow top bar */}
      <div className="h-[3px] w-full bg-gradient-to-r from-red-500 via-amber-400 via-emerald-400 via-cyan-400 to-purple-500"
        style={{ boxShadow: "0 0 20px rgba(245,158,11,0.5)" }} />

      {/* Dot pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "22px 22px" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
              style={{ background: "linear-gradient(135deg, #f59e0b, #ef4444)", boxShadow: "0 0 14px rgba(245,158,11,0.5)" }}>
              🎆
            </div>
            <h2 className="text-lg font-black uppercase tracking-widest"
              style={{ color: "#fbbf24", textShadow: "0 0 20px rgba(245,158,11,0.4)" }}>
              DEEPA CRACKERS
            </h2>
          </div>
          <div className="h-px w-24 mb-3"
            style={{ background: "linear-gradient(to right, #f59e0b, transparent)" }} />
          <p className="text-neutral-400 text-[11px] leading-relaxed mb-1.5">
            Premium Sivakasi fireworks for every celebration.
          </p>
          <p className="text-neutral-300 text-[11px] font-black uppercase tracking-wider">
            📍 RS Road, Thiruthuraipoondi
          </p>
          <div className="flex gap-2 mt-4">
            {["🔥", "🎆", "🪔", "✨", "🎇"].map((e, i) => (
              <span key={i} className="text-base" style={{ animation: `floatUp ${1.5 + i * 0.3}s ${i * 0.15}s ease-in-out infinite` }}>
                {e}
              </span>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-sm font-black text-white mb-1 uppercase tracking-widest">Contact Us</h3>
          <div className="h-px w-16 mb-3" style={{ background: "linear-gradient(to right, #06b6d4, transparent)" }} />
          <p className="text-[11px] text-neutral-400">RS Road, Thiruthuraipoondi,</p>
          <p className="text-[11px] text-neutral-400">Tamil Nadu, India</p>
          <a href="tel:+918072897834" className="text-[11px] font-black block mt-2 hover:underline transition-colors"
            style={{ color: "#fbbf24" }}>
            📞 +91 8072 897 834
          </a>
          <a href="mailto:deepatraders1985@gmail.com"
            className="text-[11px] font-black block mt-1 text-neutral-300 hover:text-white transition-colors">
            ✉️ deepatraders1985@gmail.com
          </a>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-sm font-black text-white mb-1 uppercase tracking-widest">Quick Navigation</h3>
          <div className="h-px w-16 mb-3" style={{ background: "linear-gradient(to right, #a855f7, transparent)" }} />
          <ul className="space-y-1.5">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href}
                  className="text-[11px] text-neutral-400 hover:text-amber-400 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full transition-colors"
                    style={{ background: "rgba(245,158,11,0.3)" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#fbbf24"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(245,158,11,0.3)"}
                  />
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="border-t py-4 text-center text-[11px] text-neutral-600"
        style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        © {new Date().getFullYear()}{" "}
        <span className="font-black" style={{ color: "#fbbf24" }}>Deepa Crackers</span>
        {" "}— THIRUTHURAIPOONDI. All rights reserved.
      </div>
    </footer>
  );
}

export default function PageShell({ children, orbColor1 = "#f59e0b", orbColor2 = "#d946ef", orbColor3 = "#10b981" }) {
  return (
    <div className="min-h-screen bg-[#040404] text-white flex flex-col overflow-x-hidden relative selection:bg-amber-400 selection:text-slate-950">
      {/* Fireworks BG */}
      <BackgroundFireworks />

      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-[550px] h-[550px] rounded-full"
          style={{ background: `radial-gradient(circle, ${orbColor1}18 0%, transparent 70%)`, filter: "blur(70px)", animation: "orbFloat 7s ease-in-out infinite" }} />
        <div className="absolute bottom-0 -right-32 w-[450px] h-[450px] rounded-full"
          style={{ background: `radial-gradient(circle, ${orbColor2}15 0%, transparent 70%)`, filter: "blur(70px)", animation: "orbFloat 9s 1s ease-in-out infinite" }} />
        <div className="absolute top-1/2 left-1/3 w-[380px] h-[380px] rounded-full"
          style={{ background: `radial-gradient(circle, ${orbColor3}10 0%, transparent 70%)`, filter: "blur(70px)", animation: "orbFloat 11s 2s ease-in-out infinite" }} />
      </div>

      {/* Dot grid */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>

      <WhatsAppButton />
    </div>
  );
}
