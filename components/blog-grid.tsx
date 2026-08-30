import type { Article } from "@/types";

import { BlogCard } from "./blog-card";

type BlogGridProps = {
  articles: Article[];
};

export function BlogGrid({ articles }: BlogGridProps) {
  if (articles.length === 0) {
    return (
      <p className="py-20 text-sm text-[var(--muted)]">
        Aucun article publié pour le moment.
      </p>
    );
  }

  return (
    <section
      aria-label="Articles du journal"
      className="
        grid
        gap-x-5
        gap-y-14
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
      "
    >
      {articles.map((article) => (
        <BlogCard
          key={article.id}
          article={article}
        />
      ))}
    </section>
  );
}