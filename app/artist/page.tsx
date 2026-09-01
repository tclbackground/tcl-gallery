import { prisma } from "@/lib/prisma";
import ArtistsFilterView from "./ArtistsFilterView";

export const revalidate = 0;

// Main roster list featuring TCL Gallery artists
const featuredArtists = [
  {
    id: "demo-ranjit",
    name: "Ranjit Sarkar",
    specialty: "Painters",
    location: "Kolkata, West Bengal, India",
    bio: "Explores celebrations of memory through naturalistic, pointillist, and expressionist techniques focusing on socio-cultural themes and women's liberation.",
    imageUrl: "/images/Artist/Ranjith.png",
    _count: {
      products: 2,
    },
  },
  {
    id: "demo-sunil",
    name: "Sunil Barman",
    specialty: "Painters",
    location: "West Bengal, India",
    bio: "Specializes in capturing nature and the quiet rhythm of rural village life, preserving subtle everyday moments through art.",
    imageUrl: "/images/Artist/Sunil.png",
    _count: {
      products: 2,
    },
  },
  {
    id: "demo-kale",
    name: "K.V. Kale",
    specialty: "Painters",
    location: "Karnataka, India",
    bio: "K.V. Kale blends traditional Karnataka folk traditions with modern artistic expression, exploring rural life and Hindu mythology with vibrant colours and expressive figures.",
    imageUrl: "/images/Artist/Kale.png",
    _count: {
      products: 2,
    },
  },
  {
    id: "demo-farukh",
    name: "Farukh Nadaf",
    specialty: "Painters",
    location: "Maharashtra, India",
    bio: "Versatile fine artist whose lifelong dedication to painting spans watercolor, oil, and acrylic mediums across portraits, landscapes, and contemporary art.",
    imageUrl: "/images/Artist/Farukh.png",
    _count: {
      products: 2,
    },
  },
  {
    id: "demo-jhunu",
    name: "Jhunu Sarkar",
    specialty: "Abstract Art",
    location: "New Delhi, India",
    bio: "Jhunu Sarkar is an abstract artist based in New Delhi, India, whose works express silence, emotion, and color inspired by nature, spirituality, and her Bengali heritage.",
    imageUrl: "/images/Artist/Jhunu.png",
    _count: {
      products: 2,
    },
  },
  {
    id: "demo-gopal",
    name: "Dr. Gopal Jayaraman",
    specialty: "Fine Art, Conservation & Therapy",
    location: "India",
    bio: "Multidisciplinary art professional with over three decades of experience specializing in creative painting, art education, research, conservation, and art therapy.",
    imageUrl: "/images/Artist/Gopal.png",
    _count: {
      products: 2,
    },
  },
  {
    id: "demo-niladri",
    name: "Niladri Ghosh",
    specialty: "Watercolour & Wildlife Art",
    location: "Alipurduar, West Bengal, India",
    bio: "Niladri Ghosh is an artist from West Bengal whose artistic practice is deeply inspired by forests, wildlife, and ecological conservation.",
    imageUrl: "/images/Artist/Niladri.png",
    _count: {
      products: 2,
    },
  },
];

export default async function ArtistsPage() {
  try {
    const rawArtists = await prisma.artist.findMany({
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Convert Prisma data to plain JavaScript objects
    const dbArtists = JSON.parse(JSON.stringify(rawArtists));

    // Start with featured artists
    const combinedArtists = [...featuredArtists];

    // Add database artists while avoiding duplicate IDs or names
    dbArtists.forEach((dbArtist: any) => {
      const dbArtistName =
        typeof dbArtist.name === "string"
          ? dbArtist.name.trim().toLowerCase()
          : "";

      const exists = combinedArtists.some((artist) => {
        const artistName =
          typeof artist.name === "string"
            ? artist.name.trim().toLowerCase()
            : "";

        // Match by ID
        if (artist.id === dbArtist.id) {
          return true;
        }

        // Match by name only if both names exist
        if (
          artistName !== "" &&
          dbArtistName !== "" &&
          artistName === dbArtistName
        ) {
          return true;
        }

        return false;
      });

      // Add only if it is not already in the featured/database list
      if (!exists) {
        combinedArtists.push(dbArtist);
      }
    });

    return (
      <ArtistsFilterView
        initialArtists={combinedArtists}
      />
    );
  } catch (error) {
    console.error(
      "Database fetch failed on /artist page:",
      error
    );

    // Fallback: show featured artists if database query fails
    return (
      <ArtistsFilterView
        initialArtists={featuredArtists}
      />
    );
  }
}