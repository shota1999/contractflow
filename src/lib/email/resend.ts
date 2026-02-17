import { AppError } from "@/lib/errors";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

type SendVerificationEmailInput = {
  email: string;
  name?: string | null;
  token: string;
};

const buildFromAddress = () => {
  if (!env.RESEND_FROM_EMAIL) {
    return null;
  }
  const fromName = env.RESEND_FROM_NAME ?? env.BRAND_NAME ?? "ContractFlow AI";
  return `${fromName} <${env.RESEND_FROM_EMAIL}>`;
};

const buildVerifyUrl = (token: string) => {
  const url = new URL("/verify-email", env.APP_URL);
  url.searchParams.set("token", token);
  return url.toString();
};

export async function sendVerificationEmail(input: SendVerificationEmailInput) {
  const apiKey = env.RESEND_API_KEY;
  const from = buildFromAddress();

  if (!apiKey || !from) {
    if (process.env.NODE_ENV === "production") {
      throw new AppError("CONFIG_ERROR", "Email provider is not configured.", 500);
    }
    logger.warn("Email provider not configured. Skipping verification email.", {
      email: input.email,
    });
    return { ok: false, skipped: true };
  }

  const verifyUrl = buildVerifyUrl(input.token);
  const recipientName = input.name?.trim() || "there";
  const subject = "Verify your ContractFlow AI email";
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
      <p>Hi ${recipientName},</p>
      <p>Thanks for trying ContractFlow AI. Please confirm your email to activate your account.</p>
      <p>
        <a href="${verifyUrl}" style="display:inline-block;padding:12px 18px;background:#4032C8;color:#fff;text-decoration:none;border-radius:999px;">
          Verify email
        </a>
      </p>
      <p>If the button does not work, copy and paste this link:</p>
      <p><a href="${verifyUrl}">${verifyUrl}</a></p>
      <p>-- ContractFlow AI</p>
    </div>
  `;
  const text = `Hi ${recipientName},\n\nVerify your email to activate your ContractFlow AI account:\n${verifyUrl}\n\n-- ContractFlow AI`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [input.email],
      subject,
      html,
      text,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    logger.error("Resend API error", {
      status: response.status,
      body,
    });
    throw new AppError("EMAIL_FAILED", "Unable to send verification email.", 502, {
      status: response.status,
    });
  }

  return { ok: true };
}
