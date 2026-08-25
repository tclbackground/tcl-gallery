import Image from "next/image";
import Link from "next/link";

type Collection = {
  id: number;
  number: string;
  title: string;
  description: string;
  image: string;
  href: string;
  featured: boolean;
};

const collections: Collection[] = [
  {
    id: 1,
    number: "01",
    title: "Fine Art Photography",
    description:
      "A curated selection of photographic artworks capturing extraordinary places, moments and stories.",
    image: "/images/collections/fine-art-photography.jpg",
    href: "/collections/fine-art-photography",
    featured: true,
  },
  {
    id: 2,
    number: "02",
    title: "Indian & Heritage",
    description:
      "A celebration of India's culture, architecture, traditions and timeless visual heritage.",
    image: "/images/collections/indian-heritage.jpg",
    href: "/collections/indian-heritage",
    featured: false,
  },
  {
    id: 3,
    number: "03",
    title: "Abstract & Contemporary",
    description:
      "Modern artworks exploring colour, form, texture and contemporary visual expression.",
    image: "/images/collections/abstract-contemporary.jpg",
    href: "/collections/abstract-contemporary",
    featured: false,
  },
  {
    id: 4,
    number: "04",
    title: "Nature & Landscapes",
    description:
      "Discover landscapes, natural beauty and quiet moments captured from around the world.",
    image: "/images/collections/nature-landscapes.jpg",
    href: "/collections/nature-landscapes",
    featured: false,
  },
  {
    id: 5,
    number: "05",
    title: "Design Store",
    description:
      "Thoughtfully designed artworks and collections created to bring distinctive character into your space.",
    image: "/images/collections/design-store.jpg",
    href: "/design-store",
    featured: false,
  },
];

function CollectionCard({ collection }: { collection: Collection }) {
  return (
    <Link
      href={collection.href}
      className={`group relative block w-full overflow-hidden bg-[#1A202C] ${
        collection.featured
          ? "min-h-[480px] sm:min-h-[560px] lg:min-h-[620px]"
          : "min-h-[400px] sm:min-h-[440px] lg:min-h-[500px]"
      }`}
    >
      {/* IMAGE */}
      <Image
        src={collection.image}
        alt={collection.title}
        fill
        sizes={
          collection.featured
            ? "(max-width: 1024px) 100vw, 1200px"
            : "(max-width: 768px) 100vw, 50vw"
        }
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
      />

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/5 transition-colors duration-700 ease-out group-hover:from-black/95 group-hover:via-black/50" />

      {/* CONTENT */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-7 sm:p-10 lg:p-12">
        {/* NUMBER */}
        <span className="mb-5 block text-[11px] font-medium tracking-[0.35em] text-white/70">
          {collection.number}
        </span>

        {/* TITLE */}
        <h3
          className={`font-heading text-white transition-transform duration-500 ease-out group-hover:-translate-y-2 ${
            collection.featured
              ? "text-3xl sm:text-5xl lg:text-6xl"
              : "text-2xl sm:text-3xl lg:text-4xl"
          }`}
        >
          {collection.title}
        </h3>

        {/* DESCRIPTION */}
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/75 opacity-90 transition-all duration-500 ease-out sm:text-base lg:translate-y-3 lg:opacity-70 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
          {collection.description}
        </p>

        {/* EXPLORE LINK */}
        <div className="mt-6 inline-flex items-center gap-3 text-[10px] font-semibold tracking-[0.22em] text-white/85 transition-colors duration-500 group-hover:text-white sm:text-xs">
          <span>EXPLORE COLLECTION</span>

          <span className="text-base transition-transform duration-500 ease-out group-hover:translate-x-2">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function FeaturedCollections() {
  const featuredCollection = collections.find(
    (collection) => collection.featured
  );

  const remainingCollections = collections.filter(
    (collection) => !collection.featured
  );

  return (
    <section className="w-full overflow-hidden bg-[#F5F3EE] px-5 py-20 sm:px-8 sm:py-28 lg:px-12 lg:py-36">
      <div className="mx-auto max-w-[1500px]">
        {/* ================= HEADER ================= */}
        <div className="mx-auto mb-16 max-w-3xl text-center sm:mb-20 lg:mb-24">
          <p className="mb-5 text-[10px] font-semibold tracking-[0.5em] text-[#5B6A7D] sm:text-xs">
            TCL GALLERY
          </p>

          <h2 className="font-heading text-4xl font-medium text-[#1A202C] sm:text-5xl lg:text-6xl">
            Featured Collections
          </h2>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-[#5B6570] sm:text-lg">
            Explore curated collections of photography, art and design,
            selected to bring character, beauty and meaning into every space.
          </p>
        </div>

        {/* ================= FEATURED COLLECTION ================= */}
        {featuredCollection && (
          <div className="mb-5 sm:mb-7 lg:mb-8">
            <CollectionCard collection={featuredCollection} />
          </div>
        )}

        {/* ================= EDITORIAL GRID ================= */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-7 lg:gap-8">
          {remainingCollections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
            />
          ))}
        </div>
      </div>
    </section>
  );
}