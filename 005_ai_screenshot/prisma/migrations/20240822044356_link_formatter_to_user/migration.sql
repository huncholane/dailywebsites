/*
  Warnings:

  - Added the required column `userId` to the `Formatter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Formatter" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Formatter" ADD CONSTRAINT "Formatter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
