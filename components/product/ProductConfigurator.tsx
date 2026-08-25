"use client";

import { useEffect, useMemo, useState } from "react";
import ProductPreview from "./ProductPreview";
import FrameSelector from "./FrameSelector";

export type FrameOption = {
  id: string;
  name: string;
  previewImage?: string;
  additionalPrice: number;
  frameColor: string;
  frameThickness: number;
  frameDepth: number;
  material: "wood" | "synthetic";
};

export type ProductSize = "A3" | "A2" | "A1" | "CANVAS";

export type ProductSizeOption = {
  id: ProductSize;
  label: string;
  price: number;
  passepartout: string | null;
  frames: FrameOption[];
};

const CANVAS_PRICE = 0;

const a3Frames: FrameOption[] = [
  {
    id: "a3-frame-01",
    name: "Classic Black",
    previewImage: "/frames/a3/frame-01.png",
    additionalPrice: 0,
    frameColor: "#151515",
    frameThickness: 0.6,
    frameDepth: 0.7,
    material: "wood",
  },
  {
    id: "a3-frame-02",
    name: "Walnut",
    previewImage: "/frames/a3/frame-02.png",
    additionalPrice: 500,
    frameColor: "#5A3825",
    frameThickness: 0.7,
    frameDepth: 0.8,
    material: "wood",
  },
  {
    id: "a3-frame-03",
    name: "Natural Oak",
    previewImage: "/frames/a3/frame-03.png",
    additionalPrice: 500,
    frameColor: "#B68A5A",
    frameThickness: 0.7,
    frameDepth: 0.8,
    material: "wood",
  },
  {
    id: "a3-frame-04",
    name: "White",
    previewImage: "/frames/a3/frame-04.png",
    additionalPrice: 0,
    frameColor: "#F1F0EC",
    frameThickness: 0.6,
    frameDepth: 0.7,
    material: "synthetic",
  },
  {
    id: "a3-frame-05",
    name: "Dark Walnut",
    previewImage: "/frames/a3/frame-05.png",
    additionalPrice: 750,
    frameColor: "#2E211A",
    frameThickness: 0.85,
    frameDepth: 0.9,
    material: "wood",
  },
  {
    id: "a3-frame-06",
    name: "Charcoal",
    previewImage: "/frames/a3/frame-06.png",
    additionalPrice: 500,
    frameColor: "#343434",
    frameThickness: 0.65,
    frameDepth: 0.8,
    material: "synthetic",
  },
  {
    id: "a3-frame-07",
    name: "Warm Grey",
    previewImage: "/frames/a3/frame-07.png",
    additionalPrice: 500,
    frameColor: "#78736D",
    frameThickness: 0.7,
    frameDepth: 0.8,
    material: "wood",
  },
];

const a2Frames: FrameOption[] = [
  {
    ...a3Frames[0],
    id: "a2-frame-01",
    previewImage: "/frames/a2/frame-01.png",
    frameThickness: 0.75,
  },
  {
    ...a3Frames[1],
    id: "a2-frame-02",
    previewImage: "/frames/a2/frame-02.png",
    frameThickness: 0.85,
  },
  {
    ...a3Frames[2],
    id: "a2-frame-03",
    previewImage: "/frames/a2/frame-03.png",
    frameThickness: 0.85,
  },
  {
    ...a3Frames[3],
    id: "a2-frame-04",
    previewImage: "/frames/a2/frame-04.png",
    frameThickness: 0.75,
  },
  {
    ...a3Frames[4],
    id: "a2-frame-05",
    previewImage: "/frames/a2/frame-05.png",
    frameThickness: 1,
  },
  {
    ...a3Frames[5],
    id: "a2-frame-06",
    previewImage: "/frames/a2/frame-06.png",
    frameThickness: 0.8,
  },
  {
    ...a3Frames[6],
    id: "a2-frame-07",
    previewImage: "/frames/a2/frame-07.png",
    frameThickness: 0.85,
  },
];

const productOptions: Record<ProductSize, ProductSizeOption> = {
  A3: {
    id: "A3",
    label: "A3",
    price: 5000,
    passepartout: "1 inch",
    frames: a3Frames,
  },

  A2: {
    id: "A2",
    label: "A2",
    price: 10000,
    passepartout: "1.5 inch",
    frames: a2Frames,
  },

  A1: {
    id: "A1",
    label: "A1",
    price: 12000,
    passepartout: null,
    frames: [
      {
        id: "black-synthetic",
        name: "Black Synthetic",
        previewImage: "/frames/a1/black-synthetic.png",
        additionalPrice: 0,
        frameColor: "#111111",
        frameThickness: 0.2,
        frameDepth: 0.35,
        material: "synthetic",
      },
      {
        id: "white-synthetic",
        name: "White Synthetic",
        previewImage: "/frames/a1/white-synthetic.png",
        additionalPrice: 0,
        frameColor: "#F5F4F0",
        frameThickness: 0.2,
        frameDepth: 0.35,
        material: "synthetic",
      },
    ],
  },

  CANVAS: {
    id: "CANVAS",
    label: "Stretched Canvas",
    price: CANVAS_PRICE,
    passepartout: null,
    frames: [
      {
        id: "stretched-canvas",
        name: "Stretched Canvas",
        previewImage: "/frames/canvas/stretched-canvas.png",
        additionalPrice: 0,
        frameColor: "#FFFFFF",
        frameThickness: 0,
        frameDepth: 1,
        material: "wood",
      },
    ],
  },
};

