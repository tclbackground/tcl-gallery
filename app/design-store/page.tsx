
import Link from "next/link";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

/* =========================================================
   NORMALIZE IMAGE PATH
========================================================= */

function normalizeImagePath(image: unknown): string | null {
  if (typeof image !== "string") {
    return null;
  }

  let value = image.trim();

  if (
    !value ||
    value === "null" ||
    value === "undefined"
  ) {
    return null;
  }

  value = value.replace(
    /\s+(\.[a-zA-Z0-9]+)$/,
    "$1"
  );

  // Cloudinary or external image URL.
  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  // Next.js public directory path.
  if (value.startsWith("/")) {
    return value;
  }

  return `/${value}`;
}

/* =========================================================
   GET FIRST AVAILABLE VALUE
========================================================= */

function getValue(
  row: Record<string, any>,
  fields: string[]
): any {
  for (const field of fields) {
    const value = row?.[field];

    if (
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ""
    ) {
      return value;
    }
  }

  return null;
}

/* =========================================================
   FIND PRODUCT IMAGE
========================================================= */

function getProductImage(
  row: Record<string, any>
): string | null {
  const imageFields = [
    "image1",
    "Image1",
    "IMAGE1",
    "image",
    "Image",
    "IMAGE",
    "imageUrl",
    "imageURL",
    "ImageUrl",
    "Image URL",
    "photo",
    "Photo",
    "PHOTO",
    "mainImage",
    "Main Image",
    "imagePath",
    "Image Path",
    "fileUrl",
    "File URL",
    "cloudinaryUrl",
    "cloudinaryURL",
    "secureUrl",
    "secure_url",
  ];

  // Return the first usable image value.
  for (const field of imageFields) {
    const image = normalizeImagePath(row?.[field]);

    if (image) {
      return image;
    }
  }

  return null;
}

/* =========================================================
   MAP PRODUCT
========================================================= */

function mapProductRow(
  row: Record<string, any>
): ProductCard {
  const id =
    row?._id?.toString?.() ??
    row?.id?.toString?.() ??
    "";

  const titleValue = getValue(row, [
    "title",
    "TITLE",
    "Title",
    "productTitle",
    "Product Title",
    "productName",
    "Product Name",
    "name",
    "Name",
  ]);

  const referenceValue = getValue(row, [
    "referenceNo",
    "REFERENCE NO",
    "Reference No",
    "reference",
    "Reference",
    "refNo",
    "Ref No",
    "itemRefNo",
    "Item Ref No",
    "ITEM REF NO",
  ]);

  const sizeValue = getValue(row, [
    "size",
    "SIZE",
    "Size",
    "dimensions",
    "Dimensions",
    "DIMENSIONS",
    "Size Inches (h x w x d)",
    "size Inches (h x w x d)",
  ]);

  return {
    id,
    title:
      String(titleValue ?? "").trim() ||
      "Untitled Product",
    image: getProductImage(row),
    referenceNo:
      String(referenceValue ?? "").trim() || null,
    size:
      String(sizeValue ?? "").trim() || null,
  };
}

/* =========================================================
   GET DESIGN STORE DATA
========================================================= */

async function getDesignStoreData(): Promise<
  CollectionSection[]
