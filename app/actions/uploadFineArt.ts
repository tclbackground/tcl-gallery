"use server";

import { prisma } from "@/lib/prisma";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import crypto from "crypto";

// ======================================================
// HELPERS
// ======================================================

function getString(
  formData: FormData,
  name: string
) {
  const value = formData.get(name);

  if (!value) {
    return "";
  }

  return String(value).trim();
}

// ======================================================
// SAVE IMAGE
// ======================================================

async function saveImage(
  file: File,
  uploadDir: string,
  prefix: string
) {
  if (!(file instanceof File)) {
    return null;
  }

  if (file.size === 0) {
    return null;
  }

  // Only images

  if (!file.type.startsWith("image/")) {
    throw new Error(
      `${prefix}: Only image files are allowed.`
    );
  }

  // Maximum 10MB

  const maxSize = 10 * 1024 * 1024;

  if (file.size > maxSize) {
    throw new Error(
      `${prefix}: Image must be less than 10MB.`
    );
  }

  // File extension

  const extension =
    path.extname(file.name).toLowerCase() ||
    ".jpg";

  // Safe original filename

  const originalName = path.basename(
    file.name,
    extension
  );

  const safeName = originalName
    .replace(/[^a-zA-Z0-9-_]/g, "_")
    .replace(/_+/g, "_")
    .substring(0, 80);

  // Unique ID

  const uniqueId =
    crypto.randomBytes(8).toString("hex");

  const fileName =
    `${Date.now()}-${uniqueId}-${safeName}${extension}`;

  const filePath = path.join(
    uploadDir,
    fileName
  );

  // Convert File to Buffer

  const bytes = await file.arrayBuffer();

  const buffer = Buffer.from(bytes);

  // Save

  await writeFile(filePath, buffer);

  return {
    filePath,
    url: `/uploads/fine-art/${fileName}`,
  };
}

// ======================================================
// UPLOAD FINE ART
// ======================================================

