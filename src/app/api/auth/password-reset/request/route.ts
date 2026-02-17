import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-helpers";
import { errorResponse, successResponse } from "@/lib/api-response";
import { env } from "@/lib/env";
import { getRequestIp } from "@/lib/request";
import { rateLimit, rateLimitHeaders } from "@/lib/rate-limit";
import { resetPasswordRequestSchema } from "@/features/auth/schemas";
import { requestPasswordReset } from "@/features/auth/service";

export async function POST(request: Request) {
  try {
    const ip = getRequestIp(request);
    const limitResult = await rateLimit({
      key: `auth:password-reset:request:${ip}`,
      limit: env.RATE_LIMIT_PASSWORD_RESET_REQUEST_MAX,
      windowMs: env.RATE_LIMIT_PASSWORD_RESET_REQUEST_WINDOW_MS,
    });

    if (!limitResult.ok) {
      return NextResponse.json(
        errorResponse({
          code: "RATE_LIMITED",
          message: "Too many requests. Please try again later.",
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
    const input = resetPasswordRequestSchema.parse(payload);
    const result = await requestPasswordReset(input);
    const isDev = process.env.NODE_ENV !== "production";

    return NextResponse.json(
      successResponse({
        delivered: true,
        ...(isDev && result.token ? { resetToken: result.token } : {}),
      }),
    );
  } catch (error) {
    return handleApiError(error, request);
  }
}
