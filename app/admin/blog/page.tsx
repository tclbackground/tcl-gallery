
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { deleteBlogPost } from "@/app/actions/blog";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminBlogPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as
    | { role?: string }
    | undefined;

  if (!session?.user || user?.role !== "ADMIN") {
    redirect("/login");
  }

  const db = await getDb();
  const posts = await db
    .collection("Blog")
    .find({})
    .sort({ updatedAt: -1 })
    .toArray();

  const publishedCount = posts.filter(
    (post) => post.status === "published"
  ).length;

  const draftCount = posts.length - publishedCount;

  return (
    <main className="min-h-screen bg-[#F7F5F0] p-5 text-[#29231F] sm:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[3px] text-[#8B624B]">
              TCL Gallery CMS
            </p>
            <h1 className="mt-2 font-serif text-4xl font-semibold">
              Blog Management
            </h1>
            <p className="mt-2 text-sm text-[#77716B]">
              Create, edit and publish articles for your website.
            </p>
          </div>

          <Link
            href="/admin/blog/new"
            className="inline-flex items-center justify-center rounded-lg bg-[#684633] px-6 py-3 text-sm font-semibold text-white hover:bg-[#4F3325]"
          >
            + Create New Blog
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Total Posts" value={posts.length} />
          <StatCard label="Published" value={publishedCount} />
          <StatCard label="Drafts" value={draftCount} />
        </div>

        <section className="mt-8 overflow-hidden rounded-2xl border border-[#E6DDD2] bg-white">
          <div className="border-b border-[#E6DDD2] px-6 py-5">
            <h2 className="text-lg font-semibold">All Blog Posts</h2>
          </div>

          {posts.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <h3 className="font-serif text-2xl">
                No blog posts yet
              </h3>
              <p className="mt-2 text-sm text-[#77716B]">
                Create your first article to get started.
              </p>
              <Link
                href="/admin/blog/new"
                className="mt-5 inline-flex rounded-lg bg-[#684633] px-5 py-3 text-sm font-semibold text-white"
              >
                Create Blog Post
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-[#FBF9F0] text-xs uppercase tracking-wider text-[#8B624B]">
                  <tr>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Last Updated</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {posts.map((post) => (
                    <tr
                      key={post._id.toString()}
                      className="border-t border-[#EEE5DB]"
                    >
                      <td className="px-6 py-5">
                        <p className="font-semibold">
                          {post.title || "Untitled"}
                        </p>
                        <p className="mt-1 text-xs text-[#8B8178]">
                          /blog/{post.slug}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        {post.category || "Uncategorized"}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            post.status === "published"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {post.status === "published"
                            ? "Published"
                            : "Draft"}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-[#77716B]">
                        {post.updatedAt
                          ? new Date(post.updatedAt).toLocaleDateString(
                              "en-IN"
                            )
                          : "—"}
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <Link
                            href={`/admin/blog/${post._id.toString()}/edit`}
                            className="font-semibold text-[#684633] hover:underline"
                          >
                            Edit
                          </Link>

                          <form
                            action={async () => {
                              "use server";
                              await deleteBlogPost(
                                post._id.toString()
                              );
                            }}
                          >
                            <button
                              type="submit"
                              className="font-semibold text-red-600 hover:underline"
                            >
                              Delete
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-[#E6DDD2] bg-white p-6">
      <p className="text-sm text-[#77716B]">{label}</p>
      <p className="mt-3 text-3xl font-semibold">{value}</p>
    </div>
  );
}
