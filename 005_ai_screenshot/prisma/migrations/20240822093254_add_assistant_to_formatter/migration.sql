/*
  Warnings:

  - Added the required column `openAiAssistantId` to the `Formatter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Formatter" ADD COLUMN     "openAiAssistantId" TEXT NOT NULL;
