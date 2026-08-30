import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ProjectForm } from "@/components/admin/project-form";
import { isAdmin } from "@/lib/auth";
import { getCategories } from "@/lib/repository";

export default async function NewProjectPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-10 border-b border-black/10 pb-8">
        <Link href="/admin/projects" className="inline-flex items-center gap-2 text-sm text-black/40 transition hover:text-black"><ArrowLeft size={15} /> Projets</Link>
        <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-black/35">Création</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">Nouveau projet</h1>
      </header>
      <ProjectForm categories={categories} />
    </div>
  );
}
