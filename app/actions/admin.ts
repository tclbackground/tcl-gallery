"use server";

import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ==========================================
// FILE UPLOAD & RESOLUTION HELPERS
// ==========================================

async function saveFile(file: File): Promise<string> {
  try {
    const uploadDir = path.join(
      process.cwd(),
      "public",
      "images",
      "products"
    );
    await mkdir(uploadDir, { recursive: true });

    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
    const filePath = path.join(uploadDir, fileName);

    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));

    return `/images/products/${fileName}`;
  } catch (error) {
    console.error("Local file save error:", error);
    return "";
  }
}

async function resolveImageSlot(
  formData: FormData,
  fileKey: string,
  urlInputKey: string,
  fallbackValue: string = ""
): Promise<string> {
  const file = formData.get(fileKey) as File | null;
  const urlInput = (formData.get(urlInputKey) as string)?.trim();

  // 1. Prioritize newly uploaded file
  if (file && file.size > 0 && file.name !== "undefined") {
    const savedPath = await saveFile(file);
    if (savedPath) return savedPath;
  }

  // 2. Fall back to manual URL text input if provided
  if (urlInput) {
    return urlInput;
  }

  // 3. Keep existing image
  return fallbackValue;
}

// ==========================================
// ARTIST CRUD ACTIONS
// ==========================================

export async function uploadArtist(formData: FormData) {
  let shouldRedirect = false;

  try {
    const name = formData.get("name") as string;
    const specialty = formData.get("specialty") as string;
    const bio = formData.get("bio") as string;
    const image = formData.get("image") as File;
    const imageUrlInput = formData.get("imageUrlInput") as string;

    if (!name || !specialty) {
      return {
        success: false,
        message: "Name and Specialty are required.",
      };
    }

    let imageUrl: string | null = imageUrlInput || null;

    if (image && image.size > 0 && image.name !== "undefined") {
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
    shouldRedirect = true;
  } catch (error) {
    console.error("Artist Upload Error:", error);
    return {
      success: false,
      message: "Failed to create artist.",
    };
  }

  if (shouldRedirect) {
    redirect("/admin/artists?created=true");
  }
}

export async function updateArtist(formData: FormData) {
  let shouldRedirect = false;

  try {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const specialty = formData.get("specialty") as string;
    const bio = formData.get("bio") as string;
    const image = formData.get("image") as File;
    const imageUrlInput = formData.get("imageUrlInput") as string;
    const existingImageUrl = formData.get("existingImageUrl") as string;

    if (!id || !name || !specialty) {
      return {
        success: false,
        message: "ID, Name, and Specialty are required.",
      };
    }

    let imageUrl = imageUrlInput || existingImageUrl || null;

    if (image && image.size > 0 && image.name !== "undefined") {
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
    revalidatePath("/artist");
    revalidatePath(`/artist/${id}`);
    shouldRedirect = true;
  } catch (error) {
    console.error("Artist Update Error:", error);
    return {
      success: false,
      message: "Failed to update artist.",
    };
  }

  if (shouldRedirect) {
    redirect("/admin/artists?updated=true");
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
// PRODUCT CRUD ACTIONS (5 IMAGES SUPPORTED)
// ==========================================

export async function uploadProduct(formData: FormData) {
  let shouldRedirect = false;

  try {
    const title = formData.get("title") as string;
    const priceStr = formData.get("price") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const artistId = formData.get("artistId") as string;

    if (!title || !priceStr || !category) {
      return {
        success: false,
        message: "All required fields must be filled.",
      };
    }

    // Main Image (Slot 1)
    const finalImageUrl =
      (await resolveImageSlot(formData, "image", "imageUrlInput")) ||
      "/images/products/artwork-1.jpg";

    // Additional Images (Slots 2-5)
    const slotKeys = [
      { file: "image2", url: "imageUrlInput2" },
      { file: "image3", url: "imageUrlInput3" },
      { file: "image4", url: "imageUrlInput4" },
      { file: "image5", url: "imageUrlInput5" },
    ];

    const finalAdditionalImages: string[] = [];
    for (const slot of slotKeys) {
      const resolved = await resolveImageSlot(formData, slot.file, slot.url);
      if (resolved) {
        finalAdditionalImages.push(resolved);
      }
    }

    await (prisma as any).product.create({
      data: {
        title,
        price: parseFloat(priceStr),
        category,
        description: description || null,
        imageUrl: finalImageUrl,
        images: finalAdditionalImages,
        artistId: artistId ? artistId : null,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath(`/shop/${category}`);
    shouldRedirect = true;
  } catch (error) {
    console.error("Product Upload Error:", error);
    return {
      success: false,
      message: "Failed to publish product.",
    };
  }

  if (shouldRedirect) {
    redirect("/admin?created=true");
  }
}

export async function updateProduct(formData: FormData) {
  let shouldRedirect = false;

  try {
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const priceStr = formData.get("price") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const artistId = formData.get("artistId") as string;

    if (!id || !title || !priceStr || !category) {
      return {
        success: false,
        message: "Required fields are missing.",
      };
    }

    // Parse existing images passed from form
    const existingImageUrl = (formData.get("existingImageUrl") as string) || "";
    let existingAdditionalImages: string[] = [];
    try {
      const raw = formData.get("existingImages") as string;
      if (raw) existingAdditionalImages = JSON.parse(raw);
    } catch {
      existingAdditionalImages = [];
    }

    // 1. Resolve Main Image (Index 0 / Slot 1)
    const finalImageUrl = await resolveImageSlot(
      formData,
      "image",
      "imageUrlInput",
      existingImageUrl
    );

    // 2. Resolve Additional Images (Index 1-4 / Slots 2-5)
    const slotKeys = [
      { file: "image2", url: "imageUrlInput2", fallback: existingAdditionalImages[0] || "" },
      { file: "image3", url: "imageUrlInput3", fallback: existingAdditionalImages[1] || "" },
      { file: "image4", url: "imageUrlInput4", fallback: existingAdditionalImages[2] || "" },
      { file: "image5", url: "imageUrlInput5", fallback: existingAdditionalImages[3] || "" },
    ];

    const finalAdditionalImages: string[] = [];
    for (const slot of slotKeys) {
      const resolved = await resolveImageSlot(formData, slot.file, slot.url, slot.fallback);
      if (resolved) {
        finalAdditionalImages.push(resolved);
      }
    }

    // 3. Update Database
    await (prisma as any).product.update({
      where: { id },
      data: {
        title,
        price: parseFloat(priceStr),
        category,
        description: description || null,
        imageUrl: finalImageUrl,
        images: finalAdditionalImages,
        artistId: artistId ? artistId : null,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath(`/shop/${category}`);
    shouldRedirect = true;
  } catch (error) {
    console.error("Product Update Error:", error);
    return {
      success: false,
      message: "Failed to update product.",
    };
  }

  if (shouldRedirect) {
    redirect("/admin?updated=true");
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