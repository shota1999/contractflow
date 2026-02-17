import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Footer } from "./Footer";
import { UtmTracker } from "./components/UtmTracker";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <UtmTracker />
      <nav className="sticky top-0 z-20 border-b border-[color:var(--border)] bg-[var(--surface)]/90 backdrop-blur">
        <Container className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[color:var(--brand)] text-sm font-semibold text-[color:var(--brand-foreground)]">
                CF
              </span>
              <span className="text-sm font-semibold tracking-tight text-[var(--foreground)]">
                ContractFlow AI
              </span>
            </Link>
            <div className="hidden items-center gap-4 text-sm font-medium text-[var(--muted-foreground)] md:flex">
              <Link
                href="/marketing-agency-proposal-software"
                className="transition hover:text-[var(--foreground)]"
              >
                For agencies
              </Link>
              <Link
                href="/proposal-templates"
                className="transition hover:text-[var(--foreground)]"
              >
                Templates
              </Link>
              <Link href="/pricing" className="transition hover:text-[var(--foreground)]">
                Pricing
              </Link>
              <Link
                href="/case-studies/marketing-agency"
                className="transition hover:text-[var(--foreground)]"
              >
                Case study
              </Link>
              <Link href="/#workflow" className="transition hover:text-[var(--foreground)]">
                Workflow
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-semibold text-[var(--muted-foreground)] transition hover:text-[var(--foreground)]"
            >
              Sign in
            </Link>
            <Link
              href="mailto:sales@contractflow.ai"
              className="inline-flex h-9 items-center justify-center rounded-full bg-[#4032C8] px-4 text-xs font-semibold uppercase tracking-[0.2em] !text-white shadow-[var(--shadow-min)] transition hover:bg-[#3528ae]"
            >
              Contact sales
            </Link>
          </div>
        </Container>
      </nav>

      {children}

      <Footer />
    </div>
  );
}
