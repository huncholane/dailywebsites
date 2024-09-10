-- CreateTable
CREATE TABLE "Device" (
    "id" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Device_id_key" ON "Device"("id");
