"use server";

import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function uploadProduct(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const priceStr = formData.get("price") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const image = formData.get("image") as File;

    if (!title || !priceStr || !category || !image) {
      return { success: false, message: "Please fill in all required fields." };
    }

    const price = parseFloat(priceStr);

    // 1. Ensure public/uploads directory exists on company server
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // 2. Format unique filename to prevent overwriting
    const sanitizedFileName = image.name.replace(/\s+/g, "_");
    const fileName = `${Date.now()}-${sanitizedFileName}`;
    const filePath = path.join(uploadDir, fileName);

    // 3. Write image file bytes to disk
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    const imageUrl = `/uploads/${fileName}`;

    // 4. Save product record to MongoDB via Prisma
    const newProduct = await prisma.product.create({
      data: {
        title,
        price,
        category,
        description,
        imageUrl,
      },
    });

    return {
      success: true,
      message: "Product and image uploaded successfully!",
      product: newProduct,
    };
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, message: "Failed to upload product to server." };
  }
}