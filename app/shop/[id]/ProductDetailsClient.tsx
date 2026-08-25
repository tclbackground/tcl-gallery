"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession, signIn } from "next-auth/react";

import ProductArtwork3D from "@/components/three/ProductArtwork3D";

import {
  ArtworkSize,
  ArtworkFinish,
  FRAME_CONFIG,
  FrameType,
  getDefaultFrame,
  getPassepartoutWidth,
  getFrameWidth,
} from "@/lib/frameConfig";

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



type ImageDimensions = {
  width: number;
  height: number;
};

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
      product?.image,
      product?.image2,
      product?.image3,
      product?.image4,
      product?.image5,
    ].filter(
      (src): src is string =>
        Boolean(
          src &&
            typeof src === "string" &&
            src.trim() !== ""
        )
    );

    return Array.from(new Set(images));
  }, [product]);

  const [imagesList, setImagesList] =
    useState<string[]>(initialImages);

  const [selectedIndex, setSelectedIndex] =
    useState(0);

  /* ==========================================
     UPDATE IMAGES WHEN PRODUCT CHANGES
  ========================================== */

  useEffect(() => {
    setImagesList(initialImages);
    setSelectedIndex(0);
  }, [initialImages]);

  /* ==========================================
     SELECTED SIZE
  ========================================== */

  const [selectedSize, setSelectedSize] =
    useState<ArtworkSize>("A3");

  /* ==========================================
     SELECTED FINISH
  ========================================== */

  const [selectedFinish, setSelectedFinish] =
    useState<ArtworkFinish>("framed");

  /* ==========================================
     SELECTED FRAME
  ========================================== */

  const [selectedFrameId, setSelectedFrameId] =
    useState<string>(
      getDefaultFrame("A3")?.id || ""
    );

  /* ==========================================
     QUANTITY
  ========================================== */

  const [quantity, setQuantity] =
    useState(1);

  /* ==========================================
     MEDIUM
  ========================================== */

  const mediumOptions = [
    "Archival Fine-Art Paper",
    "Museum Grade Canvas",
  ];

  const [selectedMedium, setSelectedMedium] =
    useState(
      product?.medium ||
        "Archival Fine-Art Paper"
    );

  /* ==========================================
     IMAGE ZOOM
  ========================================== */

  const [isZoomed, setIsZoomed] =
    useState(false);

  const handleImageMouseMove = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    if (!isZoomed) return;

    const rect =
      event.currentTarget.getBoundingClientRect();

    const x =
      ((event.clientX - rect.left) /
        rect.width) *
      100;

    const y =
      ((event.clientY - rect.top) /
        rect.height) *
      100;

    void x;
    void y;
  };

  const toggleZoom = () => {
    setIsZoomed((prev) => !prev);
  };

  /* ==========================================
     CURRENT CONFIG
  ========================================== */

  const currentConfig =
    FRAME_CONFIG[selectedSize];

  /* ==========================================
     AUTO SELECT VALID FRAME
  ========================================== */

  useEffect(() => {
    /*
      Only A2 supports stretched canvas
    */

    if (selectedSize !== "A2") {
      setSelectedFinish("framed");
    }

    const frames =
      FRAME_CONFIG[selectedSize]?.frameTypes ||
      [];

    const frameIsValid =
      frames.some(
        (frame) =>
          frame.id === selectedFrameId
      );

    if (!frameIsValid) {
      setSelectedFrameId(
        frames[0]?.id || ""
      );
    }
  }, [
    selectedSize,
    selectedFrameId,
  ]);

  /* ==========================================
     SELECTED FRAME DATA
  ========================================== */

  const selectedFrameData =
    currentConfig?.frameTypes?.find(
      (frame) =>
        frame.id === selectedFrameId
    ) ||
    currentConfig?.frameTypes?.[0] ||
    null;

  /* ==========================================
     CANVAS MODE

     Currently A2 supports stretched canvas
  ========================================== */

  const isCanvas =
    selectedSize === "A2" &&
    selectedFinish === "canvas";

  /* ==========================================
     FRAME WIDTH
  ========================================== */

  const currentFrameWidth =
    isCanvas
      ? 0
      : getFrameWidth(selectedSize);

  /* ==========================================
     PASSEPARTOUT

     A1 ALWAYS HAS ZERO PASSEPARTOUT.
     CANVAS ALWAYS HAS ZERO PASSEPARTOUT.
  ========================================== */

  const currentPassepartoutWidth =
    selectedSize === "A1" || isCanvas
      ? 0
      : getPassepartoutWidth(
          selectedSize,
          selectedFinish
        );

  const showPassepartout =
    !isCanvas &&
    selectedSize !== "A1" &&
    currentPassepartoutWidth > 0;

  /* ==========================================
     PRICE
  ========================================== */

  const unitPrice = useMemo(() => {
    if (selectedSize === "A3") {
      return (
        Number(product?.priceA3) ||
        FRAME_CONFIG.A3.price
      );
    }

    if (selectedSize === "A2") {
      return (
        Number(product?.priceA2) ||
        FRAME_CONFIG.A2.price
      );
    }

    return (
      Number(product?.priceA1) ||
      FRAME_CONFIG.A1.price
    );
  }, [
    selectedSize,
    product,
  ]);

  const totalPrice =
    unitPrice * quantity;

  /* ==========================================
     ACTIVE IMAGE
  ========================================== */

  const activeImage =
    imagesList[selectedIndex] ?? null;

  const handleImageError = (
    index: number
  ) => {
    setImagesList((previous) => {
      const updated = previous.filter(
        (_, imageIndex) =>
          imageIndex !== index
      );

      setSelectedIndex((currentIndex) => {
        if (updated.length === 0) {
          return 0;
        }

        return Math.min(
          currentIndex,
          updated.length - 1
        );
      });

      return updated;
    });
  };

  /* ==========================================
     IMAGE DIMENSIONS
  ========================================== */

  const [
    imageDimensions,
    setImageDimensions,
  ] = useState<ImageDimensions>({
    width: 1,
    height: 1,
  });

  useEffect(() => {
    if (!activeImage) return;

    const image = new window.Image();

    image.src = activeImage;

    image.onload = () => {
      if (
        image.naturalWidth > 0 &&
        image.naturalHeight > 0
      ) {
        setImageDimensions({
          width: image.naturalWidth,
          height: image.naturalHeight,
        });
      }
    };
  }, [activeImage]);

  const artworkAspectRatio =
    imageDimensions.width /
    imageDimensions.height;

  /* ==========================================
     ARTWORK ORIENTATION
  ========================================== */

  const artworkOrientation =
    artworkAspectRatio > 1.05
      ? "landscape"
      : artworkAspectRatio < 0.95
        ? "portrait"
        : "square";

  /* ==========================================
     IMAGE NAVIGATION
  ========================================== */

  const handlePrev = () => {
    if (imagesList.length <= 1) return;

    setIsZoomed(false);

    setSelectedIndex((previous) =>
      previous === 0
        ? imagesList.length - 1
        : previous - 1
    );
  };

  const handleNext = () => {
    if (imagesList.length <= 1) return;

    setIsZoomed(false);

    setSelectedIndex((previous) =>
      previous ===
      imagesList.length - 1
        ? 0
        : previous + 1
    );
  };

  /* ==========================================
     SIZE CHANGE
  ========================================== */

  const handleSizeChange = (
    size: ArtworkSize
  ) => {
    setSelectedSize(size);

    /*
      Reset canvas when selecting
      A3 or A1
    */

    if (size !== "A2") {
      setSelectedFinish("framed");
    }

    const defaultFrame =
      getDefaultFrame(size);

    setSelectedFrameId(
      defaultFrame?.id || ""
    );
  };

  /* ==========================================
     FINISH CHANGE
  ========================================== */

  const handleFinishChange = (
    finish: ArtworkFinish
  ) => {
    /*
      Only A2 can use canvas
    */

    if (
      finish === "canvas" &&
      selectedSize !== "A2"
    ) {
      return;
    }

    setSelectedFinish(finish);

    if (finish === "framed") {
      const defaultFrame =
        getDefaultFrame(selectedSize);

      setSelectedFrameId(
        defaultFrame?.id || ""
      );
    }
  };

  /* ==========================================
     CREATE CART ITEM
  ========================================== */

  const createCartItem = () => {
    return {
      cartItemId:
        `${product?.id || "product"}-${selectedSize}-${selectedFinish}-${selectedMedium}-${selectedFrameId}`,

      productId:
        product?.id || "",

      title:
        product?.title ||
        "Untitled Artwork",

      imageUrl: activeImage,

      quantity,

      size: selectedSize,

      medium:
        isCanvas
          ? "Museum Grade Canvas"
          : selectedMedium,

      finish:
        isCanvas
          ? "Stretched Canvas"
          : "Framed Artwork",

      frame: isCanvas
        ? "No Frame"
        : selectedFrameData?.name ||
          "Frame",

      frameImage: isCanvas
        ? null
        : selectedFrameData?.image ||
          null,

      frameWidth:
        currentFrameWidth,

      passepartoutWidth:
        currentPassepartoutWidth,

      price: unitPrice,

      totalPrice,
    };
  };

  /* ==========================================
     ADD TO CART
  ========================================== */

  const handleAddToCart = () => {
    const cartItem =
      createCartItem();

    const existingCart = JSON.parse(
      localStorage.getItem("tcl-cart") ||
        "[]"
    );

    const existingItemIndex =
      existingCart.findIndex(
        (item: any) =>
          item.cartItemId ===
          cartItem.cartItemId
      );

    if (existingItemIndex >= 0) {
      existingCart[
        existingItemIndex
      ].quantity += quantity;

      existingCart[
        existingItemIndex
      ].totalPrice =
        existingCart[
          existingItemIndex
        ].quantity *
        existingCart[
          existingItemIndex
        ].price;
    } else {
      existingCart.push(cartItem);
    }

    localStorage.setItem(
      "tcl-cart",
      JSON.stringify(existingCart)
    );

    router.push("/checkout");
  };

  /* ==========================================
     BUY NOW
  ========================================== */

  const handleBuyNow = () => {
    const orderItem =
      createCartItem();

    localStorage.setItem(
      "tcl-cart",
      JSON.stringify([orderItem])
    );

    if (
      status === "unauthenticated" ||
      !session
    ) {
      signIn(undefined, {
        callbackUrl: "/checkout",
      });

      return;
    }

    router.push("/checkout");
  };

  /* ==========================================
     RENDER
  ========================================== */

  return (
    <section className="w-full overflow-x-hidden bg-[#F5F3EE]">
      <div
        className="
          mx-auto
          grid
          w-full
          max-w-[1800px]
          grid-cols-1

          lg:grid-cols-[1.15fr_0.85fr]
        "
      >
        {/* ======================================
            LEFT SIDE
            RESPONSIVE 3D ARTWORK
        ====================================== */}

        <div
          className="
            relative
            h-[480px]
            w-full
            overflow-hidden
            border-b
            border-black/10
            bg-[#ECE9E2]

            xs:h-[520px]

            sm:h-[620px]

            md:h-[700px]

            lg:sticky
            lg:top-0
            lg:h-screen
            lg:min-h-[650px]
            lg:border-b-0
            lg:border-r
          "
        >
          <div
            className="h-full w-full"
            onMouseMove={
              handleImageMouseMove
            }
          >
            {activeImage ? (
              <ProductArtwork3D
                key={`${activeImage}-${selectedSize}-${selectedFinish}-${selectedFrameId}`}
                imageUrl={activeImage}
                aspectRatio={artworkAspectRatio}
            
               
                
                frameWidth={
                  currentFrameWidth
                }
                passepartoutWidth={
                  selectedSize === "A1" ||
                  isCanvas
                    ? 0
                    : currentPassepartoutWidth
                }
                displayMode={
                  isCanvas
                    ? "canvas"
                    : "frame"
                }
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
                Artwork image unavailable
              </div>
            )}
          </div>

          {/* ======================================
              FAVORITE
          ====================================== */}

          <button
            type="button"
            aria-label="Save to favorites"
            className="
              absolute
              right-3
              top-3
              z-20

              flex
              h-10
              w-10
              items-center
              justify-center

              rounded-full
              bg-white/90
              shadow-md
              backdrop-blur-sm

              transition
              duration-300
              hover:scale-105

              sm:right-5
              sm:top-5
              sm:h-11
              sm:w-11
            "
          >
            <Heart
              className="
                h-4
                w-4
                text-gray-700

                sm:h-5
                sm:w-5
              "
            />
          </button>

          {/* ======================================
              VIEW PREVIEW
          ====================================== */}

          <button
            type="button"
            onClick={toggleZoom}
            className="
              absolute
              bottom-3
              left-3
              z-20

              flex
              items-center
              gap-2

              rounded-full
              border
              border-gray-300
              bg-white/90

              px-3
              py-2

              text-[10px]
              font-semibold
              text-gray-800

              shadow-md
              backdrop-blur-sm

              transition
              hover:bg-white

              sm:bottom-5
              sm:left-5
              sm:px-4
              sm:py-2.5
              sm:text-xs
            "
          >
            <Eye
              className="
                h-3.5
                w-3.5

                sm:h-4
                sm:w-4
              "
            />

            <span className="hidden xs:inline">
              {isZoomed
                ? "Normal View"
                : "View 3D Preview"}
            </span>

            <span className="xs:hidden">
              3D View
            </span>
          </button>

          {/* ======================================
              IMAGE NAVIGATION
          ====================================== */}

          {imagesList.length > 1 && (
            <div
              className="
                absolute
                bottom-3
                right-3
                z-20

                flex
                items-center
                gap-2

                sm:bottom-5
                sm:right-5
                sm:gap-3
              "
            >
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous image"
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center

                  rounded-full
                  bg-white
                  shadow-md

                  transition
                  hover:scale-105

                  sm:h-10
                  sm:w-10
                "
              >
                <ChevronLeft
                  className="
                    h-4
                    w-4

                    sm:h-5
                    sm:w-5
                  "
                />
              </button>

              <span
                className="
                  rounded-full
                  bg-white/90

                  px-3
                  py-2

                  text-[10px]
                  font-semibold
                  shadow-md

                  sm:px-4
                  sm:text-xs
                "
              >
                {selectedIndex + 1} /{" "}
                {imagesList.length}
              </span>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next image"
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center

                  rounded-full
                  bg-white
                  shadow-md

                  transition
                  hover:scale-105

                  sm:h-10
                  sm:w-10
                "
              >
                <ChevronRight
                  className="
                    h-4
                    w-4

                    sm:h-5
                    sm:w-5
                  "
                />
              </button>
            </div>
          )}
        </div>

        {/* ======================================
            RIGHT SIDE
            PRODUCT DETAILS
        ====================================== */}

        <div
          className="
            w-full

            px-4
            py-8

            xs:px-5

            sm:px-8
            sm:py-10

            md:px-10
            md:py-12

            lg:px-10
            lg:py-14

            xl:px-16
            xl:py-16
          "
        >
          <div
            className="
              mx-auto
              w-full
              max-w-[650px]
              space-y-7

              sm:space-y-8
            "
          >
            {/* ======================================
                TITLE
            ====================================== */}

            <div>
              <h1
                className="
                  break-words
                  font-serif

                  text-3xl
                  leading-[1.15]
                  text-[#22211B]

                  xs:text-[2.1rem]

                  sm:text-4xl

                  md:text-5xl
                "
              >
                {product?.title ||
                  "Untitled Artwork"}
              </h1>

              <p
                className="
                  mt-3
                  text-[10px]
                  leading-relaxed
                  uppercase
                  tracking-[0.12em]
                  text-gray-500

                  sm:text-xs
                  sm:tracking-[0.18em]
                "
              >
                {product?.category ||
                  "Fine Art"}

                {" • "}

                {product?.medium ||
                  "Fine Art Photography"}
              </p>

              {product?.artist && (
                <p
                  className="
                    mt-4
                    text-sm
                    text-[#4D3024]
                  "
                >
                  By{" "}

                  <span className="font-semibold">
                    {product.artist.name}
                  </span>
                </p>
              )}

              <div
                className="
                  mt-5
                  flex
                  flex-wrap
                  items-center
                  gap-2
                "
              >
                <div className="flex text-amber-500">
                  {[...Array(5)].map(
                    (_, index) => (
                      <Star
                        key={index}
                        className="
                          h-4
                          w-4
                          fill-current
                        "
                      />
                    )
                  )}
                </div>

                <span className="text-xs font-semibold">
                  5.0
                </span>

                <span className="text-xs text-gray-400">
                  • 503 reviews
                </span>
              </div>
            </div>

            {/* ======================================
                PRICE
            ====================================== */}

            <div
              className="
                border-y
                border-black/10
                py-5

                sm:py-6
              "
            >
              <p
                className="
                  mb-2
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.15em]
                  text-gray-500

                  sm:text-[11px]
                "
              >
                Price
              </p>

              <p
                className="
                  font-serif

                  text-3xl
                  font-bold
                  text-[#22211B]

                  sm:text-4xl

                  md:text-[2.75rem]
                "
              >
                ₹{" "}
                {totalPrice.toLocaleString(
                  "en-IN"
                )}
              </p>

              {quantity > 1 && (
                <p
                  className="
                    mt-2
                    text-xs
                    text-gray-500
                  "
                >
                  ₹{" "}
                  {unitPrice.toLocaleString(
                    "en-IN"
                  )}{" "}
                  per artwork
                </p>
              )}
            </div>

            {/* ======================================
                SELECT SIZE
            ====================================== */}

            <div>
              <label
                className="
                  mb-4
                  block

                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.15em]
                  text-gray-600

                  sm:text-[11px]
                "
              >
                Select Size
              </label>

              <div
                className="
                  grid
                  grid-cols-3
                  gap-2

                  sm:gap-3
                "
              >
                {(
                  ["A3", "A2", "A1"] as ArtworkSize[]
                ).map((size) => {
                  const config =
                    FRAME_CONFIG[size];

                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() =>
                        handleSizeChange(size)
                      }
                      className={`
                        min-w-0
                        border
                        px-2
                        py-3
                        text-left
                        transition-all
                        duration-300

                        sm:px-4
                        sm:py-4

                        ${
                          selectedSize === size
                            ? "border-[#22211B] bg-[#22211B] text-white"
                            : "border-gray-300 bg-white text-gray-700 hover:border-[#22211B]"
                        }
                      `}
                    >
                      <span
                        className="
                          block
                          text-sm
                          font-bold

                          sm:text-base
                        "
                      >
                        {size}
                      </span>

                      <span
                        className="
                          mt-1
                          block
                          whitespace-nowrap

                          text-[10px]
                          opacity-70

                          sm:text-xs
                        "
                      >
                        ₹{" "}
                        {config.price.toLocaleString(
                          "en-IN"
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ======================================
                A2 FINISH
            ====================================== */}

            {selectedSize === "A2" && (
              <div>
                <label
                  className="
                    mb-4
                    block

                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.15em]
                    text-gray-600

                    sm:text-[11px]
                  "
                >
                  Finish
                </label>

                <div
                  className="
                    grid
                    grid-cols-1
                    gap-3

                    xs:grid-cols-2
                  "
                >
                  <button
                    type="button"
                    onClick={() =>
                      handleFinishChange(
                        "framed"
                      )
                    }
                    className={`border px-4 py-4 text-left transition ${
                      selectedFinish ===
                      "framed"
                        ? "border-[#22211B] bg-[#22211B] text-white"
                        : "border-gray-300 bg-white hover:border-[#22211B]"
                    }`}
                  >
                    <span className="block text-sm font-bold">
                      Framed Artwork
                    </span>

                    <span className="mt-1 block text-xs opacity-70">
                      1" frame + 1.5"
                      passepartout
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleFinishChange(
                        "canvas"
                      )
                    }
                    className={`border px-4 py-4 text-left transition ${
                      selectedFinish ===
                      "canvas"
                        ? "border-[#22211B] bg-[#22211B] text-white"
                        : "border-gray-300 bg-white hover:border-[#22211B]"
                    }`}
                  >
                    <span className="block text-sm font-bold">
                      Stretched Canvas
                    </span>

                    <span className="mt-1 block text-xs opacity-70">
                      No frame or
                      passepartout
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* ======================================
                MEDIUM
            ====================================== */}

            <div>
              <label
                className="
                  mb-4
                  block

                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.15em]
                  text-gray-600

                  sm:text-[11px]
                "
              >
                Medium
              </label>

              <div
                className="
                  grid
                  grid-cols-1
                  gap-2

                  xs:grid-cols-2

                  sm:flex
                  sm:flex-wrap
                  sm:gap-3
                "
              >
                {mediumOptions.map(
                  (medium) => (
                    <button
                      key={medium}
                      type="button"
                      onClick={() =>
                        setSelectedMedium(
                          medium
                        )
                      }
                      className={`border px-4 py-3 text-center text-xs font-semibold transition sm:px-5 ${
                        selectedMedium ===
                        medium
                          ? "border-[#22211B] bg-[#22211B] text-white"
                          : "border-gray-300 bg-white text-gray-700 hover:border-[#22211B]"
                      }`}
                    >
                      {medium}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* ======================================
                FRAME TYPES
            ====================================== */}

            {!isCanvas && (
              <div>
                <div
                  className="
                    mb-4
                    flex
                    flex-col
                    gap-2

                    xs:flex-row
                    xs:items-center
                    xs:justify-between
                  "
                >
                  <label
                    className="
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.15em]
                      text-gray-600

                      sm:text-[11px]
                    "
                  >
                    Choose Frame
                  </label>

                  <span className="text-sm font-semibold text-[#4D3024]">
                    {selectedFrameData?.name}
                  </span>
                </div>

                <div
                  className="
                    grid
                    grid-cols-2
                    gap-2

                    xs:gap-3

                    sm:grid-cols-3
                  "
                >
                  {currentConfig?.frameTypes?.map(
                    (
                      frame: FrameType
                    ) => (
                      <button
                        key={frame.id}
                        type="button"
                        onClick={() =>
                          setSelectedFrameId(
                            frame.id
                          )
                        }
                        className={`group min-w-0 border p-2 text-left transition-all duration-300 sm:p-3 ${
                          selectedFrameId ===
                          frame.id
                            ? "border-[#22211B] bg-white ring-2 ring-[#22211B]/10"
                            : "border-gray-200 bg-white hover:border-gray-500"
                        }`}
                      >
                        <div
                          className="
                            relative
                            mb-2
                            aspect-square
                            w-full
                            overflow-hidden
                            bg-[#F4F1EB]

                            sm:mb-3
                          "
                        >
                          <Image
                            src={frame.image}
                            alt={`${frame.name} frame`}
                            fill
                            unoptimized
                            className="object-contain"
                          />
                        </div>

                        <p
                          className="
                            truncate
                            text-[11px]
                            font-semibold
                            text-[#22211B]

                            sm:text-xs
                          "
                        >
                          {frame.name}
                        </p>
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {/* ======================================
                PASSEPARTOUT
            ====================================== */}

            {showPassepartout && (
              <div className="border border-[#C4A892]/30 bg-[#F3F0E8] p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#4D3024]">
                  Passepartout Included
                </p>

                <p className="mt-1 text-sm text-gray-600">
                  {currentPassepartoutWidth}
                  " premium archival white
                  passepartout
                </p>
              </div>
            )}

            {/* ======================================
                A1 INFO
            ====================================== */}

            {selectedSize === "A1" && (
              <div className="border border-[#C4A892]/30 bg-[#F3F0E8] p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#4D3024]">
                  A1 Frame
                </p>

                <p className="mt-1 text-sm text-gray-600">
                  0.2" frame.
                  No passepartout included.
                </p>
              </div>
            )}

            {/* ======================================
                CANVAS INFO
            ====================================== */}

            {isCanvas && (
              <div className="border border-[#C4A892]/30 bg-[#F3F0E8] p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#4D3024]">
                  Stretched Canvas
                </p>

                <p className="mt-1 text-sm leading-relaxed text-gray-600">
                  Museum grade canvas stretched
                  and ready for display.
                  No frame or passepartout.
                </p>
              </div>
            )}

            {/* ======================================
                QUANTITY
            ====================================== */}

            <div>
              <label
                className="
                  mb-3
                  block

                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.15em]
                  text-gray-600

                  sm:text-[11px]
                "
              >
                Quantity
              </label>

              <div className="inline-flex items-center border border-gray-300 bg-white">
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) =>
                      Math.max(1, q - 1)
                    )
                  }
                  className="
                    px-4
                    py-3
                    text-lg
                    font-bold

                    sm:px-5
                  "
                >
                  −
                </button>

                <span
                  className="
                    min-w-[50px]
                    text-center
                    text-sm
                    font-semibold

                    sm:min-w-[55px]
                  "
                >
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setQuantity(
                      (q) => q + 1
                    )
                  }
                  className="
                    px-4
                    py-3
                    text-lg
                    font-bold

                    sm:px-5
                  "
                >
                  +
                </button>
              </div>
            </div>

            {/* ======================================
                YOUR SELECTION
            ====================================== */}

            <div
              className="
                border
                border-[#C4A892]/40
                bg-[#F3F0E8]
                p-4

                sm:p-5
              "
            >
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-[#4D3024]">
                Your Selection
              </p>

              <div className="space-y-2 break-words text-sm text-gray-700">
                <p>
                  <span className="font-semibold">
                    Size:
                  </span>{" "}
                  {selectedSize}
                </p>

                <p>
                  <span className="font-semibold">
                    Orientation:
                  </span>{" "}
                  {artworkOrientation}
                </p>

                <p>
                  <span className="font-semibold">
                    Medium:
                  </span>{" "}
                  {isCanvas
                    ? "Museum Grade Canvas"
                    : selectedMedium}
                </p>

                <p>
                  <span className="font-semibold">
                    Finish:
                  </span>{" "}
                  {isCanvas
                    ? "Stretched Canvas"
                    : "Framed Artwork"}
                </p>

                {!isCanvas && (
                  <p>
                    <span className="font-semibold">
                      Frame:
                    </span>{" "}
                    {selectedFrameData?.name}
                  </p>
                )}

                {!isCanvas && (
                  <p>
                    <span className="font-semibold">
                      Frame Width:
                    </span>{" "}
                    {currentFrameWidth}"
                  </p>
                )}

                {showPassepartout && (
                  <p>
                    <span className="font-semibold">
                      Passepartout:
                    </span>{" "}
                    {currentPassepartoutWidth}"
                  </p>
                )}

                <p>
                  <span className="font-semibold">
                    Quantity:
                  </span>{" "}
                  {quantity}
                </p>
              </div>
            </div>

            {/* ======================================
                DISCOUNT
            ====================================== */}

            <div
              className="
                border
                border-[#C4A892]/40
                bg-[#F3F0E8]
                p-4
                text-center

                text-[11px]
                font-semibold
                text-[#4D3024]

                sm:text-xs
              "
            >
              FLAT 10% OFF ON ORDERS ABOVE ₹10,000

              <br />

              <span className="mt-1 inline-block font-bold">
                USE CODE: FLAT10
              </span>
            </div>

            {/* ======================================
                ACTIONS
            ====================================== */}

            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className="
                  w-full
                  border-2
                  border-[#22211B]
                  bg-white

                  px-4
                  py-3.5

                  text-xs
                  font-bold
                  text-[#22211B]

                  transition
                  hover:bg-gray-50

                  sm:py-4
                  sm:text-sm
                "
              >
                ADD TO CART — ₹{" "}
                {totalPrice.toLocaleString(
                  "en-IN"
                )}
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={
                  status === "loading"
                }
                className="
                  w-full
                  bg-[#22211B]

                  px-4
                  py-3.5

                  text-xs
                  font-bold
                  text-white

                  transition
                  hover:bg-[#4D3024]

                  disabled:opacity-70

                  sm:py-4
                  sm:text-sm
                "
              >
                {status === "loading"
                  ? "CHECKING AUTH..."
                  : "BUY IT NOW"}
              </button>
            </div>

            {/* ======================================
                DESCRIPTION
            ====================================== */}

            {product?.description && (
              <div className="border-t border-gray-200 pt-6 sm:pt-8">
                <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-gray-700">
                  Product Highlights
                </h3>

                <p className="text-sm leading-relaxed text-gray-600">
                  {product.description}
                </p>
              </div>
            )}

            {/* ======================================
                IMAGE THUMBNAILS
            ====================================== */}

            {imagesList.length > 1 && (
              <div className="border-t border-gray-200 pt-6 sm:pt-8">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-gray-600">
                  Artwork Images
                </p>

                <div className="flex gap-2 overflow-x-auto pb-3 sm:gap-3">
                  {imagesList.map(
                    (
                      image,
                      index
                    ) => (
                      <button
                        key={`${image}-${index}`}
                        type="button"
                        onClick={() => {
                          setSelectedIndex(
                            index
                          );

                          setIsZoomed(
                            false
                          );
                        }}
                        className={`relative h-16 w-16 flex-shrink-0 overflow-hidden border-2 bg-white sm:h-20 sm:w-20 ${
                          selectedIndex ===
                          index
                            ? "border-[#22211B]"
                            : "border-gray-200 opacity-60"
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`Artwork ${
                            index + 1
                          }`}
                          fill
                          unoptimized
                          onError={() =>
                            handleImageError(
                              index
                            )
                          }
                          className="object-contain"
                        />
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );

  
}