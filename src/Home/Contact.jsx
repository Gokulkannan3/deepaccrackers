import React from 'react';
import Navbar from '../Component/Navbar';
import { MapPin, Phone, Mail, Globe, MessageCircle } from 'lucide-react';

export default function Contact() {
  const contactCards = [
    {
      icon: MapPin,
      title: "Store Location",
      content: ["Deepa Crackers", "RS Road, Thiruthuraipoondi", "Tamil Nadu"],
    },
    {
      icon: Phone,
      title: "Phone Support",
      content: [
        { text: "+91 8072 897 834", href: "tel:+918072897834" },
      ],
    },
    {
      icon: Mail,
      title: "Email Address",
      content: [{ text: "deepatraders1985@gmail.com", href: "mailto:deepatraders1985@gmail.com" }],
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-slate-900 flex flex-col font-mono selection:bg-amber-300">
      <Navbar />

      <main className="flex-grow pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto w-full space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900">Contact Us</h1>
          <p className="text-xs md:text-sm font-serif text-slate-700">
            Get in touch with <strong className="text-slate-900">Deepa Crackers, Thiruthuraipoondi</strong> for wholesale and retail enquiries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactCards.map((card, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(30,41,59,0.9)] space-y-3 text-center">
              <div className="w-10 h-10 rounded-xl bg-amber-200 border-2 border-slate-900 flex items-center justify-center text-slate-900 mx-auto shadow-[2px_2px_0px_0px_#0f172a]">
                <card.icon className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900">{card.title}</h2>
              <div className="space-y-1">
                {card.content.map((item, idx) => (
                  <div key={idx}>
                    {typeof item === "string" ? (
                      <p className="text-xs text-slate-700 font-serif">{item}</p>
                    ) : (
                      <a href={item.href} className="text-xs font-bold text-slate-900 hover:underline block">
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
        <div className="bg-white rounded-3xl p-6 border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(30,41,59,0.9)] space-y-4">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Globe className="h-5 w-5 text-amber-700" /> Find Deepa Crackers Store Location
          </h2>
          <div className="rounded-2xl border-2 border-slate-900 overflow-hidden shadow-[2px_2px_0px_0px_#0f172a]">
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
    </div>
  );
}
