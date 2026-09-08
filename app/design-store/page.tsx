import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type ProductCard = {
  id: string;
  title: string;
  image: string | null;
  referenceNo: string | null;
  size: string | null;
};

type CollectionStory = {
  heading: string;
  paragraphs: string[];
  closing?: string;
};

type CollectionSection = {
  slug: string;
  title: string;
  description: string;
  story?: CollectionStory;
  products: ProductCard[];
};

function normalizeImagePath(
  image: string | null | undefined
): string | null {
  if (!image) return null;

  let val = image.trim();

  if (!val || val === "null" || val === "undefined") {
    return null;
  }

  // Clean trailing space before extension
  // Example: "hope .png" -> "hope.png"
  val = val.replace(/\s+(\.[a-zA-Z0-9]+)$/, "$1");

  if (
    val.startsWith("/") ||
    val.startsWith("http://") ||
    val.startsWith("https://")
  ) {
    return val;
  }

  return `/${val}`;
}

async function getDesignStoreData(): Promise<CollectionSection[]> {
  // =========================================================
  // 1. JEWEL TREE
  // =========================================================

  const jewelTreeRows = await prisma.jewelTree.findMany({
    where: {
      collection: "jewel-tree",
    },
    orderBy: {
      slNo: "asc",
    },
    take: 3,
  });

  // =========================================================
  // 2. NATURE WINDOW
  // =========================================================

  const natureWindowRows = await prisma.jewelTree.findMany({
    where: {
      collection: {
        in: ["nature-window-collection", "nature-window"],
      },
    },
    orderBy: {
      slNo: "asc",
    },
    take: 3,
  });

  // =========================================================
  // 3. LIVING LEGACY
  // =========================================================

  const livingLegacyRows = await prisma.jewelTree.findMany({
    where: {
      collection: "living-legacy",
    },
    orderBy: {
      slNo: "asc",
    },
    take: 3,
  });

  const mapRows = (rows: any[]): ProductCard[] =>
    rows.map((row) => ({
      id: String(row.id),
      title: row.title?.trim() || "Untitled Product",
      image: normalizeImagePath(row.image),
      referenceNo: row.referenceNo?.trim() || null,
      size: row.size?.trim() || null,
    }));

  return [
    // =======================================================
    // JEWEL TREE
    // =======================================================

    {
      slug: "jewel-tree",
      title: "Jewel Tree",

      description:
        "A collection inspired by nature, transformation, craftsmanship and the beauty of giving a new journey to something that has already lived a beautiful life.",

      story: {
        heading: "Giving a new journey to nature",

        paragraphs: [
          "Every Jewel Tree begins with a naturally dried branch that has already lived a beautiful life. Once part of a living tree, the branch has grown through seasons, experienced nature, and carried its own story. When that journey comes to an end, we believe its story does not have to end with it.",

          "At TCL Gallery Design Store, we carefully select these dried branches and give them a new journey of life. Each branch is transformed by hand, adorned with colourful beads, beautiful flowers, and delicate birds, giving it a new story to tell.",

          "The natural form of every branch remains at the heart of the creation. The colourful beads, flowers, and birds bring a new expression to something that might otherwise have been forgotten. Nature provides the branch, while the hands of the artist give it a new expression.",

          "No two Jewel Trees are exactly alike. Every branch has its own shape, character, and natural form. The colours, flowers, beads, and birds come together to create a piece that is unique to its own journey.",

          "The Jewel Tree represents renewal. It reminds us that something can change its form and still continue to bring beauty into the world. A branch that once belonged to a tree can become part of a home, a space, and the everyday lives of the people who choose it.",

          "By choosing a Jewel Tree, you are celebrating the beauty of nature, the value of handmade art, and the belief that every chapter of life can bring something beautiful.",

          "We hope your Jewel Tree becomes more than a decoration. May it bring colour and joy to your space, remind you to appreciate the beauty around you, embrace every season of life, and cherish the gift of today.",
        ],

        closing:
          "A branch with a past, given a new story, and brought into your life.",
      },

      products: mapRows(jewelTreeRows),
    },

    // =======================================================
    // NATURE WINDOW
    // =======================================================

    {
      slug: "nature-window",
      title: "Nature Window",

      description:
        "A collection inspired by the beauty of nature, bringing the colours, forms and feeling of the natural world into the spaces we live in.",

      story: {
        heading: "Bringing nature into your home",

        paragraphs: [
          "Today, many of us live surrounded by buildings, concrete, glass, and walls. The Nature Window Collection is our way of bringing a little of nature back into our homes.",

          "Inspired by leaves, branches, flowers, birds, and the beauty of the natural world, each Nature Window transforms an ordinary wall into a beautiful view that feels closer to a garden or a forest.",

          "It brings colour, freshness, and a sense of nature into everyday spaces. A simple wall can become a small reminder of the world outside and the beauty we often miss in our busy city lives.",

          "We hope every Nature Window makes your space feel a little more connected to nature and gives you something beautiful to enjoy every day.",
        ],

        closing: "Bring nature home.",
      },

      products: mapRows(natureWindowRows),
    },

    // =======================================================
    // LIVING LEGACY
    // =======================================================

    {
      slug: "living-legacy",
      title: "Living Legacy",

      description:
        "A collection inspired by memories, stories, craftsmanship and the things we value enough to carry forward into the future.",

      products: mapRows(livingLegacyRows),
    },
  ];
}

