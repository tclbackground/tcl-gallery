
import { notFound } from "next/navigation";
import { ObjectId, type Document } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { revalidatePath } from "next/cache";
import DesignStoreEditProductForm from "../../DesignStoreEditProductForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = {
  params: Promise<{ id: string }>;
};

function getText(value: unknown): string {
  if (value === null || value === undefined) return "";

  if (value instanceof ObjectId) return value.toString();

  return String(value);
}

function getImage(product: Document, ...keys: string[]): string {
  for (const key of keys) {
    const value = product[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }

    if (value && typeof value === "object") {
      const obj = value as Record<string, unknown>;
      const url = obj.url || obj.secure_url || obj.src ||
        obj.imageUrl || obj.path;

      if (typeof url === "string" && url.trim()) {
        return url.trim();
      }
    }
  }

  return "";
}

export default async function DesignStoreEditProductPage({
  params,
}: Props) {
  const { id } = await params;

  if (!id || !ObjectId.isValid(id)) notFound();

  const db = await getDb();

  // Only fetch from the Design Store collection.
  const rawProduct = await db
    .collection<Document>("DesignStoreProduct")
    .findOne({ _id: new ObjectId(id) });

  if (!rawProduct) notFound();

  const storedImages = Array.isArray(rawProduct.images)
    ? rawProduct.images
    : [];

  const images = [
    getImage(rawProduct, "image1", "imageUrl", "image", "mainImage"),
    getImage(rawProduct, "image2", "Image 2") || getText(storedImages[0]),
    getImage(rawProduct, "image3", "Image 3") || getText(storedImages[1]),
    getImage(rawProduct, "image4", "Image 4") || getText(storedImages[2]),
    getImage(rawProduct, "image5", "Image 5") || getText(storedImages[3]),
  ];

  const product = {
    id,
    referenceNo: getText(
      rawProduct.referenceNo ??
      rawProduct.referenceNumber ??
      rawProduct["Reference No"] ??
      rawProduct.refNo
    ),
    title: getText(
      rawProduct.title ??
      rawProduct.Title ??
      rawProduct.name
    ),
    images,
  };

  async function updateDesignStoreProduct(formData: FormData) {
    "use server";

    const productId = String(formData.get("id") || "");

    if (!ObjectId.isValid(productId)) {
      return {
        success: false,
        message: "Invalid product ID.",
      };
    }

    const referenceNo = String(
      formData.get("referenceNo") || ""
    ).trim();

    const title = String(
      formData.get("title") || ""
    ).trim();

    if (!referenceNo || !title) {
      return {
        success: false,
        message: "Reference number and title are required.",
      };
    }

    const images = [1, 2, 3, 4, 5].map((number) =>
      String(formData.get(`image${number}`) || "").trim()
    );

    const database = await getDb();

    const result = await database
      .collection("DesignStoreProduct")
      .updateOne(
        { _id: new ObjectId(productId) },
        {
          $set: {
            referenceNo,
            title,
            image1: images[0],
            image2: images[1] || null,
            image3: images[2] || null,
            image4: images[3] || null,
            image5: images[4] || null,
            imageUrl: images[0],
            images: images.slice(1).filter(Boolean),
            updatedAt: new Date(),
          },
        }
      );

    if (!result.matchedCount) {
      return {
        success: false,
        message: "Product not found.",
      };
    }

    revalidatePath("/admin/design-store");
    revalidatePath("/design-store");

    return {
      success: true,
      message: "Design Store product updated successfully.",
    };
  }

  return (
    <main className="min-h-screen bg-[#FAF8F2] px-4 py-10 md:px-8">
      <div className="mx-auto max-w-6xl">

        <div className="mb-8 border-b border-[#E8DED1] pb-6">
          <p className="text-xs uppercase tracking-[3px] text-[#9B8065]">
            TCL Gallery / Design Store
          </p>

          <h1 className="mt-3 font-serif text-3xl font-semibold text-[#29251F] md:text-4xl">
            Edit Design Store Product
          </h1>

          <p className="mt-2 text-sm text-[#887B70]">
            Update your product title, reference number and artwork images.
          </p>
        </div>

        <DesignStoreEditProductForm
          product={product}
          updateAction={updateDesignStoreProduct}
        />

      </div>
    </main>
  );
}
