import type { MetadataRoute } from "next";
import { getArticles, getProjects } from "@/lib/repository";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, articles] = await Promise.all([getProjects(), getArticles()]);

  return [
    "",
    "/projects",
    "/blog",
    "/about",
    "/contact",
    ...projects.map((project) => `/projects/${project.slug}`),
    ...articles.map((article) => `/blog/${article.slug}`)
  ].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
    changeFrequency:
      path.startsWith("/projects") || path.startsWith("/blog") ? "weekly" : "monthly",
    priority:
      path === ""
        ? 1
        : path === "/projects" || path === "/blog"
          ? 0.9
          : path.startsWith("/projects/") || path.startsWith("/blog/")
            ? 0.8
            : 0.7
  }));
}
