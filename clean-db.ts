// clean-db.ts
import { prisma } from "./lib/prisma";

async function cleanNullProducts() {
  console.log("Cleaning empty/null products...");

  const result = await (prisma as any).product.deleteMany({
    where: {
      OR: [
        { title: null },
        { title: "" },
        { category: null },
        { price: null },
        { price: 0 },
        { imageUrl: null },
        { imageUrl: "" },
      ],
    },
  });

  console.log(`✅ Successfully deleted ${result.count} empty ghost records!`);
}

cleanNullProducts()
  .catch((e) => console.error("Cleanup error:", e))
  .finally(async () => {
    await prisma.$disconnect();
  });