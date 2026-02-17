import { Queue } from "bullmq";
import { env } from "@/lib/env";

export const documentQueueName = "document-jobs";
export const emailQueueName = "email-jobs";

const redisUrl = new URL(env.REDIS_URL);

export const queueConnection = {
  host: redisUrl.hostname,
  port: Number(redisUrl.port || "6379"),
  username: redisUrl.username || undefined,
  password: redisUrl.password || undefined,
};

let cachedQueue: Queue | null = null;
let cachedEmailQueue: Queue | null = null;

export const getDocumentQueue = () => {
  if (!cachedQueue) {
    cachedQueue = new Queue(documentQueueName, {
      connection: queueConnection,
    });
  }
  return cachedQueue;
};

export const getEmailQueue = () => {
  if (!cachedEmailQueue) {
    cachedEmailQueue = new Queue(emailQueueName, {
      connection: queueConnection,
    });
  }
  return cachedEmailQueue;
};
