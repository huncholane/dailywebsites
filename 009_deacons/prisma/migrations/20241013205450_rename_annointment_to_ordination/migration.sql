/*
  Warnings:

  - You are about to drop the column `city` on the `Church` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Church` table. All the data in the column will be lost.
  - You are about to drop the `Annointment` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Church` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Annointment" DROP CONSTRAINT "Annointment_churchId_fkey";

-- DropForeignKey
ALTER TABLE "Annointment" DROP CONSTRAINT "Annointment_deaconId_fkey";

-- AlterTable
ALTER TABLE "Church" DROP COLUMN "city",
DROP COLUMN "country",
ADD COLUMN     "locationId" TEXT;

-- DropTable
DROP TABLE "Annointment";

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "foundedDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ordination" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "churchId" TEXT NOT NULL,
    "deaconId" TEXT NOT NULL,

    CONSTRAINT "Ordination_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Church_name_key" ON "Church"("name");

-- AddForeignKey
ALTER TABLE "Church" ADD CONSTRAINT "Church_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ordination" ADD CONSTRAINT "Ordination_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "Church"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ordination" ADD CONSTRAINT "Ordination_deaconId_fkey" FOREIGN KEY ("deaconId") REFERENCES "Deacon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
