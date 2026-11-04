
import type { Metadata } from "next";
import Link from "next/link";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Design Store | TCL Gallery",
  description:
    "Discover Jewel Tree, Nature Window and Living Legacy collections at TCL Gallery. Art, nature and craftsmanship for everyday living.",
};

type Product = {
  id: string;
  title: string;
  collection: string;
  image: string | null;
  referenceNo: string | null;
  size: string | null;
};

const collectionContent = [
  {
    name: "Jewel Tree",
    slug: "jewel-tree",
    number: "01",
    subtitle:
      "A collection inspired by nature, transformation, craftsmanship and the beauty of giving a new journey to something that has already lived a beautiful life.",
    storyTitle: "Giving a new journey to nature",
    story: [
      "Every Jewel Tree begins with a naturally dried branch that has already lived a beautiful life. Once part of a living tree, the branch has grown through seasons, experienced nature, and carried its own story. When that journey comes to an end, we believe its story does not have to end with it.",
      "At TCL Gallery Design Store, we carefully select these dried branches and give them a new journey of life. Each branch is transformed by hand, adorned with colourful beads, beautiful flowers, and delicate birds, giving it a new story to tell.",
      "The natural form of every branch remains at the heart of the creation. The colourful beads, flowers, and birds bring a new expression to something that might otherwise have been forgotten. Nature provides the branch, while the hands of the artist give it a new expression.",
      "No two Jewel Trees are exactly alike. Every branch has its own shape, character, and natural form. The colours, flowers, beads, and birds come together to create a piece that is unique to its own journey.",
      "The Jewel Tree represents renewal. It reminds us that something can change its form and still continue to bring beauty into the world. A branch that once belonged to a tree can become part of a home, a space, and the everyday lives of the people who choose it.",
      "By choosing a Jewel Tree, you are celebrating the beauty of nature, the value of handmade art, and the belief that every chapter of life can bring something beautiful.",
    ],
    closing:
      "A branch with a past, given a new story, and brought into your life.",
    background: "bg-[#F5F0E7]",
    accent: "text-[#876044]",
  },
  {
    name: "Nature Window",
    slug: "nature-window",
    number: "02",
    subtitle:
      "A collection inspired by the beauty of nature, bringing the colours, forms and feeling of the natural world into the spaces we live in.",
    storyTitle: "Bringing nature into your home",
    story: [
      "Today, many of us live surrounded by buildings, concrete, glass, and walls. The Nature Window Collection is our way of bringing a little of nature back into our homes.",
      "Inspired by leaves, branches, flowers, birds, and the beauty of the natural world, each Nature Window transforms an ordinary wall into a beautiful view that feels closer to a garden or a forest.",
      "It brings colour, freshness, and a sense of nature into everyday spaces. A simple wall can become a small reminder of the world outside and the beauty we often miss in our busy city lives.",
      "We hope every Nature Window makes your space feel a little more connected to nature and gives you something beautiful to enjoy every day.",
    ],
    closing: "Bring nature home.",
    background: "bg-[#F9F7F1]",
    accent: "text-[#64785B]",
  },
  {
    name: "Living Legacy",
    slug: "living-legacy",
    number: "03",
    subtitle:
      "A collection inspired by memories, stories, craftsmanship and the things we value enough to carry forward into the future.",
    storyTitle: "Stories that live beyond today",
    story: [
      "Some things become meaningful because of the memories, emotions and stories they hold. They become part of our lives and remind us of the people, places and moments we cherish.",
      "The Living Legacy Collection celebrates the beauty of preserving these meaningful connections through art and craftsmanship.",
      "Each creation is an expression of the things we value and the stories we wish to carry forward. It brings together thoughtful design, artistic expression and a sense of lasting meaning.",
      "We hope every Living Legacy creation becomes more than an object in your home. May it become a part of your story, something to treasure today and pass on to tomorrow.",
    ],
    closing: "Memories to cherish. Stories to carry forward.",
    background: "bg-[#F0EBE4]",
    accent: "text-[#876044]",
  },
];

// ======================================================
// HELPERS
// ======================================================

function getText(...values: unknown[]): string | null {
  for (const value of values) {
    if (typeof value !== "string" && typeof value !== "number") {
      continue;
    }

    const text = String(value).trim();

    if (text && text !== "null" && text !== "undefined") {
      return text;
    }
  }

  return null;
}

