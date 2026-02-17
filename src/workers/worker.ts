import { Worker } from "bullmq";
import { z } from "zod";
import { logger } from "@/lib/logger";
import { documentQueueName, emailQueueName, queueConnection } from "@/lib/queue";
import * as service from "@/features/documents/service";
import { createEvent, type AuditAction, type AuditTargetType } from "@/features/audit";
import * as draftJobs from "@/features/jobs/drafts/service";
import { DocumentGenerationStatus } from "@prisma/client";
import { sendVerificationEmail } from "@/lib/email/resend";

const generateDraftSchema = z.object({
  documentId: z.string().min(1),
  organizationId: z.string().min(1),
  draftJobId: z.string().min(1).optional(),
  actorUserId: z.string().min(1).optional(),
});

const verificationEmailSchema = z.object({
  email: z.string().email(),
  name: z.string().optional().nullable(),
  token: z.string().min(1),
});

const worker = new Worker(
  documentQueueName,
  async (job) => {
    if (job.name !== "generateDraft") {
      logger.warn("Unknown job received", { name: job.name, id: job.id });
      return { ok: false, reason: "unknown_job" };
    }

    const payload = generateDraftSchema.parse(job.data);

    logger.info("Generating draft", {
      documentId: payload.documentId,
      organizationId: payload.organizationId,
      jobId: job.id,
    });
    if (payload.draftJobId) {
      try {
        await draftJobs.markProcessing(payload.draftJobId);
      } catch (markError) {
        logger.warn("Failed to mark draft job processing", {
          draftJobId: payload.draftJobId,
          error: markError,
        });
      }
    }

    const result = await service.generateDraft(payload.documentId, payload.organizationId);
    try {
      await createEvent({
        organizationId: payload.organizationId,
        actorUserId: payload.actorUserId ?? null,
        action: "DRAFT_SUCCEEDED" satisfies AuditAction,
        targetType: "DOCUMENT" satisfies AuditTargetType,
        targetId: payload.documentId,
        metadata: {
          sectionId: result.section.id,
          jobId: payload.draftJobId,
        },
      });
    } catch (auditError) {
      logger.warn("Failed to record audit event", { error: auditError });
    }
    if (payload.draftJobId) {
      try {
        await draftJobs.markSucceeded(payload.draftJobId);
      } catch (markError) {
        logger.warn("Failed to mark draft job succeeded", {
          draftJobId: payload.draftJobId,
          error: markError,
        });
      }
    }
    logger.info("Draft generated", {
      documentId: result.document.id,
      sectionId: result.section.id,
      jobId: job.id,
    });

    return { ok: true };
  },
  { connection: queueConnection },
);

const emailWorker = new Worker(
  emailQueueName,
  async (job) => {
    if (job.name !== "sendVerificationEmail") {
      logger.warn("Unknown email job received", { name: job.name, id: job.id });
      return { ok: false, reason: "unknown_job" };
    }

    const payload = verificationEmailSchema.parse(job.data);
    logger.info("Sending verification email", {
      email: payload.email,
      jobId: job.id,
    });

    await sendVerificationEmail({
      email: payload.email,
      name: payload.name,
      token: payload.token,
    });

    logger.info("Verification email sent", { email: payload.email, jobId: job.id });
    return { ok: true };
  },
  { connection: queueConnection },
);

worker.on("failed", async (job, error) => {
  logger.error("Job failed", {
    jobId: job?.id,
    name: job?.name,
    attemptsMade: job?.attemptsMade,
    error,
  });

  if (!job) {
    return;
  }

  const payload = generateDraftSchema.safeParse(job.data);
  if (!payload.success) {
    logger.warn("Failed job payload could not be parsed", {
      jobId: job.id,
      name: job.name,
    });
    return;
  }

  const attempts = job.opts.attempts ?? 1;
  const exhausted = job.attemptsMade >= attempts;
  if (exhausted) {
    try {
      await service.updateGenerationStatus(
        payload.data.documentId,
        payload.data.organizationId,
        DocumentGenerationStatus.FAILED,
      );
      try {
        await createEvent({
          organizationId: payload.data.organizationId,
          actorUserId: payload.data.actorUserId ?? null,
          action: "DRAFT_FAILED" satisfies AuditAction,
          targetType: "DOCUMENT" satisfies AuditTargetType,
          targetId: payload.data.documentId,
          metadata: {
            reason: error instanceof Error ? error.message : String(error),
            jobId: payload.data.draftJobId,
          },
        });
      } catch (auditError) {
        logger.warn("Failed to record audit event", { error: auditError });
      }
      if (payload.data.draftJobId) {
        try {
          await draftJobs.markFailed(
            payload.data.draftJobId,
            error instanceof Error ? error.message : String(error),
          );
        } catch (markError) {
          logger.warn("Failed to mark draft job failed", {
            draftJobId: payload.data.draftJobId,
            error: markError,
          });
        }
      }
    } catch (updateError) {
      logger.error("Failed to mark document generation as failed", {
        jobId: job.id,
        documentId: payload.data.documentId,
        error: updateError,
      });
    }
  }
});

emailWorker.on("failed", (job, error) => {
  logger.error("Email job failed", {
    jobId: job?.id,
    name: job?.name,
    attemptsMade: job?.attemptsMade,
    error,
  });
});

const shutdown = async () => {
  logger.info("Shutting down worker");
  await worker.close();
  await emailWorker.close();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
