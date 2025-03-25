/*
  Warnings:

  - You are about to drop the column `ticket_available_number` on the `Ticket` table. All the data in the column will be lost.
  - Added the required column `user_first_login_date` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'RESERVED';

-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_user_id_fkey";

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "ticket_available_number",
ALTER COLUMN "user_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "user_first_login_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_image" TEXT DEFAULT 'https://cdn-icons-png.flaticon.com/512/3177/3177440.png';

-- CreateTable
CREATE TABLE "Message" (
    "message_id" TEXT NOT NULL,
    "message_subject" TEXT,
    "message_content" TEXT,
    "message_date" TIMESTAMP(6),
    "user_id" TEXT,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("message_id")
);

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "fk_user_message" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
