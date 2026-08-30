import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight, Plus } from "lucide-react";
import { isAdmin } from "@/lib/auth";
import { getProjects } from "@/lib/repository";

export default async function AdminProjectsPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const projects = await getProjects({ includeDrafts: true });

  return (
    <div className="mx-auto max-w-6xl">
      <header className="flex flex-col gap-5 border-b border-black/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/35">Portfolio</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">Projets</h1>
          <p className="mt-3 text-sm text-black/45">{projects.length} projet{projects.length > 1 ? "s" : ""}</p>
        </div>
        <Link href="/admin/projects/new" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-black px-5 text-sm font-medium text-white transition hover:bg-black/80"><Plus size={16} /> Nouveau projet</Link>
      </header>

      {projects.length === 0 ? <div className="py-16 text-sm text-black/40">Aucun projet pour le moment.</div> : (
        <div className="divide-y divide-black/10">
          {projects.map((project, index) => (
            <Link key={project.id} href={`/admin/projects/${project.slug}`} className="group grid gap-5 py-6 transition sm:grid-cols-[92px_minmax(0,1fr)_150px_30px] sm:items-center">
              <div className="relative aspect-square overflow-hidden bg-black/5">
                {project.coverUrl ? <img src={project.coverUrl} alt="" className="h-full w-full object-cover grayscale-[20%] transition duration-500 group-hover:scale-[1.04] group-hover:grayscale-0" /> : null}
                <span className="absolute left-2 top-2 text-[9px] font-semibold tracking-[0.15em] text-white mix-blend-difference">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-lg font-medium tracking-[-0.025em]">{project.title}</h2>
                <p className="mt-2 truncate text-[11px] font-semibold uppercase tracking-[0.14em] text-black/35">{project.categories.length ? project.categories.map((category) => category.name).join(" · ") : "Sans catégorie"}{project.year ? ` · ${project.year}` : ""}</p>
              </div>
              <div className="text-sm sm:text-right"><p className={project.published ? "text-black" : "text-black/35"}>{project.published ? "Publié" : "Brouillon"}</p><p className="mt-1 text-xs text-black/35">{project.media.length} média{project.media.length > 1 ? "s" : ""}</p></div>
              <ArrowUpRight size={17} className="hidden text-black/25 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-black sm:block" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
