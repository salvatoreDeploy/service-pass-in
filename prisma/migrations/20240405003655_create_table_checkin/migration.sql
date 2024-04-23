-- CreateTable
CREATE TABLE "check_in" (
    "id" serial NOT NULL PRIMARY KEY,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attendde_id" INTEGER NOT NULL,
    CONSTRAINT "check_in_attendde_id_fkey" FOREIGN KEY ("attendde_id") REFERENCES "attenddes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "check_in_attendde_id_key" ON "check_in"("attendde_id");