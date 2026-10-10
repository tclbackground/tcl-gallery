
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDb } from "@/lib/mongodb";
import type { Metadata } from "next";

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
  status?: string;
  seoTitle?: string;
  metaDescription?: string;
  publishedAt?: Date | string | null;
  createdAt?: Date | string;
};

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const db = await getDb();
  const decodedSlug = decodeURIComponent(slug);

  const post = await db.collection("Blog").findOne({
    slug: decodedSlug,
    status: { $ne: "draft" },
  });

  if (!post) return null;

  return {
    _id: post._id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    category: post.category,
    featuredImage: post.featuredImage,
    status: post.status,
    seoTitle: post.seoTitle,
    metaDescription: post.metaDescription,
    publishedAt: post.publishedAt,
    createdAt: post.createdAt,
  };
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return { title: "Article Not Found | TCL Gallery" };
  }

  return {
    title: post.seoTitle || post.title || "TCL Gallery Blog",
    description:
      post.metaDescription ||
      post.excerpt ||
      "Discover art, photography and interior inspiration from TCL Gallery.",
    openGraph: {
      title: post.seoTitle || post.title || "TCL Gallery Blog",
      description: post.metaDescription || post.excerpt || "",
      images: post.featuredImage ? [post.featuredImage] : [],
    },
  };
}

function formatDate(post: BlogPost) {
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

function getImageUrl(value?: string) {
  if (!value) return null;

  const image = value.trim();

  if (/^https?:\/\//i.test(image)) return image;
  if (image.startsWith("/")) return image;

  return `/${image}`;
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) notFound();

  const title = post.title || "Untitled Article";
  const image = getImageUrl(post.featuredImage);

  return (
    <main className="min-h-screen bg-[#FBF9F0] text-[#2B211C]">
      <article className="mx-auto max-w-5xl px-6 pb-24 pt-16 sm:px-10 sm:pt-24">
        <nav className="mb-8 text-[11px] uppercase tracking-[2px] text-[#8B624B]">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:underline">
            Blog
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[#2B211C]">{title}</span>
        </nav>

        <header className="mx-auto max-w-4xl">
          {post.category && (
            <p className="text-[11px] font-semibold uppercase tracking-[3px] text-[#8B624B]">
              {post.category}
            </p>
          )}

          <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            {title}
          </h1>

          {formatDate(post) && (
            <p className="mt-5 text-sm text-[#8B8178]">
              Published on {formatDate(post)}
            </p>
          )}

          {post.excerpt && (
            <p className="mt-7 text-lg leading-8 text-[#77716B]">
              {post.excerpt}
            </p>
          )}
        </header>

        {image && (
          <div className="mt-10 overflow-hidden rounded-2xl bg-[#F0EBE2]">
            <img
              src={image}
              alt={title}
              className="max-h-[600px] w-full object-cover"
            />
          </div>
        )}

        <div className="mx-auto mt-12 max-w-4xl">
          <div className="whitespace-pre-wrap break-words text-base leading-8 text-[#49413B] sm:text-lg">
            {post.content || "Article content is not available."}
          </div>

          <div className="mt-14 border-t border-[#E6DDD2] pt-8">
            <p className="font-serif text-2xl font-semibold">
              Discover more art and inspiration
            </p>

            <p className="mt-3 text-sm leading-7 text-[#77716B]">
              Explore the collections at TCL Gallery and find artwork
              that brings personality and meaning to your space.
            </p>

            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/design-store"
                className="rounded-full bg-[#684633] px-7 py-3 text-xs font-semibold uppercase tracking-[1.5px] text-white transition hover:bg-[#4F3325]"
              >
                Explore Design Store
              </Link>

              <Link
                href="/blog"
                className="rounded-full border border-[#DCCFC1] px-7 py-3 text-xs font-semibold uppercase tracking-[1.5px] text-[#684633] hover:bg-white"
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
