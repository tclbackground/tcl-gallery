
"use server";

import { getDb } from "@/lib/mongodb";
import cloudinary from "@/lib/cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { Readable } from "node:stream";

const ALLOWED_COLLECTIONS = [
  "jewel-tree",
  "living-legacy",
  "nature-window",
  "bags",
] as const;

type DesignStoreCollection =
  (typeof ALLOWED_COLLECTIONS)[number];

type UploadedImage = {
  url: string;
  publicId: string;
};

type UploadResult = {
  success: boolean;
  message: string;
  product?: {
    id: string;
    title: string;
    collection: string;
    image1: string;
  };
};

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function getText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getImageFile(
  entry: FormDataEntryValue | null,
  imageNumber: number
): File | null {
  if (entry === null) return null;

  if (typeof entry === "string") {
    throw new Error(`Image ${imageNumber} is invalid.`);
  }

  if (entry.size === 0) return null;

  if (entry.size > MAX_IMAGE_SIZE) {
    throw new Error(`Image ${imageNumber} exceeds 10 MB.`);
  }

  if (!ALLOWED_IMAGE_TYPES.has(entry.type)) {
    throw new Error(
      `Image ${imageNumber} must be JPG, PNG, WEBP, or GIF.`
    );
  }

  return entry;
}

async function uploadImage(
  file: File,
  imageNumber: number
): Promise<UploadedImage> {
  const buffer = Buffer.from(await file.arrayBuffer());

  const publicId = `${Date.now()}-${imageNumber}-${new ObjectId().toString()}`;

  return new Promise<UploadedImage>((resolve, reject) => {
    let settled = false;

    const fail = (error: Error) => {
      if (settled) return;
      settled = true;
      reject(error);
    };

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "tclgallery/design-store",
        public_id: publicId,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          fail(
            new Error(
              `Image ${imageNumber} Cloudinary upload failed: ${error.message}`
            )
          );
          return;
        }

        if (!result) {
          fail(
            new Error(
              `Image ${imageNumber} upload returned no result.`
            )
          );
          return;
        }

        if (settled) return;
        settled = true;

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    uploadStream.on("error", (error: Error) => {
      fail(error);
    });

    const source = Readable.from(buffer);

    source.on("error", (error: Error) => {
      uploadStream.destroy(error);
      fail(error);
    });

    source.pipe(uploadStream);
  });
}

export async function uploadDesignStoreProduct(
  formData: FormData
): Promise<UploadResult> {
  try {
    // 1. Verify the user's session and role.
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
    const title = getText(formData, "title");
    const collection = getText(formData, "collection").toLowerCase();
    const description = getText(formData, "description");
    const referenceNo = getText(formData, "referenceNo");
    const material = getText(formData, "material");
    const size = getText(formData, "size");
    const priceStr = getText(formData, "price");
    const slNoStr = getText(formData, "slNo");

    // 3. Validate fields before uploading images.
    if (!title) {
      throw new Error("Product title is required.");
    }

    if (
      !ALLOWED_COLLECTIONS.includes(
        collection as DesignStoreCollection
      )
    ) {
      throw new Error("Invalid Design Store collection.");
    }

    let price: number | null = null;

    if (priceStr !== "") {
      const parsedPrice = Number(priceStr);

      if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
        throw new Error("Please enter a valid price.");
      }

      price = parsedPrice;
    }

    let slNo: number | null = null;

    if (slNoStr !== "") {
      const parsedSlNo = Number(slNoStr);

      if (!Number.isSafeInteger(parsedSlNo) || parsedSlNo < 1) {
        throw new Error("Sl No must be a positive whole number.");
      }

      slNo = parsedSlNo;
    }

    const imageFiles = [
      getImageFile(formData.get("image1"), 1),
      getImageFile(formData.get("image2"), 2),
      getImageFile(formData.get("image3"), 3),
      getImageFile(formData.get("image4"), 4),
    ];

    if (!imageFiles[0]) {
      throw new Error("Main product image is required.");
    }

    // 4. Upload images to Cloudinary.
    // Keep successful uploads if the later database insert fails.
    const images: Array<UploadedImage | null> = [];

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];

      if (!file) {
        images.push(null);
        continue;
      }

      const uploaded = await uploadImage(file, i + 1);

      console.log(`[Design Store] Image ${i + 1} uploaded:`, {
        publicId: uploaded.publicId,
        hasSecureUrl: Boolean(uploaded.url),
      });

      images.push(uploaded);
    }

    const [image1, image2, image3, image4] = images;

    if (!image1) {
      throw new Error("Main product image upload failed.");
    }

    // 5. Connect to the existing MongoDB database.
    console.log("[Design Store] Connecting to MongoDB...");

    const db = await getDb();

    console.log("[Design Store] Database:", db.databaseName);
    console.log("[Design Store] Collection: DesignStoreProduct");

    // 6. Build the document.
    const now = new Date();

    const document = {
      slNo,
      title,
      collection,
      description: description || null,
      price,
      image1: image1.url,
      image2: image2?.url ?? null,
      image3: image3?.url ?? null,
      image4: image4?.url ?? null,
      referenceNo: referenceNo || null,
      material: material || null,
      size: size || null,

      image1PublicId: image1.publicId,
      image2PublicId: image2?.publicId ?? null,
      image3PublicId: image3?.publicId ?? null,
      image4PublicId: image4?.publicId ?? null,

      createdAt: now,
      updatedAt: now,
    };

    console.log("[Design Store] Attempting MongoDB insert:", {
      title: document.title,
      collection: document.collection,
      hasImage1: Boolean(document.image1),
      price: document.price,
    });

    // 7. Insert into the existing collection.
    const result = await db
      .collection("DesignStoreProduct")
      .insertOne(document);

    console.log("[Design Store] MongoDB insert result:", {
      acknowledged: result.acknowledged,
      insertedId: result.insertedId.toString(),
    });

    if (!result.acknowledged) {
      throw new Error(
        "MongoDB did not acknowledge the product insertion."
      );
    }

    // 8. Return success only after MongoDB confirms the insert.
    return {
      success: true,
      message: "Design Store product saved successfully!",
      product: {
        id: result.insertedId.toString(),
        title,
        collection,
        image1: image1.url,
      },
    };
  } catch (error: unknown) {
    console.error("[Design Store] UPLOAD/SAVE ERROR:", error);

    const message =
      error instanceof Error
        ? error.message
        : "An unknown error occurred.";

    return {
      success: false,
      message: `Product was not confirmed as saved: ${message}`,
    };
  }
}
