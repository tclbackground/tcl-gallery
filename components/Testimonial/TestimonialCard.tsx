"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  image: string;
  rating: number;
  review: string;
}

interface Props {
  testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md p-8 text-center hover:border-[#C8A24D] duration-300"
    >
      <Image
        src={testimonial.image}
        alt={testimonial.name}
        width={90}
        height={90}
        className="rounded-full mx-auto border-4 border-[#C8A24D]"
      />

      <div className="flex justify-center mt-5 gap-1">
        {[...Array(testimonial.rating)].map((_, index) => (
          <Star
            key={index}
            size={18}
            className="fill-yellow-400 text-yellow-400"
          />
        ))}
      </div>

      <p className="text-gray-300 italic mt-6 leading-8">
        "{testimonial.review}"
      </p>

      <h3 className="text-black text-xl font-semibold mt-8">
        {testimonial.name}
      </h3>

      <p className="text-[#C8A24D]">
        {testimonial.role}
      </p>
    </motion.div>
  );
}