"use client";

import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

export default function MaisonDeMeraki() {
  return (
    <section className="bg-[#FBF9F0] py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">

        <div className="max-w-4xl">

          <p className="mb-4 text-sm font-semibold uppercase tracking-[4px] text-[#7B8F50]">
            Maison de Meraki
          </p>

          <h2 className="font-serif text-4xl font-semibold leading-tight text-[#222] md:text-6xl">
            Where Passion Meets Creativity
          </h2>

          <p className="mt-8 text-lg leading-9 text-gray-600">
            Maison de Meraki is the creative learning centre of TCL Gallery,
            dedicated to inspiring artists of all ages. We provide a welcoming
            environment where creativity flourishes through hands-on learning,
            artistic exploration, and expert guidance.
          </p>

          <p className="mt-6 text-lg leading-9 text-gray-600">
            Whether you are a beginner discovering the joy of art or an
            experienced learner refining your skills, our carefully designed
            programmes encourage confidence, imagination, and personal
            expression in every creative journey.
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-2">

            <div>
              <h3 className="mb-3 font-serif text-2xl font-semibold text-[#222]">
                Our Programmes
              </h3>

              <ul className="space-y-3 text-gray-600">
                <li>• Drawing & Sketching</li>
                <li>• Acrylic & Watercolour Painting</li>
                <li>• Oil Painting</li>
                <li>• Portrait & Landscape Art</li>
                <li>• Mixed Media</li>
                <li>• Canvas Painting</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3 font-serif text-2xl font-semibold text-[#222]">
                Why Learn With Us
              </h3>

              <ul className="space-y-3 text-gray-600">
                <li>• Professional Art Mentors</li>
                <li>• Creative Studio Environment</li>
                <li>• Small Batch Learning</li>
                <li>• Kids & Adult Classes</li>
                <li>• Weekend Workshops</li>
                <li>• Portfolio Development</li>
              </ul>
            </div>

          </div>

          <Link
            href="/maison-de-meraki"
            className="mt-12 inline-flex items-center gap-3 rounded-full bg-[#7B8F50] px-8 py-4 text-white transition hover:bg-black"
          >
            Explore Maison de Meraki
            <FiArrowRight size={20} />
          </Link>

        </div>

      </div>
    </section>
  );
}