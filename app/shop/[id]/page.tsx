import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { notFound } from "next/navigation";
import ProductDetailsClient from "./ProductDetailsClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  if (!id) {
    notFound();
  }

  let product: any = null;

  try {
    const db = await getDb();

    if (!ObjectId.isValid(id)) {
      notFound();
    }

    const productDocument = await db
      .collection("Product")
      .findOne({
        _id: new ObjectId(id),
      });

    if (!productDocument) {
      notFound();
    }

    /*
     * Fetch Artist separately because we are no longer
     * using Prisma's include: { artist: true }
     */
    let artist = null;

    if (productDocument.artistId) {
      let artistId: ObjectId | null = null;

      if (productDocument.artistId instanceof ObjectId) {
        artistId = productDocument.artistId;
      } else if (ObjectId.isValid(String(productDocument.artistId))) {
        artistId = new ObjectId(String(productDocument.artistId));
      }

      if (artistId) {
        const artistDocument = await db
          .collection("Artist")
          .findOne({
            _id: artistId,
          });

        if (artistDocument) {
          artist = {
            id: artistDocument._id?.toString() ?? "",
            name: artistDocument.name ?? "",
            specialty: artistDocument.specialty ?? "",
            bio: artistDocument.bio ?? "",
            imageUrl: artistDocument.imageUrl ?? "",
          };
        }
      }
    }

    /*
     * Convert MongoDB document to the structure
     * expected by ProductDetailsClient.
     */
    product = {
      id: productDocument._id?.toString() ?? "",

      slNo:
        productDocument["SL NO"] ??
        productDocument.slNo ??
        null,

      title:
        productDocument["TITLE"] ??
        productDocument.title ??
        "",

      imageUrl:
        productDocument["IMAGE URL"] ??
        productDocument.imageUrl ??
        "",

      image2:
        productDocument["IMAGE 2"] ??
        productDocument.image2 ??
        "",

      image3:
        productDocument["IMAGE 3"] ??
        productDocument.image3 ??
        "",

      image4:
        productDocument["IMAGE 4"] ??
        productDocument.image4 ??
        "",

      image5:
        productDocument["IMAGE 5"] ??
        productDocument.image5 ??
        "",

      referenceNo:
        productDocument["REFERENCE NO"] ??
        productDocument.referenceNo ??
        "",

      location:
        productDocument["LOCATION"] ??
        productDocument.location ??
        "",

      year:
        productDocument["YEAR"] ??
        productDocument.year ??
        null,

      medium:
        productDocument["MEDIUM"] ??
        productDocument.medium ??
        "",

      size:
        productDocument["SIZE"] ??
        productDocument.size ??
        "",

      price12x18:
        productDocument["12X18 PRICE"] ??
        productDocument.price12x18 ??
        null,

      price18x24:
        productDocument["18X24 PRICE"] ??
        productDocument.price18x24 ??
        null,

      price24x33:
        productDocument["24X33 PRICE"] ??
        productDocument.price24x33 ??
        null,

      category:
        productDocument["CATEGORY"] ??
        productDocument.category ??
        "",

      description:
        productDocument["DESCRIPTION"] ??
        productDocument.description ??
        "",

      artistId:
        productDocument.artistId instanceof ObjectId
          ? productDocument.artistId.toString()
          : productDocument.artistId ?? null,

      artist,

      createdAt: productDocument.createdAt
        ? new Date(productDocument.createdAt).toISOString()
        : null,

      updatedAt: productDocument.updatedAt
        ? new Date(productDocument.updatedAt).toISOString()
        : null,
    };
  } catch (error) {
    console.error("Product database query failed:", error);
  }

  if (!product) {
    notFound();
  }

  return <ProductDetailsClient product={product} />;
}