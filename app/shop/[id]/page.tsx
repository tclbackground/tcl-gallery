"use client";

import { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiHeart,
  FiStar,
  FiMinus,
  FiPlus,
  FiShoppingCart,
  FiTruck,
  FiBox,
  FiMaximize2,
  FiEye,
  FiChevronDown,
  FiChevronUp,
  FiAward,
  FiShare2,
  FiHelpCircle,
  FiRefreshCw,
  FiSliders,
  FiFileText,
  FiInfo,
  FiCheckCircle,
  FiThumbsUp,
  FiArrowRight,
  FiShield,
} from "react-icons/fi";

// Mock Products Database
const productsDatabase = [
  {
    id: "elephant-procession",
    title: "Elephant Procession - Kalamkari Art - Indian Heritage Art",
    artist: "Traditional Kalamkari Master Artisan",
    subtitle: "Archival Pigment on Museum Grade Canvas via Giclee Printing",
    basePrice: 1999,
    originalPrice: 2199,
    stockCount: 20,
    mainImage: "/images/24.png",
    roomImage: "/images/23-R.png",
    description: "Elephant Procession - Kalamkari Art reflects the hand-painted beauty of Kalamkari art, offering timeless floral and folk elegance as part of your wall art decor.",
  },
];

const sizes = [
  { label: "15x10", popular: false, priceMultiplier: 1 },
  { label: "24x16", popular: false, priceMultiplier: 1.4 },
  { label: "36x24", popular: true, priceMultiplier: 1.8 },
  { label: "45x30", popular: true, priceMultiplier: 2.2 },
  { label: "54x36", popular: false, priceMultiplier: 2.8 },
  { label: "60x40", popular: false, priceMultiplier: 3.5 },
];

const framingOptions = [
  "Print Only",
  "Dark Brown Frame",
  "Light Brown Frame",
  "Black Frame",
  "Floating Frame",
  "Italian Wood - Natural",
  "Italian Wood - Dark",
  "Metal - Champagne Gold",
  "Metal - Earling Silver",
  "Mahogany Finish",
  "Dark Walnut Finish",
  "Metal - Carbon Black",
];

const accordionSections = [
  {
    id: "highlights",
    title: "Product Highlights",
    icon: FiFileText,
    content: "Handcrafted using 100% natural dyes on organic cotton canvas. Features high-definition Giclée printing with museum-grade archival pigments engineered for 100+ years of color stability.",
  },
  {
    id: "customisations",
    title: "Customisations",
    icon: FiSliders,
    content: "We offer custom dimensions, personalized matboard border widths, floating frame mounts, and specialized UV-blocking museum acrylic glazing.",
  },
  {
    id: "returns",
    title: "Exchange & Returns",
    icon: FiRefreshCw,
    content: "Hassle-free 7-day exchange and return policy for damaged or transit-impacted items. Free insured gallery pickup across India.",
  },
  {
    id: "faq",
    title: "Frequently Asked Questions",
    icon: FiHelpCircle,
    content: "Q: Does it come ready to hang?\nA: Yes, all framed options arrive pre-fitted with heavy-duty hanging wire and wall mounts.",
  },
  {
    id: "details",
    title: "Other Details",
    icon: FiInfo,
    content: "Includes a signed Certificate of Authenticity with a unique serial number registered under TCL Gallery Archives.",
  },
];

const reviewsData = [
  {
    id: "r1",
    author: "Ananya Sharma",
    rating: 5,
    date: "August 2, 2026",
    title: "Stunning Kalamkari detail and archival framing!",
    content: "The colors on the canvas are rich and vibrant. The teak wood framing is museum-grade as promised. It looks absolutely regal on our living room wall.",
    verified: true,
  },
  {
    id: "r2",
    author: "Rohan Mehta",
    rating: 5,
    date: "July 28, 2026",
    title: "Safe packaging & exceptional quality",
    content: "Arrived safely packed with transit corner protectors. The 3D room viewer on the site gave an accurate preview of how it would fit our wall space.",
    verified: true,
  },
  {
    id: "r3",
    author: "Priya Nair",
    rating: 4,
    date: "July 19, 2026",
    title: "Authentic heritage artwork",
    content: "Beautiful hand-painted Kalamkari motifs. Highly recommend opting for the Italian dark wood frame option.",
    verified: true,
  },
];

