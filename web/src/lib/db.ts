// web/src/lib/db.ts
/*
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.APP_ENV === "local" ? ["query", "error", "warn"] : ["error"],
  });
console.log("DB:", process.env.DATABASE_URL?.replace(/:\/\/.*@/, "://***@"));
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

*/

// src/lib/db.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // log: ["query", "error", "warn"], // optional
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// export type Prisma = PrismaClient; // optional
