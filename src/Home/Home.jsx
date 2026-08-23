import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Phone, Search, ArrowRight, ShieldCheck, FileText, LayoutGrid, List as ListIcon, X, Plus, Minus, ChevronLeft, ChevronRight, Bot, CheckCircle, MapPin, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Navbar from '../Component/Navbar';
import TamilAvatarExplainer from '../Component/TamilAvatarExplainer';
import { API_BASE_URL } from '../../Config';
import { translateProduct } from '../utils/tamilTranslation';

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
    if (!url) return resolve(null);
    const mediaList = parseMediaItems(url);
    const firstUrl = mediaList[0];
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
    img.onerror = () => resolve(null);
    img.src = firstUrl;
  });
};

// Unique Product Key Generator to prevent cross-category ID collisions
const getProductUniqueKey = (p) => {
  if (!p) return "";
  return p.serial_number || `${p.product_type || 'gen'}_${p.id}_${p.productname || ''}`;
};

// Small Thumbnail Renderer for Checkout Item Review
const renderProductThumbnail = (media) => {
  const items = parseMediaItems(media);
  if (items.length === 0) return <div className="w-12 h-12 rounded-xl bg-amber-100 border border-slate-900 flex items-center justify-center text-xs">🎆</div>;
  const first = items[0];
  const isVid = typeof first === 'string' && (first.includes('/video/') || first.endsWith('.mp4') || first.endsWith('.webm'));
  if (isVid) {
    return <video src={first} className="w-12 h-12 rounded-xl border border-slate-900 object-contain bg-white p-0.5 shrink-0" muted />;
  }
  return <img src={first} alt="" className="w-12 h-12 rounded-xl border border-slate-900 object-contain bg-white p-0.5 shrink-0" onError={(e) => { e.target.style.display = 'none'; }} />;
};

