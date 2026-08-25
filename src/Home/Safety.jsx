import React from "react";
import { motion } from "framer-motion";
import { Shield, AlertTriangle, CheckCircle, XCircle, Flame, Droplets, Eye, Users } from "lucide-react";
import Navbar from "../Component/Navbar";
import BackgroundFireworks from "../Component/BackgroundFireworks";
import "../App.css";

const dosData = [
  {
    icon: CheckCircle,
    title: "Follow Instructions",
    description: "Display fireworks strictly as per the instructions mentioned on the pack.",
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: Shield,
    title: "Branded Fireworks",
    description: "Buy fireworks from authorized / reputed manufacturers only like Deepa Crackers.",
    color: "from-teal-500 to-cyan-600",
  },
  {
    icon: Eye,
    title: "Outdoor Use Only",
    description: "Use fireworks only outdoors in safe, open spaces away from dry grass and buildings.",
    color: "from-cyan-500 to-blue-600",
  },
  {
    icon: Users,
    title: "Safe Distance",
    description: "Light only one firework at a time, by one person. Others should watch from a safe distance.",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: Droplets,
    title: "Keep Water Ready",
    description: "Keep two buckets of water or sand handy in the event of fire or any mishap.",
    color: "from-indigo-500 to-emerald-600",
  },
];

const dontsData = [
  {
    icon: XCircle,
    title: "Don't Make Tricks",
    description: "Never make your own fireworks or tamper with factory cracker casings.",
    color: "from-rose-500 to-red-600",
  },
  {
    icon: Flame,
    title: "Don't Relight Duds",
    description: "Never try to re-light or pick up fireworks that have not ignited fully.",
    color: "from-red-500 to-orange-600",
  },
  {
    icon: AlertTriangle,
    title: "Don't Wear Loose Clothes",
    description: "Do not wear loose synthetic or flammable clothing while using fireworks.",
    color: "from-orange-500 to-amber-600",
  },
  {
    icon: XCircle,
    title: "Don't Touch Leftovers",
    description: "After fireworks display, never pick up leftovers immediately; they may still be hot.",
    color: "from-rose-600 to-pink-600",
  },
  {
    icon: Shield,
    title: "Don't Carry in Pockets",
    description: "Never carry fireworks or matches in your pockets or bags.",
    color: "from-pink-600 to-purple-600",
  },
];

