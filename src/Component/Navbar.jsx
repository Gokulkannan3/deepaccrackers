import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, Sparkles, MapPin } from "lucide-react";
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
    <nav className="fixed top-3 left-3 right-3 z-50 rounded-2xl px-4 md:px-6 py-3 mx-auto max-w-7xl bg-[#FAF6EE] border-2 border-dashed border-slate-800 shadow-[4px_4px_0px_0px_rgba(30,41,59,0.9)]">
      <div className="flex items-center justify-between">
        {/* Brand Logo & Thiruthuraipoondi Pencil Badge */}
        <div 
          onClick={() => { navigate("/"); window.scrollTo(0, 0); }}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-200 border-2 border-slate-900 flex items-center justify-center shadow-[2px_2px_0px_0px_#0f172a]">
            <Sparkles className="h-5 w-5 text-slate-900 group-hover:rotate-12 transition-transform" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg md:text-xl font-black tracking-tight text-slate-900 font-mono">
                DEEPA CRACKERS
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold uppercase bg-amber-100 text-slate-900 border border-slate-800 rounded shadow-[1px_1px_0px_0px_#0f172a]">
                ✏️ Thiruthuraipoondi
              </span>
            </div>
            <p className="text-[10px] font-semibold text-slate-600 tracking-wider uppercase">
              Premium Fireworks • Handcrafted Selection
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-2">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <button
                key={link.name}
                onClick={() => { navigate(link.path); window.scrollTo(0, 0); }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-amber-300 text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]"
                    : "text-slate-700 hover:text-slate-900 hover:bg-amber-100 border border-transparent"
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
          className="md:hidden p-2 rounded-xl bg-amber-100 border-2 border-slate-900 text-slate-900 shadow-[2px_2px_0px_0px_#0f172a]"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden mt-3 pt-3 border-t-2 border-dashed border-slate-800 flex flex-col gap-2"
        >
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <button
                key={link.name}
                onClick={() => { navigate(link.path); window.scrollTo(0, 0); setMenuOpen(false); }}
                className={`w-full py-2 px-3 text-center text-xs font-bold rounded-xl transition-all ${
                  isActive
                    ? "bg-amber-300 text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]"
                    : "text-slate-800 hover:bg-amber-100"
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