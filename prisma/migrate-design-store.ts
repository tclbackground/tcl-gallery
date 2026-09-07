import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("========================================");
  console.log("DESIGN STORE MIGRATION STARTED");
  console.log("========================================");

  // =====================================================
  // 1. GET EXISTING JEWEL TREE PRODUCTS
  // =====================================================

  const jewelTreeProducts =
    await prisma.jewelTree.findMany({
      orderBy: {
        slNo: "asc",
      },
    });

  console.log(
    `Found ${jewelTreeProducts.length} Jewel Tree products`
  );

  // =====================================================
  // 2. MIGRATE EACH PRODUCT
  // =====================================================

  let created = 0;
  let skipped = 0;

  for (const product of jewelTreeProducts) {
    // -----------------------------------------------
    // Skip products without title
    // -----------------------------------------------

    if (!product.title?.trim()) {
      console.log(
        "SKIPPED: Product has no title",
        product.id
      );

      skipped++;
      continue;
    }

    // -----------------------------------------------
    // Skip products without image
    // -----------------------------------------------

    if (!product.image?.trim()) {
      console.log(
        `SKIPPED: ${product.title} has no image`
      );

      skipped++;
      continue;
    }

    // -----------------------------------------------
    // Prevent duplicate migration
    // -----------------------------------------------

    const existing =
      await prisma.designStoreProduct.findFirst({
        where: {
          collection: "jewel-tree",
          referenceNo:
            product.referenceNo || undefined,
        },
      });

    if (existing) {
      console.log(
        `ALREADY EXISTS: ${product.title}`
      );

      continue;
    }

    // -----------------------------------------------
    // Create Design Store product
    // -----------------------------------------------

    const newProduct =
      await prisma.designStoreProduct.create({
        data: {
          slNo: product.slNo,

          title: product.title.trim(),

          collection: "jewel-tree",

          description: null,

          // We are not showing prices
          price: null,

          // Existing image path
          image1: product.image.trim(),

          image2: null,
          image3: null,
          image4: null,

          referenceNo:
            product.referenceNo?.trim() || null,

          material: null,

          size:
            product.size?.trim() || null,
        },
      });

    console.log(
      `MIGRATED: ${newProduct.title}`
    );

    console.log(
      `IMAGE: ${newProduct.image1}`
    );

    created++;
  }

  // =====================================================
  // 3. SUMMARY
  // =====================================================

  console.log("");
  console.log("========================================");
  console.log("MIGRATION COMPLETED");
  console.log("========================================");

  console.log(
    `Jewel Tree source products: ${jewelTreeProducts.length}`
  );

  console.log(
    `Created: ${created}`
  );

  console.log(
    `Skipped: ${skipped}`
  );

  // =====================================================
  // 4. SHOW FINAL DESIGN STORE RECORDS
  // =====================================================

  const finalProducts =
    await prisma.designStoreProduct.findMany({
      where: {
        collection: "jewel-tree",
      },

      orderBy: {
        slNo: "asc",
      },
    });

  console.log("");
  console.log(
    `Design Store Jewel Tree products: ${finalProducts.length}`
  );

  for (const product of finalProducts) {
    console.log({
      id: product.id,
      slNo: product.slNo,
      title: product.title,
      referenceNo: product.referenceNo,
      image1: product.image1,
      size: product.size,
      collection: product.collection,
    });
  }
}

main()
  .catch((error) => {
    console.error(
      "MIGRATION ERROR:",
      error
    );

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });