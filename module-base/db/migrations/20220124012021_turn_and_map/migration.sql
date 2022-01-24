/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `Game` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `map` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `turn` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "map" TEXT NOT NULL,
ADD COLUMN     "turn" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Game_uuid_key" ON "Game"("uuid");
