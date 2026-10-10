
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
  status?: string;
  publishedAt?: Date | string | null;
  createdAt?: Date | string;
  seoTitle?: string;
};

function getImage(post: BlogPost): string | null {
  const value = post.featuredImage?.trim();

  if (!value || value === "null" || value === "undefined") {
    return null;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return value.startsWith("/") ? value : `/${value}`;
}

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

export default async function BlogPage() {
  let posts: BlogPost[] = [];

  try {
    const db = await getDb();

    const records = await db
      .collection("Blog")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Temporary diagnostic log: check your development terminal.
    console.log("[Blog] Total documents:", records.length);

    const visibleRecords = records.filter((post: Document) => {
      const status = String(post.status ?? "")
        .trim()
        .toLowerCase();

      // Hide explicit drafts. Older documents without status remain visible.
      return status !== "draft";
    });

    console.log("[Blog] Visible documents:", visibleRecords.length);

    posts = visibleRecords.map((post: Document) => ({
      _id: post._id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      featuredImage: post.featuredImage,
      status: post.status,
      publishedAt: post.publishedAt,
      createdAt: post.createdAt,
      seoTitle: post.seoTitle,
    }));
  } catch (error) {
    console.error("[Blog] Failed to fetch posts:", error);
  }

  return (
    <main className="min-h-screen bg-[#FBF9F0] text-[#2B211C]">
      <section className="mx-auto max-w-7xl px-6 pb-14 pt-24 sm:px-10 sm:pt-32">
        <nav className="mb-8 text-[11px] uppercase tracking-[2px] text-[#8B624B]">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[#2B211C]">Blog</span>
        </nav>

        <p className="text-[11px] font-semibold uppercase tracking-[4px] text-[#8B624B]">
          The TCL Gallery Journal
        </p>

        <h1 className="mt-4 max-w-4xl font-serif text-5xl font-semibold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
          Stories, Art &amp; Inspiration
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-8 text-[#77716B] sm:text-lg">
          Explore the world of fine art, photography, thoughtful
          interiors, handcrafted creations and the stories behind
          the art that makes a space meaningful.
        </p>

        <div className="mt-8 h-px w-24 bg-[#8B624B]" />
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 sm:px-10">
        {posts.length > 0 ? (
          <>
            <div className="mb-8 flex items-center justify-between gap-4">
              <h2 className="font-serif text-2xl font-semibold">
                Latest Articles
              </h2>

              <span className="text-xs uppercase tracking-[2px] text-[#8B624B]">
                {posts.length}{" "}
                {posts.length === 1 ? "Article" : "Articles"}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => {
                const title = post.title?.trim() || "Untitled Article";
                const image = getImage(post);
                const articlePath = `/blog/${encodeURIComponent(
                  post.slug?.trim() || post._id.toString()
                )}`;

                return (
                  <article
                    key={post._id.toString()}
                    className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-[#E6DDD2] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(70,45,30,0.10)]"
                  >
                    <Link
                      href={articlePath}
                      className="block"
                      aria-label={`Read ${title}`}
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-[#F0EBE2]">
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

                    <div className="flex flex-1 flex-col p-6 sm:p-7">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] font-semibold uppercase tracking-[1.8px] text-[#8B624B]">
                        {post.category && <span>{post.category}</span>}

                        {post.category && getDate(post) && (
                          <span aria-hidden="true">•</span>
                        )}

                        {getDate(post) && <span>{getDate(post)}</span>}
                      </div>

                      <h2 className="mt-4 font-serif text-2xl font-semibold leading-snug text-[#29231F]">
                        <Link
                          href={articlePath}
                          className="transition-colors hover:text-[#8B624B]"
                        >
                          {title}
                        </Link>
                      </h2>

                      <p className="mt-4 flex-1 text-sm leading-7 text-[#77716B]">
                        {getExcerpt(post) ||
                          "Discover stories and inspiration from TCL Gallery."}
                      </p>

                      <Link
                        href={articlePath}
                        className="mt-7 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[1.5px] text-[#684633]"
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
          <div className="rounded-[22px] border border-dashed border-[#DCCFC1] bg-white/50 px-6 py-20 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[3px] text-[#8B624B]">
              Blog Journal
            </p>

            <h2 className="mt-4 font-serif text-3xl font-semibold">
              Stories are on their way
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#77716B]">
              We are preparing articles about art, photography,
              interior styling and handcrafted creations. Please
              visit again soon.
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
