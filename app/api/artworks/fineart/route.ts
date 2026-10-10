import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    console.log("Fetching Fine Art...");

    const db = await getDb();

    const artworks = await db
      .collection("FineArt")
      .find({
        "Product Category": "fine-art",
      })
      .limit(3)
      .toArray();

    console.log("Fine Art found:", artworks.length);

    const formattedArtworks = artworks.map(
      (artwork: any) => ({
        id: artwork._id?.toString(),

        slNo:
          artwork["Sl No"] ??
          artwork.slNo ??
          null,

        category:
          artwork["Category"] ??
          artwork.category ??
          null,

        artistName:
          artwork["Artist Name"] ??
          artwork.artistName ??
          null,

        itemRefNo:
          artwork["Item Ref No"] ??
          artwork.itemRefNo ??
          null,

        year:
          artwork["Year"] ??
          artwork.year ??
          null,

        image:
          artwork["Image 1"] ??
          artwork.image1 ??
          null,

        title:
          artwork["Title of the Art"] ??
          artwork.titleOfArt ??
          null,

        widthCms:
          artwork["Width (CMS)"] ??
          artwork.widthCms ??
          null,

        withFrame:
          artwork["With Frame"] ??
          artwork.withFrame ??
          null,

        photo:
          artwork["Photo"] ??
          artwork.photo ??
          null,

        paintingType:
          artwork["Painting Type"] ??
          artwork.paintingType ??
          null,

        productCategory:
          artwork["Product Category"] ??
          artwork.productCategory ??
          null,
      })
    );

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