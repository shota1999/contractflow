"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { trackMarketingEvent } from "@/lib/marketing/analytics";
import { getUtmParamsForSubmission } from "@/lib/marketing/utm";

type ExitIntentModalProps = {
  title?: string;
  description?: string;
  ctaLabel?: string;
};

export function ExitIntentModal({
  title = "Free Marketing Proposal Template PDF",
  description = "Get a polished, agency-ready proposal template delivered to your inbox.",
  ctaLabel = "Send me the PDF",
}: ExitIntentModalProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error" | "rate_limited"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const storageKey = "cf_exit_intent_seen";
    const hasSeen =
      typeof window !== "undefined" ? window.sessionStorage.getItem(storageKey) : null;
    if (hasSeen) {
      return;
    }

    const handleMouseLeave = (event: MouseEvent) => {
      if (event.clientY <= 0) {
        setOpen(true);
        window.sessionStorage.setItem(storageKey, "true");
      }
    };

    window.addEventListener("mouseout", handleMouseLeave);
    return () => window.removeEventListener("mouseout", handleMouseLeave);
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      return;
    }

    setStatus("submitting");
    setErrorMessage(null);

    const payload = {
      email: trimmedEmail,
      source: "exit_intent",
      page: pathname ?? "/",
      utm: getUtmParamsForSubmission(),
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 429) {
        setStatus("rate_limited");
        trackMarketingEvent("lead_submit_rate_limited", { source: "exit_intent" });
        return;
      }

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.ok) {
        setStatus("error");
        setErrorMessage(result?.error?.message ?? "Unable to send. Please try again.");
        return;
      }

      setStatus("success");
      trackMarketingEvent("lead_submit_success", { source: "exit_intent" });
    } catch {
      setStatus("error");
      setErrorMessage("Unable to send. Please try again.");
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4 py-8">
      <div className="w-full max-w-lg rounded-[var(--radius-lg)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted-foreground)]">
              Agency resource
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-[var(--foreground)]">{title}</h3>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">{description}</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-full border border-[color:var(--border)] px-2 py-1 text-xs font-semibold text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            Close
          </button>
        </div>

        {status === "success" ? (
          <div className="mt-6 rounded-[var(--radius-md)] border border-[color:var(--success)]/30 bg-[color:var(--success)]/10 px-4 py-3 text-sm text-[color:var(--success)]">
            Sent &mdash; check your email for the free PDF.
          </div>
        ) : (
          <form className="mt-6 flex flex-col gap-3" onSubmit={handleSubmit}>
            {status === "error" ? (
              <div className="rounded-[var(--radius-md)] border border-[color:var(--danger)]/30 bg-[color:var(--danger)]/10 px-4 py-3 text-sm text-[color:var(--danger)]">
                {errorMessage ?? "Unable to send. Please try again."}
              </div>
            ) : null}
            {status === "rate_limited" ? (
              <div className="rounded-[var(--radius-md)] border border-[color:var(--warning)]/30 bg-[color:var(--warning)]/10 px-4 py-3 text-sm text-[color:var(--warning)]">
                Too many requests. Please try again in a bit.
              </div>
            ) : null}
            <input
              type="email"
              placeholder="Work email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-11 w-full rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)]/20"
              required
              disabled={status === "submitting"}
            />
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center rounded-full bg-[#4032C8] px-5 text-xs font-semibold uppercase tracking-[0.16em] text-white shadow-[var(--shadow-min)] transition hover:bg-[#3528ae] disabled:cursor-not-allowed disabled:opacity-70"
                disabled={status === "submitting"}
              >
                {status === "submitting" ? "Sending..." : ctaLabel}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                No thanks
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
