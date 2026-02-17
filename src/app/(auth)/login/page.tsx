"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const defaultCallbackUrl = "/dashboard";
  const [email, setEmail] = useState("admin@contractflow.ai");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const url = new URL(window.location.href);
    const callback = url.searchParams.get("callbackUrl") ?? defaultCallbackUrl;

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: callback,
    });

    setIsSubmitting(false);

    if (!result || result.error) {
      setError("Invalid credentials. Try the seeded admin account.");
      return;
    }

    router.push(result.url ?? defaultCallbackUrl);
  };

  return (
    <Card className="w-full max-w-5xl p-6 md:p-10">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-3 rounded-full border border-[color:var(--border)] bg-[var(--surface-2)] px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-[var(--muted-foreground)]">
            ContractFlow AI
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--primary)]" />
            Secure Workspace
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)] md:text-4xl">
              Welcome back to your contract command center.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-[var(--muted-foreground)]">
              Trusted, auditable workflows for enterprise teams. Sign in to review approvals,
              monitor SLA performance, and keep every decision secure.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "Secure access controls",
              "Audit-ready activity trails",
              "Enterprise governance",
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
            Sign in
          </div>
          <h2 className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
            Access the workspace
          </h2>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Use the seeded admin account to access the workspace.
          </p>
          <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
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
            <label className="flex flex-col gap-2 text-sm">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                Password
              </span>
              <Input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="bg-[var(--surface-2)]"
                required
              />
            </label>
            <div className="text-right text-xs">
              <Link
                href="/forgot-password"
                className="font-semibold text-[color:var(--primary)]"
              >
                Forgot password?
              </Link>
            </div>
            {error ? (
              <div className="rounded-[var(--radius-md)] border border-[color:var(--danger)] bg-[color:var(--danger)]/10 px-3 py-2 text-xs text-[color:var(--danger)]">
                {error}
              </div>
            ) : null}
            <Button type="submit" disabled={isSubmitting} size="lg">
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          <p className="mt-4 text-xs text-[var(--muted-foreground)]">
            New to ContractFlow AI?{" "}
            <Link
              href="/signup"
              className="font-semibold text-[color:var(--primary)]"
            >
              Create an account
            </Link>
          </p>
        </Card>
      </div>
    </Card>
  );
}
