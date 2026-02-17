import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-helpers";
import { errorResponse, successResponse } from "@/lib/api-response";
import { env } from "@/lib/env";
import { requireAuth } from "@/lib/auth";
import { rateLimit, rateLimitHeaders } from "@/lib/rate-limit";
import { resendVerification } from "@/features/auth/service";

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const limitResult = await rateLimit({
      key: `auth:verify:resend:${user.id}`,
      limit: env.RATE_LIMIT_VERIFY_RESEND_MAX,
      windowMs: env.RATE_LIMIT_VERIFY_RESEND_WINDOW_MS,
    });

    if (!limitResult.ok) {
      return NextResponse.json(
        errorResponse({
          code: "RATE_LIMITED",
          message: "Too many verification emails. Please try again later.",
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

    const result = await resendVerification(user.id);
    const isDev = process.env.NODE_ENV !== "production";

    return NextResponse.json(
      successResponse({
        email: result.email,
        ...(isDev ? { verificationToken: result.token } : {}),
      }),
    );
  } catch (error) {
    return handleApiError(error, request);
  }
}
