import Link from "next/link";
import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { MarketingButton } from "../components/MarketingButton";

export const metadata: Metadata = {
  title: "Pricing for Marketing Agencies | ContractFlow AI",
  description:
    "Simple pricing built for marketing agencies. Launch proposals faster, keep approvals on track, and grow with confidence.",
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    title: "Pricing for Marketing Agencies | ContractFlow AI",
    description:
      "Simple pricing built for marketing agencies. Launch proposals faster, keep approvals on track, and grow with confidence.",
    url: "/pricing",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing for Marketing Agencies | ContractFlow AI",
    description:
      "Simple pricing built for marketing agencies. Launch proposals faster, keep approvals on track, and grow with confidence.",
  },
};

const plans = [
  {
    name: "Starter",
    price: "Free",
    note: "per seat / month",
    description: "For freelancers or very small agencies validating their offer.",
    features: [
      "Up to 3 active proposals",
      "Agency templates",
      "Approval workflow (Draft -> Review -> Approved)",
      "Public sharing links",
      "Audit log",
    ],
    cta: { label: "Get started", href: "/signup" },
  },
  {
    name: "Pro",
    price: "$29",
    note: "per seat / month",
    description: "For small agencies sending proposals weekly.",
    features: [
      "Unlimited proposals",
      "Team approvals and roles",
      "Draft job monitoring + retries",
      "PDF export and sharing",
      "Priority onboarding",
      "Everything in Free",
    ],
    cta: { label: "Start Pro", href: "/signup" },
    highlight: true,
  },
  {
    name: "Agency",
    price: "$79",
    note: "per seat / month",
    description: "For growing agencies needing governance and approvals.",
    features: [
      "Everything in Pro",
      "Advanced roles & permissions",
      "Audit-ready activity feed",
      "Agency templates library",
      "Dedicated onboarding",
    ],
    cta: { label: "Choose Agency", href: "/signup" },
  },
];

const faqs = [
  {
    question: "Can I try it with one client first?",
    answer:
      "Yes. Start with one client workflow and expand when your team is ready. No rework needed.",
  },
  {
    question: "Do you offer agency onboarding help?",
    answer:
      "Pro and Agency plans include onboarding so your templates and approvals are live quickly.",
  },
  {
    question: "Is this built for marketing agencies only?",
    answer:
      "Yes, the platform is designed around proposal, approval, and scope workflows for agencies.",
  },
  {
    question: "Can I upgrade later?",
    answer:
      "Yes. Start on Free, then upgrade to Pro or Agency as your volume grows.",
  },
  {
    question: "Do clients need a login to review proposals?",
    answer:
      "No. You can send secure public links or PDFs for client approvals.",
  },
];

const objections = [
  {
    question: "Do clients need an account?",
    answer: "No. Share a secure link or PDF for client review and approval.",
  },
  {
    question: "Can I export proposals as PDFs?",
    answer: "Yes. Export a client-ready PDF at any time.",
  },
  {
    question: "Can my team approve before sending?",
    answer: "Yes. Use the built-in approval workflow for internal signoff.",
  },
  {
    question: "Will this help reduce scope creep?",
    answer: "Yes. Clear scope, pricing, and approvals protect margin.",
  },
];

const comparison = [
  {
    feature: "Active proposals",
    starter: "Up to 3",
    pro: "Unlimited",
    agency: "Unlimited",
  },
  {
    feature: "Agency templates",
    starter: "Included",
    pro: "Included",
    agency: "Included",
  },
  {
    feature: "Approval workflow",
    starter: "Included",
    pro: "Included",
    agency: "Included",
  },
  {
    feature: "Audit log",
    starter: "Basic",
    pro: "Full",
    agency: "Full",
  },
  {
    feature: "Role permissions",
    starter: "Standard",
    pro: "Advanced",
    agency: "Advanced",
  },
  {
    feature: "Support",
    starter: "Email",
    pro: "Priority",
    agency: "Dedicated onboarding",
  },
];

