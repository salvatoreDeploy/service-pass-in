/*
  Warnings:

  - A unique constraint covering the columns `[event_id,email]` on the table `attenddes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "attenddes_event_id_email_key" ON "attenddes"("event_id", "email");
