import { notFound } from "next/navigation";
import {
  agencyTemplateMap,
  templateSlugs,
} from "@/lib/seo/agency-templates";
import { TemplatePage } from "../TemplatePage";
import type { Metadata } from "next";

type PageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return templateSlugs.map((slug) => ({ slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const template = agencyTemplateMap.get(params.slug);
  if (!template) {
    return {};
  }
  return {
    title: template.pageTitle,
    description: template.metaDescription,
    alternates: {
      canonical: `/templates/${template.slug}`,
    },
    openGraph: {
      title: template.pageTitle,
      description: template.metaDescription,
      type: "article",
      url: `/templates/${template.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: template.pageTitle,
      description: template.metaDescription,
    },
  };
}

export default function TemplateSlugPage({ params }: PageProps) {
  const template = agencyTemplateMap.get(params.slug);
  if (!template) {
    notFound();
  }

  const relatedTemplates = template.relatedSlugs
    .map((slug) => agencyTemplateMap.get(slug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .map((item) => ({
      label: item.h1.replace(" (for Marketing Agencies)", ""),
      href: `/templates/${item.slug}`,
    }));

  return (
    <TemplatePage
      eyebrow={template.primaryKeyword}
      title={template.h1}
      description={template.intro}
      highlights={template.outcomeBullets}
      whenToUse={template.painBullets}
      sectionPreview={template.sectionPreview}
      faqs={template.faq.map((faq) => ({ question: faq.q, answer: faq.a }))}
      relatedTemplates={relatedTemplates}
      ctaLabel="Generate with AI"
      ctaHref="/signup"
    />
  );
}
