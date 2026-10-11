
"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/mongodb";
import cloudinary from "@/lib/cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_TOTAL_FILE_SIZE = 25 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

type UploadedImage = {
  url: string;
  publicId: string;
};

function getString(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function getFile(formData: FormData, name: string): File | null {
  const value = formData.get(name);

  if (
    !value ||
    typeof value === "string" ||
    value.size === 0
  ) {
    return null;
  }

  return value;
}

async function uploadImage(
  file: File,
  label: string
): Promise<UploadedImage> {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error(
      `${label}: Only JPG, PNG and WEBP images are allowed.`
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `${label}: Image must be 10 MB or smaller.`
    );
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const dataUri =
    `data:${file.type};base64,${bytes.toString("base64")}`;

  try {
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "tcl-gallery/fine-art",
      resource_type: "image",
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error: unknown) {
    // Log the original error on the server for diagnosis.
    console.error(`${label} Cloudinary upload failed:`, error);

    throw new Error(
      `${label} upload failed. Check Cloudinary credentials and server logs.`
    );
  }
}

export async function uploadFineArt(formData: FormData) {
  const uploadedImages: UploadedImage[] = [];

  try {
    // 1. Verify the current session and admin role.
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return {
        success: false,
        message: "You must be logged in.",
      };
    }

    const role = String(
      (session.user as { role?: string }).role ?? ""
    ).toUpperCase();

    if (role !== "ADMIN") {
      return {
        success: false,
        message: "Unauthorized. Admin access is required.",
      };
    }

    // 2. Read form fields.
    const titleOfArt = getString(formData, "titleOfArt");
    const artistName = getString(formData, "artistName");
    const itemRefNo = getString(formData, "itemRefNo");

    const category =
      getString(formData, "category") || "Fine Art";

    const paintingType = getString(formData, "paintingType");
    const productCategory = getString(formData, "productCategory");
    const widthCms = getString(formData, "widthCms");
    const withFrame = getString(formData, "withFrame");
    const slNoString = getString(formData, "slNo");
    const yearString = getString(formData, "year");

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

    const mainFile = getFile(formData, "image1");

    if (!mainFile) {
      return {
        success: false,
        message: "Main artwork image is required.",
      };
    }

    // 3. Validate optional images and total request file size.
    const image2File = getFile(formData, "image2");
    const image3File = getFile(formData, "image3");
    const photoFile = getFile(formData, "photo");

    const files = [
      mainFile,
      image2File,
      image3File,
      photoFile,
    ].filter((file): file is File => file !== null);

    const totalSize = files.reduce(
      (total, file) => total + file.size,
      0
    );

    if (totalSize > MAX_TOTAL_FILE_SIZE) {
      return {
        success: false,
        message:
          "Combined image size must be 25 MB or smaller. Please compress the images.",
      };
    }

    for (const [index, file] of files.entries()) {
      if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
        return {
          success: false,
          message: `Image ${index + 1}: Only JPG, PNG and WEBP images are allowed.`,
        };
      }

      if (file.size > MAX_FILE_SIZE) {
        return {
          success: false,
          message: `Image ${index + 1} must be 10 MB or smaller.`,
        };
      }
    }

    // 4. Validate numeric fields before uploading.
    let slNo: number | null = null;
    let year: number | null = null;

    if (slNoString) {
      slNo = Number(slNoString);

      if (!Number.isSafeInteger(slNo) || slNo < 1) {
        return {
          success: false,
          message: "Invalid Serial Number.",
        };
      }
    }

    if (yearString) {
      year = Number(yearString);

      if (
        !Number.isInteger(year) ||
        year < 0 ||
        year > 9999
      ) {
        return {
          success: false,
          message: "Invalid year.",
        };
      }
    }

    // 5. Upload images sequentially and track them for cleanup.
    const image1 = await uploadImage(
      mainFile,
      "Main artwork image"
    );
    uploadedImages.push(image1);

    let image2: UploadedImage | null = null;

    if (image2File) {
      image2 = await uploadImage(image2File, "Image 2");
      uploadedImages.push(image2);
    }

    let image3: UploadedImage | null = null;

    if (image3File) {
      image3 = await uploadImage(image3File, "Image 3");
      uploadedImages.push(image3);
    }

    let photo: UploadedImage | null = null;

    if (photoFile) {
      photo = await uploadImage(photoFile, "Photo");
      uploadedImages.push(photo);
    }

    // 6. Save the artwork to the existing MongoDB database.
    const db = await getDb();
    const now = new Date();

    const document = {
      slNo,
      category,
      artistName,
      itemRefNo,
      year,
      image1: image1.url,
      image2: image2?.url ?? null,
      image3: image3?.url ?? null,
      titleOfArt,
      widthCms: widthCms || null,
      withFrame: withFrame || null,
      photo: photo?.url ?? null,
      paintingType: paintingType || null,
      productCategory: productCategory || null,

      image1PublicId: image1.publicId,
      image2PublicId: image2?.publicId ?? null,
      image3PublicId: image3?.publicId ?? null,
      photoPublicId: photo?.publicId ?? null,

      createdAt: now,
      updatedAt: now,
    };

    const insertResult = await db
      .collection("FineArt")
      .insertOne(document);

    // 7. Refresh pages displaying Fine Art.
    revalidatePath("/admin/fine-art");
    revalidatePath("/admin/fine-art/new");
    revalidatePath("/");

    return {
      success: true,
      message: "Fine Art uploaded successfully!",
      fineArt: {
        id: insertResult.insertedId.toString(),
        titleOfArt,
        artistName,
        itemRefNo,
        image1: image1.url,
      },
    };
  } catch (error: unknown) {
    console.error("FINE ART UPLOAD ERROR:", error);

    // Remove images already uploaded if a later operation fails.
    const cleanupResults = await Promise.allSettled(
      uploadedImages.map((image) =>
        cloudinary.uploader.destroy(image.publicId)
      )
    );

    cleanupResults.forEach((result) => {
      if (result.status === "rejected") {
        console.error(
          "Cloudinary cleanup failed:",
          result.reason
        );
      }
    });

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to upload Fine Art. Check server logs.",
    };
  }
}
