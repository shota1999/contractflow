import { getEmailQueue } from "@/lib/queue";
import { logger } from "@/lib/logger";

type VerificationEmailJob = {
  email: string;
  name?: string | null;
  token: string;
};

export async function enqueueVerificationEmail(payload: VerificationEmailJob) {
  try {
    const queue = getEmailQueue();
    await queue.add("sendVerificationEmail", payload, {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
      removeOnComplete: true,
    });
  } catch (error) {
    logger.error("Failed to enqueue verification email", { error });
  }
}
