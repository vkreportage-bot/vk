import { ProjectCard } from "@/components/project-card";
import type { Project } from "@/types";

export function ProjectGrid({
  projects,
}: {
  projects: Project[];
}) {
  if (!projects.length) {
    return (
      <div className="border-t border-black/15 py-16">
        <p className="text-sm text-black/50">
          Aucun projet dans cette catégorie.
        </p>
      </div>
    );
  }

  return (
    <div
      className="
        grid
        grid-cols-1
        gap-x-4
        gap-y-12
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
        xl:gap-x-5
        xl:gap-y-14
      "
    >
      {projects.map((project, index) => (
        <ProjectCard
          key={project.id}
          project={project}
          index={index}
        />
      ))}
    </div>
  );
}