import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  const imageFolder = path.join(
    process.cwd(),
    "public",
    "images"
  );

  const files = fs.readdirSync(imageFolder);

  const products = await prisma.product.findMany();

  for (const product of products) {
    if (!product.imageUrl) continue;

    // Get filename without path and extension
    const currentName = product.imageUrl
      .split("/")
      .pop()
      ?.replace(/\.(jpg|jpeg|png|webp|JPG|JPEG|PNG|WEBP)$/i, "");

    if (!currentName) continue;

    // Find matching file
    const matchingFile = files.find((file) => {
      const fileNameWithoutExtension = path
        .parse(file)
        .name
        .toLowerCase();

      return (
        fileNameWithoutExtension === currentName.toLowerCase()
      );
    });

    if (matchingFile) {
      const newImageUrl = `/images/${matchingFile}`;

      await prisma.product.update({
        where: {
          id: product.id,
        },
        data: {
          imageUrl: newImageUrl,
        },
      });

      console.log(
        `UPDATED: ${product.title} → ${newImageUrl}`
      );
    } else {
      console.log(
        `NOT FOUND: ${product.title} → ${currentName}`
      );
    }
  }

  console.log("Image URLs fixed successfully!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });