import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDb } from "@/lib/mongodb";
import FineArtDetailsClient from "./FineArtDetailsClient";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function getArtwork(id: string) {
  const slNo = Number(id);

  if (Number.isNaN(slNo)) {
    return null;
  }

  const db = await getDb();

  const artwork = await db.collection("FineArt").findOne({
    "Sl No": slNo,
  });

  if (!artwork) {
    return null;
  }

  return {
    id: artwork._id?.toString() ?? "",

    slNo:
      artwork["Sl No"] ??
      artwork.slNo ??
      0,

    category:
      artwork["Category"] ??
      artwork.category ??
      "Fine Art",

    artistName:
      artwork["Artist Name"] ??
      artwork.artistName ??
      "",

    itemRefNo:
      artwork["Item Ref No"] ??
      artwork.itemRefNo ??
      "",

    year:
      artwork["Year"] ??
      artwork.year ??
      null,

    image1:
      artwork["Image 1"] ??
      artwork.image1 ??
      "",

    image2:
      artwork["Image 2"] ??
      artwork.image2 ??
      "",

    image3:
      artwork["Image 3"] ??
      artwork.image3 ??
      "",

    titleOfArt:
      artwork["Title of the Art"] ??
      artwork.titleOfArt ??
      "Fine Art",

    widthCms:
      artwork["Width (CMS)"] ??
      artwork.widthCms ??
      "",

    withFrame:
      artwork["With Frame"] ??
      artwork.withFrame ??
      "",

    photo:
      artwork["Photo"] ??
      artwork.photo ??
      "",

    paintingType:
      artwork["Painting Type"] ??
      artwork.paintingType ??
      "",

    productCategory:
      artwork["Product Category"] ??
      artwork.productCategory ??
      "",
  };
}

/* ==========================================
   TCL GALLERY - SEO METADATA
========================================== */

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;

  const artwork = await getArtwork(id);

  if (!artwork) {
    return {
      title: "Artwork Not Found | TCL Gallery",
    };
  }

  const artworkTitle =
    artwork.titleOfArt || "Fine Art";

  const artistName =
    artwork.artistName || "";

  return {
    title: artistName
      ? `${artworkTitle} by ${artistName} | TCL Gallery`
      : `${artworkTitle} | TCL Gallery`,

    description: artistName
      ? `Discover ${artworkTitle} by ${artistName} at TCL Gallery.`
      : `Discover ${artworkTitle} at TCL Gallery.`,

    openGraph: {
      title: artistName
        ? `${artworkTitle} by ${artistName} | TCL Gallery`
        : `${artworkTitle} | TCL Gallery`,

      description: artistName
        ? `Discover ${artworkTitle} by ${artistName} at TCL Gallery.`
        : `Discover ${artworkTitle} at TCL Gallery.`,

      images: artwork.image1
        ? [
            {
              url: artwork.image1,
              alt: artworkTitle,
            },
          ]
        : [],
    },
  };
}

/* ==========================================
   TCL GALLERY - FINE ART DETAILS PAGE
========================================== */

export default async function FineArtDetailsPage({
  params,
}: PageProps) {
  const { id } = await params;

  const artwork = await getArtwork(id);

  if (!artwork) {
    notFound();
  }

  return (
    <FineArtDetailsClient
      artwork={{
        id: artwork.id,
        slNo: artwork.slNo,
        category: artwork.category,
        artistName: artwork.artistName,
        itemRefNo: artwork.itemRefNo,
        year: artwork.year,

        image1: artwork.image1,
        image2: artwork.image2,
        image3: artwork.image3,

        title: artwork.titleOfArt,

        withFrame: artwork.withFrame,
        paintingType: artwork.paintingType,
      }}
    />
  );
}