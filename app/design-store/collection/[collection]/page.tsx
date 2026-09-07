import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ collection: string }> | { collection: string };
};

type ProductCard = {
  id: string;
  title: string;
  image: string | null;
  referenceNo: string | null;
  size: string | null;
};

function normalizePath(img: string | null | undefined): string | null {
  if (!img) return null;
  let val = img.trim();
  if (!val || val === "null" || val === "undefined") return null;
  val = val.replace(/\s+(\.[a-zA-Z0-9]+)$/, "$1");
  if (val.startsWith("/") || val.startsWith("http://") || val.startsWith("https://")) {
    return val;
  }
  return `/${val}`;
}

const COLLECTION_MAP: Record<
  string,
  { title: string; filterValues: string[]; description: string }
> = {
  "jewel-tree": {
    title: "Jewel Tree",
    filterValues: ["jewel-tree"],
    description:
      "A curated collection of artistic botanical forms, sculptural trees and nature-inspired creations.",
  },
  "nature-window": {
    title: "Nature Window",
    filterValues: ["nature-window", "nature-window-collection"],
    description:
      "A curated collection of distinctive decorative pieces, created to bring character, beauty and personality to your space.",
  },
  "living-legacy": {
    title: "Living Legacy",
    filterValues: ["living-legacy"],
    description:
      "A timeless series of sculptural artworks embodying tradition, legacy, and contemporary design.",
  },
};

async function getCollectionData(collectionSlug: string) {
  const slug = decodeURIComponent(collectionSlug).toLowerCase().trim();
  const config = COLLECTION_MAP[slug];

  if (!config) return null;

  const rows = await prisma.jewelTree.findMany({
    where: {
      collection: { in: config.filterValues },
    },
    orderBy: {
      slNo: "asc",
    },
  });

  const products: ProductCard[] = rows.map((item) => ({
    id: String(item.id),
    title: item.title?.trim() || "Untitled Product",
    image: normalizePath(item.image),
    referenceNo: item.referenceNo?.trim() || null,
    size: item.size?.trim() || null,
  }));

  return {
    title: config.title,
    slug,
    description: config.description,
    products,
  };
}

export default async function CollectionPage({ params }: Props) {
  const resolvedParams = await Promise.resolve(params);
  const collection = await getCollectionData(resolvedParams.collection);

  if (!collection) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#FBF9F0] text-[#2B211C]">
      {/* HEADER WITH NAVBAR CLEARANCE */}
      <section className="max-w-[1500px] mx-auto px-6 sm:px-8 lg:px-10 pt-36 pb-16">
        <nav className="flex items-center gap-2 text-[11px] uppercase tracking-[2px] text-[#8B624B] mb-6">
          <Link href="/design-store" className="hover:underline">
            Design Store
          </Link>
          <span>/</span>
          <span className="text-[#2B211C] font-semibold">{collection.title}</span>
        </nav>

        <p className="text-[11px] font-semibold uppercase tracking-[4px] text-[#8B624B]">
          Collection
        </p>

        <div className="mt-4 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-[#29231F]">
              {collection.title}
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-[#77716B]">
              {collection.description}
            </p>
          </div>

          <span className="text-xs font-semibold tracking-[2px] text-[#8B624B] uppercase shrink-0">
            {collection.products.length} {collection.products.length === 1 ? "Product" : "Products"}
          </span>
        </div>
      </section>

      {/* ALL PRODUCTS GRID */}
      <section className="max-w-[1500px] mx-auto px-6 sm:px-8 lg:px-10 pb-28">
        {collection.products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {collection.products.map((product) => (
              <Link
                key={product.id}
                href={`/design-store/${encodeURIComponent(product.id)}`}
                className="group block overflow-hidden rounded-[22px] border border-[#E6DDD2] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(70,45,30,0.10)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#F2EDE5]">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.title}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-sm text-[#B5A99D]">
                      No Image Available
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="font-serif text-2xl font-semibold leading-tight text-[#29231F]">
                    {product.title}
                  </h3>

                  {product.referenceNo && (
                    <p className="mt-4 text-xs text-[#9A9189]">
                      Ref: {product.referenceNo}
                    </p>
                  )}

                  {product.size && (
                    <p className="mt-2 text-xs text-[#9A9189]">
                      Size: {product.size}
                    </p>
                  )}

                  <div className="mt-6 inline-flex items-center justify-center rounded-full bg-[#684633] px-6 py-3 text-[11px] font-semibold uppercase tracking-[1.5px] text-white transition group-hover:bg-[#4F3325]">
                    Enquire Now
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-[22px] border border-dashed border-[#DCCFC1] bg-white/40 py-24 text-center text-[#A99B8E]">
            No products found in this collection.
          </div>
        )}
      </section>
    </main>
  );
}