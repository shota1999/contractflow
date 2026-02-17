import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FeatureGrid } from "../components/FeatureGrid";
import { LogoRow } from "../components/LogoRow";
import { MarketingButton } from "../components/MarketingButton";
import { MarketingSectionHeader } from "../components/MarketingSectionHeader";
import { StickyCtaBar } from "../components/StickyCtaBar";
import { ExitIntentModal } from "../components/ExitIntentModal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marketing Agency Proposal Software | ContractFlow AI",
  description:
    "AI-powered proposal and contract workflow software built for marketing agencies. Draft faster, approve confidently, and close clients sooner.",
  alternates: {
    canonical: "/marketing-agency-proposal-software",
  },
  openGraph: {
    title: "Marketing Agency Proposal Software | ContractFlow AI",
    description:
      "AI-powered proposal and contract workflow software built for marketing agencies. Draft faster, approve confidently, and close clients sooner.",
    url: "/marketing-agency-proposal-software",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Marketing Agency Proposal Software | ContractFlow AI",
    description:
      "AI-powered proposal and contract workflow software built for marketing agencies. Draft faster, approve confidently, and close clients sooner.",
  },
};

const pains = [
  {
    title: "7–10 day proposal turnaround",
    description:
      "Slow approvals and endless edits delay responses and cost you client momentum.",
  },
  {
    title: "Lost deals from messy docs",
    description:
      "Scattered files and unclear scope create friction right when clients are ready to sign.",
  },
  {
    title: "Scope creep before kickoff",
    description:
      "Without consistent templates and approvals, teams start work without firm signoff.",
  },
];

const solutions = [
  {
    title: "AI draft built for agencies",
    description:
      "Generate client-ready proposals in minutes using agency templates and structured sections.",
  },
  {
    title: "Approval workflow that closes",
    description:
      "Move from draft to review to approved with clear roles, permissions, and status tracking.",
  },
  {
    title: "PDF export + secure sharing",
    description:
      "Send polished PDFs and secure public links without losing control of the final version.",
  },
];

const trustSignals = [
  {
    title: "Audit trail on every decision",
    description: "Track who changed what and when for full client accountability.",
  },
  {
    title: "Role permissions built in",
    description: "Control who can edit, approve, and share proposals by role.",
  },
  {
    title: "Verified email approvals",
    description: "Reduce spoofing risk and keep client approvals secure.",
  },
  {
    title: "Secure public sharing",
    description: "Share client-ready proposals with tokenized public links.",
  },
];

const trustLogos = ["Brightwave", "Signal Studio", "Northwind", "NovaWorks", "Orbit Creative"];

const testimonials = [
  {
    quote:
      "We cut our proposal turnaround time from 9 days to 2. Clients sign faster because the workflow is clear.",
    name: "Avery Stone",
    title: "Agency Owner, Brightwave",
  },
  {
    quote:
      "Every approval is tracked, which keeps our team aligned and protects scope before kickoff.",
    name: "Maya Patel",
    title: "Client Services Lead, NovaWorks",
  },
  {
    quote:
      "The templates keep our proposals on brand, and the audit trail helps us avoid disputes.",
    name: "James Lin",
    title: "Ops Director, Signal Studio",
  },
];

