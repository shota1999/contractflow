import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-helpers";
import { successResponse } from "@/lib/api-response";
import { requireRole } from "@/lib/auth";
import { getDocumentQueue } from "@/lib/queue";
import { draftJobIdSchema } from "@/features/jobs/drafts/schemas";
import * as service from "@/features/jobs/drafts/service";
import { createEvent, type AuditAction, type AuditTargetType } from "@/features/audit";

type RouteParams = {
  params: Promise<{ jobId: string }>;
};

const manageRoles = ["OWNER", "ADMIN"];

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { jobId } = await params;
    const parsedId = draftJobIdSchema.parse(jobId);
    const user = await requireRole(manageRoles);
    const result = await service.retryJob(user.orgId, parsedId, user.id);

    const queueJob = await getDocumentQueue().add(
      "generateDraft",
      {
        documentId: result.payload.documentId,
        organizationId: result.payload.organizationId,
        draftJobId: result.payload.draftJobId,
        actorUserId: user.id,
      },
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 1000,
        },
      },
    );

    await createEvent({
      organizationId: user.orgId,
      actorUserId: user.id,
      action: "DRAFT_ENQUEUED" satisfies AuditAction,
      targetType: "DRAFT" satisfies AuditTargetType,
      targetId: result.job.id,
      metadata: {
        jobId: result.job.id,
        queueJobId: queueJob.id,
        attempts: result.job.attempts,
      },
    });

    return NextResponse.json(
      successResponse({
        job: result.job,
        queueJobId: queueJob.id,
      }),
      { status: 202 },
    );
  } catch (error) {
    return handleApiError(error, request);
  }
}
