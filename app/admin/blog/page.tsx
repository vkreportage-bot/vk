import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight, Plus } from "lucide-react";
import { isAdmin } from "@/lib/auth";
import { getArticles } from "@/lib/repository";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "short",
  year: "numeric"
});

export default async function AdminBlogPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const articles = await getArticles({ includeDrafts: true });

  return (
    <div className="mx-auto max-w-6xl">
      <header className="flex flex-col gap-5 border-b border-black/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/35">Éditorial</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">Blog</h1>
          <p className="mt-3 text-sm text-black/45">
            {articles.length} article{articles.length > 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-black px-5 text-sm font-medium text-white transition hover:bg-black/80"
        >
          <Plus size={16} /> Nouvel article
        </Link>
      </header>

      {articles.length === 0 ? (
        <div className="py-16 text-sm text-black/40">Aucun article pour le moment.</div>
      ) : (
        <div className="divide-y divide-black/10">
          {articles.map((article, index) => (
            <Link
              key={article.id}
              href={`/admin/blog/${article.slug}`}
              className="group grid gap-5 py-6 transition sm:grid-cols-[92px_minmax(0,1fr)_170px_30px] sm:items-center"
            >
              <div className="relative aspect-square overflow-hidden bg-black/5">
                {article.coverUrl ? (
                  <img
                    src={article.coverUrl}
                    alt=""
                    className="h-full w-full object-cover grayscale-[20%] transition duration-500 group-hover:scale-[1.04] group-hover:grayscale-0"
                  />
                ) : null}
                <span className="absolute left-2 top-2 text-[9px] font-semibold tracking-[0.15em] text-white mix-blend-difference">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-lg font-medium tracking-[-0.025em]">
                  {article.title}
                </h2>
                <p className="mt-2 line-clamp-1 text-sm text-black/40">{article.excerpt}</p>
              </div>

              <div className="text-sm sm:text-right">
                <p className={article.published ? "text-black" : "text-black/35"}>
                  {article.published ? "Publié" : "Brouillon"}
                </p>
                <p className="mt-1 text-xs text-black/35">
                  {article.publishedAt
                    ? dateFormatter.format(article.publishedAt)
                    : "Sans date"}
                </p>
              </div>

              <ArrowUpRight
                size={17}
                className="hidden text-black/25 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-black sm:block"
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
