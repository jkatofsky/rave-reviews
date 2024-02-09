-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Genre" ADD VALUE 'DeepHouse';
ALTER TYPE "Genre" ADD VALUE 'ProgressiveHouse';
ALTER TYPE "Genre" ADD VALUE 'TechHouse';
ALTER TYPE "Genre" ADD VALUE 'AcidHouse';
ALTER TYPE "Genre" ADD VALUE 'TropicalHouse';
ALTER TYPE "Genre" ADD VALUE 'FutureHouse';
ALTER TYPE "Genre" ADD VALUE 'AfroHouse';
ALTER TYPE "Genre" ADD VALUE 'Psytrance';
ALTER TYPE "Genre" ADD VALUE 'MelodicTechno';
ALTER TYPE "Genre" ADD VALUE 'HardTechno';
ALTER TYPE "Genre" ADD VALUE 'AcidTechno';
ALTER TYPE "Genre" ADD VALUE 'Ambient';
ALTER TYPE "Genre" ADD VALUE 'Disco';
ALTER TYPE "Genre" ADD VALUE 'Funk';
ALTER TYPE "Genre" ADD VALUE 'Garage';
ALTER TYPE "Genre" ADD VALUE 'Chillout';
