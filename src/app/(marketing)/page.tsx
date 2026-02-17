import Link from "next/link";
import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Features } from "./Features";
import { Hero } from "./Hero";
import { Stats } from "./Stats";
import { Workflow } from "./Workflow";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: "AI Proposal Workflow Platform for Marketing Agencies | ContractFlow AI",
  description:
    "AI-powered proposal and contract workflow platform for marketing agencies. Draft faster, approve confidently, and close clients sooner.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "AI Proposal Workflow Platform for Marketing Agencies | ContractFlow AI",
    description:
      "AI-powered proposal and contract workflow platform for marketing agencies. Draft faster, approve confidently, and close clients sooner.",
    url: "/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Proposal Workflow Platform for Marketing Agencies | ContractFlow AI",
    description:
      "AI-powered proposal and contract workflow platform for marketing agencies. Draft faster, approve confidently, and close clients sooner.",
  },
};

const caseStudies = [
  {
    company: "Northwind Creative",
    result: "2.4x faster proposal turnaround",
    quote:
      "We went from scattered docs to one audit-ready workflow our whole agency can trust.",
  },
  {
    company: "Blueleaf Studio",
    result: "38% fewer approval delays",
    quote:
      "Client signoff is now predictable and documented, which keeps our delivery dates intact.",
  },
];

const logos = ["Brightwave", "Signal Studio", "Orbit Creative", "PixelCraft", "NovaWorks"];

export default function MarketingPage() {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "ContractFlow AI",
    description:
      "AI-powered proposal and contract workflow platform for marketing agencies.",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: env.APP_URL,
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <Hero />
      <Features />
      <Workflow />
      <Stats />

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
                Trusted outcomes
              </p>
              <h2 className="mt-4 text-3xl font-semibold text-[var(--foreground)]">
                Trusted by agency teams that value speed and accountability
              </h2>
              <p className="mt-4 text-base text-[var(--muted-foreground)]">
                ContractFlow AI keeps client approvals organized and auditable so your agency can
                scale work without losing control of scope, pricing, or delivery timelines.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm font-medium text-[var(--muted-foreground)]">
                {logos.map((logo) => (
                  <span
                    key={logo}
                    className="rounded-full border border-[color:var(--border)] bg-[var(--surface)] px-4 py-2"
                  >
                    {logo}
                  </span>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/proposal-templates"
                  className="inline-flex h-10 items-center justify-center rounded-full border border-[color:var(--border)] bg-[var(--surface)] px-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--foreground)] transition hover:bg-[var(--surface-2)]"
                >
                  Browse agency templates
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex h-10 items-center justify-center rounded-full border border-[color:var(--border)] bg-[var(--surface)] px-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--foreground)] transition hover:bg-[var(--surface-2)]"
                >
                  See pricing
                </Link>
                <Link
                  href="/case-studies/marketing-agency"
                  className="inline-flex h-10 items-center justify-center rounded-full border border-[color:var(--border)] bg-[var(--surface)] px-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--foreground)] transition hover:bg-[var(--surface-2)]"
                >
                  Read case study
                </Link>
              </div>
            </div>
            <div className="grid gap-6">
              {caseStudies.map((study) => (
                <Card key={study.company} className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
                    {study.company}
                  </p>
                  <p className="mt-3 text-2xl font-semibold text-[var(--foreground)]">
                    {study.result}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-[var(--muted-foreground)]">
                    &ldquo;{study.quote}&rdquo;
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <Card className="border-none bg-[linear-gradient(120deg,#eef2ff,#f5f3ff)] p-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted-foreground)]">
              Ready for agency rollout
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-[var(--foreground)] md:text-4xl">
              Ship client-ready proposals with secure approvals.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-[var(--muted-foreground)]">
              Give your team one trusted system for proposals, approvals, and handoffs that clients
              can sign without delays.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/signup"
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#4032C8] px-8 text-sm font-semibold text-white shadow-[var(--shadow-min)] transition hover:bg-[#3528ae]"
              >
                Get started
              </Link>
              <Link
                href="mailto:sales@contractflow.ai"
                className="inline-flex h-12 items-center justify-center rounded-full border border-[color:var(--border)] bg-[var(--surface)] px-8 text-sm font-semibold text-[var(--foreground)] shadow-[var(--shadow-min)] transition hover:bg-[var(--surface-2)]"
              >
                Book demo
              </Link>
            </div>
          </Card>
        </Container>
      </Section>
    </main>
  );
}
