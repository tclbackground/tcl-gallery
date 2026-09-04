"use server";

import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function uploadProduct(formData: FormData) {
  try {
    // =====================================================
    // GET FORM DATA
    // =====================================================

    const title = String(
      formData.get("title") || ""
    ).trim();

    const priceStr = String(
      formData.get("price") || ""
    ).trim();

    const category = String(
      formData.get("category") || ""
    ).trim();

    const description = String(
      formData.get("description") || ""
    ).trim();

    const image = formData.get("image");

    // =====================================================
    // VALIDATION
    // =====================================================

    if (!title) {
      return {
        success: false,
        message: "Product title is required.",
      };
    }

    if (!priceStr) {
      return {
        success: false,
        message: "Product price is required.",
      };
    }

    if (!category) {
      return {
        success: false,
        message: "Product category is required.",
      };
    }

    if (!image || !(image instanceof File)) {
      return {
        success: false,
        message: "Please select an artwork image.",
      };
    }

    // =====================================================
    // CONVERT PRICE
    // =====================================================

    const price = parseFloat(priceStr);

    if (!Number.isFinite(price) || price < 0) {
      return {
        success: false,
        message: "Please enter a valid price.",
      };
    }

    // =====================================================
    // IMAGE VALIDATION
    // =====================================================

    if (!image.type.startsWith("image/")) {
      return {
        success: false,
        message: "Only image files are allowed.",
      };
    }

    // Maximum 10 MB

    const maxSize = 10 * 1024 * 1024;

    if (image.size > maxSize) {
      return {
        success: false,
        message: "Image size must be less than 10MB.",
      };
    }

    // =====================================================
    // CREATE UPLOAD DIRECTORY
    // =====================================================

    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads"
    );

    await mkdir(uploadDir, {
      recursive: true,
    });

    // =====================================================
    // CREATE SAFE FILE NAME
    // =====================================================

    const originalName = image.name;

    const extension =
      path.extname(originalName).toLowerCase() || ".jpg";

    const baseName = path
      .basename(originalName, extension)
      .replace(/[^a-zA-Z0-9-_]/g, "_")
      .replace(/_+/g, "_");

    const fileName =
      `${Date.now()}-${baseName}${extension}`;

    const filePath = path.join(
      uploadDir,
      fileName
    );

    // =====================================================
    // SAVE IMAGE
    // =====================================================

    const bytes = await image.arrayBuffer();

    const buffer = Buffer.from(bytes);

    await writeFile(filePath, buffer);

    // URL accessible from website

    const imageUrl =
      `/uploads/${fileName}`;

    console.log("Image uploaded:", imageUrl);

    // =====================================================
    // SAVE PRODUCT TO MONGODB
    // =====================================================

    const newProduct = await prisma.product.create({
      data: {
        title,

        category,

        description:
          description || null,

        imageUrl,

        // IMPORTANT:
        // Product model has NO "price" field.
        // The available price fields are:
        // price12x18
        // price18x24
        // price24x33

        price12x18: price,

        price18x24: null,

        price24x33: null,

        createdAt: new Date(),

        updatedAt: new Date(),
      },
    });

    // =====================================================
    // SUCCESS
    // =====================================================

    console.log(
      "Product created successfully:",
      newProduct.id
    );

    return {
      success: true,
      message:
        "Product and image uploaded successfully!",
      product: newProduct,
    };
  } catch (error: any) {
    // =====================================================
    // ERROR
    // =====================================================

    console.error(
      "===================================="
    );

    console.error(
      "PRODUCT UPLOAD ERROR:"
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
        "Failed to upload product to server.",
    };
  }
}