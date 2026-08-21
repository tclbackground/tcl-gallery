import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const user = await prisma.user.upsert({
    where: {
      email: "phchinmayi93@gmail.com",
    },

    update: {
      password: hashedPassword,
      role: Role.ADMIN,
      name: "PRASANNA HIRCHINMAYI",
    },

    create: {
      email: "phchinmayi93@gmail.com",
      name: "PRASANNA HIRCHINMAYI",
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  console.log("Admin user successfully created/updated:");
  console.log(user);
}

main()
  .catch((error) => {
    console.error("Seed error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });