"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession, signIn } from "next-auth/react";

import {
  ChevronLeft,
  ChevronRight,
  Star,
  Heart,
  Eye,
} from "lucide-react";

interface ProductDetailsClientProps {
  product: any;
}

const DEFAULT_FALLBACK_IMAGE = "/images/products/artwork-1.jpg";

export default function ProductDetailsClient({
  product,
}: ProductDetailsClientProps) {
  const router = useRouter();
  const { data: session, status } = useSession();

  /* ==========================================
      IMAGE GALLERY
  ========================================== */

  const initialImages = useMemo(() => {
    const images = [
      product?.imageUrl,
      product?.image2,
      product?.image3,
      product?.image4,
      product?.image5,
    ].filter(
      (src): src is string =>
        Boolean(src && typeof src === "string" && src.trim() !== "")
    );

    return images.length > 0 ? images : [DEFAULT_FALLBACK_IMAGE];
  }, [product]);

  const [imagesList, setImagesList] = useState<string[]>(initialImages);
  const [selectedIndex, setSelectedIndex] = useState(0);

  /* ==========================================
      IMAGE ZOOM
  ========================================== */

  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

  const handleImageMouseMove = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    if (!isZoomed) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    setZoomPosition({ x, y });
  };

  const toggleZoom = () => {
    setIsZoomed((prev) => !prev);
  };

  /* ==========================================
      SIZE OPTIONS + PRICE
  ========================================== */

  const availableSizes = useMemo(() => {
    const sizes = [
      {
        label: "12 × 18",
        value: "12x18",
        price: Number(product?.price12x18) || 0,
      },
      {
        label: "18 × 24",
        value: "18x24",
        price: Number(product?.price18x24) || 0,
      },
      {
        label: "24 × 33",
        value: "24x33",
        price: Number(product?.price24x33) || 0,
      },
    ];

    return sizes.filter((size) => size.price > 0);
  }, [product]);

  const [selectedSize, setSelectedSize] = useState(
    availableSizes[0]?.value || "12x18"
  );

  /* ==========================================
      QUANTITY
  ========================================== */

  const [quantity, setQuantity] = useState(1);

  /* ==========================================
      MEDIUM
  ========================================== */

  const [selectedMedium, setSelectedMedium] = useState(
    product?.medium || "Museum Grade Canvas"
  );

  const mediumOptions = [
    "Museum Grade Canvas",
    "Archival Fine-Art Paper",
  ];

  /* ==========================================
      FRAME COLORS - ONLY 5
  ========================================== */

  const frameColors = [
    { name: "White", value: "#F5F5F0" },
    { name: "Black", value: "#1C1C1C" },
    { name: "Copper", value: "#B87333" },
    { name: "Gold", value: "#C9A227" },
    { name: "Dark Brown", value: "#4A2C20" },
  ];

  const [selectedFrameColor, setSelectedFrameColor] = useState("White");

  /* ==========================================
      SELECTED PRICE
  ========================================== */

  const selectedSizeData =
    availableSizes.find((item) => item.value === selectedSize) ||
    availableSizes[0];

  const unitPrice = selectedSizeData?.price || 0;
  const totalPrice = unitPrice * quantity;

  /* ==========================================
      IMAGE NAVIGATION
  ========================================== */

  const activeImage =
    imagesList[selectedIndex] || DEFAULT_FALLBACK_IMAGE;

  const handleImageError = (index: number) => {
    setImagesList((prev) => {
      const updated = [...prev];
      updated[index] = DEFAULT_FALLBACK_IMAGE;
      return updated;
    });
  };

  const handlePrev = () => {
    setIsZoomed(false);
    setSelectedIndex((prev) =>
      prev === 0 ? imagesList.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setIsZoomed(false);
    setSelectedIndex((prev) =>
      prev === imagesList.length - 1 ? 0 : prev + 1
    );
  };

  /* ==========================================
      CREATE CART ITEM
  ========================================== */

  const createCartItem = () => {
    return {
      cartItemId: `${product?.id || "product"}-${selectedSize}-${selectedMedium}-${selectedFrameColor}`,
      productId: product?.id || "",
      title: product?.title || "Untitled Artwork",
      imageUrl: activeImage,
      quantity,
      size: selectedSizeData?.label || selectedSize,
      medium: selectedMedium,
      frame: selectedFrameColor,
      price: unitPrice,
      totalPrice,
    };
  };

  /* ==========================================
      ADD TO CART
  ========================================== */

  const handleAddToCart = () => {
    const cartItem = createCartItem();

    const existingCart = JSON.parse(
      localStorage.getItem("tcl-cart") || "[]"
    );

    const existingItemIndex = existingCart.findIndex(
      (item: any) => item.cartItemId === cartItem.cartItemId
    );

    if (existingItemIndex >= 0) {
      existingCart[existingItemIndex].quantity += quantity;
      existingCart[existingItemIndex].totalPrice =
        existingCart[existingItemIndex].quantity *
        existingCart[existingItemIndex].price;
    } else {
      existingCart.push(cartItem);
    }

    localStorage.setItem("tcl-cart", JSON.stringify(existingCart));
    router.push("/checkout");
  };

  /* ==========================================
      BUY NOW (WITH AUTH CHECK)
  ========================================== */

  const handleBuyNow = () => {
    const orderItem = createCartItem();

    // 1. Prepare checkout cart
    localStorage.setItem("tcl-cart", JSON.stringify([orderItem]));

    // 2. Auth check: If not signed in, redirect to login with callback
    if (status === "unauthenticated" || !session) {
      signIn(undefined, { callbackUrl: "/checkout" });
      return;
    }

    // 3. User is signed in -> go straight to checkout
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] px-4 py-10 md:px-12 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">

          {/* LEFT SIDE - IMAGE GALLERY */}
          <div className="flex flex-col items-center lg:col-span-6">
            <div
              onClick={toggleZoom}
              onMouseMove={handleImageMouseMove}
              className={`relative aspect-[4/5] w-full max-w-[500px] overflow-hidden rounded-2xl border border-[#C4A892]/30 bg-[#ECE9E2] shadow-sm ${
                isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
              }`}
            >
              <Image
                src={activeImage}
                alt={product?.title || "Artwork Image"}
                fill
                priority
                unoptimized
                onError={() => handleImageError(selectedIndex)}
                className={`object-contain p-4 transition-transform duration-200 ease-out ${
                  isZoomed ? "scale-[2.2]" : "scale-100"
                }`}
                style={{
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                }}
              />

              <div className="pointer-events-none absolute bottom-4 right-4 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white">
                {isZoomed ? "Click to zoom out" : "Click to zoom"}
              </div>

              <div className="absolute right-4 top-4">
                <button
                  type="button"
                  aria-label="Save to favorites"
                  onClick={(event) => event.stopPropagation()}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm transition hover:bg-white"
                >
                  <Heart className="h-5 w-5 text-gray-700" />
                </button>
              </div>

              <div className="absolute bottom-4 left-4">
                <button
                  type="button"
                  onClick={(event) => event.stopPropagation()}
                  className="flex items-center gap-1.5 rounded-full border border-gray-300 bg-white/90 px-3 py-2 text-xs font-semibold text-gray-800 shadow-sm"
                >
                  <Eye className="h-4 w-4" />
                  View VR Effect
                </button>
              </div>
            </div>

            {/* IMAGE THUMBNAILS */}
            <div className="mt-6 flex w-full max-w-[500px] items-center justify-between gap-3">
              <button
                type="button"
                onClick={handlePrev}
                disabled={imagesList.length <= 1}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-3 overflow-x-auto py-1">
                {imagesList.map((image, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setSelectedIndex(index);
                      setIsZoomed(false);
                    }}
                    className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border-2 bg-white ${
                      selectedIndex === index
                        ? "border-[#4D3024] ring-2 ring-[#4D3024]/20"
                        : "border-gray-200 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`Artwork ${index + 1}`}
                      fill
                      unoptimized
                      onError={() => handleImageError(index)}
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleNext}
                disabled={imagesList.length <= 1}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-3 text-xs font-medium text-gray-500">
              {selectedIndex + 1} / {imagesList.length}
            </p>
          </div>

          {/* RIGHT SIDE - PRODUCT DETAILS */}
          <div className="space-y-6 lg:col-span-6">
            <div>
              <h1 className="font-serif text-3xl text-[#22211B] md:text-4xl">
                {product?.title || "Untitled Artwork"}
              </h1>

              <p className="mt-2 text-xs uppercase tracking-wide text-gray-500">
                {product?.category || "Fine Art"}
                {" • "}
                {product?.medium || "Fine Art Photography"}
              </p>

              {product?.artist && (
                <p className="mt-3 text-sm text-[#4D3024]">
                  By{" "}
                  <span className="font-semibold">
                    {product.artist.name}
                  </span>
                </p>
              )}

              <div className="mt-4 flex items-center gap-2">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      className="h-4 w-4 fill-current"
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold">5.0</span>
                <span className="text-xs text-gray-400">• 503 reviews</span>
              </div>
            </div>

            {/* QUANTITY */}
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-gray-600">
                Quantity
              </label>

              <div className="flex items-center">
                <div className="flex items-center rounded-xl border border-gray-300 bg-white px-3 py-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((q) => Math.max(1, q - 1))
                    }
                    className="px-2 font-bold"
                  >
                    −
                  </button>

                  <span className="min-w-[40px] text-center text-sm font-semibold">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-2 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* PRICE */}
            <div>
              <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-gray-600">
                Price
              </p>

              <span className="font-serif text-3xl font-bold text-[#22211B]">
                ₹ {totalPrice.toLocaleString("en-IN")}
              </span>

              {quantity > 1 && (
                <p className="mt-1 text-xs text-gray-500">
                  ₹ {unitPrice.toLocaleString("en-IN")} per artwork
                </p>
              )}
            </div>

            {/* SIZE */}
            <div>
              <label className="mb-3 block text-[11px] font-bold uppercase tracking-wider text-gray-600">
                Size (In Inches)
              </label>

              <div className="flex flex-wrap gap-2">
                {availableSizes.map((size) => (
                  <button
                    key={size.value}
                    type="button"
                    onClick={() => setSelectedSize(size.value)}
                    className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                      selectedSize === size.value
                        ? "bg-[#22211B] text-white"
                        : "border border-gray-300 bg-white text-gray-700"
                    }`}
                  >
                    {size.label}
                    <span className="ml-2 opacity-70">
                      ₹ {size.price.toLocaleString("en-IN")}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* MEDIUM */}
            <div>
              <label className="mb-3 block text-[11px] font-bold uppercase tracking-wider text-gray-600">
                Medium
              </label>

              <div className="flex flex-wrap gap-2">
                {mediumOptions.map((medium) => (
                  <button
                    key={medium}
                    type="button"
                    onClick={() => setSelectedMedium(medium)}
                    className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                      selectedMedium === medium
                        ? "bg-[#22211B] text-white"
                        : "border border-gray-300 bg-white text-gray-700"
                    }`}
                  >
                    {medium}
                  </button>
                ))}
              </div>
            </div>

            {/* FRAME COLOR */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600">
                  Frame Color
                </label>

                <span className="text-sm font-semibold text-[#4D3024]">
                  {selectedFrameColor}
                </span>
              </div>

              <div className="flex flex-wrap gap-4">
                {frameColors.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => setSelectedFrameColor(color.name)}
                    title={color.name}
                    className="flex flex-col items-center gap-2"
                  >
                    <span
                      className={`h-10 w-10 rounded-full shadow-sm transition ${
                        selectedFrameColor === color.name
                          ? "ring-2 ring-[#22211B] ring-offset-4"
                          : "border border-gray-300 hover:scale-105"
                      }`}
                      style={{
                        backgroundColor: color.value,
                      }}
                    />

                    <span className="text-xs text-gray-600">
                      {color.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* YOUR SELECTION */}
            <div className="rounded-xl border border-[#C4A892]/40 bg-[#F3F0E8] p-4">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#4D3024]">
                Your Selection
              </p>

              <div className="space-y-1 text-sm text-gray-700">
                <p>
                  <span className="font-semibold">Size:</span>{" "}
                  {selectedSizeData?.label || selectedSize}
                </p>
                <p>
                  <span className="font-semibold">Medium:</span>{" "}
                  {selectedMedium}
                </p>
                <p>
                  <span className="font-semibold">Frame Color:</span>{" "}
                  {selectedFrameColor}
                </p>
                <p>
                  <span className="font-semibold">Quantity:</span>{" "}
                  {quantity}
                </p>
              </div>
            </div>

            {/* DISCOUNT */}
            <div className="rounded-xl border border-[#C4A892]/40 bg-[#F3F0E8] p-3 text-center text-xs font-semibold text-[#4D3024]">
              FLAT 10% OFF ON ORDERS ABOVE ₹10,000 — USE CODE:{" "}
              <span className="font-bold">FLAT10</span>
            </div>

            {/* ACTIONS */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full rounded-xl border-2 border-[#22211B] bg-white py-3.5 text-sm font-bold text-[#22211B] transition hover:bg-gray-50"
              >
                ADD TO CART — ₹ {totalPrice.toLocaleString("en-IN")}
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={status === "loading"}
                className="w-full rounded-xl bg-[#22211B] py-3.5 text-sm font-bold text-white transition hover:bg-[#4D3024] disabled:opacity-70"
              >
                {status === "loading" ? "CHECKING AUTH..." : "BUY IT NOW"}
              </button>
            </div>

            {/* DESCRIPTION */}
            {product?.description && (
              <div className="border-t border-gray-200 pt-5">
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-700">
                  Product Highlights
                </h3>

                <p className="text-sm leading-relaxed text-gray-600">
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