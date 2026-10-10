import { getDb } from "@/lib/mongodb";
import FineArtListing from "./FineArtListing";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function FineArtPage() {
  const db = await getDb();

  const artworkDocuments = await db
    .collection("FineArt")
    .find({})
    .sort({ "Sl No": 1 })
    .toArray();

  const serializedArtworks = artworkDocuments.map((artwork: any) => ({
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
      "TCL Gallery",

    itemRefNo:
      artwork["Item Ref No"] ??
      artwork.itemRefNo ??
      "",

    title:
      artwork["Title of the Art"] ??
      artwork.titleOfArt ??
      "Untitled Artwork",

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

    paintingType:
      artwork["Painting Type"] ??
      artwork.paintingType ??
      "",

    withFrame:
      artwork["With Frame"] ??
      artwork.withFrame ??
      "",
  }));

  return (
    <FineArtListing
      artworks={serializedArtworks}
    />
  );
}