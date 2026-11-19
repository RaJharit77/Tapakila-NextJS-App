import { PrismaClient } from '@/generated/prisma/client'; // Ajustez le chemin si besoin
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@tapakila.com';
    const password = 'admin123';

    // 1. Hacher le mot de passe avec bcrypt (12 rounds comme dans votre API)
    const hashedPassword = await bcrypt.hash(password, 12);

    // 2. Créer ou mettre à jour l'admin
    const admin = await prisma.admin.upsert({
        where: { admin_mail: email },
        update: {
            admin_password: hashedPassword, // On met à jour le mdp s'il existe déjà
        },
        create: {
            admin_id: 'ADM-TEST',
            admin_name: 'Super Admin',
            admin_mail: email,
            admin_password: hashedPassword,
            admin_role: 'SUPER_ADMIN', // Vérifiez que cette valeur correspond à votre enum Prisma
        },
    });

    console.log('✅ Admin prêt avec succès !');
    console.log(`📧 Email : ${email}`);
    console.log(`🔑 Mot de passe : ${password}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });