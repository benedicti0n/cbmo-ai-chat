import { PrismaClient } from '@/generated/prisma'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prismaClient = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

// Log successful connection
prismaClient
  .$connect()
  .then(() => console.log('✅ Successfully connected to the database'))
  .catch((err) => console.error('❌ Failed to connect to the database:', err))

export const prisma = globalForPrisma.prisma ?? prismaClient

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export type { User, Conversation } from '@/generated/prisma'
