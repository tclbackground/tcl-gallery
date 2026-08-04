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
      "Explore museum-quality photography and fine art collected from around the world.",
  },
  {
    icon: Smile,
    title: "Premium Craftsmanship",
    description:
      "Every artwork is professionally printed, framed, and carefully inspected before delivery.",
  },
  {
    icon: Star,
    title: "Trusted by Collectors",
    description:
      "Interior designers, collectors and art lovers choose TCL Gallery for exceptional quality.",
  },
  {
    icon: TrendingUp,
    title: "Curated Excellence",
    description:
      "Every artwork is thoughtfully selected to bring elegance and inspiration into your space.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="relative overflow-visible bg-[#0A0A0A] py-28">

      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-[#C7A852]/10 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="max-w-4xl mx-auto text-center mb-20">

          <p className="uppercase tracking-[8px] text-[#C7A852] text-sm font-semibold">
            WHY CHOOSE TCL GALLERY
          </p>

          <h2 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight">
            Bringing Fine Art Into Every Space
          </h2>

          <p className="mt-8 text-lg leading-8 text-gray-400">
            Discover museum-quality photography, premium paintings and
            handcrafted fine art designed to elevate homes, offices,
            hotels and luxury interiors.
          </p>

        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {features.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="
                  bg-[#151515]
                  border border-[#2B2B2B]
                  rounded-3xl
                  p-10
                  text-center
                  transition-all
                  duration-500
                  hover:-translate-y-2
                  hover:border-[#C7A852]
                  hover:shadow-[0_20px_45px_rgba(199,168,82,0.18)]
                "
              >
                <div className="flex justify-center mb-8">

                  <div className="w-16 h-16 rounded-full bg-[#C7A852]/10 flex items-center justify-center">

                    <Icon
                      className="text-[#C7A852]"
                      size={30}
                      strokeWidth={1.6}
                    />

                  </div>

                </div>

                <h3 className="text-2xl font-semibold text-white mb-4">
                  {item.title}
                </h3>

                <p className="text-gray-400 leading-8">
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