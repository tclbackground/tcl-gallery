import path from "path";
import { PrismaClient, Prisma } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

type PrismaOptionsWithInternal = Prisma.PrismaClientOptions & {
  __internal?: {
    engine?: {
      binaryPath?: string;
    };
  };
};

const prismaOptions: PrismaOptionsWithInternal = {
  log:
    process.env.NODE_ENV === "development"
      ? ["error", "warn"]
      : ["error"],
};

if (process.platform === "linux") {
  prismaOptions.__internal = {
    engine: {
      binaryPath: path.join(
        process.cwd(),
        "node_modules",
        ".prisma",
        "client",
        "libquery_engine-linux-musl-openssl-3.0.x.so.node"
      ),
    },
  };
}

export const prisma =
 globalForPrisma.prisma ??
  new PrismaClient(prismaOptions as Prisma.PrismaClientOptions);

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;