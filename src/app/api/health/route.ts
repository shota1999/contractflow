import { NextResponse } from "next/server";
import packageJson from "../../../../package.json";
import { prisma } from "@/lib/prisma";
import { getRedisClient } from "@/lib/redis";
import { logger } from "@/lib/logger";

export async function GET() {
  const checks = {
    db: false,
    redis: false,
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.db = true;
  } catch {
    checks.db = false;
  }

  try {
    const redis = getRedisClient();
    await redis.ping();
    checks.redis = true;
  } catch {
    checks.redis = false;
  }

  const ok = checks.db && checks.redis;
  logger.info("Health check", { ok, checks });

  return NextResponse.json(
    {
      ok,
      version: packageJson.version,
      checks,
    },
    { status: ok ? 200 : 503 },
  );
}
