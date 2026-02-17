"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";

type VerifyState = "idle" | "verifying" | "success" | "error";

type VerifyError = {
  title: string;
  description: string;
  showResend?: boolean;
};

const getVerifyError = (error: unknown): VerifyError => {
  const data = (error as { data?: { error?: { code?: string; message?: string } } })?.data;
  const code = data?.error?.code;
  const message = data?.error?.message?.toLowerCase() ?? "";

  if (code === "CONFLICT" && message.includes("expired")) {
    return {
      title: "Verification link expired",
      description: "Your verification link has expired. Request a new email to continue.",
      showResend: true,
    };
  }

  if (code === "CONFLICT" && message.includes("already verified")) {
    return {
      title: "Email already verified",
      description: "Your email is already verified. You can continue to the dashboard.",
    };
  }

  if (code === "NOT_FOUND" || code === "VALIDATION_ERROR") {
    return {
      title: "Invalid verification link",
      description: "This verification link is invalid. Request a new email to try again.",
      showResend: true,
    };
  }

  return {
    title: "Verification failed",
    description: "We could not verify your email. Please try again later.",
  };
};

export function VerifyEmailClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status: sessionStatus, update } = useSession();
  const [state, setState] = useState<VerifyState>("idle");
  const [error, setError] = useState<VerifyError | null>(null);
  const [resendStatus, setResendStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [resendToken, setResendToken] = useState<string | null>(null);

  const token = useMemo(() => searchParams.get("token"), [searchParams]);

  useEffect(() => {
    if (!token || state !== "idle") {
      return;
    }

    let isActive = true;

    const run = async () => {
      setState("verifying");
      setError(null);
      try {
        const response = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const payload = await response.json();

        if (!response.ok) {
          if (isActive) {
            setError(getVerifyError({ data: payload }));
            setState("error");
          }
          return;
        }

        await update({ emailVerifiedAt: new Date().toISOString() });
        if (isActive) {
          setState("success");
          router.refresh();
        }
      } catch (err) {
        if (isActive) {
          setError(getVerifyError(err));
          setState("error");
        }
      }
    };

    void run();

    return () => {
      isActive = false;
    };
  }, [token, state, update, router]);

  const handleResend = async () => {
    setResendStatus("sending");
    setResendMessage(null);
    setResendToken(null);
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
        setResendToken(payload.data.verificationToken);
      }
      setResendStatus("sent");
      setResendMessage("Verification email sent. Check your inbox.");
    } catch {
      setResendStatus("error");
      setResendMessage("Unable to resend verification email.");
    }
  };

  if (!token) {
    return (
      <div className="space-y-4">
        <EmptyState
          title="Missing verification link"
          description="Please use the verification link from your email."
          action={
            sessionStatus === "authenticated" ? (
              <Button size="lg" onClick={handleResend} disabled={resendStatus === "sending"}>
                {resendStatus === "sending" ? "Resending..." : "Resend verification email"}
              </Button>
            ) : (
              <Button size="lg" href="/login?callbackUrl=/verify-email">
                Sign in to resend email
              </Button>
            )
          }
        />
        {resendMessage ? (
          <div
            className={`rounded-[var(--radius-md)] border px-3 py-2 text-xs text-center ${
              resendStatus === "sent"
                ? "border-[color:var(--success)] bg-[color:var(--success)]/10 text-[color:var(--success)]"
                : "border-[color:var(--danger)] bg-[color:var(--danger)]/10 text-[color:var(--danger)]"
            }`}
          >
            <div>{resendMessage}</div>
            {resendToken ? (
              <a
                className="mt-2 inline-flex font-semibold text-[color:var(--foreground)] underline"
                href={`/verify-email?token=${resendToken}`}
              >
                Open verification link (dev)
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }

  if (state === "verifying" || state === "idle") {
    return <LoadingState label="Verifying email..." />;
  }

  if (state === "success") {
    return (
      <div className="w-full max-w-lg rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[var(--background)] p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">Email verified</h1>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Your email is verified. You can now accept invites and access your workspace.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button size="lg" href="/dashboard">
            Go to dashboard
          </Button>
          <Button variant="secondary" size="lg" href="/documents">
            View documents
          </Button>
        </div>
      </div>
    );
  }

  if (state === "error" && error) {
    return (
      <div className="space-y-4">
        <EmptyState
          title={error.title}
          description={error.description}
          action={
            error.showResend ? (
              sessionStatus === "authenticated" ? (
                <Button size="lg" onClick={handleResend} disabled={resendStatus === "sending"}>
                  {resendStatus === "sending" ? "Resending..." : "Resend verification email"}
                </Button>
              ) : (
                <Button size="lg" href="/login?callbackUrl=/verify-email">
                  Sign in to resend email
                </Button>
              )
            ) : (
              <Button size="lg" href="/dashboard">
                Go to dashboard
              </Button>
            )
          }
        />
        {resendMessage ? (
          <div
            className={`rounded-[var(--radius-md)] border px-3 py-2 text-xs text-center ${
              resendStatus === "sent"
                ? "border-[color:var(--success)] bg-[color:var(--success)]/10 text-[color:var(--success)]"
                : "border-[color:var(--danger)] bg-[color:var(--danger)]/10 text-[color:var(--danger)]"
            }`}
          >
            {resendMessage}
          </div>
        ) : null}
      </div>
    );
  }

  return <LoadingState label="Preparing verification..." />;
}
