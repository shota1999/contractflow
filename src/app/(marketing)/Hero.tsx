import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

const logos = ["Brightwave", "Signal Studio", "Orbit Creative", "Northwind", "NovaWorks"];

export function Hero() {
  return (
    <Section tone="gradient" className="pt-16">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[var(--surface)] px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-[var(--muted-foreground)]">
              Secure, auditable, agency-ready
            </div>
            <h1 className="mt-6 text-4xl font-semibold leading-tight text-[var(--foreground)] md:text-5xl">
              AI-powered proposal workflows built for marketing agencies.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--muted-foreground)] md:text-lg">
              Draft, approve, and send client-ready proposals in one secure system. Move faster,
              protect margin, and keep every decision auditable.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#4032C8] px-6 text-sm font-semibold !text-white shadow-[var(--shadow-min)] transition hover:bg-[#3528ae]"
              >
                Get started
              </Link>
              <Link
                href="/marketing-agency-proposal-software"
                className="inline-flex h-12 items-center justify-center rounded-full border border-[color:var(--border)] bg-[var(--surface)] px-6 text-sm font-semibold text-[var(--foreground)] shadow-[var(--shadow-min)] transition hover:bg-[var(--surface-2)]"
              >
                See the agency flow
              </Link>
            </div>
            <div className="mt-10 grid gap-3 text-xs text-[var(--muted-foreground)] sm:grid-cols-2">
              {["SOC 2-ready controls", "Audit-ready activity trails"].map((badge) => (
                <div
                  key={badge}
                  className="rounded-full border border-[color:var(--border)] bg-[var(--surface)] px-4 py-2 text-center font-semibold uppercase tracking-[0.22em]"
                >
                  {badge}
                </div>
              ))}
            </div>
            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
                Trusted by modern agency teams
              </p>
              <div className="mt-4 flex flex-wrap gap-3 text-sm font-medium text-[var(--muted-foreground)]">
                {logos.map((logo) => (
                  <span
                    key={logo}
                    className="rounded-full border border-[color:var(--border)] bg-[var(--surface)] px-4 py-2"
                  >
                    {logo}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <Card className="p-6">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
              <span>ContractFlow AI</span>
              <span className="rounded-full bg-[color:var(--success)]/15 px-3 py-1 text-[0.6rem] text-[color:var(--success)]">
                Live Demo
              </span>
            </div>
            <div className="mt-6 space-y-4">
              <div className="rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[var(--surface-2)] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                  Proposal ready
                </p>
                <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                  Growth Retainer Proposal
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                  <span className="rounded-full bg-[color:var(--brand)]/10 px-2 py-1 text-[color:var(--brand)]">
                    AI Draft
                  </span>
                  <span>Scope summary and pricing table attached</span>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { label: "Approval SLA", value: "18 hrs" },
                  { label: "Client signoff", value: "96%" },
                  { label: "Risks flagged", value: "2" },
                  { label: "Stakeholders", value: "5" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[var(--surface)] p-4"
                  >
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                      {item.label}
                    </p>
                    <p className="mt-2 text-xl font-semibold text-[var(--foreground)]">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[var(--surface)] px-4 py-3 text-sm font-semibold text-[var(--foreground)]">
                Secure approvals running - SOC 2-ready controls enabled
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
