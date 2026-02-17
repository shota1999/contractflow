import Link from "next/link";
import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="border-t border-[color:var(--border)] bg-[var(--surface)] py-10">
      <Container className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--foreground)]">ContractFlow AI</p>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Proposal and contract workflows built for marketing agencies.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm font-medium text-[var(--muted-foreground)]">
          <Link href="/proposal-templates" className="transition hover:text-[var(--foreground)]">
            Templates
          </Link>
          <Link href="/pricing" className="transition hover:text-[var(--foreground)]">
            Pricing
          </Link>
          <Link href="/privacy" className="transition hover:text-[var(--foreground)]">
            Privacy
          </Link>
          <Link href="/terms" className="transition hover:text-[var(--foreground)]">
            Terms
          </Link>
          <a href="mailto:hello@contractflow.ai" className="transition hover:text-[var(--foreground)]">
            Contact
          </a>
        </div>
      </Container>
    </footer>
  );
}
