import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

const features = [
  {
    title: "Agency-ready AI drafting",
    description:
      "Generate polished proposal drafts from your playbooks in minutes, ready for client delivery.",
  },
  {
    title: "Client approvals in one place",
    description:
      "Route reviews, approvals, and client feedback with a clear trail that protects scope and margin.",
  },
  {
    title: "Brand-safe templates",
    description:
      "Keep every proposal on brand with reusable templates and structured sections your team trusts.",
  },
  {
    title: "Lightning-fast handoffs",
    description:
      "Automate the path from draft to approval, so your team ships proposals before the competition.",
  },
];

export function Features() {
  return (
    <Section>
      <Container>
        <div className="flex flex-col gap-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
            Key benefits
          </p>
          <h2 className="text-3xl font-semibold text-[var(--foreground)]">
            Agency-grade proposals, simplified
          </h2>
          <p className="mx-auto max-w-2xl text-base text-[var(--muted-foreground)]">
            Move fast with secure, auditable workflows that keep your agency aligned and client-ready.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card key={feature.title} className="p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--surface-2)] text-sm font-semibold text-[var(--muted-foreground)]">
                {index + 1}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted-foreground)]">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
