
import Link from "next/link";
import Image from "next/image";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

type Artist = {
  _id?: { toString(): string };
  name?: string;
  slug?: string;
  bio?: string;
  description?: string;
  image?: string;
  profileImage?: string;
  imageUrl?: string;
  artworkImage?: string;
  specialty?: string;
};

async function getArtists(): Promise<Artist[]> {
  try {
    const db = await getDb();

    const artists = await db
      .collection<Artist>("Artist")
      .find({})
      .sort({ name: 1 })
      .toArray();

    return JSON.parse(JSON.stringify(artists));
  } catch (error) {
    console.error("Failed to fetch artists:", error);
    return [];
  }
}

function getArtistImage(artist: Artist): string | null {
  return (
    artist.profileImage ||
    artist.image ||
    artist.imageUrl ||
    artist.artworkImage ||
    null
  );
}

export default async function ArtistsPage() {
  const artists = await getArtists();

  return (
    <main className="min-h-screen bg-[#faf9f6] text-[#24221f]">
      <section className="border-b border-[#e8e2d8] bg-[#f3eee5] px-5 py-16 text-center md:py-24">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#8b7355]">
          TCL Gallery · Today Celebrate Life
        </p>

        <h1 className="font-serif text-4xl md:text-6xl">
          Meet Our Artists
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#69645d] md:text-base">
          Discover the creative minds, unique perspectives, and artistic
          stories behind the collections at TCL Gallery.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#8b7355]">
              The people behind the art
            </p>
            <h2 className="mt-2 font-serif text-2xl md:text-3xl">
              Our Creative Community
            </h2>
          </div>

          <p className="text-sm text-[#777168]">
            {artists.length} {artists.length === 1 ? "Artist" : "Artists"}
          </p>
        </div>

        {artists.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {artists.map((artist, index) => {
              const id = artist._id?.toString();
              const slug = artist.slug || id;
              const image = getArtistImage(artist);
              const name = artist.name || "Featured Artist";

              return (
                <article
                  key={id || `${name}-${index}`}
                  className="group overflow-hidden border border-[#e9e3d9] bg-white transition-shadow duration-300 hover:shadow-lg"
                >
                  <Link
                    href={`/artists/${slug}`}
                    className="block"
                    aria-label={`View ${name}'s profile`}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#eee9e0]">
                      {image ? (
                        <Image
                          src={image}
                          alt={name}
                          fill
                          unoptimized
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="font-serif text-5xl text-[#a89a84]">
                            {name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      {artist.specialty && (
                        <p className="text-xs uppercase tracking-[0.18em] text-[#9a7b50]">
                          {artist.specialty}
                        </p>
                      )}

                      <h3 className="mt-2 font-serif text-2xl">
                        {name}
                      </h3>

                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#777168]">
                        {artist.bio ||
                          artist.description ||
                          "Explore the artist's creative journey and discover their work at TCL Gallery."}
                      </p>

                      <span className="mt-5 inline-block border-b border-[#9a7b50] pb-1 text-sm">
                        Explore Artist →
                      </span>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="border border-dashed border-[#d9d0c3] bg-white px-6 py-16 text-center">
            <h3 className="font-serif text-2xl">Artists Coming Soon</h3>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#777168]">
              We are preparing our artist profiles. Please explore our gallery
              collections in the meantime.
            </p>

            <Link
              href="/shop"
              className="mt-6 inline-block bg-[#24221f] px-7 py-3 text-sm text-white transition hover:bg-[#4b463f]"
            >
              Explore Collections
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
