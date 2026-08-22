import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

// Fallback dataset including Ranjit Sarkar, Sunil Barman, K.V. Kale, Farukh Nadaf, Dr. Gopal Jayaraman, Jhunu Sarkar, Niladri Ghosh, and others
const mockArtists: Record<string, any> = {
  "demo-ranjit": {
    id: "demo-ranjit",
    name: "Ranjit Sarkar",
    specialty: "Impressionist & Expressionist Fine Art",
    location: "Born in Kolkata (1975), India",
    bio: `Ranjit Sarkar's works reflect remembered moments as celebrations of memory rather than nostalgic expressions of longing. His art blends personal and collective memories, documenting socio-cultural events and sometimes reflecting the influence of governmental decisions.

His progressive outlook highlights themes such as women’s liberation, social change, and prosperity in life. Trained in a naturalistic painterly style, he intentionally breaks precise brushwork into impressionist, pointillist, and expressionist techniques, giving his narratives a prismatic and dynamic visual effect.`,
    exhibitions: [
      "Solo Show: 'The Inflection of Tones' – Nehru Centre, Worli, Mumbai (2023)",
      "Solo Show: 'Festive Celebration' – India Habitat Centre, New Delhi (2019)",
      "Solo Show: 'Abhirup' – Gurgaon, Haryana (2018)",
      "Solo Show: 'Vibration' – India Habitat Centre, New Delhi (2018)",
      "Trio Show: Gallery No. 7, Lalit Kala Akademi (2018)",
      "Group Show: 'Masterstroke' – Visual Arts Gallery, India Habitat Centre (2017)",
      "Participated in 10 solo shows and various group shows across Kolkata, Mumbai, Delhi, and abroad.",
    ],
    achievements: [
      "AIFACS Award (2017)",
      "Kalaspartan International Award",
      "Master Sangsar Chand Award",
      "Best Participant Artist (BHS)",
    ],
    imageUrl: "/images/Artist/Ranjith.png",
    products: [
      {
        id: "ranjit-work-1",
        title: "Celebration of Memory",
        category: "oil-on-canvas",
        price: 430,
        imageUrl: "/images/1.png",
      },
      {
        id: "ranjit-work-2",
        title: "Inflection of Tones",
        category: "impressionist",
        price: 390,
        imageUrl: "/images/2.png",
      },
    ],
  },
  "demo-sunil": {
    id: "demo-sunil",
    name: "Sunil Barman",
    specialty: "Nature & Rural Village Life",
    location: "Born in West Bengal (1963), India",
    bio: `Sunil Barman specializes in capturing nature and its beauty, which are his primary sources of inspiration. Through his paintings, he tries to capture the simplicity and quiet rhythm of village life, preserving everyday moments that often go unnoticed.`,
    exhibitions: [
      "Academy of Fine Arts (2018, 2019)",
      "Chemauld Art Gallery (2018)",
      "Birla Academy of Art & Culture (2019)",
      "International Show Kathmandu & Udaipur (2019)",
      "Chitrakala Parishath, Karnataka (2022, 2023, 2024)",
      "Chitra Santhe, Bangalore, Karnataka (2020, 2022, 2023, 2024)",
    ],
    imageUrl: "/images/Artist/Sunil.png",
    products: [
      { id: "sunil-work-1", title: "Rhythm of Village Life", category: "oil-on-canvas", price: 340, imageUrl: "/images/1.png" },
    ],
  },
  "demo-kale": {
    id: "demo-kale",
    name: "K.V. Kale",
    specialty: "Karnataka Folk & Contemporary Art",
    location: "Born in Sandur, 1970 | Karnataka, India",
    bio: `K.V. Kale blends traditional Karnataka folk traditions with modern artistic expression. His paintings explore rural Karnataka life and Indian Hindu mythology.`,
    exhibitions: [
      "84th All India Art Exhibition, AIFACS, New Delhi (2013)",
      "International Art Exhibition, Shanghai Art Museum, China (2015)",
    ],
    achievements: [
      "Kirumakki Award, London (1997)",
      "Government of India, HRD Recognition (1998–2000)",
    ],
    imageUrl: "/images/Artist/Kale.png",
    products: [
      { id: "kale-work-1", title: "Vijayanagar Heritage Reverie", category: "folk-art", price: 410, imageUrl: "/images/1.png" },
    ],
  },
  "demo-farukh": {
    id: "demo-farukh",
    name: "Farukh Nadaf",
    specialty: "Fine Art | Portraits | Landscapes | Contemporary",
    location: "Maharashtra, India",
    bio: `Farukh Nadaf is a versatile fine artist whose lifelong dedication to painting is reflected in his work across watercolor, oil, and acrylic mediums.`,
    exhibitions: [
      "Solo Show: Nehru Centre Art Gallery (2015, 2019) – Mumbai, India",
    ],
    achievements: [
      "International Watercolor Society (IWS) Award (2020)",
    ],
    imageUrl: "/images/Artist/Farukh.png",
    products: [
      { id: "farukh-work-1", title: "Serenade in Watercolour", category: "watercolour", price: 380, imageUrl: "/images/1.png" },
    ],
  },
  "demo-gopal": {
    id: "demo-gopal",
    name: "Dr. Gopal Jayaraman",
    specialty: "Art Educator | Art Researcher | Artist | Art Conservator | Art Therapist",
    location: "India",
    bio: `Dr. Gopal Jayaraman is a multidisciplinary art professional with over three decades of experience in Fine Art.`,
    qualifications: [
      "D.Litt. & Ph.D. in Art History – University of South Africa",
    ],
    imageUrl: "/images/Artist/Gopal.png",
    products: [{ id: "gopal-1", title: "Sacred Heritage & Spirituality", category: "temple-art", price: 520, imageUrl: "/images/1.png" }],
  },
  "demo-jhunu": {
    id: "demo-jhunu",
    name: "Jhunu Sarkar",
    specialty: "Abstract Art",
    location: "New Delhi, India (Born in Kolkata, 1984)",
    bio: `Jhunu Sarkar is an abstract artist based in New Delhi, India, whose works express silence, emotion, and color.`,
    exhibitions: [
      "Solo Show: 'Brishti' – India Habitat Centre, New Delhi (2023)",
    ],
    imageUrl: "/images/Artist/Jhunu.png",
    products: [{ id: "jhunu-1", title: "Brishti (Symphony of Rain)", category: "abstract", price: 350, imageUrl: "/images/1.png" }],
  },
  "demo-niladri": {
    id: "demo-niladri",
    name: "Niladri Ghosh",
    specialty: "Watercolour & Wildlife Art",
    location: "Alipurduar, West Bengal, India",
    bio: `Niladri Ghosh is an artist from West Bengal whose artistic practice is deeply inspired by forests, wildlife, and the relationship between nature and human life.`,
    achievements: ["Selected among top artists in ABU RAWASH Prize 2019"],
    imageUrl: "/images/Artist/Niladri.png",
    products: [{ id: "nil-1", title: "Resilience in the Forest Canopy", category: "watercolour", price: 320, imageUrl: "/images/1.png" }],
  },
};

