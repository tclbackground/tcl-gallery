// lib/prisma.ts

import path from "path";
import { PrismaClient, Prisma } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

if (process.platform === "linux") {
  process.env.PRISMA_QUERY_ENGINE_LIBRARY = path.join(
    process.cwd(),
    "node_modules",
    ".prisma",
    "client",
    "libquery_engine-linux-musl-openssl-3.0.x.so.node"
  );
}

console.log("=== TCL PRISMA CONFIG ===");
console.log("platform:", process.platform);
console.log(
  "PRISMA_QUERY_ENGINE_LIBRARY:",
  process.env.PRISMA_QUERY_ENGINE_LIBRARY
);

const prismaOptions: Prisma.PrismaClientOptions = {
  log:
    process.env.NODE_ENV === "development"
      ? ["error", "warn"]
      : ["error"],
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient(prismaOptions);

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;