// Pencil Sketch Product Image Carousel Component
const ProductCarousel = ({ media, onImageClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const mediaItems = useMemo(() => parseMediaItems(media), [media]);

  if (mediaItems.length === 0) {
    return (
      <div className="w-full h-32 sm:h-44 rounded-xl border-2 border-slate-900 bg-amber-50/50 flex items-center justify-center text-slate-400 font-mono text-xs shadow-[2px_2px_0px_0px_#0f172a]">
        <span>🎆 Fireworks</span>
      </div>
    );
  }

  const currentItem = mediaItems[currentIndex];
  const isVideo = typeof currentItem === 'string' && (currentItem.includes('/video/') || currentItem.endsWith('.mp4') || currentItem.endsWith('.webm'));

  return (
    <div className="relative w-full h-32 sm:h-44 rounded-xl border-2 border-slate-900 overflow-hidden bg-white shadow-[2px_2px_0px_0px_#0f172a] group select-none flex items-center justify-center">
      {isVideo ? (
        <video
          src={currentItem}
          controls
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-contain p-1"
        />
      ) : (
        <img
          src={currentItem}
          alt="Product media"
          onClick={() => onImageClick && onImageClick(mediaItems)}
          className="w-full h-full object-contain p-1 cursor-pointer hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.style.display = 'none';
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

  // Tamil Avatar Explainer state — auto-opens once per session
  const [showAvatarExplainer, setShowAvatarExplainer] = useState(() => {
    return !sessionStorage.getItem("deepa_explainer_seen");
  });


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

      if (prodData && prodData.data) {
        setProducts(prodData.data);
      } else if (Array.isArray(prodData)) {
        setProducts(prodData);
      }

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
    const availableTypes = Array.from(new Set(products.map((p) => p.product_type))).filter(Boolean);
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

  // Cart operations using Unique Key
  const updateQuantity = (productOrKey, delta) => {
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
    let list = products.filter((p) => p.status === 'on' || p.status === undefined || p.status === null || p.status === 'off');

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

      // Pre-load base64 images for products with unique product key mapping
      const imagePromises = products.map(async (p) => {
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
        const typeItems = products.filter((p) => p.product_type === type);
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
      .filter((p) => p.status === 'on' || p.status === undefined || p.status === null)
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
    <div className="min-h-screen bg-[#FAF6EE] text-slate-900 flex flex-col font-mono selection:bg-amber-300">
      <Navbar />


      <main className="flex-grow pt-24 pb-20 px-3 md:px-8 max-w-7xl mx-auto w-full space-y-10">

        {/* Dynamic Interactive Banner Slider Section */}
        <section className="relative mt-15 w-full rounded-3xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(30,41,59,0.9)] overflow-hidden bg-white">
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
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-amber-300 border-2 border-slate-900 text-slate-900 flex items-center justify-center font-bold shadow-[2px_2px_0px_0px_#0f172a] hover:bg-amber-400"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setCurrentBannerIdx((prev) => (prev + 1) % banners.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-amber-300 border-2 border-slate-900 text-slate-900 flex items-center justify-center font-bold shadow-[2px_2px_0px_0px_#0f172a] hover:bg-amber-400"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>

                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {banners.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentBannerIdx(idx)}
                        className={`w-3 h-3 rounded-full border border-slate-900 transition-all ${idx === currentBannerIdx ? "bg-amber-400 scale-110" : "bg-white"
                          }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="p-8 md:p-12 text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 border-2 border-slate-900 text-slate-900 text-xs font-black uppercase shadow-[2px_2px_0px_0px_#0f172a]">
                <Sparkles className="h-4 w-4" /> ✏️ Deepa Crackers • THIRUTHURAIPOONDI
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900">
                Illuminating Celebrations with Supreme Quality Fireworks
              </h1>
              <p className="text-slate-700 text-xs md:text-sm font-serif max-w-2xl mx-auto">
                Discover supreme quality crackers, ground chakkars, sparklers, and multi-color sky shots. Directly dispatched to Thiruthuraipoondi & across Tamil Nadu with 100% legal compliance.
              </p>
            </div>
          )}
        </section>

        {/* Hero Action Bar */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => setShowAiModal(true)}
            className="px-6 py-3 rounded-xl bg-amber-300 hover:bg-amber-400 text-slate-900 border-2 border-slate-900 font-black text-xs md:text-sm shadow-[3px_3px_0px_0px_#0f172a] transition-all flex items-center gap-2"
          >
            <Bot className="h-4 w-4 text-slate-900" />
            <span>AI Smart Fireworks Assistant</span>
          </button>
          <button
            onClick={downloadPDFPricelist}
            disabled={downloadingPDF}
            className="px-6 py-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-slate-900 border-2 border-slate-900 font-black text-xs md:text-sm shadow-[3px_3px_0px_0px_#0f172a] transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <FileText className="h-4 w-4" />
            <span>{downloadingPDF ? "Generating PDF..." : "Download PDF Pricelist"}</span>
          </button>
          <button
            onClick={() => navigate("/status")}
            className="px-6 py-3 rounded-xl bg-white hover:bg-amber-50 text-slate-900 border-2 border-slate-900 font-black text-xs md:text-sm shadow-[3px_3px_0px_0px_#0f172a] transition-all"
          >
            Track Order Status
          </button>
        </div>

        {/* Product Catalog Showcase with Admin Dynamic Ordering */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(30,41,59,0.9)]">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900">Product Categories & Pricelist</h2>
              <p className="text-slate-600 text-xs mt-0.5 font-serif">⚡ Display sequence dynamically arranged by Admin Drag & Drop</p>
            </div>

            {/* View Mode Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1.5 rounded-xl border-2 border-slate-900 text-xs font-bold flex items-center gap-1.5 transition-all ${viewMode === "grid" ? "bg-amber-300 shadow-[2px_2px_0px_0px_#0f172a]" : "bg-white hover:bg-amber-50"
                  }`}
              >
                <LayoutGrid className="h-4 w-4" /> Grid
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-3 py-1.5 rounded-xl border-2 border-slate-900 text-xs font-bold flex items-center gap-1.5 transition-all ${viewMode === "table" ? "bg-amber-300 shadow-[2px_2px_0px_0px_#0f172a]" : "bg-white hover:bg-amber-50"
                  }`}
              >
                <ListIcon className="h-4 w-4" /> Table
              </button>
              <button
                onClick={downloadPDFPricelist}
                className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 border-2 border-slate-900 text-xs font-bold flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#0f172a]"
              >
                <FileText className="h-4 w-4" /> PDF
              </button>
            </div>
          </div>

          {/* Category Chips & Search Bar */}
          <div data-tour="category-filter" className="space-y-4 p-3 bg-amber-100/40 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a]">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border-2 border-slate-900 transition-all ${selectedCategory === cat
                    ? "bg-amber-300 text-slate-900 shadow-[2px_2px_0px_0px_#0f172a]"
                    : "bg-white text-slate-700 hover:bg-amber-100"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
              <input
                type="text"
                placeholder="Search product in English or Tamil..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border-2 border-slate-900 text-slate-900 placeholder-slate-500 text-xs font-mono focus:outline-none focus:bg-amber-50/40 shadow-[2px_2px_0px_0px_rgba(30,41,59,0.9)]"
              />
            </div>
          </div>

          {/* Products Rendered according to Admin Category Sequence */}
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto"></div>
              <p className="text-slate-600 text-xs mt-3">Loading product catalog...</p>
            </div>
          ) : groupedProducts.length === 0 ? (
            <div className="text-center py-12 rounded-2xl bg-white border-2 border-slate-900 p-6 shadow-[4px_4px_0px_0px_rgba(30,41,59,0.9)]">
              <p className="text-slate-700 text-xs font-serif">No products found matching your search criteria.</p>
            </div>
          ) : (
            <div data-tour="product-grid" className="space-y-8">
              {groupedProducts.map((group) => (
                <div key={group.category} className="space-y-4">
                  {/* Category Header */}
                  <div className="flex items-center gap-2 border-b-2 border-dashed border-slate-900 pb-2">
                    <span className="w-6 h-6 rounded-lg bg-amber-300 border border-slate-900 flex items-center justify-center text-xs font-bold">
                      ★
                    </span>
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">{group.category}</h3>
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
                          <div
                            key={uKey}
                            className="bg-white rounded-2xl p-3 md:p-5 border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(30,41,59,0.9)] flex flex-col justify-between space-y-2.5 md:space-y-4 hover:translate-y-[-2px] transition-transform"
                          >
                            <div className="space-y-2 md:space-y-3">
                              {/* Product Image Carousel */}
                              <ProductCarousel media={prod.image || prod.images} onImageClick={setPreviewMedia} />

                              <div>
                                <div className="flex items-start justify-between gap-1 flex-wrap">
                                  <span className="text-[9px] sm:text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-100 border border-slate-900 text-slate-900">
                                    #{prod.serial_number || prod.id}
                                  </span>
                                  {discount > 0 && (
                                    <span className="text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-slate-900">
                                      {discount}% OFF
                                    </span>
                                  )}
                                </div>

                                <h4 className="font-black text-slate-900 text-xs sm:text-base mt-1 line-clamp-2">{prod.productname}</h4>
                                {tamilName && <p className="text-[10px] sm:text-xs text-slate-600 font-serif mt-0.5 line-clamp-1">{tamilName}</p>}
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-200">
                              <div>
                                <span className="text-sm sm:text-lg font-black text-slate-900">₹{netPrice.toFixed(2)}</span>
                                {discount > 0 && <span className="ml-1 text-[10px] sm:text-xs text-slate-400 line-through">₹{price.toFixed(2)}</span>}
                                <span className="block text-[9px] sm:text-[10px] text-slate-500 uppercase">per {prod.per || "pkt"}</span>
                              </div>

                              <div className="inline-flex items-center gap-1 p-0.5 sm:p-1 rounded-xl bg-amber-50 border-2 border-slate-900 shadow-[1px_1px_0px_0px_#0f172a] self-start sm:self-auto">
                                <button
                                  onClick={() => updateQuantity(prod, -1)}
                                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-white border border-slate-900 text-slate-900 flex items-center justify-center font-black text-xs hover:bg-amber-200"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="w-5 sm:w-7 text-center font-black text-xs text-slate-900">{qty}</span>
                                <button
                                  onClick={() => updateQuantity(prod, 1)}
                                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-amber-300 border border-slate-900 text-slate-900 flex items-center justify-center font-black text-xs hover:bg-amber-400"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* Table View */
                    <div className="bg-white rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(30,41,59,0.9)] overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-amber-100 border-b-2 border-slate-900 text-slate-900 font-bold uppercase">
                          <tr>
                            <th className="p-3 border-r border-slate-300">Code</th>
                            <th className="p-3 border-r border-slate-300">Product Name</th>
                            <th className="p-3 border-r border-slate-300">MRP</th>
                            <th className="p-3 border-r border-slate-300">Discount</th>
                            <th className="p-3 border-r border-slate-300">Net Rate</th>
                            <th className="p-3 border-r border-slate-300">Per</th>
                            <th className="p-3 text-center">Quantity</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {group.items.map((prod) => {
                            const uKey = getProductUniqueKey(prod);
                            const qty = cart[uKey] || 0;
                            const price = parseFloat(prod.price || 0);
                            const discount = parseFloat(prod.discount || 0);
                            const netPrice = discount > 0 ? Math.round(price * (1 - discount / 100)) : price;
                            const tamilName = translateProduct(prod.productname);

                            return (
                              <tr key={uKey} className="hover:bg-amber-50/50">
                                <td className="p-3 font-mono font-bold text-slate-900 border-r border-slate-200">
                                  #{prod.serial_number || prod.id}
                                </td>
                                <td className="p-3 border-r border-slate-200">
                                  <span className="font-bold text-slate-900 block">{prod.productname}</span>
                                  {tamilName && <span className="text-[11px] text-slate-500 font-serif block">{tamilName}</span>}
                                </td>
                                <td className="p-3 text-slate-500 line-through border-r border-slate-200">
                                  ₹{price.toFixed(2)}
                                </td>
                                <td className="p-3 text-emerald-800 font-bold border-r border-slate-200">
                                  {discount > 0 ? `${discount}%` : "-"}
                                </td>
                                <td className="p-3 font-black text-slate-900 border-r border-slate-200">
                                  ₹{netPrice.toFixed(2)}
                                </td>
                                <td className="p-3 uppercase text-slate-600 border-r border-slate-200">
                                  {prod.per || "pkt"}
                                </td>
                                <td className="p-3 text-center">
                                  <div className="inline-flex items-center gap-1.5 p-1 rounded-lg bg-amber-50 border border-slate-900">
                                    <button
                                      onClick={() => updateQuantity(prod, -1)}
                                      className="w-5 h-5 rounded bg-white border border-slate-900 text-slate-900 flex items-center justify-center font-bold text-xs hover:bg-amber-200"
                                    >
                                      -
                                    </button>
                                    <span className="w-6 text-center font-black text-xs">{qty}</span>
                                    <button
                                      onClick={() => updateQuantity(prod, 1)}
                                      className="w-5 h-5 rounded bg-amber-300 border border-slate-900 text-slate-900 flex items-center justify-center font-bold text-xs hover:bg-amber-400"
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
        <section className="p-6 rounded-2xl bg-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(30,41,59,0.9)] space-y-2">
          <h3 className="text-slate-900 font-black text-sm flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-amber-600" /> Supreme Court Compliance & Legal Notice
          </h3>
          <p className="text-xs text-slate-700 font-serif leading-relaxed">
            As per 2018 Supreme Court regulations, direct online e-commerce transactions of firecrackers are prohibited. Deepa Crackers operates in 100% legal compliance. Please add your desired items to the estimate list and submit your enquiry. Our team in Thiruthuraipoondi will contact you within 24 hours to confirm order booking and dispatch details.
          </p>
        </section>
      </main>

      {/* AI Assistant Modal */}
      <AnimatePresence>
        {showAiModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg rounded-3xl bg-[#FAF6EE] border-2 border-slate-900 p-6 space-y-6 shadow-[8px_8px_0px_0px_rgba(30,41,59,0.9)] relative"
            >
              <button
                onClick={() => {
                  setShowAiModal(false);
                  setAiStep(0);
                  setAiBudget("");
                  setAiPreferences({ kids: false, sound: false, night: false, kidsnight: false });
                  setSuggestedCart({});
                }}
                className="absolute top-4 right-4 text-slate-700 hover:text-slate-900 p-1"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="flex items-center gap-2 border-b-2 border-slate-900 pb-3">
                <Bot className="h-6 w-6 text-amber-600" />
                <h2 className="text-xl font-black text-slate-900">Smart AI Fireworks Assistant</h2>
              </div>

              {aiStep === 0 && (
                <div className="space-y-4">
                  <p className="text-xs font-bold text-slate-800 uppercase">Step 1: What is your approximate festival budget? (₹)</p>
                  <input
                    type="number"
                    value={aiBudget}
                    onChange={(e) => setAiBudget(e.target.value)}
                    placeholder="e.g. 3000"
                    className="w-full px-4 py-3 rounded-xl bg-white border-2 border-slate-900 text-slate-900 text-sm font-mono focus:outline-none focus:bg-amber-50 shadow-[2px_2px_0px_0px_#0f172a]"
                  />
                  <button
                    onClick={() => {
                      if (!aiBudget || Number(aiBudget) <= 0) {
                        alert("Please enter a valid budget amount in ₹");
                        return;
                      }
                      setAiStep(1);
                    }}
                    className="w-full py-3 rounded-xl bg-amber-300 hover:bg-amber-400 text-slate-900 border-2 border-slate-900 font-black text-xs shadow-[3px_3px_0px_0px_#0f172a] transition-all"
                  >
                    Next: Select Preferences →
                  </button>
                </div>
              )}

              {aiStep === 1 && (
                <div className="space-y-4">
                  <p className="text-xs font-bold text-slate-800 uppercase">Step 2: Select Firework Preferences</p>
                  <div className="space-y-2.5">
                    {[
                      { key: "kids", label: "🎠 Kids Varieties (Twinkling Star, Pencils, Novelties)" },
                      { key: "sound", label: "💥 Loud Sound Crackers (Bombs, Sound Crackers)" },
                      { key: "night", label: "🚀 Night Sky (Rockets, Repeating Shots, Sky Shots)" },
                      { key: "kidsnight", label: "✨ Kids Night (Sparklers, Flower Pots, Chakkars)" },
                    ].map(({ key, label }) => (
                      <label key={key} className="flex items-center gap-3 p-2.5 rounded-xl bg-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] cursor-pointer hover:bg-amber-50">
                        <input
                          type="checkbox"
                          checked={aiPreferences[key]}
                          onChange={(e) => setAiPreferences((prev) => ({ ...prev, [key]: e.target.checked }))}
                          className="w-4 h-4 accent-amber-500 rounded border-slate-900"
                        />
                        <span className="text-xs font-bold text-slate-900">{label}</span>
                      </label>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setAiStep(0)}
                      className="w-1/3 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 border-2 border-slate-900 font-bold text-xs shadow-[2px_2px_0px_0px_#0f172a]"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={generateSuggestions}
                      className="w-2/3 py-2.5 rounded-xl bg-amber-300 hover:bg-amber-400 text-slate-900 border-2 border-slate-900 font-black text-xs shadow-[2px_2px_0px_0px_#0f172a]"
                    >
                      Generate AI Combination ✨
                    </button>
                  </div>
                </div>
              )}

              {aiStep === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-300 pb-2">
                    <div>
                      <p className="text-xs font-black text-slate-900 uppercase">Suggested Combination</p>
                      <p className="text-[11px] text-slate-600">
                        {Object.keys(suggestedCart).length} product variety(s) • Total: <strong className="text-slate-900">₹{suggestedTotalAmount.toFixed(2)}</strong> (Max Budget: ₹{Number(aiBudget).toFixed(2)})
                      </p>
                    </div>
                    <button
                      onClick={() => setAiStep(1)}
                      className="px-2.5 py-1 rounded-lg bg-amber-100 border border-slate-900 text-[11px] font-bold text-slate-900"
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
                        <div key={key} className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] text-xs">
                          <div className="flex items-center gap-2 flex-1 min-w-0 pr-2">
                            {renderProductThumbnail(p.image || p.images)}
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-slate-900 truncate">{p.productname}</p>
                              <p className="text-[10px] text-slate-600">₹{finalPrice.toFixed(2)} × {qty}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="inline-flex items-center gap-1 p-0.5 rounded-lg bg-amber-50 border border-slate-900">
                              <button
                                onClick={() => updateSuggestedQty(key, -1)}
                                className="w-4 h-4 rounded bg-white border border-slate-900 text-slate-900 flex items-center justify-center font-bold text-[10px]"
                              >
                                -
                              </button>
                              <span className="w-4 text-center font-black text-[10px]">{qty}</span>
                              <button
                                onClick={() => updateSuggestedQty(key, 1)}
                                className="w-4 h-4 rounded bg-amber-300 border border-slate-900 text-slate-900 flex items-center justify-center font-bold text-[10px]"
                              >
                                +
                              </button>
                            </div>
                            <span className="font-black text-slate-900 w-14 text-right">₹{(finalPrice * qty).toFixed(2)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={addSuggestedToCart}
                    className="w-full py-3.5 rounded-xl bg-emerald-300 hover:bg-emerald-400 text-slate-900 border-2 border-slate-900 font-black text-xs shadow-[3px_3px_0px_0px_#0f172a] transition-all"
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
            className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setPreviewMedia(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-4 border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(30,41,59,0.9)] max-w-2xl w-full max-h-[85vh] overflow-hidden relative flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setPreviewMedia(null)}
                className="absolute top-3 right-3 text-slate-900 bg-amber-300 hover:bg-amber-400 border-2 border-slate-900 rounded-xl p-1 shadow-[2px_2px_0px_0px_#0f172a] z-10"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="w-full h-full flex items-center justify-center p-2">
                <img
                  src={Array.isArray(previewMedia) ? previewMedia[0] : previewMedia}
                  alt="Product Enlarged"
                  className="max-h-[75vh] w-auto object-contain rounded-2xl border-2 border-slate-900"
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
            className="fixed bottom-4 left-4 right-4 z-40 max-w-4xl mx-auto rounded-2xl p-4 bg-amber-100 border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(30,41,59,0.9)] flex items-center justify-between gap-4"
          >
            <div>
              <p className="text-xs font-bold text-slate-700">{cartItems.length} Products Selected</p>
              <p className="text-xl md:text-2xl font-black text-slate-900">
                Estimate Total: ₹{finalCheckoutTotal.toFixed(2)}
              </p>
            </div>

            <button
              data-tour="checkout-btn"
              onClick={() => {
                setShowCheckoutModal(true);
                setCheckoutStep(0);
              }}
              className="px-6 py-3 rounded-xl bg-amber-300 hover:bg-amber-400 text-slate-900 border-2 border-slate-900 font-black text-xs md:text-sm shadow-[3px_3px_0px_0px_#0f172a] transition-all flex items-center gap-2"
            >
              <span>Submit Order Enquiry</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Multi-Step Pencil Sketch Product Purchase Checkout Modal */}
      <AnimatePresence>
        {showCheckoutModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg rounded-3xl bg-[#FAF6EE] border-2 border-slate-900 p-5 md:p-8 space-y-6 shadow-[8px_8px_0px_0px_rgba(30,41,59,0.9)] relative max-h-[90vh] overflow-y-auto scrollbar-thin"
            >
              <button
                onClick={() => {
                  setShowCheckoutModal(false);
                  setCheckoutStep(0);
                }}
                className="absolute top-4 right-4 text-slate-700 hover:text-slate-900 p-1 z-10"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Header Step Progress */}
              <div className="space-y-2">
                <h2 className="text-xl md:text-2xl font-black text-slate-900">Checkout & Order Enquiry</h2>
                <div className="flex items-center gap-1.5 text-[11px] md:text-xs font-bold overflow-x-auto pb-1">
                  <span className={`px-2 py-0.5 rounded-lg border border-slate-900 whitespace-nowrap ${checkoutStep === 0 ? 'bg-amber-300' : 'bg-white'}`}>1. Customer Details</span>
                  <span>→</span>
                  <span className={`px-2 py-0.5 rounded-lg border border-slate-900 whitespace-nowrap ${checkoutStep === 1 ? 'bg-amber-300' : 'bg-white'}`}>2. Location & Offer</span>
                  <span>→</span>
                  <span className={`px-2 py-0.5 rounded-lg border border-slate-900 whitespace-nowrap ${checkoutStep === 2 ? 'bg-amber-300' : 'bg-white'}`}>3. Review Products</span>
                </div>
              </div>

              <form onSubmit={handleCheckoutSubmit} className="space-y-4">

                {/* Step 0: Customer Personal Details */}
                {checkoutStep === 0 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-900 uppercase mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter customer full name"
                        value={customer.name}
                        onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-slate-900 text-slate-900 text-xs font-mono focus:outline-none focus:bg-amber-50 shadow-[2px_2px_0px_0px_#0f172a]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-900 uppercase mb-1">Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="10-digit mobile number"
                        value={customer.mobile}
                        onChange={(e) => setCustomer({ ...customer, mobile: e.target.value.replace(/\D/g, "") })}
                        className="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-slate-900 text-slate-900 text-xs font-mono focus:outline-none focus:bg-amber-50 shadow-[2px_2px_0px_0px_#0f172a]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-900 uppercase mb-1">Email Address (Optional)</label>
                      <input
                        type="email"
                        placeholder="email@example.com"
                        value={customer.email || ""}
                        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-slate-900 text-slate-900 text-xs font-mono focus:outline-none focus:bg-amber-50 shadow-[2px_2px_0px_0px_#0f172a]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-900 uppercase mb-1">Delivery Address *</label>
                      <textarea
                        rows={2}
                        required
                        placeholder="Full delivery street address..."
                        value={customer.address}
                        onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl bg-white border-2 border-slate-900 text-slate-900 text-xs font-mono focus:outline-none focus:bg-amber-50 resize-none shadow-[2px_2px_0px_0px_#0f172a]"
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
                      className="w-full py-3 rounded-xl bg-amber-300 hover:bg-amber-400 text-slate-900 border-2 border-slate-900 font-black text-xs shadow-[3px_3px_0px_0px_#0f172a] transition-all"
                    >
                      Next: Location, Address & Offers →
                    </button>
                  </div>
                )}

                {/* Step 1: Location, Address & Offer Summary */}
                {checkoutStep === 1 && (
                  <div className="space-y-4">
                    {/* Address Review Box */}
                    <div className="p-3.5 rounded-xl bg-amber-50 border-2 border-slate-900 text-xs space-y-1 shadow-[2px_2px_0px_0px_#0f172a]">
                      <p className="font-bold text-slate-900 flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-amber-600" /> Delivery Target Address:
                      </p>
                      <p className="font-bold text-slate-900">{customer.name} ({customer.mobile})</p>
                      <p className="text-slate-700 font-serif leading-tight">{customer.address}</p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-900 uppercase mb-1">State *</label>
                      <select
                        value={customer.state}
                        onChange={(e) => setCustomer({ ...customer, state: e.target.value, district: "" })}
                        className="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-slate-900 text-slate-900 text-xs font-mono focus:outline-none focus:bg-amber-50 shadow-[2px_2px_0px_0px_#0f172a]"
                      >
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        {states.map((s) => (
                          <option key={s.id || s.name} value={s.name}>{s.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-900 uppercase mb-1">District *</label>
                      <select
                        value={customer.district}
                        onChange={(e) => setCustomer({ ...customer, district: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-slate-900 text-slate-900 text-xs font-mono focus:outline-none focus:bg-amber-50 shadow-[2px_2px_0px_0px_#0f172a]"
                      >
                        <option value="Thiruthuraipoondi">Thiruthuraipoondi</option>
                        {districts.map((d) => (
                          <option key={d.id || d.name} value={d.name}>{d.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-900 uppercase mb-1">Apply Promocode / Coupon</label>
                      <select
                        value={selectedPromoCode}
                        onChange={(e) => handleApplyPromoCode(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-slate-900 text-slate-900 text-xs font-mono focus:outline-none focus:bg-amber-50 shadow-[2px_2px_0px_0px_#0f172a]"
                      >
                        <option value="">No Promocode Selected</option>
                        {promoCodes.map((promo) => (
                          <option key={promo.id || promo.code} value={promo.code}>
                            {promo.code} ({promo.discount}% OFF)
                          </option>
                        ))}
                      </select>

                      {appliedPromo && (
                        <p className="text-[11px] font-bold text-emerald-800 mt-1.5 flex items-center gap-1">
                          <Tag className="h-3.5 w-3.5" /> Promocode {appliedPromo.code} applied! ({appliedPromo.discount}% OFF)
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setCheckoutStep(0)}
                        className="w-1/3 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 border-2 border-slate-900 font-bold text-xs shadow-[2px_2px_0px_0px_#0f172a]"
                      >
                        ← Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setCheckoutStep(2)}
                        className="w-2/3 py-2.5 rounded-xl bg-amber-300 hover:bg-amber-400 text-slate-900 border-2 border-slate-900 font-black text-xs shadow-[2px_2px_0px_0px_#0f172a]"
                      >
                        Review Products & Images →
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Product Review with Images & Mobile Optimised View */}
                {checkoutStep === 2 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-300 pb-2">
                      <p className="text-xs font-black text-slate-900 uppercase">Review Order Items ({cartItems.length})</p>
                      <p className="text-[11px] font-bold text-slate-700">📍 {customer.district}, {customer.state}</p>
                    </div>

                    {/* Product List with Image Thumbnails */}
                    <div className="max-h-64 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                      {cartItems.map((item) => {
                        const tamilName = translateProduct(item.productname);
                        return (
                          <div key={item.uniqueKey} className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] gap-2">
                            <div className="flex items-center gap-2.5 flex-1 min-w-0">
                              {renderProductThumbnail(item.image || item.images)}
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1">
                                  <span className="text-[9px] font-mono px-1 rounded bg-amber-100 border border-slate-900 text-slate-900">#{item.serial_number || item.id}</span>
                                  <span className="text-xs font-bold text-slate-900 truncate">{item.productname}</span>
                                </div>
                                {tamilName && <p className="text-[10px] text-slate-500 font-serif truncate">{tamilName}</p>}
                                <p className="text-[10px] text-slate-600">₹{item.netPrice.toFixed(2)} per {item.per || 'pkt'}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="inline-flex items-center gap-1 p-0.5 rounded-lg bg-amber-50 border border-slate-900">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item, -1)}
                                  className="w-5 h-5 rounded bg-white border border-slate-900 text-slate-900 flex items-center justify-center font-bold text-xs hover:bg-amber-200"
                                >
                                  -
                                </button>
                                <span className="w-5 text-center font-black text-xs text-slate-900">{item.qty}</span>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item, 1)}
                                  className="w-5 h-5 rounded bg-amber-300 border border-slate-900 text-slate-900 flex items-center justify-center font-bold text-xs hover:bg-amber-400"
                                >
                                  +
                                </button>
                              </div>
                              <span className="font-black text-xs text-slate-900 w-16 text-right">₹{item.subtotal.toFixed(2)}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Cost Breakdown */}
                    <div className="p-3.5 rounded-xl bg-amber-100 border-2 border-slate-900 space-y-1 text-xs shadow-[2px_2px_0px_0px_#0f172a]">
                      <div className="flex justify-between text-slate-700">
                        <span>Cart Estimate Subtotal:</span>
                        <span>₹{totalAmount.toFixed(2)}</span>
                      </div>
                      {appliedPromo && (
                        <div className="flex justify-between text-emerald-800 font-bold">
                          <span>Promocode Discount ({appliedPromo.discount}%):</span>
                          <span>-₹{promoDiscountAmount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-slate-900 font-black text-sm pt-1 border-t border-slate-900">
                        <span>Total Amount Payable:</span>
                        <span>₹{finalCheckoutTotal.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setCheckoutStep(1)}
                        className="w-1/3 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 border-2 border-slate-900 font-bold text-xs shadow-[2px_2px_0px_0px_#0f172a]"
                      >
                        ← Back
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-2/3 py-3.5 rounded-xl bg-emerald-300 hover:bg-emerald-400 text-slate-900 border-2 border-slate-900 font-black text-xs shadow-[3px_3px_0px_0px_#0f172a] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div className="p-8 rounded-3xl bg-[#FAF6EE] border-2 border-slate-900 text-center max-w-md space-y-4 shadow-[8px_8px_0px_0px_rgba(30,41,59,0.9)]">
              <CheckCircle className="h-14 w-14 text-emerald-600 mx-auto" />
              <h2 className="text-2xl font-black text-slate-900">Enquiry & Bill Generated!</h2>
              <p className="text-slate-700 text-xs font-serif leading-relaxed">
                Thank you for inquiring with <strong className="text-slate-900">Deepa Crackers, Thiruthuraipoondi</strong>. Your invoice PDF bill has been downloaded automatically. Our team will reach out to you shortly via phone or WhatsApp.
              </p>
              <button
                onClick={() => setBookingSuccess(false)}
                className="px-6 py-2.5 rounded-xl bg-amber-300 text-slate-900 border-2 border-slate-900 font-black text-xs shadow-[2px_2px_0px_0px_#0f172a] hover:bg-amber-400"
              >
                Close & Continue
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* Floating Tamil Avatar Explainer Trigger Button */}
      <motion.button
        onClick={() => {
          setShowAvatarExplainer(true);
          sessionStorage.removeItem("deepa_explainer_seen");
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-5 left-5 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-amber-400 border-3 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] font-black text-slate-900 text-xs hover:bg-amber-300 transition-colors"
        style={{ zIndex: 50 }}
      >
        <motion.span
          animate={{ rotate: [0, 10, -10, 10, 0] }}
          transition={{ repeat: Infinity, duration: 3, repeatDelay: 2 }}
          className="text-xl"
        >
          👩🏽
        </motion.span>
        <div className="text-left">
          <div className="font-black text-[11px]">தீபா விளக்கம்</div>
          <div className="text-[10px] font-bold text-slate-700">Why Deepa Crackers?</div>
        </div>
      </motion.button>

      {/* Tamil Avatar Explainer Modal */}
      <AnimatePresence>
        {showAvatarExplainer && (
          <TamilAvatarExplainer
            onClose={() => {
              setShowAvatarExplainer(false);
              sessionStorage.setItem("deepa_explainer_seen", "1");
            }}
          />
        )}
      </AnimatePresence>

    </div>
  );
}