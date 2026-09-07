import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }> | { id: string };
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/['’]/g, "")
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function resolveProductImage(
  dbImage: string | null | undefined,
  folder: string,
  title: string
): string {
  if (dbImage && typeof dbImage === "string") {
    const val = dbImage.trim();
    if (val && val !== "null" && val !== "undefined") {
      if (val.startsWith("http://") || val.startsWith("https://") || val.startsWith("/")) {
        return val;
      }
      return `/images/${folder}/${val}`;
    }
  }
  return `/images/${folder}/${slugify(title)}.jpeg`;
}

async function getProduct(rawId: string) {
  const id = decodeURIComponent(rawId);

  // 1. Check prisma.jewelTree
  try {
    const jewelTreeItem = await prisma.jewelTree.findUnique({
      where: { id },
    });

    if (jewelTreeItem) {
      const title = jewelTreeItem.title?.trim() || "Untitled Product";
      return {
        id: jewelTreeItem.id,
        title,
        collectionName: "Jewel Tree",
        collectionSlug: "jewel-tree",
        image: resolveProductImage(jewelTreeItem.image, "jeweltree", title),
        referenceNo: jewelTreeItem.referenceNo?.trim() || null,
        size: jewelTreeItem.size?.trim() || null,
        material: null,
        description:
          "A bespoke sculptural botanical piece, handcrafted to bring character, organic forms, and natural elegance into your space.",
      };
    }
  } catch {
    // Continue if ID is not in jewelTree
  }

  // 2. Check prisma.designStoreProduct
  try {
    const designStoreItem = await prisma.designStoreProduct.findUnique({
      where: { id },
    });

    if (designStoreItem) {
      const title = designStoreItem.title?.trim() || "Untitled Product";
      const folder =
        designStoreItem.collection === "nature-window"
          ? "naturewindow"
          : "livinglegacy";

      const collectionName =
        designStoreItem.collection === "nature-window"
          ? "Nature Window"
          : "Living Legacy";

      return {
        id: designStoreItem.id,
        title,
        collectionName,
        collectionSlug: designStoreItem.collection,
        image: resolveProductImage(designStoreItem.image1, folder, title),
        referenceNo: designStoreItem.referenceNo?.trim() || null,
        size: designStoreItem.size?.trim() || null,
        material: designStoreItem.material?.trim() || null,
        description:
          designStoreItem.description?.trim() ||
          "A distinctive decorative piece crafted with meticulous attention to detail, materiality, and form.",
      };
    }
  } catch {
    // Continue
  }

  return null;
}

export default async function ProductDetailPage({ params }: Props) {
  // Supports both Next.js 15 (Promise) and Next.js 14 (Object)
  const resolvedParams = await Promise.resolve(params);
  const product = await getProduct(resolvedParams.id);

  if (!product) {
    notFound();
  }

  const mailtoSubject = encodeURIComponent(
    `Product Enquiry: ${product.title} (${product.referenceNo || "No Ref"})`
  );
  const mailtoBody = encodeURIComponent(
    `Hi TCL Team,\n\nI would like to enquire about "${product.title}" (${product.collectionName}, Ref: ${
      product.referenceNo || "N/A"
    }).\n\nPlease let me know the availability and pricing details.\n\nThank you!`
  );

  return (
    <main className="min-h-screen bg-[#FBF9F0] text-[#2B211C]">
      {/* BREADCRUMB NAVIGATION */}
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 pt-36 pb-8">
        <nav className="flex items-center gap-2 text-[11px] uppercase tracking-[2px] text-[#8B624B]">
          <Link href="/design-store" className="hover:underline">
            Design Store
          </Link>
          <span>/</span>
          <Link
            href={`/design-store/collection/${encodeURIComponent(
              product.collectionSlug
            )}`}
            className="hover:underline"
          >
            {product.collectionName}
          </Link>
          <span>/</span>
          <span className="text-[#2B211C] font-semibold truncate max-w-xs">
            {product.title}
          </span>
        </nav>
      </div>

      {/* PRODUCT DISPLAY */}
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* IMAGE CONTAINER */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[28px] border border-[#E6DDD2] bg-white shadow-[0_12px_40px_rgba(70,45,30,0.06)]">
              <img
                src={product.image}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* PRODUCT INFO & ENQUIRE ACTIONS */}
          <div className="lg:col-span-5 flex flex-col space-y-8">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[3.5px] text-[#8B624B]">
                {product.collectionName}
              </p>
              <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-semibold leading-tight text-[#29231F]">
                {product.title}
              </h1>
            </div>

            {/* SPECS TABLE */}
            <div className="rounded-2xl border border-[#E6DDD2] bg-white/70 p-6 space-y-3 text-sm">
              {product.referenceNo && (
                <div className="flex justify-between py-1 border-b border-[#F0E8DF]">
                  <span className="text-[#8C847E]">Reference No</span>
                  <span className="font-mono font-medium text-[#29231F]">
                    {product.referenceNo}
                  </span>
                </div>
              )}

              {product.size && (
                <div className="flex justify-between py-1 border-b border-[#F0E8DF]">
                  <span className="text-[#8C847E]">Dimensions</span>
                  <span className="font-medium text-[#29231F]">
                    {product.size}
                  </span>
                </div>
              )}

              {product.material && (
                <div className="flex justify-between py-1 border-b border-[#F0E8DF]">
                  <span className="text-[#8C847E]">Material</span>
                  <span className="font-medium text-[#29231F]">
                    {product.material}
                  </span>
                </div>
              )}

              <div className="flex justify-between py-1">
                <span className="text-[#8C847E]">Availability</span>
                <span className="font-medium text-emerald-700">
                  Available on Request
                </span>
              </div>
            </div>

            {/* DESCRIPTION */}
            <p className="text-base leading-relaxed text-[#77716B]">
              {product.description}
            </p>

            {/* ENQUIRE NOW BUTTONS */}
            <div className="pt-2 space-y-3">
              <a
                href={`mailto:concierge@todaycelebratelife.com?subject=${mailtoSubject}&body=${mailtoBody}`}
                className="w-full flex items-center justify-center rounded-full bg-[#684633] px-8 py-4 text-xs font-semibold uppercase tracking-[2px] text-white transition hover:bg-[#4F3325] shadow-lg shadow-[#684633]/20"
              >
                Enquire Now
              </a>

              <Link
                href="/contact"
                className="w-full flex items-center justify-center rounded-full border border-[#684633] px-8 py-4 text-xs font-semibold uppercase tracking-[2px] text-[#684633] transition hover:bg-[#684633] hover:text-white"
              >
                Book a Consultation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}