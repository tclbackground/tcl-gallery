"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiHeart,
  FiShare2,
  FiMinus,
  FiPlus,
  FiChevronDown,
  FiChevronUp,
  FiCheck,
  FiTruck,
  FiPackage,
  FiClock,
  FiFileText,
  FiSliders,
} from "react-icons/fi";
import { AiFillStar } from "react-icons/ai";

interface ProductDetailsClientProps {
  product: any;
}

const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%23C4A892' stroke-width='1.5'><rect x='3' y='3' width='18' height='18' rx='2'/><circle cx='8.5' cy='8.5' r='1.5'/><polyline points='21 15 16 10 5 21'/></svg>";

const SIZES = [
  { label: "12x16", multiplier: 1.0 },
  { label: "18x24", multiplier: 1.4 },
  { label: "24x32", multiplier: 1.8 },
  { label: "30x40", multiplier: 2.3 },
  { label: "36x48", multiplier: 2.9 },
  { label: "42x56", multiplier: 3.5 },
];

const FRAMES = [
  "Print Only",
  "Stretched Canvas",
  "Dark Brown Frame",
  "Light Brown Frame",
  "Black Frame",
  "Floating Frame",
  "Italian Wood - Natural",
  "Italian Wood - Dark",
  "Metal - Champagne Gold",
  "Metal - Sterling Silver",
  "Mahogany Finish",
  "Dark Walnut Finish",
  "Metal - Carbon Black",
];

