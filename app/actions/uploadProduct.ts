"use server";

import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

/* =========================================================
   GET STRING
========================================================= */

function getString(
  formData: FormData,
  field: string
): string {
  const value = formData.get(field);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

/* =========================================================
   GET FILE
========================================================= */

function getFile(
  formData: FormData,
  field: string
): File | null {
  const value = formData.get(field);

  if (!(value instanceof File)) {
    return null;
  }

  if (value.size === 0) {
    return null;
  }

  return value;
}

/* =========================================================
   CREATE SAFE FILE NAME
========================================================= */

function createSafeFileName(
  fileName: string
): string {
  const extension =
    path.extname(fileName).toLowerCase() || ".jpg";

  const baseName = path
    .basename(fileName, extension)
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

  return `${baseName || "artwork"}${extension}`;
}

/* =========================================================
   SAVE IMAGE LOCALLY
========================================================= */

async function saveImageLocally(
  file: File,
  folder: string,
  prefix: string
): Promise<string> {
  /* -------------------------------------------------------
     VALIDATE TYPE
  ------------------------------------------------------- */

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error(
      "Only JPG, JPEG, PNG and WEBP images are allowed."
    );
  }

  /* -------------------------------------------------------
     VALIDATE SIZE
  ------------------------------------------------------- */

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      "Image size must be less than 10MB."
    );
  }

  /* -------------------------------------------------------
     CREATE DIRECTORY
  ------------------------------------------------------- */

  const uploadDir = path.join(
    process.cwd(),
    "public",
    "images",
    "products",
    folder
  );

  await mkdir(uploadDir, {
    recursive: true,
  });

  /* -------------------------------------------------------
     FILE NAME
  ------------------------------------------------------- */

  const safeName = createSafeFileName(
    file.name
  );

  const fileName =
    `${prefix}-${Date.now()}-${safeName}`;

  const filePath = path.join(
    uploadDir,
    fileName
  );

  /* -------------------------------------------------------
     SAVE FILE
  ------------------------------------------------------- */

  const bytes = await file.arrayBuffer();

  const buffer = Buffer.from(bytes);

  await writeFile(filePath, buffer);

  /* -------------------------------------------------------
     RETURN WEBSITE URL
  ------------------------------------------------------- */

  return `/images/products/${folder}/${fileName}`;
}

/* =========================================================
   UPLOAD PRODUCT
========================================================= */

export async function uploadProduct(
  formData: FormData
) {
  try {
    console.log(
      "===================================="
    );

    console.log(
      "STARTING PRODUCT UPLOAD"
    );

    console.log(
      "===================================="
    );

    /* =====================================================
       GET FORM DATA
    ===================================================== */

    const title = getString(
      formData,
      "title"
    );

    const category = getString(
      formData,
      "category"
    );

    const referenceNo = getString(
      formData,
      "referenceNo"
    );

    const location = getString(
      formData,
      "location"
    );

    const yearString = getString(
      formData,
      "year"
    );

    const medium = getString(
      formData,
      "medium"
    );

    const size = getString(
      formData,
      "size"
    );

    const image = getFile(
      formData,
      "image"
    );

    const image2 = getFile(
      formData,
      "image2"
    );

    /* =====================================================
       VALIDATION
    ===================================================== */

    if (!title) {
      return {
        success: false,
        message: "Product title is required.",
      };
    }

    if (!category) {
      return {
        success: false,
        message: "Product category is required.",
      };
    }

    if (!referenceNo) {
      return {
        success: false,
        message: "Reference number is required.",
      };
    }

    if (!location) {
      return {
        success: false,
        message: "Location is required.",
      };
    }

    if (!yearString) {
      return {
        success: false,
        message: "Year is required.",
      };
    }

    if (!medium) {
      return {
        success: false,
        message: "Medium is required.",
      };
    }

    if (!size) {
      return {
        success: false,
        message: "Size is required.",
      };
    }

    if (!image) {
      return {
        success: false,
        message:
          "Please select an artwork image.",
      };
    }

    /* =====================================================
       YEAR
    ===================================================== */

    const year = Number(yearString);

    if (
      !Number.isInteger(year) ||
      year < 1000 ||
      year > 9999
    ) {
      return {
        success: false,
        message:
          "Please enter a valid year.",
      };
    }

    /* =====================================================
       CHECK DUPLICATE REFERENCE NO
    ===================================================== */

    const existingProduct =
      await prisma.product.findFirst({
        where: {
          referenceNo: referenceNo,
        },
      });

    if (existingProduct) {
      return {
        success: false,
        message:
          `Reference number "${referenceNo}" already exists.`,
      };
    }

    /* =====================================================
       GET NEXT SL NO
    ===================================================== */

    const lastProduct =
      await prisma.product.findFirst({
        orderBy: {
          slNo: "desc",
        },
      });

    const nextSlNo =
      lastProduct?.slNo
        ? lastProduct.slNo + 1
        : 1;

    console.log(
      "NEXT SL NO:",
      nextSlNo
    );

    /* =====================================================
       CREATE FOLDER NAME
    ===================================================== */

    const folderName =
      referenceNo
        .replace(/[^a-zA-Z0-9-_]/g, "-")
        .replace(/-+/g, "-")
        .toLowerCase();

    /* =====================================================
       SAVE MAIN IMAGE
    ===================================================== */

    console.log(
      "Saving main image locally..."
    );

    const imageUrl =
      await saveImageLocally(
        image,
        folderName,
        "main"
      );

    console.log(
      "MAIN IMAGE:",
      imageUrl
    );

    /* =====================================================
       SAVE IMAGE 2
    ===================================================== */

    let image2Url: string | null = null;

    if (image2) {
      console.log(
        "Saving image 2 locally..."
      );

      image2Url =
        await saveImageLocally(
          image2,
          folderName,
          "image-2"
        );

      console.log(
        "IMAGE 2:",
        image2Url
      );
    }

    /* =====================================================
       SAVE PRODUCT TO MONGODB
    ===================================================== */

    const newProduct =
      await prisma.product.create({
        data: {
          slNo: nextSlNo,

          title: title,

          imageUrl: imageUrl,

          category: category,

          referenceNo: referenceNo,

          location: location,

          year: year,

          medium: medium,

          size: size,

          image2: image2Url,

          createdAt: new Date(),

          updatedAt: new Date(),
        },
      });

    /* =====================================================
       SUCCESS
    ===================================================== */

    console.log(
      "===================================="
    );

    console.log(
      "PRODUCT CREATED SUCCESSFULLY"
    );

    console.log(
      "ID:",
      newProduct.id
    );

    console.log(
      "SL NO:",
      newProduct.slNo
    );

    console.log(
      "IMAGE:",
      imageUrl
    );

    console.log(
      "IMAGE 2:",
      image2Url
    );

    console.log(
      "===================================="
    );

    return {
      success: true,

      message:
        `Product published successfully! SL NO: ${nextSlNo}`,

      product: {
        id: newProduct.id,
        slNo: newProduct.slNo,
        title: newProduct.title,
        imageUrl: newProduct.imageUrl,
        image2: newProduct.image2,
      },
    };

  } catch (error: any) {

    console.error(
      "===================================="
    );

    console.error(
      "PRODUCT UPLOAD ERROR"
    );

    console.error(error);

    console.error(
      "ERROR MESSAGE:",
      error?.message
    );

    console.error(
      "===================================="
    );

    return {
      success: false,

      message:
        error?.message ||
        "Failed to upload product.",
    };
  }
}