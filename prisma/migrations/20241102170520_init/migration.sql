-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('AiGenerate');

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_permission" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "permission" "Permission" NOT NULL,

    CONSTRAINT "user_permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hieroglyph_key" (
    "id" SERIAL NOT NULL,
    "index" INTEGER NOT NULL,
    "glyph" TEXT NOT NULL,
    "alternative" TEXT,
    "pinyin" TEXT NOT NULL,
    "translate" TEXT NOT NULL,
    "transcription" TEXT NOT NULL,
    "toneId" INTEGER NOT NULL,

    CONSTRAINT "hieroglyph_key_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tone" (
    "id" SERIAL NOT NULL,
    "type" INTEGER NOT NULL,
    "index" INTEGER NOT NULL,

    CONSTRAINT "tone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content" (
    "sysname" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_pkey" PRIMARY KEY ("sysname")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_id_key" ON "user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_permission_id_key" ON "user_permission"("id");

-- CreateIndex
CREATE INDEX "user_permission_userId_idx" ON "user_permission"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "hieroglyph_key_index_key" ON "hieroglyph_key"("index");

-- CreateIndex
CREATE INDEX "hieroglyph_key_toneId_idx" ON "hieroglyph_key"("toneId");

-- CreateIndex
CREATE UNIQUE INDEX "content_sysname_key" ON "content"("sysname");
