
import Link from "next/link";
import { getDb } from "@/lib/mongodb";
import type { Document } from "mongodb";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type BlogPost = {
  _id: { toString: () => string };
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  category?: string;
  featuredImage?: string;
  image?: string;
  imageUrl?: string;
  coverImage?: string;
  thumbnail?: string;
  featured_image?: string;
  status?: string;
  publishedAt?: Date | string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  seoTitle?: string;
};

// ======================================================
// IMAGE HELPER
// ======================================================

function getImage(post: BlogPost): string | null {
  const possibleImages = [
    post.featuredImage,
    post.coverImage,
    post.imageUrl,
    post.image,
    post.thumbnail,
    post.featured_image,
  ];

  for (const item of possibleImages) {
    if (typeof item !== "string") continue;

    const value = item.trim();

    if (
      !value ||
      value === "null" ||
      value === "undefined"
    ) {
      continue;
    }

    if (/^https?:\/\//i.test(value)) {
      return value;
    }

    if (value.startsWith("/")) {
      return value;
    }

    return `/${value}`;
  }

  return null;
}

// ======================================================
// DATE HELPER
// ======================================================

function getDate(post: BlogPost): string {
  const value = post.publishedAt || post.createdAt;

  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ======================================================
// EXCERPT HELPER
// ======================================================

function getExcerpt(post: BlogPost): string {
  if (post.excerpt?.trim()) {
    return post.excerpt.trim();
  }

  const plainText = (post.content || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return plainText.length > 160
    ? `${plainText.slice(0, 160).trim()}…`
    : plainText;
}

// ======================================================
// BLOG PAGE
// ======================================================

export default async function BlogPage() {
  let posts: BlogPost[] = [];

  try {
    const db = await getDb();

    const records = await db
      .collection("Blog")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    console.log("[Blog] Total documents:", records.length);

    // Hide drafts but retain older documents without a status.
    const visibleRecords = records.filter(
      (post: Document) => {
        const status = String(post.status ?? "")
          .trim()
          .toLowerCase();

        return status !== "draft";
      }
    );

    posts = visibleRecords.map((post: Document) => ({
      _id: post._id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,

      featuredImage: post.featuredImage,
      image: post.image,
      imageUrl: post.imageUrl,
      coverImage: post.coverImage,
      thumbnail: post.thumbnail,
      featured_image: post.featured_image,

      status: post.status,
      publishedAt: post.publishedAt,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      seoTitle: post.seoTitle,
    }));

    console.log("[Blog] Visible documents:", posts.length);
  } catch (error) {
    console.error("[Blog] Failed to fetch posts:", error);
  }

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#FBF9F0] text-[#2B211C]">

      {/* PAGE INTRODUCTION */}

      <section className="mx-auto w-full max-w-7xl px-5 pb-10 pt-20 sm:px-8 sm:pt-24">

        <nav className="mb-7 text-[11px] uppercase tracking-[2px] text-[#8B624B]">
          <Link href="/" className="hover:underline">
            Home
          </Link>

          <span className="mx-2">/</span>

          <span className="text-[#2B211C]">
            Blog
          </span>
        </nav>

        <p className="text-[11px] font-semibold uppercase tracking-[4px] text-[#8B624B]">
          The TCL Gallery Journal
        </p>

        <h1
          className="mt-4 max-w-4xl font-serif font-semibold tracking-tight"
          style={{
            fontSize: "clamp(32px, 5vw, 60px)",
            lineHeight: 1.15,
          }}
        >
          Stories, Art &amp; Inspiration
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-8 text-[#77716B] sm:text-lg">
          Explore the world of fine art, photography,
          thoughtful interiors, handcrafted creations
          and the stories behind the art that makes a
          space meaningful.
        </p>

        <div className="mt-8 h-px w-24 bg-[#8B624B]" />

      </section>

      {/* BLOG ARTICLES */}

      <section className="mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8">

        {posts.length > 0 ? (
          <>

            {/* SECTION HEADING */}

            <div className="mb-7 flex items-center justify-between gap-4">

              <h2
                className="font-serif font-semibold"
                style={{
                  fontSize: "28px",
                  lineHeight: 1.3,
                }}
              >
                Latest Articles
              </h2>

              <span className="text-[11px] uppercase tracking-[2px] text-[#8B624B]">
                {posts.length}{" "}
                {posts.length === 1 ? "Article" : "Articles"}
              </span>

            </div>

            {/* RESPONSIVE GRID */}

            <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">

              {posts.map((post) => {
                const title =
                  post.title?.trim() || "Untitled Article";

                const image = getImage(post);

                const articlePath = `/blog/${encodeURIComponent(
                  post.slug?.trim() || post._id.toString()
                )}`;

                return (

                  <article
                    key={post._id.toString()}
                    className="group flex w-full max-w-[360px] flex-col self-start overflow-hidden rounded-xl border border-[#E6DDD2] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(70,45,30,0.10)]"
                  >

                    {/* FEATURED IMAGE */}

                    <Link
                      href={articlePath}
                      className="block w-full"
                      aria-label={`Read ${title}`}
                    >

                      <div className="relative aspect-video w-full overflow-hidden bg-[#F0EBE2]">

                        {image ? (

                          <img
                            src={image}
                            alt={title}
                            loading="lazy"
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />

                        ) : (

                          <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-[#A99B8E]">
                            TCL Gallery Journal
                          </div>

                        )}

                      </div>

                    </Link>

                    {/* ARTICLE CONTENT */}

                    <div className="flex flex-col p-5">

                      {/* CATEGORY AND DATE */}

                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-semibold uppercase tracking-[1.5px] text-[#8B624B]">

                        {post.category && (
                          <span>{post.category}</span>
                        )}

                        {post.category && getDate(post) && (
                          <span aria-hidden="true">•</span>
                        )}

                        {getDate(post) && (
                          <span>{getDate(post)}</span>
                        )}

                      </div>

                      {/* ARTICLE TITLE */}

                      <div
                        role="heading"
                        aria-level={2}
                        className="mt-3 overflow-hidden font-serif font-semibold text-[#29231F]"
                        style={{
                          fontSize: "22px",
                          lineHeight: "1.3",
                          letterSpacing: "-0.5px",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >

                        <Link
                          href={articlePath}
                          className="transition-colors hover:text-[#8B624B]"
                        >
                          {title}
                        </Link>

                      </div>

                      {/* EXCERPT */}

                      <p
                        className="mt-3 overflow-hidden text-[#77716B]"
                        style={{
                          fontSize: "13px",
                          lineHeight: "1.7",
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {getExcerpt(post) ||
                          "Discover stories and inspiration from TCL Gallery."}
                      </p>

                      {/* READ MORE */}

                      <Link
                        href={articlePath}
                        className="mt-5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[1.5px] text-[#684633]"
                      >
                        Read Article

                        <span
                          className="transition-transform group-hover:translate-x-1"
                          aria-hidden="true"
                        >
                          →
                        </span>
                      </Link>

                    </div>

                  </article>

                );
              })}

            </div>

          </>

        ) : (

          /* EMPTY STATE */

          <div className="rounded-[22px] border border-dashed border-[#DCCFC1] bg-white/50 px-6 py-20 text-center">

            <p className="text-[11px] font-semibold uppercase tracking-[3px] text-[#8B624B]">
              Blog Journal
            </p>

            <h2
              className="mt-4 font-serif font-semibold"
              style={{
                fontSize: "30px",
                lineHeight: 1.3,
              }}
            >
              Stories are on their way
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#77716B]">
              We are preparing articles about art,
              photography, interior styling and
              handcrafted creations. Please visit
              again soon.
            </p>

            <Link
              href="/design-store"
              className="mt-7 inline-flex rounded-full bg-[#684633] px-7 py-3 text-[11px] font-semibold uppercase tracking-[1.5px] text-white transition hover:bg-[#4F3325]"
            >
              Explore Design Store
            </Link>

          </div>

        )}

      </section>

    </main>
  );
}
