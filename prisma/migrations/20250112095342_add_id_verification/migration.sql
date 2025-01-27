-- AlterTable
ALTER TABLE "User" ADD COLUMN     "idVerificationDate" TIMESTAMP(3),
ADD COLUMN     "idVerificationRef" TEXT,
ADD COLUMN     "idVerificationStatus" TEXT DEFAULT 'pending';

-- CreateTable
CREATE TABLE "OAuthState" (
    "id" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "codeVerifier" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OAuthState_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OAuthState_userId_idx" ON "OAuthState"("userId");
