import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-helpers";
import { successResponse, errorResponse } from "@/lib/api-response";
import { env } from "@/lib/env";
import { getRequestIp } from "@/lib/request";
import { rateLimit, rateLimitHeaders } from "@/lib/rate-limit";
import { registerSchema } from "@/features/auth/schemas";
import { registerUser } from "@/features/auth/service";

export async function POST(request: Request) {
  try {
    const ip = getRequestIp(request);
    const limitResult = await rateLimit({
      key: `auth:register:${ip}`,
      limit: env.RATE_LIMIT_REGISTER_MAX,
      windowMs: env.RATE_LIMIT_REGISTER_WINDOW_MS,
    });

    if (!limitResult.ok) {
      return NextResponse.json(
        errorResponse({
          code: "RATE_LIMITED",
          message: "Too many signup attempts. Please try again later.",
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
    const input = registerSchema.parse(payload);
    const result = await registerUser(input);
    const isDev = process.env.NODE_ENV !== "production";

    return NextResponse.json(
      successResponse({
        userId: result.user.id,
        email: result.user.email,
        orgId: result.organization.id,
        orgName: result.organization.name,
        ...(isDev ? { verificationToken: result.verificationToken } : {}),
      }),
      { status: 201 },
    );
  } catch (error) {
    return handleApiError(error, request);
  }
}
