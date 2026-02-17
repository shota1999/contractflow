import { Container } from "@/components/ui/Container";
import { MarketingButton } from "./MarketingButton";

export function StickyCtaBar() {
  return (
    <div className="fixed bottom-4 left-0 right-0 z-30 px-4">
      <Container className="max-w-[1200px]">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[var(--surface)]/95 px-4 py-3 shadow-[var(--shadow-soft)] backdrop-blur">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted-foreground)]">
              Ready to start?
            </p>
            <p className="text-sm font-semibold text-[var(--foreground)]">
              Start Free Proposal Workflow
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <MarketingButton href="/signup" size="sm" trackingSource="sticky_cta_primary">
              Start Free Proposal Workflow
            </MarketingButton>
            <MarketingButton
              href="/proposal-templates"
              variant="secondary"
              size="sm"
              trackingSource="sticky_cta_secondary"
            >
              View Templates
            </MarketingButton>
          </div>
        </div>
      </Container>
    </div>
  );
}
