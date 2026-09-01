import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles, Phone, Home, ShieldCheck, Truck } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

// Multi-Color Nav Items with Distinct Jewel-Toned Active Accents & Crisp SVG Icons
const NAV_LINKS = [
  {
    name: "Home",
    path: "/",
    color: "#f59e0b",
    accent: "#fbbf24",
    grad: "linear-gradient(135deg, #f59e0b, #ea580c)",
    shadow: "rgba(245, 158, 11, 0.45)",
    icon: Home,
  },
  {
    name: "About Us",
    path: "/about-us",
    color: "#d946ef",
    accent: "#f472b6",
    grad: "linear-gradient(135deg, #d946ef, #ec4899)",
    shadow: "rgba(217, 70, 239, 0.45)",
    icon: Sparkles,
  },
  {
    name: "Track Order",
    path: "/status",
    color: "#06b6d4",
    accent: "#22d3ee",
    grad: "linear-gradient(135deg, #06b6d4, #0284c7)",
    shadow: "rgba(6, 182, 212, 0.45)",
    icon: Truck,
  },
  {
    name: "Safety Tips",
    path: "/safety-tips",
    color: "#10b981",
    accent: "#34d399",
    grad: "linear-gradient(135deg, #10b981, #059669)",
    shadow: "rgba(16, 185, 129, 0.45)",
    icon: ShieldCheck,
  },
  {
    name: "Contact Us",
    path: "/contact-us",
    color: "#f43f5e",
    accent: "#fb7185",
    grad: "linear-gradient(135deg, #f43f5e, #e11d48)",
    shadow: "rgba(244, 63, 94, 0.45)",
    icon: Phone,
  },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <nav
      className="fixed top-3 left-3 right-3 z-50 rounded-2xl md:rounded-3xl px-4 md:px-6 py-2.5 mx-auto max-w-7xl backdrop-blur-2xl transition-all duration-300"
      style={{
        background: "linear-gradient(135deg, rgba(8, 8, 10, 0.96) 0%, rgba(16, 16, 22, 0.96) 100%)",
        border: "1.5px solid rgba(255, 255, 255, 0.12)",
        boxShadow: "0 15px 45px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.1)",
      }}
    >
      {/* 5-Stop Vibrant Rainbow Glow Top Line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-red-500 via-amber-400 via-emerald-400 via-cyan-400 to-purple-500"
        style={{ boxShadow: "0 0 16px rgba(245, 158, 11, 0.6)" }}
      />

      {/* Subtle Corner Brackets */}
      <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-amber-500/40 rounded-tl pointer-events-none" />
      <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-cyan-500/40 rounded-tr pointer-events-none" />

      {/* 3-Column Perfectly Centered Grid Layout */}
      <div className="flex items-center justify-between w-full gap-2">
        {/* Left Side: Brand Logo (flex-1 aligns to start) */}
        <div className="flex-1 flex items-center justify-start">
          <div
            onClick={() => handleNavigate("/")}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none"
          >
            {/* Animated Jewel-Tone Firework Icon */}
            <div
              className="w-10 h-10 rounded-2xl p-[1px] shadow-lg flex items-center justify-center transition-all duration-300 group-hover:scale-105 shrink-0"
              style={{
                background: "linear-gradient(135deg, #f59e0b 0%, #ef4444 50%, #d946ef 100%)",
                boxShadow: "0 0 16px rgba(245, 158, 11, 0.4)",
              }}
            >
              <div className="w-full h-full rounded-[14px] bg-[#09090c] flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-amber-300 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <span className="text-base sm:text-lg md:text-xl font-black tracking-tight text-white group-hover:text-amber-300 transition-colors leading-none">
                DEEPA CRACKERS
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold text-amber-400 tracking-widest uppercase mt-1 leading-none">
                Since 1985
              </span>
            </div>
          </div>
        </div>

        {/* Center: Desktop Navigation Links — Perfectly Centered in Navbar */}
        <div className="hidden md:flex items-center justify-center gap-1.5 lg:gap-2 shrink-0">
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;
            return (
              <button
                key={link.name}
                onClick={() => handleNavigate(link.path)}
                className={`h-9 px-3.5 rounded-2xl text-xs font-black transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${isActive
                  ? "scale-105"
                  : "text-neutral-300 hover:text-white hover:bg-white/[0.06]"
                  }`}
                style={
                  isActive
                    ? {
                      background: link.grad,
                      color: "#030712",
                      boxShadow: `0 0 18px ${link.shadow}`,
                      border: `1px solid ${link.accent}`,
                    }
                    : { border: "1px solid transparent" }
                }
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? "text-slate-950 stroke-[2.5]" : ""}`} style={{ color: isActive ? "#030712" : link.accent }} />
                <span>{link.name}</span>
                {isActive && (
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-black ml-0.5"
                    style={{ boxShadow: `0 0 6px ${link.accent}` }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Side: CTA Phone Call & Mobile Hamburger (flex-1 balances left) */}
        <div className="flex-1 flex items-center justify-end gap-2">
          {/* Quick Support Call Button */}
          <a
            href="tel:+918072897834"
            className="hidden sm:flex items-center gap-2 h-9 px-3.5 rounded-2xl text-xs font-black transition-all active:scale-95 cursor-pointer hover:scale-105"
            style={{
              background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)",
              border: "1.5px solid rgba(16, 185, 129, 0.5)",
              color: "#34d399",
              boxShadow: "0 0 15px rgba(16, 185, 129, 0.2)",
            }}
          >
            <Phone className="h-3.5 w-3.5 animate-bounce" />
            <span className="font-mono text-[11px]">+91 8072 897 834</span>
          </a>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-2xl border transition-all active:scale-95 cursor-pointer"
            style={{
              background: menuOpen ? "rgba(239, 68, 68, 0.2)" : "rgba(255, 255, 255, 0.05)",
              borderColor: menuOpen ? "rgba(239, 68, 68, 0.5)" : "rgba(255, 255, 255, 0.15)",
              color: menuOpen ? "#f87171" : "#ffffff",
              boxShadow: menuOpen ? "0 0 15px rgba(239, 68, 68, 0.3)" : "none",
            }}
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer with Smooth Animation */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden pt-3 mt-3 border-t border-white/10 space-y-2"
          >
            <div className="grid grid-cols-1 gap-1.5">
              {NAV_LINKS.map((link) => {
                const isActive = location.pathname === link.path;
                const Icon = link.icon;
                return (
                  <button
                    key={link.name}
                    onClick={() => handleNavigate(link.path)}
                    className="w-full py-3 px-4 text-left text-xs font-black rounded-2xl transition-all cursor-pointer flex items-center justify-between"
                    style={
                      isActive
                        ? {
                            background: link.grad,
                            color: "#030712",
                            boxShadow: `0 0 18px ${link.shadow}`,
                            border: `1px solid ${link.accent}`,
                          }
                        : {
                            background: "rgba(255, 255, 255, 0.03)",
                            border: "1px solid rgba(255, 255, 255, 0.08)",
                            color: "#e5e7eb",
                          }
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4" style={{ color: isActive ? "#030712" : link.accent }} />
                      <span>{link.name}</span>
                    </div>
                    {isActive ? (
                      <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-full bg-black text-white">
                        ACTIVE
                      </span>
                    ) : (
                      <span className="text-neutral-500">→</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Direct Call & Genuine Sivakasi Assurance in Mobile Drawer */}
            <div className="pt-2 flex flex-col gap-2">
              <a
                href="tel:+918072897834"
                className="w-full py-2.5 px-4 rounded-2xl text-xs font-black flex items-center justify-center gap-2 text-emerald-300"
                style={{
                  background: "rgba(16, 185, 129, 0.12)",
                  border: "1px solid rgba(16, 185, 129, 0.35)",
                }}
              >
                <Phone className="h-4 w-4" />
                <span>Call Us: +91 8072 897 834</span>
              </a>

              <div className="text-center py-1">
                <span className="text-[10px] font-bold text-amber-300/80">
                  🪔 100% Genuine Sivakasi Crackers • Thiruthuraipoondi
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
