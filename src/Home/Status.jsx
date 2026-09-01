import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Package, Truck, CheckCircle, Clock, MapPin, Phone, Calendar, Download, ChevronDown, ChevronUp, Star } from "lucide-react";
import Navbar from "../Component/Navbar";
import BackgroundFireworks from "../Component/BackgroundFireworks";
import { API_BASE_URL } from "../../Config";
import axios from 'axios';

export default function Status() {
  const [searchForm, setSearchForm] = useState({ mobile_number: "" });
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [expandedTimelines, setExpandedTimelines] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const cleaned = value.replace(/\D/g, "").slice(-10);
    setSearchForm(prev => ({ ...prev, [name]: cleaned }));
  };

  const toggleTimeline = (orderId) => {
    setExpandedTimelines(prev => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const fetchTransportDetails = async (orderId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/tracking/filtered-bookings`, {
        params: { status: 'dispatched,delivered' }
      });
      const booking = res.data.find(b => b.order_id === orderId || b.id === orderId);
      return booking ? {
        transport_name: booking.transport_name,
        lr_number: booking.lr_number,
        transport_contact: booking.transport_contact
      } : null;
    } catch (error) {
      console.error("Failed to fetch transport details:", error);
      return null;
    }
  };

  const searchOrders = async () => {
    if (!searchForm.mobile_number.trim()) {
      alert("Please enter mobile number");
      return;
    }
    if (searchForm.mobile_number.length !== 10) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }

    setIsLoading(true);
    try {
      const [bookingsRes, quotationsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/direct/bookings/search`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mobile_number: searchForm.mobile_number })
        }),
        fetch(`${API_BASE_URL}/api/direct/quotations/search`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mobile_number: searchForm.mobile_number })
        }),
      ]);

      const [bookingsData, quotationsData] = await Promise.all([bookingsRes.json(), quotationsRes.json()]);

      let allOrders = [
        ...(Array.isArray(bookingsData) ? bookingsData.map(order => ({ ...order, type: "booking" })) : []),
        ...(Array.isArray(quotationsData) ? quotationsData.map(order => ({ ...order, type: "quotation" })) : []),
      ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      allOrders = await Promise.all(allOrders.map(async (order) => {
        if ((order.status === 'dispatched' || order.status === 'delivered') && order.type === "booking") {
          const transport = await fetchTransportDetails(order.order_id);
          if (transport) {
            return { ...order, ...transport };
          }
        }
        return order;
      }));

      setOrders(allOrders);
      setHasSearched(true);
    } catch (error) {
      console.error("Error searching orders:", error);
      alert("Error searching orders. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadInvoice = async (order) => {
    try {
      const endpoint = order.type === "booking"
        ? `/api/direct/invoice/${order.order_id}`
        : `/api/direct/quotation/${order.quotation_id}`;

      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Deepa_Crackers_${order.customer_name || 'customer'}-${order.order_id || order.quotation_id}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading invoice:", error);
      alert("Error downloading invoice. Please try again.");
    }
  };

  const formatPrice = (price) => {
    const num = Number.parseFloat(price);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="min-h-screen bg-[#040404] text-white flex flex-col selection:bg-amber-400 selection:text-slate-950 relative overflow-x-hidden">
      <BackgroundFireworks />

      {/* Ambient neon orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full" style={{ background: "radial-gradient(circle, #f59e0b18 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute bottom-0 -right-40 w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle, #10b98118 0%, transparent 70%)", filter: "blur(60px)" }} />
      </div>

      {/* Dot-grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.05]"
        style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "28px 28px" }}
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-grow pt-28 pb-16 px-4 md:px-8 max-w-5xl mx-auto w-full space-y-10">

          {/* ── HERO ─────────────────────────────── */}
          <div className="text-center space-y-6">
            {/* Decorative rule */}
            <div className="flex items-center gap-3 max-w-xs mx-auto">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
            </div>

            {/* Badge row */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                { label: "⚡ Live Tracking Portal", bg: "#f59e0b", text: "#fbbf24" },
                { label: "📦 Order Status", bg: "#10b981", text: "#34d399" },
                { label: "📄 PDF Invoice", bg: "#06b6d4", text: "#22d3ee" },
              ].map((b, i) => (
                <span
                  key={i}
                  className="px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-full"
                  style={{ background: `${b.bg}20`, border: `1px solid ${b.bg}55`, color: b.text, boxShadow: `0 0 16px ${b.bg}18` }}
                >
                  {b.label}
                </span>
              ))}
            </div>

            {/* Giant stacked headline */}
            <div className="relative">
              <h1
                className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-none uppercase"
                style={{
                  background: "linear-gradient(135deg, #fbbf24 0%, #f97316 35%, #ef4444 70%, #f43f5e 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 40px #f59e0b55)",
                }}
              >
                Track
              </h1>
              <h1
                className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-none uppercase -mt-2 sm:-mt-3"
                style={{
                  background: "linear-gradient(135deg, #a78bfa 0%, #818cf8 40%, #38bdf8 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 40px #8b5cf655)",
                }}
              >
                Order
              </h1>
              {/* Ghost outline */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none opacity-[0.04]" aria-hidden>
                <span className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-none uppercase" style={{ WebkitTextStroke: "2px white", color: "transparent" }}>TRACK</span>
                <span className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-none uppercase -mt-2 sm:-mt-3" style={{ WebkitTextStroke: "2px white", color: "transparent" }}>ORDER</span>
              </div>
            </div>

            <p className="text-xs font-black uppercase tracking-widest" style={{ color: "#fbbf24" }}>Deepa Crackers • THIRUTHURAIPOONDI</p>
            <p className="text-xs text-neutral-400 max-w-md mx-auto">
              Enter your registered 10-digit mobile number to track dispatch status &amp; download PDF bill.
            </p>

            {/* Color dot divider */}
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-500" />
              <div className="flex gap-1.5">
                {["#ef4444", "#f59e0b", "#10b981", "#06b6d4", "#8b5cf6"].map((c, i) => (
                  <div key={i} className="w-2 h-2 rounded-full" style={{ background: c, boxShadow: `0 0 8px ${c}` }} />
                ))}
              </div>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-500" />
            </div>
          </div>

          {/* ── SEARCH CARD ──────────────────────── */}
          <div
            className="relative max-w-md mx-auto rounded-3xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #0a0a0a, #111, #0a0a0a)",
              border: "1.5px solid #f59e0b55",
              boxShadow: "0 0 40px #f59e0b18, inset 0 1px 0 #fbbf2415",
            }}
          >
            <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-rose-500 to-cyan-400" style={{ boxShadow: "0 0 14px #f59e0b" }} />

            {/* Corner brackets */}
            <div className="absolute top-4 left-4 w-7 h-7 border-t-2 border-l-2 border-amber-500/50 rounded-tl-lg" />
            <div className="absolute top-4 right-4 w-7 h-7 border-t-2 border-r-2 border-amber-500/50 rounded-tr-lg" />

            {/* Hatching */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.03]"
              style={{ backgroundImage: "repeating-linear-gradient(45deg, #f59e0b 0, #f59e0b 1px, transparent 0, transparent 50%)", backgroundSize: "14px 14px" }}
            />

            <div className="relative z-10 p-6 space-y-4">
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "#fbbf24" }} />
                <input
                  type="tel"
                  name="mobile_number"
                  placeholder="Enter 10-digit mobile number"
                  value={searchForm.mobile_number}
                  onChange={handleInputChange}
                  maxLength={10}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-white text-xs focus:outline-none"
                  style={{
                    background: "#060606",
                    border: "1px solid #f59e0b44",
                    boxShadow: "inset 0 0 20px #00000055",
                  }}
                  onFocus={e => e.target.style.borderColor = "#fbbf24"}
                  onBlur={e => e.target.style.borderColor = "#f59e0b44"}
                />
              </div>

              <button
                onClick={searchOrders}
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl text-slate-950 font-black text-xs flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:scale-[1.02]"
                style={{
                  background: "linear-gradient(135deg, #f59e0b, #f97316, #ef4444)",
                  boxShadow: "0 0 30px #f59e0b40, 0 4px 20px #ef444430",
                  border: "1px solid #fbbf2440",
                }}
              >
                {isLoading ? "Searching..." : "🔍 Track Orders Now"}
              </button>
            </div>
          </div> 
          
          {/* ── RESULTS ──────────────────────────── */}
          <AnimatePresence>
            {hasSearched && (
              <div className="space-y-6 pt-4">
                {orders.length === 0 ? (
                  <div
                    className="text-center py-12 p-6 space-y-2 rounded-3xl relative overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg, #0a0a0a, #111, #0a0a0a)",
                      border: "1.5px solid #ffffff12",
                      boxShadow: "0 0 40px #00000055",
                    }}
                  >
                    <div className="h-1 w-full absolute top-0 left-0 right-0 bg-gradient-to-r from-neutral-700 via-neutral-500 to-neutral-700" />
                    <Package className="h-10 w-10 text-neutral-500 mx-auto" />
                    <h3 className="text-base font-black text-white">No Orders Found</h3>
                    <p className="text-xs text-neutral-400">No booking records found for mobile #{searchForm.mobile_number}.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="h-[3px] w-8 rounded-full bg-gradient-to-r from-transparent to-amber-500" />
                      <h2
                        className="text-lg font-black uppercase tracking-wide"
                        style={{
                          background: "linear-gradient(90deg, #fbbf24, #f97316, #e879f9)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        Found {orders.length} Order(s)
                      </h2>
                      <div className="h-[3px] flex-1 rounded-full" style={{ background: "linear-gradient(to right, #f59e0b, transparent)" }} />
                    </div>

                    {orders.map((order) => {
                      const key = `${order.type}-${order.id}`;
                      const isExpanded = expandedTimelines[key];
                      const statusColor = order.status === 'delivered' ? '#10b981' : order.status === 'dispatched' ? '#06b6d4' : order.status === 'confirmed' ? '#f59e0b' : '#8b5cf6';
                      const statusAccent = order.status === 'delivered' ? '#34d399' : order.status === 'dispatched' ? '#22d3ee' : order.status === 'confirmed' ? '#fbbf24' : '#a78bfa';

                      return (
                        <motion.div
                          key={key}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="relative rounded-2xl overflow-hidden"
                          style={{
                            background: "linear-gradient(135deg, #080808, #0f0f0f, #080808)",
                            border: `1.5px solid ${statusColor}44`,
                            boxShadow: `0 0 0 1px ${statusColor}15, 0 8px 24px ${statusColor}15`,
                          }}
                        >
                          <div className="h-1 w-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-400" style={{ boxShadow: `0 0 10px ${statusColor}` }} />

                          {/* Diagonal pattern */}
                          <div
                            className="absolute inset-0 pointer-events-none opacity-[0.025]"
                            style={{
                              backgroundImage: `repeating-linear-gradient(45deg, ${statusColor} 0, ${statusColor} 1px, transparent 0, transparent 50%)`,
                              backgroundSize: "10px 10px",
                            }}
                          />

                          <div className="relative z-10 p-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-black text-white">
                                  {order.type === "booking" ? `Order #${order.order_id}` : `Quote #${order.quotation_id}`}
                                </span>
                                <span
                                  className="px-2 py-0.5 rounded text-[10px] font-black uppercase"
                                  style={{ background: `${statusColor}25`, border: `1px solid ${statusColor}55`, color: statusAccent }}
                                >
                                  {order.status?.toUpperCase() || "PENDING"}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 text-[11px] text-neutral-500 mt-1">
                                <span>📅 {formatDate(order.created_at)}</span>
                                <span>📍 {order.district}, {order.state}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-neutral-800/60">
                              <span
                                className="text-lg font-black"
                                style={{
                                  background: "linear-gradient(90deg, #ffffff, #fbbf24)",
                                  WebkitBackgroundClip: "text",
                                  WebkitTextFillColor: "transparent",
                                  backgroundClip: "text",
                                }}
                              >
                                ₹{formatPrice(order.total)}
                              </span>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => downloadInvoice(order)}
                                  className="px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 transition-all hover:scale-105"
                                  style={{
                                    background: "linear-gradient(135deg, #10b981, #06b6d4)",
                                    color: "#020d08",
                                    boxShadow: "0 0 20px #10b98130",
                                    border: "1px solid #34d39940",
                                  }}
                                >
                                  <Download className="h-3.5 w-3.5" />
                                  <span>Invoice</span>
                                </button>
                                <button
                                  onClick={() => toggleTimeline(key)}
                                  className="p-1.5 rounded-lg border transition-colors"
                                  style={{ background: "#111", border: "1px solid #ffffff15", color: "#d1d5db" }}
                                >
                                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Transport LR box */}
                          {order.transport_name && (
                            <div
                              className="m-5 mt-0 p-4 rounded-xl text-xs space-y-1 relative overflow-hidden"
                              style={{
                                background: "linear-gradient(135deg, #020c10, #0d0d0d, #020c10)",
                                border: "1.5px solid #06b6d455",
                                boxShadow: "0 0 20px #06b6d415",
                              }}
                            >
                              <div className="h-px w-full mb-2" style={{ background: "linear-gradient(to right, #06b6d4, transparent)" }} />
                              <p className="font-black flex items-center gap-1.5" style={{ color: "#22d3ee" }}>
                                <Truck className="h-4 w-4" /> Transport Dispatch Info:
                              </p>
                              <p className="text-neutral-400">Company: <strong className="text-white">{order.transport_name}</strong></p>
                              {order.lr_number && <p className="text-neutral-400">LR Number: <strong className="text-white">{order.lr_number}</strong></p>}
                              {order.transport_contact && <p className="text-neutral-400">Contact: <strong className="text-white">{order.transport_contact}</strong></p>}
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </AnimatePresence>
        </main>

        {/* ── FOOTER ───────────────────────────── */}
        <footer
          className="relative mx-4 mb-8 mt-8 rounded-3xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #060606 0%, #0d0d0d 50%, #060606 100%)",
            border: "1px solid #ffffff10",
            boxShadow: "0 -4px 60px #00000066, inset 0 1px 0 #ffffff08",
          }}
        >
          <div className="h-1.5 w-full bg-gradient-to-r from-red-500 via-amber-400 via-emerald-400 via-cyan-400 to-purple-500" />
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

          <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <h2 className="text-2xl font-black mb-1 uppercase tracking-widest" style={{ color: "#fbbf24", textShadow: "0 0 20px #f59e0b55" }}>DEEPA CRACKERS</h2>
              <div className="h-px w-24 bg-gradient-to-r from-amber-500 to-transparent mb-3" />
              <p className="text-neutral-400 text-xs leading-relaxed mb-2">Spark joy, spread light—fireworks crafted for your family festival celebration.</p>
              <p className="text-neutral-300 text-xs font-black uppercase">📍 RS Road, THIRUTHURAIPOONDI</p>
              <div className="flex gap-2 mt-4">{["🔥", "🎆", "🪔", "✨"].map((e, i) => <span key={i} className="text-lg">{e}</span>)}</div>
            </div>

            <div>
              <h2 className="text-base font-black text-white mb-1 uppercase tracking-widest">Contact Us</h2>
              <div className="h-px w-16 bg-gradient-to-r from-cyan-500 to-transparent mb-3" />
              <p className="text-xs text-neutral-400">RS Road, Thiruthuraipoondi,</p>
              <p className="text-xs text-neutral-400">Tamil Nadu</p>
              <a href="tel:+918072897834" className="text-xs font-black block mt-2 hover:underline" style={{ color: "#fbbf24" }}>+91 8072 897 834</a>
              <a href="mailto:deepatraders1985@gmail.com" className="text-xs font-black block mt-1 text-neutral-300 hover:underline">deepatraders1985@gmail.com</a>
            </div>

            <div>
              <h2 className="text-base font-black text-white mb-1 uppercase tracking-widest">Quick Navigation</h2>
              <div className="h-px w-16 bg-gradient-to-r from-purple-500 to-transparent mb-3" />
              <ul className="space-y-1.5 text-xs text-neutral-400">
                {["/", "/status", "/safety-tips", "/about-us", "/contact-us"].map((href, i) => (
                  <li key={href}>
                    <a href={href} className="hover:text-amber-400 transition flex items-center gap-1.5 group">
                      <span className="w-1 h-1 rounded-full bg-amber-500/40 group-hover:bg-amber-400 transition" />
                      {["Home", "Track Order", "Safety Tips", "About Us", "Contact Us"][i]}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/[0.06] py-5 text-center text-xs text-neutral-600">
            © {new Date().getFullYear()}{" "}
            <span className="font-black" style={{ color: "#fbbf24" }}>Deepa Crackers</span>
            {" "}— THIRUTHURAIPOONDI. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}