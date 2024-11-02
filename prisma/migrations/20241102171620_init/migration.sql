/*
  Warnings:

  - The primary key for the `content` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `toneId` on the `hieroglyph_key` table. All the data in the column will be lost.
  - You are about to drop the `tone` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `toneIndex` to the `hieroglyph_key` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toneType` to the `hieroglyph_key` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "hieroglyph_key_toneId_idx";

-- AlterTable
ALTER TABLE "content" DROP CONSTRAINT "content_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "content_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "hieroglyph_key" DROP COLUMN "toneId",
ADD COLUMN     "toneIndex" INTEGER NOT NULL,
ADD COLUMN     "toneType" INTEGER NOT NULL;

-- DropTable
DROP TABLE "tone";
