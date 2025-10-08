/*
  Warnings:

  - You are about to drop the `Usuario` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `Colaborador` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cargo` to the `Colaborador` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Colaborador` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senha` to the `Colaborador` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Colaborador" ADD COLUMN     "cargo" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "senha" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."Usuario";

-- CreateIndex
CREATE UNIQUE INDEX "Colaborador_email_key" ON "public"."Colaborador"("email");
