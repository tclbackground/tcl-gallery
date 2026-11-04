import Link from "next/link";
import { notFound } from "next/navigation";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = {
  params: Promise<{ slug: string }>;
};

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
  status?: string;
  seoTitle?: string;
  metaDescription?: string;
  publishedAt?: Date | string | null;
  createdAt?: Date | string;
};

// ======================================================
// GET BLOG POST
// ======================================================

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const db = await getDb();
    const decodedSlug = decodeURIComponent(slug);

    let post = await db.collection("Blog").findOne({
      slug: decodedSlug,
      status: { $ne: "draft" },
    });

    // Also support article URLs that use MongoDB IDs.
    if (!post && ObjectId.isValid(decodedSlug)) {
      post = await db.collection("Blog").findOne({
        _id: new ObjectId(decodedSlug),
        status: { $ne: "draft" },
      });
    }

    if (!post) return null;

    return {
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
      status: post.status,
      seoTitle: post.seoTitle,
      metaDescription: post.metaDescription,
      publishedAt: post.publishedAt,
      createdAt: post.createdAt,
    };
  } catch (error) {
    console.error("[Blog Article] Fetch error:", error);
    return null;
  }
}

// ======================================================
// SEO METADATA
// ======================================================

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return { title: "Article Not Found | TCL Gallery" };
  }

  const title = post.seoTitle || post.title || "TCL Gallery Blog";
  const description =
    post.metaDescription ||
    post.excerpt ||
    "Discover art, photography and interior inspiration from TCL Gallery.";
  const image =
    post.featuredImage || post.coverImage || post.imageUrl || post.image;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [image] : [],
      type: "article",
    },
  };
}

// ======================================================
// HELPERS
// ======================================================

function formatDate(post: BlogPost): string {
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

function getImageUrl(...values: (string | undefined)[]): string | null {
  for (const value of values) {
    if (!value || typeof value !== "string") continue;

    const image = value.trim();
    if (!image || image === "null" || image === "undefined") continue;

    if (/^https?:\/\//i.test(image)) return image;
    if (image.startsWith("/")) return image;
    return `/${image}`;
  }

  return null;
}

// ======================================================
// ARTICLE PAGE
// ======================================================

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) notFound();

  const title = post.title?.trim() || "Untitled Article";
  const image = getImageUrl(
    post.featuredImage,
    post.coverImage,
    post.imageUrl,
    post.image
  );
  const publishedDate = formatDate(post);

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#FBF9F0] text-[#2B211C]">
      <article className="mx-auto w-full max-w-6xl px-5 pb-20 pt-12 sm:px-8 sm:pt-16 lg:px-12">
        {/* BREADCRUMB */}
        <nav className="mb-9 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[2px] text-[#8B624B]">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:underline">Blog</Link>
          <span>/</span>
          <span className="max-w-[220px] truncate text-[#2B211C]">{title}</span>
        </nav>

        {/* ARTICLE HEADER */}
        <header className="w-full max-w-5xl">
          {post.category && (
            <p className="text-[11px] font-semibold uppercase tracking-[3px] text-[#8B624B]">
              {post.category}
            </p>
          )}

          <h1
            className="mt-4 w-full max-w-5xl font-serif font-semibold text-[#29231F]"
            style={{
              fontSize: "clamp(32px, 4vw, 46px)",
              lineHeight: 1.18,
              letterSpacing: "-1px",
              overflowWrap: "break-word",
            }}
          >
            {title}
          </h1>

          {publishedDate && (
            <p className="mt-4 text-sm text-[#8B8178]">
              Published on {publishedDate}
            </p>
          )}

          {post.excerpt && (
            <p
              className="mt-6 max-w-4xl text-[#77716B]"
              style={{ fontSize: "17px", lineHeight: 1.8 }}
            >
              {post.excerpt}
            </p>
          )}
        </header>

        {/* FEATURED IMAGE */}
        {image && (
          <div className="mt-10 w-full max-w-5xl overflow-hidden rounded-xl bg-[#F0EBE2]">
            <img
              src={image}
              alt={title}
              className="block h-auto max-h-[600px] w-full object-cover"
            />
          </div>
        )}

        {/* MARKDOWN ARTICLE CONTENT */}
        <div className="mt-12 w-full max-w-4xl">
          <div className="break-words text-[17px] leading-[1.9] text-[#49413B]">
            {post.content ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="mb-6 mt-14 font-serif text-4xl font-semibold leading-tight tracking-tight text-[#29231F]">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="mb-6 mt-14 font-serif text-3xl font-semibold leading-tight tracking-tight text-[#29231F]">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="mb-5 mt-10 font-serif text-2xl font-semibold leading-snug text-[#29231F]">
                      {children}
                    </h3>
                  ),
                  h4: ({ children }) => (
                    <h4 className="mb-4 mt-8 font-serif text-xl font-semibold text-[#29231F]">
                      {children}
                    </h4>
                  ),
                  p: ({ children }) => (
                    <p className="mb-7 mt-0 leading-[1.9] text-[#49413B]">
                      {children}
                    </p>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-[#29231F]">
                      {children}
                    </strong>
                  ),
                  ul: ({ children }) => (
                    <ul className="mb-8 mt-3 list-disc space-y-3 pl-7 marker:text-[#A67C45]">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="mb-8 mt-3 list-decimal space-y-3 pl-7 marker:font-semibold marker:text-[#8B624B]">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="pl-1 leading-[1.85]">{children}</li>
                  ),
                  a: ({ children, href }) => (
                    <a
                      href={href}
                      className="text-[#A67C45] underline decoration-[#DCCFC1] underline-offset-4 transition hover:text-[#684633]"
                    >
                      {children}
                    </a>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="my-9 border-l-4 border-[#A67C45] bg-[#F4F0E7] px-6 py-4 italic text-[#77716B]">
                      {children}
                    </blockquote>
                  ),
                  hr: () => <hr className="my-12 border-[#E6DDD2]" />,
                  img: ({ src, alt }) => (
                    <img
                      src={typeof src === "string" ? src : ""}
                      alt={alt || ""}
                      className="my-10 h-auto max-w-full rounded-xl"
                    />
                  ),
                  table: ({ children }) => (
                    <div className="my-8 overflow-x-auto">
                      <table className="w-full border-collapse text-left text-base">
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="border border-[#E6DDD2] bg-[#F0EBE2] px-4 py-3 font-semibold text-[#29231F]">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="border border-[#E6DDD2] px-4 py-3 align-top">
                      {children}
                    </td>
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            ) : (
              <p className="mb-7">Article content is not available.</p>
            )}
          </div>

          {/* BOTTOM CTA */}
          <div className="mt-20 border-t border-[#E6DDD2] pt-10">
            <p
              className="font-serif font-semibold text-[#29231F]"
              style={{ fontSize: "28px", lineHeight: 1.3 }}
            >
              Discover more art and inspiration
            </p>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#77716B]">
              Explore the collections at TCL Gallery and find artwork that
              brings personality and meaning to your space.
            </p>

            <div className="mt-7 flex flex-wrap gap-4">
              <Link
                href="/design-store"
                className="rounded-full bg-[#684633] px-7 py-3 text-xs font-semibold uppercase tracking-[1.5px] text-white transition hover:bg-[#4F3325]"
              >
                Explore Design Store
              </Link>

              <Link
                href="/blog"
                className="rounded-full border border-[#DCCFC1] px-7 py-3 text-xs font-semibold uppercase tracking-[1.5px] text-[#684633] transition hover:bg-white"
              >
                Back to Blog
              </Link>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
