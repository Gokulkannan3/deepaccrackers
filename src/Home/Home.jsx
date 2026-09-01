import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Phone, Search, ArrowRight, ShieldCheck, FileText, LayoutGrid, List as ListIcon, X, Plus, Minus, ChevronLeft, ChevronRight, Bot, CheckCircle, MapPin, Tag, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Navbar from '../Component/Navbar';
import Launch from '../Component/Launch';
import BackgroundFireworks from '../Component/BackgroundFireworks';
import PromoBurst from '../Component/PromoBurst';
import Card3D from '../Component/Card3D';
import WhyDeepaCrackersModal from '../Component/WhyDeepaCrackersModal';
import SkyShotBookingSuccessModal from '../Component/SkyShotBookingSuccessModal';
import WhatsAppButton from '../Component/WhatsAppButton';
import { API_BASE_URL } from '../../Config';
import { translateProduct } from '../utils/tamilTranslation';
import defaultImage from '../default.jpeg';

// Media Item Parser Helper
const parseMediaItems = (media) => {
  if (!media) return [];
  if (Array.isArray(media)) return media.filter(Boolean);
  if (typeof media === 'string') {
    try {
      const parsed = JSON.parse(media);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
      return [media.trim()];
    } catch {
      return [media.trim()];
    }
  }
  return [];
};

// Base64 Image Preloader for PDF Generation
const loadBase64Image = (url) => {
  return new Promise((resolve) => {
    const mediaList = parseMediaItems(url);
    const firstUrl = mediaList[0] || defaultImage;
    if (!firstUrl || typeof firstUrl !== 'string') return resolve(null);
    if (firstUrl.includes('/video/') || firstUrl.endsWith('.mp4') || firstUrl.endsWith('.webm')) return resolve(null);

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width || 80;
        canvas.height = img.naturalHeight || img.height || 80;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/jpeg', 0.7);
        resolve(dataURL);
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => {
      if (firstUrl !== defaultImage) {
        const fallbackImg = new Image();
        fallbackImg.crossOrigin = 'Anonymous';
        fallbackImg.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = fallbackImg.naturalWidth || fallbackImg.width || 80;
            canvas.height = fallbackImg.naturalHeight || fallbackImg.height || 80;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(fallbackImg, 0, 0);
            resolve(canvas.toDataURL('image/jpeg', 0.7));
          } catch {
            resolve(null);
          }
        };
        fallbackImg.onerror = () => resolve(null);
        fallbackImg.src = defaultImage;
      } else {
        resolve(null);
      }
    };
    img.src = firstUrl;
  });
};

// Unique Product Key Generator to prevent cross-category ID collisions
const getProductUniqueKey = (p) => {
  if (!p) return "";
  return p.serial_number || `${p.product_type || 'gen'}_${p.id}_${p.productname || ''}`;
};

// Helper to check if product is active ('on')
const isProductOn = (p) => {
  if (!p) return false;
  const s = String(p.status ?? '').trim().toLowerCase();
  return s === 'on' || s === 'true' || p.status === true || p.status === 1 || s === '1';
};

// Small Thumbnail Renderer for Checkout Item Review
const renderProductThumbnail = (media) => {
  const items = parseMediaItems(media);
  if (items.length === 0) {
    return (
      <img
        src={defaultImage}
        alt="Crackers"
        className="w-12 h-12 rounded-xl border border-slate-900 object-contain bg-white p-0.5 shrink-0"
      />
    );
  }
  const first = items[0];
  const isVid = typeof first === 'string' && (first.includes('/video/') || first.endsWith('.mp4') || first.endsWith('.webm'));
  if (isVid) {
    return <video src={first} className="w-12 h-12 rounded-xl border border-slate-900 object-contain bg-white p-0.5 shrink-0" muted />;
  }
  return (
    <img
      src={first}
      alt=""
      className="w-12 h-12 rounded-xl border border-slate-900 object-contain bg-white p-0.5 shrink-0"
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = defaultImage;
      }}
    />
  );
};

// Pencil Sketch Product Image Carousel Component
// Multi-Color Chromatic Festival Themes for Maximalist Product Cards
const CARD_THEMES = [
  {
    name: "cyan",
    glow: "#06b6d4",
    accent: "#22d3ee",
    border: "rgba(6, 182, 212, 0.35)",
    borderHover: "rgba(6, 182, 212, 0.8)",
    bgGradient: "linear-gradient(135deg, #050b10 0%, #0c1c28 50%, #050b10 100%)",
    btnGrad: "linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)",
    btnText: "#02121c",
    badgeBg: "rgba(6, 182, 212, 0.15)",
    badgeBorder: "rgba(6, 182, 212, 0.4)",
    tag: "#38bdf8",
    shadow: "rgba(6, 182, 212, 0.25)",
    pill: "from-cyan-500 to-blue-600"
  },
  {
    name: "fuchsia",
    glow: "#d946ef",
    accent: "#f472b6",
    border: "rgba(217, 70, 239, 0.35)",
    borderHover: "rgba(217, 70, 239, 0.8)",
    bgGradient: "linear-gradient(135deg, #0e050d 0%, #220d20 50%, #0e050d 100%)",
    btnGrad: "linear-gradient(135deg, #d946ef 0%, #ec4899 100%)",
    btnText: "#180215",
    badgeBg: "rgba(217, 70, 239, 0.15)",
    badgeBorder: "rgba(217, 70, 239, 0.4)",
    tag: "#f472b6",
    shadow: "rgba(217, 70, 239, 0.25)",
    pill: "from-fuchsia-500 to-pink-600"
  },
  {
    name: "emerald",
    glow: "#10b981",
    accent: "#34d399",
    border: "rgba(16, 185, 129, 0.35)",
    borderHover: "rgba(16, 185, 129, 0.8)",
    bgGradient: "linear-gradient(135deg, #030e09 0%, #082216 50%, #030e09 100%)",
    btnGrad: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    btnText: "#02150c",
    badgeBg: "rgba(16, 185, 129, 0.15)",
    badgeBorder: "rgba(16, 185, 129, 0.4)",
    tag: "#34d399",
    shadow: "rgba(16, 185, 129, 0.25)",
    pill: "from-emerald-500 to-teal-600"
  },
  {
    name: "violet",
    glow: "#8b5cf6",
    accent: "#c084fc",
    border: "rgba(139, 92, 246, 0.35)",
    borderHover: "rgba(139, 92, 246, 0.8)",
    bgGradient: "linear-gradient(135deg, #090512 0%, #160d2c 50%, #090512 100%)",
    btnGrad: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
    btnText: "#0d031c",
    badgeBg: "rgba(139, 92, 246, 0.15)",
    badgeBorder: "rgba(139, 92, 246, 0.4)",
    tag: "#c084fc",
    shadow: "rgba(139, 92, 246, 0.25)",
    pill: "from-violet-500 to-indigo-600"
  },
  {
    name: "rose",
    glow: "#f43f5e",
    accent: "#fb7185",
    border: "rgba(244, 63, 94, 0.35)",
    borderHover: "rgba(244, 63, 94, 0.8)",
    bgGradient: "linear-gradient(135deg, #0e0507 0%, #240c13 50%, #0e0507 100%)",
    btnGrad: "linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)",
    btnText: "#1b0207",
    badgeBg: "rgba(244, 63, 94, 0.15)",
    badgeBorder: "rgba(244, 63, 94, 0.4)",
    tag: "#fb7185",
    shadow: "rgba(244, 63, 94, 0.25)",
    pill: "from-rose-500 to-red-600"
  },
  {
    name: "amber",
    glow: "#f59e0b",
    accent: "#fbbf24",
    border: "rgba(245, 158, 11, 0.35)",
    borderHover: "rgba(245, 158, 11, 0.8)",
    bgGradient: "linear-gradient(135deg, #0e0901 0%, #241703 50%, #0e0901 100%)",
    btnGrad: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    btnText: "#180d00",
    badgeBg: "rgba(245, 158, 11, 0.15)",
    badgeBorder: "rgba(245, 158, 11, 0.4)",
    tag: "#fbbf24",
    shadow: "rgba(245, 158, 11, 0.25)",
    pill: "from-amber-400 to-orange-500"
  }
];

// Helper to assign a vibrant jewel-toned chromatic theme to each product
const getProductTheme = (prod, index = 0) => {
  if (!prod) return CARD_THEMES[0];
  const str = String(prod.serial_number || prod.id || prod.productname || index);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return CARD_THEMES[(hash + index) % CARD_THEMES.length];
};

