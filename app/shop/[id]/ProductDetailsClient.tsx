"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star, Heart, Eye } from "lucide-react";

interface ProductDetailsClientProps {
  product: any;
}

const FALLBACK_IMAGE = "/images/products/artwork-1.jpg";

export default function ProductDetailsClient({
  product,
}: ProductDetailsClientProps) {
  // 1. Safely extract all 5 images
  const additionalImages: string[] = Array.isArray(product?.images)
    ? product.images
    : typeof product?.images === "string"
    ? JSON.parse(product.images)
    : [];

  const allImages: string[] = [
    product?.imageUrl,
    ...additionalImages,
  ].filter(Boolean);

  const imagesList = allImages.length > 0 ? allImages : [FALLBACK_IMAGE];

  // 2. Active image & selected state
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<string>("12x16");
  const [selectedMedium, setSelectedMedium] = useState<string>("Museum Grade Canvas");
  const [selectedFrame, setSelectedFrame] = useState<string>("Print Only");

  const activeImage = imagesList[selectedIndex] || FALLBACK_IMAGE;

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? imagesList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === imagesList.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] px-4 py-10 md:px-12 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          
          {/* ========================================== */}
          {/* LEFT: 5-IMAGE GALLERY SECTION              */}
          {/* ========================================== */}
          <div className="lg:col-span-6 flex flex-col items-center">
            {/* Main Stage Display */}
            <div className="relative aspect-[4/5] w-full max-w-[500px] overflow-hidden rounded-2xl border border-[#C4A892]/30 bg-[#ECE9E2] shadow-sm">
              <Image
                src={activeImage}
                alt={product?.title || "Artwork Image"}
                fill
                priority
                unoptimized
                className="object-contain p-4 transition-all duration-300"
              />

              {/* Action Buttons */}
              <div className="absolute right-4 top-4 flex flex-col gap-2">
                <button
                  type="button"
                  aria-label="Save to favorites"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm transition hover:bg-white"
                >
                  <Heart className="h-4 w-4 text-gray-700" />
                </button>
              </div>

              {/* VR Badge */}
              <div className="absolute bottom-4 left-4">
                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-full border border-gray-300 bg-white/90 px-3 py-1.5 text-xs font-semibold text-gray-800 shadow-sm backdrop-blur transition hover:bg-white"
                >
                  <Eye className="h-3.5 w-3.5" />
                  View VR Effect
                </button>
              </div>
            </div>

            {/* Thumbnail Strip with Navigation Arrows */}
            <div className="mt-6 flex w-full max-w-[500px] items-center justify-between gap-2">
              <button
                type="button"
                onClick={handlePrev}
                disabled={imagesList.length <= 1}
                aria-label="Previous image"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#C4A892]/40 bg-white text-gray-700 transition hover:bg-gray-50 disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-3 overflow-x-auto py-1">
                {imagesList.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedIndex(idx)}
                    className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border-2 bg-white transition ${
                      selectedIndex === idx
                        ? "border-[#4D3024] ring-2 ring-[#4D3024]/20"
                        : "border-gray-200 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleNext}
                disabled={imagesList.length <= 1}
                aria-label="Next image"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#C4A892]/40 bg-white text-gray-700 transition hover:bg-gray-50 disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Pagination Indicator */}
            <p className="mt-2 text-xs font-medium text-gray-500">
              {selectedIndex + 1} / {imagesList.length}
            </p>
          </div>

          {/* ========================================== */}
          {/* RIGHT: PRODUCT DETAILS & PURCHASE OPTIONS  */}
          {/* ========================================== */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl text-[#22211B]">
                {product?.title || "Untitled Artwork"}
              </h1>
              <p className="mt-1 text-xs uppercase tracking-wide text-gray-500">
                {product?.category || "Fine Art"} • {product?.medium || "Digital on Archival Canvas"}
              </p>

              {product?.artist && (
                <p className="mt-2 text-sm text-[#4D3024]">
                  By <span className="font-semibold">{product.artist.name}</span>
                </p>
              )}

              <div className="mt-3 flex items-center gap-2">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-xs font-semibold text-gray-700">5.0</span>
                <span className="text-xs text-gray-400">• 503 reviews</span>
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 block mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-xl border border-gray-300 bg-white px-3 py-1.5">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-2 font-bold text-gray-600 hover:text-black"
                  >
                    -
                  </button>
                  <span className="px-4 text-sm font-semibold">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-2 font-bold text-gray-600 hover:text-black"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs font-semibold text-emerald-700">
                  • Only 19 in stock
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-3xl font-bold text-[#22211B]">
                Rs. {((product?.price || 0) * quantity).toLocaleString()}
              </span>
              <span className="text-sm text-gray-400 line-through">
                Rs. {Math.round((product?.price || 0) * 1.2 * quantity).toLocaleString()}
              </span>
            </div>

            {/* Size Options */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 block mb-2">
                Size (In Inches)
              </label>
              <div className="flex flex-wrap gap-2">
                {["12x16", "18x24", "24x32", "30x40", "36x48", "42x56"].map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                      selectedSize === sz
                        ? "bg-[#22211B] text-white"
                        : "border border-gray-300 bg-white text-gray-700 hover:border-black"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Medium Options */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 block mb-2">
                Medium
              </label>
              <div className="flex flex-wrap gap-2">
                {["Museum Grade Canvas", "Archival Fine-Art Paper"].map((med) => (
                  <button
                    key={med}
                    type="button"
                    onClick={() => setSelectedMedium(med)}
                    className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                      selectedMedium === med
                        ? "bg-[#22211B] text-white"
                        : "border border-gray-300 bg-white text-gray-700 hover:border-black"
                    }`}
                  >
                    {med}
                  </button>
                ))}
              </div>
            </div>

            {/* Framing Options */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 block mb-2">
                Framing
              </label>
              <div className="flex flex-wrap gap-2">
                {[
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
                ].map((frame) => (
                  <button
                    key={frame}
                    type="button"
                    onClick={() => setSelectedFrame(frame)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                      selectedFrame === frame
                        ? "bg-[#22211B] text-white font-semibold"
                        : "border border-gray-300 bg-white text-gray-700 hover:border-black"
                    }`}
                  >
                    {frame}
                  </button>
                ))}
              </div>
            </div>

            {/* Discount Banner */}
            <div className="rounded-xl border border-[#C4A892]/40 bg-[#F3F0E8] p-3 text-center text-xs font-semibold text-[#4D3024]">
              FLAT 10% OFF ON ORDERS ABOVE ₹10,000 — USE CODE: <span className="font-bold">FLAT10</span>
            </div>

            {/* Purchase CTA */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                className="w-full rounded-xl border-2 border-[#22211B] bg-white py-3.5 text-sm font-bold text-[#22211B] transition hover:bg-gray-50"
              >
                ADD TO CART
              </button>
              <button
                type="button"
                className="w-full rounded-xl bg-[#22211B] py-3.5 text-sm font-bold text-white transition hover:bg-[#4D3024]"
              >
                BUY IT NOW
              </button>
            </div>

            {/* Description */}
            {product?.description && (
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Product Highlights
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}