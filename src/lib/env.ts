import { z } from "zod";

const envSchema = z.object({
  APP_URL: z.string().url(),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  AUTH_SECRET: z.string().min(1),
  NEXTAUTH_URL: z.string().url(),
  RATE_LIMIT_LOGIN_MAX: z.coerce.number().int().min(1).optional().default(10),
  RATE_LIMIT_LOGIN_WINDOW_MS: z.coerce.number().int().min(1000).optional().default(60_000),
  RATE_LIMIT_REGISTER_MAX: z.coerce.number().int().min(1).optional().default(6),
  RATE_LIMIT_REGISTER_WINDOW_MS: z.coerce.number().int().min(1000).optional().default(60_000),
  RATE_LIMIT_VERIFY_MAX: z.coerce.number().int().min(1).optional().default(8),
  RATE_LIMIT_VERIFY_WINDOW_MS: z.coerce.number().int().min(1000).optional().default(60_000),
  RATE_LIMIT_VERIFY_RESEND_MAX: z.coerce.number().int().min(1).optional().default(5),
  RATE_LIMIT_VERIFY_RESEND_WINDOW_MS: z.coerce.number().int().min(1000).optional().default(60_000),
  RATE_LIMIT_PASSWORD_RESET_REQUEST_MAX: z.coerce.number().int().min(1).optional().default(6),
  RATE_LIMIT_PASSWORD_RESET_REQUEST_WINDOW_MS: z.coerce.number()
    .int()
    .min(1000)
    .optional()
    .default(60_000),
  RATE_LIMIT_PASSWORD_RESET_CONFIRM_MAX: z.coerce.number().int().min(1).optional().default(6),
  RATE_LIMIT_PASSWORD_RESET_CONFIRM_WINDOW_MS: z.coerce.number()
    .int()
    .min(1000)
    .optional()
    .default(60_000),
  BRAND_NAME: z.string().min(1).optional().default("ContractFlow AI"),
  RATE_LIMIT_GENERATE_DRAFT_MAX: z.coerce.number().int().min(1).optional().default(5),
  RATE_LIMIT_GENERATE_DRAFT_WINDOW_MS: z.coerce.number().int().min(1000).optional().default(60_000),
  RATE_LIMIT_PUBLIC_DOC_MAX: z.coerce.number().int().min(1).optional().default(60),
  RATE_LIMIT_PUBLIC_DOC_WINDOW_MS: z.coerce.number().int().min(1000).optional().default(60_000),
  RATE_LIMIT_LEADS_MAX: z.coerce.number().int().min(1).optional().default(20),
  RATE_LIMIT_LEADS_WINDOW_MS: z.coerce.number().int().min(1000).optional().default(60_000),
  RESEND_API_KEY: z.string().min(1).optional(),
  RESEND_FROM_EMAIL: z.string().email().optional(),
  RESEND_FROM_NAME: z.string().min(1).optional(),
  SENTRY_DSN: z.string().url().optional(),
  SENTRY_ENVIRONMENT: z.string().min(1).optional(),
  SENTRY_RELEASE: z.string().min(1).optional(),
});

const shouldSkipValidation = process.env.NEXT_PHASE === "phase-production-build";

