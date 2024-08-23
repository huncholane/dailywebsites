/*
  Warnings:

  - Made the column `openAiAssistantId` on table `Formatter` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Formatter" ALTER COLUMN "openAiAssistantId" SET NOT NULL;
