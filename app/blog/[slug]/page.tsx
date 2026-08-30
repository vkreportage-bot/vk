import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { BlogContent } from "@/components/blog-content";
import { StructuredData } from "@/components/structured-data";
import { getArticleBySlug } from "@/lib/repository";
import { siteConfig } from "@/lib/site";

type Props = {
  params: Promise<{ slug: string }>;
};

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "long",
  year: "numeric"
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  const title = article.metaTitle || article.title;
  const description = article.metaDescription || article.excerpt;
  const images = article.coverUrl
    ? [{ url: article.coverUrl, alt: article.coverAlt || article.title }]
    : undefined;

  return {
    title: article.metaTitle ? { absolute: article.metaTitle } : article.title,
    description,
    keywords: article.keywords,
    alternates: { canonical: `/blog/${article.slug}` },
    openGraph: {
      type: "article",
      url: `/blog/${article.slug}`,
      title,
      description,
      images,
      publishedTime: article.publishedAt?.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      authors: [article.author]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: article.coverUrl ? [article.coverUrl] : undefined
    }
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const readingTime = Math.max(1, Math.ceil(article.content.trim().split(/\s+/).length / 220));
  const publishedDate = article.publishedAt ?? article.createdAt;

  return (
    <article className="pb-24 md:pb-32">
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: article.title,
          description: article.metaDescription || article.excerpt,
          image: article.coverUrl || undefined,
          datePublished: publishedDate.toISOString(),
          dateModified: article.updatedAt.toISOString(),
          mainEntityOfPage: `${siteConfig.url}/blog/${article.slug}`,
          author: {
            "@type": "Organization",
            name: article.author,
            url: siteConfig.url
          },
          publisher: {
            "@type": "Organization",
            name: "VK",
            url: siteConfig.url
          },
          keywords: article.keywords.join(", ")
        }}
      />

      <header className="container-vk pb-10 pt-24 md:pb-14 md:pt-32">
        <Link
          href="/blog"
          className="mb-10 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-black/45 transition hover:text-black"
        >
          <ArrowLeft size={14} /> Journal
        </Link>

        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-9">
            <p className="eyebrow mb-5">Journal / {article.author}</p>
            <h1 className="max-w-6xl text-[clamp(3.1rem,7.5vw,8.4rem)] font-medium leading-[0.88] tracking-[-0.075em]">
              {article.title}
            </h1>
          </div>

          <div className="md:col-span-3 md:pb-2">
            <p className="text-sm leading-6 text-(--muted)">
              {dateFormatter.format(publishedDate)}
            </p>
            <p className="mt-1 text-sm text-(--muted)">{readingTime} min de lecture</p>
          </div>
        </div>

        <p className="mt-10 max-w-3xl text-xl leading-8 tracking-[-0.02em] text-black/65 md:text-2xl md:leading-9">
          {article.excerpt}
        </p>
      </header>

      {article.coverUrl ? (
        <div className="container-vk">
          <div className="relative aspect-[16/9] overflow-hidden bg-black/5">
            <Image
              src={article.coverUrl}
              alt={article.coverAlt || article.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
          {article.coverAlt ? (
            <p className="mt-3 max-w-2xl text-xs leading-5 text-black/40">{article.coverAlt}</p>
          ) : null}
        </div>
      ) : null}

      <section className="container-vk mt-14 md:mt-20">
        <div className="grid gap-10 border-t border-black/15 pt-10 md:grid-cols-12 md:gap-x-8 md:pt-14">
          <aside className="md:col-span-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40">À retenir</p>
            {article.keywords.length > 0 ? (
              <div className="mt-5 flex flex-wrap gap-2 md:block md:space-y-2">
                {article.keywords.map((keyword) => (
                  <span key={keyword} className="block text-sm text-black/55">{keyword}</span>
                ))}
              </div>
            ) : null}
          </aside>

          <div className="md:col-span-7 md:col-start-5">
            <BlogContent content={article.content} />
          </div>
        </div>
      </section>

      <footer className="container-vk mt-20 md:mt-28">
        <div className="grid gap-8 border-t border-black/15 pt-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="eyebrow mb-4">VK / Réalisation vidéo</p>
            <h2 className="text-[clamp(2.4rem,5vw,5.8rem)] font-medium leading-[0.92] tracking-[-0.06em]">
              Voir les films et projets réalisés.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3 md:col-span-4 md:col-start-9 md:justify-end">
            <Link href="/projects" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-black/20 px-5 text-sm font-medium transition hover:bg-black hover:text-white">
              Voir les projets <ArrowUpRight size={15} />
            </Link>
            <Link href="/contact" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-black px-5 text-sm font-medium text-white transition hover:bg-black/80">
              Parler d’un projet
            </Link>
          </div>
        </div>
      </footer>
    </article>
  );
}
