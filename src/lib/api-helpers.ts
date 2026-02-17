import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { errorResponse } from "./api-response";
import { AppError } from "./errors";
import { logger } from "./logger";
import { getRequestId, getRequestIp } from "./request";

export function handleApiError(error: unknown, request?: Request) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      errorResponse({
        code: "VALIDATION_ERROR",
        message: "Request validation failed.",
        details: error.flatten(),
      }),
      { status: 400 },
    );
  }

  if (error instanceof AppError) {
    return NextResponse.json(
      errorResponse({
        code: error.code,
        message: error.message,
        details: error.details,
      }),
      { status: error.status },
    );
  }

  const requestId = request ? getRequestId(request) : undefined;
  const requestMeta = request
    ? {
        method: request.method,
        url: request.url,
        ip: getRequestIp(request),
      }
    : undefined;
  logger.error("Unhandled API error", { requestId, ...requestMeta, error });

  return NextResponse.json(
    errorResponse({
      code: "INTERNAL_ERROR",
      message: "Unexpected server error.",
    }),
    { status: 500 },
  );
}
