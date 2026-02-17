import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-helpers";
import { errorResponse, successResponse } from "@/lib/api-response";
import { env } from "@/lib/env";
import { getRequestIp } from "@/lib/request";
import { rateLimit, rateLimitHeaders } from "@/lib/rate-limit";
import { verifyEmailSchema } from "@/features/auth/schemas";
import { verifyEmailToken } from "@/features/auth/service";

export async function POST(request: Request) {
  try {
    const ip = getRequestIp(request);
    const limitResult = await rateLimit({
      key: `auth:verify:${ip}`,
      limit: env.RATE_LIMIT_VERIFY_MAX,
      windowMs: env.RATE_LIMIT_VERIFY_WINDOW_MS,
    });

    if (!limitResult.ok) {
      return NextResponse.json(
        errorResponse({
          code: "RATE_LIMITED",
          message: "Too many verification attempts. Please try again later.",
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

    const payload = await request.json();
    const input = verifyEmailSchema.parse(payload);
    const result = await verifyEmailToken(input.token);

    return NextResponse.json(
      successResponse({
        userId: result.userId,
        email: result.email,
      }),
    );
  } catch (error) {
    return handleApiError(error, request);
  }
}
