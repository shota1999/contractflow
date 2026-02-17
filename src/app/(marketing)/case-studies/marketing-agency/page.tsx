import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { MarketingButton } from "../../components/MarketingButton";
import { MarketingSectionHeader } from "../../components/MarketingSectionHeader";

export const metadata: Metadata = {
  title: "Case Study: Marketing Agency Proposal Workflow | ContractFlow AI",
  description:
    "How a 10-person marketing agency reduced proposal turnaround from 7 days to 1–2 days with ContractFlow AI.",
  alternates: {
    canonical: "/case-studies/marketing-agency",
  },
  openGraph: {
    title: "Case Study: Marketing Agency Proposal Workflow | ContractFlow AI",
    description:
      "How a 12-person marketing agency reduced proposal turnaround and improved client approvals with ContractFlow AI.",
    type: "article",
    url: "/case-studies/marketing-agency",
  },
  twitter: {
    card: "summary_large_image",
    title: "Case Study: Marketing Agency Proposal Workflow | ContractFlow AI",
    description:
      "How a 10-person marketing agency reduced proposal turnaround from 7 days to 1â€“2 days with ContractFlow AI.",
  },
};

const results = [
  "Proposal turnaround reduced from 7 days to 1–2 days",
  "Approval clarity improved across 3–4 stakeholders",
  "Scope creep reduced with structured signoff",
  "Close rate lifted by 10–18% in pilot period",
];

export default function MarketingAgencyCaseStudyPage() {
  return (
    <main>
      <Section tone="gradient" className="pt-16">
        <Container>
          <MarketingSectionHeader
            eyebrow="Case study"
            title="How a 10-person agency reduced proposal turnaround to 1–2 days"
            description="A realistic example of how structured proposals, approvals, and secure sharing improve agency win rates."
            align="left"
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <MarketingButton href="/signup">Start free</MarketingButton>
            <MarketingButton href="/proposal-templates" variant="secondary">
              View templates
            </MarketingButton>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <Card className="p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
                Agency background
              </p>
              <p className="mt-3 text-sm text-[var(--muted-foreground)]">
                A 10-person marketing agency serving 18–25 retainer clients across SEO, paid media,
                and content. They needed a consistent proposal workflow that scaled without extra
                ops overhead.
              </p>
            </Card>
            <Card className="p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
                Problem
              </p>
              <p className="mt-3 text-sm text-[var(--muted-foreground)]">
                Proposals lived in scattered docs, approvals happened in email, and scope changes
                slipped through. Client signoff took about a week, delaying revenue and delivery.
              </p>
            </Card>
          </div>
        </Container>
      </Section>

      <Section tone="muted">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
                Before
              </p>
              <ul className="mt-4 space-y-2 text-sm text-[var(--muted-foreground)]">
                <li>Proposal drafts passed around in threads</li>
                <li>Unclear approvals and missing signoff</li>
                <li>Scope creep before kickoff</li>
                <li>Slow turnaround time and inconsistent formatting</li>
              </ul>
            </Card>
            <Card className="p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
                After
              </p>
              <ul className="mt-4 space-y-2 text-sm text-[var(--muted-foreground)]">
                <li>AI-drafted proposals in minutes</li>
                <li>Approval workflow with audit trail</li>
                <li>Structured scope and pricing</li>
                <li>Client-ready PDFs and secure share links</li>
              </ul>
            </Card>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <MarketingSectionHeader
            eyebrow="What changed"
            title="Approvals became a visible, repeatable workflow"
            description="The team standardized proposal sections, routed approvals in one place, and shared client-ready links."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              "Approval steps standardized with role-based signoff",
              "Scope and pricing locked before kickoff",
              "Client-ready proposals delivered in a consistent format",
            ].map((item) => (
              <Card key={item} className="p-5 text-sm font-semibold text-[var(--foreground)]">
                {item}
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <MarketingSectionHeader
            eyebrow="Results"
            title="Measurable outcomes in the first 30 days"
            description="Clear workflow = faster approvals and more confident client decisions."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {results.map((item) => (
              <Card key={item} className="p-5">
                <p className="text-sm font-semibold text-[var(--foreground)]">{item}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <Card className="border-none bg-[linear-gradient(120deg,#eef2ff,#f5f3ff)] p-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted-foreground)]">
              Ready to see it for your agency?
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-[var(--foreground)] md:text-4xl">
              Start your proposal workflow today.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-[var(--muted-foreground)]">
              Use agency-ready templates, track approvals, and close clients faster.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <MarketingButton href="/signup" size="lg">
                Start free
              </MarketingButton>
              <MarketingButton href="/proposal-templates" variant="secondary" size="lg">
                View templates
              </MarketingButton>
            </div>
          </Card>
        </Container>
      </Section>
    </main>
  );
}
