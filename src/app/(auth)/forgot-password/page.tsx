"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    setResetToken(null);

    try {
      const response = await fetch("/api/auth/password-reset/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const payload = (await response.json()) as {
        data?: { resetToken?: string };
        error?: { message?: string };
      };

      if (!response.ok) {
        setError(payload.error?.message ?? "Unable to request a reset link.");
        return;
      }

      if (payload.data?.resetToken) {
        setResetToken(payload.data.resetToken);
      }
      setSuccess(true);
    } catch {
      setError("Unable to request a reset link.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-lg p-6 md:p-8">
        <div className="space-y-4">
          <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted-foreground)]">
            Reset link sent
          </div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)]">
            Check your email for a reset link.
          </h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            If an account exists for that email, you’ll receive a reset link shortly.
          </p>
          {resetToken ? (
            <Button size="lg" href={`/reset-password?token=${resetToken}`}>
              Open reset link (dev)
            </Button>
          ) : null}
          <Button variant="secondary" size="lg" href="/login">
            Back to sign in
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-lg p-6 md:p-8">
      <div className="space-y-4">
        <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted-foreground)]">
          Forgot password
        </div>
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">
          Reset your password
        </h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          Enter your work email and we’ll send a reset link.
        </p>
        <form className="mt-4 flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
              Email
            </span>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="bg-[var(--surface-2)]"
              required
            />
          </label>
          {error ? (
            <div className="rounded-[var(--radius-md)] border border-[color:var(--danger)] bg-[color:var(--danger)]/10 px-3 py-2 text-xs text-[color:var(--danger)]">
              {error}
            </div>
          ) : null}
          <Button type="submit" disabled={isSubmitting} size="lg">
            {isSubmitting ? "Sending reset link..." : "Send reset link"}
          </Button>
        </form>
        <p className="text-xs text-[var(--muted-foreground)]">
          Remembered your password?{" "}
          <Link href="/login" className="font-semibold text-[color:var(--primary)]">
            Back to sign in
          </Link>
        </p>
      </div>
    </Card>
  );
}
