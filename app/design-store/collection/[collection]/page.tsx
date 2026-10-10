
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = {
  params: Promise<{ collection: string }>;
};

type ProductCard = {
  id: string;
  title: string;
  image: string | null;
  referenceNo: string | null;
  size: string | null;
};

type CollectionConfig = {
  title: string;
  filterValues: string[];
  description: string;
};

const COLLECTION_MAP: Record<string, CollectionConfig> = {
  "jewel-tree": {
    title: "Jewel Tree",
    filterValues: ["jewel-tree"],
    description:
      "A curated collection of artistic botanical forms, sculptural trees and nature-inspired creations.",
  },

  "nature-window": {
    title: "Nature Window",
    filterValues: [
      "nature-window",
      "nature-window-collection",
    ],
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

function normalizePath(
  img: string | null | undefined
): string | null {
  if (typeof img !== "string") {
    return null;
  }

  const value = img.trim();

  if (
    !value ||
    value === "null" ||
    value === "undefined"
  ) {
    return null;
  }

  // Keep Cloudinary and other absolute image URLs unchanged.
  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  // Keep existing public paths unchanged.
  if (value.startsWith("/")) {
    return value;
  }

  // Convert a relative public path into an absolute path.
  return `/${value}`;
}

function getText(
  value: unknown
): string | null {
  if (typeof value !== "string" && typeof value !== "number") {
    return null;
  }

  const text = String(value).trim();

  if (
    !text ||
    text === "null" ||
    text === "undefined"
  ) {
    return null;
  }

  return text;
}

async function getCollectionData(
  collectionSlug: string
) {
  const slug = decodeURIComponent(collectionSlug)
    .toLowerCase()
    .trim();

  const config = COLLECTION_MAP[slug];

  if (!config) {
    return null;
  }

  const db = await getDb();

  // Products uploaded through the Design Store form
  // are saved in this collection.
  const rows = await db
    .collection("DesignStoreProduct")
    .find({
      collection: {
        $in: config.filterValues,
      },
    })
    .sort({
      createdAt: -1,
    })
    .toArray();

  const products: ProductCard[] = rows
    .map((item) => {
      const title =
        getText(item.title) ??
        getText(item.Title) ??
        "Untitled Product";

      const image =
        normalizePath(
          getText(item.image1) ??
          getText(item.Image)
        ) ??
        normalizePath(getText(item.image2)) ??
        normalizePath(getText(item.image3)) ??
        normalizePath(getText(item.image4));

      return {
        id: item._id.toString(),
        title,
        image,
        referenceNo:
          getText(item.referenceNo) ??
          getText(item["Reference No"]),
        size:
          getText(item.size) ??
          getText(item.Size) ??
          getText(item["Size Inches (h x w x d)"]),
      };
    })
    .filter((product) => product.id.length > 0);

  return {
    title: config.title,
    slug,
    description: config.description,
    products,
  };
}

export default async function CollectionPage({
  params,
}: Props) {
  const { collection: collectionSlug } = await params;

  let collection;

  try {
    collection = await getCollectionData(collectionSlug);
  } catch (error) {
    console.error(
      "[Design Store] Failed to load collection:",
      error
    );

    throw error;
  }

  if (!collection) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#FBF9F0] text-[#2B211C]">
      {/* Collection header */}
      <section className="mx-auto max-w-[1500px] px-6 pb-16 pt-36 sm:px-8 lg:px-10">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-2 text-[11px] uppercase tracking-[2px] text-[#8B624B]"
        >
          <Link
            href="/design-store"
            className="transition hover:underline"
          >
            Design Store
          </Link>

          <span>/</span>

          <span className="font-semibold text-[#2B211C]">
            {collection.title}
          </span>
        </nav>

        {/* Section label */}
        <p className="text-[11px] font-semibold uppercase tracking-[4px] text-[#8B624B]">
          Collection
        </p>

        {/* Title and description */}
        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-serif text-5xl font-semibold tracking-tight text-[#29231F] sm:text-6xl lg:text-7xl">
              {collection.title}
            </h1>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-[#77716B]">
              {collection.description}
            </p>
          </div>

          <span className="shrink-0 text-xs font-semibold uppercase tracking-[2px] text-[#8B624B]">
            {collection.products.length}{" "}
            {collection.products.length === 1
              ? "Product"
              : "Products"}
          </span>
        </div>
      </section>

      {/* Products */}
      <section className="mx-auto max-w-[1500px] px-6 pb-28 sm:px-8 lg:px-10">
        {collection.products.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {collection.products.map((product) => (
              <Link
                key={product.id}
                href={`/design-store/${encodeURIComponent(
                  product.id
                )}`}
                className="group block overflow-hidden rounded-[22px] border border-[#E6DDD2] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(70,45,30,0.10)]"
              >
                {/* Product image */}
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

                {/* Product details */}
                <div className="p-6">
                  <h2 className="font-serif text-2xl font-semibold leading-tight text-[#29231F]">
                    {product.title}
                  </h2>

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
            <h2 className="font-serif text-2xl text-[#684633]">
              No products found
            </h2>

            <p className="mt-3 text-sm">
              There are currently no products in this collection.
            </p>

            <Link
              href="/design-store"
              className="mt-6 inline-flex rounded-full bg-[#684633] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#4F3325]"
            >
              Explore Design Store
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
