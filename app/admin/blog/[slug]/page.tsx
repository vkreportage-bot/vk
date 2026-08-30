import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ArticleForm } from "@/components/admin/article-form";
import { isAdmin } from "@/lib/auth";
import { getArticleBySlug } from "@/lib/repository";

export default async function EditArticlePage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  if (!(await isAdmin())) redirect("/admin/login");

  const { slug } = await params;
  const article = await getArticleBySlug(slug, true);
  if (!article) notFound();

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-10 border-b border-black/10 pb-8">
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-2 text-sm text-black/40 transition hover:text-black"
        >
          <ArrowLeft size={15} /> Blog
        </Link>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/35">Édition</p>
          <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${article.published ? "bg-black text-white" : "bg-black/5 text-black/45"}`}>
            {article.published ? "Publié" : "Brouillon"}
          </span>
        </div>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">{article.title}</h1>
      </header>
      <ArticleForm article={article} />
    </div>
  );
}
