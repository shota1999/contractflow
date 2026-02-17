CREATE TYPE "DraftJobStatus" AS ENUM (
    'QUEUED',
    'PROCESSING',
    'SUCCEEDED',
    'FAILED'
);

CREATE TABLE "DraftJob" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "status" "DraftJobStatus" NOT NULL DEFAULT 'QUEUED',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DraftJob_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "DraftJob_organizationId_createdAt_idx" ON "DraftJob"("organizationId", "createdAt" DESC);
CREATE INDEX "DraftJob_documentId_createdAt_idx" ON "DraftJob"("documentId", "createdAt" DESC);
CREATE INDEX "DraftJob_organizationId_status_idx" ON "DraftJob"("organizationId", "status");

ALTER TABLE "DraftJob" ADD CONSTRAINT "DraftJob_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "DraftJob" ADD CONSTRAINT "DraftJob_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
