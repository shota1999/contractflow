"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/features/auth/schemas";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

type RegisterFormValues = z.infer<typeof registerSchema>;

export function SignupClient() {
  const searchParams = useSearchParams();
  const { status: sessionStatus } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [existingAccount, setExistingAccount] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const [resendStatus, setResendStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      orgName: "",
    },
    mode: "onBlur",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  const onSubmit = async (values: RegisterFormValues) => {
    setError(null);
    setExistingAccount(false);
    setIsSubmitting(true);
    setResendStatus("idle");
    setResendMessage(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const payload = (await response.json()) as {
        data?: { verificationToken?: string };
        error?: { message?: string };
      };

      if (!response.ok) {
        if (response.status === 409) {
          setExistingAccount(true);
          setError("An account already exists for this email.");
          return;
        }
        setError(payload?.error?.message ?? "Unable to create your account.");
        return;
      }

      setRegisteredEmail(values.email);
      setVerificationToken(payload.data?.verificationToken ?? null);
      setIsSuccess(true);

      const signInResult = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
        callbackUrl,
      });

      if (!signInResult || signInResult.error) {
        setSuccessMessage("Account created. Sign in to manage verification settings.");
      }
    } catch {
      setError("Unable to create your account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setResendStatus("sending");
    setResendMessage(null);
    try {
      const response = await fetch("/api/auth/verify/resend", { method: "POST" });
      const payload = (await response.json()) as {
        data?: { verificationToken?: string };
        error?: { message?: string };
      };

      if (!response.ok) {
        setResendStatus("error");
        setResendMessage(payload.error?.message ?? "Unable to resend verification email.");
        return;
      }

      if (payload.data?.verificationToken) {
        setVerificationToken(payload.data.verificationToken);
      }
      setResendStatus("sent");
      setResendMessage("Verification email sent. Check your inbox.");
    } catch {
      setResendStatus("error");
      setResendMessage("Unable to resend verification email.");
    }
  };

  if (isSuccess) {
    return (
      <Card className="w-full max-w-3xl p-6 md:p-10">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-3 rounded-full border border-[color:var(--border)] bg-[var(--surface-2)] px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-[var(--muted-foreground)]">
            Email verification
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--primary)]" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)] md:text-4xl">
              Check your inbox to verify your email.
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-[var(--muted-foreground)]">
              We sent a verification link{registeredEmail ? ` to ${registeredEmail}` : ""}. Once
              verified, you can accept invites and unlock full workspace access.
            </p>
          </div>
          {successMessage ? (
            <div className="rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[var(--surface-2)] px-3 py-2 text-xs text-[var(--muted-foreground)]">
              {successMessage}
            </div>
          ) : null}
          {resendMessage ? (
            <div
              className={`rounded-[var(--radius-md)] border px-3 py-2 text-xs ${
                resendStatus === "sent"
                  ? "border-[color:var(--success)] bg-[color:var(--success)]/10 text-[color:var(--success)]"
                  : "border-[color:var(--danger)] bg-[color:var(--danger)]/10 text-[color:var(--danger)]"
              }`}
            >
              {resendMessage}
            </div>
          ) : null}
          <div className="flex flex-wrap gap-3">
            {sessionStatus === "authenticated" ? (
              <Button size="lg" onClick={handleResend} disabled={resendStatus === "sending"}>
                {resendStatus === "sending" ? "Resending..." : "Resend verification email"}
              </Button>
            ) : (
              <Button size="lg" href={`/login?callbackUrl=${encodeURIComponent("/verify-email")}`}>
                Sign in to resend email
              </Button>
            )}
            <Button variant="secondary" size="lg" href="/dashboard">
              Go to dashboard
            </Button>
            {verificationToken ? (
              <Button
                variant="ghost"
                size="lg"
                href={`/verify-email?token=${verificationToken}`}
              >
                Open verification link (dev)
              </Button>
            ) : null}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-5xl p-6 md:p-10">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-3 rounded-full border border-[color:var(--border)] bg-[var(--surface-2)] px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-[var(--muted-foreground)]">
            ContractFlow AI
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--primary)]" />
            Create account
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)] md:text-4xl">
              Start a secure, audit-ready workspace in minutes.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-[var(--muted-foreground)]">
              Set up your organization, invite stakeholders, and track every approval with
              enterprise-grade governance.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "Owner-level access control",
              "Audit-ready trails",
              "Frictionless approvals",
              "Trusted by legal ops",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[var(--surface-2)] px-4 py-3 text-xs font-semibold text-[var(--foreground)]"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <Card className="p-6 md:p-8">
          <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted-foreground)]">
            Sign up
          </div>
          <h2 className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Use your work email to start a new workspace.
          </p>
          <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <label className="flex flex-col gap-2 text-sm">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                Full name
              </span>
              <Input
                type="text"
                placeholder="Avery Stone"
                className="bg-[var(--surface-2)]"
                {...register("name")}
              />
              {errors.name ? (
                <span className="text-xs text-[color:var(--danger)]">{errors.name.message}</span>
              ) : null}
            </label>
            <label className="flex flex-col gap-2 text-sm">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                Work email
              </span>
              <Input
                type="email"
                placeholder="you@company.com"
                className="bg-[var(--surface-2)]"
                {...register("email")}
                required
              />
              {errors.email ? (
                <span className="text-xs text-[color:var(--danger)]">{errors.email.message}</span>
              ) : null}
            </label>
            <label className="flex flex-col gap-2 text-sm">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                Password
              </span>
              <Input
                type="password"
                className="bg-[var(--surface-2)]"
                {...register("password")}
                required
              />
              {errors.password ? (
                <span className="text-xs text-[color:var(--danger)]">
                  {errors.password.message}
                </span>
              ) : (
                <span className="text-xs text-[var(--muted-foreground)]">
                  At least 8 characters with a letter and a number.
                </span>
              )}
            </label>
            <label className="flex flex-col gap-2 text-sm">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                Organization name
              </span>
              <Input
                type="text"
                placeholder="Acme Corp"
                className="bg-[var(--surface-2)]"
                {...register("orgName")}
              />
              {errors.orgName ? (
                <span className="text-xs text-[color:var(--danger)]">
                  {errors.orgName.message}
                </span>
              ) : null}
            </label>
            {error ? (
              <div className="rounded-[var(--radius-md)] border border-[color:var(--danger)] bg-[color:var(--danger)]/10 px-3 py-2 text-xs text-[color:var(--danger)]">
                {error}
                {existingAccount ? (
                  <span className="ml-2 text-[color:var(--danger)]">
                    <Link href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}>
                      Sign in instead.
                    </Link>
                  </span>
                ) : null}
              </div>
            ) : null}
            <Button type="submit" disabled={isSubmitting} size="lg">
              {isSubmitting ? "Creating account..." : "Create account"}
            </Button>
          </form>
          <p className="mt-4 text-xs text-[var(--muted-foreground)]">
            Already have an account?{" "}
            <Link
              href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
              className="font-semibold text-[color:var(--primary)]"
            >
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </Card>
  );
}
