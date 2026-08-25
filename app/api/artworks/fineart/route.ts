import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    console.log("Fetching Fine Art...");

    const artworks = await prisma.fineArt.findMany({
      where: {
        productCategory: "fine-art",
      },
      take: 3,
    });

    console.log("Fine Art found:", artworks.length);

    const formattedArtworks = artworks.map((artwork) => ({
      id: artwork.id,
      slNo: artwork.slNo,
      category: artwork.category,
      artistName: artwork.artistName,
      itemRefNo: artwork.itemRefNo,
      year: artwork.year,

      image: artwork.image1,

      title: artwork.titleOfArt,

      widthCms: artwork.widthCms,

      withFrame: artwork.withFrame,

      photo: artwork.photo,

      paintingType: artwork.paintingType,

      productCategory: artwork.productCategory,
    }));

    return NextResponse.json(
      {
        success: true,
        artworks: formattedArtworks,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("FINE ART API ERROR:");
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch fine art",
        error:
          error instanceof Error
            ? error.message
            : "Unknown server error",
      },
      {
        status: 500,
      }
    );
  }
}