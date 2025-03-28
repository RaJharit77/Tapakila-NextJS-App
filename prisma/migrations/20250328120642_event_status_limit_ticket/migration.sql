-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('CANCLED', 'UPLOADED', 'DRAFT');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "event_creation_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "event_status" "EventStatus" NOT NULL DEFAULT 'UPLOADED',
ADD COLUMN     "event_tickets_limit_by_user_by_type" INTEGER NOT NULL DEFAULT 5,
ALTER COLUMN "event_description" DROP NOT NULL,
ALTER COLUMN "event_image" DROP NOT NULL,
ALTER COLUMN "event_category" DROP NOT NULL;
