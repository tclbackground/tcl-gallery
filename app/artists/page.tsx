"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiArrowRight,
  FiFilter,
  FiGrid,
  FiMapPin,
  FiAward,
} from "react-icons/fi";

// Artists Dataset
const artistsData = [
  {
    id: "1",
    name: "Helena Vance",
    slug: "helena-vance",
    medium: "Painters",
    roster: "Resident Masters",
    location: "Florence, Italy",
    bio: "Specializing in large-scale expressive oil paintings exploring memory, architectural form, and light interplay.",
    featuredWork: "Ethereal Harmony No. 4",
    totalArtworks: 18,
    image: "/images/artists/helena-vance.jpg", // Replace with artist photo
    artworkPreview: "/images/artworks/helena-work.jpg", // Replace with featured artwork preview
  },
  {
    id: "2",
    name: "Marcus Vance",
    slug: "marcus-vance",
    medium: "Sculptors",
    roster: "Resident Masters",
    location: "Kyoto, Japan",
    bio: "Bronze and ceramic sculptor merging traditional Asian ceramic techniques with modern minimalist structural forms.",
    featuredWork: "Monolith in Bronze",
    totalArtworks: 12,
    image: "/images/artists/marcus-vance.jpg",
    artworkPreview: "/images/artworks/marcus-work.jpg",
  },
  {
    id: "3",
    name: "Aria Chen",
    slug: "aria-chen",
    medium: "Photographers",
    roster: "Emerging Talents",
    location: "Vancouver, Canada",
    bio: "Fine art photographer capturing atmospheric landscapes and high-contrast architectural solitude.",
    featuredWork: "Solitude in Dawn",
    totalArtworks: 9,
    image: "/images/artists/aria-chen.jpg",
    artworkPreview: "/images/artworks/aria-work.jpg",
  },
  {
    id: "4",
    name: "Kaelen Voss",
    slug: "kaelen-voss",
    medium: "Digital & Media Artists",
    roster: "International Guest Artists",
    location: "Berlin, Germany",
    bio: "Generative artist working at the intersection of algorithmic structures, interactive light, and digital canvas prints.",
    featuredWork: "Digital Nebula II",
    totalArtworks: 14,
    image: "/images/artists/kaelen-voss.jpg",
    artworkPreview: "/images/artworks/kaelen-work.jpg",
  },
  {
    id: "5",
    name: "Elena Rostova",
    slug: "elena-rostova",
    medium: "Painters",
    roster: "Resident Masters",
    location: "Paris, France",
    bio: "Classical portraitist and fine art educator leading masterclasses at Maison de Meraki Art Learning Center.",
    featuredWork: "Study of Shadow and Silk",
    totalArtworks: 22,
    image: "/images/artists/elena-rostova.jpg",
    artworkPreview: "/images/artworks/elena-work.jpg",
  },
  {
    id: "6",
    name: "Julian Thorne",
    slug: "julian-thorne",
    medium: "Sculptors",
    roster: "Emerging Talents",
    location: "London, UK",
    bio: "Reclaimed metal sculptor crafting organic fluid dynamics out of rigid industrial steel and brass.",
    featuredWork: "Kinetic Drift",
    totalArtworks: 7,
    image: "/images/artists/julian-thorne.jpg",
    artworkPreview: "/images/artworks/julian-work.jpg",
  },
];

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

