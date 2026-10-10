
"use server";

import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import cloudinary from "@/lib/cloudinary";

/* =========================================================
   HELPERS
========================================================= */

function getText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getOptionalText(
  formData: FormData,
  key: string
): string | null {
  return getText(formData, key) || null;
}

function getNumber(
  formData: FormData,
  key: string
): number | null {
  const value = getText(formData, key);

  if (!value) return null;

  const number = Number(value);

  if (!Number.isFinite(number) || number < 0) {
    throw new Error(`Invalid value for ${key}.`);
  }

  return number;
}

function getOptionalFile(
  formData: FormData,
  key: string
): File | null {
  const value = formData.get(key);

  if (
    typeof File === "undefined" ||
    !(value instanceof File) ||
    value.size === 0
  ) {
    return null;
  }

  return value;
}

function validObjectId(value: string): boolean {
  return ObjectId.isValid(value);
}

async function uploadImage(
  file: File,
  folder: string
): Promise<string> {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      "Upload a JPG, PNG, WEBP or GIF image."
    );
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new Error(
      "Image size must not exceed 10 MB."
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const dataUri =
    `data:${file.type};base64,${buffer.toString("base64")}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: "image",
  });

  return result.secure_url;
}

function getExistingValue(
  formData: FormData,
  keys: string[],
  fallback: unknown
): string | null {
  for (const key of keys) {
    if (formData.has(key)) {
      // An explicitly submitted empty string means the image
      // was removed. Do not restore the old image in that case.
      return getText(formData, key) || null;
    }
  }

  return typeof fallback === "string" && fallback.trim()
    ? fallback.trim()
    : null;
}

function getImageFile(
  formData: FormData,
  key: string
): File | null {
  return getOptionalFile(formData, key);
}

function revalidateArtworkPaths(id?: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/artworks");
  revalidatePath("/admin/artists");
  revalidatePath("/shop");
  revalidatePath("/cart");
  revalidatePath("/checkout");

  if (id) {
    revalidatePath(`/shop/${id}`);
  }
}

/* =========================================================
   CREATE ARTIST
========================================================= */

export async function uploadArtist(formData: FormData) {
  try {
    const name = getText(formData, "name");

    if (!name) {
      return {
        success: false,
        message: "Artist name is required.",
      };
    }

    let imageUrl =
      getOptionalText(formData, "imageUrl");

    const imageFile = getImageFile(formData, "image");

    if (imageFile) {
      imageUrl = await uploadImage(
        imageFile,
        "tcl-gallery/artists"
      );
    }

    const db = await getDb();

    const result = await db.collection("Artist").insertOne({
      name,
      imageUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    revalidateArtworkPaths();

    return {
      success: true,
      message: "Artist added successfully.",
      artistId: result.insertedId.toString(),
    };
  } catch (error) {
    console.error("Artist creation error:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to add artist.",
    };
  }
}

/* =========================================================
   UPDATE ARTIST
========================================================= */

export async function updateArtist(formData: FormData) {
  try {
    const id = getText(formData, "id");
    const name = getText(formData, "name");

    if (!validObjectId(id)) {
      return {
        success: false,
        message: "A valid artist ID is required.",
      };
    }

    if (!name) {
      return {
        success: false,
        message: "Artist name is required.",
      };
    }

    const db = await getDb();

    const existingArtist = await db
      .collection("Artist")
      .findOne({ _id: new ObjectId(id) });

    if (!existingArtist) {
      return {
        success: false,
        message: "Artist not found.",
      };
    }

    let imageUrl = getExistingValue(
      formData,
      ["imageUrl", "existingImageUrl"],
      existingArtist.imageUrl
    );

    const imageFile = getImageFile(formData, "image");

    if (imageFile) {
      imageUrl = await uploadImage(
        imageFile,
        "tcl-gallery/artists"
      );
    }

    await db.collection("Artist").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name,
          imageUrl,
          updatedAt: new Date(),
        },
      }
    );

    revalidateArtworkPaths();

    return {
      success: true,
      message: "Artist updated successfully.",
    };
  } catch (error) {
    console.error("Artist update error:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update artist.",
    };
  }
}

/* =========================================================
   DELETE ARTIST
========================================================= */

export async function deleteArtist(id: string) {
  try {
    if (!validObjectId(id)) {
      return {
        success: false,
        message: "A valid artist ID is required.",
      };
    }

    const db = await getDb();

    const result = await db.collection("Artist").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return {
        success: false,
        message: "Artist not found.",
      };
    }

    revalidateArtworkPaths();

    return {
      success: true,
      message: "Artist deleted successfully.",
    };
  } catch (error) {
    console.error("Artist deletion error:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete artist.",
    };
  }
}

/* =========================================================
   UPDATE PRODUCT / ARTWORK
========================================================= */

export async function updateProduct(formData: FormData) {
  try {
    const id = getText(formData, "id");

    if (!validObjectId(id)) {
      return {
        success: false,
        message: "A valid artwork ID is required.",
      };
    }

    const db = await getDb();
    const productCollection = db.collection("Product");
    const productId = new ObjectId(id);

    const existingProduct = await productCollection.findOne({
      _id: productId,
    });

    if (!existingProduct) {
      return {
        success: false,
        message: "Artwork not found.",
      };
    }

    /* BASIC FIELDS */

    const title = getText(formData, "title");

    if (!title) {
      return {
        success: false,
        message: "Artwork title is required.",
      };
    }

    const category = getOptionalText(formData, "category");
    const description = getOptionalText(formData, "description");

    const referenceNo = getOptionalText(
      formData,
      "referenceNo"
    );

    const location = getOptionalText(
      formData,
      "location"
    );

    const medium = getOptionalText(
      formData,
      "medium"
    );

    const size = getOptionalText(
      formData,
      "size"
    );

    /* ARTIST */

    const artistIdValue = getText(formData, "artistId");
    let artistId: ObjectId | null = null;

    if (artistIdValue) {
      if (!validObjectId(artistIdValue)) {
        return {
          success: false,
          message: "Please select a valid artist.",
        };
      }

      artistId = new ObjectId(artistIdValue);

      const artistExists = await db.collection("Artist").findOne({
        _id: artistId,
      });

      if (!artistExists) {
        return {
          success: false,
          message: "Selected artist was not found.",
        };
      }
    }

    /* NUMERIC FIELDS */

    const yearValue = getText(formData, "year");
    const slNoValue = getText(formData, "slNo");

    const year = yearValue
      ? Number.parseInt(yearValue, 10)
      : null;

    const slNo = slNoValue
      ? Number.parseInt(slNoValue, 10)
      : null;

    if (yearValue && !Number.isFinite(year)) {
      throw new Error("Invalid artwork year.");
    }

    if (slNoValue && !Number.isFinite(slNo)) {
      throw new Error("Invalid serial number.");
    }

    /* IMAGE 1 — MAIN IMAGE */

    let imageUrl = getExistingValue(
      formData,
      ["imageUrlInput", "existingImageUrl"],
      existingProduct["IMAGE URL"] ??
        existingProduct.imageUrl
    );

    const mainImage = getImageFile(formData, "image");

    if (mainImage) {
      imageUrl = await uploadImage(
        mainImage,
        "tcl-gallery/products"
      );
    }

    /* IMAGES 2–5 */

    const imageResults: Record<string, string | null> = {};

    for (let number = 2; number <= 5; number++) {
      const databaseKey = `IMAGE ${number}`;
      const camelKey = `image${number}`;

      const imageFile = getImageFile(
        formData,
        `image${number}`
      );

      let imageUrlForSlot = getExistingValue(
        formData,
        [
          `imageUrlInput${number}`,
          `existingImage${number}`,
        ],
        existingProduct[databaseKey] ??
          existingProduct[camelKey]
      );

      if (imageFile) {
        imageUrlForSlot = await uploadImage(
          imageFile,
          "tcl-gallery/products"
        );
      }

      imageResults[databaseKey] = imageUrlForSlot;
    }

    /*
     * The current EditProductForm sends one field named "price".
     * The existing Product schema has separate size-price fields.
     *
     * To preserve the existing size prices, update only the
     * 12X18 price when the single price field is submitted.
     * The other two size prices remain unchanged.
     */

    const priceValue = getText(formData, "price");
    const singlePrice = priceValue
      ? Number(priceValue)
      : null;

    if (
      singlePrice !== null &&
      (!Number.isFinite(singlePrice) || singlePrice < 0)
    ) {
      throw new Error("Enter a valid artwork price.");
    }

    /* UPDATE DOCUMENT */

    const updateData: Record<string, unknown> = {
      "TITLE": title,
      "IMAGE URL": imageUrl,
      "IMAGE 2": imageResults["IMAGE 2"],
      "IMAGE 3": imageResults["IMAGE 3"],
      "IMAGE 4": imageResults["IMAGE 4"],
      "IMAGE 5": imageResults["IMAGE 5"],
      "REFERENCE NO": referenceNo,
      "LOCATION": location,
      "MEDIUM": medium,
      "SIZE": size,
      category,
      description,
      artistId,
      updatedAt: new Date(),
    };

    if (year !== null) {
      updateData["YEAR"] = year;
    }

    if (slNo !== null) {
      updateData["SL NO"] = slNo;
    }

    if (singlePrice !== null) {
      updateData.price = singlePrice;
      updateData["12X18 PRICE"] = singlePrice;
    }

    // Preserve size prices if this action is also called by
    // another form that sends individual size-price fields.
    for (const [field, databaseKey] of [
      ["price12x18", "12X18 PRICE"],
      ["price18x24", "18X24 PRICE"],
      ["price24x33", "24X33 PRICE"],
    ]) {
      if (formData.has(field)) {
        const value = getNumber(formData, field);

        if (value !== null) {
          updateData[databaseKey] = value;
        }
      }
    }

    const result = await productCollection.updateOne(
      { _id: productId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return {
        success: false,
        message: "Artwork was not updated.",
      };
    }

    revalidateArtworkPaths(id);

    return {
      success: true,
      message: "Artwork updated successfully.",
    };
  } catch (error) {
    console.error("Artwork update error:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update artwork.",
    };
  }
}

/* =========================================================
   DELETE PRODUCT / ARTWORK
========================================================= */

export async function deleteProduct(id: string) {
  try {
    if (!validObjectId(id)) {
      return {
        success: false,
        message: "A valid artwork ID is required.",
      };
    }

    const db = await getDb();

    const result = await db.collection("Product").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return {
        success: false,
        message: "Artwork not found.",
      };
    }

    revalidateArtworkPaths();

    return {
      success: true,
      message: "Artwork deleted successfully.",
    };
  } catch (error) {
    console.error("Artwork deletion error:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete artwork.",
    };
  }
}
