import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import {
  FiArrowRight,
  FiFilter,
  FiGrid,
  FiMapPin,
  FiAward,
} from "react-icons/fi";
import ArtistsFilterView from "./ArtistsFilterView";


export const revalidate = 0; // Ensures fresh data is fetched on every request

export default async function ArtistsPage() {
  // 1. Fetch artists from MongoDB via Prisma on the server
  const artists = await prisma.artist.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // 2. Render Client View with server-fetched data
  return <ArtistsFilterView initialArtists={artists} />;
}