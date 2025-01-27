/*
  Warnings:

  - You are about to drop the column `batteryLife` on the `Drone` table. All the data in the column will be lost.
  - You are about to drop the column `docusignEnvelopeId` on the `Drone` table. All the data in the column will be lost.
  - You are about to drop the column `flightRange` on the `Drone` table. All the data in the column will be lost.
  - You are about to drop the column `maxAltitude` on the `Drone` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Drone` table. All the data in the column will be lost.
  - You are about to drop the column `purchaseDate` on the `Drone` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Drone` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `Drone` table. All the data in the column will be lost.
  - You are about to drop the column `docusignAccessToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `docusignRefreshToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `docusignTokenExpiry` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `idVerificationStatus` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[registrationId]` on the table `Drone` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nickname` to the `Drone` table without a default value. This is not possible if the table is not empty.
  - Added the required column `registrationId` to the `Drone` table without a default value. This is not possible if the table is not empty.
  - Added the required column `registrationType` to the `Drone` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `images` on the `Drone` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Drone" DROP COLUMN "batteryLife",
DROP COLUMN "docusignEnvelopeId",
DROP COLUMN "flightRange",
DROP COLUMN "maxAltitude",
DROP COLUMN "name",
DROP COLUMN "purchaseDate",
DROP COLUMN "status",
DROP COLUMN "weight",
ADD COLUMN     "droneId" TEXT,
ADD COLUMN     "futureOwnerId" TEXT,
ADD COLUMN     "nickname" TEXT NOT NULL,
ADD COLUMN     "registrationId" TEXT NOT NULL,
ADD COLUMN     "registrationType" TEXT NOT NULL,
DROP COLUMN "images",
ADD COLUMN     "images" JSONB NOT NULL,
ALTER COLUMN "signatureStatus" SET DEFAULT 'pending';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "docusignAccessToken",
DROP COLUMN "docusignRefreshToken",
DROP COLUMN "docusignTokenExpiry",
DROP COLUMN "idVerificationStatus",
ADD COLUMN     "city" TEXT,
ADD COLUMN     "countryCode" TEXT,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "isSuperUser" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "notifications" JSONB,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "stateCode" TEXT,
ADD COLUMN     "streetAddress" TEXT,
ADD COLUMN     "zipCode" TEXT;

-- CreateTable
CREATE TABLE "PreviousOwnership" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "droneId" TEXT NOT NULL,
    "ownedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PreviousOwnership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agreement" (
    "id" TEXT NOT NULL,
    "droneId" TEXT NOT NULL,
    "clickWrapData" JSONB,
    "docusignEnvelopeId" TEXT NOT NULL,
    "agreementType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Agreement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Drone_registrationId_key" ON "Drone"("registrationId");

-- AddForeignKey
ALTER TABLE "PreviousOwnership" ADD CONSTRAINT "PreviousOwnership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PreviousOwnership" ADD CONSTRAINT "PreviousOwnership_droneId_fkey" FOREIGN KEY ("droneId") REFERENCES "Drone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Drone" ADD CONSTRAINT "Drone_futureOwnerId_fkey" FOREIGN KEY ("futureOwnerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agreement" ADD CONSTRAINT "Agreement_droneId_fkey" FOREIGN KEY ("droneId") REFERENCES "Drone"("id") ON DELETE CASCADE ON UPDATE CASCADE;
