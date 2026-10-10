
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { createBlogPost } from "@/app/actions/blog";

export const dynamic = "force-dynamic";

export default async function NewBlogPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as
    | { role?: string }
    | undefined;

  if (!session?.user || user?.role !== "ADMIN") {
    redirect("/login");
  }

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
          Create Blog Post
        </h1>
        <p className="mt-2 text-sm text-[#77716B]">
          Add your article details and save it as a draft or publish it.
        </p>

        <form
          action={createBlogPost}
          className="mt-8 space-y-6 rounded-2xl border border-[#E6DDD2] bg-white p-6 sm:p-8"
        >
          <Field label="Blog Title *" name="title" required />

          <Field
            label="URL Slug"
            name="slug"
            placeholder="10-ways-art-transforms-interiors"
          />
          <p className="-mt-4 text-xs text-[#8B8178]">
            Leave blank to generate the slug from the title.
          </p>

          <Field
            label="Category"
            name="category"
            placeholder="Interior Design, Art, Photography"
          />

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Short Excerpt
            </label>
            <textarea
              name="excerpt"
              rows={3}
              placeholder="A short introduction for your blog listing..."
              className="w-full rounded-lg border border-[#DCCFC1] px-4 py-3 outline-none focus:border-[#684633]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Full Blog Content *
            </label>
            <textarea
              name="content"
              rows={16}
              required
              placeholder="Write your blog article here..."
              className="w-full rounded-lg border border-[#DCCFC1] px-4 py-3 leading-7 outline-none focus:border-[#684633]"
            />
            <p className="mt-2 text-xs text-[#8B8178]">
              This version stores plain text. A rich-text editor can be
              added separately.
            </p>
          </div>

          <Field
            label="Featured Image URL"
            name="featuredImage"
            inputType="url"
            placeholder="https://res.cloudinary.com/..."
          />

          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="SEO Title" name="seoTitle" />
            <Field
              label="Meta Description"
              name="metaDescription"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Publishing Status
            </label>
            <select
              name="status"
              defaultValue="draft"
              className="w-full rounded-lg border border-[#DCCFC1] bg-white px-4 py-3"
            >
              <option value="draft">Save as Draft</option>
              <option value="published">Publish Now</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-3 border-t border-[#EEE5DB] pt-6">
            <button
              type="submit"
              className="rounded-lg bg-[#684633] px-6 py-3 text-sm font-semibold text-white hover:bg-[#4F3325]"
            >
              Save Blog Post
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
  required = false,
  placeholder,
  inputType = "text",
}: {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  inputType?: string;
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
        placeholder={placeholder}
        className="w-full rounded-lg border border-[#DCCFC1] px-4 py-3 outline-none focus:border-[#684633]"
      />
    </div>
  );
}