function normalizeImage(value: unknown): string | null {
  const image = getText(value);

  if (!image) return null;

  if (/^https?:\/\//i.test(image)) return image;

  if (image.startsWith("/")) return image;

  return `/${image}`;
}

function normalizeCollection(value: string): string {
  const collection = value.toLowerCase().trim();

  if (
    collection === "nature-window-collection" ||
    collection === "nature window collection"
  ) {
    return "nature-window";
  }

  return collection.replace(/\s+/g, "-");
}

// ======================================================
// DATABASE
// ======================================================

async function getProducts(): Promise<Product[]> {
  const db = await getDb();

  const rows = await db
    .collection("DesignStoreProduct")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return rows.map((item) => {
    const collection =
      getText(
        item.collection,
        item.Collection,
        item.COLLECTION
      ) ?? "";

    const image =
      normalizeImage(
        getText(
          item.image1,
          item.Image,
          item["Image 1"],
          item.image,
          item.Image1,
          item.imageUrl,
          item["Image URL"],
          item.mainImage,
          item["Main Image"],
          item.imagePath,
          item["Image Path"],
          item.cloudinaryUrl,
          item.secure_url
        )
      ) ??
      normalizeImage(item.image2 ?? item["Image 2"]) ??
      normalizeImage(item.image3 ?? item["Image 3"]) ??
      normalizeImage(item.image4 ?? item["Image 4"]);

    return {
      id: item._id.toString(),
      title:
        getText(
          item.title,
          item.Title,
          item["Product Title"],
          item["Product Name"],
          item.productName,
          item.name,
          item.Name
        ) ?? "Untitled Product",
      collection,
      image,
      referenceNo: getText(
        item.referenceNo,
        item["Reference No"],
        item.REFERENCE_NO,
        item.Reference,
        item.reference,
        item.refNo,
        item["Ref No"]
      ),
      size: getText(
        item.size,
        item.Size,
        item["Size Inches (h x w x d)"],
        item.Dimensions,
        item.dimensions
      ),
    };
  });
}

// ======================================================
// PRODUCT CARD
// ======================================================

function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/design-store/${encodeURIComponent(product.id)}`}
      className="group block"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#EAE4D9]">

        {product.image ? (
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-contain object-center transition-transform duration-700 group-hover:scale-[1.035]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[#9A8C7E]">
            Image coming soon
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-between bg-[#302720]/95 px-5 py-4 text-[10px] font-semibold uppercase tracking-[2px] text-white transition-transform duration-300 group-hover:translate-y-0">
          <span>Discover Artwork</span>
          <span>↗</span>
        </div>
      </div>

      <div className="flex items-start justify-between gap-3 border-b border-[#DCD2C6] py-5">
        <div>
          <h3 className="font-serif text-xl text-[#302720] transition-colors group-hover:text-[#876044]">
            {product.title}
          </h3>

          {product.referenceNo && (
            <p className="mt-2 text-[10px] uppercase tracking-[1.5px] text-[#95877A]">
              Ref: {product.referenceNo}
            </p>
          )}

          {product.size && (
            <p className="mt-1 text-xs text-[#95877A]">
              Size: {product.size}
            </p>
          )}
        </div>

        <span className="mt-1 text-lg text-[#876044] transition-transform group-hover:translate-x-1">
          ↗
        </span>
      </div>
    </Link>
  );
}

// ======================================================
// MAIN PAGE
// ======================================================

export default async function DesignStorePage() {
  const products = await getProducts();

  return (
    <main className="overflow-hidden bg-[#FBF9F3] text-[#302720]">

      {/* ================================================
          HERO
      ================================================= */}

      <section className="relative mx-auto max-w-[1600px] px-6 pb-20 pt-16 sm:px-10 md:pb-28 md:pt-24 lg:px-16">

        <div className="absolute right-8 top-20 hidden h-40 w-40 rounded-full border border-[#E6DCCF] lg:block" />
        <div className="absolute right-20 top-32 hidden h-16 w-16 rounded-full bg-[#F0E8DC] lg:block" />

        <div className="relative z-10">

          <div className="flex items-center gap-4">
            <span className="h-px w-12 bg-[#987153]" />
            <p className="text-[10px] font-semibold uppercase tracking-[5px] text-[#987153]">
              TCL Gallery / Curated Collections
            </p>
          </div>

          <h1 className="mt-8 max-w-5xl font-serif text-6xl font-medium leading-[0.98] tracking-tight text-[#302720] sm:text-7xl md:text-8xl lg:text-[112px]">
            Artful Living.
            <br />
            <span className="italic text-[#987153]">
              Meaningful Stories.
            </span>
          </h1>

          <div className="mt-12 grid gap-10 border-t border-[#DED4C8] pt-8 md:grid-cols-2 md:items-end">

            <p className="max-w-xl font-serif text-xl leading-relaxed text-[#5D4B3E] sm:text-2xl">
              Today Celebrate Life is more than a name. It is a
              philosophy that inspires us to see, appreciate,
              and celebrate the beauty that surrounds us every day.
            </p>

            <div className="max-w-xl space-y-4 text-sm leading-8 text-[#77716B] sm:ml-auto sm:text-base">

              <p>
                TCL Gallery Design Store is a space created from
                this philosophy. It brings together art, nature,
                design, craftsmanship, and stories that can become
                part of the spaces we live in.
              </p>

              <p>
                We believe that the things around us have the
                ability to shape how we experience our everyday
                lives. A beautiful object can bring colour into a
                room. A piece inspired by nature can bring a sense
                of the outdoors into our homes. A cherished image
                can bring back a memory.
              </p>

              <p>
                At TCL Gallery Design Store, we create and curate
                collections that are inspired by these simple
                experiences. Each collection has its own character
                and story, yet all of them share the same belief
                that art belongs in our everyday lives.
              </p>

            </div>

          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 text-[10px] font-semibold uppercase tracking-[2px] text-[#876044]">

            <a href="#jewel-tree" className="transition hover:text-[#302720]">
              01 — Jewel Tree
            </a>

            <a href="#nature-window" className="transition hover:text-[#302720]">
              02 — Nature Window
            </a>

            <a href="#living-legacy" className="transition hover:text-[#302720]">
              03 — Living Legacy
            </a>

          </div>

        </div>

      </section>

      {/* ================================================
          COLLECTIONS
      ================================================= */}

      {collectionContent.map((collection, index) => {
        const collectionProducts = products.filter(
          (product) =>
            normalizeCollection(product.collection) ===
            collection.slug
        );

        return (
          <section
            key={collection.slug}
            id={collection.slug}
            className={`${collection.background} scroll-mt-20 py-20 md:py-28`}
          >

            <div className="mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-16">

              {/* COLLECTION TITLE */}

              <div className="flex flex-wrap items-start justify-between gap-8 border-b border-[#D9CFC2] pb-12">

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[4px] text-[#987153]">
                    Collection / {collection.number}
                  </p>

                  <h2 className="mt-5 font-serif text-5xl font-medium tracking-tight text-[#302720] sm:text-6xl md:text-7xl lg:text-8xl">
                    {collection.name}
                  </h2>
                </div>

                <Link
                  href={`/design-store/collection/${collection.slug}`}
                  className="mt-3 inline-flex items-center gap-4 border-b border-[#987153] pb-3 text-[10px] font-semibold uppercase tracking-[2px] text-[#76563F] transition hover:gap-6"
                >
                  Explore Collection
                  <span>↗</span>
                </Link>

              </div>

              {/* COLLECTION INTRODUCTION */}

              <div className="grid gap-8 py-12 md:grid-cols-[1fr_1.4fr] md:items-center md:gap-20">

                <p className="font-serif text-2xl leading-relaxed text-[#5D4B3E] sm:text-3xl">
                  {collection.subtitle}
                </p>

                <div className="flex items-center gap-5 border-l border-[#BFA98F] pl-6 md:ml-auto md:max-w-md">
                  <span className="font-serif text-5xl italic text-[#B59B7D]">
                    {collection.number}
                  </span>

                  <p className="text-xs leading-6 text-[#817467]">
                    Thoughtfully created and curated at TCL Gallery,
                    celebrating the beauty of art and everyday living.
                  </p>
                </div>

              </div>

              {/* STORY */}

              <div className="grid gap-10 border-t border-[#D9CFC2] py-14 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">

                <div className="lg:sticky lg:top-28 lg:self-start">

                  <p className="text-[10px] font-semibold uppercase tracking-[3px] text-[#987153]">
                    Discover the inspiration
                  </p>

                  <h3 className="mt-5 max-w-sm font-serif text-4xl leading-tight text-[#302720] sm:text-5xl">
                    {collection.storyTitle}
                  </h3>

                  <div className="mt-8 h-px w-16 bg-[#987153]" />

                </div>

                <div className="space-y-7">

                  {collection.story.map((paragraph, paragraphIndex) => (
                    <p
                      key={paragraphIndex}
                      className="text-sm leading-8 text-[#74685E] sm:text-base sm:leading-9"
                    >
                      {paragraph}
                    </p>
                  ))}

                  <blockquote className="mt-10 border-l-2 border-[#987153] bg-white/40 px-7 py-8 sm:px-10">
                    <p className="font-serif text-2xl italic leading-relaxed text-[#76563F] sm:text-3xl">
                      “{collection.closing}”
                    </p>
                  </blockquote>

                </div>

              </div>

              {/* PRODUCTS */}

              <div className="border-t border-[#D9CFC2] pt-12">

                <div className="mb-10 flex flex-wrap items-end justify-between gap-5">

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[3px] text-[#987153]">
                      The collection
                    </p>

                    <h3 className="mt-3 font-serif text-3xl sm:text-4xl">
                      Selected Creations
                    </h3>
                  </div>

                  <p className="text-xs text-[#8F8174]">
                    {collectionProducts.length}{" "}
                    {collectionProducts.length === 1 ? "Artwork" : "Artworks"}
                  </p>

                </div>

                {collectionProducts.length > 0 ? (

                  <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-12">

                    {collectionProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                      />
                    ))}

                  </div>

                ) : (

                  <div className="border border-dashed border-[#D8CABC] px-6 py-16 text-center">
                    <p className="font-serif text-2xl text-[#76563F]">
                      New creations coming soon
                    </p>

                    <p className="mt-3 text-xs text-[#95877A]">
                      Please check back for our latest collection.
                    </p>
                  </div>

                )}

                <div className="mt-10 text-right">
                  <Link
                    href={`/design-store/collection/${collection.slug}`}
                    className="inline-flex items-center gap-4 text-[10px] font-semibold uppercase tracking-[2px] text-[#76563F] transition hover:gap-6"
                  >
                    View All {collection.name}
                    <span>↗</span>
                  </Link>
                </div>

              </div>

            </div>

          </section>
        );
      })}

      {/* ================================================
          BRAND PHILOSOPHY
      ================================================= */}

      <section className="relative overflow-hidden bg-[#302720] px-6 py-24 text-center text-[#F9F5EC] md:py-36">

        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full border border-white/10" />
        <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full border border-white/10" />

        <div className="relative z-10 mx-auto max-w-5xl">

          <p className="text-[10px] font-semibold uppercase tracking-[5px] text-[#C7A17D]">
            The TCL Gallery Philosophy
          </p>

          <h2 className="mt-9 font-serif text-5xl font-medium leading-tight sm:text-6xl md:text-8xl">
            Today.
            <br />
            <span className="italic text-[#C7A17D]">
              Celebrate Life.
            </span>
          </h2>

          <div className="mx-auto my-12 h-px w-20 bg-[#C7A17D]" />

          <p className="mx-auto max-w-3xl text-sm leading-8 text-[#D6CCC0] sm:text-base sm:leading-9">
            TCL Gallery Design Store brings together art, nature,
            design, craftsmanship, and stories that can become
            part of the spaces we live in.
          </p>

          <div className="mt-16 grid gap-10 border-t border-white/15 pt-12 sm:grid-cols-3">

            <div>
              <p className="font-serif text-xl text-[#E9D4BD]">
                Art for the spaces we live in.
              </p>
            </div>

            <div>
              <p className="font-serif text-xl text-[#E9D4BD]">
                Stories for the lives we create.
              </p>
            </div>

            <div>
              <p className="font-serif text-xl text-[#E9D4BD]">
                Beauty to celebrate every day.
              </p>
            </div>

          </div>

          <Link
            href="/contact"
            className="mt-16 inline-flex items-center gap-5 rounded-full border border-[#C7A17D] px-9 py-5 text-[10px] font-semibold uppercase tracking-[2px] text-[#F9F5EC] transition duration-300 hover:bg-[#C7A17D] hover:text-[#302720]"
          >
            Connect With Us
            <span>↗</span>
          </Link>

        </div>

      </section>

    </main>
  );
}
