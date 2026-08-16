// app/actions/admin.ts

"use server";

import { revalidatePath } from "next/cache";
import {
  writeFile,
  mkdir,
} from "fs/promises";
import { existsSync } from "fs";
import path from "path";

import { prisma } from "@/lib/prisma";

// ==========================================================
// COMMON UPLOAD DIRECTORY
// ==========================================================

function getProductsUploadDir() {
  return path.join(
    process.cwd(),
    "public",
    "images",
    "products"
  );
}

function getArtistsUploadDir() {
  return path.join(
    process.cwd(),
    "public",
    "images",
    "Artist"
  );
}

// ==========================================================
// ENSURE DIRECTORY EXISTS
// ==========================================================

async function ensureDirectory(
  directory: string
) {
  if (!existsSync(directory)) {
    await mkdir(directory, {
      recursive: true,
    });
  }
}

// ==========================================================
// CREATE SAFE FILE NAME
// ==========================================================

function createSafeFileName(
  fileName: string
) {
  return fileName.replace(
    /[^a-zA-Z0-9.-]/g,
    "_"
  );
}

// ==========================================================
// UPLOAD ARTIST
// ==========================================================

export async function uploadArtist(
  formData: FormData
) {
  try {
    // ======================================================
    // GET ARTIST DATA
    // ======================================================

    const name = String(
      formData.get("name") || ""
    ).trim();

    const bio = String(
      formData.get("bio") || ""
    ).trim();

    if (!name) {
      return {
        success: false,
        message:
          "Artist name is required.",
      };
    }

    // ======================================================
    // ARTIST IMAGE DIRECTORY
    // ======================================================

    const uploadDir =
      getArtistsUploadDir();

    await ensureDirectory(
      uploadDir
    );

    // ======================================================
    // ARTIST IMAGE
    // ======================================================

    let imageUrl = String(
      formData.get("imageUrl") || ""
    ).trim();

    const imageFile =
      formData.get("image");

    if (
      imageFile instanceof File &&
      imageFile.size > 0
    ) {
      const buffer = Buffer.from(
        await imageFile.arrayBuffer()
      );

      const safeFileName =
        createSafeFileName(
          imageFile.name
        );

      const uniqueFileName =
        `${Date.now()}-${safeFileName}`;

      const filePath = path.join(
        uploadDir,
        uniqueFileName
      );

      await writeFile(
        filePath,
        buffer
      );

      // Verify file was actually saved
      if (!existsSync(filePath)) {
        throw new Error(
          `Artist image was not saved: ${filePath}`
        );
      }

      imageUrl =
        `/images/Artist/${uniqueFileName}`;

      console.log(
        "Artist image saved:",
        filePath
      );
    }

    // ======================================================
    // CREATE ARTIST
    // ======================================================

    const artist =
      await (prisma as any).artist.create(
        {
          data: {
            name,
            bio,
            imageUrl,
          },
        }
      );

    // ======================================================
    // REVALIDATE
    // ======================================================

    revalidatePath(
      "/admin/artists"
    );

    revalidatePath(
      "/admin/artists/add"
    );

    revalidatePath(
      "/admin/edit-product"
    );

    // ======================================================
    // SUCCESS
    // ======================================================

    return {
      success: true,
      message:
        "Artist added successfully.",
      artist,
    };
  } catch (error) {
    console.error(
      "========================================"
    );

    console.error(
      "UPLOAD ARTIST ERROR"
    );

    console.error(error);

    console.error(
      "========================================"
    );

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to add artist.",
    };
  }
}

// ==========================================================
// UPDATE PRODUCT
// ==========================================================

