"use client";

import { motion } from "framer-motion";
import TestimonialCard from "./TestimonialCard";
import { testimonials } from "./testimonialData";

export default function TestimonialSection() {
  return (
    <section className="py-5 bg-[#FBF9F0]">

      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >

          <p className="uppercase tracking-[6px] text-[#8A6A3D] font-semibold">

            Testimonials

          </p>

          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-[#22211B] mt-5 leading-tight">

            What Our Clients Say

          </h2>

          <p className="text-[#6B6358] mt-6 max-w-3xl mx-auto text-lg leading-8">

            Hear from collectors, architects and interior designers who have
            transformed their homes and workspaces with museum-quality
            photography and fine art from TCL Gallery.

          </p>

        </motion.div>

        {/* Cards */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

          {testimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
            />
          ))}

        </div>

      </div>

    </section>
  );
}