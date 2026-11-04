
import { notFound } from "next/navigation";
import { ObjectId, type Document } from "mongodb";
import { getDb } from "@/lib/mongodb";

import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

import EditProductForm from "../EditProductForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// ======================================================
// TYPES
// ======================================================

type Props = {
  params: Promise<{ id: string }>;
};

type FoundProduct = {
  product: Document;
  sourceCollection: string;
};

// ======================================================
// HELPER FUNCTIONS
// ======================================================

function getString(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (value instanceof ObjectId) {
    return value.toString();
  }

  return String(value);
}

// Get the first available field value.
function getFirstValue(
  product: Document,
  ...keys: string[]
): unknown {
  for (const key of keys) {
    const value = product[key];

    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      return value;
    }
  }

  return null;
}

// ======================================================
// IMAGE HELPERS
// ======================================================

function getImage(
  product: Document,
  ...keys: string[]
): string {
  const value = getFirstValue(product, ...keys);

  if (typeof value === "string") {
    return value.trim();
  }

  if (value && typeof value === "object") {
    const imageObject = value as Record<string, unknown>;

    const possibleUrls = [
      imageObject.url,
      imageObject.secure_url,
      imageObject.src,
      imageObject.imageUrl,
      imageObject.path,
    ];

    for (const url of possibleUrls) {
      if (
        typeof url === "string" &&
        url.trim()
      ) {
        return url.trim();
      }
    }
  }

  return "";
}

// Extract URLs from images array.
function getImageArray(product: Document): string[] {
  const storedImages = product.images;

  if (!Array.isArray(storedImages)) {
    return [];
  }

  return storedImages.map((image: unknown) => {
    if (typeof image === "string") {
      return image.trim();
    }

    if (image && typeof image === "object") {
      const imageObject = image as Record<string, unknown>;

      const possibleUrls = [
        imageObject.url,
        imageObject.secure_url,
        imageObject.src,
        imageObject.imageUrl,
        imageObject.path,
      ];

      for (const url of possibleUrls) {
        if (
          typeof url === "string" &&
          url.trim()
        ) {
          return url.trim();
        }
      }
    }

    return "";
  });
}

// ======================================================
// PRICE HELPER
// ======================================================

function getPrice(
  product: Document
): number | string {
  const possiblePrices = [
    product.price,
    product.PRICE,
    product.Price,
    product["12X18 PRICE"],
    product["12 X 18 PRICE"],
    product.price12x18,
  ];

  for (const value of possiblePrices) {
    if (
      value !== null &&
      value !== undefined &&
      value !== "" &&
      Number.isFinite(Number(value))
    ) {
      return Number(value);
    }
  }

  return "";
}

// ======================================================
// DATE HELPER
// ======================================================

function getDate(value: unknown): string | null {
  if (!value) {
    return null;
  }

  const date = new Date(
    value as string | number | Date
  );

  return Number.isNaN(date.getTime())
    ? null
    : date.toISOString();
}

// ======================================================
// FIND PRODUCT IN MULTIPLE COLLECTIONS
// ======================================================

async function findProduct(
  id: string
): Promise<FoundProduct | null> {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  const db = await getDb();

  const objectId = new ObjectId(id);

  const collectionNames = [
    "DesignStoreProduct",
    "JewelTree",
    "Product",
  ];

  for (const collectionName of collectionNames) {
    const found = await db
      .collection<Document>(collectionName)
      .findOne({
        _id: objectId,
      });

    if (found) {
      return {
        product: found,
        sourceCollection: collectionName,
      };
    }
  }

  return null;
}

// ======================================================
// PAGE
// ======================================================

