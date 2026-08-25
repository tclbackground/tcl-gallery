import Image from "next/image";
import type { FrameOption } from "./ProductConfigurator";

type FrameSelectorProps = {
  frames: FrameOption[];
  selectedFrame: string;
  onSelect: (frameId: string) => void;
};

export default function FrameSelector({
  frames,
  selectedFrame,
  onSelect,
}: FrameSelectorProps) {
  return (
    <div className="mt-12">
      <h2 className="text-xs font-medium tracking-[0.25em] text-black/70">
        FRAME STYLE
      </h2>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {frames.map((frame) => {
          const isSelected =
            selectedFrame === frame.id;

          return (
            <button
              key={frame.id}
              type="button"
              onClick={() => onSelect(frame.id)}
              className={`group relative min-h-[150px] border p-3 text-left transition-all duration-300 ${
                isSelected
                  ? "border-[#151515] bg-[#EEECE6]"
                  : "border-black/10 bg-white hover:border-black/50"
              }`}
            >
              {/* FRAME PREVIEW */}

              <div className="relative flex h-[78px] items-center justify-center overflow-hidden bg-[#E9E6DF]">
                {frame.previewImage ? (
                  <Image
                    src={frame.previewImage}
                    alt={frame.name}
                    fill
                    className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div
                    className="h-12 w-16 border-[8px]"
                    style={{
                      borderColor: frame.frameColor,
                    }}
                  />
                )}
              </div>

              {/* NAME */}

              <p className="mt-3 text-[10px] font-medium tracking-wide text-black/80">
                {frame.name}
              </p>

              {/* PRICE */}

              {frame.additionalPrice > 0 && (
                <p className="mt-1 text-[10px] text-black/45">
                  + ₹
                  {frame.additionalPrice.toLocaleString(
                    "en-IN"
                  )}
                </p>
              )}

              {/* SELECTED */}

              {isSelected && (
                <span className="absolute right-2 top-2 bg-[#151515] px-2 py-1 text-[8px] tracking-[0.12em] text-white">
                  SELECTED
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}