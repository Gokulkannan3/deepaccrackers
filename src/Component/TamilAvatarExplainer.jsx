import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Play, Pause, Volume2, VolumeX } from 'lucide-react';

// Supply chain explanation steps in Tamil + English
const EXPLAIN_STEPS = [
  {
    id: 0,
    tamilTitle: "வணக்கம்! நான் தீபா! 🙏",
    tamilText: "வணக்கம் நண்பர்களே! நான் உங்களுக்கு தீபா பட்டாஸ் எப்படி வேலை செய்கிறது என்று விளக்குகிறேன்!",
    englishText: "Hello friends! I'm Deepa! Let me explain how Deepa Crackers works for you!",
    highlight: null,
    avatarAnimation: "idle",
    emoji: "👋"
  },
  {
    id: 1,
    tamilTitle: "மற்ற கடைகள் — அதிக விலை! 😟",
    tamilText: "மற்ற கடைகளில் தொழிற்சாலை ➜ ஏஜென்ட் ➜ மொத்த வியாபாரி ➜ கடை என்று நிறைய இடைத்தரகர்கள் உள்ளனர். இதனால் விலை மிகவும் அதிகமாகிறது!",
    englishText: "In other shops: Factory → Agent → Distributor → Retailer → Customer. Many middlemen = HIGH final price!",
    highlight: "other",
    avatarAnimation: "talking",
    emoji: "📦"
  },
  {
    id: 2,
    tamilTitle: "தீபா பட்டாஸ் — நேரடி மாதிரி! ✅",
    tamilText: "தீபா பட்டாஸில் தொழிற்சாலை ➜ தீபா பட்டாஸ் ➜ வாடிக்கையாளர். இடைத்தரகர்கள் இல்லாததால் 80% வரை சேமிக்கலாம்!",
    englishText: "Deepa Crackers: Factory → Deepa → Customer directly! 80% savings guaranteed!",
    highlight: "deepa",
    avatarAnimation: "wave",
    emoji: "🏭"
  },
  {
    id: 3,
    tamilTitle: "80% வரை சேமிப்பு! 💰",
    tamilText: "இடைத்தரகர்கள் இல்லாததால், திருத்துறைப்பூண்டி தொழிற்சாலையிலிருந்து நேரடியாக 80% சேமிப்புடன் பட்டாசு வாங்கலாம்!",
    englishText: "Save up to 80% because we source directly from Thiruthuraipoondi factory with zero agent commissions!",
    highlight: "savings",
    avatarAnimation: "happy",
    emoji: "💰"
  }
];

const TOUR_STEPS = [
  {
    id: 0,
    tamilTitle: "படி 1: தேடுங்கள் 🔍",
    tamilText: "பக்கத்தில் தேடல் பெட்டியில் உங்களுக்கு வேண்டிய பட்டாசை தமிழிலோ ஆங்கிலத்திலோ தேடுங்கள்!",
    englishText: "Use the search box to find the crackers you want in Tamil or English!",
    emoji: "🔍",
    targetHint: "Search Bar"
  },
  {
    id: 1,
    tamilTitle: "படி 2: அளவை தேர்வு செய்யுங்கள் ➕",
    tamilText: "உங்கள் விருப்பமான பட்டாசு கார்டில் + பட்டன் அழுத்தி அளவை கூட்டுங்கள்!",
    englishText: "Press the + button on any product card to add quantities to your order!",
    emoji: "➕",
    targetHint: "Product + Button"
  },
  {
    id: 2,
    tamilTitle: "படி 3: விலை கணக்கீடு 🧮",
    tamilText: "தள்ளுபடி பெட்டியில் உங்கள் தள்ளுபடி குறியீட்டை (இருந்தால்) உள்ளிட்டு மொத்த தொகையை பாருங்கள்!",
    englishText: "Enter your discount code (if any) and see the total estimated price with savings!",
    emoji: "🧮",
    targetHint: "Price Calculator"
  },
  {
    id: 3,
    tamilTitle: "படி 4: ஆர்டர் செய்யுங்கள் ✅",
    tamilText: "'ஆர்டர் சமர்ப்பிக்கவும்' பட்டனை அழுத்தி உங்கள் பெயர், மொபைல் மற்றும் முகவரி கொடுங்கள். PDF பில் உடனே கிடைக்கும்!",
    englishText: "Click 'Submit Order', fill your name, mobile & address. Instant PDF bill download!",
    emoji: "✅",
    targetHint: "Submit Order Button"
  }
];

export default function TamilAvatarExplainer({ onClose }) {
  const [phase, setPhase] = useState("explain"); // "explain" | "tour"
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [dollVisible, setDollVisible] = useState(false);
  const autoTimer = useRef(null);

  const steps = phase === "explain" ? EXPLAIN_STEPS : TOUR_STEPS;
  const currentStep = steps[step];

  // Auto-advance steps
  useEffect(() => {
    if (isPlaying) {
      autoTimer.current = setInterval(() => {
        setStep(prev => {
          if (prev + 1 >= steps.length) {
            if (phase === "explain") {
              setPhase("tour");
              return 0;
            } else {
              setIsPlaying(false);
              return prev;
            }
          }
          return prev + 1;
        });
      }, 6000);
    }
    return () => clearInterval(autoTimer.current);
  }, [isPlaying, phase, steps.length]);

  // Doll walk-in animation
  useEffect(() => {
    const t = setTimeout(() => setDollVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  const goNext = () => {
    clearInterval(autoTimer.current);
    if (step + 1 >= steps.length) {
      if (phase === "explain") {
        setPhase("tour");
        setStep(0);
      }
    } else {
      setStep(s => s + 1);
    }
  };

  const goPrev = () => {
    clearInterval(autoTimer.current);
    if (step > 0) setStep(s => s - 1);
    else if (phase === "tour") {
      setPhase("explain");
      setStep(EXPLAIN_STEPS.length - 1);
    }
  };

  const totalSteps = EXPLAIN_STEPS.length + TOUR_STEPS.length;
  const globalStep = phase === "explain" ? step : EXPLAIN_STEPS.length + step;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-3">
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 80 }}
        transition={{ type: "spring", damping: 22, stiffness: 300 }}
        className="w-full max-w-2xl bg-[#FAF6EE] rounded-3xl border-4 border-slate-900 shadow-[12px_12px_0px_0px_#0f172a] overflow-hidden font-mono"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-amber-300 border-b-4 border-slate-900">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎭</span>
            <div>
              <h3 className="text-sm font-black text-slate-900">
                {phase === "explain" ? "தீபா பட்டாஸ் விளக்கம் (Deepa Explains)" : "🛒 புக்கிங் வழிகாட்டி (Booking Tour)"}
              </h3>
              <p className="text-[10px] font-bold text-slate-700">
                {phase === "explain" ? "ஏன் தீபா பட்டாஸ் தேர்வு செய்ய வேண்டும்?" : "எப்படி ஆர்டர் செய்வது? Step-by-step"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-xl bg-white border-2 border-slate-900 hover:bg-amber-100 shadow-[2px_2px_0px_0px_#0f172a]"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-700" /> : <Volume2 className="w-4 h-4 text-slate-700" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white border-2 border-slate-900 hover:bg-red-50 shadow-[2px_2px_0px_0px_#0f172a]"
            >
              <X className="w-4 h-4 text-slate-800" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 h-2 border-b-2 border-slate-300">
          <motion.div
            className="h-full bg-amber-500"
            initial={{ width: "0%" }}
            animate={{ width: `${((globalStep + 1) / totalSteps) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Main Content */}
        <div className="flex flex-col sm:flex-row items-center gap-0 min-h-[300px]">

          {/* 3D Avatar iframe from ReadyPlayerMe */}
          <div className="w-full sm:w-[220px] shrink-0 bg-gradient-to-b from-amber-100 to-amber-200 border-r-0 sm:border-r-4 border-b-4 sm:border-b-0 border-slate-900 relative flex items-center justify-center" style={{ minHeight: 240 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={phase + step}
                initial={{ x: -60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 60, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="relative w-full h-60"
              >
                {/* Ready Player Me 3D Avatar via iframe */}
                <iframe
                  src="https://models.readyplayer.me/64c3f5ac5924e9ade9a74a70.glb?autoRotate=false&background=transparent"
                  title="Deepa 3D Avatar"
                  className="w-full h-full opacity-0 absolute"
                  allow="camera *; microphone *"
                  onLoad={(e) => { e.target.style.opacity = 1; }}
                />
                {/* Fallback Premium CSS Avatar since iframe won't render glb directly */}
                <div className="w-full h-full flex flex-col items-center justify-end pb-2">
                  {/* Head */}
                  <motion.div
                    animate={isPlaying ? { rotate: [-3, 3, -3] } : {}}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="relative"
                  >
                    {/* Body */}
                    <motion.div
                      animate={isPlaying ? { y: [0, -4, 0] } : {}}
                      transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                      className="flex flex-col items-center"
                    >
                      {/* Face */}
                      <div className="w-20 h-20 rounded-full bg-amber-300 border-4 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] flex items-center justify-center relative overflow-hidden">
                        {/* Saree / Indian attire pattern */}
                        <div className="absolute inset-0 bg-gradient-to-b from-amber-200 to-amber-400" />
                        {/* Face elements */}
                        <div className="relative z-10 text-4xl select-none">
                          {phase === "explain" 
                            ? (step === 0 ? "👩🏽" : step === 1 ? "😟" : step === 2 ? "😊" : "🤩")
                            : (step === 0 ? "🔍" : step === 1 ? "😊" : step === 2 ? "🧮" : "✅")
                          }
                        </div>
                      </div>
                      {/* Body */}
                      <div className="w-16 h-20 rounded-b-2xl bg-gradient-to-b from-orange-500 to-red-600 border-4 border-t-0 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] flex items-center justify-center relative overflow-hidden mt-[-4px]">
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/30 to-red-500/30" />
                        {/* Saree border pattern */}
                        <div className="absolute bottom-0 left-0 right-0 h-3 bg-yellow-400 border-t-2 border-slate-900" />
                        <span className="text-2xl relative z-10">👐</span>
                      </div>
                      {/* Legs */}
                      <div className="flex gap-2 mt-1">
                        <motion.div
                          animate={isPlaying ? { y: [0, -5, 0] } : {}}
                          transition={{ repeat: Infinity, duration: 0.8, delay: 0 }}
                          className="w-6 h-8 rounded-b-xl bg-amber-900 border-2 border-slate-900 shadow-[1px_1px_0px_0px_#0f172a]"
                        />
                        <motion.div
                          animate={isPlaying ? { y: [0, -5, 0] } : {}}
                          transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
                          className="w-6 h-8 rounded-b-xl bg-amber-900 border-2 border-slate-900 shadow-[1px_1px_0px_0px_#0f172a]"
                        />
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Phase badge */}
                  <span className="mt-2 px-2 py-0.5 rounded-full bg-slate-900 text-amber-300 text-[10px] font-black">
                    {phase === "explain" ? "தீபா 👩🏽" : "வழிகாட்டி 🧭"}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Speech Bubble / Text Area */}
          <div className="flex-1 p-5 space-y-4">
            {/* Phase Toggle Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => { setPhase("explain"); setStep(0); clearInterval(autoTimer.current); }}
                className={`px-3 py-1.5 rounded-xl border-2 border-slate-900 text-xs font-black transition-all shadow-[2px_2px_0px_0px_#0f172a] ${
                  phase === "explain" ? "bg-amber-300 text-slate-900" : "bg-white text-slate-600 hover:bg-amber-50"
                }`}
              >
                🎭 ஏன் தீபா? (Why Deepa?)
              </button>
              <button
                onClick={() => { setPhase("tour"); setStep(0); clearInterval(autoTimer.current); }}
                className={`px-3 py-1.5 rounded-xl border-2 border-slate-900 text-xs font-black transition-all shadow-[2px_2px_0px_0px_#0f172a] ${
                  phase === "tour" ? "bg-emerald-300 text-slate-900" : "bg-white text-slate-600 hover:bg-emerald-50"
                }`}
              >
                🛒 எப்படி புக்? (How to Book?)
              </button>
            </div>

            {/* Speech Bubble */}
            <AnimatePresence mode="wait">
              <motion.div
                key={phase + "-" + step}
                initial={{ opacity: 0, scale: 0.92, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: -10 }}
                transition={{ duration: 0.25 }}
                className="relative"
              >
                {/* Bubble triangle pointing left */}
                <div className="absolute left-[-10px] top-5 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[12px] border-r-amber-300 hidden sm:block" />

                <div className={`p-4 rounded-2xl border-3 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] ${
                  phase === "explain" ? "bg-amber-50" : "bg-emerald-50"
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{currentStep.emoji}</span>
                    <h4 className="text-sm font-black text-slate-900 font-mono">{currentStep.tamilTitle}</h4>
                  </div>

                  {/* Tamil text */}
                  <p className="text-sm font-bold text-slate-900 font-sans leading-relaxed mb-2">
                    {currentStep.tamilText}
                  </p>

                  {/* English subtitle */}
                  <p className="text-[11px] text-slate-600 font-serif italic border-l-3 border-amber-400 pl-2">
                    EN: {currentStep.englishText}
                  </p>

                  {/* Supply chain visual for explain steps */}
                  {phase === "explain" && currentStep.highlight === "other" && (
                    <div className="mt-3 flex items-center gap-1 flex-wrap text-[11px] font-black bg-red-50 border-2 border-red-300 rounded-xl p-2">
                      <span>🏭</span><span className="text-red-700">→</span>
                      <span>👨‍💼 Agent</span><span className="text-red-700">→</span>
                      <span>🏬 Distributor</span><span className="text-red-700">→</span>
                      <span>🛒 Retailer</span><span className="text-red-700">→</span>
                      <span>👨‍👩‍👧‍👦</span>
                      <span className="ml-auto text-red-700 font-black">= HIGH PRICE! 📈</span>
                    </div>
                  )}
                  {phase === "explain" && currentStep.highlight === "deepa" && (
                    <div className="mt-3 flex items-center gap-1 flex-wrap text-[11px] font-black bg-emerald-50 border-2 border-emerald-400 rounded-xl p-2">
                      <span>🏭</span><span className="text-emerald-700">→</span>
                      <span className="text-emerald-900 font-black bg-amber-300 px-1 rounded border border-slate-900">🏬 DEEPA CRACKERS</span>
                      <span className="text-emerald-700">→</span>
                      <span>👨‍👩‍👧‍👦</span>
                      <span className="ml-auto text-emerald-700 font-black">= 80% SAVINGS! 💚</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Step dots */}
            <div className="flex items-center gap-1.5">
              {steps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setStep(i); clearInterval(autoTimer.current); }}
                  className={`h-2 rounded-full border border-slate-500 transition-all ${
                    i === step ? "w-6 bg-amber-500" : "w-2 bg-slate-300"
                  }`}
                />
              ))}
              <span className="ml-auto text-[10px] font-black text-slate-600 font-mono">
                {step + 1}/{steps.length}
              </span>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => { setIsPlaying(!isPlaying); clearInterval(autoTimer.current); }}
                className="px-3 py-2 rounded-xl bg-white border-2 border-slate-900 text-xs font-bold shadow-[2px_2px_0px_0px_#0f172a] flex items-center gap-1.5 hover:bg-amber-50"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-600" />}
                {isPlaying ? "நிறுத்து" : "இயக்கு"}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={goPrev}
                  disabled={phase === "explain" && step === 0}
                  className="px-3 py-2 rounded-xl bg-white border-2 border-slate-900 text-xs font-bold shadow-[2px_2px_0px_0px_#0f172a] flex items-center gap-1 hover:bg-amber-50 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                  முந்தையது
                </button>
                <button
                  onClick={goNext}
                  className={`px-4 py-2 rounded-xl border-2 border-slate-900 text-xs font-black shadow-[3px_3px_0px_0px_#0f172a] flex items-center gap-1 ${
                    phase === "explain" && step === EXPLAIN_STEPS.length - 1
                      ? "bg-emerald-400 hover:bg-emerald-500 text-slate-900"
                      : "bg-amber-300 hover:bg-amber-400 text-slate-900"
                  }`}
                >
                  {phase === "explain" && step === EXPLAIN_STEPS.length - 1
                    ? "📖 புக்கிங் வழிகாட்டி"
                    : "அடுத்தது"}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