export async function uploadFineArt(
  formData: FormData
) {
  const savedFiles: string[] = [];

  try {
    console.log(
      "===================================="
    );

    console.log(
      "STARTING FINE ART UPLOAD"
    );

    console.log(
      "===================================="
    );

    // ==================================================
    // FORM VALUES
    // ==================================================

    const slNoString =
      getString(formData, "slNo");

    const category =
      getString(formData, "category");

    const artistName =
      getString(formData, "artistName");

    const itemRefNo =
      getString(formData, "itemRefNo");

    const yearString =
      getString(formData, "year");

    const titleOfArt =
      getString(formData, "titleOfArt");

    const widthCms =
      getString(formData, "widthCms");

    const withFrame =
      getString(formData, "withFrame");

    const paintingType =
      getString(formData, "paintingType");

    const productCategory =
      getString(formData, "productCategory");

    // ==================================================
    // FILES
    // ==================================================

    const image1 =
      formData.get("image1");

    const image2 =
      formData.get("image2");

    const image3 =
      formData.get("image3");

    const photo =
      formData.get("photo");

    // ==================================================
    // REQUIRED VALIDATION
    // ==================================================

    if (!titleOfArt) {
      return {
        success: false,
        message: "Title of the Art is required.",
      };
    }

    if (!artistName) {
      return {
        success: false,
        message: "Artist Name is required.",
      };
    }

    if (!itemRefNo) {
      return {
        success: false,
        message: "Item Reference No is required.",
      };
    }

    if (!image1 || !(image1 instanceof File)) {
      return {
        success: false,
        message:
          "Main artwork image is required.",
      };
    }

    // ==================================================
    // CATEGORY
    // ==================================================

    const finalCategory =
      category || "Fine Art";

    // ==================================================
    // NUMBERS
    // ==================================================

    let slNo: number | null = null;

    if (slNoString) {
      slNo = parseInt(slNoString, 10);

      if (!Number.isFinite(slNo)) {
        return {
          success: false,
          message: "Invalid Serial Number.",
        };
      }
    }

    let year: number | null = null;

    if (yearString) {
      year = parseInt(yearString, 10);

      if (!Number.isFinite(year)) {
        return {
          success: false,
          message: "Invalid year.",
        };
      }
    }

    // ==================================================
    // UPLOAD DIRECTORY
    // ==================================================

    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "fine-art"
    );

    await mkdir(uploadDir, {
      recursive: true,
    });

    // ==================================================
    // SAVE MAIN IMAGE
    // ==================================================

    const savedImage1 = await saveImage(
      image1,
      uploadDir,
      "Main artwork image"
    );

    if (!savedImage1) {
      return {
        success: false,
        message:
          "Could not save the main artwork image.",
      };
    }

    savedFiles.push(
      savedImage1.filePath
    );

    // ==================================================
    // IMAGE 2
    // ==================================================

    let image2Url: string | null = null;

    if (image2 instanceof File && image2.size > 0) {
      const savedImage2 = await saveImage(
        image2,
        uploadDir,
        "Image 2"
      );

      if (savedImage2) {
        image2Url = savedImage2.url;

        savedFiles.push(
          savedImage2.filePath
        );
      }
    }

    // ==================================================
    // IMAGE 3
    // ==================================================

    let image3Url: string | null = null;

    if (image3 instanceof File && image3.size > 0) {
      const savedImage3 = await saveImage(
        image3,
        uploadDir,
        "Image 3"
      );

      if (savedImage3) {
        image3Url = savedImage3.url;

        savedFiles.push(
          savedImage3.filePath
        );
      }
    }

    // ==================================================
    // PHOTO
    // ==================================================

    let photoUrl: string | null = null;

    if (photo instanceof File && photo.size > 0) {
      const savedPhoto = await saveImage(
        photo,
        uploadDir,
        "Photo"
      );

      if (savedPhoto) {
        photoUrl = savedPhoto.url;

        savedFiles.push(
          savedPhoto.filePath
        );
      }
    }

    // ==================================================
    // CREATE FINE ART RECORD
    // ==================================================

    const fineArt =
      await prisma.fineArt.create({
        data: {
          slNo,

          category:
            finalCategory || null,

          artistName:
            artistName || null,

          itemRefNo:
            itemRefNo || null,

          year,

          image1:
            savedImage1.url,

          image2:
            image2Url,

          image3:
            image3Url,

          titleOfArt:
            titleOfArt || null,

          widthCms:
            widthCms || null,

          withFrame:
            withFrame || null,

          photo:
            photoUrl,

          paintingType:
            paintingType || null,

          productCategory:
            productCategory || null,

          createdAt:
            new Date(),

          updatedAt:
            new Date(),
        },
      });

    // ==================================================
    // SUCCESS
    // ==================================================

    console.log(
      "===================================="
    );

    console.log(
      "FINE ART CREATED SUCCESSFULLY"
    );

    console.log(
      "ID:",
      fineArt.id
    );

    console.log(
      "===================================="
    );

    return {
      success: true,

      message:
        "Fine Art uploaded successfully!",

      fineArt,
    };
  } catch (error: any) {
    // ==================================================
    // ERROR
    // ==================================================

    console.error(
      "===================================="
    );

    console.error(
      "FINE ART UPLOAD ERROR"
    );

    console.error(error);

    console.error(
      "MESSAGE:",
      error?.message
    );

    console.error(
      "STACK:",
      error?.stack
    );

    console.error(
      "===================================="
    );

    // ==================================================
    // DELETE UPLOADED FILES
    // ==================================================

    for (const filePath of savedFiles) {
      try {
        await unlink(filePath);
      } catch {
        // Ignore delete errors
      }
    }

    return {
      success: false,

      message:
        error?.message ||
        "Failed to upload Fine Art.",
    };
  }
}