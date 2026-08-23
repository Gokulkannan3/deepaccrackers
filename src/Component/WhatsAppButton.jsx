import React from 'react';
import { motion } from 'framer-motion';

export default function WhatsAppButton({ hasActiveCart = false }) {
  const phoneNumber = "918072897834";
  const whatsappUrl = `https://wa.me/${phoneNumber}`;

  return (
    <motion.aside
      aria-label="Contact on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={`fixed z-50 transition-all duration-300 ${
        hasActiveCart ? 'bottom-24 right-4 sm:bottom-28 sm:right-6' : 'bottom-6 right-6'
      }`}
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Deepa Crackers on WhatsApp"
        className="group relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-[0_8px_25px_rgba(37,211,102,0.45)] hover:shadow-[0_12px_32px_rgba(37,211,102,0.65)] hover:scale-110 active:scale-95 transition-all border-2 border-white/80"
      >
        {/* Pulsing ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-40 group-hover:opacity-60 pointer-events-none" />

        {/* Official WhatsApp SVG Icon */}
        <svg
          viewBox="0 0 24 24"
          className="w-8 h-8 sm:w-9 sm:h-9 fill-current z-10 drop-shadow"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12.031 2C6.505 2 2.016 6.49 2.016 12.016c0 1.94.558 3.754 1.523 5.295L2.001 22.016l4.887-1.493a9.98 9.98 0 0 0 5.143 1.493c5.525 0 10.015-4.49 10.015-10.016C22.046 6.49 17.556 2 12.031 2zm5.79 14.28c-.24.67-1.39 1.3-1.92 1.38-.5.08-1.14.12-3.7-0.94-3.14-1.3-5.16-4.51-5.32-4.72-.16-.21-1.27-1.69-1.27-3.23 0-1.54.81-2.3 1.09-2.61.28-.31.62-.39.83-.39.21 0 .42 0 .6.01.19.01.44-.07.69.53.25.6.86 2.09.93 2.24.07.16.12.34.02.54-.1.21-.15.34-.3.51-.15.18-.32.4-.46.54-.15.15-.31.32-.13.63.18.31.8 1.32 1.72 2.14 1.18 1.05 2.17 1.37 2.48 1.53.31.15.49.13.67-.08.18-.21.78-.91.99-1.22.21-.31.42-.26.7-.16.29.1 1.82.86 2.13 1.01.31.16.52.23.6.36.08.14.08.79-.16 1.46z" />
        </svg>

        {/* Hover Tooltip / Badge */}
        <span className="absolute right-full mr-3 px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-sm text-white text-xs font-bold whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all pointer-events-none hidden sm:flex items-center gap-1.5 border border-slate-700">
          <span className="w-2 h-2 rounded-full bg-[#25D366]" />
          <span>Chat with Deepa Crackers (+91 8072 897 834)</span>
        </span>
      </a>
    </motion.aside>
  );
}
