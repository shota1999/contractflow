import { getRedisClient } from "@/lib/redis";

export type RateLimitConfig = {
  key: string;
  limit: number;
  windowMs: number;
};

export type RateLimitResult = {
  ok: boolean;
  limit: number;
  remaining: number;
  resetMs: number;
};

export async function rateLimit(config: RateLimitConfig): Promise<RateLimitResult> {
  const redis = getRedisClient();
  const now = Date.now();
  const windowId = Math.floor(now / config.windowMs);
  const redisKey = `ratelimit:${config.key}:${windowId}`;

  const count = await redis.incr(redisKey);
  if (count === 1) {
    await redis.pexpire(redisKey, config.windowMs);
  }

  const remaining = Math.max(0, config.limit - count);
  const resetMs = (windowId + 1) * config.windowMs - now;

  return {
    ok: count <= config.limit,
    limit: config.limit,
    remaining,
    resetMs,
  };
}

export const rateLimitHeaders = (result: RateLimitResult) => ({
  "x-ratelimit-limit": result.limit.toString(),
  "x-ratelimit-remaining": result.remaining.toString(),
  "x-ratelimit-reset": Math.max(0, Math.ceil(result.resetMs / 1000)).toString(),
});
