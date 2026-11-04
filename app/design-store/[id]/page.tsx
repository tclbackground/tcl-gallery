
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ObjectId, type Document } from "mongodb";
import { cache } from "react";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// ======================================================
// TYPES
// ======================================================

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

// ======================================================
// HELPER FUNCTIONS
// ======================================================

function getValue(
  row: Document,
  fields: string[]
): unknown {
  for (const field of fields) {
    const value = row?.[field];

    if (
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ""
    ) {
      return value;
    }
  }

  return null;
}

function toNullableString(
  value: unknown
): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  const result = String(value).trim();

  return result ? result : null;
}

function toNullableNumber(
  value: unknown
): number | null {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  const result = Number(value);

  return Number.isFinite(result) ? result : null;
}

// ======================================================
// IMAGE NORMALIZATION
// ======================================================

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

// ======================================================
// COLLECTION LABEL
// ======================================================

function getCollectionLabel(collection: string) {
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
      return collection || "Design Store";
  }
}

// ======================================================
// FIND PRODUCT IN A MONGODB COLLECTION
// ======================================================

async function findInCollection(
  collectionName: string,
  id: string
): Promise<Document | null> {
  const db = await getDb();

  const collection = db.collection<Document>(
    collectionName
  );

  console.log(
    `[TCL Design Store] Searching ${collectionName}:`,
    id
  );

  // 1. Search using MongoDB ObjectId.
  if (ObjectId.isValid(id)) {
    const objectIdProduct = await collection.findOne({
      _id: new ObjectId(id),
    });

    if (objectIdProduct) {
      console.log(
        `[TCL Design Store] Found using ObjectId in ${collectionName}`
      );

      return objectIdProduct;
    }
  }

  // 2. Search using string-based _id.
  // The cast is limited to this query because MongoDB's
  // default TypeScript ID type may assume ObjectId.
  const stringIdProduct = await collection.findOne(
    { _id: id } as any
  );

  if (stringIdProduct) {
    console.log(
      `[TCL Design Store] Found using string _id in ${collectionName}`
    );

    return stringIdProduct;
  }

  // 3. Search using a separate id field.
  const separateIdProduct = await collection.findOne({
    id: id,
  });

  if (separateIdProduct) {
    console.log(
      `[TCL Design Store] Found using id field in ${collectionName}`
    );

    return separateIdProduct;
  }

  console.log(
    `[TCL Design Store] Product not found in ${collectionName}`
  );

  return null;
}

// ======================================================
// DATABASE PRODUCT LOOKUP
// ======================================================

const getProduct = cache(
  async (id: string): Promise<Product | null> => {
    if (!id || !id.trim()) {
      console.error(
        "[TCL Design Store] Empty product ID"
      );

      return null;
    }

    try {
      console.log(
        "[TCL Design Store] Searching product:",
        id
      );

      // Search newer collection first.
      let product = await findInCollection(
        "DesignStoreProduct",
        id
      );

      let sourceCollection = "DesignStoreProduct";

      // Search legacy collection if not found.
      if (!product) {
        product = await findInCollection(
          "JewelTree",
          id
        );

        sourceCollection = "JewelTree";
      }

      // Product not found.
      if (!product) {
        console.error(
          "[TCL Design Store] PRODUCT NOT FOUND:",
          id
        );

        return null;
      }

      console.log(
        "[TCL Design Store] PRODUCT SUCCESSFULLY FOUND:",
        {
          id,
          sourceCollection,
          title:
            product["Title"] ??
            product.title ??
            product["Product Name"],
        }
      );

      // ==================================================
      // MAP DATABASE FIELDS
      // ==================================================

      const title = getValue(product, [
        "Title",
        "title",
        "Product Title",
        "Product Name",
        "productTitle",
        "productName",
        "Name",
        "name",
      ]);

      const collection = getValue(product, [
        "collection",
        "Collection",
        "COLLECTION",
      ]);

      return {
        id:
          product._id?.toString?.() ??
          product.id?.toString?.() ??
          id,

        slNo: toNullableNumber(
          getValue(product, [
            "Sl No",
            "slNo",
            "SL NO",
          ])
        ),

        title:
          String(title ?? "").trim() ||
          "Untitled Product",

        collection:
          String(collection ?? "").trim(),

        description: toNullableString(
          getValue(product, [
            "Description",
            "description",
          ])
        ),

        price: toNullableNumber(
          getValue(product, [
            "Price",
            "price",
          ])
        ),

        image1: normalizeImage(
          getValue(product, [
            "Image",
            "Image 1",
            "image",
            "image1",
            "Image1",
            "IMAGE1",
            "imageUrl",
            "imageURL",
            "ImageUrl",
            "Image URL",
            "photo",
            "Photo",
            "mainImage",
            "Main Image",
            "imagePath",
            "Image Path",
            "fileUrl",
            "File URL",
            "cloudinaryUrl",
            "cloudinaryURL",
            "secureUrl",
            "secure_url",
          ])
        ),

        image2: normalizeImage(
          getValue(product, [
            "Image 2",
            "image2",
            "Image2",
            "IMAGE2",
          ])
        ),

        image3: normalizeImage(
          getValue(product, [
            "Image 3",
            "image3",
            "Image3",
            "IMAGE3",
          ])
        ),

        image4: normalizeImage(
          getValue(product, [
            "Image 4",
            "image4",
            "Image4",
            "IMAGE4",
          ])
        ),

        referenceNo: toNullableString(
          getValue(product, [
            "Reference No",
            "referenceNo",
            "REFERENCE NO",
            "Reference",
            "reference",
            "refNo",
            "Ref No",
            "Item Ref No",
          ])
        ),

        material: toNullableString(
          getValue(product, [
            "Material",
            "material",
          ])
        ),

        size: toNullableString(
          getValue(product, [
            "Size Inches (h x w x d)",
            "Size",
            "size",
            "Dimensions",
            "dimensions",
          ])
        ),
      };
    } catch (error) {
      console.error(
        "[TCL Design Store] DATABASE ERROR:",
        error
      );

      throw error;
    }
  }
);

