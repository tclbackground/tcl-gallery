
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { ObjectId } from "mongodb";

import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { updateBlogPost } from "@/app/actions/blog";
import MarkDownEditor from "../../new/MarkDownEditor";


export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditBlogPage({ params }: Props) {
  const session = await getServerSession(authOptions);

  const user = session?.user as
    | { role?: string }
    | undefined;

  if (!session?.user || user?.role !== "ADMIN") {
    redirect("/login");
  }

  const { id } = await params;

  if (!ObjectId.isValid(id) || id.length !== 24) {
    notFound();
  }

  const db = await getDb();

  const post = await db.collection("Blog").findOne({
    _id: new ObjectId(id),
  });

  if (!post) {
    notFound();
  }

  const saveChanges = updateBlogPost.bind(null, id);

  return (
    <main className="min-h-screen bg-[#F7F5F0] p-5 text-[#29231F] sm:p-8">
      <div className="mx-auto max-w-4xl">

        <Link
          href="/admin/blog"
          className="text-sm text-[#8B624B] hover:underline"
        >
          ← Back to Blog Management
        </Link>

        <h1 className="mt-5 font-serif text-4xl font-semibold">
          Edit Blog Post
        </h1>

        <p className="mt-2 text-sm text-[#77716B]">
          Update your article, preview the formatting and save your changes.
        </p>

        <form
          action={saveChanges}
          className="mt-8 space-y-6 rounded-2xl border border-[#E6DDD2] bg-white p-6 sm:p-8"
        >

          {/* Blog Title */}
          <Field
            label="Blog Title *"
            name="title"
            required
            defaultValue={post.title}
          />

          {/* URL Slug */}
          <Field
            label="URL Slug"
            name="slug"
            defaultValue={post.slug}
            placeholder="10-ways-art-transforms-interiors"
          />

          <p className="-mt-4 text-xs text-[#8B8178]">
            Use a short, descriptive URL with relevant keywords.
          </p>

          {/* Category */}
          <Field
            label="Category"
            name="category"
            defaultValue={post.category}
            placeholder="Interior Design, Art, Photography"
          />

          {/* Short Excerpt */}
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Short Excerpt
            </label>

            <textarea
              name="excerpt"
              rows={3}
              defaultValue={String(post.excerpt ?? "")}
              placeholder="A short introduction for your blog listing..."
              className="w-full rounded-lg border border-[#DCCFC1] px-4 py-3 outline-none focus:border-[#684633]"
            />
          </div>

          {/* Markdown Editor */}
          <MarkDownEditor
            initialContent={String(post.content ?? "")}
          />

          {/* Featured Image */}
          <Field
            label="Featured Image URL"
            name="featuredImage"
            inputType="url"
            defaultValue={post.featuredImage}
            placeholder="https://res.cloudinary.com/..."
          />

          {/* SEO Title */}
          <Field
            label="SEO Title"
            name="seoTitle"
            defaultValue={post.seoTitle}
            placeholder="Enter your SEO title"
          />

          {/* Meta Description */}
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Meta Description
            </label>

            <textarea
              name="metaDescription"
              rows={3}
              defaultValue={String(post.metaDescription ?? "")}
              placeholder="Write a search-friendly description..."
              maxLength={160}
              className="w-full rounded-lg border border-[#DCCFC1] px-4 py-3 outline-none focus:border-[#684633]"
            />

            <p className="mt-2 text-xs text-[#8B8178]">
              Write a unique and relevant description for this article.
            </p>
          </div>

          {/* Publishing Status */}
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Publishing Status
            </label>

            <select
              name="status"
              defaultValue={String(post.status ?? "draft")}
              className="w-full rounded-lg border border-[#DCCFC1] bg-white px-4 py-3"
            >
              <option value="draft">Save as Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 border-t border-[#EEE5DB] pt-6">

            <button
              type="submit"
              className="rounded-lg bg-[#684633] px-6 py-3 text-sm font-semibold text-white hover:bg-[#4F3325]"
            >
              Save Changes
            </button>

            <Link
              href="/admin/blog"
              className="rounded-lg border border-[#DCCFC1] px-6 py-3 text-sm font-semibold"
            >
              Cancel
            </Link>

          </div>
        </form>
      </div>
    </main>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required = false,
  inputType = "text",
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: unknown;
  required?: boolean;
  inputType?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={inputType}
        required={required}
        defaultValue={String(defaultValue ?? "")}
        placeholder={placeholder}
        className="w-full rounded-lg border border-[#DCCFC1] px-4 py-3 outline-none focus:border-[#684633]"
      />
    </div>
  );
}