const parsed = envSchema.safeParse(
  shouldSkipValidation
    ? {
        APP_URL: process.env.APP_URL ?? "http://localhost:3000",
        DATABASE_URL:
          process.env.DATABASE_URL ??
          "postgresql://contractflow:contractflow@localhost:5432/contractflow?schema=public",
        REDIS_URL: process.env.REDIS_URL ?? "redis://localhost:6379",
        AUTH_SECRET: process.env.AUTH_SECRET ?? "build-only-secret",
        NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? process.env.APP_URL ?? "http://localhost:3000",
        RATE_LIMIT_LOGIN_MAX: process.env.RATE_LIMIT_LOGIN_MAX,
        RATE_LIMIT_LOGIN_WINDOW_MS: process.env.RATE_LIMIT_LOGIN_WINDOW_MS,
        RATE_LIMIT_REGISTER_MAX: process.env.RATE_LIMIT_REGISTER_MAX,
        RATE_LIMIT_REGISTER_WINDOW_MS: process.env.RATE_LIMIT_REGISTER_WINDOW_MS,
        RATE_LIMIT_VERIFY_MAX: process.env.RATE_LIMIT_VERIFY_MAX,
        RATE_LIMIT_VERIFY_WINDOW_MS: process.env.RATE_LIMIT_VERIFY_WINDOW_MS,
        RATE_LIMIT_VERIFY_RESEND_MAX: process.env.RATE_LIMIT_VERIFY_RESEND_MAX,
        RATE_LIMIT_VERIFY_RESEND_WINDOW_MS: process.env.RATE_LIMIT_VERIFY_RESEND_WINDOW_MS,
        RATE_LIMIT_PASSWORD_RESET_REQUEST_MAX: process.env.RATE_LIMIT_PASSWORD_RESET_REQUEST_MAX,
        RATE_LIMIT_PASSWORD_RESET_REQUEST_WINDOW_MS:
          process.env.RATE_LIMIT_PASSWORD_RESET_REQUEST_WINDOW_MS,
        RATE_LIMIT_PASSWORD_RESET_CONFIRM_MAX: process.env.RATE_LIMIT_PASSWORD_RESET_CONFIRM_MAX,
        RATE_LIMIT_PASSWORD_RESET_CONFIRM_WINDOW_MS:
          process.env.RATE_LIMIT_PASSWORD_RESET_CONFIRM_WINDOW_MS,
        BRAND_NAME: process.env.BRAND_NAME,
        RATE_LIMIT_GENERATE_DRAFT_MAX: process.env.RATE_LIMIT_GENERATE_DRAFT_MAX,
        RATE_LIMIT_GENERATE_DRAFT_WINDOW_MS: process.env.RATE_LIMIT_GENERATE_DRAFT_WINDOW_MS,
        RATE_LIMIT_PUBLIC_DOC_MAX: process.env.RATE_LIMIT_PUBLIC_DOC_MAX,
        RATE_LIMIT_PUBLIC_DOC_WINDOW_MS: process.env.RATE_LIMIT_PUBLIC_DOC_WINDOW_MS,
        RATE_LIMIT_LEADS_MAX: process.env.RATE_LIMIT_LEADS_MAX,
        RATE_LIMIT_LEADS_WINDOW_MS: process.env.RATE_LIMIT_LEADS_WINDOW_MS,
        RESEND_API_KEY: process.env.RESEND_API_KEY,
        RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
        RESEND_FROM_NAME: process.env.RESEND_FROM_NAME,
        SENTRY_DSN: process.env.SENTRY_DSN,
        SENTRY_ENVIRONMENT: process.env.SENTRY_ENVIRONMENT,
        SENTRY_RELEASE: process.env.SENTRY_RELEASE,
      }
    : {
        APP_URL: process.env.APP_URL,
        DATABASE_URL: process.env.DATABASE_URL,
        REDIS_URL: process.env.REDIS_URL,
        AUTH_SECRET: process.env.AUTH_SECRET,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        RATE_LIMIT_LOGIN_MAX: process.env.RATE_LIMIT_LOGIN_MAX,
        RATE_LIMIT_LOGIN_WINDOW_MS: process.env.RATE_LIMIT_LOGIN_WINDOW_MS,
        RATE_LIMIT_REGISTER_MAX: process.env.RATE_LIMIT_REGISTER_MAX,
        RATE_LIMIT_REGISTER_WINDOW_MS: process.env.RATE_LIMIT_REGISTER_WINDOW_MS,
        RATE_LIMIT_VERIFY_MAX: process.env.RATE_LIMIT_VERIFY_MAX,
        RATE_LIMIT_VERIFY_WINDOW_MS: process.env.RATE_LIMIT_VERIFY_WINDOW_MS,
        RATE_LIMIT_VERIFY_RESEND_MAX: process.env.RATE_LIMIT_VERIFY_RESEND_MAX,
        RATE_LIMIT_VERIFY_RESEND_WINDOW_MS: process.env.RATE_LIMIT_VERIFY_RESEND_WINDOW_MS,
        RATE_LIMIT_PASSWORD_RESET_REQUEST_MAX: process.env.RATE_LIMIT_PASSWORD_RESET_REQUEST_MAX,
        RATE_LIMIT_PASSWORD_RESET_REQUEST_WINDOW_MS:
          process.env.RATE_LIMIT_PASSWORD_RESET_REQUEST_WINDOW_MS,
        RATE_LIMIT_PASSWORD_RESET_CONFIRM_MAX: process.env.RATE_LIMIT_PASSWORD_RESET_CONFIRM_MAX,
        RATE_LIMIT_PASSWORD_RESET_CONFIRM_WINDOW_MS:
          process.env.RATE_LIMIT_PASSWORD_RESET_CONFIRM_WINDOW_MS,
        BRAND_NAME: process.env.BRAND_NAME,
        RATE_LIMIT_GENERATE_DRAFT_MAX: process.env.RATE_LIMIT_GENERATE_DRAFT_MAX,
        RATE_LIMIT_GENERATE_DRAFT_WINDOW_MS: process.env.RATE_LIMIT_GENERATE_DRAFT_WINDOW_MS,
        RATE_LIMIT_PUBLIC_DOC_MAX: process.env.RATE_LIMIT_PUBLIC_DOC_MAX,
        RATE_LIMIT_PUBLIC_DOC_WINDOW_MS: process.env.RATE_LIMIT_PUBLIC_DOC_WINDOW_MS,
        RATE_LIMIT_LEADS_MAX: process.env.RATE_LIMIT_LEADS_MAX,
        RATE_LIMIT_LEADS_WINDOW_MS: process.env.RATE_LIMIT_LEADS_WINDOW_MS,
        RESEND_API_KEY: process.env.RESEND_API_KEY,
        RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
        RESEND_FROM_NAME: process.env.RESEND_FROM_NAME,
        SENTRY_DSN: process.env.SENTRY_DSN,
        SENTRY_ENVIRONMENT: process.env.SENTRY_ENVIRONMENT,
        SENTRY_RELEASE: process.env.SENTRY_RELEASE,
      },
);

if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
  throw new Error("Missing or invalid environment variables");
}

export const env = parsed.data;
