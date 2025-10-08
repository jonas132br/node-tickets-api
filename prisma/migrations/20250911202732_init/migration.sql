/*
  Warnings:

  - Added the required column `colaboradorId` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Ticket" ADD COLUMN     "colaboradorId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "public"."Colaborador" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Colaborador_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Ticket" ADD CONSTRAINT "Ticket_colaboradorId_fkey" FOREIGN KEY ("colaboradorId") REFERENCES "public"."Colaborador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
