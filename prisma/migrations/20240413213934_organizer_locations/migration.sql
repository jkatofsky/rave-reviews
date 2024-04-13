/*
  Warnings:

  - The primary key for the `Organizer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Review` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_organizerId_fkey";

-- AlterTable
ALTER TABLE "Organizer" DROP CONSTRAINT "Organizer_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Organizer_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Organizer_id_seq";

-- AlterTable
ALTER TABLE "Review" DROP CONSTRAINT "Review_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "organizerId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Review_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Review_id_seq";

-- CreateTable
CREATE TABLE "City" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "region" TEXT,
    "country" TEXT NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizerId" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "streetAddress" TEXT,
    "postalCode" TEXT,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "Organizer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "Organizer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
