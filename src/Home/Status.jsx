import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Package, Truck, CheckCircle, Clock, MapPin, Phone, Calendar, Download, ChevronDown, ChevronUp } from "lucide-react";
import Navbar from "../Component/Navbar";
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
    <div className="min-h-screen bg-[#FAF6EE] text-slate-900 flex flex-col font-mono selection:bg-amber-300">
      <Navbar />

      <main className="flex-grow pt-24 pb-16 px-4 md:px-8 max-w-5xl mx-auto w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900">Track Order Status</h1>
          <p className="text-xs font-bold text-amber-800 uppercase tracking-widest">Deepa Crackers • THIRUTHURAIPOONDI</p>
          <p className="text-xs text-slate-700 font-serif max-w-md mx-auto">
            Enter your registered 10-digit mobile number to track dispatch status & download PDF bill.
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-3xl p-6 border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(30,41,59,0.9)] max-w-md mx-auto space-y-4">
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
            <input
              type="tel"
              name="mobile_number"
              placeholder="Enter 10-digit mobile number"
              value={searchForm.mobile_number}
              onChange={handleInputChange}
              maxLength={10}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border-2 border-slate-900 text-slate-900 text-xs font-mono focus:outline-none focus:bg-amber-50 shadow-[2px_2px_0px_0px_#0f172a]"
            />
          </div>

          <button
            onClick={searchOrders}
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-amber-300 hover:bg-amber-400 text-slate-900 border-2 border-slate-900 font-black text-xs shadow-[3px_3px_0px_0px_#0f172a] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? "Searching..." : "Track Orders"}
          </button>
        </div>

        {/* Results */}
        <AnimatePresence>
          {hasSearched && (
            <div className="space-y-6 pt-4">
              {orders.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-3xl border-2 border-slate-900 p-6 shadow-[4px_4px_0px_0px_rgba(30,41,59,0.9)] space-y-2">
                  <Package className="h-10 w-10 text-slate-400 mx-auto" />
                  <h3 className="text-base font-black text-slate-900">No Orders Found</h3>
                  <p className="text-xs text-slate-600 font-serif">No booking records found for mobile #{searchForm.mobile_number}.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <h2 className="text-lg font-black text-slate-900 border-b-2 border-dashed border-slate-900 pb-2">
                    Found {orders.length} Order(s)
                  </h2>

                  {orders.map((order) => {
                    const key = `${order.type}-${order.id}`;
                    const isExpanded = expandedTimelines[key];

                    return (
                      <div
                        key={key}
                        className="bg-white rounded-2xl p-5 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(30,41,59,0.9)] space-y-4"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-slate-900">
                                {order.type === "booking" ? `Order #${order.order_id}` : `Quote #${order.quotation_id}`}
                              </span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 border border-slate-900 text-slate-900">
                                {order.status?.toUpperCase() || "PENDING"}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-[11px] text-slate-600 font-serif mt-1">
                              <span>📅 {formatDate(order.created_at)}</span>
                              <span>📍 {order.district}, {order.state}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200">
                            <span className="text-lg font-black text-slate-900">₹{formatPrice(order.total)}</span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => downloadInvoice(order)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-300 hover:bg-emerald-400 text-slate-900 border-2 border-slate-900 text-xs font-bold shadow-[2px_2px_0px_0px_#0f172a]"
                              >
                                Download Invoice
                              </button>
                              <button
                                onClick={() => toggleTimeline(key)}
                                className="p-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 border-2 border-slate-900 text-slate-900 shadow-[2px_2px_0px_0px_#0f172a]"
                              >
                                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Transport LR Details */}
                        {order.transport_name && (
                          <div className="p-3 rounded-xl bg-amber-50 border border-slate-900 text-xs space-y-1">
                            <p className="font-bold text-slate-900">🚚 Transport Dispatch Info:</p>
                            <p>Company: <strong className="text-slate-900">{order.transport_name}</strong></p>
                            {order.lr_number && <p>LR Number: <strong className="text-slate-900">{order.lr_number}</strong></p>}
                            {order.transport_contact && <p>Contact: <strong className="text-slate-900">{order.transport_contact}</strong></p>}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </AnimatePresence>
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