
import { notFound } from "next/navigation";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

import EditProductForm from "../EditProductForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getString(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
}

function getImage(
  product: Record<string, any>,
  ...keys: string[]
): string {
  for (const key of keys) {
    const value = product[key];

    if (
      typeof value === "string" &&
      value.trim() !== ""
    ) {
      return value.trim();
    }
  }

  return "";
}

function getPrice(
  product: Record<string, any>
): number | string {
  const possiblePrices = [
    product.price,
    product.PRICE,
    product.Price,
    product["PRICE"],
    product["Price"],
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

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id || !ObjectId.isValid(id)) {
    notFound();
  }

  const db = await getDb();

  const productObjectId = new ObjectId(id);

  const [rawProduct, rawArtists] = await Promise.all([
    db.collection("Product").findOne({
      _id: productObjectId,
    }),

    db.collection("Artist")
      .find({})
      .sort({ name: 1 })
      .toArray(),
  ]);

  if (!rawProduct) {
    notFound();
  }

  // Map MongoDB fields to the names expected by EditProductForm.
  const product = {
    ...rawProduct,

    id: rawProduct._id.toString(),
    _id: rawProduct._id.toString(),

    title: getString(
      rawProduct.title ??
      rawProduct.TITLE ??
      rawProduct.Title
    ),

    price: getPrice(rawProduct),

    category: getString(
      rawProduct.category ??
      rawProduct.CATEGORY ??
      rawProduct.Category
    ),

    artistId: getString(
      rawProduct.artistId?.toString?.() ??
      rawProduct.artistId ??
      rawProduct.artistID ??
      rawProduct["Artist ID"]
    ),

    description: getString(
      rawProduct.description ??
      rawProduct.DESCRIPTION ??
      rawProduct.Description
    ),

    imageUrl: getImage(
      rawProduct,
      "imageUrl",
      "IMAGE URL",
      "Image URL",
      "Image",
      "image"
    ),

    images: [
      getImage(
        rawProduct,
        "image2",
        "IMAGE 2",
        "Image 2"
      ),
      getImage(
        rawProduct,
        "image3",
        "IMAGE 3",
        "Image 3"
      ),
      getImage(
        rawProduct,
        "image4",
        "IMAGE 4",
        "Image 4"
      ),
      getImage(
        rawProduct,
        "image5",
        "IMAGE 5",
        "Image 5"
      ),
    ],

    createdAt: rawProduct.createdAt
      ? new Date(rawProduct.createdAt).toISOString()
      : null,

    updatedAt: rawProduct.updatedAt
      ? new Date(rawProduct.updatedAt).toISOString()
      : null,
  };

  const artists = rawArtists.map((artist: any) => ({
    id: artist._id.toString(),
    name: getString(
      artist.name ??
      artist.NAME ??
      artist.Name
    ),
  }));

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