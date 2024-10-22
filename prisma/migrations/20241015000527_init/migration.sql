-- CreateEnum
CREATE TYPE "MailType" AS ENUM ('orderConfirmation', 'paymentConfirmation');

-- CreateTable
CREATE TABLE "Mail" (
    "id" TEXT NOT NULL,
    "idUser" TEXT NOT NULL,
    "mailDestination" TEXT NOT NULL,
    "mailContent" TEXT NOT NULL,
    "mailType" "MailType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mail_pkey" PRIMARY KEY ("id")
);
