import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { isAdmin } from "@/lib/auth";
import { getProjects } from "@/lib/repository";

export default async function AdminProjectsPage() {
  if (!(await isAdmin())) redirect("/admin/login");

  const projects = await getProjects({ includeDrafts: true });

  return (
    <AdminShell>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-black/50">Contenu</p>
          <h1 className="text-3xl font-semibold tracking-[-0.04em]">Projets</h1>
        </div>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 rounded-lg bg-black px-4 py-3 text-sm font-semibold text-white"
        >
          <Plus size={15} /> Nouveau
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-black/10 bg-white">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/admin/projects/${project.slug}`}
            className="flex items-center justify-between gap-4 border-b border-black/10 px-5 py-4 last:border-0 hover:bg-black/[0.02]"
          >
            <div>
              <p className="font-medium">{project.title}</p>
              <p className="mt-1 text-xs text-black/50">
                {project.categories.map((category) => category.name).join(" · ")}
              </p>
            </div>
            <div className="text-right text-xs text-black/50">
              <p>{project.published ? "Publié" : "Brouillon"}</p>
              <p>{project.media.length} média(s)</p>
            </div>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
