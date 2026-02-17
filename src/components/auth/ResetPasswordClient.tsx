"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { z } from "zod";
import { passwordSchema } from "@/features/auth/schemas";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

const confirmSchema = z
  .object({
    password: passwordSchema,
    confirm: z.string().min(1, "Confirm your password."),
  })
  .refine((value) => value.password === value.confirm, {
    message: "Passwords do not match.",
    path: ["confirm"],
  });

export function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token") ?? "", [searchParams]);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!token) {
      setError("Reset token is missing. Please use the link from your email.");
      return;
    }

    const validation = confirmSchema.safeParse({ password, confirm });
    if (!validation.success) {
      const firstError = validation.error.errors[0]?.message;
      setError(firstError ?? "Please enter a valid password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/password-reset/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const payload = (await response.json()) as { error?: { message?: string } };
      if (!response.ok) {
        setError(payload.error?.message ?? "Unable to reset your password.");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Unable to reset your password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-lg p-6 md:p-8">
        <div className="space-y-4">
          <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted-foreground)]">
            Password updated
          </div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)]">
            Your password has been reset.
          </h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            Sign in with your new password to access the workspace.
          </p>
          <Button size="lg" href="/login">
            Go to sign in
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-lg p-6 md:p-8">
      <div className="space-y-4">
        <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted-foreground)]">
          Set new password
        </div>
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">
          Choose a secure password
        </h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          Use at least 8 characters with a letter and a number.
        </p>
        <form className="mt-4 flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
              New password
            </span>
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="bg-[var(--surface-2)]"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
              Confirm password
            </span>
            <Input
              type="password"
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
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
            {isSubmitting ? "Updating password..." : "Update password"}
          </Button>
        </form>
        <p className="text-xs text-[var(--muted-foreground)]">
          Back to{" "}
          <Link href="/login" className="font-semibold text-[color:var(--primary)]">
            sign in
          </Link>
          .
        </p>
      </div>
    </Card>
  );
}
