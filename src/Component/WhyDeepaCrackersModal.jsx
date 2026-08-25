import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Sparkles, 
  X, 
  AlertTriangle, 
  CheckCircle2,
  Truck,
  HeartHandshake
} from "lucide-react";

const DURATION_MS = 14000; // 14 seconds auto-dismiss

export default function WhyDeepaCrackersModal({ onClose }) {
  const [progress, setProgress] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(14);
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const showT = setTimeout(() => setVisible(true), 30);

    const start = Date.now();
    const tick = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / DURATION_MS) * 100, 100);
      setProgress(pct);
      setSecondsLeft(Math.max(0, Math.ceil((DURATION_MS - elapsed) / 1000)));

      if (pct >= 100) {
        clearInterval(tick);
        setExiting(true);
        setTimeout(() => onClose && onClose(), 400);
      }
    }, 40);

    return () => {
      clearTimeout(showT);
      clearInterval(tick);
    };
  }, [onClose]);

  const handleClose = () => {
    setExiting(true);
    setTimeout(() => onClose && onClose(), 300);
  };

  return (
    <div
      className={`fixed inset-0 z-[100000] bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 transition-all duration-300 ${
        visible && !exiting ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
    >
      {/* Modal Main Frame */}
      <div className="w-full max-w-5xl max-h-[94vh] bg-[#0a0a0a] border border-neutral-800 rounded-3xl flex flex-col overflow-hidden shadow-2xl relative text-white">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-black/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center font-black text-white text-base shadow-md shadow-red-600/30">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-xl font-black tracking-tight text-white">
                  WHY CHOOSE DEEPA CRACKERS?
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-red-950 border border-red-800 text-[10px] font-bold text-red-200 uppercase">
                  Real Curved Highway Drive Animation
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-medium mt-0.5">
                Watch the delivery truck drive: 4 Middlemen toll stops vs. Direct Deepa Express Highway
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Both Animated Curves Side-by-Side */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* ── LEFT: Traditional Multi-Middlemen Winding Road (RED) ── */}
            <div className="bg-[#140606] border-2 border-red-600/70 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-[0_10px_30px_rgba(220,38,38,0.15)] relative overflow-hidden">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-red-950 border border-red-700/80 text-xs font-black text-red-400 flex items-center gap-1.5 uppercase">
                    <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                    OTHER SHOPS (WINDING & EXPENSIVE)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-red-950/80 text-red-300 text-[10px] font-bold">
                    4 Toll Hikes
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-black text-red-200">
                  Traditional Retail Supply Chain
                </h4>
              </div>

              {/* SVG Real Winding Road with Driving Lorry */}
              <div className="relative w-full aspect-[4/3] bg-black/60 rounded-xl border border-red-900/40 p-2 overflow-hidden flex items-center justify-center">
                <svg viewBox="0 0 380 280" className="w-full h-full">
                  <defs>
                    {/* Winding road path */}
                    <path
                      id="redRoadPath"
                      d="M 40,40 C 280,30 330,100 200,120 C 70,140 70,210 200,225 C 290,235 330,245 330,250"
                      fill="none"
                    />
                  </defs>

                  {/* Road Base Asphalt */}
                  <use href="#redRoadPath" stroke="#220808" strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" />
                  {/* Road Borders */}
                  <use href="#redRoadPath" stroke="#7f1d1d" strokeWidth="28" strokeDasharray="none" fill="none" opacity="0.4" />
                  <use href="#redRoadPath" stroke="#220808" strokeWidth="22" fill="none" />
                  {/* Center dashed line */}
                  <use href="#redRoadPath" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,6" opacity="0.8" fill="none" />

                  {/* Checkpoint 1: Factory */}
                  <g transform="translate(40, 40)">
                    <circle r="14" fill="#450a0a" stroke="#ef4444" strokeWidth="2" />
                    <text textAnchor="middle" dy="4" fontSize="11">🏭</text>
                    <text x="20" y="4" fontSize="10" fontWeight="bold" fill="#fca5a5">Factory (Base Rate)</text>
                  </g>

                  {/* Checkpoint 2: Agent Toll Stop */}
                  <g transform="translate(265, 80)">
                    <circle r="12" fill="#7f1d1d" stroke="#f87171" strokeWidth="1.5" />
                    <text textAnchor="middle" dy="4" fontSize="10">👨‍💼</text>
                    <rect x="16" y="-12" width="76" height="18" rx="4" fill="#450a0a" stroke="#991b1b" />
                    <text x="22" y="1" fontSize="8.5" fontWeight="bold" fill="#fca5a5">+20% Agent Cut</text>
                  </g>

                  {/* Checkpoint 3: Distributor Warehouse */}
                  <g transform="translate(100, 155)">
                    <circle r="12" fill="#7f1d1d" stroke="#f87171" strokeWidth="1.5" />
                    <text textAnchor="middle" dy="4" fontSize="10">🏢</text>
                    <rect x="-88" y="-12" width="80" height="18" rx="4" fill="#450a0a" stroke="#991b1b" />
                    <text x="-82" y="1" fontSize="8.5" fontWeight="bold" fill="#fca5a5">+25% Distributor</text>
                  </g>

                  {/* Checkpoint 4: Retail Shop */}
                  <g transform="translate(240, 225)">
                    <circle r="12" fill="#7f1d1d" stroke="#f87171" strokeWidth="1.5" />
                    <text textAnchor="middle" dy="4" fontSize="10">🏪</text>
                    <rect x="16" y="-12" width="76" height="18" rx="4" fill="#450a0a" stroke="#991b1b" />
                    <text x="22" y="1" fontSize="8.5" fontWeight="bold" fill="#fca5a5">+35% Shop Cut</text>
                  </g>

                  {/* Checkpoint 5: Customer Inflated */}
                  <g transform="translate(330, 250)">
                    <circle r="15" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
                    <text textAnchor="middle" dy="4" fontSize="12">💸</text>
                  </g>

                  {/* Driving Red Lorry steering along the winding road */}
                  <g>
                    <animateMotion
                      repeatCount="indefinite"
                      dur="6.5s"
                      rotate="auto"
                    >
                      <mpath href="#redRoadPath" />
                    </animateMotion>
                    
                    {/* Truck Vehicle Vector Body */}
                    <rect x="-14" y="-8" width="22" height="16" rx="3" fill="#dc2626" stroke="#ffffff" strokeWidth="1" />
                    <rect x="8" y="-6" width="9" height="12" rx="2" fill="#991b1b" />
                    {/* Wheels */}
                    <circle cx="-8" cy="-8" r="2.5" fill="#000000" />
                    <circle cx="6" cy="-8" r="2.5" fill="#000000" />
                    <circle cx="-8" cy="8" r="2.5" fill="#000000" />
                    <circle cx="6" cy="8" r="2.5" fill="#000000" />
                    {/* Headlights */}
                    <circle cx="17" cy="-3" r="1.5" fill="#fef08a" />
                    <circle cx="17" cy="3" r="1.5" fill="#fef08a" />
                  </g>
                </svg>
              </div>

              {/* Status Footer */}
              <div className="p-2.5 rounded-xl bg-red-950 border border-red-700/60 flex items-center justify-between text-xs font-black text-red-300">
                <span>Slow Delivery • Multiple Middlemen</span>
                <span className="px-2 py-0.5 rounded bg-red-600 text-white font-black text-[11px]">
                  FINAL: +400% HIGH ❌
                </span>
              </div>
            </div>

            {/* ── RIGHT: Deepa Direct Express Curved Highway (GREEN) ── */}
            <div className="bg-[#051408] border-2 border-emerald-500/80 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-[0_10px_30px_rgba(16,185,129,0.15)] relative overflow-hidden">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-700/80 text-xs font-black text-emerald-400 flex items-center gap-1.5 uppercase">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    OUR SHOP (DEEPA DIRECT EXPRESS)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 text-[10px] font-bold">
                    0% Middlemen
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-black text-emerald-200">
                  Deepa Crackers Direct Model
                </h4>
              </div>

              {/* SVG Real Express Curved Highway with Green Lorry */}
              <div className="relative w-full aspect-[4/3] bg-black/60 rounded-xl border border-emerald-900/40 p-2 overflow-hidden flex items-center justify-center">
                <svg viewBox="0 0 380 280" className="w-full h-full">
                  <defs>
                    {/* Smooth Direct Express Highway Curve */}
                    <path
                      id="greenRoadPath"
                      d="M 40,40 C 260,30 310,130 200,165 C 120,195 240,240 330,250"
                      fill="none"
                    />
                  </defs>

                  {/* Road Base Asphalt */}
                  <use href="#greenRoadPath" stroke="#05240e" strokeWidth="28" strokeLinecap="round" strokeLinejoin="round" />
                  {/* Road Borders & Glow */}
                  <use href="#greenRoadPath" stroke="#047857" strokeWidth="30" strokeDasharray="none" fill="none" opacity="0.4" />
                  <use href="#greenRoadPath" stroke="#05240e" strokeWidth="24" fill="none" />
                  {/* Center dashed line */}
                  <use href="#greenRoadPath" stroke="#10b981" strokeWidth="2.5" strokeDasharray="6,6" opacity="0.9" fill="none" />

                  {/* Node 1: Sivakasi Factory Direct */}
                  <g transform="translate(40, 40)">
                    <circle r="15" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                    <text textAnchor="middle" dy="4" fontSize="12">🏭</text>
                    <text x="20" y="4" fontSize="10.5" fontWeight="bold" fill="#6ee7b7">Sivakasi Factory</text>
                  </g>

                  {/* Node 2: Deepa Central Depot Hub */}
                  <g transform="translate(200, 165)">
                    <circle r="16" fill="#047857" stroke="#34d399" strokeWidth="2.5" />
                    <text textAnchor="middle" dy="5" fontSize="13">🏬</text>
                    <rect x="22" y="-14" width="130" height="24" rx="6" fill="#064e3b" stroke="#059669" strokeWidth="1.5" />
                    <text x="28" y="-1" fontSize="9" fontWeight="900" fill="#ffffff">DEEPA CENTRAL HUB</text>
                    <text x="28" y="7" fontSize="7.5" fontWeight="bold" fill="#6ee7b7">Thiruthuraipoondi (0% Markup)</text>
                  </g>

                  {/* Node 3: Direct to Customer */}
                  <g transform="translate(330, 250)">
                    <circle r="16" fill="#10b981" stroke="#ffffff" strokeWidth="2.5" />
                    <text textAnchor="middle" dy="5" fontSize="13">👨‍👩‍👧</text>
                    <rect x="-115" y="-12" width="90" height="20" rx="4" fill="#064e3b" stroke="#10b981" />
                    <text x="-108" y="2" fontSize="9" fontWeight="900" fill="#a7f3d0">Direct Customer</text>
                  </g>

                  {/* Driving Green Express Lorry cruising smoothly along the express highway */}
                  <g>
                    <animateMotion
                      repeatCount="indefinite"
                      dur="3.8s"
                      rotate="auto"
                    >
                      <mpath href="#greenRoadPath" />
                    </animateMotion>
                    
                    {/* Truck Vehicle Vector Body */}
                    <rect x="-16" y="-9" width="25" height="18" rx="4" fill="#10b981" stroke="#ffffff" strokeWidth="1.2" />
                    <rect x="9" y="-7" width="10" height="14" rx="2" fill="#047857" />
                    {/* Text badge on truck */}
                    <text x="-4" y="3" fontSize="6.5" fontWeight="900" fill="#ffffff" textAnchor="middle">DEEPA</text>
                    {/* Wheels */}
                    <circle cx="-10" cy="-9" r="3" fill="#000000" stroke="#047857" strokeWidth="0.8" />
                    <circle cx="7" cy="-9" r="3" fill="#000000" stroke="#047857" strokeWidth="0.8" />
                    <circle cx="-10" cy="9" r="3" fill="#000000" stroke="#047857" strokeWidth="0.8" />
                    <circle cx="7" cy="9" r="3" fill="#000000" stroke="#047857" strokeWidth="0.8" />
                    {/* Headlights */}
                    <circle cx="19" cy="-4" r="2" fill="#fef08a" />
                    <circle cx="19" cy="4" r="2" fill="#fef08a" />
                  </g>
                </svg>
              </div>

              {/* Status Footer */}
              <div className="p-2.5 rounded-xl bg-emerald-950 border border-emerald-500/70 flex items-center justify-between text-xs font-black text-emerald-300 shadow-md">
                <span>Express Highway • 0% Middlemen</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500 text-black font-black text-[11px] shadow-sm">
                  FINAL: WHOLESALE SAVINGS ✅
                </span>
              </div>
            </div>

          </div>

          {/* Bottom Trust Guarantee Strip */}
          <div className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-between flex-wrap gap-2 text-xs">
            <span className="font-black text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              SAVE BIG! GET REAL VALUE DIRECT FROM SIVAKASI MANUFACTURER
            </span>
            <span className="text-neutral-400 font-medium">
              40 Years of Trust (Est. 1985) • Thiruthuraipoondi
            </span>
          </div>
        </div>

        {/* Modal Bottom Action & Progress Bar */}
        <div className="p-4 border-t border-neutral-800 bg-black/90 flex flex-col gap-2.5">
          {/* Progress timer indicator */}
          <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-emerald-500 transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="text-xs text-neutral-400 font-medium flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span>Opening product catalog in <strong className="text-white font-bold">{secondsLeft}s</strong></span>
            </div>

            <button
              onClick={handleClose}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-emerald-600 hover:from-red-500 hover:to-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-red-600/20"
            >
              <span>Explore Products Now</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