export default async function DesignStorePage() {
  const collections = await getDesignStoreData();

  return (
    <main className="min-h-screen bg-[#FBF9F0] text-[#2B211C]">

      {/* =========================================================
          DESIGN STORE INTRODUCTION
          FULL WIDTH
      ========================================================= */}

      <section className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 pt-36 pb-20">

        <p className="text-[11px] font-semibold uppercase tracking-[4px] text-[#8B624B]">
          TCL Design Store
        </p>

        <h1 className="mt-5 font-serif text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-[#29231F]">
          Design Store
        </h1>

        <div className="mt-8 w-full">

          <p className="w-full text-lg sm:text-xl leading-9 text-[#77716B]">

            Today Celebrate Life is more than a name. It is a philosophy that
            inspires us to see, appreciate, and celebrate the beauty that
            surrounds us every day.

            <br />
            <br />

            TCL Gallery Design Store is a space created from this philosophy.
            It brings together art, nature, design, craftsmanship, and stories
            that can become part of the spaces we live in.

            <br />
            <br />

            We believe that the things around us have the ability to shape how
            we experience our everyday lives. A beautiful object can bring
            colour into a room. A piece inspired by nature can bring a sense of
            the outdoors into our homes. A cherished image can bring back a
            memory. A thoughtfully created artwork can become something that
            stays with us for years.

            <br />
            <br />

            At TCL Gallery Design Store, we create and curate collections that
            are inspired by these simple experiences. Each collection has its
            own character and story, yet all of them share the same belief that
            art belongs in our everyday lives.

          </p>

        </div>

      </section>


      {/* =========================================================
          COLLECTIONS
      ========================================================= */}

      <section className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 pb-28">

        <div className="space-y-28">

          {collections.map((collection) => (

            <section key={collection.slug}>

              {/* =================================================
                  COLLECTION HEADER
              ================================================= */}

              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-10">

                <div>

                  <p className="text-[11px] font-semibold uppercase tracking-[4px] text-[#8B624B]">
                    TCL Design Store
                  </p>

                  <h2 className="mt-4 font-serif text-5xl sm:text-6xl font-semibold tracking-tight text-[#29231F]">
                    {collection.title}
                  </h2>

                  <p className="mt-4 max-w-5xl text-base leading-7 text-[#77716B]">
                    {collection.description}
                  </p>

                </div>

                <Link
                  href={`/design-store/collection/${encodeURIComponent(
                    collection.slug
                  )}`}
                  className="inline-flex shrink-0 items-center justify-center rounded-full border border-[#684633] px-8 py-4 text-[11px] font-semibold uppercase tracking-[2px] text-[#684633] transition hover:bg-[#684633] hover:text-white"
                >
                  View Collection →
                </Link>

              </div>


              {/* =================================================
                  COLLECTION STORY
                  FULL WIDTH
              ================================================= */}

              {collection.story && (

                <div className="w-full mb-16 border-t border-[#DED4C8] pt-12">

                  <div className="w-full">

                    <p className="text-[11px] font-semibold uppercase tracking-[4px] text-[#8B624B]">
                      The Story of {collection.title}
                    </p>

                    <h3 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#29231F]">
                      {collection.story.heading}
                    </h3>

                    <div className="mt-8 w-full space-y-6">

                      {collection.story.paragraphs.map(
                        (paragraph, index) => (

                          <p
                            key={index}
                            className="w-full text-base sm:text-lg leading-8 text-[#665F59]"
                          >
                            {paragraph}
                          </p>

                        )
                      )}

                    </div>


                    {collection.story.closing && (

                      <div className="mt-12">

                        <div className="h-px w-16 bg-[#8B624B] mb-6" />

                        <p className="font-serif text-xl sm:text-2xl text-[#684633]">
                          {collection.story.closing}
                        </p>

                      </div>

                    )}

                  </div>

                </div>

              )}


              {/* =================================================
                  PRODUCTS
              ================================================= */}

              {collection.products.length > 0 ? (

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">

                  {collection.products.map((product) => (

                    <Link
                      key={`${collection.slug}-${product.id}`}
                      href={`/design-store/${encodeURIComponent(
                        product.id
                      )}`}
                      className="group block overflow-hidden rounded-[22px] border border-[#E6DDD2] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(70,45,30,0.10)]"
                    >

                      {/* IMAGE */}

                      <div className="relative aspect-[4/3] overflow-hidden bg-[#F2EDE5]">

                        {product.image ? (

                          <img
                            src={product.image}
                            alt={product.title}
                            loading="lazy"
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />

                        ) : (

                          <div className="absolute inset-0 flex items-center justify-center text-sm text-[#B5A99D]">
                            No Image
                          </div>

                        )}

                      </div>


                      {/* PRODUCT DETAILS */}

                      <div className="p-6">

                        <h3 className="font-serif text-2xl font-semibold leading-tight text-[#29231F]">
                          {product.title}
                        </h3>

                        {product.referenceNo && (

                          <p className="mt-4 text-xs text-[#9A9189]">
                            Ref: {product.referenceNo}
                          </p>

                        )}

                        {product.size && (

                          <p className="mt-2 text-xs text-[#9A9189]">
                            Size: {product.size}
                          </p>

                        )}

                        <div className="mt-6 inline-flex items-center justify-center rounded-full bg-[#684633] px-6 py-3 text-[11px] font-semibold uppercase tracking-[1.5px] text-white transition group-hover:bg-[#4F3325]">
                          Enquire Now
                        </div>

                      </div>

                    </Link>

                  ))}

                </div>

              ) : (

                <div className="rounded-[22px] border border-dashed border-[#DCCFC1] bg-white/40 py-20 text-center text-[#A99B8E]">
                  Products coming soon.
                </div>

              )}

            </section>

          ))}

        </div>

      </section>


      {/* =========================================================
          TODAY CELEBRATE LIFE
          FULL WIDTH
      ========================================================= */}

      <section className="w-full border-t border-[#DED4C8] bg-[#F5F0E7]">

        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 py-24">

          <p className="text-[11px] font-semibold uppercase tracking-[4px] text-[#8B624B]">
            TCL Gallery Design Store
          </p>

          <h2 className="mt-5 font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#29231F]">
            Today Celebrate Life
          </h2>

          <div className="mt-8 w-full">

            <p className="w-full text-lg sm:text-xl leading-9 text-[#665F59]">

              TCL Gallery Design Store brings together art, nature, design,
              craftsmanship, and stories that can become part of the spaces we
              live in.

              <br />
              <br />

              We believe that the things around us can shape how we experience
              our everyday lives. A beautiful object can bring colour into a
              room. Art inspired by nature can bring the feeling of the
              outdoors into our homes. A cherished piece can remind us of a
              person, a place, or a moment we want to keep close.

              <br />
              <br />

              Our collections are created from this belief. Each one has its
              own character and story, while sharing the same idea that art
              belongs in our everyday lives.

            </p>

          </div>


          <div className="mt-14">

            <p className="font-serif text-2xl sm:text-3xl text-[#4B392E]">
              Art for the spaces we live in.
            </p>

            <p className="mt-2 font-serif text-2xl sm:text-3xl text-[#4B392E]">
              Stories for the lives we create.
            </p>

            <p className="mt-2 font-serif text-2xl sm:text-3xl text-[#4B392E]">
              Beauty to celebrate every day.
            </p>

          </div>


          <div className="mt-10">

            <div className="h-px w-16 bg-[#8B624B] mb-6" />

            <p className="font-serif text-xl text-[#684633]">
              Today. Celebrate Life.
            </p>

          </div>

        </div>

      </section>

    </main>
  );
}