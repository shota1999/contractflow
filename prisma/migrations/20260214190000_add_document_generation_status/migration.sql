-- CreateEnum
CREATE TYPE "DocumentGenerationStatus" AS ENUM ('IDLE', 'QUEUED', 'PROCESSING', 'FAILED', 'SUCCEEDED');

-- AlterTable
ALTER TABLE "Document" ADD COLUMN "generationStatus" "DocumentGenerationStatus" NOT NULL DEFAULT 'IDLE';
