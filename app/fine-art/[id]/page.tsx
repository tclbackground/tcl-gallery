import { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
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

  const artwork = await prisma.fineArt.findFirst({
    where: {
      slNo: slNo,
    },
  });

  return artwork;
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

  // Use your actual database field here
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

        // IMPORTANT:
        // Your schema appears to use "title"
        // instead of "titleOfArt"
        title: artwork.titleOfArt,

        withFrame: artwork.withFrame,
        paintingType: artwork.paintingType,
      }}
    />
  );
}