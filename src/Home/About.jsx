import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../Component/Navbar';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function About() {
  const [blasts, setBlasts] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newBlasts = Array.from({ length: 6 }).map(() => ({
        id: Date.now() + Math.random(),
        top: Math.random() * 60 + 10,
        left: Math.random() * 90,
        color: ['#f59e0b', '#ec4899', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6'][Math.floor(Math.random() * 6)],
      }));
      setBlasts((prev) => [...prev, ...newBlasts]);
    }, 900);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen text-slate-900 flex flex-col bg-[#FAF6EE] font-mono selection:bg-amber-300">
      <Navbar />

      <div className="flex-grow pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto w-full space-y-12">
        {/* Banner Frame */}
        <div className="hidden md:block w-full h-64 md:h-80 overflow-hidden rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(30,41,59,0.9)] bg-white p-2">
          <img src="/aboutbanner.png" alt="About banner" className="w-full h-full object-cover rounded-2xl" />
        </div>

        {/* Story Section */}
        <section className="grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="relative w-full h-96 rounded-3xl bg-white border-2 border-slate-900 p-2 shadow-[6px_6px_0px_0px_rgba(30,41,59,0.9)] overflow-hidden"
          >
            <div className="absolute inset-0 -z-10">
              {['rocket1', 'rocket2', 'rocket3'].map((rocket, i) => (
                <div
                  key={rocket}
                  className={`absolute w-5 h-14 bg-gradient-to-t from-amber-400 to-red-500 rounded-t-full animate-${rocket}`}
                  style={{ left: `${i * 60 + 20}px`, bottom: `${i * 20 + 10}px` }}
                />
              ))}
            </div>
            <img src="/aboutimage.jpg" alt="About Us" className="w-full h-full object-cover rounded-2xl" />
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="space-y-4 bg-white p-6 md:p-8 rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(30,41,59,0.9)]"
          >
            <h2 className="text-3xl font-black text-slate-900">About Deepa Crackers</h2>
            <h3 className="text-lg font-bold text-amber-700 font-serif">THIRUTHURAIPOONDI • Festive Brilliance & Safety</h3>
            <p className="text-xs md:text-sm font-serif leading-relaxed text-slate-700">
              Deepa Crackers is a premier supplier of high quality fireworks, ground chakkars, sparklers, and multi-color sky shots based in Thiruthuraipoondi. From traditional Indian festival celebrations to modern extravaganzas, our products bring sparkle to every family moment.
            </p>
            <p className="text-xs md:text-sm font-serif leading-relaxed text-slate-700">
              Our products represent 100% legal compliance, strict quality control, vivid colors, and dazzling festive fun.
            </p>
            <p className="text-xs md:text-sm font-serif leading-relaxed text-slate-700">
              With a strong distribution network across Thiruthuraipoondi and Tamil Nadu, we proudly serve wholesale and retail buyers with customized orders and unmatched value.
            </p>
          </motion.div>
        </section>

        {/* Discount Festive Section with Blast Particles */}
        <section className="py-16 overflow-hidden rounded-3xl bg-white border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(30,41,59,0.9)] relative px-6 text-center">
          <div className="absolute inset-0 z-0 pointer-events-none">
            {blasts.map((blast) => (
              <div
                key={blast.id}
                className="absolute w-3 h-3 rounded-full animate-blast"
                style={{ top: `${blast.top}%`, left: `${blast.left}%`, backgroundColor: blast.color }}
              />
            ))}
          </div>
          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <h2 className="text-2xl md:text-4xl font-black text-slate-900">
              🎆 Exclusive Festive Discounts & Direct Transport!
            </h2>
            <p className="text-xs md:text-sm font-serif text-slate-700">
              Celebrate Diwali with <strong className="text-slate-900">Deepa Crackers, Thiruthuraipoondi</strong>. Your one-stop shop for elite fireworks and festive delights.
            </p>
            <p className="text-xs text-slate-600 font-serif">
              Explore ground chakkars, flower pots, rockets, gift boxes, skyshots, sparklers, and more with simple online product enquiry and direct transport delivery.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-bold">
              <a href="tel:+918072897834" className="px-4 py-2 rounded-xl bg-amber-300 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]">
                📞 +91 8072 897 834
              </a>
              <a href="mailto:deepatraders1985@gmail.com" className="px-4 py-2 rounded-xl bg-amber-100 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]">
                📧 deepatraders1985@gmail.com
              </a>
            </div>
          </div>
        </section>

        {/* Motto, Vision & Mission Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Our Motto",
              content: "Our motto is SAFETY FIRST. Deepa Crackers adopts several stringent quality testing measures and safety norms defined by the fireworks explosive act.",
            },
            {
              title: "Our Vision",
              content: "Our vision is to make genuine, high-quality fireworks easily accessible across Thiruthuraipoondi and all parts of Tamil Nadu with total reliability.",
            },
            {
              title: "Our Mission",
              content: "We respect consumer benefit, safety, superior quality, beautiful packaging, effective service, and reasonable wholesale/retail pricing.",
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(30,41,59,0.9)] space-y-3"
            >
              <h3 className="text-xl font-black text-slate-900 border-b-2 border-dashed border-slate-800 pb-2">{card.title}</h3>
              <p className="text-xs text-slate-700 font-serif leading-relaxed">{card.content}</p>
            </motion.div>
          ))}
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t-2 border-slate-900 text-slate-800 py-12 px-6 mt-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-xl font-black text-slate-900 mb-2">DEEPA CRACKERS</h2>
            <p className="text-xs text-slate-600 font-serif leading-relaxed mb-2">
              Spark joy, spread light—fireworks crafted for your family festival celebration.
            </p>
            <p className="text-xs text-slate-900 font-bold uppercase">📍 Deepa Crackers, RS Road, THIRUTHURAIPOONDI</p>
          </div>

          <div>
            <h2 className="text-lg font-black text-slate-900 mb-2">Contact Us</h2>
            <p className="text-xs font-serif text-slate-700">RS Road, Thiruthuraipoondi,</p>
            <p className="text-xs font-serif text-slate-700">Tamil Nadu</p>
            <a href="tel:+918072897834" className="text-xs font-bold block mt-2 hover:underline">+91 8072 897 834</a>
            <a href="mailto:deepatraders1985@gmail.com" className="text-xs font-bold block mt-1 hover:underline">deepatraders1985@gmail.com</a>
            <p className="text-xs text-slate-500 mt-1">info@deepacrackers.com</p>
          </div>

          <div>
            <h2 className="text-lg font-black text-slate-900 mb-2">Quick Navigation</h2>
            <ul className="space-y-1 text-xs">
              <li><a href="/" className="hover:underline">Home</a></li>
              <li><a href="/status" className="hover:underline">Track Order</a></li>
              <li><a href="/safety-tips" className="hover:underline">Safety Tips</a></li>
              <li><a href="/about-us" className="hover:underline">About Us</a></li>
              <li><a href="/contact-us" className="hover:underline">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t-2 border-dashed border-slate-800 mt-8 pt-6 text-center text-xs font-bold text-slate-600">
          © {new Date().getFullYear()} <span className="text-slate-900">Deepa Crackers</span> - THIRUTHURAIPOONDI. All rights reserved.
        </div>
      </footer>

      <style>
        {`
          @keyframes rocket1 {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(-200px) rotate(20deg); opacity: 0; }
          }
          @keyframes rocket2 {
            0% { transform: translateY(0) rotate(-10deg); opacity: 1; }
            100% { transform: translateY(-220px) rotate(30deg); opacity: 0; }
          }
          @keyframes rocket3 {
            0% { transform: translateY(0) rotate(15deg); opacity: 1; }
            100% { transform: translateY(-180px) rotate(-20deg); opacity: 0; }
          }
          .animate-rocket1 { animation: rocket1 3s linear infinite; }
          .animate-rocket2 { animation: rocket2 4s ease-in-out infinite; }
          .animate-rocket3 { animation: rocket3 3.5s ease-in-out infinite; }

          @keyframes blast {
            0% { transform: scale(0.5); opacity: 1; }
            40% { transform: scale(1.5); opacity: 0.8; }
            100% { transform: scale(2.5); opacity: 0; }
          }
          .animate-blast {
            animation: blast 1.4s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
}