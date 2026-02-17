import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-helpers";
import { errorResponse, successResponse } from "@/lib/api-response";
import { env } from "@/lib/env";
import { rateLimit, rateLimitHeaders } from "@/lib/rate-limit";
import { getRequestIp } from "@/lib/request";
import { documentPublicTokenSchema } from "@/features/documents/schemas";
import * as service from "@/features/documents/service";

type RouteParams = {
  params: Promise<{ token: string }>;
};

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { token } = await params;
    const publicToken = documentPublicTokenSchema.parse(token);

    const ip = getRequestIp(request);
    const limitResult = await rateLimit({
      key: `public-doc:${ip}`,
      limit: env.RATE_LIMIT_PUBLIC_DOC_MAX,
      windowMs: env.RATE_LIMIT_PUBLIC_DOC_WINDOW_MS,
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

    const document = await service.getDocumentByPublicToken(publicToken);
    return NextResponse.json(successResponse(document));
  } catch (error) {
    return handleApiError(error, request);
  }
}
