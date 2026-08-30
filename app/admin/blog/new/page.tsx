import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ArticleForm } from "@/components/admin/article-form";
import { isAdmin } from "@/lib/auth";

export default async function NewArticlePage() {
  if (!(await isAdmin())) redirect("/admin/login");

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-10 border-b border-black/10 pb-8">
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-2 text-sm text-black/40 transition hover:text-black"
        >
          <ArrowLeft size={15} /> Blog
        </Link>
        <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-black/35">Création</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">Nouvel article</h1>
      </header>
      <ArticleForm />
    </div>
  );
}
