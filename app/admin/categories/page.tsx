import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { isAdmin } from "@/lib/auth";
import { getCategories } from "@/lib/repository";

export default async function CategoriesPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const categories = await getCategories();

  return (
    <AdminShell>
      <h1 className="text-3xl font-semibold tracking-[-0.04em]">Catégories</h1>

      <form
        action="/api/admin/categories"
        method="post"
        className="mt-6 grid gap-3 rounded-2xl border border-black/10 bg-white p-5 sm:grid-cols-[1fr_1fr_auto]"
      >
        <input
          name="name"
          required
          placeholder="Nom — ex. Mariages"
          className="rounded-lg border border-black/15 px-3 py-3 text-sm"
        />
        <input
          name="slug"
          required
          placeholder="Slug — ex. mariages"
          className="rounded-lg border border-black/15 px-3 py-3 text-sm"
        />
        <button className="rounded-lg bg-black px-4 py-3 text-sm font-semibold text-white">
          Créer
        </button>
      </form>

      <div className="mt-6 overflow-hidden rounded-2xl border border-black/10 bg-white">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-between border-b border-black/10 px-5 py-4 last:border-0"
          >
            <span>{category.name}</span>
            <code className="text-xs text-black/50">{category.slug}</code>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
