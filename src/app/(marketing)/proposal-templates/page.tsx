import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FeatureGrid } from "../components/FeatureGrid";
import { LogoRow } from "../components/LogoRow";
import { MarketingButton } from "../components/MarketingButton";
import { MarketingSectionHeader } from "../components/MarketingSectionHeader";
import { agencyTemplates } from "@/lib/seo/agency-templates";

export const metadata: Metadata = {
  title: "Proposal Templates for Marketing Agencies | ContractFlow AI",
  description:
    "Proposal templates built for marketing agencies. Draft faster, protect scope, and close clients with audit-ready approvals.",
  alternates: {
    canonical: "/proposal-templates",
  },
  openGraph: {
    title: "Proposal Templates for Marketing Agencies | ContractFlow AI",
    description:
      "Proposal templates built for marketing agencies. Draft faster, protect scope, and close clients with audit-ready approvals.",
    type: "website",
    url: "/proposal-templates",
  },
  twitter: {
    card: "summary_large_image",
    title: "Proposal Templates for Marketing Agencies | ContractFlow AI",
    description:
      "Proposal templates built for marketing agencies. Draft faster, protect scope, and close clients with audit-ready approvals.",
  },
};

const templates = agencyTemplates.map((template) => ({
  title: template.h1.replace(" (for Marketing Agencies)", ""),
  summary: template.metaDescription,
  href: `/templates/${template.slug}`,
  tags: [template.primaryKeyword, ...template.secondaryKeywords.slice(0, 2)].map((tag) =>
    tag.replace("marketing agency", "agency"),
  ),
}));

const trustSignals = [
  {
    title: "Audit trail",
    description: "Track every approval and change in one secure timeline.",
  },
  {
    title: "Role permissions",
    description: "Control who can edit, approve, and share proposals.",
  },
  {
    title: "Email verification",
    description: "Keep approvals secure and reduce spoofing risk.",
  },
  {
    title: "Secure public sharing",
    description: "Share proposals with tokenized, read-only links.",
  },
];

const trustLogos = ["Brightwave", "Signal Studio", "Northwind", "NovaWorks", "Orbit Creative"];

const faqs = [
  {
    question: "Can I customize every template section?",
    answer:
      "Yes. Templates are fully editable so you can adjust scope, pricing, and language for each client.",
  },
  {
    question: "Do templates include approvals?",
    answer:
      "Yes. Every template uses the same approval workflow so signoff is clear and auditable.",
  },
  {
    question: "Can I import existing agency proposals?",
    answer:
      "Yes. Copy/paste your best sections into the template and reuse them across clients.",
  },
  {
    question: "Will this help reduce scope creep?",
    answer:
      "Clear scope, pricing, and approvals make it easier to keep projects within agreed boundaries.",
  },
  {
    question: "Can I share a secure link with clients?",
    answer:
      "Yes. Send a secure public link or export a PDF for final approvals.",
  },
];

export default function ProposalTemplatesPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Section tone="gradient" className="pt-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted-foreground)]">
                Templates for agencies
              </p>
              <h1 className="mt-4 text-4xl font-semibold text-[var(--foreground)] md:text-5xl">
                Proposal templates built for marketing agencies.
              </h1>
              <p className="mt-5 text-base text-[var(--muted-foreground)] md:text-lg">
                Launch client-ready proposals faster with templates optimized for agency scope,
                pricing, and approvals.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <MarketingButton href="/signup">Start free</MarketingButton>
                <MarketingButton href="/marketing-agency-proposal-software" variant="secondary">
                  See agency workflow
                </MarketingButton>
              </div>
            </div>
            <Card className="p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
                Agency-ready coverage
              </p>
              <div className="mt-5 grid gap-4">
                {[
                  "Retainer proposals",
                  "SEO and performance marketing",
                  "Social media campaigns",
                  "PPC and paid media",
                  "Client approval workflows",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm font-semibold text-[var(--foreground)]"
                  >
                    {item}
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
            eyebrow="Template library"
            title="Launch proposals faster with agency-ready templates"
            description="Choose a template, customize sections, and move directly into approval."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <Card key={template.title} className="flex h-full flex-col gap-4 p-6">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--foreground)]">
                    {template.title}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                    {template.summary}
                  </p>
                </div>
                <div className="mt-auto flex flex-wrap gap-2">
                  {template.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[color:var(--border)] bg-[var(--surface)] px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <MarketingButton href={template.href} variant="secondary" size="sm">
                  View template
                </MarketingButton>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="muted">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <MarketingSectionHeader
                eyebrow="Trust"
                title="Audit-ready proposal templates with secure sharing"
                description="Every template uses audit trails, role permissions, email verification, and secure public sharing."
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
            eyebrow="FAQ"
            title="Questions agencies ask before using templates"
            description="Answers to common questions about proposal templates, approvals, and sharing."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {faqs.map((faq) => (
              <Card key={faq.question} className="p-5">
                <p className="text-sm font-semibold text-[var(--foreground)]">{faq.question}</p>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <Card className="border-none bg-[linear-gradient(120deg,#eef2ff,#f5f3ff)] p-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted-foreground)]">
              Start free
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-[var(--foreground)] md:text-4xl">
              Create your next proposal in minutes.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-[var(--muted-foreground)]">
              Use proven templates, keep approvals on track, and send client-ready proposals faster.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <MarketingButton href="/signup" size="lg">
                Start free
              </MarketingButton>
              <MarketingButton href="/pricing" variant="secondary" size="lg">
                View pricing
              </MarketingButton>
              <MarketingButton
                href="/case-studies/marketing-agency"
                variant="ghost"
                size="lg"
                trackingSource="templates_case_study"
              >
                Read case study
              </MarketingButton>
            </div>
          </Card>
        </Container>
      </Section>
    </main>
  );
}
