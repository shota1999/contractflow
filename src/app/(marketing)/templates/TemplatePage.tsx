import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FeatureGrid } from "../components/FeatureGrid";
import { LogoRow } from "../components/LogoRow";
import { MarketingButton } from "../components/MarketingButton";
import { MarketingSectionHeader } from "../components/MarketingSectionHeader";

type TemplatePageProps = {
  eyebrow: string;
  title: string;
  description: string;
  highlights: string[];
  whenToUse: string[];
  sectionPreview: { title: string; bullets: string[] }[];
  faqs: { question: string; answer: string }[];
  relatedTemplates: { label: string; href: string }[];
  ctaLabel?: string;
  ctaHref?: string;
};

const trustSignals = [
  {
    title: "Audit trail",
    description: "Track every edit and approval for full accountability.",
  },
  {
    title: "Role permissions",
    description: "Control who can edit, approve, and share proposals.",
  },
  {
    title: "Email verification",
    description: "Keep approvals secure and prevent spoofing risk.",
  },
  {
    title: "Secure public sharing",
    description: "Share client-ready proposals with tokenized public links.",
  },
];

const trustLogos = ["Brightwave", "Signal Studio", "Northwind", "NovaWorks", "Orbit Creative"];

export function TemplatePage({
  eyebrow,
  title,
  description,
  highlights,
  whenToUse,
  sectionPreview,
  faqs,
  relatedTemplates,
  ctaLabel = "Generate with AI",
  ctaHref = "/signup",
}: TemplatePageProps) {
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
                {eyebrow}
              </p>
              <h1 className="mt-4 text-4xl font-semibold text-[var(--foreground)] md:text-5xl">
                {title}
              </h1>
              <p className="mt-5 text-base text-[var(--muted-foreground)] md:text-lg">
                {description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <MarketingButton href={ctaHref}>{ctaLabel}</MarketingButton>
                <MarketingButton href="/proposal-templates" variant="secondary">
                  View all templates
                </MarketingButton>
              </div>
              <div className="mt-10 grid gap-3 text-xs text-[var(--muted-foreground)] sm:grid-cols-2">
                {highlights.map((highlight) => (
                  <div
                    key={highlight}
                    className="rounded-full border border-[color:var(--border)] bg-[var(--surface)] px-4 py-2 text-center font-semibold uppercase tracking-[0.22em]"
                  >
                    {highlight}
                  </div>
                ))}
              </div>
            </div>
            <Card className="p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
                What&apos;s inside
              </p>
              <div className="mt-4 grid gap-3">
                {sectionPreview.map((section) => (
                  <div
                    key={section.title}
                    className="rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[var(--surface-2)] px-4 py-3"
                  >
                    <p className="text-sm font-semibold text-[var(--foreground)]">
                      {section.title}
                    </p>
                    <ul className="mt-2 space-y-1 text-xs text-[var(--muted-foreground)]">
                      {section.bullets.map((bullet) => (
                        <li key={bullet}>• {bullet}</li>
                      ))}
                    </ul>
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
            eyebrow="When to use"
            title="Use this template when you need a faster client signoff."
            description="Designed for agency teams that need to move from brief to approved proposal without losing control of scope."
          />
          <div className="mt-10 grid gap-3 md:grid-cols-2">
            {whenToUse.map((item) => (
              <Card key={item} className="p-5">
                <p className="text-sm font-semibold text-[var(--foreground)]">{item}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="muted">
        <Container>
          <MarketingSectionHeader
            eyebrow="How it works"
            title="Brief → AI Draft → Review → Approved → Send"
            description="Follow a consistent workflow so every proposal moves faster and stays client-ready."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-5">
            {["Brief", "AI Draft", "Review", "Approved", "Send"].map((step, index) => (
              <Card key={step} className="p-5 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--border)] bg-[var(--surface-2)] text-sm font-semibold text-[var(--muted-foreground)]">
                  {index + 1}
                </div>
                <p className="mt-3 text-sm font-semibold text-[var(--foreground)]">{step}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <MarketingSectionHeader
            eyebrow="How agencies use this"
            title="A simple 3-step proposal flow for agency teams"
            description="Keep proposals consistent, approvals clear, and client signoff fast."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              "Start from the template and personalize scope.",
              "Route review to your internal approver.",
              "Send the client-ready proposal for signoff.",
            ].map((step) => (
              <Card key={step} className="p-5 text-sm font-semibold text-[var(--foreground)]">
                {step}
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
                title="Agency-grade security with client-ready controls"
                description="Audit trails, permissions, email verification, and secure sharing keep approvals locked down."
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
            title="Questions agencies ask before sending proposals"
            description="Everything you need to know before using this template."
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
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[var(--surface)] px-6 py-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted-foreground)]">
                Related templates
              </p>
              <div className="mt-2 flex flex-wrap gap-3 text-sm font-semibold text-[var(--foreground)]">
                {relatedTemplates.map((template) => (
                  <a
                    key={template.href}
                    href={template.href}
                    className="rounded-full border border-[color:var(--border)] bg-[var(--surface-2)] px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  >
                    {template.label}
                  </a>
                ))}
              </div>
            </div>
            <MarketingButton href="/marketing-agency-proposal-software" variant="secondary">
              See agency workflow
            </MarketingButton>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <Card className="border-none bg-[linear-gradient(120deg,#eef2ff,#f5f3ff)] p-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted-foreground)]">
              Ready to ship
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-[var(--foreground)] md:text-4xl">
              Generate a client-ready proposal in minutes.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-[var(--muted-foreground)]">
              Use this template to close faster, keep approvals on track, and protect your scope.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <MarketingButton href={ctaHref} size="lg">
                {ctaLabel}
              </MarketingButton>
              <MarketingButton href="/proposal-templates" variant="secondary" size="lg">
                View all templates
              </MarketingButton>
            </div>
          </Card>
        </Container>
      </Section>
    </main>
  );
}