type ProductConfiguratorProps = {
  product: {
    id: string;
    title: string;
    artist: string;
    description: string;
    image: string;
    aspectRatio?: number;
  };
};

export default function ProductConfigurator({
  product,
}: ProductConfiguratorProps) {
  const [selectedSize, setSelectedSize] =
    useState<ProductSize>("A3");

  const [selectedFrame, setSelectedFrame] =
    useState<string>(
      productOptions.A3.frames[0].id
    );

  const selectedSizeOption =
    productOptions[selectedSize];

  const selectedFrameData = useMemo(() => {
    return (
      selectedSizeOption.frames.find(
        (frame) => frame.id === selectedFrame
      ) ?? selectedSizeOption.frames[0]
    );
  }, [selectedFrame, selectedSizeOption]);

  useEffect(() => {
    setSelectedFrame(
      productOptions[selectedSize].frames[0].id
    );
  }, [selectedSize]);

  const totalPrice =
    selectedSizeOption.price +
    selectedFrameData.additionalPrice;

  const formattedPrice =
    `₹${totalPrice.toLocaleString("en-IN")}`;

  const handleAddToCart = () => {
    const cartData = {
      artworkId: product.id,
      title: product.title,
      image: product.image,
      size: selectedSize,
      frame: selectedFrameData,
      passepartout:
        selectedSizeOption.passepartout,
      basePrice: selectedSizeOption.price,
      framePrice:
        selectedFrameData.additionalPrice,
      totalPrice,
    };

    console.log("ADD TO CART:", cartData);

    // Replace this with your existing cart logic.
  };

  return (
    <section className="w-full bg-[#F5F3EE]">
      <div className="mx-auto grid max-w-[1800px] grid-cols-1 lg:grid-cols-[1.15fr_0.85fr]">

        {/* ================= PREVIEW ================= */}

        <div className="min-h-[600px] border-b border-black/10 lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
          <ProductPreview
            artworkImage={product.image}
            aspectRatio={product.aspectRatio ?? 0.75}
            selectedSize={selectedSize}
            selectedFrame={selectedFrameData}
            passepartout={
              selectedSizeOption.passepartout
            }
            isCanvas={
              selectedSize === "CANVAS"
            }
          />
        </div>

        {/* ================= PRODUCT DETAILS ================= */}

        <div className="px-6 py-12 sm:px-10 lg:px-16 lg:py-20">

          <p className="text-[10px] font-medium tracking-[0.35em] text-black/45">
            TCL GALLERY
          </p>

          <h1 className="mt-5 font-serif text-4xl leading-tight text-[#202020] sm:text-5xl">
            {product.title}
          </h1>

          <p className="mt-4 text-sm tracking-wide text-black/55">
            {product.artist}
          </p>

          <p className="mt-8 max-w-xl text-base leading-8 text-black/65">
            {product.description}
          </p>

          {/* PRICE */}

          <div className="mt-10 border-y border-black/10 py-7">
            <p className="text-[10px] tracking-[0.3em] text-black/45">
              SELECTED CONFIGURATION
            </p>

            <p className="mt-3 text-3xl font-medium text-[#181818]">
              {formattedPrice}
            </p>

            <p className="mt-2 text-xs text-black/50">
              Base price + selected frame option
            </p>
          </div>

          {/* SIZE */}

          <div className="mt-10">
            <h2 className="text-xs font-medium tracking-[0.25em] text-black/70">
              SELECT SIZE
            </h2>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {(
                Object.values(
                  productOptions
                ) as ProductSizeOption[]
              ).map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() =>
                    setSelectedSize(option.id)
                  }
                  className={`min-h-[58px] border px-4 text-xs tracking-[0.12em] transition-all duration-300 ${
                    selectedSize === option.id
                      ? "border-[#151515] bg-[#151515] text-white"
                      : "border-black/15 bg-transparent text-black hover:border-black"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* PASSEPARTOUT */}

          {selectedSizeOption.passepartout && (
            <div className="mt-8 border-l-2 border-black/20 pl-4">
              <p className="text-[10px] tracking-[0.25em] text-black/45">
                PASSEPARTOUT
              </p>

              <p className="mt-2 text-sm text-black/75">
                {selectedSizeOption.passepartout}
              </p>
            </div>
          )}

          {/* FRAME SELECTOR */}

          <FrameSelector
            frames={selectedSizeOption.frames}
            selectedFrame={selectedFrame}
            onSelect={setSelectedFrame}
          />

          {/* CONFIGURATION SUMMARY */}

          <div className="mt-10 border-t border-black/10 pt-8">
            <h3 className="text-[10px] tracking-[0.3em] text-black/45">
              YOUR SELECTION
            </h3>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-black/50">
                  Size
                </span>

                <span>
                  {selectedSizeOption.label}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-black/50">
                  Frame
                </span>

                <span>
                  {selectedFrameData.name}
                </span>
              </div>

              {selectedSizeOption.passepartout && (
                <div className="flex justify-between gap-4">
                  <span className="text-black/50">
                    Passepartout
                  </span>

                  <span>
                    {selectedSizeOption.passepartout}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ADD TO CART */}

          <button
            type="button"
            onClick={handleAddToCart}
            className="mt-12 flex min-h-[70px] w-full items-center justify-center bg-[#111111] px-8 text-xs font-semibold tracking-[0.25em] text-white transition-all duration-300 hover:bg-[#333333]"
          >
            ADD TO CART
            <span className="ml-5 text-lg">
              →
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}