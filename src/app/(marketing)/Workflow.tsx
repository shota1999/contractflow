import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

const steps = [
  {
    label: "Brief",
    description: "Capture scope, objectives, and campaign context in one intake.",
  },
  {
    label: "AI Draft",
    description: "Generate a client-ready proposal with brand-safe sections.",
  },
  {
    label: "Team Review",
    description: "Align internal stakeholders, pricing, and delivery timelines.",
  },
  {
    label: "Client Approval",
    description: "Share, review, and track client signoff with audit trails.",
  },
  {
    label: "Sent",
    description: "Deliver execution-ready docs and keep the handoff accountable.",
  },
];

export function Workflow() {
  return (
    <Section id="workflow">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
              Workflow overview
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-[var(--foreground)]">
              A single, secure path from brief to client approval
            </h2>
            <p className="mt-4 text-base text-[var(--muted-foreground)]">
              ContractFlow AI keeps every proposal step connected, measurable, and auditable so
              agencies move faster without losing control.
            </p>
          </div>
          <Card className="relative p-8">
            <span className="absolute left-10 right-10 top-12 h-px bg-[color:var(--border)]" />
            <div className="grid gap-6 md:grid-cols-5">
              {steps.map((step, index) => (
                <div key={step.label} className="relative flex flex-col items-start gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[color:var(--border)] bg-[var(--surface-2)] text-sm font-semibold text-[var(--muted-foreground)]">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--foreground)]">{step.label}</p>
                    <p className="mt-2 text-xs leading-relaxed text-[var(--muted-foreground)]">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
