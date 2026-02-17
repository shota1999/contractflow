import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

const stats = [
  { label: "Agency proposals sent", value: "3,800+" },
  { label: "Approval time saved", value: "54%" },
  { label: "Client approvals tracked", value: "11k+" },
  { label: "Active agency teams", value: "120+" },
];

export function Stats() {
  return (
    <Section>
      <Container>
        <Card className="px-6 py-10 md:px-10">
          <div className="grid gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
                  {stat.label}
                </p>
                <p className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </Container>
    </Section>
  );
}
