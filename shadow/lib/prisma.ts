import { PrismaClient } from "@prisma/client";

declare global {
  const prisma: PrismaClient | undefined;
}

const prismaClientSingleton = () => {
  return new PrismaClient();
};
// @ts-expect-error
const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  // @ts-expect-error
  globalThis.prisma = prisma;
}

export { prisma };
