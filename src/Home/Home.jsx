import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Phone, Search, ArrowRight, ShieldCheck, FileText, LayoutGrid, List as ListIcon, X, Plus, Minus, ChevronLeft, ChevronRight, Bot, CheckCircle, MapPin, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Navbar from '../Component/Navbar';
import Launch from '../Component/Launch';
import BackgroundFireworks from '../Component/BackgroundFireworks';
import PromoBurst from '../Component/PromoBurst';
import Card3D from '../Component/Card3D';
import WhyDeepaCrackersModal from '../Component/WhyDeepaCrackersModal';
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
const ProductCarousel = ({ media, onImageClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const mediaItems = useMemo(() => parseMediaItems(media), [media]);

  if (mediaItems.length === 0) {
    return (
      <div className="relative w-full h-36 sm:h-48 rounded-2xl bg-white border border-white/20 overflow-hidden select-none flex items-center justify-center p-2 shadow-sm">
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
    <div className="relative w-full h-36 sm:h-48 rounded-2xl bg-white border border-white/20 overflow-hidden group select-none flex items-center justify-center p-2 shadow-sm">
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
          className="w-full h-full object-contain cursor-pointer hover:scale-105 transition-transform duration-300"
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
            className="absolute left-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded bg-white/90 border border-slate-900 text-slate-900 flex items-center justify-center font-bold text-xs shadow-sm hover:bg-amber-300"
          >
            ‹
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
            }}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded bg-white/90 border border-slate-900 text-slate-900 flex items-center justify-center font-bold text-xs shadow-sm hover:bg-amber-300"
          >
            ›
          </button>
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {mediaItems.map((_, idx) => (
              <span
                key={idx}
                className={`w-1.5 h-1.5 rounded-full border border-slate-900 ${idx === currentIndex ? "bg-amber-400" : "bg-white"
                  }`}
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

  // Micro Popper Sparkle Effect on Plus Button
  const [popperSparks, setPopperSparks] = useState([]);

  const triggerPopperSparkle = (e) => {
    if (!e) return;
    const rect = e.currentTarget?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : e.clientX || window.innerWidth / 2;
    const y = rect ? rect.top + rect.height / 2 : e.clientY || window.innerHeight / 2;
    const id = Date.now() + Math.random();

    const particles = Array.from({ length: 14 }).map((_, i) => {
      const angle = (i * (360 / 14) + Math.random() * 20) * (Math.PI / 180);
      const velocity = 35 + Math.random() * 45;
      return {
        id: `${id}-${i}`,
        dx: Math.cos(angle) * velocity,
        dy: Math.sin(angle) * velocity,
        color: ['#ef4444', '#f59e0b', '#10b981', '#06b6d4', '#ec4899', '#ffd700', '#ffffff'][i % 7],
        size: 3 + Math.random() * 3,
      };
    });

    setPopperSparks((prev) => [...prev, { id, x, y, particles }]);
    setTimeout(() => {
      setPopperSparks((prev) => prev.filter((p) => p.id !== id));
    }, 700);
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
    <div className="min-h-screen bg-[#050505] text-white flex flex-col relative selection:bg-red-600 selection:text-white overflow-x-hidden">
      {/* Continuous Background & Foreground Fireworks (paused during checkout address filling) */}
      <BackgroundFireworks isPaused={showCheckoutModal} />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-grow pt-24 pb-20 px-3 md:px-8 max-w-7xl mx-auto w-full space-y-10">

          {/* Dynamic Interactive Banner Slider Section */}
          <section className="relative hundred:mt-5 mobile:mt-5 w-full rounded-3xl border border-white/15 shadow-2xl overflow-hidden bg-neutral-900/90">
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
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-black/90 border border-white/20 text-white flex items-center justify-center font-bold shadow-lg hover:bg-neutral-800 hover:border-red-500 hover:text-red-500 transition-all"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setCurrentBannerIdx((prev) => (prev + 1) % banners.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-black/90 border border-white/20 text-white flex items-center justify-center font-bold shadow-lg hover:bg-neutral-800 hover:border-red-500 hover:text-red-500 transition-all"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>

                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                      {banners.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentBannerIdx(idx)}
                          className={`w-3 h-3 rounded-full border transition-all ${idx === currentBannerIdx ? "bg-red-600 scale-125 border-red-500 shadow-sm shadow-red-600" : "bg-neutral-700 border-neutral-600"
                            }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="p-8 md:p-12 text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="h-4 w-4 text-red-500" /> ✏️ Deepa Crackers • THIRUTHURAIPOONDI
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-white">
                  Illuminating Celebrations with Supreme Quality Fireworks
                </h1>
                <p className="text-neutral-300 text-xs md:text-sm max-w-2xl mx-auto leading-relaxed">
                  Discover supreme quality crackers, ground chakkars, sparklers, and multi-color sky shots. Directly dispatched to Thiruthuraipoondi & across Tamil Nadu with 100% legal compliance.
                </p>
              </div>
            )}
          </section>

          {/* Hero Action Bar */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setShowAiModal(true)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-xs md:text-sm shadow-lg shadow-red-600/30 hover:from-red-500 hover:to-red-600 transition-all flex items-center gap-2 border border-red-500"
            >
              <Bot className="h-4 w-4 text-white" />
              <span>AI Smart Fireworks Assistant</span>
            </button>
            <button
              onClick={downloadPDFPricelist}
              disabled={downloadingPDF}
              className="px-6 py-3 rounded-xl bg-white hover:bg-neutral-200 text-black border border-white font-bold text-xs md:text-sm shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <FileText className="h-4 w-4 text-red-600" />
              <span>{downloadingPDF ? "Generating PDF..." : "Download PDF Pricelist"}</span>
            </button>
            <button
              onClick={() => navigate("/status")}
              className="px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 font-bold text-xs md:text-sm shadow-md transition-all"
            >
              Track Order Status
            </button>
          </div>

          {/* Product Catalog Showcase with Admin Dynamic Ordering */}
          <section className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neutral-900/90 p-5 rounded-2xl border border-white/15 shadow-xl backdrop-blur-md">
              <div>
                <h2 className="text-xl md:text-2xl font-black text-white">Product Categories & Pricelist</h2>
                <p className="text-neutral-400 text-xs mt-0.5">⚡ Display sequence dynamically arranged by Admin Drag & Drop</p>
              </div>

              {/* View Mode Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${viewMode === "grid" ? "bg-red-600 text-white border-red-500 shadow-md shadow-red-600/30 font-black" : "bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700 hover:text-white"
                    }`}
                >
                  <LayoutGrid className="h-4 w-4" /> Grid
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${viewMode === "table" ? "bg-red-600 text-white border-red-500 shadow-md shadow-red-600/30 font-black" : "bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700 hover:text-white"
                    }`}
                >
                  <ListIcon className="h-4 w-4" /> Table
                </button>
                <button
                  onClick={downloadPDFPricelist}
                  className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-neutral-200 text-black border border-white text-xs font-bold flex items-center gap-1.5 shadow-md"
                >
                  <FileText className="h-4 w-4 text-red-600" /> PDF
                </button>
              </div>
            </div>

            {/* Category Chips & Search Bar */}
            <div data-tour="category-filter" className="space-y-4 p-4 bg-gradient-to-b from-neutral-900/95 to-neutral-950/90 rounded-3xl border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-md">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap border transition-all transform-gpu active:scale-95 ${selectedCategory === cat
                      ? "bg-gradient-to-r from-red-600 via-red-500 to-rose-600 text-white border-red-400 font-black shadow-[0_6px_20px_rgba(239,68,68,0.4)]"
                      : "bg-neutral-800/80 text-neutral-300 border-white/10 hover:bg-neutral-700/80 hover:text-white hover:border-amber-400/40"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search product in English or Tamil..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black border border-white/20 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-red-500 focus:bg-neutral-950 shadow-inner"
                />
              </div>
            </div>

            {/* Products Rendered according to Admin Category Sequence */}
            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
                <p className="text-neutral-400 text-xs mt-3">Loading product catalog...</p>
              </div>
            ) : groupedProducts.length === 0 ? (
              <div className="text-center py-12 rounded-2xl bg-neutral-900/80 border border-white/10 p-6 shadow-xl">
                <p className="text-neutral-300 text-xs">No products found matching your search criteria.</p>
              </div>
            ) : (
              <div data-tour="product-grid" className="space-y-8">
                {groupedProducts.map((group) => (
                  <div key={group.category} className="space-y-4">
                    {/* Category Header */}
                    <div className="flex items-center gap-2 border-b border-dashed border-neutral-700 pb-2">
                      <span className="w-6 h-6 rounded-lg bg-red-600 text-white border border-red-500 flex items-center justify-center text-xs font-black">
                        ★
                      </span>
                      <h3 className="text-lg font-black text-white uppercase tracking-tight">{group.category}</h3>
                    </div>

                    {/* Grid View */}
                    {viewMode === "grid" ? (
                      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
                        {group.items.map((prod) => {
                          const uKey = getProductUniqueKey(prod);
                          const qty = cart[uKey] || 0;
                          const price = parseFloat(prod.price || 0);
                          const discount = parseFloat(prod.discount || 0);
                          const netPrice = discount > 0 ? Math.round(price * (1 - discount / 100)) : price;
                          const tamilName = translateProduct(prod.productname);

                          return (
                            <Card3D key={uKey}>
                              <div className="group relative bg-[#0e0e0e] hover:bg-[#141414] rounded-3xl p-3.5 sm:p-5 border border-white/15 hover:border-amber-500/70 shadow-[0_8px_25px_rgba(0,0,0,0.7)] hover:shadow-[0_15px_35px_rgba(239,68,68,0.2)] flex flex-col justify-between space-y-3 sm:space-y-4 transition-all duration-200 overflow-hidden h-full">
                                {/* Subtle top shine accent */}
                                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                                <div className="space-y-2 sm:space-y-3">
                                  {/* Product Image Carousel */}
                                  <div className="rounded-2xl overflow-hidden border border-white/10 shadow-sm group-hover:border-amber-500/30 transition-colors">
                                    <ProductCarousel media={prod.image || prod.images} onImageClick={setPreviewMedia} />
                                  </div>

                                  <div>
                                    <div className="flex items-start justify-between gap-1.5 flex-wrap">
                                      <span className="text-[10px] sm:text-[11px] font-mono font-black px-2 py-0.5 rounded-lg bg-neutral-800 border border-white/15 text-neutral-200">
                                        #{prod.serial_number || prod.id}
                                      </span>
                                      {discount > 0 && (
                                        <span className="text-[10px] sm:text-[11px] font-black px-2 py-0.5 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 text-white border border-red-500 shadow-md shadow-red-600/30">
                                          {discount}% OFF
                                        </span>
                                      )}
                                    </div>

                                    <h4 className="font-extrabold text-white text-sm sm:text-base mt-2 line-clamp-2 group-hover:text-amber-300 transition-colors tracking-tight">{prod.productname}</h4>
                                    {tamilName && <p className="text-xs text-neutral-400 mt-0.5 font-medium line-clamp-1">{tamilName}</p>}
                                  </div>
                                </div>

                                <div className="pt-3 border-t border-white/10 space-y-2.5">
                                  <div className="flex items-baseline justify-between">
                                    <div>
                                      <span className="text-base sm:text-2xl font-black text-white group-hover:text-amber-400 transition-colors">
                                        ₹{netPrice.toFixed(2)}
                                      </span>
                                      {discount > 0 && (
                                        <span className="ml-1.5 text-xs text-neutral-500 line-through">
                                          ₹{price.toFixed(2)}
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-[10px] sm:text-xs text-neutral-400 uppercase font-bold tracking-wider">
                                      per {prod.per || "pkt"}
                                    </span>
                                  </div>

                                  {/* Full-width touch-friendly Stepper Control matching real card width */}
                                  <div className="w-full flex items-center justify-between p-1 rounded-2xl bg-black/90 border border-white/20 shadow-inner">
                                    <button
                                      onClick={() => updateQuantity(prod, -1)}
                                      disabled={qty === 0}
                                      className={`flex-1 h-8 sm:h-9 rounded-xl flex items-center justify-center font-black text-sm transition-all active:scale-95 ${qty > 0
                                          ? "bg-neutral-800 hover:bg-neutral-700 text-white border border-white/10 cursor-pointer"
                                          : "bg-neutral-900/60 text-neutral-600 cursor-not-allowed"
                                        }`}
                                    >
                                      <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="px-3 sm:px-4 text-center font-mono font-black text-sm sm:text-base text-white min-w-[36px]">
                                      {qty}
                                    </span>
                                    <button
                                      onClick={(e) => updateQuantity(prod, 1, e)}
                                      className="flex-1 h-8 sm:h-9 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-rose-600 hover:from-red-500 hover:to-rose-500 border border-red-500 text-white flex items-center justify-center font-black text-sm shadow-md shadow-red-600/30 active:scale-95 transition-all cursor-pointer"
                                    >
                                      <Plus className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </Card3D>
                          );
                        })}
                      </div>
                    ) : (
                      /* Table View */
                      <div className="bg-neutral-900/90 rounded-2xl border border-white/15 shadow-xl overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-neutral-800 text-red-400 font-bold uppercase border-b border-neutral-700">
                            <tr>
                              <th className="p-3 border-r border-neutral-700">Code</th>
                              <th className="p-3 border-r border-neutral-700">Product Name</th>
                              <th className="p-3 border-r border-neutral-700">MRP</th>
                              <th className="p-3 border-r border-neutral-700">Discount</th>
                              <th className="p-3 border-r border-neutral-700">Net Rate</th>
                              <th className="p-3 border-r border-neutral-700">Per</th>
                              <th className="p-3 text-center">Quantity</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-800">
                            {group.items.map((prod) => {
                              const uKey = getProductUniqueKey(prod);
                              const qty = cart[uKey] || 0;
                              const price = parseFloat(prod.price || 0);
                              const discount = parseFloat(prod.discount || 0);
                              const netPrice = discount > 0 ? Math.round(price * (1 - discount / 100)) : price;
                              const tamilName = translateProduct(prod.productname);

                              return (
                                <tr key={uKey} className="hover:bg-neutral-800/60">
                                  <td className="p-3 font-bold text-white border-r border-neutral-800">
                                    #{prod.serial_number || prod.id}
                                  </td>
                                  <td className="p-3 border-r border-neutral-800">
                                    <span className="font-bold text-white block">{prod.productname}</span>
                                    {tamilName && <span className="text-[11px] text-neutral-400 block">{tamilName}</span>}
                                  </td>
                                  <td className="p-3 text-neutral-500 line-through border-r border-neutral-800">
                                    ₹{price.toFixed(2)}
                                  </td>
                                  <td className="p-3 text-red-400 font-bold border-r border-neutral-800">
                                    {discount > 0 ? `${discount}%` : "-"}
                                  </td>
                                  <td className="p-3 font-black text-white border-r border-neutral-800">
                                    ₹{netPrice.toFixed(2)}
                                  </td>
                                  <td className="p-3 uppercase text-neutral-400 border-r border-neutral-800">
                                    {prod.per || "pkt"}
                                  </td>
                                  <td className="p-3 text-center">
                                    <div className="inline-flex items-center gap-1.5 p-1 rounded-lg bg-black border border-neutral-700">
                                      <button
                                        onClick={() => updateQuantity(prod, -1)}
                                        className="w-5 h-5 rounded bg-neutral-800 border border-neutral-700 text-white flex items-center justify-center font-bold text-xs hover:bg-neutral-700"
                                      >
                                        -
                                      </button>
                                      <span className="w-6 text-center font-black text-xs text-white">{qty}</span>
                                      <button
                                        onClick={(e) => updateQuantity(prod, 1, e)}
                                        className="w-5 h-5 rounded bg-red-600 border border-red-500 text-white flex items-center justify-center font-bold text-xs hover:bg-red-500 active:scale-95"
                                      >
                                        +
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>



          {/* Statutory Compliance Notice */}
          <section className="relative p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.5)] space-y-2 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-600 via-amber-400 to-rose-600" />
            <h3 className="text-red-400 font-black text-xs sm:text-sm flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-red-500 shrink-0" /> Supreme Court Compliance & Statutory Legal Notice
            </h3>
            <p className="text-[11px] sm:text-xs text-neutral-400 leading-relaxed">
              As per 2018 Supreme Court regulations, direct online e-commerce transactions of firecrackers are prohibited. Deepa Crackers operates in 100% legal compliance. Please add your desired items to the estimate list and submit your enquiry. Our team in Thiruthuraipoondi will contact you within 24 hours to confirm order booking and dispatch details.
            </p>
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

          {/* Floating Bottom Cart Summary Bar */}
          <AnimatePresence>
            {cartItems.length > 0 && (
              <motion.div
                data-tour="cart-summary"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-4 left-4 right-4 z-40 max-w-4xl mx-auto rounded-2xl p-4 bg-black/95 backdrop-blur-xl border border-red-600/50 shadow-[0_10px_35px_rgba(220,38,38,0.3)] flex items-center justify-between gap-4 text-white"
              >
                <div>
                  <p className="text-xs font-bold text-neutral-400">{cartItems.length} Selected</p>
                  <p className="text-xl md:text-2xl font-black text-red-500">
                    ₹{finalCheckoutTotal.toFixed(2)}
                  </p>
                </div>

                <button
                  data-tour="checkout-btn"
                  onClick={() => {
                    setShowCheckoutModal(true);
                    setCheckoutStep(0);
                  }}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white border border-red-500 font-black text-xs md:text-sm shadow-lg shadow-red-600/40 transition-all flex items-center gap-2"
                >
                  <span>Submit</span>
                  <ArrowRight className="h-4 w-4" />
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
                                      onClick={() => updateQuantity(item, 1)}
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

          {/* Success Modal */}
          <AnimatePresence>
            {bookingSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
              >
                <div className="p-8 rounded-3xl bg-neutral-900 border border-white/20 text-center max-w-md space-y-4 shadow-2xl text-white">
                  <CheckCircle className="h-14 w-14 text-red-500 mx-auto" />
                  <h2 className="text-2xl font-black text-white">Enquiry & Bill Generated!</h2>
                  <p className="text-neutral-300 text-xs leading-relaxed">
                    Thank you for inquiring with <strong className="text-red-500">Deepa Crackers, Thiruthuraipoondi</strong>. Your invoice PDF bill has been downloaded automatically. Our team will reach out to you shortly via phone or WhatsApp.
                  </p>
                  <button
                    onClick={() => setBookingSuccess(false)}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white border border-red-500 font-black text-xs shadow-lg shadow-red-600/30 hover:from-red-500 hover:to-red-600"
                  >
                    Close & Continue
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
                <p className="text-xs text-neutral-400">Main Store Outlet Center,</p>
                <p className="text-xs text-neutral-400">RS Road, THIRUTHURAIPOONDI, Tamil Nadu</p>
                <a href="tel:+918072897834" className="text-xs font-bold block mt-2 text-amber-400 hover:underline">+91 8072 897 834</a>
                <a href="https://www.instagram.com/deepa_crackers/" target="_blank" rel="noopener noreferrer" className="text-xs font-bold block mt-1 text-[#ff5277] hover:underline flex items-center gap-1">📸 @deepa_crackers</a>
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

      {/* Click Micro Popper Sparkles Overlay */}
      {popperSparks.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
          {popperSparks.map((spark) => (
            <div
              key={spark.id}
              className="absolute"
              style={{ left: spark.x, top: spark.y }}
            >
              {spark.particles.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1.4 }}
                  animate={{
                    x: p.dx,
                    y: p.dy,
                    opacity: 0,
                    scale: 0,
                  }}
                  transition={{ duration: 0.65, ease: "easeOut" }}
                  className="absolute rounded-full"
                  style={{
                    width: p.size,
                    height: p.size,
                    backgroundColor: p.color,
                    boxShadow: `0 0 10px ${p.color}, 0 0 4px #ffffff`,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}