// ======================================================
// SEO METADATA
// ======================================================

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

// ======================================================
// PRODUCT DETAILS PAGE
// ======================================================

export default async function DesignStoreProductPage({
  params,
}: Props) {
  const { id } = await params;

  console.log(
    "[TCL Design Store] Rendering product page:",
    id
  );

  const product = await getProduct(id);

  if (!product) {
    console.error(
      "[TCL Design Store] RENDERING 404 FOR:",
      id
    );

    notFound();
  }

  const collectionName = getCollectionLabel(
    product.collection
  );

  const collectionUrl = product.collection
    ? `/design-store/collection/${encodeURIComponent(
        product.collection
      )}`
    : "/design-store";

  const images = [
    product.image1,
    product.image2,
    product.image3,
    product.image4,
  ].filter(
    (image): image is string => Boolean(image)
  );

  // ====================================================
  // PAGE UI
  // ====================================================

  return (
    <main className="min-h-screen bg-[#FBF9F0] text-[#2B211C]">

      {/* BREADCRUMB */}

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
            href={collectionUrl}
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

      {/* PRODUCT SECTION */}

      <section className="mx-auto max-w-[1500px] px-6 sm:px-8 lg:px-10 py-16 lg:py-24">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

          {/* PRODUCT IMAGES */}

          <div>

            {images.length > 0 ? (

              <div className="space-y-5">

                {/* MAIN IMAGE */}

                <div className="overflow-hidden rounded-[24px] bg-[#F2EDE5]">

                  <img
                    src={images[0]}
                    alt={product.title}
                    className="w-full aspect-[4/3] object-cover"
                  />

                </div>

                {/* ADDITIONAL IMAGES */}

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
                            alt={`${product.title} ${index + 2}`}
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

          {/* PRODUCT INFORMATION */}

          <div className="flex flex-col justify-center">

            <p className="text-[11px] font-semibold uppercase tracking-[4px] text-[#8B624B]">
              {collectionName}
            </p>

            <h1 className="mt-5 font-serif text-5xl sm:text-6xl font-semibold leading-tight text-[#29231F]">
              {product.title}
            </h1>

            {/* REFERENCE NUMBER */}

            {product.referenceNo && (

              <p className="mt-6 text-sm text-[#8F857C]">

                Ref:{" "}

                <span className="text-[#665F59]">
                  {product.referenceNo}
                </span>

              </p>

            )}

            {/* SIZE */}

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

            {/* MATERIAL */}

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

            {/* DESCRIPTION */}

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

            {/* PRICE */}

            {product.price !== null && (

              <div className="mt-8">

                <p className="text-[10px] uppercase tracking-[2px] font-semibold text-[#8B624B]">
                  Price
                </p>

                <p className="mt-2 font-serif text-3xl text-[#29231F]">
                  ₹
                  {product.price.toLocaleString("en-IN")}
                </p>

              </div>

            )}

            {/* ACTION BUTTONS */}

            <div className="mt-10 flex flex-wrap gap-4">

              <Link
                href={collectionUrl}
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