export default function ArtistsPage() {
  const [selectedMedium, setSelectedMedium] = useState("All Mediums");
  const [selectedRoster, setSelectedRoster] = useState("All Roster");

  // Filter Logic
  const filteredArtists = artistsData.filter((artist) => {
    const matchesMedium =
      selectedMedium === "All Mediums" || artist.medium === selectedMedium;
    const matchesRoster =
      selectedRoster === "All Roster" || artist.roster === selectedRoster;
    return matchesMedium && matchesRoster;
  });

  return (
    <main className="min-h-screen bg-white">
      {/* ================= HERO HEADER ================= */}
      <section className="bg-[#fcfbf9] py-16 lg:py-20 border-b border-gray-100">
        <div className="mx-auto max-w-[1800px] px-4 lg:px-8 text-center max-w-4xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#7B8F50]">
            TCL Gallery Roster
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mt-2">
            Meet Our Artists
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            Discover visionary creators, resident gallery masters, and guest artists shaping contemporary visual arts. Explore their stories, active collections, and educational mentorships at Maison de Meraki.
          </p>
        </div>
      </section>

      {/* ================= FILTER TOOLBAR ================= */}
      <section className="sticky top-[60px] lg:top-[74px] z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 py-4">
        <div className="mx-auto max-w-[1800px] px-4 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Medium Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1 mr-2">
              <FiFilter /> Medium:
            </span>
            {mediumFilters.map((medium) => (
              <button
                key={medium}
                onClick={() => setSelectedMedium(medium)}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium transition ${
                  selectedMedium === medium
                    ? "bg-[#7B8F50] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {medium}
              </button>
            ))}
          </div>

          {/* Roster Filter Dropdown */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <label htmlFor="roster-select" className="text-xs font-semibold text-gray-400 uppercase">
              Roster:
            </label>
            <select
              id="roster-select"
              value={selectedRoster}
              onChange={(e) => setSelectedRoster(e.target.value)}
              className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-800 outline-none focus:border-[#7B8F50]"
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

      {/* ================= ARTISTS GRID ================= */}
      <section className="py-16">
        <div className="mx-auto max-w-[1800px] px-4 lg:px-8">
          
          {filteredArtists.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <p className="font-serif text-2xl text-gray-800">No artists match your criteria.</p>
              <button
                onClick={() => {
                  setSelectedMedium("All Mediums");
                  setSelectedRoster("All Roster");
                }}
                className="text-sm font-semibold text-[#7B8F50] underline"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArtists.map((artist) => (
                <div
                  key={artist.id}
                  className="group rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Header Image Area / Artwork Preview Banner */}
                    <div className="relative h-48 bg-gray-100 overflow-hidden">
                      <div className="absolute top-4 left-4 z-10 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-xs font-semibold text-[#7B8F50]">
                        {artist.roster}
                      </div>
                      <div className="absolute top-4 right-4 z-10 rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-xs text-white flex items-center gap-1">
                        <FiGrid /> {artist.totalArtworks} Works
                      </div>
                    </div>

                    {/* Artist Avatar & Profile Body */}
                    <div className="p-6 relative pt-0">
                      
                      {/* Avatar Placeholder Overlay */}
                      <div className="-mt-12 mb-4 relative h-20 w-20 rounded-full border-4 border-white bg-gray-300 overflow-hidden shadow-md">
                        {/* Replace with actual Next.js Image component when src is available */}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h2 className="font-serif text-2xl font-bold text-gray-900 group-hover:text-[#7B8F50] transition">
                            {artist.name}
                          </h2>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
                          <span className="flex items-center gap-1">
                            <FiMapPin /> {artist.location}
                          </span>
                          <span>•</span>
                          <span className="text-[#7B8F50] font-semibold">{artist.medium}</span>
                        </div>

                        <p className="text-sm text-gray-600 line-clamp-3 pt-2 leading-relaxed">
                          {artist.bio}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Action */}
                  <div className="p-6 pt-0 border-t border-gray-100 mt-4">
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-3 pt-4">
                      <span>Featured Work:</span>
                      <span className="font-medium text-gray-800 italic">{artist.featuredWork}</span>
                    </div>

                    <Link
                      href={`/artists/${artist.slug}`}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-50 py-3 text-sm font-semibold text-gray-800 transition hover:bg-[#7B8F50] hover:text-white"
                    >
                      View Profile & Artworks <FiArrowRight />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* ================= ARTIST SUBMISSION BANNER ================= */}
      <section className="bg-[#fcfbf9] border-t border-gray-200 py-16">
        <div className="mx-auto max-w-[1800px] px-4 lg:px-8 text-center max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#7B8F50]/10 px-4 py-1 text-xs font-semibold text-[#7B8F50]">
            <FiAward /> Submissions & Representation
          </div>
          <h2 className="font-serif text-3xl font-bold text-gray-900">
            Are You an Artist Looking for Representation?
          </h2>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            TCL Gallery and Maison de Meraki review portfolio submissions semi-annually. We welcome original painters, sculptors, and digital artists into our global gallery network and teaching faculty.
          </p>
          <div className="pt-2">
            <Link
              href="/artists/apply"
              className="inline-flex items-center gap-2 rounded-full bg-[#7B8F50] px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-[#687a41]"
            >
              Submit Portfolio <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}