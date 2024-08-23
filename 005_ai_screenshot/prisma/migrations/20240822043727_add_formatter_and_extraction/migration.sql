-- CreateTable
CREATE TABLE "Formatter" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "fields" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Formatter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Extraction" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "formatterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Extraction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Formatter_name_key" ON "Formatter"("name");

-- AddForeignKey
ALTER TABLE "Extraction" ADD CONSTRAINT "Extraction_formatterId_fkey" FOREIGN KEY ("formatterId") REFERENCES "Formatter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
