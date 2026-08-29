import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/repository";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();

  return [
    "",
    "/projects",
    "/about",
    "/contact",
    ...projects.map((project) => `/projects/${project.slug}`)
  ].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
    changeFrequency: path.startsWith("/projects") ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/projects" ? 0.9 : 0.7
  }));
}
