import { Queue } from "bullmq";
import { env } from "@/lib/env";

export const documentQueueName = "document-jobs";
export const emailQueueName = "email-jobs";

const buildQueueConnection = () => {
  try {
    const redisUrl = new URL(env.REDIS_URL.trim());
    return {
      host: redisUrl.hostname,
      port: Number(redisUrl.port || "6379"),
      username: redisUrl.username || undefined,
      password: redisUrl.password || undefined,
    };
  } catch (error) {
    if (process.env.NODE_ENV === "test") {
      const redisUrl = new URL("redis://localhost:6379");
      return {
        host: redisUrl.hostname,
        port: Number(redisUrl.port || "6379"),
        username: redisUrl.username || undefined,
        password: redisUrl.password || undefined,
      };
    }
    throw error;
  }
};

let cachedConnection: ReturnType<typeof buildQueueConnection> | null = null;
const getQueueConnection = () => {
  if (!cachedConnection) {
    cachedConnection = buildQueueConnection();
  }
  return cachedConnection;
};

let cachedQueue: Queue | null = null;
let cachedEmailQueue: Queue | null = null;

export const getDocumentQueue = () => {
  if (!cachedQueue) {
    cachedQueue = new Queue(documentQueueName, {
      connection: getQueueConnection(),
    });
  }
  return cachedQueue;
};

export const getEmailQueue = () => {
  if (!cachedEmailQueue) {
    cachedEmailQueue = new Queue(emailQueueName, {
      connection: getQueueConnection(),
    });
  }
  return cachedEmailQueue;
};
