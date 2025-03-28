-- CreateEnum
CREATE TYPE "Type" AS ENUM ('VIP', 'STANDARD', 'EARLY_BIRD');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('AVAILABLE', 'SOLD', 'RESERVED');

-- CreateTable
CREATE TABLE "Admin" (
    "admin_id" TEXT NOT NULL,
    "admin_name" TEXT NOT NULL,
    "admin_mail" TEXT NOT NULL,
    "admin_password" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("admin_id")
);

-- CreateTable
CREATE TABLE "User" (
    "user_id" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "user_email" TEXT NOT NULL,
    "user_password" TEXT NOT NULL,
    "user_image" TEXT DEFAULT 'https://cdn-icons-png.flaticon.com/512/3177/3177440.png',
    "user_first_login_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Event" (
    "event_id" TEXT NOT NULL,
    "event_name" TEXT NOT NULL,
    "event_date" TIMESTAMP(3) NOT NULL,
    "event_place" TEXT NOT NULL,
    "event_description" TEXT NOT NULL,
    "event_image" TEXT NOT NULL,
    "admin_id" TEXT NOT NULL,
    "event_organizer" TEXT NOT NULL,
    "event_category" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("event_id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "ticket_id" TEXT NOT NULL,
    "ticket_type" "Type" NOT NULL,
    "ticket_price" INTEGER NOT NULL,
    "ticket_status" "Status" NOT NULL,
    "user_id" TEXT,
    "event_id" TEXT NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("ticket_id")
);

-- CreateTable
CREATE TABLE "Message" (
    "message_id" TEXT NOT NULL,
    "message_subject" TEXT,
    "message_content" TEXT,
    "message_date" TIMESTAMP(6),
    "user_id" TEXT,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("message_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_admin_mail_key" ON "Admin"("admin_mail");

-- CreateIndex
CREATE UNIQUE INDEX "User_user_email_key" ON "User"("user_email");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "Admin"("admin_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("event_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "fk_user_message" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