export default function Safety() {
  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden relative selection:bg-amber-400 selection:text-slate-950">
      {/* Continuous Background Rockets & Fireworks Animation */}
      <BackgroundFireworks />

      {/* Main content with higher z-index */}
      <div className="relative z-10">
        <Navbar />

        {/* Hero Section */}
        <section className="pt-28 pb-12 px-4 sm:px-6 relative overflow-hidden">
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-10 space-y-4"
            >
              <div className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/20 via-amber-500/20 to-rose-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
                ✨ Deepa Crackers • Safety Protocol
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-white via-amber-100 to-rose-200 bg-clip-text text-transparent tracking-tight">
                Safety Tips & Guidelines
              </h1>
              <p className="text-xl md:text-2xl font-black text-amber-400">
                Safe Celebrations, Happy Diwali 🪔
              </p>
              <p className="text-sm md:text-base text-neutral-300 leading-relaxed max-w-3xl mx-auto">
                There are certain essential Do's & Don'ts to follow while purchasing, bursting, and storing crackers. A little
                negligence or carelessness can cause injury. Always celebrate responsibly!
              </p>
            </motion.div>
          </div>
        </section>

        {/* Do's Section */}
        <section className="py-10 px-4 sm:px-6 relative">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-emerald-400 mb-4 flex items-center justify-center gap-3">
                <CheckCircle className="w-9 h-9 text-emerald-400 animate-pulse" />
                <span>Do's for Safe Celebration</span>
              </h2>
              <div
                className="w-28 h-1.5 mx-auto rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 shadow-[0_0_15px_#10b981]"
              />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dosData.map(({ icon: Icon, title, description, color }, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.08 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="group relative rounded-2xl p-6 overflow-hidden bg-neutral-900/90 backdrop-blur-md border border-emerald-500/30 hover:border-emerald-400 shadow-xl transition-all"
                >
                  <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${color}`} />
                  <div className="relative z-10">
                    <div className={`flex items-center justify-center w-14 h-14 rounded-2xl mb-4 bg-gradient-to-tr ${color} text-slate-950 font-black group-hover:scale-110 transition-transform shadow-lg`}>
                      <Icon className="w-7 h-7" />
                    </div>

                    <h3 className="text-lg font-bold mb-2 text-white">
                      {title}
                    </h3>

                    <p className="text-neutral-300 text-sm leading-relaxed">{description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Don'ts Section */}
        <section className="py-10 px-4 sm:px-6 relative">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-rose-500 mb-4 flex items-center justify-center gap-3">
                <XCircle className="w-9 h-9 text-rose-500 animate-pulse" />
                <span>Don'ts to Avoid Mishaps</span>
              </h2>
              <div
                className="w-28 h-1.5 mx-auto rounded-full bg-gradient-to-r from-rose-500 to-amber-500 shadow-[0_0_15px_#f43f5e]"
              />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dontsData.map(({ icon: Icon, title, description, color }, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.08 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="group relative rounded-2xl p-6 overflow-hidden bg-neutral-900/90 backdrop-blur-md border border-rose-500/30 hover:border-rose-400 shadow-xl transition-all"
                >
                  <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${color}`} />
                  <div className={`flex items-center justify-center w-14 h-14 rounded-2xl mb-4 bg-gradient-to-tr ${color} text-white font-black group-hover:scale-110 transition-transform shadow-lg`}>
                    <Icon className="w-7 h-7" />
                  </div>

                  <h3 className="text-lg font-bold mb-2 text-white">
                    {title}
                  </h3>

                  <p className="text-neutral-300 text-sm leading-relaxed">{description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Warning Banner */}
        <section className="py-10 px-4 sm:px-6 relative">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative rounded-3xl p-8 text-center overflow-hidden bg-gradient-to-r from-red-950/60 via-neutral-900/90 to-amber-950/60 backdrop-blur-md border border-amber-500/40 shadow-2xl"
            >
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-red-500 via-amber-400 to-rose-500 animate-pulse" />
              <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4 animate-bounce" />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-300 via-white to-rose-300 bg-clip-text text-transparent mb-3">
                Important Statutory Reminder
              </h3>
              <p className="text-base text-neutral-300 leading-relaxed max-w-2xl mx-auto">
                Always prioritize family safety over celebrations. Ensure young children are accompanied by adults while
                lighting sparklers. Keep a first aid kit and clean cold water handy at all times.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black text-white py-14 mt-16 px-6 rounded-3xl mx-4 mb-8 shadow-2xl border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-500 via-amber-400 to-cyan-500" />
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <h2 className="text-2xl font-extrabold text-amber-400 mb-3">DEEPA CRACKERS</h2>
              <p className="text-neutral-300 text-sm font-medium">Thiruthuraipoondi & Sivakasi Direct</p>
              <p className="text-neutral-400 text-xs mt-2 leading-relaxed">
                Spark joy, spread light—genuine Sivakasi fireworks crafted for safe festive celebrations.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">Contact Information</h2>
              <p className="text-neutral-300 text-xs">Deepa Crackers Retail & Wholesale</p>
              <p className="text-neutral-300 text-xs mt-1">
                RS Road, THIRUTHURAIPOONDI, Tamil Nadu
              </p>
              <a href="tel:+918072897834" className="text-amber-400 hover:underline block text-xs mt-2 font-semibold">+91 8072 897 834</a>
              <p className="text-neutral-400 text-xs mt-1">deepatraders1985@gmail.com</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">Quick Navigation</h2>
              <ul className="space-y-1.5 text-xs text-neutral-400">
                <li><a href="/" className="hover:text-amber-400 transition">Home</a></li>
                <li><a href="/status" className="hover:text-amber-400 transition">Track Order</a></li>
                <li><a href="/safety-tips" className="hover:text-amber-400 transition">Safety Tips</a></li>
                <li><a href="/about-us" className="hover:text-amber-400 transition">About Us</a></li>
                <li><a href="/contact-us" className="hover:text-amber-400 transition">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-neutral-500">
            © {new Date().getFullYear()} <span className="text-amber-400 font-bold">Deepa Crackers</span> - THIRUTHURAIPOONDI. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}