export default function PricingPage() {
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
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted-foreground)]">
              Pricing
            </p>
            <h1 className="mt-4 text-4xl font-semibold text-[var(--foreground)] md:text-5xl">
              Simple pricing for marketing agencies
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base text-[var(--muted-foreground)] md:text-lg">
              Start free and upgrade as you scale. Every plan includes proposal templates, approvals,
              audit trails, and secure sharing.
            </p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`flex h-full flex-col p-6 ${
                  plan.highlight ? "border-[color:var(--brand)]/40 shadow-[var(--shadow-soft)]" : ""
                }`}
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
                    {plan.name}
                  </p>
                  {plan.highlight ? (
                    <span className="mt-3 inline-flex items-center rounded-full bg-[color:var(--brand)]/10 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-[color:var(--brand)]">
                      Most popular
                    </span>
                  ) : null}
                  <div className="mt-4 flex items-end gap-2">
                    <span className="text-3xl font-semibold text-[var(--foreground)]">
                      {plan.price}
                    </span>
                    <span className="text-xs text-[var(--muted-foreground)]">{plan.note}</span>
                  </div>
                  <p className="mt-3 text-sm text-[var(--muted-foreground)]">{plan.description}</p>
                </div>
                <ul className="mt-5 flex flex-1 flex-col gap-2 text-sm text-[var(--muted-foreground)]">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[color:var(--brand)]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.cta.href}
                  className={`mt-6 inline-flex h-11 items-center justify-center rounded-full px-4 text-sm font-semibold transition ${
                    plan.highlight
                      ? "bg-[#4032C8] text-white hover:bg-[#3528ae]"
                      : "border border-[color:var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--surface-2)]"
                  }`}
                >
                  {plan.cta.label}
                </Link>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="muted">
        <Container>
          <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[var(--surface)]">
            <div className="border-b border-[color:var(--border)] px-6 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
                Plan comparison
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
                Choose the plan that matches your agency pace
              </h2>
            </div>
            <div className="grid gap-0">
              <div className="grid grid-cols-4 border-b border-[color:var(--border)] bg-[var(--surface-2)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                <span>Feature</span>
                <span>Free</span>
                <span>Pro</span>
                <span>Agency</span>
              </div>
              {comparison.map((row) => (
                <div
                  key={row.feature}
                  className="grid grid-cols-4 border-b border-[color:var(--border)] px-6 py-3 text-sm text-[var(--foreground)] last:border-b-0"
                >
                  <span className="font-semibold">{row.feature}</span>
                  <span className="text-[var(--muted-foreground)]">{row.starter}</span>
                  <span className="text-[var(--muted-foreground)]">{row.pro}</span>
                  <span className="text-[var(--muted-foreground)]">{row.agency}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-6 md:grid-cols-4">
            {[
              "Faster proposal turnaround",
              "Reduced scope creep",
              "Clear team approvals",
              "Client-ready presentation",
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
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted-foreground)]">
                Objection handling
              </p>
              <h2 className="mt-4 text-3xl font-semibold text-[var(--foreground)]">
                Answers agencies need before they commit
              </h2>
              <p className="mt-4 text-base text-[var(--muted-foreground)]">
                Short, confident answers to the most common agency questions.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/marketing-agency-proposal-software"
                  className="inline-flex h-10 items-center justify-center rounded-full border border-[color:var(--border)] bg-[var(--surface)] px-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--foreground)] transition hover:bg-[var(--surface-2)]"
                >
                  See the workflow
                </Link>
                <Link
                  href="/proposal-templates"
                  className="inline-flex h-10 items-center justify-center rounded-full border border-[color:var(--border)] bg-[var(--surface)] px-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--foreground)] transition hover:bg-[var(--surface-2)]"
                >
                  View templates
                </Link>
              </div>
            </div>
            <div className="grid gap-4">
              {objections.map((item) => (
                <Card key={item.question} className="p-5">
                  <p className="text-sm font-semibold text-[var(--foreground)]">{item.question}</p>
                  <p className="mt-2 text-sm text-[var(--muted-foreground)]">{item.answer}</p>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="muted">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted-foreground)]">
                Agency trust
              </p>
              <h2 className="mt-4 text-3xl font-semibold text-[var(--foreground)]">
                Built to support approvals, audit trails, and client confidence
              </h2>
              <p className="mt-4 text-base text-[var(--muted-foreground)]">
                Every plan includes role-based access, verified workflows, and activity history so
                you can keep client approvals secure and transparent.
              </p>
            </div>
            <Card className="p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
                FAQ
              </p>
              <div className="mt-4 grid gap-4">
                {faqs.map((faq) => (
                  <div key={faq.question}>
                    <p className="text-sm font-semibold text-[var(--foreground)]">
                      {faq.question}
                    </p>
                    <p className="mt-2 text-sm text-[var(--muted-foreground)]">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <Card className="border-none bg-[linear-gradient(120deg,#eef2ff,#f5f3ff)] p-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted-foreground)]">
              Next steps
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-[var(--foreground)] md:text-4xl">
              Explore templates and see real agency results.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-[var(--muted-foreground)]">
              Choose a template, map approvals, and follow the path from pricing to closed deals.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <MarketingButton href="/proposal-templates" size="lg" trackingSource="pricing_templates">
                Browse templates
              </MarketingButton>
              <MarketingButton
                href="/case-studies/marketing-agency"
                variant="secondary"
                size="lg"
                trackingSource="pricing_case_study"
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
