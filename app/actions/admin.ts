"use server";

import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";

/* =========================================================
   HELPER: CREATE UPLOAD DIRECTORY
========================================================= */

async function ensureUploadDir(folder: string) {
  const uploadDir = path.join(process.cwd(), "public", "images", folder);

  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  return uploadDir;
}

/* =========================================================
   HELPER: SAVE FILE
========================================================= */

async function saveFile(file: File, folder: string) {
  if (!file || file.size === 0) {
    return null;
  }

  const uploadDir = await ensureUploadDir(folder);

  const cleanFileName = `${Date.now()}-${file.name.replace(
    /[^a-zA-Z0-9.-]/g,
    "_"
  )}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(
    path.join(uploadDir, cleanFileName),
    buffer
  );

  return `/images/${folder}/${cleanFileName}`;
}

/* =========================================================
   UPLOAD / CREATE ARTIST
========================================================= */

export async function uploadArtist(formData: FormData) {
  try {
    const name = (formData.get("name") as string)?.trim();

    if (!name) {
      return {
        success: false,
        message: "Artist name is required.",
      };
    }

    let imageUrl =
      (formData.get("imageUrl") as string)?.trim() || "";

    const imageFile = formData.get("image") as File | null;

    if (
      imageFile &&
      typeof imageFile === "object" &&
      imageFile.size > 0
    ) {
      const uploadedImage = await saveFile(
        imageFile,
        "artists"
      );

      if (uploadedImage) {
        imageUrl = uploadedImage;
      }
    }

    const artist = await prisma.artist.create({
      data: {
        name,
        imageUrl: imageUrl || null,
      },
    });

    revalidatePath("/admin/artists");
    revalidatePath("/shop");

    return {
      success: true,
      message: "Artist added successfully.",
      artistId: artist.id,
    };
  } catch (error: any) {
    console.error("Artist upload error:", error);

    return {
      success: false,
      message:
        error?.message || "Failed to add artist.",
    };
  }
}

/* =========================================================
   UPDATE ARTIST
========================================================= */

export async function updateArtist(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const name = (formData.get("name") as string)?.trim();

    if (!id) {
      return {
        success: false,
        message: "Artist ID is required.",
      };
    }

    if (!name) {
      return {
        success: false,
        message: "Artist name is required.",
      };
    }

    let imageUrl =
      (formData.get("imageUrl") as string)?.trim() ||
      (formData.get("existingImageUrl") as string)?.trim() ||
      "";

    const imageFile = formData.get("image") as File | null;

    if (
      imageFile &&
      typeof imageFile === "object" &&
      imageFile.size > 0
    ) {
      const uploadedImage = await saveFile(
        imageFile,
        "artists"
      );

      if (uploadedImage) {
        imageUrl = uploadedImage;
      }
    }

    await prisma.artist.update({
      where: {
        id,
      },
      data: {
        name,
        imageUrl: imageUrl || null,
      },
    });

    revalidatePath("/admin/artists");
    revalidatePath("/shop");

    return {
      success: true,
      message: "Artist updated successfully.",
    };
  } catch (error: any) {
    console.error("Artist update error:", error);

    return {
      success: false,
      message:
        error?.message || "Failed to update artist.",
    };
  }
}

/* =========================================================
   DELETE ARTIST
========================================================= */

export async function deleteArtist(id: string) {
  try {
    if (!id) {
      return {
        success: false,
        message: "Artist ID is required.",
      };
    }

    await prisma.artist.delete({
      where: {
        id,
      },
    });

    revalidatePath("/admin/artists");
    revalidatePath("/shop");

    return {
      success: true,
      message: "Artist deleted successfully.",
    };
  } catch (error: any) {
    console.error("Artist delete error:", error);

    return {
      success: false,
      message:
        error?.message || "Failed to delete artist.",
    };
  }
}

/* =========================================================
   UPDATE PRODUCT / ARTWORK
========================================================= */

export async function updateProduct(formData: FormData) {
  try {
    const id = formData.get("id") as string;

    if (!id) {
      return {
        success: false,
        message: "Artwork ID is required.",
      };
    }

    /* -------------------------
       BASIC INFORMATION
    ------------------------- */

    const title =
      (formData.get("title") as string)?.trim() || null;

    const category =
      (formData.get("category") as string)?.trim() || null;

    const description =
      (formData.get("description") as string)?.trim() || null;

    const referenceNo =
      (formData.get("referenceNo") as string)?.trim() || null;

    const location =
      (formData.get("location") as string)?.trim() || null;

    const medium =
      (formData.get("medium") as string)?.trim() || null;

    const size =
      (formData.get("size") as string)?.trim() || null;

    const artistId =
      (formData.get("artistId") as string)?.trim() || null;

    /* -------------------------
       NUMBER VALUES
    ------------------------- */

    const yearValue = formData.get("year") as string;

    const year =
      yearValue && yearValue.trim() !== ""
        ? parseInt(yearValue)
        : null;

    const slNoValue = formData.get("slNo") as string;

    const slNo =
      slNoValue && slNoValue.trim() !== ""
        ? parseInt(slNoValue)
        : null;

    const price12x18Value =
      formData.get("price12x18") as string;

    const price12x18 =
      price12x18Value &&
      price12x18Value.trim() !== ""
        ? parseFloat(price12x18Value)
        : null;

    const price18x24Value =
      formData.get("price18x24") as string;

    const price18x24 =
      price18x24Value &&
      price18x24Value.trim() !== ""
        ? parseFloat(price18x24Value)
        : null;

    const price24x33Value =
      formData.get("price24x33") as string;

    const price24x33 =
      price24x33Value &&
      price24x33Value.trim() !== ""
        ? parseFloat(price24x33Value)
        : null;

    /* =====================================================
       MAIN IMAGE
    ===================================================== */

    let imageUrl =
      (formData.get("imageUrlInput") as string)?.trim() ||
      (formData.get("existingImageUrl") as string)?.trim() ||
      null;

    const mainImage = formData.get("image") as File | null;

    if (
      mainImage &&
      typeof mainImage === "object" &&
      mainImage.size > 0
    ) {
      const uploadedImage = await saveFile(
        mainImage,
        "products"
      );

      if (uploadedImage) {
        imageUrl = uploadedImage;
      }
    }

    /* =====================================================
       IMAGE 2
    ===================================================== */

    let image2 =
      (formData.get("imageUrlInput2") as string)?.trim() ||
      (formData.get("existingImage2") as string)?.trim() ||
      null;

    const imageFile2 = formData.get("image2") as File | null;

    if (
      imageFile2 &&
      typeof imageFile2 === "object" &&
      imageFile2.size > 0
    ) {
      const uploadedImage = await saveFile(
        imageFile2,
        "products"
      );

      if (uploadedImage) {
        image2 = uploadedImage;
      }
    }

    /* =====================================================
       IMAGE 3
    ===================================================== */

    let image3 =
      (formData.get("imageUrlInput3") as string)?.trim() ||
      (formData.get("existingImage3") as string)?.trim() ||
      null;

    const imageFile3 = formData.get("image3") as File | null;

    if (
      imageFile3 &&
      typeof imageFile3 === "object" &&
      imageFile3.size > 0
    ) {
      const uploadedImage = await saveFile(
        imageFile3,
        "products"
      );

      if (uploadedImage) {
        image3 = uploadedImage;
      }
    }

    /* =====================================================
       IMAGE 4
    ===================================================== */

    let image4 =
      (formData.get("imageUrlInput4") as string)?.trim() ||
      (formData.get("existingImage4") as string)?.trim() ||
      null;

    const imageFile4 = formData.get("image4") as File | null;

    if (
      imageFile4 &&
      typeof imageFile4 === "object" &&
      imageFile4.size > 0
    ) {
      const uploadedImage = await saveFile(
        imageFile4,
        "products"
      );

      if (uploadedImage) {
        image4 = uploadedImage;
      }
    }

    /* =====================================================
       IMAGE 5
    ===================================================== */

    let image5 =
      (formData.get("imageUrlInput5") as string)?.trim() ||
      (formData.get("existingImage5") as string)?.trim() ||
      null;

    const imageFile5 = formData.get("image5") as File | null;

    if (
      imageFile5 &&
      typeof imageFile5 === "object" &&
      imageFile5.size > 0
    ) {
      const uploadedImage = await saveFile(
        imageFile5,
        "products"
      );

      if (uploadedImage) {
        image5 = uploadedImage;
      }
    }

    /* =====================================================
       DATABASE UPDATE
    ===================================================== */

    await prisma.product.update({
      where: {
        id,
      },

      data: {
        slNo,
        title,
        imageUrl,
        image2,
        image3,
        image4,
        image5,
        referenceNo,
        location,
        year,
        medium,
        size,
        price12x18,
        price18x24,
        price24x33,
        category,
        description,
        artistId,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/artworks");
    revalidatePath("/shop");

    return {
      success: true,
      message: "Artwork updated successfully.",
    };
  } catch (error: any) {
    console.error("Artwork update error:", error);

    return {
      success: false,
      message:
        error?.message || "Failed to update artwork.",
    };
  }
}

/* =========================================================
   DELETE PRODUCT
========================================================= */

export async function deleteProduct(id: string) {
  try {
    if (!id) {
      return {
        success: false,
        message: "Artwork ID is required.",
      };
    }

    await prisma.product.delete({
      where: {
        id,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/artworks");
    revalidatePath("/shop");

    return {
      success: true,
      message: "Artwork deleted successfully.",
    };
  } catch (error: any) {
    console.error("Product delete error:", error);

    return {
      success: false,
      message:
        error?.message || "Failed to delete artwork.",
    };
  }
}