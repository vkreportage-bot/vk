import type { Article } from "@/types";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type BlogCardProps = {
  article: Article;
};

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "long",
  year: "numeric"
});

export function BlogCard({ article }: BlogCardProps) {
  return (
    <article className="min-w-0">
      <Link
        href={`/blog/${article.slug}`}
        className="group block"
      >
        {/* IMAGE */}
        <div className="relative aspect-square overflow-hidden bg-black/5">
          {article.coverUrl ? (
            <Image
              src={article.coverUrl}
              alt={article.coverAlt || article.title}
              fill
              sizes="
                (min-width: 1280px) 25vw,
                (min-width: 1024px) 33vw,
                (min-width: 640px) 50vw,
                100vw
              "
              className="
                object-cover
                transition-transform
                duration-700
                ease-out
                group-hover:scale-[1.025]
              "
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/25">
                VK / Journal
              </span>
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="mt-4 border-t hairline pt-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-black/40">
                {article.publishedAt
                  ? dateFormatter.format(article.publishedAt)
                  : "Journal VK"}
              </p>

              <h2 className="mt-2 text-lg font-medium leading-[1.08] tracking-[-0.035em] lg:text-xl">
                {article.title}
              </h2>
            </div>

            <ArrowUpRight
              size={16}
              aria-hidden="true"
              className="
                mt-0.5
                shrink-0
                text-black/30
                transition-all
                duration-300
                group-hover:-translate-y-0.5
                group-hover:translate-x-0.5
                group-hover:text-black
              "
            />
          </div>

          {/* {article.excerpt && (
            <p className="mt-3 line-clamp-2 text-xs leading-5 text-[var(--muted)]">
              {article.excerpt}
            </p>
          )} */}
        </div>
      </Link>
    </article>
  );
}