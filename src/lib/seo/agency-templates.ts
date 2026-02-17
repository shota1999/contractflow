export type TemplateIntent = "commercial" | "transactional";

export type AgencyTemplateDefinition = {
  slug: string;
  pageTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  intent: TemplateIntent;
  painBullets: string[];
  outcomeBullets: string[];
  sectionPreview: { title: string; bullets: string[] }[];
  faq: { q: string; a: string }[];
  relatedSlugs: string[];
};

export const agencyTemplates: AgencyTemplateDefinition[] = [
  {
    slug: "marketing-proposal-template",
    pageTitle: "Marketing Proposal Template for Agencies | ContractFlow AI",
    metaDescription:
      "Marketing agency proposal template for scope, pricing, and approvals. Draft faster, protect margin, and close more clients with a client-ready proposal.",
    h1: "Marketing Proposal Template (for Marketing Agencies)",
    intro:
      "Use this marketing agency proposal template to present scope, timeline, and pricing with a clear approval workflow. Close more clients with faster turnaround and fewer revisions.",
    primaryKeyword: "marketing agency proposal template",
    secondaryKeywords: ["client proposal", "scope and pricing", "proposal approvals"],
    intent: "transactional",
    painBullets: [
      "Proposals take 7–10 days to finalize.",
      "Scope and pricing change after client feedback.",
      "Approvals happen in email threads with no audit trail.",
    ],
    outcomeBullets: [
      "Faster turnaround from brief to approval.",
      "Clear scope that protects margin.",
      "Client-ready PDF or secure link in one workflow.",
    ],
    sectionPreview: [
      { title: "Client overview", bullets: ["Industry context", "Decision makers"] },
      { title: "Goals and success metrics", bullets: ["Primary outcomes", "KPIs"] },
      { title: "Proposed strategy", bullets: ["Channel mix", "Messaging approach"] },
      { title: "Scope of services", bullets: ["Deliverables", "Inclusions/exclusions"] },
      { title: "Timeline and milestones", bullets: ["Phase breakdown", "Review dates"] },
      { title: "Pricing and payment terms", bullets: ["Fees", "Billing schedule"] },
      { title: "Approval workflow", bullets: ["Review steps", "Signoff roles"] },
      { title: "Next steps", bullets: ["Kickoff checklist", "Start date"] },
    ],
    faq: [
      {
        q: "Can I customize the scope and pricing?",
        a: "Yes. Every section is editable so you can tailor scope, timelines, and pricing for each client.",
      },
      {
        q: "Does the template include approvals?",
        a: "Yes. It includes a built-in approval step so you can track signoff before work begins.",
      },
      {
        q: "Will this help reduce scope creep?",
        a: "Clear deliverables and pricing reduce ambiguity, which helps keep projects within scope.",
      },
      {
        q: "Can I export a PDF for clients?",
        a: "Yes. Export a client-ready PDF or share a secure link for approvals.",
      },
      {
        q: "Is this template designed for agencies?",
        a: "Yes. The copy and sections are built for marketing agency services and delivery workflows.",
      },
    ],
    relatedSlugs: [
      "seo-proposal-template",
      "social-media-proposal-template",
      "retainer-agreement-template",
      "ppc-proposal-template",
    ],
  },
  {
    slug: "seo-proposal-template",
    pageTitle: "SEO Proposal Template for Agencies | ContractFlow AI",
    metaDescription:
      "SEO proposal template for marketing agencies. Define scope, KPIs, and approvals to close SEO clients faster with a client-ready proposal.",
    h1: "SEO Proposal Template (for Marketing Agencies)",
    intro:
      "Use this SEO proposal template to define audits, content scope, KPIs, and reporting so clients approve faster and expectations stay clear.",
    primaryKeyword: "seo proposal template",
    secondaryKeywords: ["marketing agency proposal template", "seo scope", "seo reporting cadence"],
    intent: "transactional",
    painBullets: [
      "SEO proposals fail to show clear KPIs.",
      "Scope and deliverables shift after approval.",
      "Reporting cadence is unclear at kickoff.",
    ],
    outcomeBullets: [
      "KPI-driven proposal that builds client trust.",
      "Clear monthly deliverables for retainers.",
      "Faster approvals with structured signoff.",
    ],
    sectionPreview: [
      { title: "Discovery and audit scope", bullets: ["Technical audit", "Content audit"] },
      { title: "Technical SEO plan", bullets: ["Fixes and priorities", "Timeline"] },
      { title: "Content strategy roadmap", bullets: ["Topics", "Content cadence"] },
      { title: "Authority and link plan", bullets: ["Link targets", "Outreach scope"] },
      { title: "KPIs and reporting", bullets: ["Success metrics", "Reporting cadence"] },
      { title: "Monthly deliverables", bullets: ["Recurring tasks", "SLA expectations"] },
      { title: "Pricing and renewal terms", bullets: ["Fees", "Renewal dates"] },
      { title: "Approval and kickoff", bullets: ["Signoff steps", "Start date"] },
    ],
    faq: [
      {
        q: "Can I tailor KPIs per client?",
        a: "Yes. Customize KPIs and reporting cadence to match each client’s goals.",
      },
      {
        q: "Does this template work for SEO retainers?",
        a: "Yes. It includes monthly deliverables and renewal terms for ongoing work.",
      },
      {
        q: "How do approvals work?",
        a: "The workflow tracks review and approval so you can move into delivery confidently.",
      },
      {
        q: "Can I share a secure link with clients?",
        a: "Yes. Share a client-ready link or export a PDF for final signoff.",
      },
      {
        q: "Is this built for agency teams?",
        a: "Yes. The template is optimized for SEO agencies and client approval workflows.",
      },
    ],
    relatedSlugs: [
      "marketing-proposal-template",
      "social-media-proposal-template",
      "retainer-agreement-template",
      "ppc-proposal-template",
    ],
  },
  {
    slug: "social-media-proposal-template",
    pageTitle: "Social Media Proposal Template for Agencies | ContractFlow AI",
    metaDescription:
      "Social media proposal template for marketing agencies. Define scope, content cadence, approvals, and reporting to close clients faster.",
    h1: "Social Media Proposal Template (for Marketing Agencies)",
    intro:
      "Use this social media proposal template to define platforms, content cadence, approvals, and reporting so clients sign faster.",
    primaryKeyword: "social media proposal template",
    secondaryKeywords: ["content approvals", "agency proposal", "social media scope"],
    intent: "transactional",
    painBullets: [
      "Content approvals drag on without a clear workflow.",
      "Cadence and deliverables are unclear to clients.",
      "Reporting expectations shift after kickoff.",
    ],
    outcomeBullets: [
      "Clear content cadence and approval steps.",
      "Aligned deliverables and reporting cadence.",
      "Professional client-ready proposal format.",
    ],
    sectionPreview: [
      { title: "Platform strategy", bullets: ["Channel focus", "Audience targets"] },
      { title: "Audience and positioning", bullets: ["Voice", "Content pillars"] },
      { title: "Content cadence", bullets: ["Weekly calendar", "Formats"] },
      { title: "Creative production process", bullets: ["Workflow", "Asset approvals"] },
      { title: "Approval workflow", bullets: ["Review steps", "Signoff roles"] },
      { title: "Community management", bullets: ["Engagement", "Escalation"] },
      { title: "Metrics and reporting", bullets: ["KPIs", "Cadence"] },
      { title: "Pricing and terms", bullets: ["Fees", "Timeline"] },
    ],
    faq: [
      {
        q: "Does it include content approvals?",
        a: "Yes. Approval stages are built in so feedback stays structured and fast.",
      },
      {
        q: "Can I add platform-specific deliverables?",
        a: "Yes. Customize deliverables per platform or client goals.",
      },
      {
        q: "Does it support reporting cadence?",
        a: "Yes. Include weekly or monthly reporting sections with KPIs.",
      },
      {
        q: "Can I export to PDF?",
        a: "Yes. Export a client-ready PDF or share a secure link.",
      },
      {
        q: "Is it designed for agencies?",
        a: "Yes. The template focuses on agency workflows and client approvals.",
      },
    ],
    relatedSlugs: [
      "marketing-proposal-template",
      "seo-proposal-template",
      "retainer-agreement-template",
      "ppc-proposal-template",
    ],
  },
  {
    slug: "retainer-agreement-template",
    pageTitle: "Retainer Agreement Template for Agencies | ContractFlow AI",
    metaDescription:
      "Retainer agreement template for marketing agencies. Lock scope, SLAs, pricing, and renewals with clear approvals.",
    h1: "Retainer Agreement Template (for Marketing Agencies)",
    intro:
      "Use this retainer agreement template to lock in scope, SLAs, and pricing so recurring work stays profitable and approvals are clear.",
    primaryKeyword: "retainer agreement template",
    secondaryKeywords: ["marketing agency retainer", "scope control", "renewal terms"],
    intent: "commercial",
    painBullets: [
      "Retainer scope grows without formal signoff.",
      "Renewal terms are unclear to clients.",
      "Service levels are not consistently defined.",
    ],
    outcomeBullets: [
      "Clear scope and deliverables for retained work.",
      "Defined SLAs and approval steps.",
      "Repeatable renewals without rewriting.",
    ],
    sectionPreview: [
      { title: "Service overview", bullets: ["Primary services", "Engagement scope"] },
      { title: "Monthly deliverables", bullets: ["Deliverable list", "Cadence"] },
      { title: "Service levels", bullets: ["Response times", "Priority rules"] },
      { title: "Change request process", bullets: ["Out-of-scope work", "Approval"] },
      { title: "Pricing and payment schedule", bullets: ["Fees", "Billing terms"] },
      { title: "Reporting cadence", bullets: ["Monthly reporting", "KPIs"] },
      { title: "Approval and kickoff", bullets: ["Signoff steps", "Start date"] },
      { title: "Renewal terms", bullets: ["Renewal notice", "Term length"] },
    ],
    faq: [
      {
        q: "Does it include change requests?",
        a: "Yes. A change request process is included to keep additional work billable.",
      },
      {
        q: "Can I customize SLAs?",
        a: "Yes. Define response times and service levels per client engagement.",
      },
      {
        q: "How do approvals work?",
        a: "Approvals are tracked so clients sign off before ongoing work starts.",
      },
      {
        q: "Can I reuse this for renewals?",
        a: "Yes. The structure is designed for repeatable renewals.",
      },
      {
        q: "Is this template agency-ready?",
        a: "Yes. It is tailored to agency retainer workflows and scope control.",
      },
    ],
    relatedSlugs: [
      "marketing-proposal-template",
      "seo-proposal-template",
      "social-media-proposal-template",
      "ppc-proposal-template",
    ],
  },
  {
    slug: "ppc-proposal-template",
    pageTitle: "PPC Proposal Template for Agencies | ContractFlow AI",
    metaDescription:
      "PPC proposal template for marketing agencies. Define budget, ad strategy, KPIs, and approvals to close clients faster.",
    h1: "PPC Proposal Template (for Marketing Agencies)",
    intro:
      "Use this PPC proposal template to outline budget, targeting, and optimization cycles so clients approve campaigns quickly.",
    primaryKeyword: "ppc proposal template",
    secondaryKeywords: ["paid media proposal", "campaign budget", "approval workflow"],
    intent: "transactional",
    painBullets: [
      "Budgets are unclear during approvals.",
      "KPI expectations are missing in proposals.",
      "Campaign approvals take too long.",
    ],
    outcomeBullets: [
      "Clear budget and channel mix upfront.",
      "Approval-ready proposal with KPIs.",
      "Faster launch after signoff.",
    ],
    sectionPreview: [
      { title: "Campaign objectives", bullets: ["Goals", "Target outcomes"] },
      { title: "Channel mix and targeting", bullets: ["Platforms", "Audience"] },
      { title: "Budget allocation", bullets: ["Spend ranges", "Phasing"] },
      { title: "Creative and landing pages", bullets: ["Assets", "Landing plan"] },
      { title: "Optimization cadence", bullets: ["Testing plan", "Review cycle"] },
      { title: "Reporting and KPIs", bullets: ["Metrics", "Cadence"] },
      { title: "Approval workflow", bullets: ["Review steps", "Signoff"] },
      { title: "Timeline and kickoff", bullets: ["Launch plan", "Dependencies"] },
    ],
    faq: [
      {
        q: "Can I customize budget ranges?",
        a: "Yes. Update budget tiers, channel mix, and platform allocations for each client.",
      },
      {
        q: "Does it include KPIs?",
        a: "Yes. Add KPIs and reporting cadence so stakeholders know how success is measured.",
      },
      {
        q: "How does approval work?",
        a: "The workflow records review and approval so campaigns launch with clear signoff.",
      },
      {
        q: "Can I share a secure link?",
        a: "Yes. Share a secure link or export a PDF for final approval.",
      },
      {
        q: "Is it tailored for agencies?",
        a: "Yes. The template is optimized for agency PPC workflows and client approvals.",
      },
    ],
    relatedSlugs: [
      "marketing-proposal-template",
      "seo-proposal-template",
      "social-media-proposal-template",
      "retainer-agreement-template",
    ],
  },
];

export const agencyTemplateMap = new Map(
  agencyTemplates.map((template) => [template.slug, template]),
);

export const templateSlugs = agencyTemplates.map((template) => template.slug);
