"use server";

import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ==========================================
// FILE UPLOAD HELPER (Saves to public/images/products)
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
// PRODUCT CRUD ACTIONS
// ==========================================

export async function uploadProduct(formData: FormData) {
  let shouldRedirect = false;

  try {
    const title = formData.get("title") as string;
    const priceStr = formData.get("price") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const artistId = formData.get("artistId") as string;
    const image = formData.get("image") as File;
    const imageUrlInput = formData.get("imageUrlInput") as string;

    if (!title || !priceStr || !category) {
      return {
        success: false,
        message: "All required fields must be filled.",
      };
    }

    let imageUrl = imageUrlInput || "/images/products/artwork-1.jpg";

    if (image && image.size > 0 && image.name !== "undefined") {
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

    // 1. EXTRACT IMAGE INPUTS FIRST
    const imageUrlInput = formData.get("imageUrlInput") as string;
    const existingImageUrl = formData.get("existingImageUrl") as string;
    const imageFile = formData.get("image") as File | null;

    if (!id || !title || !priceStr || !category) {
      return {
        success: false,
        message: "Required fields are missing.",
      };
    }

    // 2. RESOLVE FINAL IMAGE URL PRIORITY
    let finalImageUrl = existingImageUrl || "";

    if (imageFile && imageFile.size > 0 && imageFile.name !== "undefined") {
      const savedPath = await saveFile(imageFile);
      if (savedPath) finalImageUrl = savedPath;
    } else if (imageUrlInput && imageUrlInput.trim() !== "") {
      finalImageUrl = imageUrlInput.trim();
    }

    // 3. UPDATE DATABASE
    await prisma.product.update({
      where: { id },
      data: {
        title,
        price: parseFloat(priceStr),
        category,
        description: description || null,
        imageUrl: finalImageUrl,
        artistId: artistId ? artistId : null,
      },
    });

    // 4. REVALIDATE PATHS
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

  // 5. REDIRECT WITH SUCCESS QUERY PARAM
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