> {
  const db = await getDb();

  async function fetchProducts(
    collectionSlugs: string[]
  ): Promise<ProductCard[]> {
    const filter = {
      $or: [
        { collection: { $in: collectionSlugs } },
        { COLLECTION: { $in: collectionSlugs } },
        { Collection: { $in: collectionSlugs } },
      ],
    };

    const [legacyRows, newRows] = await Promise.all([
      db.collection("JewelTree")
        .find(filter)
        .toArray(),

      db.collection("DesignStoreProduct")
        .find(filter)
        .toArray(),
    ]);

    // Prefer newer uploads on the homepage.
    const rows = [...newRows, ...legacyRows];

    const products = rows
      .map(mapProductRow)
      .filter((product) => product.id !== "");

    // Avoid showing the same MongoDB document twice.
    const seen = new Set<string>();

    const uniqueProducts = products.filter((product) => {
      if (seen.has(product.id)) {
        return false;
      }

      seen.add(product.id);
      return true;
    });

    // Keep the existing three-card homepage layout.
    return uniqueProducts.slice(0, 3);
  }

  const [
    jewelTreeProducts,
    natureWindowProducts,
    livingLegacyProducts,
  ] = await Promise.all([
    fetchProducts(["jewel-tree"]),
    fetchProducts([
      "nature-window",
      "nature-window-collection",
    ]),
    fetchProducts(["living-legacy"]),
  ]);

  console.log("[TCL Design Store] Product counts:", {
    jewelTree: jewelTreeProducts.length,
    natureWindow: natureWindowProducts.length,
    livingLegacy: livingLegacyProducts.length,
  });

  return [
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
      products: jewelTreeProducts,
    },
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
      products: natureWindowProducts,
    },
    {
      slug: "living-legacy",
      title: "Living Legacy",
      description:
        "A collection inspired by memories, stories, craftsmanship and the things we value enough to carry forward into the future.",
      products: livingLegacyProducts,
    },
  ];
}

/* =========================================================
   DESIGN STORE PAGE
========================================================= */

export default async function DesignStorePage() {
  const collections = await getDesignStoreData();

  return (
    <main className="min-h-screen bg-[#FBF9F0] text-[#2B211C]">
      {/* INTRO */}
      <section className="w-full px-6 pb-20 pt-36 sm:px-10 lg:px-16 xl:px-20">
        <p className="text-[11px] font-semibold uppercase tracking-[4px] text-[#8B624B]">
          TCL Design Store
        </p>

        <h1 className="mt-5 font-serif text-5xl font-semibold tracking-tight text-[#29231F] sm:text-6xl lg:text-7xl">
          Design Store
        </h1>

        <div className="mt-8">
          <p className="w-full text-lg leading-9 text-[#77716B] sm:text-xl">
            Today Celebrate Life is more than a name. It is a
            philosophy that inspires us to see, appreciate, and
            celebrate the beauty that surrounds us every day.

            <br />
            <br />

            TCL Gallery Design Store is a space created from this
            philosophy. It brings together art, nature, design,
            craftsmanship, and stories that can become part of
            the spaces we live in.

            <br />
            <br />

            We believe that the things around us have the ability
            to shape how we experience our everyday lives. A
            beautiful object can bring colour into a room. A piece
            inspired by nature can bring a sense of the outdoors
            into our homes. A cherished image can bring back a
            memory.
          </p>
        </div>
      </section>

      {/* COLLECTIONS */}
      <section className="w-full px-6 pb-28 sm:px-10 lg:px-16 xl:px-20">
        <div className="space-y-28">
          {collections.map((collection) => (
            <section key={collection.slug}>
              {/* COLLECTION HEADER */}
              <div className="mb-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[4px] text-[#8B624B]">
                    TCL Design Store
                  </p>

                  <h2 className="mt-4 font-serif text-5xl font-semibold tracking-tight text-[#29231F] sm:text-6xl">
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

              {/* COLLECTION STORY */}
              {collection.story && (
                <div className="mb-16 w-full border-t border-[#DED4C8] pt-12">
                  <p className="text-[11px] font-semibold uppercase tracking-[4px] text-[#8B624B]">
                    The Story of {collection.title}
                  </p>

                  <h3 className="mt-4 font-serif text-3xl font-semibold text-[#29231F] sm:text-4xl lg:text-5xl">
                    {collection.story.heading}
                  </h3>

                  <div className="mt-8 space-y-6">
                    {collection.story.paragraphs.map(
                      (paragraph, index) => (
                        <p
                          key={index}
                          className="text-base leading-8 text-[#665F59] sm:text-lg"
                        >
                          {paragraph}
                        </p>
                      )
                    )}
                  </div>

                  {collection.story.closing && (
                    <div className="mt-12">
                      <div className="mb-6 h-px w-16 bg-[#8B624B]" />

                      <p className="font-serif text-xl text-[#684633] sm:text-2xl">
                        {collection.story.closing}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* PRODUCTS */}
              {collection.products.length > 0 ? (
                <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
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
                            No Image Available
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
    </main>
  );
}
