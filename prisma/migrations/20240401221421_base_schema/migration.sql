-- CreateEnum
CREATE TYPE "OrganizerType" AS ENUM ('BarOrClub', 'EventCollective', 'MusicFestival');

-- CreateEnum
CREATE TYPE "Genre" AS ENUM ('House', 'DeepHouse', 'ProgressiveHouse', 'TechHouse', 'AcidHouse', 'TropicalHouse', 'FutureHouse', 'AfroHouse', 'Techno', 'Psytrance', 'MelodicTechno', 'HardTechno', 'AcidTechno', 'Trance', 'Dubstep', 'MelodicDubstep', 'Brostep', 'Chillstep', 'DrumAndBass', 'Hardstyle', 'Ambient', 'Disco', 'Funk', 'Trap', 'Electro', 'Garage', 'Breakbeat', 'Chillout', 'BigRoom', 'BassHouse', 'Hyperpop', 'Jungle', 'Downtempo');

-- CreateTable
CREATE TABLE "Organizer" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "type" "OrganizerType" NOT NULL,
    "websites" TEXT[],
    "topGenres" "Genre"[],
    "overallExpensiveness" INTEGER,
    "reviewCount" INTEGER NOT NULL,
    "overallRating" DOUBLE PRECISION,
    "soundSystemRating" DOUBLE PRECISION,
    "djAndMusicRating" DOUBLE PRECISION,
    "crowdPlurRating" DOUBLE PRECISION,
    "safetyAndComfortRating" DOUBLE PRECISION,
    "venueRating" DOUBLE PRECISION,
    "valueForMoneyRating" DOUBLE PRECISION,
    "visualsRating" DOUBLE PRECISION,
    "staffRating" DOUBLE PRECISION,
    "foodAndDrinkRating" DOUBLE PRECISION,

    CONSTRAINT "Organizer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizerId" INTEGER NOT NULL,
    "description" TEXT,
    "genres" "Genre"[],
    "expensiveness" INTEGER,
    "soundSystemRating" INTEGER NOT NULL,
    "djAndMusicRating" INTEGER NOT NULL,
    "crowdPlurRating" INTEGER NOT NULL,
    "safetyAndComfortRating" INTEGER NOT NULL,
    "venueRating" INTEGER NOT NULL,
    "valueForMoneyRating" INTEGER NOT NULL,
    "visualsRating" INTEGER,
    "staffRating" INTEGER,
    "foodAndDrinkRating" INTEGER,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "Organizer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
