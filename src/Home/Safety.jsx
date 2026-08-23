import React from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle, XCircle, Eye, Users, Droplets, Flame } from 'lucide-react';
import Navbar from '../Component/Navbar';

const dosData = [
  { icon: CheckCircle, title: "Follow Pack Instructions", description: "Display and ignite fireworks only according to manufacturer instructions." },
  { icon: Shield, title: "100% Legal Compliant Crackers", description: "Purchase fireworks exclusively from licensed and authorized suppliers like Deepa Crackers." },
  { icon: Eye, title: "Outdoor Open Use Only", description: "Ignite fireworks outdoors in safe open areas away from dry grass." },
  { icon: Users, title: "Maintain Safe Distance", description: "Ignite one firework at a time. All spectators should watch from a safe distance." },
  { icon: Droplets, title: "Keep Water Ready", description: "Always keep two buckets of water or sand nearby for emergency response." },
];

const dontsData = [
  { icon: XCircle, title: "Never Make Custom Fireworks", description: "Never tamper with or assemble homemade firecracker mixtures." },
  { icon: Flame, title: "Never Relight Duds", description: "Never attempt to re-ignite fireworks that failed to burst fully." },
  { icon: AlertTriangle, title: "Avoid Loose Clothing", description: "Never wear loose or flammable synthetic clothing while lighting crackers." },
  { icon: XCircle, title: "Don't Touch Leftovers", description: "Never pick up active leftovers immediately after firework display." },
  { icon: Shield, title: "Don't Carry in Pockets", description: "Never carry fireworks or matches directly in your pockets or bags." },
];

export default function Safety() {
  return (
    <div className="min-h-screen bg-[#FAF6EE] text-slate-900 flex flex-col font-mono selection:bg-amber-300">
      <Navbar />

      <main className="flex-grow pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900">Festive Safety Guidelines</h1>
          <p className="text-xs font-bold text-amber-800 uppercase tracking-widest">Deepa Crackers • THIRUTHURAIPOONDI</p>
          <p className="text-xs md:text-sm font-serif text-slate-700 leading-relaxed">
            Please follow these essential Do's and Don'ts while purchasing, storing, and lighting crackers to ensure a safe, joyful celebration for your entire family.
          </p>
        </div>

        {/* Do's Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b-2 border-dashed border-slate-900 pb-2">
            <CheckCircle className="h-6 w-6 text-emerald-600" />
            <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase">Do's for Safe Celebration</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dosData.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(30,41,59,0.9)] space-y-2"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-100 border-2 border-slate-900 flex items-center justify-center text-emerald-900 shadow-[2px_2px_0px_0px_#0f172a]">
                  <item.icon className="h-4 w-4" />
                </div>
                <h3 className="font-black text-slate-900 text-sm">{item.title}</h3>
                <p className="text-xs text-slate-600 font-serif leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Don'ts Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b-2 border-dashed border-slate-900 pb-2">
            <XCircle className="h-6 w-6 text-rose-600" />
            <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase">Don'ts to Avoid Mishaps</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dontsData.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(30,41,59,0.9)] space-y-2"
              >
                <div className="w-9 h-9 rounded-xl bg-rose-100 border-2 border-slate-900 flex items-center justify-center text-rose-900 shadow-[2px_2px_0px_0px_#0f172a]">
                  <item.icon className="h-4 w-4" />
                </div>
                <h3 className="font-black text-slate-900 text-sm">{item.title}</h3>
                <p className="text-xs text-slate-600 font-serif leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Caution Box */}
        <section className="p-6 rounded-2xl bg-amber-100 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(30,41,59,0.9)] space-y-2 text-center">
          <AlertTriangle className="h-8 w-8 text-amber-800 mx-auto" />
          <h3 className="text-base font-black text-slate-900">Important Statutory Notice</h3>
          <p className="text-xs text-slate-800 font-serif max-w-2xl mx-auto leading-relaxed">
            Always supervise children closely while lighting sparklers or flower pots. In case of emergency, immediately wash burns with clean cold water and seek medical attention.
          </p>
        </section>
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
            <p className="text-xs font-serif text-slate-700">Main Store Outlet Center,</p>
            <p className="text-xs font-serif text-slate-700">RS Road, THIRUTHURAIPOONDI, Tamil Nadu</p>
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
