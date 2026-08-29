import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { isAdmin } from "@/lib/auth";
import { getCategories, getProjects } from "@/lib/repository";

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");

  const [projects, categories] = await Promise.all([
    getProjects({ includeDrafts: true }),
    getCategories()
  ]);

  return (
    <AdminShell>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-black/10 bg-white p-6">
          <p className="text-sm text-black/50">Projets</p>
          <p className="mt-2 text-5xl font-semibold">{projects.length}</p>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white p-6">
          <p className="text-sm text-black/50">Catégories</p>
          <p className="mt-2 text-5xl font-semibold">{categories.length}</p>
        </div>
      </div>
      {!process.env.DATABASE_URL ? (
        <div className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm">
          Le site utilise actuellement les données de démonstration. Configure
          `DATABASE_URL` puis lance les migrations pour activer les écritures admin.
        </div>
      ) : null}
    </AdminShell>
  );
}
