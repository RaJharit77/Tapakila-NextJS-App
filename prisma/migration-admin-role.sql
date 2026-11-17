-- À exécuter UNE fois dans la console Neon (équivalent de `prisma migrate dev`)
CREATE TYPE "AdminRole" AS ENUM ('SUPER_ADMIN', 'ADMIN');
ALTER TABLE "Admin" ADD COLUMN "admin_role" "AdminRole" NOT NULL DEFAULT 'ADMIN';

-- Optionnel : promouvoir un admin existant en super admin
-- UPDATE "Admin" SET admin_role = 'SUPER_ADMIN' WHERE admin_mail = 'votre@mail.com';
