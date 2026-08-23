import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Sparkles, Percent, Scale, PackageCheck, Play, Pause, RotateCcw } from 'lucide-react';

export default function DirectSourcingPipeline() {
  const [activeStep, setActiveStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const scrollContainerRef = useRef(null);

  // 4 Detailed Process Steps
  const processSteps = [
    {
      id: 0,
      stepNum: "STEP 1 • படி 1",
      badge: "🏭 தொழிற்சாலை நேரடி கொள்முதல்",
      badgeEng: "Direct Factory Purchasing",
      title: "திருத்துறைப்பூண்டி தொழிற்சாலையிலிருந்து நேரடி கொள்முதல்",
      titleEng: "Direct Sourcing from Premier Manufacturing Units",
      tamilDesc: "நாங்கள் திருத்துறைப்பூண்டியில் இயங்கும் முதன்மை பட்டாசு தொழிற்சாலைகளிலிருந்து நேரடியாக உயர்தர பட்டாசுகளை கொள்முதல் செய்கிறோம். தரக்கட்டுப்பாடு மற்றும் சட்டப்பூர்வ உச்சநீதிமன்ற பாதுகாப்புடன் தயாரிக்கப்படுகிறது.",
      englishDesc: "We source supreme quality crackers directly from premier manufacturing units in Thiruthuraipoondi with strict quality control and 100% Supreme Court safety regulations.",
      icon: "🏭",
      bgColor: "from-amber-100 to-amber-200",
      accentColor: "border-amber-400 text-amber-900"
    },
    {
      id: 1,
      stepNum: "STEP 2 • படி 2",
      badge: "🏬 0% இடைத்தரகர் கமிஷன்",
      badgeEng: "0% Middlemen Commission",
      title: "இடைத்தரகர்கள் இல்லாமல் தீபா பட்டாஸ் நேரடி மையம்",
      titleEng: "Direct Model with Zero Middlemen & Agents",
      tamilDesc: "மற்ற கடைகளில் ஏஜென்ட்கள், மொத்த வியாபாரிகள் மற்றும் ரீடெய்லர்கள் சேர்க்கும் கூடுதல் லாபம் எங்களது தீபா பட்டாஸில் கிடையாது! 0% இடைத்தரகர் கமிஷனுடன் செயல்படுகிறோம்.",
      englishDesc: "Unlike other retail shops where 4 middlemen add commissions, Deepa Crackers operates with 0% agent fees and zero middleman markups.",
      icon: "🏬",
      bgColor: "from-amber-200 to-yellow-200",
      accentColor: "border-yellow-400 text-yellow-900"
    },
    {
      id: 2,
      stepNum: "STEP 3 • படி 3",
      badge: "🚚 வீட்டிற்கே நேரடி விநியோகம்",
      badgeEng: "Direct Express Doorstep Delivery",
      title: "உங்கள் வீட்டிற்கே நேரடி டிரான்ஸ்போர்ட் விநியோகம்",
      titleEng: "Direct Express Transport Shipping Across Tamil Nadu",
      tamilDesc: "நீங்கள் ஆர்டர் செய்த பட்டாசுகள் கவனமாக பேக் செய்யப்பட்டு, திருத்துறைப்பூண்டியிலிருந்து நேரடியாக உங்கள் மாவட்டத்திற்கும் வீட்டிற்கும் டிரான்ஸ்போர்ட் வழியாக பாதுகாப்பாக அனுப்பப்படுகிறது.",
      englishDesc: "Your ordered crackers are carefully packed and dispatched directly from Thiruthuraipoondi straight to your doorstep across Tamil Nadu via safe transport.",
      icon: "🚚",
      bgColor: "from-emerald-100 to-emerald-200",
      accentColor: "border-emerald-400 text-emerald-900"
    },
    {
      id: 3,
      stepNum: "STEP 4 • படி 4",
      badge: "💰 80% நேரடி சேமிப்பு & PDF பில்",
      badgeEng: "80% Direct Savings & Invoice Bill",
      title: "80% வரை நேரடி தொழிற்சாலை சேமிப்பு & உடனடி PDF பில்",
      titleEng: "Save up to 80% with Instant Downloadable PDF Bill",
      tamilDesc: "இடைத்தரகர்கள் இல்லாததால் உங்களுக்கு 80% வரை நேரடி சேமிப்பு கிடைக்கிறது. ஆர்டர் சப்மிட் செய்தவுடன் உங்கள் மொபைலுக்கு உடனடி PDF பில் டவுன்லோட் ஆகும்!",
      englishDesc: "By removing all middlemen, you get up to 80% direct factory savings. Instant official PDF bill download upon submitting your order enquiry!",
      icon: "💰",
      bgColor: "from-yellow-200 to-amber-300",
      accentColor: "border-amber-500 text-amber-950"
    }
  ];

  // Auto progression timer when playing
  useEffect(() => {
    let timer;
    if (isAutoPlaying) {
      timer = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % processSteps.length);
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  // Scroll to active step in horizontal view
  useEffect(() => {
    if (scrollContainerRef.current) {
      const stepEl = scrollContainerRef.current.children[activeStep];
      if (stepEl) {
        stepEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeStep]);

  const current = processSteps[activeStep];

  return (
    <section className="w-full rounded-3xl bg-[#FAF6EE] border-4 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] p-4 sm:p-8 space-y-6 font-mono overflow-hidden my-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-3 border-dashed border-slate-400 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-300 border-2 border-slate-900 text-slate-900 text-xs font-black uppercase shadow-[2px_2px_0px_0px_#0f172a] mb-2">
            <Sparkles className="h-4 w-4" />
            <span>எங்கள் விநியோக செயல்முறை • OUR SOURCING PROCESS</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
            தீபா பட்டாஸ் இயங்கும் முறை (Click Next / Scroll to View) 🚚
          </h2>
          <p className="text-xs text-slate-700 font-bold font-sans mt-1">
            தொழிற்சாலையிலிருந்து உங்கள் கைக்கு பட்டாசு எப்படி வருகிறது என்று அடுத்தடுத்த படிகளில் கிளிக் செய்து பாருங்கள்!
          </p>
        </div>

        {/* Auto Play & Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`px-4 py-2 rounded-xl border-2 border-slate-900 text-xs font-black shadow-[2px_2px_0px_0px_#0f172a] flex items-center gap-1.5 transition-all ${
              isAutoPlaying ? "bg-amber-300 text-slate-900" : "bg-white hover:bg-amber-100 text-slate-800"
            }`}
          >
            {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-emerald-600" />}
            <span>{isAutoPlaying ? "நிறுத்து (Pause)" : "தானாக இயக்கு (Auto Play)"}</span>
          </button>
        </div>
      </div>

      {/* Stepper Tabs Bar (Click Next / Step Buttons) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {processSteps.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => {
              setActiveStep(idx);
              setIsAutoPlaying(false);
            }}
            className={`p-2.5 rounded-xl border-2 text-xs font-black font-mono transition-all flex flex-col items-center justify-center gap-1 text-center ${
              activeStep === idx
                ? "bg-amber-300 border-slate-900 text-slate-900 shadow-[3px_3px_0px_0px_#0f172a] scale-102"
                : "bg-white border-slate-400 text-slate-600 hover:border-slate-800 hover:bg-amber-50"
            }`}
          >
            <span className="text-base">{s.icon}</span>
            <span className="text-[11px] font-bold line-clamp-1">{s.badge}</span>
          </button>
        ))}
      </div>

      {/* Main Process Card Viewer with Next/Prev Controls */}
      <div className="relative bg-white rounded-2xl border-3 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] p-5 sm:p-8 overflow-hidden">
        
        {/* Step Progress Line Bar */}
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-6 border border-slate-400">
          <motion.div
            className="bg-amber-400 h-full transition-all duration-300"
            style={{ width: `${((activeStep + 1) / processSteps.length) * 100}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -25 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
          >
            {/* Left Icon Display */}
            <div className="md:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-br from-amber-100 via-amber-50 to-yellow-100 border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] text-center">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-amber-300 border-3 border-slate-900 flex items-center justify-center text-5xl shadow-[4px_4px_0px_0px_#0f172a] mb-3 animate-bounce">
                {current.icon}
              </div>
              <span className="px-3 py-1 rounded-full bg-slate-900 text-amber-300 font-mono font-black text-xs">
                {current.stepNum}
              </span>
            </div>

            {/* Right Details Text */}
            <div className="md:col-span-8 space-y-4">
              <div>
                <span className="px-3 py-1 rounded-lg bg-amber-200 text-slate-900 border border-slate-800 font-bold text-xs">
                  {current.badge}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-mono mt-2">
                  {current.title}
                </h3>
                <p className="text-xs font-bold text-amber-800 font-mono italic">
                  En: {current.titleEng}
                </p>
              </div>

              {/* Tamil Explanation Box */}
              <div className="p-4 rounded-xl bg-amber-50 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]">
                <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-relaxed font-sans">
                  "{current.tamilDesc}"
                </p>
              </div>

              {/* English Subtitle Box */}
              <p className="text-xs text-slate-600 font-serif italic border-l-3 border-amber-400 pl-3">
                "{current.englishDesc}"
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom Navigation Buttons (Click Next / Prev) */}
        <div className="flex items-center justify-between border-t-2 border-dashed border-slate-300 pt-5 mt-6 gap-3">
          <button
            onClick={() => {
              setActiveStep((prev) => (prev === 0 ? processSteps.length - 1 : prev - 1));
              setIsAutoPlaying(false);
            }}
            className="px-4 py-2.5 rounded-xl bg-white border-2 border-slate-900 text-slate-900 font-bold text-xs shadow-[2px_2px_0px_0px_#0f172a] hover:bg-amber-100 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>முந்தையது (Previous)</span>
          </button>

          <span className="text-xs font-black text-slate-700 font-mono">
            {activeStep + 1} / {processSteps.length}
          </span>

          <button
            onClick={() => {
              setActiveStep((prev) => (prev + 1) % processSteps.length);
              setIsAutoPlaying(false);
            }}
            className="px-5 py-2.5 rounded-xl bg-amber-300 hover:bg-amber-400 border-2 border-slate-900 text-slate-900 font-black text-xs shadow-[3px_3px_0px_0px_#0f172a] flex items-center gap-2"
          >
            <span>அடுத்தது (Click Next)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Horizontal Scrollable Step Cards (Scroll to View on Mobile / Desktop) */}
      <div className="space-y-2">
        <p className="text-xs font-bold text-slate-700 font-mono">
          👇 அல்லது கிடைமட்டமாக ஸ்க்ரோல் செய்து பார்க்கவும் (Or Scroll Horizontally to View All):
        </p>

        <div
          ref={scrollContainerRef}
          className="flex items-center gap-4 overflow-x-auto pb-4 pt-1 scrollbar-thin snap-x snap-mandatory"
        >
          {processSteps.map((s, idx) => (
            <div
              key={s.id}
              onClick={() => {
                setActiveStep(idx);
                setIsAutoPlaying(false);
              }}
              className={`min-w-[260px] sm:min-w-[300px] p-4 rounded-2xl border-3 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] cursor-pointer snap-center transition-all ${
                activeStep === idx ? "bg-amber-300 scale-102" : "bg-white hover:bg-amber-50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{s.icon}</span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-slate-900 text-amber-300">
                  {s.stepNum}
                </span>
              </div>
              <h4 className="text-xs font-black text-slate-900 line-clamp-1">{s.badge}</h4>
              <p className="text-[11px] font-medium text-slate-700 font-sans line-clamp-2 mt-1">
                {s.tamilDesc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 3 Key Trust Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="p-3.5 rounded-2xl bg-white border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-300 border-2 border-slate-900 flex items-center justify-center text-xl shrink-0 shadow-[2px_2px_0px_0px_#0f172a]">
            🚫
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900 font-mono">0% இடைத்தரகர் கமிஷன்</h4>
            <p className="text-[10px] text-slate-600 font-serif">0% Middlemen Commission</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-300 border-2 border-slate-900 flex items-center justify-center text-xl shrink-0 shadow-[2px_2px_0px_0px_#0f172a]">
            ⚖️
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900 font-mono">100% சட்டப்பூர்வ பாதுகாப்பு</h4>
            <p className="text-[10px] text-slate-600 font-serif">100% Supreme Court Legal Compliance</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-300 border-2 border-slate-900 flex items-center justify-center text-xl shrink-0 shadow-[2px_2px_0px_0px_#0f172a]">
            💰
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900 font-mono">80% நேரடி தொழிற்சாலை சேமிப்பு</h4>
            <p className="text-[10px] text-slate-600 font-serif">80% Factory Direct Savings</p>
          </div>
        </div>
      </div>

    </section>
  );
}
