import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { ProjectForm } from "@/components/admin/project-form";
import { isAdmin } from "@/lib/auth";
import { getCategories } from "@/lib/repository";

export default async function NewProjectPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const categories = await getCategories();

  return (
    <AdminShell>
      <h1 className="mb-6 text-3xl font-semibold tracking-[-0.04em]">
        Nouveau projet
      </h1>
      <ProjectForm categories={categories} />
    </AdminShell>
  );
}