const relatedProducts = [
  {
    id: "rel-1",
    title: "Tree of Life - Kalamkari Fine Art",
    artist: "Master Kalamkari Artisan",
    price: 2299,
    originalPrice: 2699,
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop",
    category: "Heritage Art",
  },
  {
    id: "rel-2",
    title: "Royal Peacock Procession",
    artist: "TCL Curated Masters",
    price: 1899,
    originalPrice: 2199,
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop",
    category: "Fine Art Print",
  },
  {
    id: "rel-3",
    title: "Divine Radhakrishna Folk Canvas",
    artist: "Maison de Meraki Collective",
    price: 2599,
    originalPrice: 2999,
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop",
    category: "Canvas Art",
  },
];

export default function SingleProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const product =
    productsDatabase.find((p) => p.id === resolvedParams.id) || productsDatabase[0];

  // Configurator States
  const [selectedSize, setSelectedSize] = useState("15x10");
  const [selectedMedium, setSelectedMedium] = useState("Museum Grade Canvas");
  const [selectedFraming, setSelectedFraming] = useState("Print Only");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Accordion & Tab States
  const [openAccordion, setOpenAccordion] = useState<string | null>("highlights");
  const [activeTab, setActiveTab] = useState<"canvas" | "framing" | "giclee">("giclee");

  // 3D Room Viewer Modal State
  const [showSliderModal, setShowSliderModal] = useState(false);
  const [sliderPos, setSliderPos] = useState(50);

  // Price Calculation Logic
  const sizeObj = sizes.find((s) => s.label === selectedSize) || sizes[0];
  const frameSurcharge = selectedFraming === "Print Only" ? 0 : 800;
  const calculatedPrice = Math.round(
    (product.basePrice * sizeObj.priceMultiplier + frameSurcharge) * quantity
  );
  const calculatedOriginalPrice = Math.round(
    (product.originalPrice * sizeObj.priceMultiplier + frameSurcharge) * quantity
  );

  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#22211B] py-8 sm:py-12 font-sans selection:bg-[#7B8F50] selection:text-white">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* ================= SECTION 1: PRODUCT HEADER & CONFIGURATOR ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* LEFT COLUMN: MAIN IMAGE & 3D ROOM TRIGGER */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[#EAE3D2] bg-[#FAF8F5] group shadow-sm">
              <Image
                src={product.mainImage}
                alt={product.title}
                fill
                unoptimized
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority
              />

              <button
                onClick={() => setShowSliderModal(true)}
                className="absolute bottom-4 right-4 z-10 flex items-center gap-2 rounded-full bg-white/95 backdrop-blur-md px-4 py-2 text-xs font-bold text-[#22211B] shadow-md hover:bg-[#7B8F50] hover:text-white transition cursor-pointer"
              >
                <FiMaximize2 className="text-sm" /> 3D Room Viewer
              </button>
            </div>

            {/* THUMBNAILS */}
            <div className="grid grid-cols-3 gap-3">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden border-2 border-[#7B8F50] cursor-pointer">
                <Image src={product.mainImage} alt="Artwork" fill unoptimized className="object-cover" />
              </div>
              <div
                onClick={() => setShowSliderModal(true)}
                className="relative aspect-[4/3] rounded-xl overflow-hidden border border-[#EAE3D2] cursor-pointer group"
              >
                <Image src={product.roomImage} alt="Room View" fill unoptimized className="object-cover" />
                <div className="absolute inset-0 bg-[#22211B]/40 flex items-center justify-center text-white text-[10px] font-bold uppercase tracking-wider group-hover:bg-[#22211B]/60 transition">
                  <FiEye className="mr-1" /> View in Room
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: OPTIONS & PRICING */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* TITLE & WISHLIST */}
            <div className="space-y-2 border-b border-[#EAE3D2] pb-4">
              <div className="flex items-start justify-between gap-4">
                <h1 className="font-serif text-xs sm:text-2xl lg:text-3xl font-normal text-[#22211B] leading-snug">
                  {product.title}
                </h1>
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="p-1.5 text-[#88847C] hover:text-red-500 transition cursor-pointer shrink-0"
                >
                  <FiHeart className={`text-xl ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                </button>
              </div>

              <p className="text-xs text-[#7B8F50] font-semibold uppercase tracking-wider pt-1">
                {product.subtitle}
              </p>

              {/* RATING */}
              <div className="flex items-center gap-2 pt-1">
                <div className="flex text-[#7B8F50] text-xs">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className="fill-[#7B8F50] text-[#7B8F50]" />
                  ))}
                </div>
                <span className="text-xs text-[#66635B] font-medium">477 reviews</span>
              </div>
            </div>

            {/* QUANTITY */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#22211B] uppercase tracking-wider block">Quantity</label>
              <div className="inline-flex items-center border border-[#E0D8C8] rounded-full bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-[#55534E] hover:bg-[#FAF8F5] rounded-l-full transition cursor-pointer"
                >
                  <FiMinus className="text-xs" />
                </button>
                <span className="px-4 text-xs font-bold text-[#22211B]">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-[#55534E] hover:bg-[#FAF8F5] rounded-r-full transition cursor-pointer"
                >
                  <FiPlus className="text-xs" />
                </button>
              </div>
              <p className="text-xs text-[#7B8F50] font-medium flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#7B8F50] inline-block"></span>
                Only {product.stockCount} in stock
              </p>
            </div>

            {/* PRICING */}
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-3xl font-bold text-[#22211B]">
                Rs. {calculatedPrice.toLocaleString()}.00
              </span>
              <span className="text-sm text-[#88847C] line-through">
                Rs. {calculatedOriginalPrice.toLocaleString()}.00
              </span>
            </div>

            {/* SIZE (IN INCHES) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#22211B] uppercase tracking-wider block">
                Size (in inches)
              </label>
              <div className="flex flex-wrap gap-2">
                {sizes.map((sz) => (
                  <button
                    key={sz.label}
                    onClick={() => setSelectedSize(sz.label)}
                    className={`relative px-4 py-2 text-xs font-semibold rounded-full border transition cursor-pointer ${
                      selectedSize === sz.label
                        ? "bg-[#7B8F50] text-white border-[#7B8F50] shadow-sm"
                        : "bg-white text-[#22211B] border-[#E0D8C8] hover:border-[#7B8F50]"
                    }`}
                  >
                    {sz.label}
                    {sz.popular && (
                      <span className="absolute -top-1 -right-1 text-[8px] bg-[#4D3024] text-white rounded-full px-1 py-0.2">
                        ★
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* MEDIUM */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#22211B] uppercase tracking-wider block">Medium</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedMedium("Museum Grade Canvas")}
                  className="px-5 py-2 text-xs font-semibold bg-[#7B8F50] text-white border border-[#7B8F50] rounded-full shadow-sm"
                >
                  Museum Grade Canvas
                </button>
              </div>
            </div>

            {/* FRAMING */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#22211B] uppercase tracking-wider block">Framing</label>
              <div className="flex flex-wrap gap-2">
                {framingOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSelectedFraming(opt)}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-full border transition cursor-pointer ${
                      selectedFraming === opt
                        ? "bg-[#7B8F50] text-white border-[#7B8F50] shadow-sm"
                        : "bg-white text-[#55534E] border-[#E0D8C8] hover:border-[#7B8F50]"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* DISCOUNT BANNER */}
            <div className="p-3 bg-[#FAF8F5] border border-[#EAE3D2] rounded-xl text-[11px] font-bold text-[#4D3024] uppercase tracking-wider text-center">
              FLAT 10% OFF ON ORDERS ABOVE 10000 - USE CODE FLAT10
            </div>

            {/* ACTION BUTTONS */}
            <div className="space-y-2.5 pt-1">
              <button className="w-full py-4 px-6 border-2 border-[#7B8F50] text-[#7B8F50] text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#7B8F50] hover:text-white transition shadow-sm cursor-pointer">
                Add to cart
              </button>
              <button className="w-full py-4 px-6 bg-[#22211B] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#7B8F50] transition shadow-md cursor-pointer">
                Buy it now
              </button>
            </div>

            {/* DELIVERY TIMELINE TRACKER */}
            <div className="pt-6 border-t border-[#EAE3D2]">
              <div className="flex items-center justify-between max-w-md mx-auto text-center relative">
                <div className="absolute top-4 left-1/4 right-1/4 h-0.5 bg-[#E0D8C8] -z-0"></div>
                
                <div className="flex flex-col items-center gap-1 z-10 bg-[#FDFBF7] px-2">
                  <FiShoppingCart className="text-xl text-[#7B8F50]" />
                  <span className="text-xs font-bold text-[#22211B] mt-1">Aug 11th</span>
                  <span className="text-[10px] text-[#88847C]">Ordered</span>
                </div>

                <div className="flex flex-col items-center gap-1 z-10 bg-[#FDFBF7] px-2">
                  <FiTruck className="text-xl text-[#7B8F50]" />
                  <span className="text-xs font-bold text-[#22211B] mt-1">Aug 12th - Aug 14th</span>
                  <span className="text-[10px] text-[#88847C]">Shipped</span>
                </div>

                <div className="flex flex-col items-center gap-1 z-10 bg-[#FDFBF7] px-2">
                  <FiBox className="text-xl text-[#7B8F50]" />
                  <span className="text-xs font-bold text-[#22211B] mt-1">Aug 16th - Aug 22nd</span>
                  <span className="text-[10px] text-[#88847C]">Delivery*</span>
                </div>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="pt-4 text-xs text-[#55534E] leading-relaxed font-light">
              {product.description}
            </div>

          </div>

        </div>

        {/* ================= SECTION 2: ACCORDION & FEATURE SWITCHER ================= */}
        <div className="pt-8 border-t border-[#EAE3D2] space-y-16">
          
          {/* ACCORDION PANELS */}
          <div className="max-w-2xl mx-auto space-y-3">
            {accordionSections.map((sec) => {
              const isOpen = openAccordion === sec.id;
              const IconComp = sec.icon;

              return (
                <div key={sec.id} className="border-b border-[#EAE3D2] py-3">
                  <button
                    onClick={() => setOpenAccordion(isOpen ? null : sec.id)}
                    className="w-full flex items-center justify-between text-left text-sm font-semibold text-[#22211B] hover:text-[#7B8F50] transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <IconComp className="text-[#7B8F50] text-base" />
                      <span>{sec.title}</span>
                    </div>
                    {isOpen ? <FiChevronUp className="text-[#7B8F50] text-base" /> : <FiChevronDown className="text-[#88847C] text-base" />}
                  </button>

                  {isOpen && (
                    <div className="pt-3 pb-1 text-xs text-[#55534E] leading-relaxed font-light pl-7">
                      {sec.content}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="pt-2">
              <button className="flex items-center gap-2 text-xs font-bold text-[#7B8F50] hover:underline transition cursor-pointer">
                <FiShare2 className="text-sm" /> Share Piece
              </button>
            </div>
          </div>

          {/* TABBED FEATURE SWITCHER */}
          <div className="space-y-12">
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 bg-[#FAF8F5] p-1.5 rounded-full border border-[#EAE3D2]">
                <button
                  onClick={() => setActiveTab("canvas")}
                  className={`px-6 py-2.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                    activeTab === "canvas" ? "bg-[#7B8F50] text-white shadow-sm" : "text-[#55534E] hover:text-[#22211B]"
                  }`}
                >
                  Museum Grade Canvas
                </button>

                <button
                  onClick={() => setActiveTab("framing")}
                  className={`px-6 py-2.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                    activeTab === "framing" ? "bg-[#7B8F50] text-white shadow-sm" : "text-[#55534E] hover:text-[#22211B]"
                  }`}
                >
                  Framing
                </button>

                <button
                  onClick={() => setActiveTab("giclee")}
                  className={`px-6 py-2.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                    activeTab === "giclee" ? "bg-[#7B8F50] text-white shadow-sm" : "text-[#55534E] hover:text-[#22211B]"
                  }`}
                >
                  Giclee Printing
                </button>
              </div>
            </div>

            {/* FEATURE SPECIFICATION GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              <div className="lg:col-span-5 space-y-4">
                <div className="p-5 rounded-2xl border border-[#EAE3D2] bg-white shadow-xs space-y-1 hover:border-[#7B8F50] transition">
                  <div className="flex items-center gap-2 text-[#22211B] font-bold text-xs">
                    <FiAward className="text-sm text-[#7B8F50]" />
                    <span>Archival Pigments</span>
                  </div>
                  <p className="text-[11px] text-[#55534E] font-light pl-6">
                    Museum Archival Grade Pigment Colors
                  </p>
                </div>

                <div className="p-5 rounded-2xl border border-[#EAE3D2] bg-white shadow-xs space-y-1 hover:border-[#7B8F50] transition">
                  <div className="flex items-center gap-2 text-[#22211B] font-bold text-xs">
                    <FiAward className="text-sm text-[#7B8F50]" />
                    <span>Accurate Color Reproduction</span>
                  </div>
                  <p className="text-[11px] text-[#55534E] font-light pl-6">
                    99% Coverage of Pantone Plus Color Library
                  </p>
                </div>

                <div className="p-5 rounded-2xl border border-[#EAE3D2] bg-white shadow-xs space-y-1 hover:border-[#7B8F50] transition">
                  <div className="flex items-center gap-2 text-[#22211B] font-bold text-xs">
                    <FiAward className="text-sm text-[#7B8F50]" />
                    <span>12 Color Pigment Delivery</span>
                  </div>
                  <p className="text-[11px] text-[#55534E] font-light pl-6">
                    State of the art pigment delivery system designed by Seiko Japan
                  </p>
                </div>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-[#EAE3D2] bg-white shadow-xs">
                  <Image src={product.mainImage} alt="Texture Detail" fill unoptimized className="object-cover" />
                </div>

                <div className="space-y-4 flex flex-col justify-between">
                  <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-[#EAE3D2] bg-white shadow-xs">
                    <Image src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop" alt="Canvas Texture" fill unoptimized className="object-cover" />
                  </div>
                  <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-[#EAE3D2] bg-white shadow-xs">
                    <Image src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop" alt="Printer Setup" fill unoptimized className="object-cover" />
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* ================= SECTION 3: REVIEWS & RECOMMENDATIONS ================= */}
        <div className="pt-8 border-t border-[#EAE3D2] space-y-20">
          
          {/* CUSTOMER REVIEWS */}
          <div className="space-y-10">
            <div className="border-b border-[#EAE3D2] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#7B8F50]">
                  Verified Feedback
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#22211B] mt-1">
                  Customer Reviews
                </h2>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="font-serif text-3xl font-bold text-[#22211B]">4.9</div>
                  <p className="text-xs text-[#88847C]">Based on 477 reviews</p>
                </div>
                <div className="flex text-[#7B8F50] text-sm">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className="fill-[#7B8F50] text-[#7B8F50]" />
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-4 bg-[#FAF8F5] p-6 rounded-2xl border border-[#EAE3D2] space-y-3">
                <h3 className="font-serif text-base font-bold text-[#22211B] mb-4">Rating Breakdown</h3>
                {[
                  { stars: 5, pct: "92%", count: 438 },
                  { stars: 4, pct: "6%", count: 29 },
                  { stars: 3, pct: "1%", count: 6 },
                  { stars: 2, pct: "0%", count: 2 },
                  { stars: 1, pct: "0%", count: 2 },
                ].map((item) => (
                  <div key={item.stars} className="flex items-center gap-3 text-xs text-[#55534E]">
                    <span className="w-12 font-medium">{item.stars} Stars</span>
                    <div className="flex-1 h-2 bg-[#EAE3D2] rounded-full overflow-hidden">
                      <div className="h-full bg-[#7B8F50]" style={{ width: item.pct }} />
                    </div>
                    <span className="w-10 text-right font-medium">{item.count}</span>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-8 space-y-6">
                {reviewsData.map((rev) => (
                  <div key={rev.id} className="p-6 rounded-2xl border border-[#EAE3D2] bg-white space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex text-[#7B8F50] text-xs">
                          {[...Array(rev.rating)].map((_, i) => (
                            <FiStar key={i} className="fill-[#7B8F50] text-[#7B8F50]" />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-[#22211B]">{rev.author}</span>
                        {rev.verified && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#7B8F50] bg-[#7B8F50]/10 px-2.5 py-0.5 rounded-full">
                            <FiCheckCircle /> Verified Buyer
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-[#88847C]">{rev.date}</span>
                    </div>

                    <h4 className="font-serif text-base font-bold text-[#22211B]">{rev.title}</h4>
                    <p className="text-xs text-[#55534E] leading-relaxed font-light">{rev.content}</p>

                    <div className="pt-2 flex items-center gap-4 text-xs text-[#88847C]">
                      <button className="flex items-center gap-1.5 hover:text-[#7B8F50] transition cursor-pointer">
                        <FiThumbsUp /> Helpful
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* YOU MAY ALSO LIKE */}
          <div className="space-y-8 pt-8 border-t border-[#EAE3D2]">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#7B8F50]">
                  Curated Collections
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#22211B] mt-1">
                  You May Also Like
                </h2>
              </div>

              <Link href="/shop" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#7B8F50] hover:underline">
                View Full Gallery <FiArrowRight />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((item) => (
                <Link
                  key={item.id}
                  href={`/shop/${item.id}`}
                  className="group rounded-3xl border border-[#EAE3D2] bg-white overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    <div className="relative h-72 bg-[#FAF8F5] overflow-hidden">
                      <Image src={item.image} alt={item.title} fill unoptimized className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      <span className="absolute top-4 left-4 z-10 rounded-full bg-[#22211B]/80 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                        {item.category}
                      </span>
                    </div>

                    <div className="p-6 space-y-2">
                      <h3 className="font-serif text-xl font-bold text-[#22211B] group-hover:text-[#7B8F50] transition-colors leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-xs font-bold text-[#7B8F50] uppercase tracking-wider">
                        By {item.artist}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-gray-100 mt-4 flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif text-lg font-bold text-[#22211B]">
                        Rs. {item.price.toLocaleString()}
                      </span>
                      <span className="text-xs text-[#88847C] line-through">
                        Rs. {item.originalPrice.toLocaleString()}
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF8F5] px-4 py-2 text-xs font-semibold text-[#22211B] group-hover:bg-[#7B8F50] group-hover:text-white transition shadow-xs">
                      <FiShoppingCart /> View
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* 3D ROOM VIEWER MODAL */}
      {showSliderModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FDFBF7] rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-4 relative border border-[#EAE3D2]">
            <div className="flex justify-between items-center border-b border-[#EAE3D2] pb-3">
              <h3 className="font-serif text-xl font-bold text-[#22211B]">3D Room View Comparison</h3>
              <button
                onClick={() => setShowSliderModal(false)}
                className="text-xs font-bold text-[#88847C] hover:text-[#22211B] cursor-pointer"
              >
                Close ✕
              </button>
            </div>

            <p className="text-xs text-[#55534E]">
              Drag the slider to compare raw canvas vs. framed wall placement in a room.
            </p>

            <div className="relative h-[420px] w-full overflow-hidden rounded-2xl border border-[#EAE3D2] bg-[#FAF8F5] select-none">
              <Image src={product.roomImage} alt="Room View" fill unoptimized className="object-cover" />
              
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
              >
                <Image src={product.mainImage} alt="Print View" fill unoptimized className="object-cover" />
              </div>

              <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-xl cursor-ew-resize z-10"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-8 w-8 rounded-full bg-white text-[#22211B] shadow-md flex items-center justify-center text-xs font-bold border border-[#EAE3D2]">
                  ↔
                </div>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={(e) => setSliderPos(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}