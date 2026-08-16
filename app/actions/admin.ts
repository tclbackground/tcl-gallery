"use server";

import { revalidatePath } from "next/cache";
import {
  writeFile,
  mkdir,
} from "fs/promises";
import {
  existsSync,
} from "fs";
import path from "path";

import { prisma } from "@/lib/prisma";

// ==========================================================
// UPDATE PRODUCT
// ==========================================================

export async function updateProduct(
  formData: FormData
) {
  try {
    // ======================================================
    // BASIC DATA
    // ======================================================

    const id = String(
      formData.get("id") || ""
    ).trim();

    if (!id) {
      return {
        success: false,
        message:
          "Artwork ID is missing.",
      };
    }

    const title = String(
      formData.get("title") || ""
    ).trim();

    const priceString = String(
      formData.get("price") || ""
    ).trim();

    const price =
      parseFloat(priceString);

    const category = String(
      formData.get("category") || ""
    ).trim();

    const artistIdValue = String(
      formData.get("artistId") || ""
    ).trim();

    const artistId =
      artistIdValue || null;

    const description = String(
      formData.get("description") || ""
    ).trim();

    // ======================================================
    // VALIDATION
    // ======================================================

    if (!title) {
      return {
        success: false,
        message:
          "Artwork title is required.",
      };
    }

    if (
      !priceString ||
      Number.isNaN(price)
    ) {
      return {
        success: false,
        message:
          "Please enter a valid price.",
      };
    }

    if (!category) {
      return {
        success: false,
        message:
          "Please select a category.",
      };
    }

    // ======================================================
    // UPLOAD DIRECTORY
    // ======================================================

    const uploadDir = path.join(
      process.cwd(),
      "public",
      "images",
      "products"
    );

    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, {
        recursive: true,
      });
    }

    // ======================================================
    // MAIN IMAGE
    // ======================================================

    let finalMainImageUrl =
      String(
        formData.get(
          "imageUrlInput"
        ) || ""
      ).trim();

    // Existing main image fallback
    if (!finalMainImageUrl) {
      finalMainImageUrl =
        String(
          formData.get(
            "existingImageUrl"
          ) || ""
        ).trim();
    }

    const mainFile =
      formData.get("image");

    if (
      mainFile instanceof File &&
      mainFile.size > 0
    ) {
      const buffer = Buffer.from(
        await mainFile.arrayBuffer()
      );

      const safeFileName =
        mainFile.name.replace(
          /[^a-zA-Z0-9.-]/g,
          "_"
        );

      const uniqueFileName =
        `${Date.now()}-${safeFileName}`;

      await writeFile(
        path.join(
          uploadDir,
          uniqueFileName
        ),
        buffer
      );

      finalMainImageUrl =
        `/images/products/${uniqueFileName}`;
    }

    // ======================================================
    // ADDITIONAL IMAGES
    // SLOTS 2 - 5
    // ======================================================

    const additionalImages: string[] =
      [];

    for (
      let slot = 2;
      slot <= 5;
      slot++
    ) {
      let imageUrl = String(
        formData.get(
          `imageUrlInput${slot}`
        ) || ""
      ).trim();

      const imageFile =
        formData.get(
          `image${slot}`
        );

      // ----------------------------------------------
      // New uploaded image
      // ----------------------------------------------

      if (
        imageFile instanceof File &&
        imageFile.size > 0
      ) {
        const buffer = Buffer.from(
          await imageFile.arrayBuffer()
        );

        const safeFileName =
          imageFile.name.replace(
            /[^a-zA-Z0-9.-]/g,
            "_"
          );

        const uniqueFileName =
          `${Date.now()}-${slot}-${safeFileName}`;

        await writeFile(
          path.join(
            uploadDir,
            uniqueFileName
          ),
          buffer
        );

        imageUrl =
          `/images/products/${uniqueFileName}`;
      }

      // ----------------------------------------------
      // Keep only non-empty URLs
      // ----------------------------------------------

      additionalImages.push(
        imageUrl
      );
    }

    // ======================================================
    // REMOVE EMPTY SLOTS
    // ======================================================

    const finalAdditionalImages =
      additionalImages.filter(
        (image) =>
          image &&
          image.trim()
      );

    // ======================================================
    // UPDATE DATABASE
    // ======================================================

    await (prisma as any).product.update(
      {
        where: {
          id,
        },

        data: {
          title,
          price,
          category,
          artistId,
          description,

          imageUrl:
            finalMainImageUrl,

          images:
            finalAdditionalImages,
        },
      }
    );

    // ======================================================
    // CACHE REVALIDATION
    // ======================================================

    revalidatePath(
      "/admin/artworks"
    );

    revalidatePath(
      "/shop"
    );

    revalidatePath(
      `/shop/${id}`
    );

    revalidatePath(
      `/admin/edit-product/${id}`
    );

    // ======================================================
    // SUCCESS
    // ======================================================

    return {
      success: true,
      message:
        "Artwork updated successfully.",
    };
  } catch (error) {
    console.error(
      "================================"
    );

    console.error(
      "UPDATE PRODUCT SERVER ERROR"
    );

    console.error(
      error
    );

    console.error(
      "================================"
    );

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update artwork.",
    };
  }
}