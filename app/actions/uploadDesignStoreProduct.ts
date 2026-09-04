"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

/**
 * Upload a Design Store Product
 *
 * Collections:
 * - jewel-tree
 * - living-legacy
 * - nature-window
 * - bags
 */
export async function uploadDesignStoreProduct(
  formData: FormData
) {
  try {
    // =====================================================
    // CHECK ADMIN SESSION
    // =====================================================

    const session = await getServerSession(
      authOptions
    );

    if (!session) {
      return {
        success: false,
        message: "You must be logged in.",
      };
    }

    const role = (
      (session.user as any)?.role || ""
    ).toUpperCase();

    if (role !== "ADMIN") {
      return {
        success: false,
        message: "Unauthorized.",
      };
    }

    // =====================================================
    // GET FORM VALUES
    // =====================================================

    const title =
      String(formData.get("title") || "").trim();

    const collection =
      String(
        formData.get("collection") || ""
      ).trim();

    const description =
      String(
        formData.get("description") || ""
      ).trim();

    const referenceNo =
      String(
        formData.get("referenceNo") || ""
      ).trim();

    const material =
      String(
        formData.get("material") || ""
      ).trim();

    const size =
      String(
        formData.get("size") || ""
      ).trim();

    const priceStr =
      String(
        formData.get("price") || ""
      ).trim();

    const slNoStr =
      String(
        formData.get("slNo") || ""
      ).trim();

    // =====================================================
    // GET IMAGES
    // =====================================================

    const image1 =
      formData.get("image1");

    const image2 =
      formData.get("image2");

    const image3 =
      formData.get("image3");

    const image4 =
      formData.get("image4");

    // =====================================================
    // VALIDATION
    // =====================================================

    if (!title) {
      return {
        success: false,
        message:
          "Product title is required.",
      };
    }

    if (!collection) {
      return {
        success: false,
        message:
          "Please select a collection.",
      };
    }

    const allowedCollections = [
      "jewel-tree",
      "living-legacy",
      "nature-window",
      "bags",
    ];

    if (
      !allowedCollections.includes(
        collection
      )
    ) {
      return {
        success: false,
        message:
          "Invalid Design Store collection.",
      };
    }

    if (
      !image1 ||
      !(image1 instanceof File) ||
      image1.size === 0
    ) {
      return {
        success: false,
        message:
          "Main product image is required.",
      };
    }

    // =====================================================
    // PRICE
    // =====================================================

    let price:
      | number
      | null = null;

    if (priceStr) {
      const parsedPrice =
        Number(priceStr);

      if (
        Number.isNaN(parsedPrice) ||
        parsedPrice < 0
      ) {
        return {
          success: false,
          message:
            "Please enter a valid price.",
        };
      }

      price = parsedPrice;
    }

    // =====================================================
    // SL NO
    // =====================================================

    let slNo:
      | number
      | null = null;

    if (slNoStr) {
      const parsedSlNo =
        Number(slNoStr);

      if (
        Number.isNaN(parsedSlNo) ||
        !Number.isInteger(parsedSlNo) ||
        parsedSlNo < 1
      ) {
        return {
          success: false,
          message:
            "Sl No must be a valid whole number.",
        };
      }

      slNo = parsedSlNo;
    }

    // =====================================================
    // UPLOAD DIRECTORY
    // =====================================================

    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "design-store"
    );

    await mkdir(uploadDir, {
      recursive: true,
    });

    // =====================================================
    // SAVE IMAGE FUNCTION
    // =====================================================

    async function saveImage(
      file: FormDataEntryValue | null,
      imageNumber: number
    ): Promise<string | null> {
      if (
        !file ||
        !(file instanceof File) ||
        file.size === 0
      ) {
        return null;
      }

      // Maximum 10 MB

      if (
        file.size >
        10 * 1024 * 1024
      ) {
        throw new Error(
          `Image ${imageNumber} is larger than 10MB.`
        );
      }

      // Check file type

      if (
        !file.type.startsWith(
          "image/"
        )
      ) {
        throw new Error(
          `Image ${imageNumber} is not a valid image.`
        );
      }

      // Clean filename

      const originalName =
        file.name
          .replace(
            /[^a-zA-Z0-9._-]/g,
            "_"
          )
          .replace(
            /_+/g,
            "_"
          );

      // Unique filename

      const fileName =
        `${Date.now()}-${imageNumber}-${Math.random()
          .toString(36)
          .substring(2, 8)}-${originalName}`;

      const filePath =
        path.join(
          uploadDir,
          fileName
        );

      // Convert File to Buffer

      const bytes =
        await file.arrayBuffer();

      const buffer =
        Buffer.from(bytes);

      // Save file

      await writeFile(
        filePath,
        buffer
      );

      // URL stored in MongoDB

      return `/uploads/design-store/${fileName}`;
    }

    // =====================================================
    // SAVE IMAGES
    // =====================================================

    const image1Url =
      await saveImage(
        image1,
        1
      );

    const image2Url =
      await saveImage(
        image2,
        2
      );

    const image3Url =
      await saveImage(
        image3,
        3
      );

    const image4Url =
      await saveImage(
        image4,
        4
      );

    // =====================================================
    // CREATE DATABASE RECORD
    // =====================================================

    const product =
      await prisma.designStoreProduct.create(
        {
          data: {
            slNo,

            title,

            collection,

            description:
              description || null,

            price,

            image1:
              image1Url!,

            image2:
              image2Url,

            image3:
              image3Url,

            image4:
              image4Url,

            referenceNo:
              referenceNo || null,

            material:
              material || null,

            size:
              size || null,
          },
        }
      );

    // =====================================================
    // SUCCESS
    // =====================================================

    return {
      success: true,
      message:
        "Design Store product added successfully!",
      product: {
        id: product.id,
        title: product.title,
        collection:
          product.collection,
        image1:
          product.image1,
      },
    };
  } catch (error: any) {
    console.error(
      "DESIGN STORE UPLOAD ERROR:",
      error
    );

    return {
      success: false,
      message:
        error?.message ||
        "Failed to upload Design Store product.",
    };
  }
}