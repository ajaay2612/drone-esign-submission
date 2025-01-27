/*
  Warnings:

  - You are about to drop the column `idVerificationDate` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `idVerificationRef` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "idVerificationDate",
DROP COLUMN "idVerificationRef";
