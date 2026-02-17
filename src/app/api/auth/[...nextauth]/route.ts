import NextAuth from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { env } from "@/lib/env";
import { errorResponse } from "@/lib/api-response";
import { rateLimit, rateLimitHeaders } from "@/lib/rate-limit";
import { getRequestIp } from "@/lib/request";

const handler = NextAuth(authOptions);

export { handler as GET };

type RouteContext = {
  params: Promise<{ nextauth: string[] }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  const ip = getRequestIp(request);
  const limitResult = await rateLimit({
    key: `login:${ip}`,
    limit: env.RATE_LIMIT_LOGIN_MAX,
    windowMs: env.RATE_LIMIT_LOGIN_WINDOW_MS,
  });

  if (!limitResult.ok) {
    return NextResponse.json(
      errorResponse({
        code: "RATE_LIMITED",
        message: "Too many login attempts. Please try again later.",
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

  const params = await context.params;
  return handler(request, { params });
}