export async function updateProduct(
  formData: FormData
) {
  try {
    // ======================================================
    // GET PRODUCT ID
    // ======================================================

    const id = String(
      formData.get("id") || ""
    ).trim();

    console.log(
      "========================================"
    );

    console.log(
      "UPDATE PRODUCT START"
    );

    console.log(
      "Product ID:",
      id
    );

    // ======================================================
    // VALIDATE ID
    // ======================================================

    if (!id) {
      return {
        success: false,
        message:
          "Artwork ID is missing.",
      };
    }

    // ======================================================
    // BASIC PRODUCT DATA
    // ======================================================

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

    const artistIdValue =
      String(
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
    // PRODUCT UPLOAD DIRECTORY
    // ======================================================

    const uploadDir =
      getProductsUploadDir();

    await ensureDirectory(
      uploadDir
    );

    console.log(
      "Product upload directory:",
      uploadDir
    );

    // ======================================================
    // MAIN IMAGE
    // ======================================================

    let finalMainImageUrl =
      String(
        formData.get(
          "imageUrlInput"
        ) || ""
      ).trim();

    // Existing main image
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

    // ======================================================
    // NEW MAIN IMAGE
    // ======================================================

    if (
      mainFile instanceof File &&
      mainFile.size > 0
    ) {
      const buffer = Buffer.from(
        await mainFile.arrayBuffer()
      );

      const safeFileName =
        createSafeFileName(
          mainFile.name
        );

      const uniqueFileName =
        `${Date.now()}-${safeFileName}`;

      const filePath = path.join(
        uploadDir,
        uniqueFileName
      );

      console.log(
        "Saving main artwork image:",
        filePath
      );

      await writeFile(
        filePath,
        buffer
      );

      // Verify physical file
      if (!existsSync(filePath)) {
        throw new Error(
          `Main artwork image was not saved: ${filePath}`
        );
      }

      finalMainImageUrl =
        `/images/products/${uniqueFileName}`;

      console.log(
        "Main artwork image saved:",
        finalMainImageUrl
      );
    }

    // ======================================================
    // ADDITIONAL IMAGES
    //
    // image2
    // image3
    // image4
    // image5
    // ======================================================

    const additionalImages: string[] =
      [];

    for (
      let slot = 2;
      slot <= 5;
      slot++
    ) {
      // ----------------------------------------------------
      // Existing URL
      // ----------------------------------------------------

      let imageUrl =
        String(
          formData.get(
            `imageUrlInput${slot}`
          ) || ""
        ).trim();

      // ----------------------------------------------------
      // New image file
      // ----------------------------------------------------

      const imageFile =
        formData.get(
          `image${slot}`
        );

      if (
        imageFile instanceof File &&
        imageFile.size > 0
      ) {
        const buffer = Buffer.from(
          await imageFile.arrayBuffer()
        );

        const safeFileName =
          createSafeFileName(
            imageFile.name
          );

        const uniqueFileName =
          `${Date.now()}-${slot}-${safeFileName}`;

        const filePath = path.join(
          uploadDir,
          uniqueFileName
        );

        console.log(
          `Saving artwork image ${slot}:`,
          filePath
        );

        await writeFile(
          filePath,
          buffer
        );

        // Verify physical file
        if (!existsSync(filePath)) {
          throw new Error(
            `Artwork image ${slot} was not saved: ${filePath}`
          );
        }

        imageUrl =
          `/images/products/${uniqueFileName}`;

        console.log(
          `Artwork image ${slot} saved:`,
          imageUrl
        );
      }

      // ----------------------------------------------------
      // Preserve URL if present
      // ----------------------------------------------------

      if (imageUrl) {
        additionalImages.push(
          imageUrl
        );
      }
    }

    // ======================================================
    // UPDATE DATABASE
    // ======================================================

    console.log(
      "Updating product database..."
    );

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
            additionalImages,
        },
      }
    );

    console.log(
      "Product database updated successfully."
    );

    // ======================================================
    // REVALIDATE
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

    console.log(
      "UPDATE PRODUCT SUCCESS"
    );

    console.log(
      "========================================"
    );

    return {
      success: true,
      message:
        "Artwork updated successfully.",
    };
  } catch (error) {
    console.error(
      "========================================"
    );

    console.error(
      "UPDATE PRODUCT SERVER ERROR"
    );

    console.error(error);

    console.error(
      "========================================"
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