import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../Component/Navbar';
import BackgroundFireworks from '../Component/BackgroundFireworks';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function About() {
  const [blasts, setBlasts] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newBlasts = Array.from({ length: 8 }).map(() => ({
        id: Date.now() + Math.random(),
        top: Math.random() * 70 + 10,
        left: Math.random() * 90,
        color: ['#ef4444', '#f59e0b', '#10b981', '#06b6d4', '#d946ef', '#ec4899', '#ffffff'][Math.floor(Math.random() * 7)],
      }));
      setBlasts((prev) => [...prev, ...newBlasts]);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen text-white flex flex-col bg-[#050505] selection:bg-amber-400 selection:text-slate-950 relative overflow-x-hidden">
      {/* Background multi-color fireworks animation */}
      <BackgroundFireworks />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <div className="flex-grow pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto w-full space-y-12">
          {/* Banner Frame */}
          <div className="hidden md:block w-full h-64 md:h-80 overflow-hidden rounded-3xl border border-white/20 shadow-2xl bg-neutral-900/90 p-2 relative">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-400 via-rose-500 via-purple-500 to-cyan-400" />
            <img src="/aboutbanner.png" alt="About banner" className="w-full h-full object-cover rounded-2xl" />
          </div>

          {/* Story Section */}
          <section className="grid md:grid-cols-2 gap-10 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="relative w-full h-96 rounded-3xl bg-neutral-900/90 border border-white/15 p-2 shadow-2xl overflow-hidden"
            >
              <img src="/aboutimage.jpg" alt="About Us" className="w-full h-full object-cover rounded-2xl" />
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="space-y-4 bg-neutral-900/85 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-white/15 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400" />
              <h2 className="text-3xl font-black bg-gradient-to-r from-white via-amber-200 to-rose-200 bg-clip-text text-transparent">
                About Deepa Crackers
              </h2>
              <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">
                <span>🪔 THIRUTHURAIPOONDI</span> • <span className="text-rose-400">Festive Brilliance & Safety</span>
              </h3>
              <p className="text-xs md:text-sm leading-relaxed text-neutral-300">
                Deepa Crackers is a premier supplier of high quality fireworks, ground chakkars, sparklers, and multi-color sky shots based in Thiruthuraipoondi. From traditional Indian festival celebrations to modern extravaganzas, our products bring sparkle to every family moment.
              </p>
              <p className="text-xs md:text-sm leading-relaxed text-neutral-300">
                Our products represent 100% legal compliance, strict quality control, vivid colors, and dazzling festive fun.
              </p>
              <p className="text-xs md:text-sm leading-relaxed text-neutral-300">
                With a strong distribution network across Thiruthuraipoondi and Tamil Nadu, we proudly serve wholesale and retail buyers with customized orders and unmatched value.
              </p>
            </motion.div>
          </section>

          {/* Discount Festive Section with Blast Particles */}
          <section className="py-16 overflow-hidden rounded-3xl bg-gradient-to-b from-neutral-900/90 via-neutral-950 to-neutral-900/90 backdrop-blur-md border border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.15)] relative px-6 text-center">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-red-500 via-amber-400 via-emerald-400 via-cyan-400 to-purple-500 animate-pulse" />
            <div className="absolute inset-0 z-0 pointer-events-none">
              {blasts.map((blast) => (
                <div
                  key={blast.id}
                  className="absolute w-3.5 h-3.5 rounded-full animate-blast shadow-lg"
                  style={{ 
                    top: `${blast.top}%`, 
                    left: `${blast.left}%`, 
                    backgroundColor: blast.color,
                    boxShadow: `0 0 14px ${blast.color}`
                  }}
                />
              ))}
            </div>
            <div className="relative z-10 max-w-3xl mx-auto space-y-4">
              <h2 className="text-2xl md:text-4xl font-black bg-gradient-to-r from-amber-300 via-rose-300 to-cyan-300 bg-clip-text text-transparent">
                🎆 Exclusive Festive Discounts & Direct Transport!
              </h2>
              <p className="text-xs md:text-sm text-neutral-200">
                Celebrate Diwali with <strong className="text-amber-400 font-black">Deepa Crackers, Thiruthuraipoondi</strong>. Your one-stop shop for elite fireworks and festive delights.
              </p>
              <p className="text-xs text-neutral-400">
                Explore ground chakkars, flower pots, rockets, gift boxes, skyshots, sparklers, and more with simple online product enquiry and direct transport delivery.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-bold">
                <a href="tel:+918072897834" className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 text-white font-black shadow-lg shadow-red-600/30 hover:scale-105 transition-all border border-amber-400/40">
                  📞 +91 8072 897 834
                </a>
                <a href="mailto:deepatraders1985@gmail.com" className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black border border-emerald-400 shadow-md hover:scale-105 transition-all">
                  📧 deepatraders1985@gmail.com
                </a>
              </div>
            </div>
          </section>

          {/* Motto, Vision & Mission Cards with distinct vibrant colors */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Our Motto",
                icon: "🛡️",
                gradient: "from-amber-500 to-orange-600",
                border: "border-amber-500/30",
                content: "Our motto is SAFETY FIRST. Deepa Crackers adopts several stringent quality testing measures and safety norms defined by the fireworks explosive act.",
              },
              {
                title: "Our Vision",
                icon: "✨",
                gradient: "from-cyan-500 to-blue-600",
                border: "border-cyan-500/30",
                content: "Our vision is to make genuine, high-quality fireworks easily accessible across Thiruthuraipoondi and all parts of Tamil Nadu with total reliability.",
              },
              {
                title: "Our Mission",
                icon: "🚀",
                gradient: "from-fuchsia-500 to-rose-600",
                border: "border-fuchsia-500/30",
                content: "We respect consumer benefit, safety, superior quality, beautiful packaging, effective service, and reasonable wholesale/retail pricing.",
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                viewport={{ once: true }}
                className={`bg-neutral-900/85 backdrop-blur-md rounded-2xl p-6 border ${card.border} hover:scale-102 shadow-xl space-y-3 transition-all relative overflow-hidden`}
              >
                <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${card.gradient}`} />
                <div className="flex items-center gap-2 border-b border-dashed border-neutral-800 pb-2">
                  <span className="text-xl">{card.icon}</span>
                  <h3 className={`text-xl font-black bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
                    {card.title}
                  </h3>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">{card.content}</p>
              </motion.div>
            ))}
          </section>
        </div>

        {/* Footer */}
        <footer className="bg-black border-t border-white/10 text-neutral-400 py-12 px-6 mt-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-500 via-amber-400 to-cyan-500" />
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h2 className="text-xl font-black text-amber-400 mb-2">DEEPA CRACKERS</h2>
              <p className="text-xs text-neutral-400 leading-relaxed mb-2">
                Spark joy, spread light—fireworks crafted for your family festival celebration.
              </p>
              <p className="text-xs text-neutral-300 font-bold uppercase">📍 Deepa Crackers, RS Road, THIRUTHURAIPOONDI</p>
            </div>

            <div>
              <h2 className="text-lg font-black text-white mb-2">Contact Us</h2>
              <p className="text-xs text-neutral-400">RS Road, Thiruthuraipoondi,</p>
              <p className="text-xs text-neutral-400">Tamil Nadu</p>
              <a href="tel:+918072897834" className="text-xs font-bold block mt-2 text-amber-400 hover:underline">+91 8072 897 834</a>
              <a href="mailto:deepatraders1985@gmail.com" className="text-xs font-bold block mt-1 text-neutral-300 hover:underline">deepatraders1985@gmail.com</a>
              <p className="text-xs text-neutral-500 mt-1">info@deepacrackers.com</p>
            </div>

            <div>
              <h2 className="text-lg font-black text-white mb-2">Quick Navigation</h2>
              <ul className="space-y-1 text-xs text-neutral-400">
                <li><a href="/" className="hover:text-amber-400 transition">Home</a></li>
                <li><a href="/status" className="hover:text-amber-400 transition">Track Order</a></li>
                <li><a href="/safety-tips" className="hover:text-amber-400 transition">Safety Tips</a></li>
                <li><a href="/about-us" className="hover:text-amber-400 transition">About Us</a></li>
                <li><a href="/contact-us" className="hover:text-amber-400 transition">Contact Us</a></li>
              </ul>
            </div>
          </div>

          <div className="max-w-7xl mx-auto border-t border-white/10 mt-8 pt-6 text-center text-xs font-bold text-neutral-500">
            © {new Date().getFullYear()} <span className="text-amber-400">Deepa Crackers</span> - THIRUTHURAIPOONDI. All rights reserved.
          </div>
        </footer>
      </div>

      <style>
        {`
          @keyframes blast {
            0% { transform: scale(0.5); opacity: 1; }
            40% { transform: scale(1.6); opacity: 0.9; }
            100% { transform: scale(2.8); opacity: 0; }
          }
          .animate-blast {
            animation: blast 1.3s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
}