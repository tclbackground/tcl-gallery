
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
      return { success: false, message: "A valid product ID is required." };
    }

    const db = await getDb();
    const productId = new ObjectId(id);

    // The edit page sends this value so the action updates the same
    // collection from which the product was loaded.
    const requestedCollection = getText(formData, "sourceCollection");
    const allowedCollections = ["DesignStoreProduct", "JewelTree", "Product"];
    const collectionNames = requestedCollection
      ? [requestedCollection]
      : allowedCollections;

    if (collectionNames.some((name) => !allowedCollections.includes(name))) {
      return { success: false, message: "Invalid product collection." };
    }

    let collectionName = "";
    let productCollection: ReturnType<typeof db.collection> | null = null;
    let existingProduct: any = null;

    for (const name of collectionNames) {
      const collection = db.collection(name);
      const found = await collection.findOne({ _id: productId });
      if (found) {
        collectionName = name;
        productCollection = collection;
        existingProduct = found;
        break;
      }
    }

    if (!existingProduct || !productCollection) {
      return {
        success: false,
        message: "Product not found in the selected collection. Refresh the page and try again.",
      };
    }

    const title = getText(formData, "title");
    if (!title) {
      return { success: false, message: "Product title is required." };
    }

    const category = getOptionalText(formData, "category");
    const description = getOptionalText(formData, "description");
    const referenceNo = getOptionalText(formData, "referenceNo");
    const location = getOptionalText(formData, "location");
    const medium = getOptionalText(formData, "medium");
    const size = getOptionalText(formData, "size");

    const artistIdValue = getText(formData, "artistId");
    let artistId: ObjectId | null = null;
    if (artistIdValue) {
      if (!validObjectId(artistIdValue)) {
        return { success: false, message: "Please select a valid artist." };
      }
      artistId = new ObjectId(artistIdValue);
      const artistExists = await db.collection("Artist").findOne({ _id: artistId });
      if (!artistExists) {
        return { success: false, message: "Selected artist was not found." };
      }
    }

    const yearValue = getText(formData, "year");
    const slNoValue = getText(formData, "slNo");
    const year = yearValue ? Number.parseInt(yearValue, 10) : null;
    const slNo = slNoValue ? Number.parseInt(slNoValue, 10) : null;
    if (yearValue && !Number.isFinite(year)) throw new Error("Invalid product year.");
    if (slNoValue && !Number.isFinite(slNo)) throw new Error("Invalid serial number.");

    const mainImageFile = getImageFile(formData, "image");
    let mainImageUrl = getExistingValue(
      formData,
      ["imageUrlInput", "existingImageUrl"],
      existingProduct["IMAGE URL"] ??
        existingProduct.imageUrl ??
        existingProduct.image1 ??
        existingProduct.mainImage
    );
    if (mainImageFile) {
      mainImageUrl = await uploadImage(mainImageFile, "tcl-gallery/products");
    }

    const additionalImageUrls: (string | null)[] = [];
    for (let number = 2; number <= 5; number++) {
      const imageFile = getImageFile(formData, `image${number}`);
      let imageUrl = getExistingValue(
        formData,
        [`imageUrlInput${number}`, `existingImage${number}`],
        existingProduct[`IMAGE ${number}`] ??
          existingProduct[`image${number}`] ??
          (Array.isArray(existingProduct.images)
            ? existingProduct.images[number - 1]
            : null)
      );
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, "tcl-gallery/products");
      }
      additionalImageUrls.push(imageUrl);
    }

    const priceValue = getText(formData, "price");
    const singlePrice = priceValue ? Number(priceValue) : null;
    if (singlePrice !== null && (!Number.isFinite(singlePrice) || singlePrice < 0)) {
      throw new Error("Enter a valid product price.");
    }

    // Keep the existing field naming convention in DesignStoreProduct and
    // JewelTree. For the legacy Product collection, retain its established
    // uppercase field names and price behaviour.
    const findExistingKey = (keys: string[], fallback: string) =>
      keys.find((key) => Object.prototype.hasOwnProperty.call(existingProduct, key)) || fallback;

    const updateData: Record<string, unknown> = {};

    if (collectionName === "Product") {
      updateData["TITLE"] = title;
      updateData["IMAGE URL"] = mainImageUrl;
      for (let number = 2; number <= 5; number++) {
        updateData[`IMAGE ${number}`] = additionalImageUrls[number - 2];
      }
      updateData["REFERENCE NO"] = referenceNo;
      updateData["LOCATION"] = location;
      updateData["MEDIUM"] = medium;
      updateData["SIZE"] = size;
      updateData.category = category;
      updateData.description = description;
      updateData.artistId = artistId;
      if (year !== null) updateData["YEAR"] = year;
      if (slNo !== null) updateData["SL NO"] = slNo;
      if (singlePrice !== null) {
        updateData.price = singlePrice;
        updateData["12X18 PRICE"] = singlePrice;
      }
      for (const [field, databaseKey] of [
        ["price12x18", "12X18 PRICE"],
        ["price18x24", "18X24 PRICE"],
        ["price24x33", "24X33 PRICE"],
      ]) {
        if (formData.has(field)) {
          const value = getNumber(formData, field);
          if (value !== null) updateData[databaseKey] = value;
        }
      }
    } else {
      const titleKey = findExistingKey(["title", "Title", "TITLE", "name", "Name", "productName", "Product Name"], "title");
      const categoryKey = findExistingKey(["category", "Category", "collection", "Collection"], "category");
      const descriptionKey = findExistingKey(["description", "Description"], "description");
      const priceKey = findExistingKey(["price", "Price", "PRICE", "sellingPrice", "Selling Price"], "price");
      const mainImageKey = findExistingKey(["imageUrl", "image1", "Image URL", "IMAGE URL", "mainImage", "image"], "imageUrl");

      updateData[titleKey] = title;
      updateData[categoryKey] = category;
      updateData[descriptionKey] = description;
      updateData[mainImageKey] = mainImageUrl;

      // Update the product's current image structure without changing its schema.
      if (Array.isArray(existingProduct.images)) {
        updateData.images = additionalImageUrls;
      } else {
        for (let number = 2; number <= 5; number++) {
          const imageKey = findExistingKey(
            [`image${number}`, `Image ${number}`, `IMAGE ${number}`],
            `image${number}`
          );
          updateData[imageKey] = additionalImageUrls[number - 2];
        }
      }

      if (singlePrice !== null) updateData[priceKey] = singlePrice;

      const optionalMappings: [string, string[] , string][] = [
        ["referenceNo", ["referenceNo", "referenceNumber", "Reference No", "REFERENCE NO"], "referenceNo"],
        ["location", ["location", "Location", "LOCATION"], "location"],
        ["medium", ["medium", "Medium", "MEDIUM", "material", "Material"], "medium"],
        ["size", ["size", "Size", "SIZE"], "size"],
      ];
      for (const [formKey, candidates, fallback] of optionalMappings) {
        if (formData.has(formKey)) {
          updateData[findExistingKey(candidates, fallback)] = getOptionalText(formData, formKey);
        }
      }

      if (formData.has("artistId")) updateData.artistId = artistId;
      if (year !== null) updateData[findExistingKey(["year", "Year", "YEAR"], "year")] = year;
      if (slNo !== null) updateData[findExistingKey(["slNo", "serialNo", "SL NO"], "slNo")] = slNo;
    }

    updateData.updatedAt = new Date();

    const result = await productCollection.updateOne(
      { _id: productId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return { success: false, message: "Product was not updated." };
    }

    revalidateArtworkPaths(id);
    revalidatePath("/admin/design-store");
    revalidatePath("/admin/jewel-tree");
    revalidatePath("/design-store");

    return {
      success: true,
      message: "Product updated successfully.",
      collection: collectionName,
    };
  } catch (error) {
    console.error("Product update error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update product.",
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
