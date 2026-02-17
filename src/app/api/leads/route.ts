import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-helpers";
import { successResponse, errorResponse } from "@/lib/api-response";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { getRequestIp } from "@/lib/request";
import { rateLimit, rateLimitHeaders } from "@/lib/rate-limit";
import { leadCreateSchema } from "@/features/leads/schemas";

export async function POST(request: Request) {
  try {
    const ip = getRequestIp(request);
    const limitResult = await rateLimit({
      key: `leads:capture:${ip}`,
      limit: env.RATE_LIMIT_LEADS_MAX,
      windowMs: env.RATE_LIMIT_LEADS_WINDOW_MS,
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
    const input = leadCreateSchema.parse(payload);

    const existing = await prisma.lead.findFirst({
      where: { email: input.email },
      select: { id: true },
      orderBy: { createdAt: "desc" },
    });

    if (existing) {
      return NextResponse.json(successResponse({ id: existing.id }), {
        status: 200,
        headers: rateLimitHeaders(limitResult),
      });
    }

    const lead = await prisma.lead.create({
      data: {
        email: input.email,
        source: input.source,
        page: input.page,
        utmSource: input.utm?.utmSource,
        utmMedium: input.utm?.utmMedium,
        utmCampaign: input.utm?.utmCampaign,
        utmTerm: input.utm?.utmTerm,
        utmContent: input.utm?.utmContent,
      },
      select: { id: true },
    });

    return NextResponse.json(successResponse({ id: lead.id }), {
      status: 201,
      headers: rateLimitHeaders(limitResult),
    });
  } catch (error) {
    return handleApiError(error, request);
  }
}
