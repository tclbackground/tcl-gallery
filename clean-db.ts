// clean-db.ts
import { prisma } from "./lib/prisma";

async function main() {
  console.log("Starting database cleanup...");

  // 1. Delete all empty / null ghost rows
  const deletedNulls = await (prisma as any).product.deleteMany({
    where: {
      OR: [
        { title: null },
        { title: "" },
        { price: null },
        { imageUrl: null },
        { imageUrl: "" },
      ],
    },
  });
  console.log(`Deleted ${deletedNulls.count} ghost/empty records.`);

  // 2. Fetch remaining valid products
  const products = await (prisma as any).product.findMany();
  console.log(`Checking ${products.length} remaining products for broken filenames...`);

  for (const prod of products) {
    let needsUpdate = false;
    let newImageUrl = prod.imageUrl;

    // Check if imageUrl contains invalid characters like commas or parentheses
    if (newImageUrl && (newImageUrl.includes(",") || newImageUrl.includes("(") || newImageUrl.includes(" "))) {
      // Set to fallback placeholder until you re-upload a clean image via admin
      newImageUrl = "/images/products/artwork-1.jpg";
      needsUpdate = true;
    }

    if (needsUpdate) {
      await (prisma as any).product.update({
        where: { id: prod.id },
        data: {
          imageUrl: newImageUrl,
          images: Array.isArray(prod.images) ? prod.images : [],
        },
      });
      console.log(`Cleaned image reference for product: "${prod.title || prod.id}"`);
    }
  }

  console.log("Database cleanup complete!");
}

main()
  .catch((e) => console.error("Error during cleanup:", e))
  .finally(async () => {
    await prisma.$disconnect();
  });