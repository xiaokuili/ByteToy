import { PrismaClient } from '@prisma/client'

declare global {
  let prisma: PrismaClient | undefined
}

const prismaClientSingleton = () => {
  return new PrismaClient()
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}

export { prisma }