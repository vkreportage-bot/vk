import type { Metadata } from "next";
import Link from "next/link";

import { ProjectGrid } from "@/components/project-grid";
import { getCategories, getProjects } from "@/lib/repository";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Projets",
  description: "Découvrez les films et projets vidéo VK par catégorie.",
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;

  const [categories, projects] = await Promise.all([
    getCategories(),
    getProjects({ category: params.category }),
  ]);

  return (
    <div className="container-vk min-h-screen pb-24 pt-36 md:pt-44">
      <header className="mb-12 border-b border-black/15 pb-10 md:mb-16">
        <p className="eyebrow mb-4">Portfolio</p>

        <h1 className="section-title">
          Tous les projets
        </h1>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link
            href="/projects"
            className={cn(
              "border-b pb-1 text-xs font-semibold uppercase tracking-[0.14em] transition",
              !params.category
                ? "border-black text-black"
                : "border-transparent text-black/40 hover:text-black",
            )}
          >
            Tous
          </Link>

          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/projects?category=${category.slug}`}
              className={cn(
                "border-b pb-1 text-xs font-semibold uppercase tracking-[0.14em] transition",
                params.category === category.slug
                  ? "border-black text-black"
                  : "border-transparent text-black/40 hover:text-black",
              )}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </header>

      <ProjectGrid projects={projects} />
    </div>
  );
}