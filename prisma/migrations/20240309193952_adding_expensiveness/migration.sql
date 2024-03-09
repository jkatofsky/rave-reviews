/*
  Warnings:

  - You are about to drop the column `moneySpent` on the `Review` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Organizer" ADD COLUMN     "overallExpensiveness" INTEGER;

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "moneySpent",
ADD COLUMN     "expensiveness" INTEGER;
