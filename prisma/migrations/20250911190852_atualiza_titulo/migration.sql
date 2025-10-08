/*
  Warnings:

  - You are about to drop the column `colaboradorId` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the `Colaborador` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `prioridade` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Ticket" DROP CONSTRAINT "Ticket_colaboradorId_fkey";

-- AlterTable
ALTER TABLE "public"."Ticket" DROP COLUMN "colaboradorId",
ADD COLUMN     "prioridade" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."Colaborador";
