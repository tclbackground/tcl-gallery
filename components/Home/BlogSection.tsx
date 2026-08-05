"use client";

import Link from "next/link";
import { FiArrowRight, FiCalendar, FiUser, FiClock } from "react-icons/fi";

// Sample Blog Data tailored for TCL Gallery & Maison de Meraki
const blogPosts = [
  {
    id: "1",
    title: "Exploring Materiality: Bronze & Clay in Modern Sculpture",
    excerpt:
      "An in-depth conversation with resident sculptor Marcus Vance on fusing traditional Asian ceramic arts with contemporary structural forms.",
    category: "Artist Spotlight",
    author: "TCL Editorial",
    date: "Aug 2, 2026",
    readTime: "5 min read",
    slug: "exploring-materiality-bronze-and-clay",
    image: "/images/blog/blog-1.jpg", // Replace with your image
  },
  {
    id: "2",
    title: "Inside Maison de Meraki: The Art of Layering Oil Glazes",
    excerpt:
      "Masterclass instructor Elena Rostova breaks down classical oil glazing techniques taught in our upcoming summer intensive workshop.",
    category: "Maison de Meraki",
    author: "Elena Rostova",
    date: "Jul 28, 2026",
    readTime: "7 min read",
    slug: "inside-maison-de-meraki-oil-glazes",
    image: "/images/blog/blog-2.jpg", // Replace with your image
  },
  {
    id: "3",
    title: "Curating Fine Art for Minimalist Living Spaces",
    excerpt:
      "Key principles on selecting focal statement pieces, scale proportion, and custom framing tones for modern architectural interiors.",
    category: "Art Advisory",
    author: "Curatorial Team",
    date: "Jul 15, 2026",
    readTime: "4 min read",
    slug: "curating-fine-art-for-minimalist-spaces",
    image: "/images/blog/blog-3.jpg", // Replace with your image
  },
];

export default function BlogSection() {
  return (
    <section className="bg-[#FBF9F0] py-20 border-t border-[#C4A892]/30 text-[#22211B]">
      <div className="mx-auto max-w-[1800px] px-4 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#C4A892]/30 pb-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#4D3024]">
              Journal & Insights
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#22211B]">
              Latest from the Gallery
            </h2>
          </div>
          <Link
            href="/inspiration"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 font-semibold text-[#4D3024] hover:text-[#22211B] transition hover:underline text-sm"
          >
            View All Articles <FiArrowRight />
          </Link>
        </div>

        {/* Blog Post Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="group rounded-2xl border border-[#C4A892]/40 bg-[#FBF9F0] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image Placeholder Banner */}
                <div className="relative h-60 bg-[#E8DBCA]/50 overflow-hidden">
                  <span className="absolute top-4 left-4 z-10 rounded-full bg-[#4D3024] px-3.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#FBF9F0]">
                    {post.category}
                  </span>
                </div>

                {/* Content Area */}
                <div className="p-6 space-y-3">
                  {/* Meta Details */}
                  <div className="flex items-center gap-4 text-xs text-[#22211B]/60 font-medium">
                    <span className="flex items-center gap-1">
                      <FiCalendar className="text-[#4D3024]" /> {post.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <FiClock className="text-[#4D3024]" /> {post.readTime}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-xl font-bold text-[#22211B] group-hover:text-[#4D3024] transition leading-snug">
                    <Link href={`/inspiration/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>

                  {/* Excerpt */}
                  <p className="text-sm text-[#22211B]/75 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-6 pt-0 border-t border-[#C4A892]/20 mt-4 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-[#22211B]/70">
                  <FiUser className="text-[#4D3024]" /> {post.author}
                </span>

                <Link
                  href={`/inspiration/${post.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4D3024] group-hover:translate-x-1 transition-transform"
                >
                  Read More <FiArrowRight />
                </Link>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}