export default function MarketingAgencyProposalSoftwarePage() {
  return (
    <main className="pb-24">
      <ExitIntentModal />
      <Section tone="gradient" className="pt-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted-foreground)]">
                Marketing agency proposal software
              </p>
              <h1 className="mt-4 text-4xl font-semibold text-[var(--foreground)] md:text-5xl">
                Close more agency clients with faster proposal turnaround.
              </h1>
              <p className="mt-5 text-base text-[var(--muted-foreground)] md:text-lg">
                ContractFlow AI helps marketing agencies draft, approve, and send client-ready
                proposals in one secure workflow. Respond faster, protect margin, and win more work.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <MarketingButton href="/signup" trackingSource="agency_hero_primary">
                  Start free
                </MarketingButton>
                <MarketingButton
                  href="/proposal-templates"
                  variant="secondary"
                  trackingSource="agency_hero_secondary"
                >
                  View templates
                </MarketingButton>
              </div>
            </div>
            <Card className="p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
                Workflow snapshot
              </p>
              <div className="mt-5 grid gap-4">
                {["Brief", "AI Draft", "Review", "Approved", "Sent"].map((step, index) => (
                  <div key={step} className="flex items-center gap-3 text-sm">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[color:var(--border)] bg-[var(--surface-2)] text-xs font-semibold text-[var(--muted-foreground)]">
                      {index + 1}
                    </span>
                    <span className="font-semibold text-[var(--foreground)]">{step}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <MarketingSectionHeader
            eyebrow="See the workflow in action"
            title="A proposal workflow agencies can trust at a glance."
            description="Preview how your team moves from brief to approved proposal with clear visibility and no client confusion."
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
                  Proposal pipeline
                </p>
                <span className="rounded-full border border-[color:var(--border)] bg-[var(--surface-2)] px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                  This week
                </span>
              </div>
              <div className="mt-5 grid gap-3">
                {[
                  { title: "Growth Retainer", client: "NovaWorks", status: "Review" },
                  { title: "SEO Optimization Plan", client: "Northwind", status: "Approved" },
                  { title: "Social Launch", client: "Signal Studio", status: "Draft" },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-center justify-between rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm"
                  >
                    <div>
                      <p className="font-semibold text-[var(--foreground)]">{item.title}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">{item.client}</p>
                    </div>
                    <span className="rounded-full border border-[color:var(--border)] bg-[var(--surface)] px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid gap-6">
              <Card className="p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
                  Client-ready preview
                </p>
                <div className="mt-4 rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[var(--surface-2)] p-4">
                  <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
                    <span>Proposal PDF</span>
                    <span>v3</span>
                  </div>
                  <div className="mt-3 space-y-3">
                    <div className="h-3 w-3/4 rounded-full bg-[var(--surface)]" />
                    <div className="h-3 w-5/6 rounded-full bg-[var(--surface)]" />
                    <div className="h-3 w-2/3 rounded-full bg-[var(--surface)]" />
                    <div className="h-24 rounded-[var(--radius-md)] border border-dashed border-[color:var(--border)] bg-white" />
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
                  Approval timeline
                </p>
                <div className="mt-4 grid gap-3">
                  {["Draft", "Review", "Approved", "Sent"].map((step, index) => (
                    <div key={step} className="flex items-center gap-3 text-sm">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[color:var(--border)] bg-[var(--surface-2)] text-xs font-semibold text-[var(--muted-foreground)]">
                        {index + 1}
                      </span>
                      <span className="font-semibold text-[var(--foreground)]">{step}</span>
                      <span className="text-xs text-[var(--muted-foreground)]">
                        {index === 0
                          ? "Created"
                          : index === 1
                            ? "Waiting on review"
                            : index === 2
                              ? "Signed off"
                              : "Delivered"}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <MarketingSectionHeader
            eyebrow="Pain"
            title="Proposal bottlenecks cost agencies revenue"
            description="Slow approvals and messy documents cause delays, lost deals, and scope creep before kickoff."
          />
          <div className="mt-10">
            <FeatureGrid items={pains} columns={3} />
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <Card className="border-none bg-[linear-gradient(120deg,#eef2ff,#f5f3ff)] p-8 md:p-10">
            <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted-foreground)]">
                  Start today
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
                  Turn every proposal into a clear approval path.
                </h3>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                  Agencies that standardize proposals close faster and protect margin.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <MarketingButton href="/signup" trackingSource="agency_mid_primary">
                  Start free
                </MarketingButton>
                <MarketingButton
                  href="/proposal-templates"
                  variant="secondary"
                  trackingSource="agency_mid_secondary"
                >
                  View templates
                </MarketingButton>
              </div>
            </div>
          </Card>
        </Container>
      </Section>

      <Section tone="muted">
        <Container>
          <MarketingSectionHeader
            eyebrow="Speed and control"
            title="AI drafting with structured approvals built for agencies"
            description="Turn briefs into client-ready proposals, route approvals, and share final PDFs without chasing stakeholders."
          />
          <div className="mt-10">
            <FeatureGrid items={solutions} columns={3} />
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <MarketingSectionHeader
            eyebrow="ROI"
            title="Agencies close faster with structured proposals"
            description="Clear scope, approvals, and client-ready PDFs help you win more work."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              "Faster proposal turnaround",
              "Reduced scope creep",
              "Clear approvals for teams",
              "Professional presentation",
            ].map((item) => (
              <Card key={item} className="p-5 text-center">
                <p className="text-sm font-semibold text-[var(--foreground)]">{item}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <MarketingSectionHeader
                eyebrow="Trust"
                title="Secure, auditable, and built for agency accountability"
                description="Audit trails, role permissions, verified email, and secure public sharing keep every proposal professional and client-ready."
                align="left"
              />
              <div className="mt-6">
                <LogoRow logos={trustLogos} />
              </div>
            </div>
            <div className="grid gap-4">
              <FeatureGrid items={trustSignals} columns={1} />
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <MarketingSectionHeader
            eyebrow="Agency proof"
            title="Agency teams close faster with a clear proposal workflow"
            description="Replace scattered docs with a single proposal system that clients can trust."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="p-6">
                <p className="text-sm text-[var(--muted-foreground)]">
                  “{testimonial.quote}”
                </p>
                <div className="mt-4 text-sm font-semibold text-[var(--foreground)]">
                  {testimonial.name}
                </div>
                <div className="text-xs text-[var(--muted-foreground)]">{testimonial.title}</div>
              </Card>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <MarketingButton
              href="/case-studies/marketing-agency"
              variant="secondary"
              trackingSource="agency_case_study"
            >
              Read the case study
            </MarketingButton>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <Card className="border-none bg-[linear-gradient(120deg,#eef2ff,#f5f3ff)] p-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted-foreground)]">
              Start this week
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-[var(--foreground)] md:text-4xl">
              Ship your next proposal in hours, not days.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-[var(--muted-foreground)]">
              Get your agency on a single proposal workflow today and close faster with clear
              approvals and client-ready deliverables.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <MarketingButton href="/signup" size="lg" trackingSource="agency_footer_primary">
                Start free
              </MarketingButton>
              <MarketingButton
                href="/proposal-templates"
                variant="secondary"
                size="lg"
                trackingSource="agency_footer_secondary"
              >
                View templates
              </MarketingButton>
            </div>
          </Card>
        </Container>
      </Section>
      <StickyCtaBar />
    </main>
  );
}