export default async function ArtistDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  let artist = null;

  if (mockArtists[id]) {
    artist = mockArtists[id];
  } else {
    try {
      artist = await prisma.artist.findUnique({
  where: { id },

  select: {
    id: true,
    name: true,
    imageUrl: true,

    products: {
      select: {
        id: true,
        title: true,
        category: true,
        price12x18: true,
        price18x24: true,
        price24x33: true,
        imageUrl: true,
      },
    },
  },
});
    } catch (error) {
      console.error("Error fetching artist details:", error);
      notFound();
    }
  }

  if (!artist) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#FBF9F0] text-[#22211B] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#C4A892]/30 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-8">
          {artist.imageUrl ? (
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-2 border-[#C4A892]/40 shrink-0 shadow-md">
              <Image
                src={artist.imageUrl}
                alt={artist.name}
                fill
                priority
                sizes="(max-width: 640px) 144px, 176px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-[#7B8F50]/10 border-2 border-[#7B8F50]/30 shrink-0 flex items-center justify-center font-serif text-3xl font-bold text-[#7B8F50]">
              {artist.name ? artist.name.charAt(0) : "A"}
            </div>
          )}

          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2">
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#22211B]">
                {artist.name}
              </h1>
              {artist.location && (
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  📍 {artist.location}
                </span>
              )}
            </div>

            <p className="text-sm font-semibold uppercase tracking-wider text-[#7B8F50]">
              {artist.specialty}
            </p>

            {artist.bio && (
              <div className="text-base text-[#4A5568] leading-relaxed max-w-3xl pt-2 whitespace-pre-line space-y-4">
                {artist.bio}
              </div>
            )}

            {/* Qualifications */}
            {artist.qualifications && (
              <div className="pt-4 border-t border-[#C4A892]/20">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#22211B] mb-2">
                  Key Qualifications & Background
                </h3>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {artist.qualifications.map((item: string, idx: number) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Exhibitions */}
            {artist.exhibitions && (
              <div className="pt-4 border-t border-[#C4A892]/20">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#22211B] mb-2">
                  Solo & Group Exhibitions
                </h3>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {artist.exhibitions.map((item: string, idx: number) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Achievements & Awards */}
            {artist.achievements && (
              <div className="pt-4 border-t border-[#C4A892]/20">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#22211B] mb-2">
                  Selected Awards & Honors
                </h3>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {artist.achievements.map((item: string, idx: number) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Artworks Grid */}
        <section className="space-y-6">
          <div className="flex justify-between items-baseline border-b border-[#C4A892]/30 pb-4">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold">
              Artworks by {artist.name}
            </h2>
            <span className="text-xs font-bold uppercase tracking-wider text-[#7B8F50]">
              {artist.products?.length ?? 0}{" "}
              {artist.products?.length === 1 ? "Item" : "Items"}
            </span>
          </div>

          {artist.products && artist.products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {artist.products.map((product: any) => (
                <Link
                  key={product.id}
                  href={`/shop/${product.id}`}
                  className="group bg-white rounded-2xl border border-[#C4A892]/30 shadow-sm overflow-hidden hover:shadow-md transition duration-300 block"
                >
                  <div className="relative aspect-[4/3] w-full bg-[#F7FAFC]">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.title ?? product.name ?? "Artwork"}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                        No Image Available
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-serif text-lg font-bold group-hover:text-[#7B8F50] transition-colors">
                        {product.title ?? product.name}
                      </h3>
                      <p className="text-xs text-gray-500 capitalize mt-1">
                        {product.category}
                      </p>
                    </div>

                    <span className="font-semibold text-sm text-[#7B8F50] whitespace-nowrap">
                      ${typeof product.price === "number" ? product.price.toFixed(2) : product.price}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 text-center border border-[#C4A892]/30 text-gray-500">
              No artworks listed for this artist yet.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}