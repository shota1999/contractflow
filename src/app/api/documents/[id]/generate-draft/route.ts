import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-helpers";
import { requireRole } from "@/lib/auth";
import { documentIdSchema } from "@/features/documents/schemas";
import { getDocumentQueue } from "@/lib/queue";
import { documentRoleMatrix } from "@/features/documents/roles";
import { errorResponse, successResponse } from "@/lib/api-response";
import { env } from "@/lib/env";
import { rateLimit, rateLimitHeaders } from "@/lib/rate-limit";
import { getRequestIp } from "@/lib/request";
import * as service from "@/features/documents/service";
import { DocumentGenerationStatus } from "@prisma/client";
import { createEvent, type AuditAction, type AuditTargetType } from "@/features/audit";
import * as draftJobs from "@/features/jobs/drafts/service";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const documentId = documentIdSchema.parse(id);
    const user = await requireRole([...documentRoleMatrix.generateDraft]);

    const ip = getRequestIp(request);
    const limitResult = await rateLimit({
      key: `generate-draft:${ip}`,
      limit: env.RATE_LIMIT_GENERATE_DRAFT_MAX,
      windowMs: env.RATE_LIMIT_GENERATE_DRAFT_WINDOW_MS,
    });

    if (!limitResult.ok) {
      return NextResponse.json(
        errorResponse({
          code: "RATE_LIMITED",
          message: "Too many draft requests. Please try again later.",
        }),
        {
          status: 429,
          headers: {
            ...rateLimitHeaders(limitResult),
            "retry-after": Math.ceil(limitResult.resetMs / 1000).toString(),
          },
        },
      );
    }

    await service.getDocument(documentId, user.orgId);

    const draftJob = await draftJobs.createJob(user.orgId, documentId);
    const job = await getDocumentQueue().add(
      "generateDraft",
      {
        documentId,
        organizationId: user.orgId,
        draftJobId: draftJob.id,
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

    await service.updateGenerationStatus(documentId, user.orgId, DocumentGenerationStatus.QUEUED);
    await createEvent({
      organizationId: user.orgId,
      actorUserId: user.id,
      action: "DRAFT_ENQUEUED" satisfies AuditAction,
      targetType: "DRAFT" satisfies AuditTargetType,
      targetId: draftJob.id,
      metadata: {
        jobId: draftJob.id,
        queueJobId: job.id,
      },
    });

    return NextResponse.json(
      successResponse({
        jobId: job.id,
        draftJobId: draftJob.id,
        documentId,
        status: "queued",
      }),
      { status: 202 },
    );
  } catch (error) {
    return handleApiError(error, request);
  }
}
