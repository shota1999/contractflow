import type { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { templateSlugs } from "@/lib/seo/agency-templates";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const baseUrl = new URL(env.APP_URL);

  const staticRoutes = [
    "/",
    "/marketing-agency-proposal-software",
    "/pricing",
    "/proposal-templates",
    "/case-studies/marketing-agency",
  ];

  const templateRoutes = templateSlugs.map((slug) => `/templates/${slug}`);

  return [...staticRoutes, ...templateRoutes].map((path) => ({
    url: new URL(path, baseUrl).toString(),
    lastModified: now,
  }));
}
