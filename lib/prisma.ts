import { PrismaClient } from '@/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

declare global {
    var prisma: PrismaClient | undefined;
}

const databaseUrl = process.env.DATABASE_URL;

let prismaClient: PrismaClient;

if (process.env.NODE_ENV === 'production') {
    const pool = new Pool({ connectionString: databaseUrl });
    const adapter = new PrismaPg(pool);
    prismaClient = new PrismaClient({ adapter });
} else {
    if (!globalThis.prisma) {
        if (databaseUrl) {
            try {
                const pool = new Pool({ connectionString: databaseUrl });
                const adapter = new PrismaPg(pool);
                prismaClient = new PrismaClient({ adapter });
            } catch (error) {
                console.warn("Erreur avec l'adaptateur PostgreSQL, utilisation du client standard:", error);
                prismaClient = new PrismaClient();
            }
        } else {
            prismaClient = new PrismaClient();
        }
        globalThis.prisma = prismaClient;
    } else {
        prismaClient = globalThis.prisma;
    }
}

export const prisma = prismaClient;