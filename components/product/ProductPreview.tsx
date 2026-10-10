
"use client";

import dynamic from "next/dynamic";
import type { FrameOption, ProductSize } from "./ProductConfigurator";

const Artwork3D = dynamic(
  () => import("../three/Artwork3D"),
  { ssr: false }
);

type ProductPreviewProps = {
  artworkImage: string;
  aspectRatio?: number;
  selectedSize: ProductSize;
  selectedFrame: FrameOption;
  passepartout: string | null;
  isCanvas: boolean;
};

export default function ProductPreview({
  artworkImage,
  aspectRatio = 0.75,
  selectedSize,
  selectedFrame,
  passepartout,
  isCanvas,
}: ProductPreviewProps) {
  return (
    <div className="w-full p-6">
      <div className="h-[420px] w-full sm:h-[520px]">
        <Artwork3D
          imageUrl={artworkImage}
          aspectRatio={aspectRatio}
          frameColor={selectedFrame.frameColor}
          frameType={
            selectedFrame.material === "wood" ? "wood" : "black"
          }
          frameWidth={selectedFrame.frameThickness}
          passepartoutWidth={passepartout ? 0.72 : 0}
          displayMode={isCanvas ? "canvas" : "frame"}
        />
      </div>

      <p className="mt-3 text-center text-sm text-neutral-600">
        {isCanvas
          ? "Stretched Canvas"
          : `${selectedSize} · ${selectedFrame.name}`}
      </p>
    </div>
  );
}
