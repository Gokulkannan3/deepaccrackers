import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, Sparkles } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about-us" },
    { name: "Track Order", path: "/status" },
    { name: "Safety Tips", path: "/safety-tips" },
    { name: "Contact Us", path: "/contact-us" },
  ];

  return (
    <nav className="fixed top-3 left-3 right-3 z-50 rounded-2xl px-4 md:px-6 py-3 mx-auto max-w-7xl bg-black/95 backdrop-blur-xl border border-white/15 shadow-[0_10px_35px_rgba(0,0,0,0.9)] overflow-hidden">
      {/* Top Red & White Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-red-700 via-red-500 to-red-700" />

      <div className="flex items-center justify-between">
        {/* Brand Logo & Location Badge in Pure Red, White & Black */}
        <div
          onClick={() => { navigate("/"); window.scrollTo(0, 0); }}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-red-950/70 border border-red-600/60 p-[1px] shadow-lg shadow-red-600/30 flex items-center justify-center group-hover:bg-red-900/80 transition-colors">
            <Sparkles className="h-5 w-5 text-white group-hover:rotate-12 transition-transform" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-red-950/80 border border-red-600/50 text-lg md:text-xl font-black tracking-tight text-white shadow-sm group-hover:border-red-500 transition-all">
                DEEPA CRACKERS
              </span>
            </div>
            <p className="text-[10px] font-semibold text-neutral-400 tracking-wider uppercase flex items-center gap-1.5 mt-0.5">
              <span></span> • <span className="text-red-400 font-bold">Since 1985</span>
            </p>
          </div>
        </div>

        {/* Navigation Links - Pure Red, White & Black */}
        <div className="hidden md:flex items-center gap-2">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <button
                key={link.name}
                onClick={() => { navigate(link.path); window.scrollTo(0, 0); }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${isActive
                  ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-600/40 border border-red-500 font-black scale-102"
                  : "text-neutral-300 hover:text-white hover:bg-neutral-900 border border-transparent hover:border-white/15"
                  }`}
              >
                {link.name}
              </button>
            );
          })}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-xl bg-neutral-950 border border-white/20 text-white shadow-md hover:bg-neutral-900"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden mt-3 pt-3 border-t border-white/10 flex flex-col gap-2"
        >
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <button
                key={link.name}
                onClick={() => { navigate(link.path); window.scrollTo(0, 0); setMenuOpen(false); }}
                className={`w-full py-2.5 px-3 text-center text-xs font-bold rounded-xl transition-all cursor-pointer ${isActive
                  ? "bg-gradient-to-r from-red-600 to-red-700 text-white font-black shadow-md shadow-red-600/40 border border-red-500"
                  : "text-neutral-300 hover:bg-neutral-900 hover:text-white"
                  }`}
              >
                {link.name}
              </button>
            );
          })}
        </motion.div>
      )}
    </nav>
  );
}