export default async function EditProductPage({
  params,
}: Props) {
  const { id } = await params;

  // Validate MongoDB ObjectId.
  if (!id || !ObjectId.isValid(id)) {
    notFound();
  }

  const db = await getDb();

  // Fetch product and artists.
  const [foundProduct, rawArtists] = await Promise.all([
    findProduct(id),

    db.collection<Document>("Artist")
      .find({})
      .sort({ name: 1 })
      .toArray(),
  ]);

  if (!foundProduct) {
    notFound();
  }

  const rawProduct = foundProduct.product;

  const sourceCollection =
    foundProduct.sourceCollection;

  // ====================================================
  // IMAGE MAPPING
  // ====================================================

  const storedImages = getImageArray(rawProduct);

  // Main image: image1 is the actual DesignStoreProduct field.
  const mainImage = getImage(
    rawProduct,
    "image1",
    "imageUrl",
    "image",
    "Image",
    "Image 1",
    "Image1",
    "IMAGE",
    "IMAGE URL",
    "Image URL",
    "imageURL",
    "mainImage",
    "main_image",
    "photo",
    "Photo",
    "fileUrl",
    "secure_url"
  );

  // Additional images.
  const additionalImages = [
    getImage(
      rawProduct,
      "image2",
      "Image 2",
      "Image2",
      "IMAGE 2"
    ) || storedImages[0] || "",

    getImage(
      rawProduct,
      "image3",
      "Image 3",
      "Image3",
      "IMAGE 3"
    ) || storedImages[1] || "",

    getImage(
      rawProduct,
      "image4",
      "Image 4",
      "Image4",
      "IMAGE 4"
    ) || storedImages[2] || "",

    getImage(
      rawProduct,
      "image5",
      "Image 5",
      "Image5",
      "IMAGE 5"
    ) || storedImages[3] || "",
  ];

  // ====================================================
  // DEBUG IMAGE DATA
  // ====================================================

  console.log("========== EDIT PRODUCT IMAGE DATA ==========");

  console.log("Product ID:", id);

  console.log("Collection:", sourceCollection);

  console.log("Main image:", mainImage);

  console.log("Additional images:", additionalImages);

  console.log("Original image fields:", {
    image1: rawProduct.image1,
    image2: rawProduct.image2,
    image3: rawProduct.image3,
    image4: rawProduct.image4,
    image5: rawProduct.image5,
    images: rawProduct.images,
  });

  console.log("==============================================");

  // ====================================================
  // MAP PRODUCT FIELDS
  // ====================================================

  const product = {
    id: rawProduct._id.toString(),

    _id: rawProduct._id.toString(),

    // Original MongoDB collection.
    sourceCollection,

    title: getString(
      getFirstValue(
        rawProduct,
        "title",
        "TITLE",
        "Title",
        "Product Title",
        "Product Name",
        "name",
        "Name"
      )
    ),

    price: getPrice(rawProduct),

    category: getString(
      getFirstValue(
        rawProduct,
        "category",
        "CATEGORY",
        "Category",
        "collection",
        "Collection"
      )
    ),

    artistId: getString(
      getFirstValue(
        rawProduct,
        "artistId",
        "artistID",
        "Artist ID",
        "artist",
        "Artist"
      )
    ),

    description: getString(
      getFirstValue(
        rawProduct,
        "description",
        "DESCRIPTION",
        "Description"
      )
    ),

    // Main image.
    imageUrl: mainImage,

    // Four additional images.
    images: additionalImages,

    referenceNo: getString(
      getFirstValue(
        rawProduct,
        "referenceNo",
        "Reference No",
        "Reference",
        "refNo"
      )
    ),

    material: getString(
      getFirstValue(
        rawProduct,
        "material",
        "Material"
      )
    ),

    size: getString(
      getFirstValue(
        rawProduct,
        "size",
        "Size",
        "Dimensions"
      )
    ),

    createdAt: getDate(rawProduct.createdAt),

    updatedAt: getDate(rawProduct.updatedAt),
  };

  // ====================================================
  // MAP ARTISTS
  // ====================================================

  const artists = rawArtists.map((artist) => ({
    id: artist._id.toString(),

    name: getString(
      artist.name ??
      artist.NAME ??
      artist.Name
    ),
  }));

  // ====================================================
  // RENDER PAGE
  // ====================================================

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 text-[#22211B]">

      {/* HEADER */}

      <div className="flex items-center gap-4 border-b border-[#C4A892]/30 pb-4">

        <Link
          href="/admin"
          className="rounded-full border border-[#C4A892]/40 bg-white p-2.5 transition hover:bg-[#FBF9F0]"
          title="Back"
        >
          <FiArrowLeft size={20} />
        </Link>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[3px] text-[#4D3024]">
            Management
          </p>

          <h1 className="font-serif text-4xl font-bold md:text-5xl">
            Edit Artwork
          </h1>

          <p className="mt-2 text-xs text-gray-500">
            Product ID: {id}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Database: {sourceCollection}
          </p>
        </div>

      </div>

      {/* EDIT FORM */}

      <EditProductForm
        product={product}
        artists={artists}
      />

    </div>
  );
}
