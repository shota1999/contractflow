CREATE TYPE "AuditAction" AS ENUM (
    'INVITE_CREATED',
    'INVITE_ACCEPTED',
    'MEMBER_ROLE_UPDATED',
    'MEMBER_REMOVED',
    'DOCUMENT_CREATED',
    'DOCUMENT_UPDATED',
    'DOCUMENT_SECTIONS_UPDATED',
    'DOCUMENT_SHARING_UPDATED',
    'DRAFT_ENQUEUED',
    'DRAFT_SUCCEEDED',
    'DRAFT_FAILED'
);

CREATE TYPE "AuditTargetType" AS ENUM (
    'ORGANIZATION',
    'INVITE',
    'MEMBER',
    'DOCUMENT',
    'DOCUMENT_SECTION',
    'DRAFT'
);

CREATE TABLE "AuditEvent" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "actorUserId" TEXT,
    "action" "AuditAction" NOT NULL,
    "targetType" "AuditTargetType" NOT NULL,
    "targetId" TEXT,
    "metadata" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AuditEvent_organizationId_createdAt_idx" ON "AuditEvent"("organizationId", "createdAt" DESC);
CREATE INDEX "AuditEvent_organizationId_action_idx" ON "AuditEvent"("organizationId", "action");
CREATE INDEX "AuditEvent_organizationId_targetType_idx" ON "AuditEvent"("organizationId", "targetType");

ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
