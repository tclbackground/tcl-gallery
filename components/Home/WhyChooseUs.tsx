"use client";

import {
  Globe,
  Smile,
  Star,
  TrendingUp,
} from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Global Collection",
    description:
      "Explore museum-quality photography and fine art from talented artists around the world.",
  },
  {
    icon: Smile,
    title: "Satisfaction Guaranteed",
    description:
      "Every artwork is carefully inspected and securely packed before delivery for complete peace of mind.",
  },
  {
    icon: Star,
    title: "Premium Quality",
    description:
      "Museum-grade printing, handcrafted framing and exceptional attention to every detail.",
  },
  {
    icon: TrendingUp,
    title: "Support Artists",
    description:
      "Every purchase directly supports talented photographers and artists while growing creative communities.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-[#FBF9F0] py-24">

      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}

        <div className="max-w-4xl mx-auto text-center">

          <h2 className="font-heading text-4xl md:text-5xl text-[#22211B]">

            Why Choose TCL Gallery?

          </h2>

          <p className="mt-6 text-lg leading-8 text-[#6B6358]">

            TCL Gallery offers museum-quality photography, premium paintings,
            handcrafted framing and exceptional customer service to help you
            transform every interior with timeless artwork.

          </p>

        </div>

        {/* Cards */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">

          {features.map((item, index) => {

            const Icon = item.icon;

            return (

              <div
                key={index}
                className="
                  bg-white
                  rounded-lg
                  p-10
                  text-center
                  border
                  border-[#EFE7DB]
                  transition-all
                  duration-300
                  hover:shadow-xl
                  hover:-translate-y-2
                "
              >

                <div className="flex justify-center">

                  <Icon
                    size={36}
                    strokeWidth={1.5}
                    className="text-[#22211B]"
                  />

                </div>

                <h3 className="mt-8 text-2xl font-medium text-[#22211B]">

                  {item.title}

                </h3>

                <p className="mt-5 text-[#6B6358] leading-8">

                  {item.description}

                </p>

              </div>

            );

          })}

        </div>

      </div>

    </section>
  );
}