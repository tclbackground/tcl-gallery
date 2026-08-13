"use server";

import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";

// ==========================================
// FILE UPLOAD HELPER
// ==========================================

async function saveFile(file: File): Promise<string> {
  // Only attempt local disk write if running in Node development environment
  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
    const filePath = path.join(uploadDir, fileName);

    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));

    return `/uploads/${fileName}`;
  } catch (error) {
    console.warn("Local file save bypassed or failed (Serverless runtime):", error);
    return "";
  }
}

// ==========================================
// ARTIST CRUD ACTIONS
// ==========================================

export async function uploadArtist(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const specialty = formData.get("specialty") as string;
    const bio = formData.get("bio") as string;
    const image = formData.get("image") as File;
    const imageUrlInput = formData.get("imageUrl") as string;

    if (!name || !specialty) {
      return {
        success: false,
        message: "Name and Specialty are required.",
      };
    }

    let imageUrl: string | null = imageUrlInput || null;

    if (image && image.size > 0) {
      const savedPath = await saveFile(image);
      if (savedPath) imageUrl = savedPath;
    }

    await (prisma as any).artist.create({
      data: {
        name,
        specialty,
        bio: bio || null,
        imageUrl,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/artists");
    revalidatePath("/admin/artists/add");
    revalidatePath("/artist");

    return {
      success: true,
      message: "Artist created successfully!",
    };
  } catch (error) {
    console.error("Artist Upload Error:", error);
    return {
      success: false,
      message: "Failed to create artist.",
    };
  }
}

export async function updateArtist(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const specialty = formData.get("specialty") as string;
    const bio = formData.get("bio") as string;
    const image = formData.get("image") as File;
    const imageUrlInput = formData.get("imageUrl") as string;
    const existingImageUrl = formData.get("existingImageUrl") as string;

    if (!id || !name || !specialty) {
      return {
        success: false,
        message: "ID, Name, and Specialty are required.",
      };
    }

    let imageUrl = imageUrlInput || existingImageUrl || null;

    if (image && image.size > 0) {
      const savedPath = await saveFile(image);
      if (savedPath) imageUrl = savedPath;
    }

    await (prisma as any).artist.update({
      where: { id },
      data: {
        name,
        specialty,
        bio: bio || null,
        imageUrl,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/artists");
    revalidatePath("/admin/artists/add");
    revalidatePath("/artist");
    revalidatePath(`/artist/${id}`);

    return {
      success: true,
      message: "Artist updated successfully!",
    };
  } catch (error) {
    console.error("Artist Update Error:", error);
    return {
      success: false,
      message: "Failed to update artist.",
    };
  }
}

export async function deleteArtist(formData: FormData) {
  try {
    const id = formData.get("id") as string;

    if (!id) {
      return {
        success: false,
        message: "Artist ID is required.",
      };
    }

    await prisma.product.updateMany({
      where: {
        artistId: id,
      } as any,
      data: {
        artistId: null,
      } as any,
    });

    await (prisma as any).artist.delete({
      where: { id },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/artists");
    revalidatePath("/artist");
    revalidatePath(`/artist/${id}`);

    return {
      success: true,
      message: "Artist deleted successfully!",
    };
  } catch (error) {
    console.error("Artist Delete Error:", error);
    return {
      success: false,
      message: "Failed to delete artist.",
    };
  }
}

// ==========================================
// PRODUCT CRUD ACTIONS
// ==========================================

export async function uploadProduct(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const priceStr = formData.get("price") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const artistId = formData.get("artistId") as string;
    const image = formData.get("image") as File;
    const imageUrlInput = formData.get("imageUrl") as string;

    if (!title || !priceStr || !category) {
      return {
        success: false,
        message: "All required fields must be filled.",
      };
    }

    let imageUrl = imageUrlInput || "/images/products/artwork-1.jpg";

    if (image && image.size > 0) {
      const savedPath = await saveFile(image);
      if (savedPath) imageUrl = savedPath;
    }

    await prisma.product.create({
      data: {
        title,
        price: parseFloat(priceStr),
        category,
        description: description || null,
        imageUrl,
        artistId: artistId ? artistId : null,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath(`/shop/${category}`);

    return {
      success: true,
      message: "Product published successfully!",
    };
  } catch (error) {
    console.error("Product Upload Error:", error);
    return {
      success: false,
      message: "Failed to publish product.",
    };
  }
}

export async function updateProduct(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const priceStr = formData.get("price") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const artistId = formData.get("artistId") as string;
    const image = formData.get("image") as File;
    const imageUrlInput = formData.get("imageUrl") as string;
    const existingImageUrl = formData.get("existingImageUrl") as string;

    if (!id || !title || !priceStr || !category) {
      return {
        success: false,
        message: "Required fields are missing.",
      };
    }

    let imageUrl = imageUrlInput || existingImageUrl || "/images/products/artwork-1.jpg";

    if (image && image.size > 0) {
      const savedPath = await saveFile(image);
      if (savedPath) imageUrl = savedPath;
    }

    await prisma.product.update({
      where: { id },
      data: {
        title,
        price: parseFloat(priceStr),
        category,
        description: description || null,
        imageUrl,
        artistId: artistId ? artistId : null,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath(`/shop/${category}`);

    return {
      success: true,
      message: "Product updated successfully!",
    };
  } catch (error) {
    console.error("Product Update Error:", error);
    return {
      success: false,
      message: "Failed to update product.",
    };
  }
}

export async function deleteProduct(formData: FormData) {
  try {
    const id = formData.get("id") as string;

    if (!id) {
      return {
        success: false,
        message: "Product ID is missing.",
      };
    }

    await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath("/shop");

    return {
      success: true,
      message: "Product deleted successfully!",
    };
  } catch (error) {
    console.error("Product Delete Error:", error);
    return {
      success: false,
      message: "Failed to delete product.",
    };
  }
}