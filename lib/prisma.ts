import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

declare global {
    var prisma: PrismaClient | undefined;
}

let databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error(
        "La variable d'environnement DATABASE_URL est manquante. " +
        "Un driver adapter Prisma 7 nécessite une chaîne de connexion explicite."
    );
}

if (!databaseUrl.includes('sslmode=')) {
    const separator = databaseUrl.includes('?') ? '&' : '?';
    databaseUrl += `${separator}sslmode=verify-full`;
}

let prismaClient: PrismaClient;

if (process.env.NODE_ENV === 'production') {
    const pool = new Pool({
        connectionString: databaseUrl,
        connectionTimeoutMillis: 5000,
    });
    const adapter = new PrismaPg(pool);
    prismaClient = new PrismaClient({ adapter });
} else {
    if (!globalThis.prisma) {
        const pool = new Pool({
            connectionString: databaseUrl,
            connectionTimeoutMillis: 5000,
        });
        const adapter = new PrismaPg(pool);
        globalThis.prisma = new PrismaClient({ adapter });
    }
    prismaClient = globalThis.prisma;
}

export const prisma = prismaClient;