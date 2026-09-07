import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type ProductCard = {
  id: string;
  title: string;
  image: string | null;
  referenceNo: string | null;
  size: string | null;
};

type CollectionSection = {
  slug: string;
  title: string;
  description: string;
  products: ProductCard[];
};

function normalizeImagePath(image: string | null | undefined): string | null {
  if (!image) return null;
  let val = image.trim();
  if (!val || val === "null" || val === "undefined") return null;

  // Clean trailing space before extension (e.g. "hope .png" -> "hope.png")
  val = val.replace(/\s+(\.[a-zA-Z0-9]+)$/, "$1");

  if (val.startsWith("/") || val.startsWith("http://") || val.startsWith("https://")) {
    return val;
  }
  return `/${val}`;
}

async function getDesignStoreData(): Promise<CollectionSection[]> {
  // 1. JEWEL TREE (3 items)
  const jewelTreeRows = await prisma.jewelTree.findMany({
    where: { collection: "jewel-tree" },
    orderBy: { slNo: "asc" },
    take: 3,
  });

  // 2. NATURE WINDOW (3 items from 'nature-window-collection')
  const natureWindowRows = await prisma.jewelTree.findMany({
    where: {
      collection: { in: ["nature-window-collection", "nature-window"] },
    },
    orderBy: { slNo: "asc" },
    take: 3,
  });

  // 3. LIVING LEGACY (all 2 items)
  const livingLegacyRows = await prisma.jewelTree.findMany({
    where: { collection: "living-legacy" },
    orderBy: { slNo: "asc" },
    take: 3,
  });

  const mapRows = (rows: any[]): ProductCard[] =>
    rows.map((row) => ({
      id: String(row.id),
      title: row.title?.trim() || "Untitled Product",
      image: normalizeImagePath(row.image),
      referenceNo: row.referenceNo?.trim() || null,
      size: row.size?.trim() || null,
    }));

  return [
    {
      slug: "jewel-tree",
      title: "Jewel Tree",
      description:
        "A curated collection of artistic botanical forms, sculptural trees and nature-inspired creations.",
      products: mapRows(jewelTreeRows),
    },
    {
      slug: "nature-window",
      title: "Nature Window",
      description:
        "A curated collection of distinctive decorative pieces, created to bring character, beauty and personality to your space.",
      products: mapRows(natureWindowRows),
    },
    {
      slug: "living-legacy",
      title: "Living Legacy",
      description:
        "A curated collection of distinctive decorative pieces, created to bring character, beauty and personality to your space.",
      products: mapRows(livingLegacyRows),
    },
  ];
}

export default async function DesignStorePage() {
  const collections = await getDesignStoreData();

  return (
    <main className="min-h-screen bg-[#FBF9F0] text-[#2B211C]">
      {/* HEADER WITH NAVBAR CLEARANCE */}
      <section className="max-w-[1500px] mx-auto px-6 sm:px-8 lg:px-10 pt-36 pb-16">
        <p className="text-[11px] font-semibold uppercase tracking-[4px] text-[#8B624B]">
          TCL Design Store
        </p>

        <h1 className="mt-5 font-serif text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-[#29231F]">
          Design Store
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-[#77716B]">
          Discover our curated collections of distinctive decorative pieces,
          created to bring character, beauty and personality to your space.
        </p>
      </section>

      {/* COLLECTIONS LIST */}
      <section className="max-w-[1500px] mx-auto px-6 sm:px-8 lg:px-10 pb-24">
        <div className="space-y-24">
          {collections.map((collection) => (
            <section key={collection.slug}>
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-10">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[4px] text-[#8B624B]">
                    TCL Design Store
                  </p>

                  <h2 className="mt-4 font-serif text-5xl sm:text-6xl font-semibold tracking-tight text-[#29231F]">
                    {collection.title}
                  </h2>

                  <p className="mt-4 max-w-3xl text-base leading-7 text-[#77716B]">
                    {collection.description}
                  </p>
                </div>

                <Link
                  href={`/design-store/collection/${encodeURIComponent(collection.slug)}`}
                  className="inline-flex shrink-0 items-center justify-center rounded-full border border-[#684633] px-8 py-4 text-[11px] font-semibold uppercase tracking-[2px] text-[#684633] transition hover:bg-[#684633] hover:text-white"
                >
                  View Collection →
                </Link>
              </div>

              {collection.products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                  {collection.products.map((product) => (
                    <Link
                      key={`${collection.slug}-${product.id}`}
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
                            No Image
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
                <div className="rounded-[22px] border border-dashed border-[#DCCFC1] bg-white/40 py-20 text-center text-[#A99B8E]">
                  Products coming soon.
                </div>
              )}
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}