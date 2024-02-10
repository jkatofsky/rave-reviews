-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Genre" ADD VALUE 'MelodicDubstep';
ALTER TYPE "Genre" ADD VALUE 'Brostep';
ALTER TYPE "Genre" ADD VALUE 'Chillstep';
ALTER TYPE "Genre" ADD VALUE 'Breakbeat';

-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "description" DROP NOT NULL;
