import React from 'react';
import Navbar from '../Component/Navbar';
import BackgroundFireworks from '../Component/BackgroundFireworks';
import { MapPin, Phone, Mail, Globe } from 'lucide-react';

export default function Contact() {
  const contactCards = [
    {
      icon: MapPin,
      title: "Store Location",
      gradient: "from-amber-500 to-orange-600",
      border: "border-amber-500/30",
      content: ["Deepa Crackers", "RS Road, Thiruthuraipoondi", "Tamil Nadu"],
    },
    {
      icon: Phone,
      title: "Phone Support",
      gradient: "from-emerald-500 to-teal-600",
      border: "border-emerald-500/30",
      content: [
        { text: "+91 8072 897 834", href: "tel:+918072897834" },
      ],
    },
    {
      icon: Mail,
      title: "Email Address",
      gradient: "from-fuchsia-500 to-rose-600",
      border: "border-fuchsia-500/30",
      content: [{ text: "deepatraders1985@gmail.com", href: "mailto:deepatraders1985@gmail.com" }],
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col selection:bg-amber-400 selection:text-slate-950 relative overflow-x-hidden">
      {/* Background continuous fireworks */}
      <BackgroundFireworks />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-grow pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto w-full space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-red-600/30 via-amber-500/30 to-rose-500/30 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
              ✨ Thiruthuraipoondi Fireworks Hub
            </div>
            <h1 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-white via-amber-200 to-rose-200 bg-clip-text text-transparent">
              Contact Us
            </h1>
            <p className="text-xs md:text-sm text-neutral-300">
              Get in touch with <strong className="text-amber-400 font-bold">Deepa Crackers, Thiruthuraipoondi</strong> for wholesale and retail enquiries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactCards.map((card, index) => (
              <div key={index} className={`bg-neutral-900/85 backdrop-blur-md rounded-2xl p-6 border ${card.border} hover:scale-102 shadow-xl space-y-3 text-center transition-all relative overflow-hidden`}>
                <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${card.gradient}`} />
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${card.gradient} flex items-center justify-center text-slate-950 mx-auto shadow-lg font-black`}>
                  <card.icon className="h-6 w-6" />
                </div>
                <h2 className="text-lg font-black text-white">{card.title}</h2>
                <div className="space-y-1">
                  {card.content.map((item, idx) => (
                    <div key={idx}>
                      {typeof item === "string" ? (
                        <p className="text-xs text-neutral-300">{item}</p>
                      ) : (
                        <a href={item.href} className="text-xs font-bold text-amber-300 hover:underline block">
                          {item.text}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Map Box */}
          <div className="bg-neutral-900/85 backdrop-blur-md rounded-3xl p-6 border border-white/15 shadow-2xl space-y-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-400 via-rose-500 to-cyan-400" />
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Globe className="h-5 w-5 text-amber-400" /> Find Deepa Crackers Store Location
            </h2>
            <div className="rounded-2xl border border-neutral-800 overflow-hidden shadow-inner">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15694.0254217144!2d79.638421!3d10.528431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a554ff015555555%3A0x123456789abcdef!2sThiruthuraipoondi%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="350"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </main>

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
    </div>
  );
}
