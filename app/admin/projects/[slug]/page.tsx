import { notFound, redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { MediaManager } from "@/components/admin/media-manager";
import { ProjectForm } from "@/components/admin/project-form";
import { isAdmin } from "@/lib/auth";
import { getCategories, getProjectBySlug } from "@/lib/repository";

export default async function EditProjectPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  if (!(await isAdmin())) redirect("/admin/login");

  const { slug } = await params;
  const [project, categories] = await Promise.all([
    getProjectBySlug(slug, true),
    getCategories()
  ]);

  if (!project) notFound();

  return (
    <AdminShell>
      <h1 className="mb-6 text-3xl font-semibold tracking-[-0.04em]">
        {project.title}
      </h1>
      <ProjectForm categories={categories} project={project} />
      <MediaManager projectId={project.id} initialMedia={project.media} />
    </AdminShell>
  );
}
