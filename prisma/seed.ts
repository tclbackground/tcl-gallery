import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const user = await prisma.user.upsert({
    where: { email: "phchinmayi93@gmail.com" },
    update: {
      password: hashedPassword,
      role: "ADMIN",
    },
    create: {
      email: "phchinmayi93@gmail.com",
      name: "PRASANNA HIREMAT CHINMAYI",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("User successfully updated/created:", user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });