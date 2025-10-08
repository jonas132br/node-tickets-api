/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Ticket` table. All the data in the column will be lost.
  - Added the required column `colaboradorId` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descricao` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titulo` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Ticket" DROP COLUMN "createdAt",
DROP COLUMN "description",
DROP COLUMN "priority",
DROP COLUMN "title",
ADD COLUMN     "colaboradorId" INTEGER NOT NULL,
ADD COLUMN     "descricao" TEXT NOT NULL,
ADD COLUMN     "titulo" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."Colaborador" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Colaborador_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Ticket" ADD CONSTRAINT "Ticket_colaboradorId_fkey" FOREIGN KEY ("colaboradorId") REFERENCES "public"."Colaborador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