// Helper to format category names cleanly (e.g., 'one_sound_crackers' -> 'One Sound Crackers')
const formatCategoryName = (name) => {
  if (!name) return "";
  if (name.toLowerCase() === "all") return "All Categories";
  return name
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

// Illuminated Product Image Carousel with Ambient Spotlight
const ProductCarousel = ({ media, onImageClick, theme }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const mediaItems = useMemo(() => parseMediaItems(media), [media]);

  if (mediaItems.length === 0) {
    return (
      <div
        className="relative w-full h-36 sm:h-48 rounded-2xl overflow-hidden select-none flex items-center justify-center p-3 shadow-inner"
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          boxShadow: "inset 0 0 15px rgba(0,0,0,0.06)",
        }}
      >
        <img
          src={defaultImage}
          alt="Default Crackers"
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  const currentItem = mediaItems[currentIndex];
  const isVideo = typeof currentItem === 'string' && (currentItem.includes('/video/') || currentItem.endsWith('.mp4') || currentItem.endsWith('.webm'));

  return (
    <div
      className="relative w-full h-36 sm:h-48 rounded-2xl overflow-hidden group select-none flex items-center justify-center p-3 shadow-inner"
      style={{
        background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        boxShadow: "inset 0 0 15px rgba(0,0,0,0.06)",
      }}
    >
      {isVideo ? (
        <video
          src={currentItem}
          controls
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-contain"
        />
      ) : (
        <img
          src={currentItem}
          alt="Product media"
          onClick={() => onImageClick && onImageClick(mediaItems)}
          className="w-full h-full object-contain cursor-pointer hover:scale-108 transition-transform duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultImage;
          }}
        />
      )}

      {mediaItems.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
            }}
            className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-xl bg-black/80 border border-white/20 text-white flex items-center justify-center font-bold text-xs shadow-md hover:scale-110 transition-all z-10 cursor-pointer"
          >
            ‹
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
            }}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-xl bg-black/80 border border-white/20 text-white flex items-center justify-center font-bold text-xs shadow-md hover:scale-110 transition-all z-10 cursor-pointer"
          >
            ›
          </button>
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1 z-10 bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-sm">
            {mediaItems.map((_, idx) => (
              <span
                key={idx}
                className="w-1.5 h-1.5 rounded-full transition-all"
                style={{
                  background: idx === currentIndex ? (theme?.accent || "#fbbf24") : "rgba(255,255,255,0.4)",
                  transform: idx === currentIndex ? "scale(1.2)" : "scale(1)",
                  boxShadow: idx === currentIndex ? `0 0 6px ${theme?.glow || "#f59e0b"}` : "none",
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categoryOrder, setCategoryOrder] = useState([]);
  const [banners, setBanners] = useState([]);
  const [currentBannerIdx, setCurrentBannerIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "table"
  const [cart, setCart] = useState({});
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [lastCompletedOrderId, setLastCompletedOrderId] = useState("");
  const [previewMedia, setPreviewMedia] = useState(null);
  const [downloadingPDF, setDownloadingPDF] = useState(false);

  // Locations & Promocodes state
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [promoCodes, setPromoCodes] = useState([]);
  const [selectedPromoCode, setSelectedPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);

  // AI assistant state
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiStep, setAiStep] = useState(0);
  const [aiBudget, setAiBudget] = useState("");
  const [aiPreferences, setAiPreferences] = useState({ kids: false, sound: false, night: false, kidsnight: false });
  const [suggestedCart, setSuggestedCart] = useState({});

  // Launcher: shown only once per session (first visit)
  const [showLauncher, setShowLauncher] = useState(() => {
    return !sessionStorage.getItem("deepa_crackers_launched");
  });
  // Why modal: shown right after launcher finishes
  const [showWhyModal, setShowWhyModal] = useState(false);


  const [customer, setCustomer] = useState({
    name: "",
    mobile: "",
    address: "",
    district: "Thiruthuraipoondi",
    state: "Tamil Nadu",
    email: "",
  });

  // Fetch Banners
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/banners`);
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data.filter((b) => b.is_active !== false) : [];
          setBanners(list);
        }
      } catch (err) {
        console.error("Failed to fetch banners:", err);
      }
    };
    fetchBanners();
  }, []);

  // Fetch States & Promocodes
  useEffect(() => {
    const fetchStatesAndPromos = async () => {
      try {
        const [sRes, pRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/locations/states`).catch(() => null),
          fetch(`${API_BASE_URL}/api/promocodes`).catch(() => null),
        ]);
        if (sRes && sRes.ok) {
          const sData = await sRes.json();
          setStates(Array.isArray(sData) ? sData : []);
        }
        if (pRes && pRes.ok) {
          const pData = await pRes.json();
          setPromoCodes(Array.isArray(pData) ? pData : []);
        }
      } catch (err) {
        console.error("Error fetching location & promo data:", err);
      }
    };
    fetchStatesAndPromos();
  }, []);

  // Fetch Districts when State changes
  useEffect(() => {
    if (customer.state) {
      fetch(`${API_BASE_URL}/api/locations/states/${customer.state}/districts`)
        .then((res) => res.json())
        .then((data) => setDistricts(Array.isArray(data) ? data : []))
        .catch((err) => console.error("Error fetching districts:", err));
    }
  }, [customer.state]);

  // Auto-rotate banners
  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIdx((prev) => (prev + 1) % banners.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [banners]);

  // Fetch Inventory and Category Order Sequence from Admin Backend
  const fetchData = async () => {
    setLoading(true);
    try {
      let prodRes = await fetch(`${API_BASE_URL}/api/products`).catch(() => null);
      if (!prodRes || !prodRes.ok) prodRes = await fetch(`${API_BASE_URL}/api/inventory/products`).catch(() => null);
      if (!prodRes || !prodRes.ok) prodRes = await fetch(`http://localhost:5000/api/products`).catch(() => null);

      let catRes = await fetch(`${API_BASE_URL}/api/category-order`).catch(() => null);
      if (!catRes || !catRes.ok) catRes = await fetch(`${API_BASE_URL}/api/product-types`).catch(() => null);
      if (!catRes || !catRes.ok) catRes = await fetch(`${API_BASE_URL}/api/inventory/category-order`).catch(() => null);
      if (!catRes || !catRes.ok) catRes = await fetch(`http://localhost:5000/api/category-order`).catch(() => null);
      if (!catRes || !catRes.ok) catRes = await fetch(`http://localhost:5000/api/product-types`).catch(() => null);

      const prodData = prodRes && prodRes.ok ? await prodRes.json() : [];
      const catData = catRes && catRes.ok ? await catRes.json() : [];

      let rawList = [];
      if (prodData && prodData.data) {
        rawList = prodData.data;
      } else if (Array.isArray(prodData)) {
        rawList = prodData;
      }
      setProducts(rawList.filter(isProductOn));

      if (Array.isArray(catData) && catData.length > 0) {
        setCategoryOrder(catData.map((c) => (typeof c === "string" ? c : c.product_type)));
      }
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Compute Available Categories Sorted by Admin Drag & Drop Sequence
  const categories = useMemo(() => {
    const availableTypes = Array.from(new Set(products.filter(isProductOn).map((p) => p.product_type))).filter(Boolean);
    const sorted = [...availableTypes].sort((a, b) => {
      const idxA = categoryOrder.indexOf(a);
      const idxB = categoryOrder.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });
    return ["All", ...sorted];
  }, [products, categoryOrder]);

  // Micro Popper Sparkle Effect on Plus Button (Ultra-Bright & Radiant)
  const [popperSparks, setPopperSparks] = useState([]);

  const triggerPopperSparkle = (e) => {
    if (!e) return;
    const rect = e.currentTarget?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : e.clientX || window.innerWidth / 2;
    const y = rect ? rect.top + rect.height / 2 : e.clientY || window.innerHeight / 2;
    const id = Date.now() + Math.random();

    // 22 Radiant multi-color sparkler particles
    const particleColors = ['#ffd700', '#ffffff', '#ff0055', '#10b981', '#00f0ff', '#ff9900', '#ec4899', '#ffffff', '#ffd700'];
    const particles = Array.from({ length: 22 }).map((_, i) => {
      const angle = (i * (360 / 22) + Math.random() * 15) * (Math.PI / 180);
      const velocity = 35 + Math.random() * 55;
      const color = particleColors[i % particleColors.length];
      return {
        id: `${id}-${i}`,
        dx: Math.cos(angle) * velocity,
        dy: Math.sin(angle) * velocity,
        color,
        size: i % 3 === 0 ? (6 + Math.random() * 4) : (4 + Math.random() * 3), // Varied prominent sizes (4px - 10px)
        isStar: i % 2 === 0,
      };
    });

    setPopperSparks((prev) => [...prev, { id, x, y, particles }]);
    setTimeout(() => {
      setPopperSparks((prev) => prev.filter((p) => p.id !== id));
    }, 850);
  };

  // Cart operations using Unique Key with Sparkle on Plus
  const updateQuantity = (productOrKey, delta, e = null) => {
    if (delta > 0 && e) {
      triggerPopperSparkle(e);
    }
    const key = typeof productOrKey === 'object' ? getProductUniqueKey(productOrKey) : String(productOrKey);
    setCart((prev) => {
      const current = prev[key] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      }
      return { ...prev, [key]: next };
    });
  };

  const cartItems = useMemo(() => {
    return Object.entries(cart)
      .map(([key, qty]) => {
        const product = products.find((p) => getProductUniqueKey(p) === key || p.serial_number === key || String(p.id) === String(key));
        if (!product) return null;
        const price = parseFloat(product?.price || 0);
        const discount = parseFloat(product?.discount || 0);
        const netPrice = discount > 0 ? Math.round(price * (1 - discount / 100)) : price;
        return {
          ...product,
          uniqueKey: key,
          qty,
          netPrice,
          subtotal: netPrice * qty,
        };
      })
      .filter((item) => item && item.productname);
  }, [cart, products]);

  const totalAmount = useMemo(() => cartItems.reduce((sum, item) => sum + item.subtotal, 0), [cartItems]);

  const promoDiscountAmount = useMemo(() => {
    if (!appliedPromo) return 0;
    const rate = parseFloat(appliedPromo.discount || 0);
    return Math.round((totalAmount * rate) / 100);
  }, [appliedPromo, totalAmount]);

  const finalCheckoutTotal = useMemo(() => {
    return Math.max(0, totalAmount - promoDiscountAmount);
  }, [totalAmount, promoDiscountAmount]);

  const handleApplyPromoCode = (code) => {
    setSelectedPromoCode(code);
    if (!code) {
      setAppliedPromo(null);
      return;
    }
    const found = promoCodes.find((p) => p.code.toLowerCase() === code.toLowerCase());
    if (found) {
      if (found.min_amount && totalAmount < found.min_amount) {
        alert(`Minimum order amount for code ${found.code} is ₹${found.min_amount}. Your current total is ₹${totalAmount}.`);
        setAppliedPromo(null);
        setSelectedPromoCode("");
        return;
      }
      setAppliedPromo(found);
    } else {
      alert("Invalid promocode.");
      setAppliedPromo(null);
    }
  };

  // Group Products by Admin Category Sequence
  const groupedProducts = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    let list = products.filter(isProductOn);

    if (selectedCategory !== "All") {
      list = list.filter((p) => p.product_type === selectedCategory);
    }

    if (term) {
      list = list.filter(
        (p) =>
          p.productname?.toLowerCase().includes(term) ||
          p.serial_number?.toLowerCase().includes(term) ||
          translateProduct(p.productname)?.toLowerCase().includes(term)
      );
    }

    const map = {};
    list.forEach((p) => {
      const cat = p.product_type || "General Crackers";
      if (!map[cat]) map[cat] = [];
      map[cat].push(p);
    });

    const sortedKeys = Object.keys(map).sort((a, b) => {
      const idxA = categoryOrder.indexOf(a);
      const idxB = categoryOrder.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });

    return sortedKeys.map((cat) => ({
      category: cat,
      items: map[cat],
    }));
  }, [products, selectedCategory, searchTerm, categoryOrder]);

  // Dynamic PDF Pricelist Generator matching Admin Category Sequence with Product Images
  const downloadPDFPricelist = async () => {
    setDownloadingPDF(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const activeProducts = products.filter(isProductOn);

      // Pre-load base64 images for active products with unique product key mapping
      const imagePromises = activeProducts.map(async (p) => {
        const key = getProductUniqueKey(p);
        const base64 = await loadBase64Image(p.image || p.images);
        return { key, base64 };
      });
      const loadedImages = await Promise.all(imagePromises);
      const imageMap = {};
      loadedImages.forEach((item) => {
        if (item.base64) imageMap[item.key] = item.base64;
      });

      doc.setFillColor(250, 246, 238);
      doc.rect(0, 0, pageWidth, 40, 'F');
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(30, 41, 59);
      doc.text("DEEPA CRACKERS", pageWidth / 2, 16, { align: "center" });

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139);
      doc.text("RS Road, Thiruthuraipoondi, Tamil Nadu", pageWidth / 2, 24, { align: "center" });
      doc.text("Contact: 8072 897 834 | deepatraders1985@gmail.com", pageWidth / 2, 31, { align: "center" });
      doc.text(`Official Festive Retail Pricelist — ${new Date().getFullYear()}`, pageWidth / 2, 38, { align: "center" });

      let startY = 45;
      let totalItemsCount = 0;
      const activeTypes = categories.filter((c) => c !== "All");

      activeTypes.forEach((type) => {
        const typeItems = activeProducts.filter((p) => p.product_type === type);
        if (typeItems.length === 0) return;

        const tableData = typeItems.map((p) => {
          totalItemsCount++;
          const key = getProductUniqueKey(p);
          const price = parseFloat(p.price || 0);
          const discount = parseFloat(p.discount || 0);
          const netPrice = discount > 0 ? Math.round(price * (1 - discount / 100)) : price;
          return [
            p.serial_number || String(totalItemsCount),
            { content: "", imgBase64: imageMap[key] },
            p.productname || "",
            `Rs.${price.toFixed(2)}`,
            discount > 0 ? `${discount}%` : "-",
            `Rs.${netPrice.toFixed(2)}`,
            p.per || "pkt",
          ];
        });

        autoTable(doc, {
          startY: startY,
          head: [
            [{ content: type.toUpperCase(), colSpan: 7, styles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: "bold" } }],
            ["Code", "Image", "Product Name", "MRP", "Discount", "Net Price", "Per"]
          ],
          body: tableData,
          theme: "grid",
          headStyles: { fillColor: [245, 235, 217], textColor: [30, 41, 59], fontStyle: "bold" },
          styles: { fontSize: 8, cellPadding: 2, minCellHeight: 12 },
          columnStyles: {
            0: { cellWidth: 15 },
            1: { cellWidth: 14 },
            2: { cellWidth: 65 },
          },
          didDrawCell: (data) => {
            if (data.section === 'body' && data.column.index === 1 && data.cell.raw && data.cell.raw.imgBase64) {
              try {
                doc.addImage(data.cell.raw.imgBase64, 'JPEG', data.cell.x + 2, data.cell.y + 1, 10, 10);
              } catch (e) {
                console.error("PDF img draw error:", e);
              }
            }
          }
        });

        startY = doc.lastAutoTable.finalY + 6;
      });

      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text("Deepa Crackers, RS Road, Thiruthuraipoondi | 8072 897 834 | deepatraders1985@gmail.com", pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: "center" });

      doc.save(`Deepa_Crackers_Pricelist_Thiruthuraipoondi_${new Date().getFullYear()}.pdf`);
    } catch (err) {
      console.error("PDF Export Error:", err);
      alert("Error generating PDF pricelist.");
    } finally {
      setDownloadingPDF(false);
    }
  };

  // 100% Rock-Solid AI Generator Algorithm with Strict Budget Enforcement and Unique Keys
  const generateSuggestions = useCallback(() => {
    const budget = Number(aiBudget);
    if (!budget || budget <= 0) {
      alert("Please enter a valid budget amount in ₹");
      return;
    }

    const categoriesMap = {
      kids: ["new_arrivals", "fancy_pencil_varieties", "twinkling_star", "guns_and_caps", "matches"],
      sound: ["bombs", "one_sound_crackers"],
      night: ["repeating_shots", "comets_sky_shots", "new_arrivals", "rockets"],
      kidsnight: ["fountain_and_fancy_novelties", "flower_pots", "ground_chakkar", "sparklers"],
    };

    const selectedPrefs = ["night", "kids", "sound", "kidsnight"].filter((p) => aiPreferences[p]);
    const prefsToUse = selectedPrefs.length > 0 ? selectedPrefs : ["kids", "sound", "night", "kidsnight"];

    const normType = (t) => t?.toLowerCase()?.replace(/\s+/g, "_") || "";
    const getSparklerSize = (name) => {
      const m = name?.match(/(\d+)\s*cm/i);
      return m ? m[1] : null;
    };

    // Filter available products & calculate net price with UNIQUE KEYS
    const activeProducts = products
      .filter(isProductOn)
      .map((p) => {
        const price = parseFloat(p.price || 0);
        const discount = parseFloat(p.discount || 0);
        const finalPrice = discount > 0 ? Math.round(price * (1 - discount / 100)) : price;
        const key = getProductUniqueKey(p);
        return { ...p, finalPrice, normType: normType(p.product_type), uniqueKey: key };
      })
      .filter((p) => p.finalPrice > 0 && p.finalPrice <= budget);

    if (activeProducts.length === 0) {
      alert("No suitable products found under this budget.");
      return;
    }

    const tempCart = {};
    let totalSpent = 0;
    const sparklerSizeCount = {};

    // Candidate types matching selected preferences
    const allowedTypes = prefsToUse.flatMap((pref) => categoriesMap[pref] || []);

    let candidates = activeProducts
      .filter((p) => allowedTypes.length === 0 || allowedTypes.includes(p.normType) || prefsToUse.length === 4)
      .sort((a, b) => a.finalPrice - b.finalPrice);

    if (candidates.length === 0) {
      candidates = activeProducts.sort((a, b) => a.finalPrice - b.finalPrice);
    }

    // Phase 1: Maximized Variety (pick 1 of as many distinct products as possible without exceeding budget)
    for (const p of candidates) {
      if (totalSpent + p.finalPrice > budget) continue;

      if (p.normType === "sparklers" || p.normType === "premium_sparklers") {
        const size = getSparklerSize(p.productname) || "unknown";
        if ((sparklerSizeCount[size] || 0) >= 3) continue;
        sparklerSizeCount[size] = (sparklerSizeCount[size] || 0) + 1;
      }

      tempCart[p.uniqueKey] = 1;
      totalSpent += p.finalPrice;
    }

    // Phase 2: Budget Filler (Add extra quantities of picked products up to the budget cap)
    let remainingBudget = budget - totalSpent;
    let safetyCounter = 500;

    while (remainingBudget >= 10 && safetyCounter-- > 0) {
      let addedAny = false;
      for (const p of candidates) {
        if (!tempCart[p.uniqueKey]) continue;
        if (p.finalPrice <= remainingBudget) {
          tempCart[p.uniqueKey] = (tempCart[p.uniqueKey] || 0) + 1;
          remainingBudget -= p.finalPrice;
          totalSpent += p.finalPrice;
          addedAny = true;
        }
      }
      if (!addedAny) break;
    }

    // Phase 3: Add leftover cheap items to get as close to budget as possible
    if (remainingBudget >= 10) {
      for (const p of candidates) {
        if (p.finalPrice <= remainingBudget) {
          tempCart[p.uniqueKey] = (tempCart[p.uniqueKey] || 0) + 1;
          remainingBudget -= p.finalPrice;
          totalSpent += p.finalPrice;
        }
      }
    }

    setSuggestedCart(tempCart);
    setAiStep(2);
  }, [aiBudget, aiPreferences, products]);

  const addSuggestedToCart = () => {
    setCart((prev) => {
      const updated = { ...prev };
      Object.entries(suggestedCart).forEach(([key, qty]) => {
        updated[key] = (updated[key] || 0) + qty;
      });
      return updated;
    });
    setShowAiModal(false);
    setAiStep(0);
    setAiBudget("");
    setAiPreferences({ kids: false, sound: false, night: false, kidsnight: false });
    setSuggestedCart({});
  };

  const updateSuggestedQty = (key, delta) => {
    setSuggestedCart((prev) => {
      const current = prev[key] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      }
      return { ...prev, [key]: next };
    });
  };

  const suggestedTotalAmount = useMemo(() => {
    return Object.entries(suggestedCart).reduce((sum, [key, qty]) => {
      const p = products.find((x) => getProductUniqueKey(x) === key || x.serial_number === key || String(x.id) === String(key));
      if (!p) return sum;
      const price = parseFloat(p.price || 0);
      const discount = parseFloat(p.discount || 0);
      const finalPrice = discount > 0 ? Math.round(price * (1 - discount / 100)) : price;
      return sum + finalPrice * qty;
    }, 0);
  }, [suggestedCart, products]);

  // Product Purchase Checkout Form Submission with Auto PDF Download
  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!customer.name || !customer.mobile || customer.mobile.length !== 10) {
      alert("Please enter a valid 10-digit mobile number and name.");
      return;
    }

    setIsSubmitting(true);
    const order_id = `DC-${Date.now()}`;
    const payload = {
      order_id,
      products: cartItems.map((item) => ({
        id: item.id,
        product_type: item.product_type || "General",
        serial_number: item.serial_number || String(item.id),
        productname: item.productname,
        price: parseFloat(item.price || 0),
        discount: parseFloat(item.discount || 0),
        netPrice: item.netPrice,
        quantity: item.qty,
        per: item.per || "pkt",
      })),
      total: finalCheckoutTotal,
      customer_name: customer.name,
      mobile_number: customer.mobile,
      address: customer.address,
      district: customer.district,
      state: customer.state,
      email: customer.email,
      promocode: appliedPromo?.code || null,
      promo_discount: promoDiscountAmount,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/direct/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        const serverOrderId = data.order_id || data.quotation_id || order_id;

        setLastCompletedOrderId(serverOrderId);
        setBookingSuccess(true);
        setCart({});
        setShowCheckoutModal(false);
        setCheckoutStep(0);

        // Auto Download PDF Invoice Bill using the official server order_id
        try {
          const pdfRes = await fetch(`${API_BASE_URL}/api/direct/invoice/${serverOrderId}`);
          if (pdfRes.ok) {
            const blob = await pdfRes.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Deepa_Crackers_Invoice_${serverOrderId}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          } else {
            console.warn("Invoice endpoint status:", pdfRes.status);
          }
        } catch (pdfErr) {
          console.error("Auto PDF download error:", pdfErr);
        }
      } else {
        alert("Failed to submit order enquiry. Please try again.");
      }
    } catch (err) {
      console.error("Order submission error:", err);
      alert("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#040404] text-white flex flex-col relative selection:bg-amber-400 selection:text-slate-950 overflow-x-hidden">
      {/* Ambient neon orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full" style={{ background: "radial-gradient(circle, #f59e0b18 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute top-1/3 -right-40 w-[550px] h-[550px] rounded-full" style={{ background: "radial-gradient(circle, #ef444415 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute bottom-1/4 -left-40 w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle, #10b98114 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute -bottom-40 right-1/4 w-[600px] h-[600px] rounded-full" style={{ background: "radial-gradient(circle, #8b5cf618 0%, transparent 70%)", filter: "blur(60px)" }} />
      </div>

      {/* Signature 28px Dot-grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.05]"
        style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "28px 28px" }}
      />

      {/* Continuous Background & Foreground Fireworks (paused during checkout address filling) */}
      <BackgroundFireworks isPaused={showCheckoutModal} />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-grow pt-24 pb-20 px-3 md:px-8 max-w-7xl mx-auto w-full space-y-12">

          {/* Dynamic Interactive Banner Slider Section with Maximalist Ornate Frame */}
          <section
            className="relative hundred:mt-5 mobile:mt-5 w-full rounded-3xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #090909 0%, #121212 50%, #090909 100%)",
              border: "1.5px solid #f59e0b44",
              boxShadow: "0 0 50px #f59e0b15, inset 0 1px 0 #fbbf2415",
            }}
          >
            {/* Animated 5-stop rainbow top bar */}
            <div
              className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-amber-400 via-emerald-400 via-cyan-400 to-purple-500 z-20"
              style={{ boxShadow: "0 0 16px #f59e0b" }}
            />

            {/* Corner brackets */}
            <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-500/60 rounded-tl-lg z-20 pointer-events-none" />
            <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-500/60 rounded-tr-lg z-20 pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-500/60 rounded-bl-lg z-20 pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-500/60 rounded-br-lg z-20 pointer-events-none" />

            {/* Diagonal hatching texture */}
            <div
              className="absolute inset-0 pointer-events-none z-10 opacity-[0.03]"
              style={{ backgroundImage: "repeating-linear-gradient(45deg, #f59e0b 0, #f59e0b 1px, transparent 0, transparent 50%)", backgroundSize: "16px 16px" }}
            />

            {banners.length > 0 ? (
              <div className="relative w-full hundred:h-96 mobile:h-44">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={banners[currentBannerIdx]?.id || currentBannerIdx}
                    src={banners[currentBannerIdx]?.image_url}
                    alt={`Banner ${currentBannerIdx + 1}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>

                {/* Slider Controls */}
                {banners.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentBannerIdx((prev) => (prev === 0 ? banners.length - 1 : prev - 1))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-2xl bg-black/90 border border-amber-500/50 text-amber-400 flex items-center justify-center font-bold shadow-xl hover:scale-110 hover:border-amber-400 transition-all z-20"
                      style={{ boxShadow: "0 0 15px #f59e0b30" }}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setCurrentBannerIdx((prev) => (prev + 1) % banners.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-2xl bg-black/90 border border-amber-500/50 text-amber-400 flex items-center justify-center font-bold shadow-xl hover:scale-110 hover:border-amber-400 transition-all z-20"
                      style={{ boxShadow: "0 0 15px #f59e0b30" }}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>

                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                      {banners.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentBannerIdx(idx)}
                          className={`h-2.5 rounded-full transition-all ${idx === currentBannerIdx
                            ? "w-8 bg-gradient-to-r from-amber-400 to-red-500 shadow-[0_0_12px_#f59e0b]"
                            : "w-2.5 bg-neutral-700 hover:bg-neutral-500"
                            }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="p-8 md:p-14 text-center space-y-6 relative z-10">
                {/* Decorative rule */}
                <div className="flex items-center gap-3 max-w-xs mx-auto">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
                </div>

                {/* Badge row */}
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {[
                    { label: "✨ Supreme Quality 1985", bg: "#f59e0b", text: "#fbbf24" },
                    { label: "🪔 Thiruthuraipoondi Hub", bg: "#10b981", text: "#34d399" },
                    { label: "🎆 100% Legal Sivakasi", bg: "#d946ef", text: "#e879f9" },
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
                    className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none uppercase text-amber-400"
                    style={{
                      textShadow: "0 0 35px rgba(245,158,11,0.55)",
                    }}
                  >
                    Deepa Crackers
                  </h1>
                  <h2
                    className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-none uppercase mt-2 text-white"
                  >
                    Festival Celebration Hub
                  </h2>
                </div>

                <p className="text-neutral-300 text-xs md:text-sm max-w-2xl mx-auto leading-relaxed">
                  Discover premier fireworks, ground chakkars, sparklers, and dazzling sky shots. Directly dispatched to <strong className="text-amber-400 font-black">Thiruthuraipoondi &amp; across Tamil Nadu</strong> with unmatched festive value.
                </p>

                {/* 5-color dot divider */}
                <div className="flex items-center justify-center gap-4">
                  <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-500" />
                  <div className="flex gap-1.5">
                    {["#ef4444", "#f59e0b", "#10b981", "#06b6d4", "#d946ef"].map((c, i) => (
                      <div key={i} className="w-2 h-2 rounded-full" style={{ background: c, boxShadow: `0 0 8px ${c}` }} />
                    ))}
                  </div>
                  <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-500" />
                </div>
              </div>
            )}
          </section>

          {/* Hero Action Bar - Maximalist Radiant Glow Controls */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setShowAiModal(true)}
              className="px-6 py-3.5 rounded-2xl text-slate-950 font-black text-xs md:text-sm shadow-xl transition-all flex items-center gap-2 hover:scale-105 active:scale-95 cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #ef4444 100%)",
                boxShadow: "0 0 30px #f59e0b40, 0 4px 20px #ef444430",
                border: "1px solid #fbbf2455",
              }}
            >
              <Bot className="h-4 w-4 text-slate-950" />
              <span>AI Smart Fireworks Assistant 🤖</span>
            </button>
            <button
              onClick={downloadPDFPricelist}
              disabled={downloadingPDF}
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-neutral-100 text-slate-950 font-black text-xs md:text-sm shadow-xl transition-all flex items-center gap-2 disabled:opacity-50 hover:scale-105 active:scale-95 cursor-pointer"
              style={{
                boxShadow: "0 0 25px rgba(255,255,255,0.25)",
                border: "1.5px solid #fbbf24",
              }}
            >
              <FileText className="h-4 w-4 text-red-600" />
              <span>{downloadingPDF ? "Generating PDF..." : "Download PDF Pricelist 📄"}</span>
            </button>
            <button
              onClick={() => navigate("/status")}
              className="px-6 py-3.5 rounded-2xl text-white font-black text-xs md:text-sm shadow-xl transition-all flex items-center gap-2 hover:scale-105 active:scale-95 cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                border: "1.5px solid #06b6d455",
                boxShadow: "0 0 25px #06b6d425",
              }}
            >
              <span className="text-cyan-400">⚡</span>
              <span>Track Order Status</span>
            </button>
          </div>

          {/* Product Catalog Showcase with Admin Dynamic Ordering */}
          <section className="space-y-6">
            <div
              className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl relative overflow-hidden backdrop-blur-md"
              style={{
                background: "linear-gradient(135deg, #090909 0%, #131313 50%, #090909 100%)",
                border: "1.5px solid #f59e0b44",
                boxShadow: "0 0 35px #f59e0b12, inset 0 1px 0 #fbbf2415",
              }}
            >
              <div className="h-1 w-full absolute top-0 left-0 right-0 bg-gradient-to-r from-amber-400 via-rose-500 to-cyan-400" />
              <div>
                <h2
                  className="text-xl md:text-2xl font-black tracking-wide uppercase text-white"
                  style={{
                    textShadow: "0 0 20px rgba(251,191,36,0.3)",
                  }}
                >
                  <span className="text-amber-400">Product Categories</span> &amp; Pricelist
                </h2>
                <p className="text-amber-400/80 text-xs mt-0.5 font-bold">⚡ Display sequence dynamically arranged by Admin Drag &amp; Drop</p>
              </div>

              {/* View Mode Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-4 py-2 rounded-xl border text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${viewMode === "grid"
                    ? "bg-gradient-to-r from-amber-500 to-red-600 text-slate-950 border-amber-400 shadow-[0_0_18px_#f59e0b60]"
                    : "bg-neutral-900 text-neutral-300 border-white/10 hover:border-amber-400/40 hover:text-white"
                    }`}
                >
                  <LayoutGrid className="h-4 w-4" /> Grid
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-4 py-2 rounded-xl border text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${viewMode === "table"
                    ? "bg-gradient-to-r from-amber-500 to-red-600 text-slate-950 border-amber-400 shadow-[0_0_18px_#f59e0b60]"
                    : "bg-neutral-900 text-neutral-300 border-white/10 hover:border-amber-400/40 hover:text-white"
                    }`}
                >
                  <ListIcon className="h-4 w-4" /> Table
                </button>
                <button
                  onClick={downloadPDFPricelist}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-neutral-100 text-slate-950 border border-amber-400 text-xs font-black flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,255,255,0.2)] cursor-pointer"
                >
                  <FileText className="h-4 w-4 text-red-600" /> PDF
                </button>
              </div>
            </div>

            {/* Category Chips & Search Bar */}
            <div
              data-tour="category-filter"
              className="space-y-4 p-5 rounded-3xl relative overflow-hidden backdrop-blur-md"
              style={{
                background: "linear-gradient(135deg, #0a0a0a 0%, #111111 100%)",
                border: "1.5px solid #ffffff12",
                boxShadow: "0 10px 35px rgba(0,0,0,0.6)",
              }}
            >
              {/* Corner brackets */}
              <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-amber-500/40 rounded-tl-lg pointer-events-none" />
              <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-amber-500/40 rounded-tr-lg pointer-events-none" />

              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {categories.map((cat, catIdx) => {
                  const catTheme = CARD_THEMES[catIdx % CARD_THEMES.length];
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap border transition-all transform-gpu active:scale-95 cursor-pointer flex items-center gap-2 ${isSelected
                        ? "scale-105"
                        : "bg-neutral-900/90 text-neutral-300 border-white/10 hover:bg-neutral-800 hover:text-white"
                        }`}
                      style={isSelected ? {
                        background: catTheme.btnGrad,
                        color: catTheme.btnText,
                        borderColor: catTheme.accent,
                        boxShadow: `0 0 20px ${catTheme.shadow}`,
                      } : {}}
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: isSelected ? catTheme.btnText : catTheme.glow, boxShadow: isSelected ? "none" : `0 0 6px ${catTheme.glow}` }}
                      />
                      <span>{formatCategoryName(cat)}</span>
                    </button>
                  );
                })}
              </div>

              {/* Search Bar */}
              <div className="relative max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-400" />
                <input
                  type="text"
                  placeholder="Search product in English or Tamil..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl text-white placeholder-neutral-500 text-xs focus:outline-none transition-all"
                  style={{
                    background: "#060606",
                    border: "1.5px solid rgba(6, 182, 212, 0.4)",
                    boxShadow: "inset 0 0 20px #00000077",
                  }}
                  onFocus={e => e.target.style.borderColor = "#22d3ee"}
                  onBlur={e => e.target.style.borderColor = "rgba(6, 182, 212, 0.4)"}
                />
              </div>
            </div>

            {/* Products Rendered according to Admin Category Sequence */}
            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-400 mx-auto" style={{ filter: "drop-shadow(0 0 12px #06b6d4)" }} />
                <p className="text-cyan-400 text-xs font-bold mt-3 uppercase tracking-wider">Loading product catalog...</p>
              </div>
            ) : groupedProducts.length === 0 ? (
              <div className="text-center py-12 rounded-3xl bg-neutral-900/80 border border-white/10 p-6 shadow-xl space-y-2">
                <p className="text-neutral-300 text-sm font-bold">No products found matching your search criteria.</p>
                <p className="text-neutral-500 text-xs">Try searching with a different keyword or select "All" categories.</p>
              </div>
            ) : (
              <div data-tour="product-grid" className="space-y-12">
                {groupedProducts.map((group, groupIdx) => {
                  const groupTheme = CARD_THEMES[groupIdx % CARD_THEMES.length];

                  return (
                    <div key={group.category} className="space-y-6">
                      {/* Category Header with Dynamic Jewel-Tone Accent */}
                      <div className="flex items-center gap-3">
                        <span
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shadow-lg shrink-0"
                          style={{
                            background: groupTheme.btnGrad,
                            color: groupTheme.btnText,
                            boxShadow: `0 0 16px ${groupTheme.glow}55`,
                            border: `1px solid ${groupTheme.accent}`,
                          }}
                        >
                          ★
                        </span>
                        <h3
                          className="text-xl md:text-2xl font-black uppercase tracking-wider"
                          style={{
                            color: groupTheme.accent,
                            textShadow: `0 0 20px ${groupTheme.glow}66`,
                          }}
                        >
                          {formatCategoryName(group.category)}
                        </h3>
                        <div
                          className="h-[2px] flex-1 rounded-full"
                          style={{ background: `linear-gradient(to right, ${groupTheme.glow}88, ${groupTheme.glow}22, transparent)` }}
                        />
                      </div>

                      {/* Grid View — Brand New Multi-Color Maximalist Product Cards */}
                      {viewMode === "grid" ? (
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
                          {group.items.map((prod, pIdx) => {
                            const uKey = getProductUniqueKey(prod);
                            const qty = cart[uKey] || 0;
                            const price = parseFloat(prod.price || 0);
                            const discount = parseFloat(prod.discount || 0);
                            const netPrice = discount > 0 ? Math.round(price * (1 - discount / 100)) : price;
                            const savings = Math.max(0, price - netPrice);
                            const tamilName = translateProduct(prod.productname);
                            const theme = getProductTheme(prod, pIdx);

                            return (
                              <Card3D key={uKey}>
                                <div
                                  className="group relative rounded-3xl p-3.5 sm:p-5 flex flex-col justify-between space-y-3 sm:space-y-4 transition-all duration-300 overflow-hidden h-full"
                                  style={{
                                    background: theme.bgGradient,
                                    border: `1.5px solid ${qty > 0 ? theme.accent : theme.border}`,
                                    boxShadow: qty > 0
                                      ? `0 10px 30px rgba(0,0,0,0.8), 0 0 25px ${theme.glow}44`
                                      : `0 8px 25px rgba(0,0,0,0.7)`,
                                  }}
                                >
                                  {/* Dynamic Glowing Accent Top Bar matching theme */}
                                  <div
                                    className="absolute top-0 left-0 right-0 h-1 transition-opacity duration-300"
                                    style={{
                                      background: theme.btnGrad,
                                      boxShadow: `0 0 14px ${theme.glow}`,
                                      opacity: qty > 0 ? 1 : 0.75,
                                    }}
                                  />

                                  {/* Subtle Diagonal Texture Overlay */}
                                  <div
                                    className="absolute inset-0 pointer-events-none opacity-[0.025]"
                                    style={{
                                      backgroundImage: `repeating-linear-gradient(45deg, ${theme.glow} 0, ${theme.glow} 1px, transparent 0, transparent 50%)`,
                                      backgroundSize: "12px 12px",
                                    }}
                                  />

                                  {/* Decorative corner brackets matching card theme */}
                                  <div
                                    className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 rounded-tr pointer-events-none transition-all duration-300"
                                    style={{ borderColor: qty > 0 ? theme.accent : `${theme.glow}55` }}
                                  />

                                  <div className="space-y-3 relative z-10">
                                    {/* Product Image Aperture with Ambient Colored Spotlight */}
                                    <div
                                      className="rounded-2xl overflow-hidden p-1 transition-all duration-300"
                                      style={{
                                        background: `radial-gradient(circle at 50% 50%, ${theme.glow}18 0%, rgba(255,255,255,0.04) 70%, transparent 100%)`,
                                        border: `1px solid ${theme.border}`,
                                      }}
                                    >
                                      <ProductCarousel media={prod.image || prod.images} onImageClick={setPreviewMedia} theme={theme} />
                                    </div>

                                    {/* Meta Pills Row */}
                                    <div className="flex items-center justify-between gap-1.5 flex-wrap">
                                      <span
                                        className="text-[10px] sm:text-[11px] font-mono font-black px-2.5 py-0.5 rounded-lg border flex items-center gap-1.5"
                                        style={{
                                          background: "#030303",
                                          borderColor: theme.border,
                                          color: theme.tag,
                                        }}
                                      >
                                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: theme.glow, boxShadow: `0 0 6px ${theme.glow}` }} />
                                        #{prod.serial_number || prod.id}
                                      </span>

                                      <div className="flex items-center gap-1.5">
                                        {discount > 0 && (
                                          <span
                                            className="text-[10px] sm:text-[11px] font-black px-2.5 py-0.5 rounded-lg text-white"
                                            style={{
                                              background: "linear-gradient(135deg, #ef4444 0%, #f43f5e 100%)",
                                              boxShadow: "0 0 12px rgba(239,68,68,0.45)",
                                              border: "1px solid rgba(255,255,255,0.3)",
                                            }}
                                          >
                                            🔥 {discount}% OFF
                                          </span>
                                        )}
                                        {qty > 0 && (
                                          <span
                                            className="text-[10px] sm:text-[11px] font-black px-2 py-0.5 rounded-lg shadow-sm"
                                            style={{
                                              background: theme.btnGrad,
                                              color: theme.btnText,
                                              boxShadow: `0 0 10px ${theme.glow}`,
                                            }}
                                          >
                                            ✓ {qty} in List
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    {/* Title & Tamil Translation */}
                                    <div>
                                      <h4 className="font-black text-white text-sm sm:text-base line-clamp-2 tracking-tight group-hover:text-white transition-colors">
                                        {prod.productname}
                                      </h4>
                                      {tamilName && (
                                        <div className="flex items-center gap-1.5 mt-1">
                                          <span className="text-xs" style={{ color: theme.accent }}>🪔</span>
                                          <p className="text-xs font-semibold line-clamp-1" style={{ color: `${theme.accent}dd` }}>
                                            {tamilName}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Pricing & Interactive Action Area */}
                                  <div className="pt-3 border-t space-y-3 relative z-10" style={{ borderColor: `${theme.glow}25` }}>
                                    <div className="flex items-baseline justify-between">
                                      <div>
                                        <span
                                          className="text-lg sm:text-2xl font-black text-white tracking-tight"
                                          style={{ textShadow: `0 0 18px ${theme.glow}33` }}
                                        >
                                          ₹{netPrice.toFixed(2)}
                                        </span>
                                        {discount > 0 && (
                                          <span className="ml-2 text-xs text-neutral-500 line-through">
                                            ₹{price.toFixed(2)}
                                          </span>
                                        )}
                                      </div>

                                      <div className="flex items-center gap-1.5">
                                        <span className="text-[10px] sm:text-xs text-neutral-400 uppercase font-black tracking-wider">
                                          /{prod.per || "pkt"}
                                        </span>
                                      </div>
                                    </div>

                                    {/* NEW INTERACTIVE ACTION BUTTON / STEPPER */}
                                    {qty === 0 ? (
                                      <button
                                        onClick={(e) => updateQuantity(prod, 1, e)}
                                        className="w-full py-2.5 sm:py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 hover:scale-[1.02] cursor-pointer"
                                        style={{
                                          background: theme.btnGrad,
                                          color: theme.btnText,
                                          boxShadow: `0 0 20px ${theme.shadow}`,
                                          border: `1px solid ${theme.accent}66`,
                                        }}
                                      >
                                        <span>Add</span>
                                        <Plus className="h-4 w-4 stroke-[3]" />
                                      </button>
                                    ) : (
                                      <div
                                        className="w-full flex items-center justify-between p-1 rounded-2xl transition-all"
                                        style={{
                                          background: "#050505",
                                          border: `1.5px solid ${theme.accent}`,
                                          boxShadow: `0 0 18px ${theme.glow}40`,
                                        }}
                                      >
                                        <button
                                          onClick={() => updateQuantity(prod, -1)}
                                          className="flex-1 h-8 sm:h-9 rounded-xl flex items-center justify-center font-black text-sm transition-all active:scale-90 bg-neutral-800 hover:bg-neutral-700 text-white border border-white/10 cursor-pointer"
                                        >
                                          <Minus className="h-4 w-4" />
                                        </button>
                                        <div className="px-3 text-center">
                                          <span className="font-mono font-black text-sm sm:text-base block leading-none" style={{ color: theme.accent }}>
                                            {qty}
                                          </span>
                                          <span className="text-[9px] uppercase font-bold text-neutral-400 block tracking-wider mt-0.5">
                                            IN LIST
                                          </span>
                                        </div>
                                        <button
                                          onClick={(e) => updateQuantity(prod, 1, e)}
                                          className="flex-1 h-8 sm:h-9 rounded-xl flex items-center justify-center font-black text-sm active:scale-90 transition-all cursor-pointer shadow-md"
                                          style={{
                                            background: theme.btnGrad,
                                            color: theme.btnText,
                                            boxShadow: `0 0 12px ${theme.glow}66`,
                                          }}
                                        >
                                          <Plus className="h-4 w-4 stroke-[3]" />
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </Card3D>
                            );
                          })}
                        </div>
                      ) : (
                        /* Table View with Multi-Color Theme Accents */
                        <div
                          className="rounded-3xl overflow-x-auto"
                          style={{
                            background: "linear-gradient(135deg, #070a0e 0%, #10151c 100%)",
                            border: `1.5px solid ${groupTheme.border}`,
                            boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
                          }}
                        >
                          <table className="w-full text-left text-xs">
                            <thead
                              className="font-bold uppercase border-b"
                              style={{
                                background: "rgba(0,0,0,0.5)",
                                color: groupTheme.accent,
                                borderColor: `${groupTheme.glow}33`,
                              }}
                            >
                              <tr>
                                <th className="p-3.5 border-r border-neutral-800">Code</th>
                                <th className="p-3.5 border-r border-neutral-800">Product Name</th>
                                <th className="p-3.5 border-r border-neutral-800">MRP</th>
                                <th className="p-3.5 border-r border-neutral-800">Discount</th>
                                <th className="p-3.5 border-r border-neutral-800">Net Rate</th>
                                <th className="p-3.5 border-r border-neutral-800">Per</th>
                                <th className="p-3.5 text-center">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800/80">
                              {group.items.map((prod, pIdx) => {
                                const uKey = getProductUniqueKey(prod);
                                const qty = cart[uKey] || 0;
                                const price = parseFloat(prod.price || 0);
                                const discount = parseFloat(prod.discount || 0);
                                const netPrice = discount > 0 ? Math.round(price * (1 - discount / 100)) : price;
                                const tamilName = translateProduct(prod.productname);
                                const theme = getProductTheme(prod, pIdx);

                                return (
                                  <tr key={uKey} className="hover:bg-white/[0.03] transition-colors">
                                    <td className="p-3.5 font-mono font-black border-r border-neutral-800" style={{ color: theme.tag }}>
                                      #{prod.serial_number || prod.id}
                                    </td>
                                    <td className="p-3.5 border-r border-neutral-800">
                                      <span className="font-bold text-white block">{prod.productname}</span>
                                      {tamilName && <span className="text-[11px] block mt-0.5" style={{ color: `${theme.accent}cc` }}>{tamilName}</span>}
                                    </td>
                                    <td className="p-3.5 text-neutral-500 line-through border-r border-neutral-800">
                                      ₹{price.toFixed(2)}
                                    </td>
                                    <td className="p-3.5 font-bold border-r border-neutral-800" style={{ color: theme.glow }}>
                                      {discount > 0 ? `${discount}%` : "-"}
                                    </td>
                                    <td className="p-3.5 font-black text-white border-r border-neutral-800 text-sm">
                                      ₹{netPrice.toFixed(2)}
                                    </td>
                                    <td className="p-3.5 uppercase text-neutral-400 border-r border-neutral-800">
                                      {prod.per || "pkt"}
                                    </td>
                                    <td className="p-3.5 text-center">
                                      {qty === 0 ? (
                                        <button
                                          onClick={(e) => updateQuantity(prod, 1, e)}
                                          className="px-3 py-1.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1 mx-auto transition-all active:scale-95 cursor-pointer"
                                          style={{
                                            background: theme.btnGrad,
                                            color: theme.btnText,
                                            boxShadow: `0 0 10px ${theme.shadow}`,
                                          }}
                                        >
                                          <Plus className="h-3.5 w-3.5 stroke-[3]" /> Add
                                        </button>
                                      ) : (
                                        <div
                                          className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-black border"
                                          style={{ borderColor: theme.accent, boxShadow: `0 0 10px ${theme.glow}33` }}
                                        >
                                          <button
                                            onClick={() => updateQuantity(prod, -1)}
                                            className="w-6 h-6 rounded-lg bg-neutral-800 text-white flex items-center justify-center font-bold text-xs hover:bg-neutral-700 active:scale-90"
                                          >
                                            <Minus className="h-3 w-3" />
                                          </button>
                                          <span className="w-6 text-center font-mono font-black text-xs" style={{ color: theme.accent }}>
                                            {qty}
                                          </span>
                                          <button
                                            onClick={(e) => updateQuantity(prod, 1, e)}
                                            className="w-6 h-6 rounded-lg text-slate-950 flex items-center justify-center font-bold text-xs active:scale-90"
                                            style={{ background: theme.btnGrad }}
                                          >
                                            <Plus className="h-3 w-3 stroke-[3]" />
                                          </button>
                                        </div>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>



          {/* Statutory Compliance Notice - Maximalist Security Banner */}
          <section
            className="relative p-6 sm:p-8 rounded-3xl overflow-hidden space-y-4"
            style={{
              background: "linear-gradient(135deg, #0a0700 0%, #111111 50%, #0a0700 100%)",
              border: "1.5px solid #f59e0b44",
              boxShadow: "0 0 40px #f59e0b15, inset 0 1px 0 #fbbf2415",
            }}
          >
            {/* Top rainbow accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-amber-400 via-emerald-400 via-cyan-400 to-purple-500" style={{ boxShadow: "0 0 15px #f59e0b" }} />

            {/* Corner brackets */}
            <div className="absolute top-3 left-3 w-7 h-7 border-t-2 border-l-2 border-amber-500/50 rounded-tl-lg pointer-events-none" />
            <div className="absolute top-3 right-3 w-7 h-7 border-t-2 border-r-2 border-amber-500/50 rounded-tr-lg pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-7 h-7 border-b-2 border-l-2 border-amber-500/50 rounded-bl-lg pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-7 h-7 border-b-2 border-r-2 border-amber-500/50 rounded-br-lg pointer-events-none" />

            {/* Hatching texture */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.03]"
              style={{ backgroundImage: "repeating-linear-gradient(45deg, #f59e0b 0, #f59e0b 1px, transparent 0, transparent 50%)", backgroundSize: "14px 14px" }}
            />

            <div className="relative z-10 space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shadow-md">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <h3
                  className="font-black text-sm sm:text-base uppercase tracking-wide text-amber-400"
                  style={{ textShadow: "0 0 15px rgba(245,158,11,0.3)" }}
                >
                  Supreme Court Compliance &amp; Statutory Legal Notice
                </h3>
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed max-w-4xl">
                As per 2018 Supreme Court regulations, direct online e-commerce transactions of firecrackers are prohibited. <strong className="text-amber-400 font-bold">Deepa Crackers operates in 100% legal compliance.</strong> Please add your desired items to the estimate list and submit your enquiry. Our team in Thiruthuraipoondi will contact you within 24 hours to confirm order booking and dispatch details.
              </p>

              {/* Tag badges */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  { label: "⚖️ 100% Legal Compliance", color: "#10b981" },
                  { label: "🏛️ Supreme Court 2018 Guidelines", color: "#f59e0b" },
                  { label: "🚚 Direct Transport Dispatch", color: "#06b6d4" },
                  { label: "🛡️ Safe Festival Fun", color: "#d946ef" },
                ].map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                    style={{ background: `${tag.color}15`, border: `1px solid ${tag.color}40`, color: tag.color }}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Mirrored bottom bar */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 via-cyan-400 to-amber-400" />
          </section>

          {/* AI Assistant Modal */}
          <AnimatePresence>
            {showAiModal && (
              <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="w-full max-w-lg rounded-3xl bg-neutral-900 border border-white/20 p-6 space-y-6 shadow-2xl relative text-white"
                >
                  <button
                    onClick={() => {
                      setShowAiModal(false);
                      setAiStep(0);
                      setAiBudget("");
                      setAiPreferences({ kids: false, sound: false, night: false, kidsnight: false });
                      setSuggestedCart({});
                    }}
                    className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1"
                  >
                    <X className="h-6 w-6" />
                  </button>

                  <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
                    <Bot className="h-6 w-6 text-red-500" />
                    <h2 className="text-xl font-black text-white">Smart AI Fireworks Assistant</h2>
                  </div>

                  {aiStep === 0 && (
                    <div className="space-y-4">
                      <p className="text-xs font-bold text-neutral-300 uppercase">Step 1: What is your approximate festival budget? (₹)</p>
                      <input
                        type="number"
                        value={aiBudget}
                        onChange={(e) => setAiBudget(e.target.value)}
                        placeholder="e.g. 3000"
                        className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-white text-sm focus:outline-none focus:border-red-500 shadow-inner"
                      />
                      <button
                        onClick={() => {
                          if (!aiBudget || Number(aiBudget) <= 0) {
                            alert("Please enter a valid budget amount in ₹");
                            return;
                          }
                          setAiStep(1);
                        }}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-xs shadow-lg shadow-red-600/30 transition-all border border-red-500"
                      >
                        Next: Select Preferences →
                      </button>
                    </div>
                  )}

                  {aiStep === 1 && (
                    <div className="space-y-4">
                      <p className="text-xs font-bold text-neutral-300 uppercase">Step 2: Select Firework Preferences</p>
                      <div className="space-y-2.5">
                        {[
                          { key: "kids", label: "🎠 Kids Varieties (Twinkling Star, Pencils, Novelties)" },
                          { key: "sound", label: "💥 Loud Sound Crackers (Bombs, Sound Crackers)" },
                          { key: "night", label: "🚀 Night Sky (Rockets, Repeating Shots, Sky Shots)" },
                          { key: "kidsnight", label: "✨ Kids Night (Sparklers, Flower Pots, Chakkars)" },
                        ].map(({ key, label }) => (
                          <label key={key} className="flex items-center gap-3 p-2.5 rounded-xl bg-black border border-neutral-800 shadow-md cursor-pointer hover:border-neutral-700">
                            <input
                              type="checkbox"
                              checked={aiPreferences[key]}
                              onChange={(e) => setAiPreferences((prev) => ({ ...prev, [key]: e.target.checked }))}
                              className="w-4 h-4 accent-red-600 rounded border-neutral-700"
                            />
                            <span className="text-xs font-bold text-neutral-200">{label}</span>
                          </label>
                        ))}
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => setAiStep(0)}
                          className="w-1/3 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 font-bold text-xs shadow-md"
                        >
                          ← Back
                        </button>
                        <button
                          onClick={generateSuggestions}
                          className="w-2/3 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-xs shadow-lg shadow-red-600/30 border border-red-500"
                        >
                          Generate AI Combination ✨
                        </button>
                      </div>
                    </div>
                  )}

                  {aiStep === 2 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                        <div>
                          <p className="text-xs font-black text-white uppercase">Suggested Combination</p>
                          <p className="text-[11px] text-neutral-400">
                            {Object.keys(suggestedCart).length} product variety(s) • Total: <strong className="text-red-400">₹{suggestedTotalAmount.toFixed(2)}</strong> (Max Budget: ₹{Number(aiBudget).toFixed(2)})
                          </p>
                        </div>
                        <button
                          onClick={() => setAiStep(1)}
                          className="px-2.5 py-1 rounded-lg bg-neutral-800 border border-neutral-700 text-[11px] font-bold text-neutral-300 hover:text-white"
                        >
                          Change Preferences
                        </button>
                      </div>

                      <div className="max-h-60 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                        {Object.entries(suggestedCart).map(([key, qty]) => {
                          const p = products.find((x) => getProductUniqueKey(x) === key || x.serial_number === key || String(x.id) === String(key));
                          if (!p) return null;
                          const price = parseFloat(p.price || 0);
                          const discount = parseFloat(p.discount || 0);
                          const finalPrice = discount > 0 ? Math.round(price * (1 - discount / 100)) : price;

                          return (
                            <div key={key} className="flex items-center justify-between p-2.5 rounded-xl bg-black border border-neutral-800 text-xs">
                              <div className="flex items-center gap-2 flex-1 min-w-0 pr-2">
                                {renderProductThumbnail(p.image || p.images)}
                                <div className="min-w-0 flex-1">
                                  <p className="font-bold text-white truncate">{p.productname}</p>
                                  <p className="text-[10px] text-neutral-400">₹{finalPrice.toFixed(2)} × {qty}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <div className="inline-flex items-center gap-1 p-0.5 rounded-lg bg-neutral-900 border border-neutral-800">
                                  <button
                                    onClick={() => updateSuggestedQty(key, -1)}
                                    className="w-4 h-4 rounded bg-neutral-800 border border-neutral-700 text-neutral-300 flex items-center justify-center font-bold text-[10px]"
                                  >
                                    -
                                  </button>
                                  <span className="w-4 text-center font-black text-[10px] text-white">{qty}</span>
                                  <button
                                    onClick={() => updateSuggestedQty(key, 1)}
                                    className="w-4 h-4 rounded bg-red-600 border border-red-500 text-white flex items-center justify-center font-bold text-[10px]"
                                  >
                                    +
                                  </button>
                                </div>
                                <span className="font-black text-white w-14 text-right">₹{(finalPrice * qty).toFixed(2)}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <button
                        onClick={addSuggestedToCart}
                        className="w-full py-3.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-black text-xs shadow-lg transition-all border border-white"
                      >
                        Add All Suggested Items to Cart 🛒
                      </button>
                    </div>
                  )}
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Media Preview Modal */}
          <AnimatePresence>
            {previewMedia && (
              <div
                className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
                onClick={() => setPreviewMedia(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-neutral-900 rounded-3xl p-4 border border-white/20 shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden relative flex flex-col items-center justify-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setPreviewMedia(null)}
                    className="absolute top-3 right-3 text-white bg-red-600 hover:bg-red-500 border border-red-500 rounded-xl p-1 shadow-md z-10"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  <div className="w-full h-full flex items-center justify-center p-2">
                    <img
                      src={Array.isArray(previewMedia) ? previewMedia[0] : previewMedia}
                      alt="Product Enlarged"
                      className="max-h-[75vh] w-auto object-contain rounded-2xl border border-neutral-800"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = defaultImage;
                      }}
                    />
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Floating Bottom Cart Summary Bar - Maximalist Luxury Bar */}
          <AnimatePresence>
            {cartItems.length > 0 && (
              <motion.div
                data-tour="cart-summary"
                initial={{ y: 100, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 100, opacity: 0, scale: 0.95 }}
                className="fixed bottom-5 left-4 right-4 z-40 max-w-4xl mx-auto rounded-3xl p-4 sm:p-5 flex items-center justify-between gap-4 text-white overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, rgba(8,8,8,0.96) 0%, rgba(18,18,18,0.96) 100%)",
                  backdropFilter: "blur(20px)",
                  border: "1.5px solid #f59e0b55",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.8), 0 0 35px rgba(245,158,11,0.25)",
                }}
              >
                {/* 5-stop rainbow top bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-amber-400 via-emerald-400 via-cyan-400 to-purple-500" style={{ boxShadow: "0 0 14px #f59e0b" }} />

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl bg-amber-500/20 border border-amber-500/50 text-amber-300 shadow-md">
                    🛒
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase font-mono bg-neutral-900 border border-amber-500/40 text-amber-300">
                        {cartItems.length} Variety{cartItems.length > 1 ? "ies" : ""}
                      </span>
                      <span className="text-xs text-neutral-400 font-bold hidden sm:inline">Selected for Enquiry</span>
                    </div>
                    <p
                      className="text-xl sm:text-3xl font-black mt-0.5 text-amber-400"
                      style={{
                        textShadow: "0 0 20px rgba(245,158,11,0.4)",
                      }}
                    >
                      ₹{finalCheckoutTotal.toFixed(2)}
                    </p>
                  </div>
                </div>

                <button
                  data-tour="checkout-btn"
                  onClick={() => {
                    setShowCheckoutModal(true);
                    setCheckoutStep(0);
                  }}
                  className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl text-slate-950 font-black text-xs sm:text-sm shadow-xl transition-all flex items-center gap-2 hover:scale-105 active:scale-95 cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #ef4444 100%)",
                    boxShadow: "0 0 25px rgba(245,158,11,0.5)",
                    border: "1px solid #fbbf24",
                  }}
                >
                  <span>Submit Order Enquiry</span>
                  <ArrowRight className="h-4 w-4 stroke-[3]" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Multi-Step Product Purchase Checkout Modal */}
          <AnimatePresence>
            {showCheckoutModal && (
              <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="w-full max-w-lg rounded-3xl bg-neutral-900 border border-white/20 p-5 md:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto scrollbar-thin text-white"
                >
                  <button
                    onClick={() => {
                      setShowCheckoutModal(false);
                      setCheckoutStep(0);
                    }}
                    className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 z-10"
                  >
                    <X className="h-6 w-6" />
                  </button>

                  {/* Header Step Progress */}
                  <div className="space-y-2">
                    <h2 className="text-xl md:text-2xl font-black text-white">Checkout & Order Enquiry</h2>
                    <div className="flex items-center gap-1.5 text-[11px] md:text-xs font-bold overflow-x-auto pb-1">
                      <span className={`px-2 py-0.5 rounded-lg border whitespace-nowrap ${checkoutStep === 0 ? 'bg-red-600 text-white border-red-500 font-black' : 'bg-neutral-800 text-neutral-300 border-neutral-700'}`}>1. Customer Details</span>
                      <span className="text-neutral-500">→</span>
                      <span className={`px-2 py-0.5 rounded-lg border whitespace-nowrap ${checkoutStep === 1 ? 'bg-red-600 text-white border-red-500 font-black' : 'bg-neutral-800 text-neutral-300 border-neutral-700'}`}>2. Location & Offer</span>
                      <span className="text-neutral-500">→</span>
                      <span className={`px-2 py-0.5 rounded-lg border whitespace-nowrap ${checkoutStep === 2 ? 'bg-red-600 text-white border-red-500 font-black' : 'bg-neutral-800 text-neutral-300 border-neutral-700'}`}>3. Review Products</span>
                    </div>
                  </div>

                  <form onSubmit={handleCheckoutSubmit} className="space-y-4">

                    {/* Step 0: Customer Personal Details */}
                    {checkoutStep === 0 && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">Full Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="Enter customer full name"
                            value={customer.name}
                            onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white text-xs focus:outline-none focus:border-red-500 shadow-inner"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">Mobile Number *</label>
                          <input
                            type="tel"
                            required
                            maxLength={10}
                            placeholder="10-digit mobile number"
                            value={customer.mobile}
                            onChange={(e) => setCustomer({ ...customer, mobile: e.target.value.replace(/\D/g, "") })}
                            className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white text-xs focus:outline-none focus:border-red-500 shadow-inner"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">Email Address (Optional)</label>
                          <input
                            type="email"
                            placeholder="email@example.com"
                            value={customer.email || ""}
                            onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white text-xs focus:outline-none focus:border-red-500 shadow-inner"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">Delivery Address *</label>
                          <textarea
                            rows={2}
                            required
                            placeholder="Full delivery street address..."
                            value={customer.address}
                            onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl bg-black border border-white/20 text-white text-xs focus:outline-none focus:border-red-500 resize-none shadow-inner"
                          ></textarea>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (!customer.name || !customer.mobile || customer.mobile.length !== 10 || !customer.address) {
                              alert("Please fill in Name, 10-digit Mobile Number, and Address.");
                              return;
                            }
                            setCheckoutStep(1);
                          }}
                          className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-xs shadow-lg shadow-red-600/30 transition-all border border-red-500"
                        >
                          Next: Location, Address & Offers →
                        </button>
                      </div>
                    )}

                    {/* Step 1: Location, Address & Offer Summary */}
                    {checkoutStep === 1 && (
                      <div className="space-y-4">
                        {/* Address Review Box */}
                        <div className="p-3.5 rounded-xl bg-black border border-neutral-800 text-xs space-y-1 shadow-inner">
                          <p className="font-bold text-red-500 flex items-center gap-1.5">
                            <MapPin className="h-4 w-4 text-red-500" /> Delivery Target Address:
                          </p>
                          <p className="font-bold text-white">{customer.name} ({customer.mobile})</p>
                          <p className="text-neutral-300 leading-tight">{customer.address}</p>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">State *</label>
                          <select
                            value={customer.state}
                            onChange={(e) => setCustomer({ ...customer, state: e.target.value, district: "" })}
                            className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white text-xs focus:outline-none focus:border-red-500"
                          >
                            <option value="Tamil Nadu">Tamil Nadu</option>
                            {states.map((s) => (
                              <option key={s.id || s.name} value={s.name}>{s.name}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">District *</label>
                          <select
                            value={customer.district}
                            onChange={(e) => setCustomer({ ...customer, district: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white text-xs focus:outline-none focus:border-red-500"
                          >
                            <option value="Thiruthuraipoondi">Thiruthuraipoondi</option>
                            {districts.map((d) => (
                              <option key={d.id || d.name} value={d.name}>{d.name}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">Apply Promocode / Coupon</label>
                          <select
                            value={selectedPromoCode}
                            onChange={(e) => handleApplyPromoCode(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white text-xs focus:outline-none focus:border-red-500"
                          >
                            <option value="">No Promocode Selected</option>
                            {promoCodes.map((promo) => (
                              <option key={promo.id || promo.code} value={promo.code}>
                                {promo.code} ({promo.discount}% OFF)
                              </option>
                            ))}
                          </select>

                          {appliedPromo && (
                            <p className="text-[11px] font-bold text-red-400 mt-1.5 flex items-center gap-1">
                              <Tag className="h-3.5 w-3.5" /> Promocode {appliedPromo.code} applied! ({appliedPromo.discount}% OFF)
                            </p>
                          )}
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setCheckoutStep(0)}
                            className="w-1/3 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 font-bold text-xs shadow-md"
                          >
                            ← Back
                          </button>
                          <button
                            type="button"
                            onClick={() => setCheckoutStep(2)}
                            className="w-2/3 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-xs shadow-lg shadow-red-600/30 border border-red-500"
                          >
                            Review Products & Images →
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Product Review with Images & Mobile Optimised View */}
                    {checkoutStep === 2 && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                          <p className="text-xs font-black text-white uppercase">Review Order Items ({cartItems.length})</p>
                          <p className="text-[11px] font-bold text-red-400">📍 {customer.district}, {customer.state}</p>
                        </div>

                        {/* Product List with Image Thumbnails */}
                        <div className="max-h-64 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                          {cartItems.map((item) => {
                            const tamilName = translateProduct(item.productname);
                            return (
                              <div key={item.uniqueKey} className="flex items-center justify-between p-2.5 rounded-xl bg-black border border-neutral-800 shadow-md gap-2">
                                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                  {renderProductThumbnail(item.image || item.images)}
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1">
                                      <span className="text-[9px] px-1 rounded bg-white/10 border border-white/20 text-white font-bold">#{item.serial_number || item.id}</span>
                                      <span className="text-xs font-bold text-white truncate">{item.productname}</span>
                                    </div>
                                    {tamilName && <p className="text-[10px] text-neutral-400 truncate">{tamilName}</p>}
                                    <p className="text-[10px] text-neutral-400">₹{item.netPrice.toFixed(2)} per {item.per || 'pkt'}</p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <div className="inline-flex items-center gap-1 p-0.5 rounded-lg bg-neutral-900 border border-neutral-800">
                                    <button
                                      type="button"
                                      onClick={() => updateQuantity(item, -1)}
                                      className="w-5 h-5 rounded bg-neutral-800 border border-neutral-700 text-neutral-300 flex items-center justify-center font-bold text-xs hover:bg-neutral-700"
                                    >
                                      -
                                    </button>
                                    <span className="w-5 text-center font-black text-xs text-white">{item.qty}</span>
                                    <button
                                      type="button"
                                      onClick={(e) => updateQuantity(item, 1, e)}
                                      className="w-5 h-5 rounded bg-red-600 border border-red-500 text-white flex items-center justify-center font-bold text-xs hover:bg-red-500"
                                    >
                                      +
                                    </button>
                                  </div>
                                  <span className="font-black text-xs text-white w-16 text-right">₹{item.subtotal.toFixed(2)}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Cost Breakdown */}
                        <div className="p-3.5 rounded-xl bg-black border border-neutral-800 space-y-1 text-xs shadow-inner">
                          <div className="flex justify-between text-neutral-400">
                            <span>Cart Estimate Subtotal:</span>
                            <span>₹{totalAmount.toFixed(2)}</span>
                          </div>
                          {appliedPromo && (
                            <div className="flex justify-between text-red-400 font-bold">
                              <span>Promocode Discount ({appliedPromo.discount}%):</span>
                              <span>-₹{promoDiscountAmount.toFixed(2)}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-white font-black text-sm pt-1 border-t border-neutral-800">
                            <span>Total Amount Payable:</span>
                            <span className="text-red-500">₹{finalCheckoutTotal.toFixed(2)}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setCheckoutStep(1)}
                            className="w-1/3 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 font-bold text-xs shadow-md"
                          >
                            ← Back
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-2/3 py-3.5 rounded-xl bg-white hover:bg-neutral-200 text-black border border-white font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                          >
                            {isSubmitting ? "Submitting..." : "Confirm & Download Invoice Bill 📄"}
                          </button>
                        </div>
                      </div>
                    )}

                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Sky Shot Center Celebration Modal */}
          <SkyShotBookingSuccessModal
            isOpen={bookingSuccess}
            onClose={() => setBookingSuccess(false)}
            orderId={lastCompletedOrderId}
            customerName={customer.name}
            totalAmount={finalCheckoutTotal}
          />

          {/* ── FOOTER ───────────────────────────── */}
          <footer
            className="relative mx-1 sm:mx-4 mb-8 mt-14 rounded-3xl overflow-hidden"
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
                <a href="https://www.instagram.com/deepa_crackers/" target="_blank" rel="noopener noreferrer" className="text-xs font-black block mt-1 text-[#ff5277] hover:underline flex items-center gap-1">📸 @deepa_crackers</a>
                <a href="mailto:deepatraders1985@gmail.com" className="text-xs font-black block mt-1 text-neutral-300 hover:underline">deepatraders1985@gmail.com</a>
              </div>

              <div>
                <h2 className="text-base font-black text-white mb-1 uppercase tracking-widest">Quick Navigation</h2>
                <div className="h-px w-16 bg-gradient-to-r from-purple-500 to-transparent mb-3" />
                <ul className="space-y-1.5 text-xs text-neutral-400">
                  {[
                    { label: "Home", href: "/" },
                    { label: "Track Order", href: "/status" },
                    { label: "Safety Tips", href: "/safety-tips" },
                    { label: "About Us", href: "/about-us" },
                    { label: "Contact Us", href: "/contact-us" },
                  ].map((link) => (
                    <li key={link.href}>
                      <a href={link.href} className="hover:text-amber-400 transition flex items-center gap-1.5 group">
                        <span className="w-1 h-1 rounded-full bg-amber-500/40 group-hover:bg-amber-400 transition" />
                        {link.label}
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
        </main>
      </div>

      {/* Promocode Bumping Rocket Burst — launches, explodes, and displays exclusive deals */}
      {!showCheckoutModal && promoCodes.length > 0 && (
        <PromoBurst promoCodes={promoCodes} onApplyPromo={(code) => handleApplyPromoCode(code)} />
      )}

      {/* Fireworks Launch Screen — shown once per session */}
      {showLauncher && (
        <Launch
          onComplete={() => {
            sessionStorage.setItem("deepa_crackers_launched", "1");
            setShowLauncher(false);
            setShowWhyModal(true);
          }}
        />
      )}

      {/* Why Deepa Crackers modal — auto-dismisses after 10 seconds */}
      {showWhyModal && (
        <WhyDeepaCrackersModal
          onClose={() => setShowWhyModal(false)}
        />
      )}

      {/* Click Micro Popper Sparkles Overlay (Ultra-Bright, Shockwave Ring & Core Flash) */}
      {popperSparks.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-[999999] overflow-hidden">
          {popperSparks.map((spark) => (
            <div
              key={spark.id}
              className="absolute"
              style={{ left: spark.x, top: spark.y }}
            >
              {/* Expanding Golden Shockwave Ring */}
              <motion.div
                initial={{ scale: 0.3, opacity: 1 }}
                animate={{ scale: 2.4, opacity: 0 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="absolute -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-2 border-amber-300 shadow-[0_0_20px_#ffd700]"
              />

              {/* Central Radiant Flash */}
              <motion.div
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: [0, 2.0, 0], opacity: [0, 0.9, 0] }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full"
                style={{
                  background: "radial-gradient(circle, #ffffff 0%, #ffd700 40%, transparent 70%)",
                  boxShadow: "0 0 25px #ffd700",
                }}
              />

              {/* Radiant Multi-Color Sparkle Particles */}
              {spark.particles.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 0.6 }}
                  animate={{
                    x: [0, p.dx * 0.45, p.dx],
                    y: [0, p.dy * 0.45, p.dy + 8],
                    opacity: [1, 1, 0.8, 0],
                    scale: [0.6, 1.8, 1.2, 0],
                  }}
                  transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute rounded-full -translate-x-1/2 -translate-y-1/2"
                  style={{
                    width: p.size,
                    height: p.size,
                    backgroundColor: p.color,
                    boxShadow: `0 0 16px ${p.color}, 0 0 8px #ffffff, 0 0 26px ${p.color}`,
                    willChange: "transform, opacity",
                  }}
                >
                  {/* Bright Diamond White Core inside larger sparkles */}
                  {p.size > 5 && (
                    <div className="w-1/2 h-1/2 rounded-full bg-white mx-auto my-auto mt-[25%]" />
                  )}
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}