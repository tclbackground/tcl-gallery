export async function updateProduct(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const priceStr = formData.get("price") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const artistId = formData.get("artistId") as string;
    
    // Form Inputs
    const imageUrlInput = formData.get("imageUrlInput") as string;
    const existingImageUrl = formData.get("existingImageUrl") as string;
    const imageFile = formData.get("image") as File | null;

    if (!id || !title || !priceStr || !category) {
      return {
        success: false,
        message: "Required fields are missing.",
      };
    }

    // Determine final image URL without triggering serverless filesystem timeouts
    let finalImageUrl = imageUrlInput || existingImageUrl || "/images/products/artwork-1.jpg";

    if (imageFile && imageFile.size > 0 && imageFile.name !== "undefined") {
      const savedPath = await saveFile(imageFile);
      if (savedPath) finalImageUrl = savedPath;
    }

    // Direct Prisma Update
    await prisma.product.update({
      where: { id },
      data: {
        title,
        price: parseFloat(priceStr),
        category,
        description: description || null,
        imageUrl: finalImageUrl,
        artistId: artistId ? artistId : null,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/shop");

    return {
      success: true,
      message: "Product updated successfully!",
    };
  } catch (error) {
    console.error("Product Update Error:", error);
    return {
      success: false,
      message: "Failed to update product.",
    };
  }
}