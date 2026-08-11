"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiFilter, FiGrid, FiArrowRight } from "react-icons/fi";

interface ArtistWithCount {
  id: string;
  name: string;
  specialty: string;
  bio: string | null;
  imageUrl: string | null;
  _count?: {
    products: number;
  };
}

const mediumFilters = [
  "All Mediums",
  "Painters",
  "Sculptors",
  "Photographers",
  "Digital & Media Artists",
];

const rosterFilters = [
  "All Roster",
  "Resident Masters",
  "Emerging Talents",
  "International Guest Artists",
];

export default function ArtistsFilterView({
  initialArtists = [],
}: {
  initialArtists?: ArtistWithCount[];
}) {
  const [selectedMedium, setSelectedMedium] = useState("All Mediums");
  const [selectedRoster, setSelectedRoster] = useState("All Roster");

  const filteredArtists = (initialArtists || []).filter((artist) => {
    if (selectedMedium === "All Mediums") return true;

    const query = selectedMedium.toLowerCase().replace(/s$/, "");
    const specialty = artist.specialty?.toLowerCase() || "";
    const bio = artist.bio?.toLowerCase() || "";

    return specialty.includes(query) || bio.includes(query);
  });

  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#22211B]">
      {/* HERO BANNER SECTION */}
      <section className="bg-[#FAF8F5] pt-16 pb-12 text-center border-b border-[#EAE3D2]/40">
        <div className="mx-auto max-w-4xl px-4 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#7B8F50]">
            TCL GALLERY ROSTER
          </span>
          <h1 className="font-serif text-5xl sm:text-6xl font-normal text-[#22211B] tracking-tight">
            Meet Our Artists
          </h1>
          <p className="text-base sm:text-lg text-[#55534E] leading-relaxed max-w-3xl mx-auto pt-1 font-sans">
            Discover visionary creators, resident gallery masters, and guest artists shaping contemporary visual arts. Explore their stories, active collections, and educational mentorships at Maison de Meraki.
          </p>
        </div>
      </section>

      {/* FILTER TOOLBAR */}
      <section className="bg-white border-b border-[#EAE3D2] py-4 shadow-sm">
        <div className="mx-auto max-w-[1700px] px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto max-w-full scrollbar-none">
            <span className="text-xs font-bold text-[#A39382] uppercase tracking-wider flex items-center gap-1 shrink-0 mr-2">
              <FiFilter /> MEDIUM:
            </span>
            {mediumFilters.map((medium) => (
              <button
                key={medium}
                onClick={() => setSelectedMedium(medium)}
                className={`whitespace-nowrap rounded-full px-5 py-2 text-xs font-semibold transition cursor-pointer shrink-0 ${
                  selectedMedium === medium
                    ? "bg-[#7B8F50] text-white shadow-sm"
                    : "bg-[#EFECE6] text-[#555] hover:bg-[#E2DDD3]"
                }`}
              >
                {medium}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <label htmlFor="roster-select" className="text-xs font-bold text-[#A39382] uppercase tracking-wider">
              ROSTER:
            </label>
            <select
              id="roster-select"
              value={selectedRoster}
              onChange={(e) => setSelectedRoster(e.target.value)}
              className="rounded-lg border border-[#E0D8C8] bg-white px-4 py-2 text-xs font-medium text-[#22211B] outline-none focus:border-[#7B8F50]"
            >
              {rosterFilters.map((roster) => (
                <option key={roster} value={roster}>
                  {roster}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* ARTISTS GRID */}
      <section className="py-12">
        <div className="mx-auto max-w-[1700px] px-4 sm:px-6 lg:px-8">
          {filteredArtists.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <p className="font-serif text-2xl text-[#22211B]">No artists match your criteria.</p>
              <button
                onClick={() => {
                  setSelectedMedium("All Mediums");
                  setSelectedRoster("All Roster");
                }}
                className="text-sm font-semibold text-[#7B8F50] underline cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArtists.map((artist) => {
                const isValidImageUrl =
                  typeof artist.imageUrl === "string" &&
                  (artist.imageUrl.startsWith("http://") ||
                    artist.imageUrl.startsWith("https://") ||
                    artist.imageUrl.startsWith("/"));

                return (
                  <Link
                    key={artist.id}
                    href={`/artist/${artist.id}`}
                    className="group block rounded-3xl border border-[#EAE3D2] bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer"
                  >
                    <div>
                      {/* Header Banner */}
                      <div className="relative h-48 bg-[#ECE9E2] overflow-hidden">
                        <div className="absolute top-4 left-4 z-10 rounded-full bg-white/90 backdrop-blur-md px-3.5 py-1 text-xs font-medium text-[#22211B]">
                          Resident Master
                        </div>
                        <div className="absolute top-4 right-4 z-10 rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-xs text-white flex items-center gap-1.5 font-medium">
                          <FiGrid /> {artist._count?.products ?? 2} Works
                        </div>
                      </div>

                      {/* Profile Details & Avatar */}
                      <div className="p-7 relative pt-0">
                        {/* Avatar */}
                        <div className="-mt-12 mb-5 relative h-20 w-20 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-md group-hover:scale-105 transition-transform duration-300 flex items-center justify-center font-serif text-2xl font-bold text-[#7B8F50]">
                          {isValidImageUrl ? (
                            <Image
                              src={artist.imageUrl!}
                              alt={artist.name || "Artist"}
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                          ) : (
                            artist.name?.charAt(0) ?? "A"
                          )}
                        </div>

                        <div className="space-y-3">
                          <h2 className="font-serif text-3xl font-bold text-[#22211B] group-hover:text-[#7B8F50] transition-colors leading-tight">
                            {artist.name}
                          </h2>

                          <p className="text-xs font-semibold text-[#7B8F50] tracking-wider">
                            {artist.specialty}
                          </p>

                          {artist.bio && (
                            <p className="text-sm text-[#55534E] line-clamp-3 pt-1 leading-relaxed">
                              {artist.bio}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Button Footer */}
                    <div className="p-7 pt-0 mt-4">
                      <div className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#F8F6F0] py-3.5 text-sm font-semibold text-[#22211B] transition group-hover:bg-[#7B8F50] group-hover:text-white">
                        View Profile & Artworks{" "}
                        <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}