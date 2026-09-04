import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Package, Truck, CheckCircle, Clock, MapPin, Phone, Calendar,
  Download, ChevronDown, ChevronUp, Star
} from "lucide-react";
import PageShell from "./PageShell";
import { API_BASE_URL } from "../../Config";
import axios from "axios";

/* ── Status step config ── */
const STATUS_STEPS = ["pending", "confirmed", "dispatched", "delivered"];
const STATUS_META = {
  pending:   { color: "#8b5cf6", accent: "#a78bfa", label: "Pending",   icon: Clock },
  confirmed: { color: "#f59e0b", accent: "#fbbf24", label: "Confirmed", icon: CheckCircle },
  dispatched:{ color: "#06b6d4", accent: "#22d3ee", label: "Dispatched",icon: Truck },
  delivered: { color: "#10b981", accent: "#34d399", label: "Delivered", icon: Package },
};

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META["pending"];
  const Icon = meta.icon;
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider"
      style={{ background: `${meta.color}22`, border: `1px solid ${meta.color}55`, color: meta.accent }}>
      <Icon className="w-3 h-3" />
      {meta.label}
    </span>
  );
}

function ProgressStepper({ status }) {
  const current = STATUS_STEPS.indexOf(status);
  return (
    <div className="flex items-center w-full py-3 px-1">
      {STATUS_STEPS.map((step, i) => {
        const meta = STATUS_META[step];
        const done = i <= current;
        const Icon = meta.icon;
        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center gap-1.5 min-w-0">
              <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shrink-0"
                style={{
                  background: done ? meta.color : "transparent",
                  border: `2px solid ${done ? meta.color : "rgba(255,255,255,0.12)"}`,
                  boxShadow: done ? `0 0 12px ${meta.color}66` : "none",
                }}>
                <Icon className="w-3.5 h-3.5" style={{ color: done ? "#fff" : "rgba(255,255,255,0.25)" }} />
              </div>
              <span className="text-[9px] font-black uppercase tracking-wider hidden sm:block"
                style={{ color: done ? meta.accent : "rgba(255,255,255,0.2)" }}>
                {meta.label}
              </span>
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div className="flex-1 h-[2px] mx-1 rounded-full transition-all duration-500"
                style={{ background: i < current ? STATUS_META[STATUS_STEPS[i + 1]].color : "rgba(255,255,255,0.08)" }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function Status() {
  const [searchForm, setSearchForm] = useState({ mobile_number: "" });
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [expandedTimelines, setExpandedTimelines] = useState({});

  const handleInputChange = (e) => {
    const cleaned = e.target.value.replace(/\D/g, "").slice(-10);
    setSearchForm(prev => ({ ...prev, mobile_number: cleaned }));
  };

  const toggleTimeline = (orderId) => {
    setExpandedTimelines(prev => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const fetchTransportDetails = async (orderId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/tracking/filtered-bookings`, { params: { status: "dispatched,delivered" } });
      const booking = res.data.find(b => b.order_id === orderId || b.id === orderId);
      return booking ? { transport_name: booking.transport_name, lr_number: booking.lr_number, transport_contact: booking.transport_contact } : null;
    } catch {
      return null;
    }
  };

  const searchOrders = async () => {
    if (!searchForm.mobile_number.trim() || searchForm.mobile_number.length !== 10) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }
    setIsLoading(true);
    try {
      const [bookingsRes, quotationsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/direct/bookings/search`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mobile_number: searchForm.mobile_number }) }),
        fetch(`${API_BASE_URL}/api/direct/quotations/search`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mobile_number: searchForm.mobile_number }) }),
      ]);
      const [bookingsData, quotationsData] = await Promise.all([bookingsRes.json(), quotationsRes.json()]);

      let allOrders = [
        ...(Array.isArray(bookingsData) ? bookingsData.map(o => ({ ...o, type: "booking" })) : []),
        ...(Array.isArray(quotationsData) ? quotationsData.map(o => ({ ...o, type: "quotation" })) : []),
      ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      allOrders = await Promise.all(allOrders.map(async (order) => {
        if ((order.status === "dispatched" || order.status === "delivered") && order.type === "booking") {
          const transport = await fetchTransportDetails(order.order_id);
          if (transport) return { ...order, ...transport };
        }
        return order;
      }));

      setOrders(allOrders);
      setHasSearched(true);
    } catch {
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
      link.setAttribute("download", `Deepa_Crackers_${order.customer_name || "customer"}-${order.order_id || order.quotation_id}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Error downloading invoice. Please try again.");
    }
  };

  const formatPrice = (price) => {
    const num = Number.parseFloat(price);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
  });

  return (
    <PageShell orbColor1="#f59e0b" orbColor2="#10b981" orbColor3="#06b6d4">
      <div className="pt-24 pb-8 px-4 md:px-8 max-w-5xl mx-auto w-full space-y-10">

        {/* ── HERO ── */}
        <section className="text-center space-y-6 pt-6">
          <div className="flex items-center gap-3 max-w-xs mx-auto">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { label: "⚡ Live Tracking Portal", bg: "#f59e0b", text: "#fbbf24" },
              { label: "📦 Order Status", bg: "#10b981", text: "#34d399" },
              { label: "📄 PDF Invoice", bg: "#06b6d4", text: "#22d3ee" },
            ].map((b, i) => (
              <motion.span key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 + 0.2 }}
                className="px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] rounded-full"
                style={{ background: `${b.bg}1a`, border: `1px solid ${b.bg}55`, color: b.text, boxShadow: `0 0 18px ${b.bg}18` }}>
                {b.label}
              </motion.span>
            ))}
          </div>

          {/* Giant headline */}
          <div className="relative">
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
              className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tight leading-none uppercase"
              style={{ background: "linear-gradient(135deg, #fbbf24 0%, #f97316 35%, #ef4444 70%, #f43f5e 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", filter: "drop-shadow(0 0 50px rgba(245,158,11,0.45))" }}>
              Track
            </motion.h1>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.12 }}
              className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tight leading-none uppercase -mt-3 sm:-mt-4"
              style={{ background: "linear-gradient(135deg, #a78bfa 0%, #818cf8 40%, #38bdf8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", filter: "drop-shadow(0 0 50px rgba(139,92,246,0.45))" }}>
              Order
            </motion.h1>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none opacity-[0.035]" aria-hidden>
              <span className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tight leading-none uppercase" style={{ WebkitTextStroke: "2px white", color: "transparent" }}>TRACK</span>
              <span className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tight leading-none uppercase -mt-3 sm:-mt-4" style={{ WebkitTextStroke: "2px white", color: "transparent" }}>ORDER</span>
            </div>
          </div>

          <p className="text-[11px] font-black uppercase tracking-widest" style={{ color: "#fbbf24" }}>
            Deepa Crackers • THIRUTHURAIPOONDI
          </p>
          <p className="text-[12px] text-neutral-400 max-w-md mx-auto">
            Enter your registered 10-digit mobile number to track dispatch status &amp; download your PDF bill.
          </p>

          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-500 opacity-60" />
            <div className="flex gap-1.5">
              {["#ef4444", "#f59e0b", "#10b981", "#06b6d4", "#8b5cf6"].map((c, i) => (
                <div key={i} className="w-2 h-2 rounded-full" style={{ background: c, boxShadow: `0 0 8px ${c}` }} />
              ))}
            </div>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-500 opacity-60" />
          </div>
        </section>

        {/* ── SEARCH CARD ── */}
        <div className="relative max-w-md mx-auto rounded-3xl overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0a0a0a, #111, #0a0a0a)", border: "1.5px solid rgba(245,158,11,0.4)", boxShadow: "0 0 50px rgba(245,158,11,0.12), inset 0 1px 0 rgba(251,191,36,0.08)" }}>
          <div className="h-[3px] w-full bg-gradient-to-r from-amber-400 via-rose-500 to-cyan-400" style={{ boxShadow: "0 0 14px rgba(245,158,11,0.6)" }} />

          {/* Corner brackets */}
          {[["top-4 left-4 border-t-2 border-l-2 rounded-tl-lg"], ["top-4 right-4 border-t-2 border-r-2 rounded-tr-lg"]].map((cls, i) => (
            <div key={i} className={`absolute w-7 h-7 border-amber-500/50 z-10 ${cls[0]}`} />
          ))}
          {/* Hatch */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{ backgroundImage: "repeating-linear-gradient(45deg, #f59e0b 0, #f59e0b 1px, transparent 0, transparent 50%)", backgroundSize: "14px 14px" }} />

          <div className="relative z-10 p-6 space-y-4">
            {/* Search label */}
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-amber-400" />
              <span className="text-[11px] font-black uppercase tracking-widest text-amber-400">Search Your Orders</span>
            </div>

            {/* Input */}
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-400" />
              <input
                type="tel" name="mobile_number"
                placeholder="Enter 10-digit mobile number"
                value={searchForm.mobile_number}
                onChange={handleInputChange}
                maxLength={10}
                onKeyDown={e => e.key === "Enter" && searchOrders()}
                className="w-full pl-10 pr-4 py-3 rounded-xl text-white text-[12px] focus:outline-none transition-all"
                style={{ background: "#060606", border: "1px solid rgba(245,158,11,0.3)", boxShadow: "inset 0 0 20px rgba(0,0,0,0.4)" }}
                onFocus={e => e.target.style.borderColor = "#fbbf24"}
                onBlur={e => e.target.style.borderColor = "rgba(245,158,11,0.3)"}
              />
              {searchForm.mobile_number.length > 0 && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black"
                  style={{ color: searchForm.mobile_number.length === 10 ? "#34d399" : "#fbbf24" }}>
                  {searchForm.mobile_number.length}/10
                </span>
              )}
            </div>

            {/* Search button */}
            <motion.button
              onClick={searchOrders}
              disabled={isLoading}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 rounded-xl text-slate-950 font-black text-[12px] flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
              style={{ background: "linear-gradient(135deg, #f59e0b, #f97316, #ef4444)", boxShadow: "0 0 28px rgba(245,158,11,0.35), 0 4px 20px rgba(239,68,68,0.2)", border: "1px solid rgba(251,191,36,0.3)" }}>
              {isLoading ? (
                <><span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />Searching...</>
              ) : (
                <><Search className="w-4 h-4" />Track Orders Now</>
              )}
            </motion.button>
          </div>
        </div>

        {/* ── RESULTS ── */}
        <AnimatePresence>
          {hasSearched && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {orders.length === 0 ? (
                <div className="text-center py-14 p-6 space-y-3 rounded-3xl relative overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #0a0a0a, #111, #0a0a0a)", border: "1.5px solid rgba(255,255,255,0.08)" }}>
                  <div className="h-[3px] w-full absolute top-0 left-0 right-0" style={{ background: "linear-gradient(to right, #404040, #606060, #404040)" }} />
                  <Package className="h-12 w-12 text-neutral-600 mx-auto" />
                  <h3 className="text-base font-black text-white">No Orders Found</h3>
                  <p className="text-[12px] text-neutral-400">No booking records found for mobile number ending in {searchForm.mobile_number.slice(-4)}.</p>
                  <p className="text-[11px] text-neutral-600">Double-check your number or call us on <a href="tel:+918072897834" className="text-amber-400 font-black">+91 8072 897 834</a></p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Result count header */}
                  <div className="flex items-center gap-4">
                    <div className="h-[3px] w-8 rounded-full bg-gradient-to-r from-transparent to-amber-500" />
                    <h2 className="text-lg font-black uppercase tracking-wide"
                      style={{ background: "linear-gradient(90deg, #fbbf24, #f97316, #e879f9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                      Found {orders.length} Order{orders.length !== 1 ? "s" : ""}
                    </h2>
                    <div className="h-[3px] flex-1 rounded-full" style={{ background: "linear-gradient(to right, #f59e0b, transparent)" }} />
                  </div>

                  {orders.map((order) => {
                    const key = `${order.type}-${order.id}`;
                    const isExpanded = expandedTimelines[key];
                    const statusColor = STATUS_META[order.status]?.color || "#8b5cf6";
                    const statusAccent = STATUS_META[order.status]?.accent || "#a78bfa";

                    return (
                      <motion.div key={key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="relative rounded-2xl overflow-hidden"
                        style={{ background: "linear-gradient(135deg, #080808, #0f0f0f, #080808)", border: `1.5px solid ${statusColor}44`, boxShadow: `0 0 0 1px ${statusColor}12, 0 8px 24px ${statusColor}12` }}>
                        <div className="h-[3px] w-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-400" style={{ boxShadow: `0 0 10px ${statusColor}` }} />

                        {/* Diagonal pattern */}
                        <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
                          style={{ backgroundImage: `repeating-linear-gradient(45deg, ${statusColor} 0, ${statusColor} 1px, transparent 0, transparent 50%)`, backgroundSize: "10px 10px" }} />

                        <div className="relative z-10 p-5 space-y-4">
                          {/* Top row: order ID + status badge */}
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[12px] font-black text-white">
                                  {order.type === "booking" ? `Order #${order.order_id}` : `Quote #${order.quotation_id}`}
                                </span>
                                <StatusBadge status={order.status} />
                                <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase"
                                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#9ca3af" }}>
                                  {order.type}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 text-[10px] text-neutral-500 mt-1.5 flex-wrap">
                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(order.created_at)}</span>
                                {order.district && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{order.district}, {order.state}</span>}
                              </div>
                            </div>

                            <div className="flex items-center gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-neutral-800/50">
                              <span className="text-xl font-black"
                                style={{ background: "linear-gradient(90deg, #ffffff, #fbbf24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                                ₹{formatPrice(order.total)}
                              </span>
                              <div className="flex gap-2">
                                <motion.button
                                  onClick={() => downloadInvoice(order)}
                                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                                  className="px-3.5 py-1.5 rounded-xl text-[11px] font-black flex items-center gap-1.5 transition-all"
                                  style={{ background: "linear-gradient(135deg, #10b981, #06b6d4)", color: "#020d08", boxShadow: "0 0 18px rgba(16,185,129,0.3)", border: "1px solid rgba(52,211,153,0.3)" }}>
                                  <Download className="h-3.5 w-3.5" />Invoice
                                </motion.button>
                                <button onClick={() => toggleTimeline(key)}
                                  className="p-1.5 rounded-lg border transition-colors"
                                  style={{ background: "#111", border: "1px solid rgba(255,255,255,0.12)", color: "#d1d5db" }}>
                                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Progress stepper (always visible) */}
                          <ProgressStepper status={order.status || "pending"} />

                          {/* Transport info (inline, no expansion needed) */}
                          {order.transport_name && (
                            <div className="p-4 rounded-xl text-[11px] space-y-1.5 relative overflow-hidden"
                              style={{ background: "linear-gradient(135deg, #020c10, #0d0d0d)", border: "1.5px solid rgba(6,182,212,0.35)", boxShadow: "0 0 20px rgba(6,182,212,0.1)" }}>
                              <div className="h-px w-full mb-2" style={{ background: "linear-gradient(to right, #06b6d4, transparent)" }} />
                              <p className="font-black flex items-center gap-1.5" style={{ color: "#22d3ee" }}>
                                <Truck className="h-4 w-4" /> Transport Dispatch Info
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 text-[10px]">
                                <span className="text-neutral-400">Company: <strong className="text-white">{order.transport_name}</strong></span>
                                {order.lr_number && <span className="text-neutral-400">LR#: <strong className="text-white">{order.lr_number}</strong></span>}
                                {order.transport_contact && <span className="text-neutral-400">Contact: <strong className="text-white">{order.transport_contact}</strong></span>}
                              </div>
                            </div>
                          )}

                          {/* Expandable items list */}
                          <AnimatePresence>
                            {isExpanded && order.items?.length > 0 && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden">
                                <div className="p-4 rounded-xl space-y-2"
                                  style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}>
                                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">Order Items</p>
                                  {order.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center py-1 border-b border-white/[0.04] last:border-0">
                                      <span className="text-[11px] text-neutral-300">{item.product_name || item.name}</span>
                                      <span className="text-[11px] font-black text-white">×{item.quantity} — ₹{formatPrice(item.price * item.quantity)}</span>
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── HOW IT WORKS ── (shown before search) */}
        {!hasSearched && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="h-[3px] w-12 rounded-full bg-gradient-to-r from-transparent to-amber-500" />
              <h2 className="text-lg font-black uppercase tracking-wide"
                style={{ background: "linear-gradient(90deg, #fbbf24, #f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                How It Works
              </h2>
              <div className="h-[3px] flex-1 rounded-full" style={{ background: "linear-gradient(to right, #f59e0b, transparent)" }} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { step: "01", icon: "📱", title: "Enter Mobile", desc: "Type your 10-digit registered mobile number.", color: "#fbbf24" },
                { step: "02", icon: "🔍", title: "Track Instantly", desc: "All your bookings and quotations appear live.", color: "#34d399" },
                { step: "03", icon: "📥", title: "Download Bill", desc: "Download your PDF invoice with a single tap.", color: "#22d3ee" },
              ].map((s, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}
                  className="rounded-2xl overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #0a0a0a, #111)", border: `1.5px solid ${s.color}33`, boxShadow: `0 0 20px ${s.color}0f` }}>
                  <div className="h-1 w-full" style={{ background: s.color, boxShadow: `0 0 10px ${s.color}` }} />
                  <div className="p-5 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{s.icon}</span>
                      <span className="text-[10px] font-black" style={{ color: s.color, fontFamily: "monospace" }}>STEP {s.step}</span>
                    </div>
                    <h3 className="text-sm font-black text-white">{s.title}</h3>
                    <p className="text-[11px] text-neutral-400">{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes orbFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-18px) scale(1.03); }
        }
      `}</style>
    </PageShell>
  );
}