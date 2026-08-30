import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { isAdmin } from "@/lib/auth";
import { getCategories } from "@/lib/repository";

export default async function CategoriesPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-5xl">
      <header className="border-b border-black/10 pb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/35">Organisation</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">Catégories</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-black/45">Classez les projets par univers afin de faciliter la navigation dans le portfolio.</p>
      </header>

      <section className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/35">Nouvelle catégorie</p>
          <form action="/api/admin/categories" method="post" className="mt-5 space-y-5">
            <label className="block"><span className="text-xs font-medium text-black/55">Nom</span><input name="name" required placeholder="Mariages" className="mt-2 w-full border-0 border-b border-black/15 bg-transparent px-0 py-3 text-base outline-none transition placeholder:text-black/20 focus:border-black" /></label>
            <label className="block"><span className="text-xs font-medium text-black/55">Slug</span><input name="slug" required placeholder="mariages" className="mt-2 w-full border-0 border-b border-black/15 bg-transparent px-0 py-3 font-mono text-sm outline-none transition placeholder:text-black/20 focus:border-black" /></label>
            <button className="inline-flex min-h-11 items-center gap-2 rounded-full bg-black px-5 text-sm font-medium text-white transition hover:bg-black/80"><Plus size={16} /> Créer la catégorie</button>
          </form>
        </div>

        <div>
          <div className="flex items-center justify-between border-b border-black/10 pb-4"><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/35">Catégories existantes</p><span className="text-xs text-black/35">{categories.length}</span></div>
          <div className="divide-y divide-black/10">
            {categories.map((category, index) => (
              <div key={category.id} className="grid grid-cols-[36px_minmax(0,1fr)_auto] items-center gap-4 py-5"><span className="text-xs text-black/25">{String(index + 1).padStart(2, "0")}</span><span className="text-base font-medium">{category.name}</span><code className="text-xs text-black/35">/{category.slug}</code></div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
