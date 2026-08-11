"use client";

import { useState } from "react";
import Image from "next/image";

interface FramingSliderProps {
  rawImageUrl: string;
  roomMockupUrl: string;
}

export default function FramingSlider({
  rawImageUrl,
  roomMockupUrl,
}: FramingSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  return (
    <div className="space-y-3">
      <div className="text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-[#7B8F50]">
          Interactive Compare
        </span>
        <h4 className="font-serif text-2xl font-normal text-[#22211B]">
          Slide to See Print vs. Framed Room Context
        </h4>
      </div>

      <div className="relative aspect-[4/5] sm:aspect-[16/10] w-full overflow-hidden rounded-3xl border border-[#EAE3D2] shadow-xl select-none">
        {/* ROOM MOCKUP (BACKGROUND) */}
        <Image
          src={roomMockupUrl}
          alt="Framed in Room"
          fill
          className="object-cover"
        />

        {/* RAW PRINT (FOREGROUND CLIPPED BY SLIDER) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <Image
            src={rawImageUrl}
            alt="Raw Studio Print"
            fill
            className="object-cover"
          />
        </div>

        {/* SLIDER DIVIDER LINE & HANDLE */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] cursor-ew-resize"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-10 w-10 rounded-full bg-white text-[#22211B] shadow-lg flex items-center justify-center font-bold text-xs border border-[#EAE3D2]">
            ↔
          </div>
        </div>

        {/* RANGE INPUT CONTROLLER */}
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPosition}
          onChange={handleSliderChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
        />
      </div>
    </div>
  );
}