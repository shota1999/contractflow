"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { useAcceptInviteMutation } from "@/lib/api/org-api";

type InviteAcceptClientProps = {
  token: string;
};

type InviteError = {
  title: string;
  description: string;
  kind?: "mismatch" | "verify";
  inviteEmail?: string;
  userEmail?: string;
};

const getInviteError = (error: unknown): InviteError => {
  const data = (error as { data?: { error?: { code?: string; message?: string } } })?.data;
  const code = data?.error?.code;
  const message = data?.error?.message?.toLowerCase() ?? "";
  const details = (data as { error?: { details?: { inviteEmail?: string; userEmail?: string; action?: string } } })
    ?.error?.details;

  if (code === "CONFLICT" && message.includes("expired")) {
    return {
      title: "Invite expired",
      description: "This invite link has expired. Ask an admin to send a new invite.",
    };
  }

  if (
    code === "CONFLICT" &&
    (message.includes("already accepted") || message.includes("already a member"))
  ) {
    return {
      title: "Invite already accepted",
      description: "This invite link has already been used. Ask an admin for a new link.",
    };
  }

  if (code === "FORBIDDEN") {
    if (details?.inviteEmail && details?.userEmail) {
      return {
        title: "Invite email mismatch",
        description: `This invite is for ${details.inviteEmail}. You are signed in as ${details.userEmail}.`,
        kind: "mismatch",
        inviteEmail: details.inviteEmail,
        userEmail: details.userEmail,
      };
    }

    if (details?.action === "verify_email" || message.includes("verify")) {
      return {
        title: "Verify your email",
        description: "Please verify your email before accepting this invite.",
        kind: "verify",
      };
    }

    return {
      title: "Access denied",
      description: "You do not have permission to accept this invite.",
    };
  }

  if (code === "NOT_FOUND" || code === "VALIDATION_ERROR") {
    return {
      title: "Invalid invite",
      description: "This invite link is invalid. Ask an admin for a fresh link.",
    };
  }

  return {
    title: "Invite failed",
    description: "We could not accept this invite. Please try again later.",
  };
};

export function InviteAcceptClient({ token }: InviteAcceptClientProps) {
  const router = useRouter();
  const { status, update } = useSession();
  const [acceptInvite] = useAcceptInviteMutation();
  const [state, setState] = useState<"idle" | "accepting" | "success" | "error">("idle");
  const [error, setError] = useState<InviteError | null>(null);
  const [resendStatus, setResendStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [resendToken, setResendToken] = useState<string | null>(null);

  const callbackUrl = useMemo(() => `/invite/${token}`, [token]);
  const loginHref = useMemo(
    () => `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`,
    [callbackUrl],
  );

  useEffect(() => {
    if (status !== "authenticated" || state !== "idle") {
      return;
    }

    let isActive = true;

    const run = async () => {
      setState("accepting");
      setError(null);
      try {
        const membership = await acceptInvite({ token }).unwrap();
        const orgResponse = await fetch("/api/org", { cache: "no-store" });
        if (orgResponse.ok) {
          const orgPayload = (await orgResponse.json()) as {
            data?: { organizations?: unknown };
          };
          await update({
            orgId: membership.data.organizationId,
            role: membership.data.role,
            orgs: orgPayload.data?.organizations ?? [],
          } as unknown as Parameters<typeof update>[0]);
        } else {
          await update({
            orgId: membership.data.organizationId,
            role: membership.data.role,
          } as unknown as Parameters<typeof update>[0]);
        }
        if (isActive) {
          setState("success");
          router.refresh();
        }
      } catch (err) {
        if (isActive) {
          setError(getInviteError(err));
          setState("error");
        }
      }
    };

    void run();

    return () => {
      isActive = false;
    };
  }, [acceptInvite, status, state, token, update, router]);

  if (status === "loading") {
    return <LoadingState label="Checking session..." />;
  }

  if (status === "unauthenticated") {
    return (
      <div className="w-full max-w-lg rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[var(--background)] p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">Accept invite</h1>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Sign in to accept this organization invite.
        </p>
        <div className="mt-6">
          <Button size="lg" href={loginHref}>
            Sign in to continue
          </Button>
        </div>
      </div>
    );
  }

  if (state === "accepting") {
    return <LoadingState label="Accepting invite..." />;
  }

  if (state === "error" && error) {
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

    let action: React.ReactNode = (
      <Button variant="secondary" href={loginHref}>
        Sign in with a different account
      </Button>
    );

    if (error.kind === "verify") {
      action = (
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" href="/verify-email">
            Verify email
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={handleResend}
            disabled={resendStatus === "sending"}
          >
            {resendStatus === "sending" ? "Resending..." : "Resend verification email"}
          </Button>
        </div>
      );
    }

    if (error.kind === "mismatch") {
      action = (
        <Button variant="secondary" size="lg" href={loginHref}>
          Sign in with the invited account
        </Button>
      );
    }

    return (
      <div className="space-y-4">
        <EmptyState title={error.title} description={error.description} action={action} />
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

  if (state === "success") {
    return (
      <div className="w-full max-w-lg rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[var(--background)] p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">Invite accepted</h1>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          You now have access to the organization workspace.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button size="lg" href="/dashboard">
            Go to dashboard
          </Button>
          <Button variant="secondary" href="/documents">
            View documents
          </Button>
        </div>
      </div>
    );
  }

  return <LoadingState label="Preparing invite..." />;
}
