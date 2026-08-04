"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MessageCircle } from "lucide-react";

const blogs = [
  {
    id: 1,
    image: "/images/blogs/blog1.jpg",
    date: "August 05, 2026",
    comments: "12 Comments",
    title: "The Art of Capturing Light in Landscape Photography",
    description:
      "Discover how natural light transforms ordinary landscapes into breathtaking works of art and learn techniques used by professional photographers.",
  },
  {
    id: 2,
    image: "/images/blogs/blog2.jpg",
    date: "August 02, 2026",
    comments: "18 Comments",
    title: "Choosing the Perfect Frame for Fine Art Photography",
    description:
      "A thoughtfully selected frame enhances the beauty of every photograph. Explore framing styles that complement modern and classic interiors.",
  },
  {
    id: 3,
    image: "/images/blogs/blog3.jpg",
    date: "July 28, 2026",
    comments: "24 Comments",
    title: "How Photography Brings Character to Your Living Space",
    description:
      "Fine art photography adds personality, emotion, and elegance to every room. Learn how to curate artwork for your home or office.",
  },
];

export default function BlogSection() {
  return (
    <section className="bg-[#FBF9F0] py-10">

      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}

        <div className="text-center mb-14">

          <div className="flex justify-center items-center gap-4 mb-4">

            <div className="w-16 h-px bg-[#4D3024]" />

            <span className="uppercase tracking-[4px] text-sm text-[#7C7469]">
              Photography Journal
            </span>

            <div className="w-16 h-px bg-[#4D3024]" />

          </div>

          <h2 className="font-heading text-[#22211B] text-4xl md:text-5xl lg:text-6xl">
            Blog Posts
          </h2>

        </div>

        {/* Blog Grid */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

          {blogs.map((blog) => (

            <article
              key={blog.id}
              className="bg-white overflow-hidden group"
            >

              {/* Image */}

              <div className="overflow-hidden">

                <Image
                  src={blog.image}
                  alt={blog.title}
                  width={700}
                  height={500}
                  className="w-full h-[280px] object-cover transition duration-700 group-hover:scale-110"
                />

              </div>

              {/* Content */}

              <div className="p-8">

                {/* Meta */}

                <div className="flex items-center gap-8 text-[#7C7469] text-sm mb-6">

                  <div className="flex items-center gap-2">
                    <CalendarDays size={16} />
                    {blog.date}
                  </div>

                  <div className="flex items-center gap-2">
                    <MessageCircle size={16} />
                    {blog.comments}
                  </div>

                </div>

                {/* Title */}

                <h3 className="font-heading text-[#22211B] text-3xl leading-tight mb-5 group-hover:text-[#C4A892] transition">

                  {blog.title}

                </h3>

                {/* Description */}

                <p className="text-[#7C7469] leading-8 mb-6">

                  {blog.description}

                </p>

                {/* Read More */}

                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-[#22211B] font-medium hover:text-[#C4A892] transition"
                >
                  Read More →
                </Link>

              </div>

            </article>

          ))}

        </div>

      </div>

    </section>
  );
}