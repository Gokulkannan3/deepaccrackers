import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  Sparkles, 
  X, 
  AlertTriangle, 
  CheckCircle2,
  Truck,
  Navigation,
  ShieldCheck,
  Percent,
  MapPin,
  Clock
} from "lucide-react";

export default function WhyDeepaCrackersModal({ onClose }) {
  // Stages: 'traditional' (plays 2 trips) -> 'deepa' (shows reason & direct model) -> 'close'
  const [activeStage, setActiveStage] = useState("traditional");
  const [redLoopCount, setRedLoopCount] = useState(1);
  const [truckProgress, setTruckProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  // Auto-dismiss countdown for the final Deepa stage
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const showT = setTimeout(() => setVisible(true), 30);
    return () => clearTimeout(showT);
  }, []);

  // ── Automated Flow Choreography ─────────────────────────────
  // 1. Red stage plays for exactly 2 cycles (each cycle is 3.5s => total 7.0s)
  // 2. Automatically switches to Deepa stage (5.5s)
  // 3. Automatically closes and enters the catalog
  useEffect(() => {
    const RED_CYCLE_MS = 3500;
    const TOTAL_RED_CYCLES = 2;
    const start = Date.now();

    // Red progress loop
    const progressInterval = setInterval(() => {
      if (activeStage === "traditional") {
        const elapsed = Date.now() - start;
        const currentCycle = Math.floor(elapsed / RED_CYCLE_MS) + 1;
        const cycleProgress = ((elapsed % RED_CYCLE_MS) / RED_CYCLE_MS) * 100;
        
        setRedLoopCount(Math.min(currentCycle, TOTAL_RED_CYCLES));
        setTruckProgress(cycleProgress);

        // After 2 cycles, transition to Deepa
        if (elapsed >= RED_CYCLE_MS * TOTAL_RED_CYCLES) {
          clearInterval(progressInterval);
          setActiveStage("deepa");
        }
      }
    }, 40);

    return () => clearInterval(progressInterval);
  }, [activeStage]);

  // Once Deepa stage is active, run green progress and countdown to close
  useEffect(() => {
    if (activeStage !== "deepa") return;

    const start = Date.now();
    const GREEN_DURATION_MS = 6000;

    const greenInterval = setInterval(() => {
      const elapsed = Date.now() - start;
      const progressPct = Math.min((elapsed / 3200) * 100, 100);
      setTruckProgress(progressPct);

      const remainingSec = Math.max(0, Math.ceil((GREEN_DURATION_MS - elapsed) / 1000));
      setCountdown(remainingSec);

      if (elapsed >= GREEN_DURATION_MS) {
        clearInterval(greenInterval);
        handleClose();
      }
    }, 50);

    return () => clearInterval(greenInterval);
  }, [activeStage]);

  const handleClose = () => {
    setExiting(true);
    setTimeout(() => onClose && onClose(), 350);
  };

  // Checkpoints threshold highlights
  const isRedAgentActive = activeStage === "traditional" && truckProgress >= 20;
  const isRedDistributorActive = activeStage === "traditional" && truckProgress >= 48;
  const isRedCustomerActive = activeStage === "traditional" && truckProgress >= 78;

  const isGreenHubActive = activeStage === "deepa" && truckProgress >= 38;
  const isGreenCustomerActive = activeStage === "deepa" && truckProgress >= 76;

  return (
    <div
      className={`fixed inset-0 z-[100000] bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 transition-all duration-300 ${
        visible && !exiting ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
    >
      {/* Modal Main Container */}
      <div className="w-full max-w-4xl max-h-[96vh] bg-[#0a0a0a] border border-neutral-800 rounded-3xl flex flex-col overflow-hidden shadow-2xl relative text-white">
        
        {/* Top Header */}
        <div className="px-5 py-3.5 border-b border-neutral-800 flex items-center justify-between bg-black/90">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-base shadow-md transition-colors ${
              activeStage === "traditional" ? "bg-red-600 shadow-red-600/30" : "bg-emerald-600 shadow-emerald-600/30"
            }`}>
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                  WHY CHOOSE DEEPA CRACKERS?
                </h3>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${
                  activeStage === "traditional"
                    ? "bg-red-950 border-red-800 text-red-300"
                    : "bg-emerald-950 border-emerald-800 text-emerald-300"
                }`}>
                  {activeStage === "traditional"
                    ? `1. Middleman Trap (Trip ${redLoopCount} of 2)`
                    : "2. Deepa Direct Wholesale Model"}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 font-medium">
                {activeStage === "traditional"
                  ? "Watching the 4 middleman cuts in action..."
                  : "Discover why Deepa Crackers provides genuine Sivakasi wholesale rates"}
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

        {/* Stage Content */}
        <div className="p-3 sm:p-5 overflow-y-auto flex-1 flex flex-col justify-between space-y-3">
          <AnimatePresence mode="wait">
            
            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* 1. TRADITIONAL: 2-Trip Middlemen Road Animation                  */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {activeStage === "traditional" && (
              <motion.div
                key="traditional-2-trips"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className="bg-[#140606] border-2 border-red-600/80 rounded-2xl p-3 sm:p-4 flex flex-col space-y-3 shadow-[0_10px_35px_rgba(220,38,38,0.2)]"
              >
                {/* Live GPS Status Bar */}
                <div className="px-3.5 py-2 rounded-xl bg-red-950/70 border border-red-800/80 flex items-center justify-between text-xs font-bold text-red-200">
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-red-500 animate-spin" />
                    <span>
                      <strong>GPS LIVE STATUS:</strong>{" "}
                      {!isRedAgentActive && "Leaving 1. Factory (Base Cost)..."}
                      {isRedAgentActive && !isRedDistributorActive && "📍 REACHED: 2. AGENT BROKER (+20% COMMISSION)"}
                      {isRedDistributorActive && !isRedCustomerActive && "📍 REACHED: 3. REGIONAL DISTRIBUTOR (+25% MARKUP)"}
                      {isRedCustomerActive && "🚨 FINAL STOP: CUSTOMER PAYS INFLATED FAKE MRP (+400% ❌)"}
                    </span>
                  </div>
                  <span className="text-[10px] bg-red-600 text-white px-2.5 py-0.5 rounded font-black uppercase">
                    Trip {redLoopCount}/2
                  </span>
                </div>

                {/* Large Format SVG Winding Road */}
                <div className="relative w-full aspect-[16/9] sm:aspect-[2.3/1] min-h-[260px] sm:min-h-[300px] bg-black/90 rounded-2xl border border-red-900/60 p-2 overflow-hidden flex items-center justify-center">
                  <svg viewBox="0 0 740 320" className="w-full h-full">
                    <defs>
                      <path
                        id="redRoad2Trips"
                        d="M 60,80 C 180,30 220,50 280,100 C 340,150 370,220 460,180 C 540,140 600,240 680,240"
                        fill="none"
                      />
                    </defs>

                    {/* Road Base Asphalt */}
                    <use href="#redRoad2Trips" stroke="#260808" strokeWidth="38" strokeLinecap="round" strokeLinejoin="round" />
                    <use href="#redRoad2Trips" stroke="#7f1d1d" strokeWidth="42" fill="none" opacity="0.35" />
                    <use href="#redRoad2Trips" stroke="#1f0606" strokeWidth="32" fill="none" />
                    <use href="#redRoad2Trips" stroke="#ef4444" strokeWidth="3" strokeDasharray="8,9" opacity="0.9" fill="none" />

                    {/* Checkpoint 1: Factory */}
                    <g transform="translate(60, 80)">
                      <circle r="24" fill="#450a0a" stroke="#ef4444" strokeWidth="2.5" />
                      <text textAnchor="middle" dy="6" fontSize="16">🏭</text>
                      <text x="-32" y="42" fontSize="13" fontWeight="900" fill="#ffffff">1. Factory</text>
                      <text x="-32" y="56" fontSize="10" fontWeight="bold" fill="#fca5a5">Base Origin Cost</text>
                    </g>

                    {/* Checkpoint 2: Agent */}
                    <g transform="translate(280, 100)">
                      <circle
                        r={isRedAgentActive ? "30" : "22"}
                        fill={isRedAgentActive ? "#7f1d1d" : "#260808"}
                        stroke={isRedAgentActive ? "#f87171" : "#450a0a"}
                        strokeWidth={isRedAgentActive ? "4" : "2"}
                        filter={isRedAgentActive ? "drop-shadow(0 0 14px #ef4444)" : "none"}
                        className="transition-all duration-300"
                      />
                      <text textAnchor="middle" dy={isRedAgentActive ? "7" : "5"} fontSize={isRedAgentActive ? "18" : "14"}>👨‍💼</text>
                      
                      <g transform="translate(-75, -42)">
                        <rect
                          width="150"
                          height="30"
                          rx="8"
                          fill={isRedAgentActive ? "#dc2626" : "#450a0a"}
                          stroke={isRedAgentActive ? "#ffffff" : "#7f1d1d"}
                          strokeWidth="2"
                        />
                        <text x="75" y="19" fontSize="12" fontWeight="900" fill="#ffffff" textAnchor="middle">
                          2. AGENT (+20%)
                        </text>
                      </g>
                    </g>

                    {/* Checkpoint 3: Distributor */}
                    <g transform="translate(460, 180)">
                      <circle
                        r={isRedDistributorActive ? "30" : "22"}
                        fill={isRedDistributorActive ? "#7f1d1d" : "#260808"}
                        stroke={isRedDistributorActive ? "#f87171" : "#450a0a"}
                        strokeWidth={isRedDistributorActive ? "4" : "2"}
                        filter={isRedDistributorActive ? "drop-shadow(0 0 14px #ef4444)" : "none"}
                        className="transition-all duration-300"
                      />
                      <text textAnchor="middle" dy={isRedDistributorActive ? "7" : "5"} fontSize={isRedDistributorActive ? "18" : "14"}>🏢</text>
                      
                      <g transform="translate(-90, -42)">
                        <rect
                          width="180"
                          height="30"
                          rx="8"
                          fill={isRedDistributorActive ? "#dc2626" : "#450a0a"}
                          stroke={isRedDistributorActive ? "#ffffff" : "#7f1d1d"}
                          strokeWidth="2"
                        />
                        <text x="90" y="19" fontSize="12" fontWeight="900" fill="#ffffff" textAnchor="middle">
                          3. DISTRIBUTOR (+25%)
                        </text>
                      </g>
                    </g>

                    {/* Checkpoint 4: Customer End */}
                    <g transform="translate(680, 240)">
                      <circle
                        r={isRedCustomerActive ? "32" : "24"}
                        fill={isRedCustomerActive ? "#ef4444" : "#260808"}
                        stroke={isRedCustomerActive ? "#ffffff" : "#450a0a"}
                        strokeWidth={isRedCustomerActive ? "4.5" : "2"}
                        filter={isRedCustomerActive ? "drop-shadow(0 0 20px #ef4444)" : "none"}
                        className="transition-all duration-300"
                      />
                      <text textAnchor="middle" dy={isRedCustomerActive ? "8" : "6"} fontSize={isRedCustomerActive ? "20" : "15"}>💸</text>
                      
                      <g transform="translate(-105, -44)">
                        <rect
                          width="210"
                          height="32"
                          rx="8"
                          fill={isRedCustomerActive ? "#991b1b" : "#450a0a"}
                          stroke="#ffffff"
                          strokeWidth="2"
                        />
                        <text x="105" y="21" fontSize="13" fontWeight="900" fill="#ffffff" textAnchor="middle">
                          4. FAKE 90% MRP TRAP ❌
                        </text>
                      </g>
                    </g>

                    {/* Red Lorry */}
                    <g>
                      <animateMotion
                        dur="3.5s"
                        repeatCount="indefinite"
                        rotate="auto"
                      >
                        <mpath href="#redRoad2Trips" />
                      </animateMotion>
                      
                      <rect x="-22" y="-12" width="34" height="24" rx="4" fill="#dc2626" stroke="#ffffff" strokeWidth="1.5" />
                      <rect x="12" y="-10" width="14" height="20" rx="3" fill="#991b1b" />
                      <circle cx="-14" cy="-12" r="4" fill="#000000" />
                      <circle cx="10" cy="-12" r="4" fill="#000000" />
                      <circle cx="-14" cy="12" r="4" fill="#000000" />
                      <circle cx="10" cy="12" r="4" fill="#000000" />
                      <circle cx="26" cy="-5" r="2.2" fill="#fef08a" />
                      <circle cx="26" cy="5" r="2.2" fill="#fef08a" />
                    </g>
                  </svg>
                </div>

                {/* Footer status */}
                <div className="p-2.5 rounded-xl bg-red-950 border border-red-800 text-center text-xs font-bold text-red-200">
                  ⚠️ Showing why other stores inflate prices by 400%. Switching to Deepa Crackers Direct Solution...
                </div>
              </motion.div>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* 2. DEEPA: The Direct Solution, Reasons & Auto-Close Timer       */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {activeStage === "deepa" && (
              <motion.div
                key="deepa-reasons-solution"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="bg-[#051408] border-2 border-emerald-500/90 rounded-2xl p-4 sm:p-5 flex flex-col space-y-4 shadow-[0_10px_35px_rgba(16,185,129,0.25)]"
              >
                {/* Header Status & Countdown */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-lg bg-emerald-950 border border-emerald-600 text-xs font-black text-emerald-300 uppercase flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      THE DEEPA CRACKERS ADVANTAGE
                    </span>
                  </div>
                  <div className="text-xs text-neutral-400 font-medium flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Entering Catalog in <strong className="text-white font-bold">{countdown}s</strong></span>
                  </div>
                </div>

                {/* Direct Express Highway SVG Animation */}
                <div className="relative w-full aspect-[16/9] sm:aspect-[2.4/1] min-h-[220px] bg-black/90 rounded-2xl border border-emerald-900/60 p-2 overflow-hidden flex items-center justify-center">
                  <svg viewBox="0 0 740 260" className="w-full h-full">
                    <defs>
                      <path
                        id="greenExpressRoad"
                        d="M 70,130 C 220,50 280,50 370,130 C 460,210 520,210 670,130"
                        fill="none"
                      />
                    </defs>

                    {/* Road Base Asphalt */}
                    <use href="#greenExpressRoad" stroke="#05240e" strokeWidth="38" strokeLinecap="round" strokeLinejoin="round" />
                    <use href="#greenExpressRoad" stroke="#047857" strokeWidth="42" fill="none" opacity="0.45" />
                    <use href="#greenExpressRoad" stroke="#041f0c" strokeWidth="32" fill="none" />
                    <use href="#greenExpressRoad" stroke="#10b981" strokeWidth="3.5" strokeDasharray="8,9" opacity="0.95" fill="none" />

                    {/* Node 1: Sivakasi Direct Factory */}
                    <g transform="translate(70, 130)">
                      <circle r="26" fill="#064e3b" stroke="#10b981" strokeWidth="3" />
                      <text textAnchor="middle" dy="6" fontSize="17">🏭</text>
                      <text x="-35" y="42" fontSize="13" fontWeight="900" fill="#ffffff">1. Sivakasi</text>
                      <text x="-35" y="56" fontSize="10" fontWeight="bold" fill="#6ee7b7">Direct Factory</text>
                    </g>

                    {/* Node 2: Deepa Central Hub */}
                    <g transform="translate(370, 130)">
                      <circle
                        r={isGreenHubActive ? "32" : "24"}
                        fill={isGreenHubActive ? "#047857" : "#062812"}
                        stroke={isGreenHubActive ? "#34d399" : "#047857"}
                        strokeWidth={isGreenHubActive ? "4.5" : "2"}
                        filter={isGreenHubActive ? "drop-shadow(0 0 18px #10b981)" : "none"}
                        className="transition-all duration-300"
                      />
                      <text textAnchor="middle" dy={isGreenHubActive ? "8" : "6"} fontSize={isGreenHubActive ? "20" : "15"}>🏬</text>
                      
                      <g transform="translate(-125, -44)">
                        <rect
                          width="250"
                          height="32"
                          rx="8"
                          fill={isGreenHubActive ? "#064e3b" : "#062812"}
                          stroke={isGreenHubActive ? "#34d399" : "#047857"}
                          strokeWidth="2"
                        />
                        <text x="125" y="21" fontSize="12.5" fontWeight="900" fill="#ffffff" textAnchor="middle">
                          2. DEEPA CENTRAL HUB (0% MARKUP)
                        </text>
                      </g>
                    </g>

                    {/* Node 3: Direct Customer */}
                    <g transform="translate(670, 130)">
                      <circle
                        r={isGreenCustomerActive ? "34" : "24"}
                        fill={isGreenCustomerActive ? "#10b981" : "#062812"}
                        stroke={isGreenCustomerActive ? "#ffffff" : "#047857"}
                        strokeWidth={isGreenCustomerActive ? "5" : "2"}
                        filter={isGreenCustomerActive ? "drop-shadow(0 0 24px #10b981)" : "none"}
                        className="transition-all duration-300"
                      />
                      <text textAnchor="middle" dy={isGreenCustomerActive ? "9" : "6"} fontSize={isGreenCustomerActive ? "22" : "16"}>👨‍👩‍👧</text>
                      
                      <g transform="translate(-135, -44)">
                        <rect
                          width="270"
                          height="32"
                          rx="8"
                          fill={isGreenCustomerActive ? "#047857" : "#062812"}
                          stroke="#ffffff"
                          strokeWidth="2"
                        />
                        <text x="135" y="21" fontSize="12.5" fontWeight="900" fill="#ffffff" textAnchor="middle">
                          3. WHOLESALE SAVINGS DELIVERED ✅
                        </text>
                      </g>
                    </g>

                    {/* Green Express Lorry */}
                    <g>
                      <animateMotion
                        dur="3.2s"
                        repeatCount="indefinite"
                        rotate="auto"
                      >
                        <mpath href="#greenExpressRoad" />
                      </animateMotion>
                      
                      <rect x="-24" y="-13" width="38" height="26" rx="5" fill="#10b981" stroke="#ffffff" strokeWidth="1.8" />
                      <rect x="14" y="-11" width="15" height="22" rx="3" fill="#047857" />
                      <text x="-5" y="4" fontSize="8.5" fontWeight="900" fill="#ffffff" textAnchor="middle">DEEPA</text>
                      <circle cx="-15" cy="-13" r="4.5" fill="#000000" stroke="#047857" strokeWidth="1" />
                      <circle cx="11" cy="-13" r="4.5" fill="#000000" stroke="#047857" strokeWidth="1" />
                      <circle cx="-15" cy="13" r="4.5" fill="#000000" stroke="#047857" strokeWidth="1" />
                      <circle cx="11" cy="13" r="4.5" fill="#000000" stroke="#047857" strokeWidth="1" />
                      <circle cx="29" cy="-5" r="2.5" fill="#fef08a" />
                      <circle cx="29" cy="5" r="2.5" fill="#fef08a" />
                    </g>
                  </svg>
                </div>

                {/* 3 Key Trust & Sourcing Pillars (The Reasons Why Deepa Crackers) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-neutral-950 border border-emerald-900/60 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-700 flex items-center justify-center text-emerald-400 shrink-0">
                      <Percent className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white">0% Agent Commission</h4>
                      <p className="text-[10px] text-neutral-400 mt-0.5">Direct Sivakasi wholesale prices with no middleman price hikes.</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-neutral-950 border border-emerald-900/60 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-700 flex items-center justify-center text-emerald-400 shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white">40 Years of Trust (1985)</h4>
                      <p className="text-[10px] text-neutral-400 mt-0.5">Direct Shop & wholesale hub at RS Road, Thiruthuraipoondi.</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-neutral-950 border border-emerald-900/60 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-700 flex items-center justify-center text-emerald-400 shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white">100% Genuine Quality</h4>
                      <p className="text-[10px] text-neutral-400 mt-0.5">Certified fresh stock directly from authorized manufacturers.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="px-5 py-3.5 border-t border-neutral-800 bg-black/90 flex items-center justify-between gap-3 flex-wrap">
          <div className="text-xs text-neutral-400 font-medium flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{activeStage === "traditional" ? "Playing comparison sequence..." : "Ready to explore Deepa Crackers"}</span>
          </div>

          <button
            onClick={handleClose}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-emerald-600 hover:from-red-500 hover:to-emerald-500 text-white font-black text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-red-600/20"
          >
            <span>Explore Products Now</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
