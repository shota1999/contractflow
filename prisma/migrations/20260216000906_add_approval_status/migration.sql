-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('DRAFT', 'REVIEW', 'APPROVED');

-- AlterEnum
ALTER TYPE "AuditAction" ADD VALUE 'DOCUMENT_APPROVAL_UPDATED';

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "approvalStatus" "ApprovalStatus" NOT NULL DEFAULT 'DRAFT';
