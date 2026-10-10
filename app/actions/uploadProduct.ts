"use server";

import { getDb } from "@/lib/mongodb";
import cloudinary from "@/lib/cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

function getString(formData: FormData, field: string): string {
  const value = formData.get(field);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

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

function validateImage(file: File) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error(
      "Only JPG, JPEG, PNG and WEBP images are allowed."
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Image size must be less than 10MB.");
  }
}

async function uploadToCloudinary(
  file: File,
  folder: string,
  publicId: string
): Promise<{
  url: string;
  publicId: string;
}> {
  validateImage(file);

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const result = await new Promise<any>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: "image",
        overwrite: false,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(buffer);
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}

export async function uploadProduct(formData: FormData) {
  try {
    console.log("====================================");
    console.log("STARTING PRODUCT UPLOAD");
    console.log("====================================");

    // =========================================================
    // ADMIN AUTHENTICATION
    // =========================================================

    const session = await getServerSession(authOptions);

    if (
      !session ||
      (session.user as any)?.role !== "ADMIN"
    ) {
      return {
        success: false,
        message: "Unauthorized. Admin access required.",
      };
    }

    // =========================================================
    // GET FORM DATA
    // =========================================================

    const title = getString(formData, "title");
    const category = getString(formData, "category");
    const referenceNo = getString(formData, "referenceNo");
    const location = getString(formData, "location");
    const yearString = getString(formData, "year");
    const medium = getString(formData, "medium");
    const size = getString(formData, "size");

    const image = getFile(formData, "image");
    const image2 = getFile(formData, "image2");

    // =========================================================
    // VALIDATION
    // =========================================================

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
        message: "Please select an artwork image.",
      };
    }

    // =========================================================
    // YEAR
    // =========================================================

    const year = Number(yearString);

    if (
      !Number.isInteger(year) ||
      year < 1000 ||
      year > 9999
    ) {
      return {
        success: false,
        message: "Please enter a valid year.",
      };
    }

    // =========================================================
    // MONGODB
    // =========================================================

    const db = await getDb();

    const productsCollection = db.collection("Product");

    // =========================================================
    // CHECK DUPLICATE REFERENCE NUMBER
    // =========================================================

    const existingProduct = await productsCollection.findOne({
      "REFERENCE NO": referenceNo,
    });

    if (existingProduct) {
      return {
        success: false,
        message:
          `Reference number "${referenceNo}" already exists.`,
      };
    }

    // =========================================================
    // GET NEXT SL NO
    // =========================================================

    const lastProduct = await productsCollection
      .find({})
      .sort({ "SL NO": -1 })
      .limit(1)
      .next();

    const lastSlNo = lastProduct?.["SL NO"];

    const nextSlNo =
      typeof lastSlNo === "number"
        ? lastSlNo + 1
        : 1;

    console.log("NEXT SL NO:", nextSlNo);

    // =========================================================
    // CREATE CLOUDINARY FOLDER
    // =========================================================

    const safeReferenceNo = referenceNo
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase();

    const cloudinaryFolder =
      "tcl-gallery/products";

    // =========================================================
    // UPLOAD MAIN IMAGE
    // =========================================================

    console.log("Uploading main image to Cloudinary...");

    const mainImage = await uploadToCloudinary(
      image,
      cloudinaryFolder,
      `${safeReferenceNo}-main`
    );

    console.log(
      "MAIN IMAGE:",
      mainImage.url
    );

    // =========================================================
    // UPLOAD IMAGE 2
    // =========================================================

    let secondImage: {
      url: string;
      publicId: string;
    } | null = null;

    if (image2) {
      console.log(
        "Uploading image 2 to Cloudinary..."
      );

      secondImage = await uploadToCloudinary(
        image2,
        cloudinaryFolder,
        `${safeReferenceNo}-image-2`
      );

      console.log(
        "IMAGE 2:",
        secondImage.url
      );
    }

    // =========================================================
    // CREATE PRODUCT DOCUMENT
    // =========================================================

    const now = new Date();

    const product = {
      "SL NO": nextSlNo,

      TITLE: title,

      "IMAGE URL": mainImage.url,

      "IMAGE 2": secondImage?.url ?? null,

      "IMAGE 3": null,
      "IMAGE 4": null,
      "IMAGE 5": null,

      "REFERENCE NO": referenceNo,

      LOCATION: location,

      YEAR: year,

      MEDIUM: medium,

      SIZE: size,

      "12X18 PRICE": null,
      "18X24 PRICE": null,
      "24X33 PRICE": null,

      category,

      description: null,

      artistId: null,

      cloudinaryPublicId: mainImage.publicId,

      cloudinaryImage2PublicId:
        secondImage?.publicId ?? null,

      createdAt: now,

      updatedAt: now,
    };

    // =========================================================
    // SAVE TO MONGODB
    // =========================================================

    const result =
      await productsCollection.insertOne(product);

    console.log(
      "PRODUCT CREATED:",
      result.insertedId.toString()
    );

    console.log("====================================");
    console.log(
      "PRODUCT CREATED SUCCESSFULLY"
    );
    console.log("====================================");

    return {
      success: true,

      message:
        `Product published successfully! SL NO: ${nextSlNo}`,

      product: {
        id: result.insertedId.toString(),

        slNo: nextSlNo,

        title,

        imageUrl: mainImage.url,

        image2:
          secondImage?.url ?? null,
      },
    };
  } catch (error: any) {
    console.error("====================================");
    console.error("PRODUCT UPLOAD ERROR");
    console.error("====================================");

    console.error(error);

    return {
      success: false,

      message:
        error?.message ||
        "Failed to upload product.",
    };
  }
}