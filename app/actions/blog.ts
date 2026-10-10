
"use server";

import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

type BlogStatus = "draft" | "published";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const user = session?.user as
    | { role?: string }
    | undefined;

  if (!session?.user || user?.role !== "ADMIN") {
    throw new Error("Unauthorized. Admin access required.");
  }
}

function readText(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getPostData(formData: FormData) {
  const title = readText(formData, "title");
  const requestedSlug = readText(formData, "slug");
  const excerpt = readText(formData, "excerpt");
  const content = readText(formData, "content");
  const category = readText(formData, "category");
  const featuredImage = readText(formData, "featuredImage");
  const seoTitle = readText(formData, "seoTitle");
  const metaDescription = readText(formData, "metaDescription");
  const status = readText(formData, "status");

  if (!title || !content) {
    throw new Error("Title and content are required.");
  }

  if (
    featuredImage &&
    !/^https?:\/\//i.test(featuredImage)
  ) {
    throw new Error(
      "Featured image must be a full HTTPS or HTTP URL."
    );
  }

  const validStatus: BlogStatus =
    status === "published" ? "published" : "draft";

  return {
    title,
    slug: makeSlug(requestedSlug || title),
    excerpt,
    content,
    category,
    featuredImage,
    seoTitle,
    metaDescription,
    status: validStatus,
    updatedAt: new Date(),
  };
}

export async function createBlogPost(formData: FormData) {
  await requireAdmin();

  const post = getPostData(formData);
  const db = await getDb();
  const collection = db.collection("Blog");

  const existing = await collection.findOne({
    slug: post.slug,
  });

  if (existing) {
    throw new Error(
      "This slug already exists. Please use a different slug."
    );
  }

  const now = new Date();

  const result = await collection.insertOne({
    ...post,
    author: "TCL Gallery",
    createdAt: now,
    updatedAt: now,
    publishedAt: post.status === "published" ? now : null,
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");

  redirect(`/admin/blog/${result.insertedId.toString()}/edit`);
}

export async function updateBlogPost(
  id: string,
  formData: FormData
) {
  await requireAdmin();

  if (!ObjectId.isValid(id) || id.length !== 24) {
    throw new Error("Invalid blog post ID.");
  }

  const post = getPostData(formData);
  const db = await getDb();
  const collection = db.collection("Blog");
  const objectId = new ObjectId(id);

  const existing = await collection.findOne({
    _id: objectId,
  });

  if (!existing) {
    throw new Error("Blog post not found.");
  }

  const duplicateSlug = await collection.findOne({
    slug: post.slug,
    _id: { $ne: objectId },
  });

  if (duplicateSlug) {
    throw new Error(
      "This slug already exists. Please use a different slug."
    );
  }

  const publishedAt =
    post.status === "published"
      ? existing.publishedAt ?? new Date()
      : null;

  await collection.updateOne(
    { _id: objectId },
    {
      $set: {
        ...post,
        publishedAt,
      },
    }
  );

  revalidatePath("/admin/blog");
  revalidatePath(`/admin/blog/${id}/edit`);
  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);

  redirect("/admin/blog");
}

export async function deleteBlogPost(id: string) {
  await requireAdmin();

  if (!ObjectId.isValid(id) || id.length !== 24) {
    throw new Error("Invalid blog post ID.");
  }

  const db = await getDb();

  await db.collection("Blog").deleteOne({
    _id: new ObjectId(id),
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");

  redirect("/admin/blog");
}
