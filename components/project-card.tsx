import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { Project } from "@/types";

type Props = {
  project: Project;
  index: number;
};

export function ProjectCard({
  project,
  index,
}: Props) {
  const projectNumber = String(index + 1).padStart(2, "0");

  const categories = project.categories
    .map((category) => category.name)
    .join(" · ");

  return (
    <article className="group">
      <Link
        href={`/projects/${project.slug}`}
        className="block"
      >
        {/* IMAGE */}
        <div className="relative aspect-square overflow-hidden bg-neutral-200">
          <Image
            src={project.coverUrl}
            alt={project.title}
            fill
            sizes="
              (min-width: 1280px) 25vw,
              (min-width: 1024px) 33vw,
              (min-width: 640px) 50vw,
              100vw
            "
            className="
              object-cover
              transition-transform
              duration-700
              ease-out
              group-hover:scale-[1.025]
            "
          />

          <div
            className="
              absolute
              inset-0
              bg-black/0
              transition-colors
              duration-500
              group-hover:bg-black/10
            "
          />

          {/* NUMÉRO */}
          <span
            className="
              absolute
              left-3
              top-3
              text-[9px]
              font-semibold
              tracking-[0.18em]
              text-white/75
            "
          >
            {projectNumber}
          </span>

          {/* FLÈCHE */}
          <div
            className="
              absolute
              right-3
              top-3
              flex
              size-9
              translate-y-2
              items-center
              justify-center
              rounded-full
              bg-white
              text-black
              opacity-0
              transition-all
              duration-300
              group-hover:translate-y-0
              group-hover:opacity-100
            "
          >
            <ArrowUpRight size={15} />
          </div>

          {/* INFOS IMAGE */}
          <div
            className="
              absolute
              bottom-3
              left-3
              right-3
              flex
              items-end
              justify-between
              gap-3
            "
          >
            <span
              className="
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.17em]
                text-white/80
              "
            >
              {categories}
            </span>

            {project.year ? (
              <span className="text-[9px] text-white/75">
                {project.year}
              </span>
            ) : null}
          </div>
        </div>

        {/* CONTENU */}
        <div className="border-b border-black/15 pb-4 pt-4">
          <div className="flex items-start justify-between gap-4">
            <h2
              className="
                text-xl
                font-medium
                leading-none
                tracking-[-0.04em]
                transition-opacity
                group-hover:opacity-60
              "
            >
              {project.title}
            </h2>

            <span
              className="
                mt-1
                shrink-0
                text-[9px]
                font-medium
                tracking-[0.14em]
                text-black/35
              "
            >
              {projectNumber}
            </span>
          </div>

          {project.excerpt ? (
            <p
              className="
                mt-3
                line-clamp-2
                text-[13px]
                leading-5
                text-black/45
              "
            >
              {project.excerpt}
            </p>
          ) : null}
        </div>
      </Link>
    </article>
  );
}