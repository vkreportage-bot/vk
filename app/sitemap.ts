import type { MetadataRoute } from "next";
import { locationPages } from "@/lib/location-pages";
import { getArticles, getProjects } from "@/lib/repository";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, articles] = await Promise.all([getProjects(), getArticles()]);

  const localPages = locationPages.map(
    (page) => `/photographe-videaste/${page.slug}`,
  );

  return [
    "",
    "/projects",
    "/blog",
    "/about",
    "/contact",
    ...localPages,
    ...projects.map((project) => `/projects/${project.slug}`),
    ...articles.map((article) => `/blog/${article.slug}`),
  ].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
    changeFrequency:
      path.startsWith("/projects") || path.startsWith("/blog")
        ? "weekly"
        : "monthly",
    priority:
      path === ""
        ? 1
        : path === "/projects" || path === "/blog"
          ? 0.9
          : path.startsWith("/photographe-videaste/")
            ? 0.85
            : path.startsWith("/projects/") || path.startsWith("/blog/")
              ? 0.8
              : 0.7,
  }));
}
