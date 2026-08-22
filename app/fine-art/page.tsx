import prisma from "@/lib/prisma";
import FineArtListing from "./FineArtListing";


export const dynamic = "force-dynamic";

export default async function FineArtPage() {
  const artworks = await prisma.fineArt.findMany({
    orderBy: {
      slNo: "asc",
    },
  });

  const serializedArtworks = artworks.map((artwork) => ({
    id: artwork.id,
    slNo: artwork.slNo ?? 0,

    category:
      artwork.category ?? "Fine Art",

    artistName:
      artwork.artistName ?? "TCL Gallery",

    itemRefNo:
      artwork.itemRefNo ?? "",

    title:
      artwork.titleOfArt ?? "Untitled Artwork",

    image1:
      artwork.image1 ?? "",

    image2:
      artwork.image2 ?? "",

    image3:
      artwork.image3 ?? "",

    paintingType:
      artwork.paintingType ?? "",

    withFrame:
      artwork.withFrame ?? "",
  }));

  return (
    <FineArtListing
      artworks={serializedArtworks}
    />
  );
}