export default function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  // Collect images array (up to 5+ images)
  const images: string[] =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : product.imageUrl
      ? [product.imageUrl]
      : [FALLBACK_IMAGE];

  const [activeImage, setActiveImage] = useState<string>(images[0] || FALLBACK_IMAGE);
  const [selectedSize, setSelectedSize] = useState<string>("12x16");
  const [selectedMedium, setSelectedMedium] = useState<string>("Museum Grade Canvas");
  const [selectedFrame, setSelectedFrame] = useState<string>("Print Only");
  const [quantity, setQuantity] = useState<number>(1);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);

  // Accordion open/close states
  const [highlightsOpen, setHighlightsOpen] = useState<boolean>(false);
  const [customisationOpen, setCustomisationOpen] = useState<boolean>(false);

  // Base and Computed Pricing
  const basePrice = Number(product.price) || 2399;
  const sizeMultiplier = SIZES.find((s) => s.label === selectedSize)?.multiplier || 1;
  const currentPrice = Math.round(basePrice * sizeMultiplier);
  const originalPrice = Math.round(currentPrice * 1.2);

  const title = product.title || "Royal Peacocks - Limited Edition";
  const mediumDescription =
    product.medium || "Archival Pigment on Museum Grade Canvas via Giclee Printing";

  return (
    <div className="min-h-screen bg-[#FBF9F0] text-[#22211B] py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase mb-8 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-[#4D3024] transition">HOME</Link>
          <span>›</span>
          <Link href="/shop" className="hover:text-[#4D3024] transition">ART COLLECTIONS</Link>
          <span>›</span>
          <Link href={`/shop/${product.category || "fine-art"}`} className="hover:text-[#4D3024] transition">
            {product.category || "LIMITED EDITION"}
          </Link>
          <span>›</span>
          <span className="text-[#22211B] font-bold">{title}</span>
        </nav>

        {/* 2-Column Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* ================= LEFT: GALLERY ================= */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Stage Image */}
            <div className="relative aspect-4/5 w-full rounded-2xl overflow-hidden bg-[#EAE6DF] border border-[#E0D8C8] shadow-sm flex items-center justify-center">
              <Image
                src={activeImage}
                alt={title}
                fill
                priority
                unoptimized
                className="object-contain p-4 transition-all duration-300"
              />

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md shadow-md transition cursor-pointer ${
                  isWishlisted
                    ? "bg-red-500 text-white"
                    : "bg-white/80 text-[#22211B] hover:bg-white"
                }`}
                aria-label="Wishlist"
              >
                <FiHeart size={18} fill={isWishlisted ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Thumbnail Carousel Row */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              {images.map((imgSrc, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveImage(imgSrc)}
                  className={`relative h-20 w-20 rounded-xl overflow-hidden shrink-0 border-2 transition cursor-pointer bg-white ${
                    activeImage === imgSrc
                      ? "border-[#22211B] scale-95 shadow"
                      : "border-[#E0D8C8] opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={imgSrc}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* ================= RIGHT: BUY BOX & CONFIGURATOR ================= */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Title & Reviews */}
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#22211B] leading-tight">
                {title}
              </h1>
              <p className="text-xs text-gray-600 mt-1 font-medium">
                {mediumDescription}
              </p>

              {/* Star Rating */}
              <div className="flex items-center gap-1.5 mt-2.5 text-xs">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <AiFillStar key={i} size={15} />
                  ))}
                </div>
                <span className="font-bold text-[#22211B]">5.0</span>
                <span className="text-gray-500 underline cursor-pointer">503 reviews</span>
              </div>
            </div>

            {/* Quantity & Stock Level */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-[#C4A892]/40 rounded-lg bg-white overflow-hidden shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition"
                  >
                    <FiMinus size={14} />
                  </button>
                  <span className="px-4 font-semibold text-sm">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition"
                  >
                    <FiPlus size={14} />
                  </button>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Only 19 in stock
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-2xl sm:text-3xl font-serif font-bold text-[#22211B]">
                Rs. {(currentPrice * quantity).toLocaleString()}
              </span>
              <span className="text-base text-gray-400 line-through">
                Rs. {(originalPrice * quantity).toLocaleString()}
              </span>
            </div>

            {/* Size Selector */}
            <div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                <span>Size (in inches)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((size) => (
                  <button
                    key={size.label}
                    type="button"
                    onClick={() => setSelectedSize(size.label)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                      selectedSize === size.label
                        ? "bg-[#22211B] text-white border-[#22211B] shadow-sm"
                        : "bg-white text-[#22211B] border-[#C4A892]/40 hover:border-[#22211B]"
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Medium Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2">
                Medium
              </label>
              <div className="flex flex-wrap gap-2">
                {["Museum Grade Canvas", "Archival Fine-Art Paper"].map((med) => (
                  <button
                    key={med}
                    type="button"
                    onClick={() => setSelectedMedium(med)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                      selectedMedium === med
                        ? "bg-[#22211B] text-white border-[#22211B]"
                        : "bg-white text-[#22211B] border-[#C4A892]/40 hover:border-[#22211B]"
                    }`}
                  >
                    {med}
                  </button>
                ))}
              </div>
            </div>

            {/* Framing Options */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2">
                Framing
              </label>
              <div className="flex flex-wrap gap-2">
                {FRAMES.map((frame) => (
                  <button
                    key={frame}
                    type="button"
                    onClick={() => setSelectedFrame(frame)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                      selectedFrame === frame
                        ? "bg-[#22211B] text-white border-[#22211B] shadow-xs"
                        : "bg-white text-[#22211B] border-[#C4A892]/40 hover:border-[#22211B]"
                    }`}
                  >
                    {frame}
                  </button>
                ))}
              </div>
            </div>

            {/* Promo Banner */}
            <div className="p-3 bg-[#EAE3D2]/50 border border-[#C4A892]/30 rounded-xl text-center">
              <p className="text-[11px] font-bold tracking-wider text-[#4D3024] uppercase">
                FLAT 10% OFF ON ORDERS ABOVE ₹10,000 — USE CODE: <span className="underline">FLAT10</span>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                className="w-full bg-white hover:bg-[#FAF7F0] border-2 border-[#22211B] text-[#22211B] py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition cursor-pointer shadow-xs"
              >
                Add to cart
              </button>
              <button
                type="button"
                className="w-full bg-[#22211B] hover:bg-[#4D3024] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition cursor-pointer shadow-md"
              >
                Buy it now
              </button>
            </div>

            {/* Delivery Timeline Tracker */}
            <div className="border border-[#C4A892]/30 bg-white rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between text-center relative">
                {/* Connector Line */}
                <div className="absolute top-4 left-8 right-8 h-[2px] bg-[#E0D8C8] -z-0"></div>

                <div className="flex flex-col items-center relative z-10 space-y-1">
                  <div className="h-8 w-8 rounded-full bg-[#22211B] text-white flex items-center justify-center">
                    <FiPackage size={14} />
                  </div>
                  <span className="text-[11px] font-bold text-[#22211B]">Aug 14th</span>
                  <span className="text-[10px] text-gray-500">Ordered</span>
                </div>

                <div className="flex flex-col items-center relative z-10 space-y-1">
                  <div className="h-8 w-8 rounded-full bg-[#EAE3D2] text-[#4D3024] flex items-center justify-center border border-[#C4A892]/40">
                    <FiTruck size={14} />
                  </div>
                  <span className="text-[11px] font-bold text-[#22211B]">Aug 15th - Aug 17th</span>
                  <span className="text-[10px] text-gray-500">Shipped</span>
                </div>

                <div className="flex flex-col items-center relative z-10 space-y-1">
                  <div className="h-8 w-8 rounded-full bg-[#EAE3D2] text-[#4D3024] flex items-center justify-center border border-[#C4A892]/40">
                    <FiClock size={14} />
                  </div>
                  <span className="text-[11px] font-bold text-[#22211B]">Aug 19th - Aug 25th</span>
                  <span className="text-[10px] text-gray-500">Delivery*</span>
                </div>
              </div>
            </div>

            {/* Description Narrative */}
            {product.description && (
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed pt-2">
                {product.description}
              </p>
            )}

            {/* Accordions */}
            <div className="divide-y divide-[#C4A892]/30 border-y border-[#C4A892]/30">
              {/* Product Highlights */}
              <div className="py-4">
                <button
                  type="button"
                  onClick={() => setHighlightsOpen(!highlightsOpen)}
                  className="w-full flex items-center justify-between font-bold text-xs uppercase tracking-wider text-[#22211B] text-left cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <FiFileText className="text-[#4D3024]" /> Product Highlights
                  </span>
                  {highlightsOpen ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                {highlightsOpen && (
                  <div className="mt-3 text-xs text-gray-600 space-y-1.5 pl-6">
                    <p>• Museum-grade canvas printed using 12-colour archival pigment inks.</p>
                    <p>• UV-resistant coat protects from fading for 100+ years.</p>
                    <p>• Handcrafted frames assembled by master guild framers.</p>
                    <p>• Arrives ready to hang with gallery hardware pre-installed.</p>
                  </div>
                )}
              </div>

              {/* Customisations */}
              <div className="py-4">
                <button
                  type="button"
                  onClick={() => setCustomisationOpen(!customisationOpen)}
                  className="w-full flex items-center justify-between font-bold text-xs uppercase tracking-wider text-[#22211B] text-left cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <FiSliders className="text-[#4D3024]" /> Customisations
                  </span>
                  {customisationOpen ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                {customisationOpen && (
                  <div className="mt-3 text-xs text-gray-600 space-y-1.5 pl-6">
                    <p>• Custom sizing available on request up to 72 inches width.</p>
                    <p>• Personalized plaque engraving available at checkout.</p>
                    <p>• Contact our curators for custom framing mouldings.</p>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}