import Image from "next/image";
import Link from "next/link";

const collections = [
  {
    title: "Photography",
    description:
      "Museum-quality landscape, wildlife and travel photography.",
    image: "/images/3.png",
  },
  {
    title: "Paintings",
    description:
      "Original paintings curated from talented artists.",
    image: "/images/collections/paintings.jpg",
  },
  {
    title: "Fine Art Prints",
    description:
      "Premium archival prints crafted for timeless interiors.",
    image: "/images/collections/fine-art.jpg",
  },
  {
    title: "Jewel Tree",
    description:
      "Signature handcrafted décor inspired by nature.",
    image: "/images/collections/jewel-tree.jpg",
  },
];

export default function BrowseCollections() {
  return (
    <section className="bg-[#FBF9F0] py-28">

      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}

        <div className="text-center max-w-4xl mx-auto mb-20">

          <p className="uppercase tracking-[8px] text-[#4D3024] text-sm font-semibold mb-5">
            EXPLORE
          </p>

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-[#22211B] leading-tight">
            Browse Collections
          </h2>

          <p className="mt-8 text-xl leading-9 text-[#4D3024] max-w-3xl mx-auto">
            Discover museum-quality photography, paintings,
            fine art prints and handcrafted collections
            curated to elevate every interior.
          </p>

        </div>

        {/* Grid */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Featured Collection */}

          <Link
            href="/collections/photography"
            className="
              lg:col-span-2
              relative
              h-[650px]
              overflow-hidden
              rounded-[32px]
              group
              shadow-lg
            "
          >
            <Image
              src={collections[0].image}
              alt={collections[0].title}
              fill
              className="
                object-cover
                transition-transform
                duration-700
                group-hover:scale-105
              "
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute bottom-12 left-12 max-w-lg">

              <p className="uppercase tracking-[5px] text-[#C4A892] text-sm mb-4">
                Featured Collection
              </p>

              <h3 className="text-5xl font-light text-white mb-5">
                {collections[0].title}
              </h3>

              <p className="text-white/90 leading-8 mb-7">
                {collections[0].description}
              </p>

              <span className="inline-flex items-center gap-2 text-[#C4A892] uppercase tracking-[2px] font-medium">
                Explore Collection →
              </span>

            </div>

          </Link>

          {/* Right Side */}

          <div className="flex flex-col gap-8">

            {collections.slice(1).map((item) => (

              <Link
                key={item.title}
                href="#"
                className="
                  relative
                  h-[198px]
                  overflow-hidden
                  rounded-[28px]
                  group
                  shadow-md
                "
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="
                    object-cover
                    transition-transform
                    duration-700
                    group-hover:scale-105
                  "
                />

                <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-end p-8">

                  <h3 className="text-3xl font-light text-white mb-2">
                    {item.title}
                  </h3>

                  <p className="text-white/80 leading-7 mb-3">
                    {item.description}
                  </p>

                  <span className="text-[#C4A892] uppercase tracking-[2px] text-sm font-medium">
                    Explore →
                  </span>

                </div>

              </Link>

            ))}

          </div>

        </div>

      </div>

    </section>
  );
}