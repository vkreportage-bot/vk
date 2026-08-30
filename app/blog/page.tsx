import type { Metadata } from "next";

import { BlogGrid } from "@/components/blog-grid";
import { StructuredData } from "@/components/structured-data";
import { getArticles } from "@/lib/repository";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Conseils, méthodes et réflexions de VK autour de la réalisation vidéo, du documentaire, du mariage et de l'événementiel.",
  alternates: {
    canonical: "/blog"
  },
  openGraph: {
    title: "Journal — VK",
    description:
      "Conseils, méthodes et réflexions autour de la réalisation vidéo et du récit en images.",
    url: "/blog",
    type: "website"
  }
};

export default async function BlogPage() {
  const articles = await getArticles();

  return (
    <div className="container-vk min-h-screen pb-24 pt-36 md:pb-32 md:pt-44">
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
            description: article.excerpt,
            url: `${siteConfig.url}/blog/${article.slug}`,
            datePublished: article.publishedAt?.toISOString(),
            image: article.coverUrl || undefined
          }))
        }}
      />

      <header className="mb-14  pb-8 md:mb-20 md:pb-10">
        <p className="eyebrow mb-5">
          Journal / VK
        </p>

        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <h1 className="section-title md:col-span-8">
            Notes de tournage,
            <br />
            méthode et regard.
          </h1>

          <p className="max-w-md text-base leading-7 text-[var(--muted)] md:col-span-4 md:justify-self-end md:text-lg md:leading-8">
            Réalisation, narration, son, montage et réflexions autour de la
            manière de filmer des moments réels.
          </p>
        </div>
      </header>

      <BlogGrid articles={articles} />
    </div>
  );
}