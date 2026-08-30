import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { MediaManager } from "@/components/admin/media-manager";
import { ProjectForm } from "@/components/admin/project-form";
import { isAdmin } from "@/lib/auth";
import { getCategories, getProjectBySlug } from "@/lib/repository";

export default async function EditProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { slug } = await params;
  const [project, categories] = await Promise.all([getProjectBySlug(slug, true), getCategories()]);
  if (!project) notFound();

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-10 border-b border-black/10 pb-8">
        <Link href="/admin/projects" className="inline-flex items-center gap-2 text-sm text-black/40 transition hover:text-black"><ArrowLeft size={15} /> Projets</Link>
        <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-black/35">Modifier le projet</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">{project.title}</h1>
        <p className="mt-3 text-sm text-black/40">{project.published ? "Publié" : "Brouillon"} · {project.media.length} média{project.media.length > 1 ? "s" : ""}</p>
      </header>
      <div className="space-y-12"><ProjectForm categories={categories} project={project} /><div className="border-t border-black/10 pt-10"><MediaManager projectId={project.id} initialMedia={project.media} /></div></div>
    </div>
  );
}
