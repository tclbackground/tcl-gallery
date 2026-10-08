import path from "path";
import type { PrismaClient as PrismaClientType } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientType | undefined;
};

const enginePath =
  process.platform === "linux"
    ? path.join(
        process.cwd(),
        "node_modules",
        ".prisma",
        "client",
        "libquery_engine-linux-musl-openssl-3.0.x.so.node"
      )
    : undefined;

// Load Prisma only after the environment/path has been determined.
const { PrismaClient } = require("@prisma/client") as {
  PrismaClient: new (options?: any) => PrismaClientType;
};

const prismaOptions: any = {
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
};

if (enginePath) {
  prismaOptions.__internal = {
    engine: {
      binaryPath: enginePath,
    },
  };
}

console.log("=== TCL PRISMA CONFIG ===");
console.log("Platform:", process.platform);
console.log("Engine path:", enginePath);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient(prismaOptions);

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;