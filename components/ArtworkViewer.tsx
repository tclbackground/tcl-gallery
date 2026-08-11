"use client";

import { useState } from "react";
import Image from "next/image";
import { FiEye, FiMaximize2, FiImage } from "react-icons/fi";

interface ArtworkViewerProps {
  title: string;
  rawImageUrl: string;
  roomMockupUrl: string;
}

export default function ArtworkViewer({
  title,
  rawImageUrl,
  roomMockupUrl,
}: ArtworkViewerProps) {
  const [activeTab, setActiveTab] = useState<"room" | "artwork">("room");
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* TOP VIEW MODE TOGGLE BUTTONS */}
      <div className="flex items-center justify-between border-b border-[#EAE3D2] pb-3">
        <h3 className="font-serif text-xl font-bold text-[#22211B]">{title}</h3>
        
        <div className="inline-flex rounded-full bg-[#EFECE6] p-1 border border-[#E0D8C8]">
          <button
            onClick={() => setActiveTab("room")}
            className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition cursor-pointer ${
              activeTab === "room"
                ? "bg-[#7B8F50] text-white shadow-sm"
                : "text-[#555] hover:text-[#22211B]"
            }`}
          >
            <FiEye className="text-sm" /> 3D Room View
          </button>
          
          <button
            onClick={() => setActiveTab("artwork")}
            className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition cursor-pointer ${
              activeTab === "artwork"
                ? "bg-[#7B8F50] text-white shadow-sm"
                : "text-[#555] hover:text-[#22211B]"
            }`}
          >
            <FiImage className="text-sm" /> Studio Print View
          </button>
        </div>
      </div>

      {/* MAIN DISPLAY CANVAS */}
      <div className="relative aspect-[4/5] sm:aspect-[16/10] w-full overflow-hidden rounded-3xl border border-[#EAE3D2] bg-[#FAF8F5] shadow-lg group">
        <Image
          src={activeTab === "room" ? roomMockupUrl : rawImageUrl}
          alt={title}
          fill
          sizes="(max-width: 1200px) 100vw, 1200px"
          className={`object-cover transition-transform duration-700 ease-out ${
            isZoomed ? "scale-125 cursor-zoom-out" : "group-hover:scale-105 cursor-zoom-in"
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
          priority
        />

        {/* FLOATING ACTION OVERLAY */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-md px-4 py-2 text-xs font-semibold text-[#22211B] shadow-md pointer-events-none">
          <FiMaximize2 className="text-[#7B8F50]" />
          <span>{isZoomed ? "Click to Reset" : "Click to Zoom Details"}</span>
        </div>
      </div>
    </div>
  );
}