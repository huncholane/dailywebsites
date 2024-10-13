-- CreateTable
CREATE TABLE "Church" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "foundedDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Church_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deacon" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Deacon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Annointment" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "churchId" TEXT NOT NULL,
    "deaconId" TEXT NOT NULL,

    CONSTRAINT "Annointment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Annointment" ADD CONSTRAINT "Annointment_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "Church"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Annointment" ADD CONSTRAINT "Annointment_deaconId_fkey" FOREIGN KEY ("deaconId") REFERENCES "Deacon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
