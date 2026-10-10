import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = {
  params: Promise<{ id: string }>;
};

type Product = {
  id: string;
  slNo: number | null;
  title: string;
  collection: string;
  description: string | null;
  price: number | null;
  image1: string | null;
  image2: string | null;
  image3: string | null;
  image4: string | null;
  referenceNo: string | null;
  material: string | null;
  size: string | null;
};

function normalizeImage(
  value: unknown
): string | null {
  if (!value) return null;

  const image = String(value).trim();

  if (
    !image ||
    image === "null" ||
    image === "undefined"
  ) {
    return null;
  }

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("/")
  ) {
    return image;
  }

  return `/${image}`;
}

function getCollectionLabel(
  collection: string
) {
  switch (collection) {
    case "jewel-tree":
      return "Jewel Tree";

    case "nature-window":
    case "nature-window-collection":
      return "Nature Window";

    case "living-legacy":
      return "Living Legacy";

    case "bags":
      return "Bags";

    default:
      return collection;
  }
}

async function getProduct(
  id: string
): Promise<Product | null> {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  const db = await getDb();

  const product = await db
    .collection("JewelTree")
    .findOne({
      _id: new ObjectId(id),
    });

  if (!product) {
    return null;
  }

  return {
    id: product._id.toString(),

    slNo:
      product["Sl No"] ??
      product.slNo ??
      null,

    title:
      String(
        product["Title"] ??
        product.title ??
        ""
      ).trim() || "Untitled Product",

    collection:
      String(
        product.collection ?? ""
      ).trim(),

    description:
      product["Description"] ??
      product.description ??
      null,

    price:
      product["Price"] ??
      product.price ??
      null,

    image1: normalizeImage(
      product["Image"] ??
      product["Image 1"] ??
      product.image ??
      product.image1
    ),

    image2: normalizeImage(
      product["Image 2"] ??
      product.image2
    ),

    image3: normalizeImage(
      product["Image 3"] ??
      product.image3
    ),

    image4: normalizeImage(
      product["Image 4"] ??
      product.image4
    ),

    referenceNo:
      String(
        product["Reference No"] ??
        product.referenceNo ??
        ""
      ).trim() || null,

    material:
      String(
        product["Material"] ??
        product.material ??
        ""
      ).trim() || null,

    size:
      String(
        product["Size Inches (h x w x d)"] ??
        product["Size"] ??
        product.size ??
        ""
      ).trim() || null,
  };
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { id } = await params;

  const product = await getProduct(id);

  if (!product) {
    return {
      title: "Product Not Found | TCL Gallery",
    };
  }

  return {
    title: `${product.title} | TCL Gallery Design Store`,
    description:
      product.description ||
      `Discover ${product.title} at TCL Gallery Design Store.`,
  };
}

export default async function DesignStoreProductPage({
  params,
}: Props) {
  const { id } = await params;

  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const collectionName =
    getCollectionLabel(product.collection);

  const images = [
    product.image1,
    product.image2,
    product.image3,
    product.image4,
  ].filter(
    (image): image is string =>
      Boolean(image)
  );

  return (
    <main className="min-h-screen bg-[#FBF9F0] text-[#2B211C]">

      {/* Breadcrumb */}

      <section className="mx-auto max-w-[1500px] px-6 sm:px-8 lg:px-10 pt-36">

        <nav className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[2px] text-[#8B624B]">

          <Link
            href="/design-store"
            className="hover:underline"
          >
            Design Store
          </Link>

          <span>/</span>

          <Link
            href={`/design-store/collection/${encodeURIComponent(
              product.collection
            )}`}
            className="hover:underline"
          >
            {collectionName}
          </Link>

          <span>/</span>

          <span className="text-[#2B211C]">
            {product.title}
          </span>

        </nav>

      </section>

      {/* Product */}

      <section className="mx-auto max-w-[1500px] px-6 sm:px-8 lg:px-10 py-16 lg:py-24">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

          {/* Images */}

          <div>

            {images.length > 0 ? (

              <div className="space-y-5">

                <div className="overflow-hidden rounded-[24px] bg-[#F2EDE5]">

                  <img
                    src={images[0]}
                    alt={product.title}
                    className="w-full aspect-[4/3] object-cover"
                  />

                </div>

                {images.length > 1 && (

                  <div className="grid grid-cols-3 gap-4">

                    {images.slice(1).map(
                      (image, index) => (
                        <div
                          key={`${image}-${index}`}
                          className="overflow-hidden rounded-[16px] bg-[#F2EDE5]"
                        >
                          <img
                            src={image}
                            alt={`${product.title} ${
                              index + 2
                            }`}
                            className="w-full aspect-square object-cover"
                          />
                        </div>
                      )
                    )}

                  </div>

                )}

              </div>

            ) : (

              <div className="aspect-[4/3] rounded-[24px] bg-[#F2EDE5] flex items-center justify-center text-[#A99B8E]">
                No Image Available
              </div>

            )}

          </div>

          {/* Details */}

          <div className="flex flex-col justify-center">

            <p className="text-[11px] font-semibold uppercase tracking-[4px] text-[#8B624B]">
              {collectionName}
            </p>

            <h1 className="mt-5 font-serif text-5xl sm:text-6xl font-semibold leading-tight text-[#29231F]">
              {product.title}
            </h1>

            {product.referenceNo && (
              <p className="mt-6 text-sm text-[#8F857C]">
                Ref:{" "}
                <span className="text-[#665F59]">
                  {product.referenceNo}
                </span>
              </p>
            )}

            {product.size && (
              <div className="mt-8">
                <p className="text-[10px] uppercase tracking-[2px] font-semibold text-[#8B624B]">
                  Size
                </p>

                <p className="mt-2 text-base text-[#665F59]">
                  {product.size}
                </p>
              </div>
            )}

            {product.material && (
              <div className="mt-6">
                <p className="text-[10px] uppercase tracking-[2px] font-semibold text-[#8B624B]">
                  Material
                </p>

                <p className="mt-2 text-base text-[#665F59]">
                  {product.material}
                </p>
              </div>
            )}

            {product.description && (
              <div className="mt-10 border-t border-[#DED4C8] pt-8">

                <p className="text-[10px] uppercase tracking-[2px] font-semibold text-[#8B624B]">
                  About the Product
                </p>

                <p className="mt-5 text-base leading-8 text-[#665F59]">
                  {product.description}
                </p>

              </div>
            )}

            {product.price !== null && (
              <div className="mt-8">

                <p className="text-[10px] uppercase tracking-[2px] font-semibold text-[#8B624B]">
                  Price
                </p>

                <p className="mt-2 font-serif text-3xl text-[#29231F]">
                  ₹
                  {Number(
                    product.price
                  ).toLocaleString("en-IN")}
                </p>

              </div>
            )}

            <div className="mt-10 flex flex-wrap gap-4">

              <Link
                href={`/design-store/collection/${encodeURIComponent(
                  product.collection
                )}`}
                className="inline-flex items-center justify-center rounded-full border border-[#684633] px-8 py-4 text-[11px] font-semibold uppercase tracking-[2px] text-[#684633] hover:bg-[#684633] hover:text-white transition"
              >
                Back to Collection
              </Link>

              <a
                href={`mailto:info@tclgallery.com?subject=${encodeURIComponent(
                  `Enquiry for ${product.title}`
                )}`}
                className="inline-flex items-center justify-center rounded-full bg-[#684633] px-8 py-4 text-[11px] font-semibold uppercase tracking-[2px] text-white hover:bg-[#4F3325] transition"
              >
                Enquire Now
              </a>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}