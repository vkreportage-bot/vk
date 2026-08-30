import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { StructuredData } from "@/components/structured-data";
import { getArticles } from "@/lib/repository";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Conseils, méthodes et réflexions de VK autour de la réalisation vidéo, du documentaire, du mariage et de l'événementiel.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Journal — VK",
    description:
      "Conseils, méthodes et réflexions autour de la réalisation vidéo et du récit en images.",
    url: "/blog",
    type: "website"
  }
};

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "long",
  year: "numeric"
});

export default async function BlogPage() {
  const articles = await getArticles();

  return (
    <div className="container-vk min-h-screen pb-24 pt-24 md:pb-32 md:pt-32">
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Journal VK",
          description:
            "Articles de VK autour de la réalisation vidéo, du documentaire, du mariage et de l'événementiel.",
          url: `${siteConfig.url}/blog`,
          publisher: {
            "@type": "Organization",
            name: "VK",
            url: siteConfig.url
          },
          blogPost: articles.map((article) => ({
            "@type": "BlogPosting",
            headline: article.title,
            url: `${siteConfig.url}/blog/${article.slug}`,
            datePublished: article.publishedAt?.toISOString()
          }))
        }}
      />

      <header className="border-b border-black/15 pb-10 md:pb-14">
        <p className="eyebrow mb-5">Journal / VK</p>
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <h1 className="section-title md:col-span-8">Notes de tournage, méthode et regard.</h1>
          <p className="max-w-md text-base leading-7 text-(--muted) md:col-span-4 md:justify-self-end md:text-lg md:leading-8">
            Des contenus concrets sur la réalisation vidéo, la narration, le son, le montage et la façon de filmer des moments réels.
          </p>
        </div>
      </header>

      {articles.length === 0 ? (
        <div className="py-20 text-sm text-(--muted)">Aucun article publié pour le moment.</div>
      ) : (
        <section aria-label="Articles" className="grid gap-x-4 gap-y-14 pt-10 sm:grid-cols-2 lg:grid-cols-3 md:pt-14">
          {articles.map((article, index) => (
            <article key={article.id} className={index === 0 ? "sm:col-span-2 lg:col-span-2" : ""}>
              <Link href={`/blog/${article.slug}`} className="group block">
                <div className={`relative overflow-hidden bg-black/5 ${index === 0 ? "aspect-[16/9]" : "aspect-[4/3]"}`}>
                  {article.coverUrl ? (
                    <Image
                      src={article.coverUrl}
                      alt={article.coverAlt || article.title}
                      fill
                      sizes={index === 0 ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
                      className="object-cover transition duration-700 group-hover:scale-[1.025]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[10px] font-semibold uppercase tracking-[0.2em] text-black/25">VK / Journal</div>
                  )}
                </div>

                <div className="mt-5 flex items-start justify-between gap-5 border-t border-black/15 pt-4">
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/40">
                      {article.publishedAt ? dateFormatter.format(article.publishedAt) : "Journal VK"}
                    </p>
                    <h2 className={`${index === 0 ? "text-3xl md:text-4xl" : "text-2xl"} mt-3 font-medium leading-[1.03] tracking-[-0.045em]`}>
                      {article.title}
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-(--muted) md:text-base md:leading-7">
                      {article.excerpt}
                    </p>
                  </div>
                  <ArrowUpRight size={18} className="mt-1 shrink-0 text-black/30 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-black" />
                </div>
              </Link>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
