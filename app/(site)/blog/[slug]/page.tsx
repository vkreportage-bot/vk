import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BlogContent } from "@/components/blog-content";
import { StructuredData } from "@/components/structured-data";
import { getArticleBySlug, getArticles } from "@/lib/repository";
import { siteConfig } from "@/lib/site";

type Props = {
  params: Promise<{ slug: string }>;
};

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;

  const article = await getArticleBySlug(slug);

  if (!article) return {};

  const title = article.metaTitle || article.title;
  const description = article.metaDescription || article.excerpt;

  const images = article.coverUrl
    ? [
        {
          url: article.coverUrl,
          alt: article.coverAlt || article.title,
        },
      ]
    : undefined;

  return {
    title: article.metaTitle
      ? { absolute: article.metaTitle }
      : article.title,

    description,
    keywords: article.keywords,

    alternates: {
      canonical: `/blog/${article.slug}`,
    },

    openGraph: {
      type: "article",
      url: `/blog/${article.slug}`,
      title,
      description,
      images,
      publishedTime: article.publishedAt?.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      authors: [article.author],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: article.coverUrl ? [article.coverUrl] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  const [article, articles] = await Promise.all([
    getArticleBySlug(slug),
    getArticles(),
  ]);

  if (!article) {
    notFound();
  }

  const publishedDate =
    article.publishedAt ?? article.createdAt;

  const recentArticles = articles
    .filter((item) => item.slug !== article.slug)
    .slice(0, 3);

  const archive = articles.reduce<Record<string, number>>(
    (acc, item) => {
      const date =
        item.publishedAt ?? item.createdAt;

      const year = date.getFullYear().toString();

      acc[year] = (acc[year] ?? 0) + 1;

      return acc;
    },
    {},
  );

  return (
    <article className="pb-24 text-black md:pb-32">
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",

          headline: article.title,

          description:
            article.metaDescription || article.excerpt,

          image: article.coverUrl || undefined,

          datePublished: publishedDate.toISOString(),

          dateModified: article.updatedAt.toISOString(),

          mainEntityOfPage: `${siteConfig.url}/blog/${article.slug}`,

          author: {
            "@type": "Organization",
            name: article.author,
            url: siteConfig.url,
          },

          publisher: {
            "@type": "Organization",
            name: "VK",
            url: siteConfig.url,
          },

          keywords: article.keywords.join(", "),
        }}
      />

      {/* ====================================================== */}
      {/* HEADER                                                 */}
      {/* ====================================================== */}

  {/* HEADER */}
<header className="container-vk pb-24 pt-36 md:pb-28 md:pt-44 lg:pb-32 lg:pt-52">
  <div className="grid grid-cols-1 lg:grid-cols-12">
    <div className="lg:col-span-7">
      <p className="eyebrow mb-6">
        Journal / {article.author}
      </p>

      <h1
        className="
          max-w-[950px]
          text-[clamp(3.2rem,5.8vw,7rem)]
          font-medium
          leading-[0.88]
          tracking-[-0.07em]
        "
      >
        {article.title}
      </h1>

      {/* META */}
      <div
        className="
          mt-8
          flex
          flex-wrap
          items-center
          gap-x-2
          gap-y-2
          text-[9px]
          font-medium
          uppercase
          tracking-[0.08em]
          text-black/45
        "
      >
        {article.keywords
          .slice(0, 3)
          .map((keyword, index) => (
            <span key={keyword}>
              {keyword}

              {index <
              Math.min(article.keywords.length, 3) - 1
                ? " / "
                : ""}
            </span>
          ))}

        {article.keywords.length > 0 && (
          <span className="mx-1">—</span>
        )}

        <time dateTime={publishedDate.toISOString()}>
          {dateFormatter.format(publishedDate)}
        </time>

        <span>/</span>

        <span>Par {article.author}</span>
      </div>
    </div>
  </div>
</header>

      {/* ====================================================== */}
      {/* ARTICLE LAYOUT                                         */}
      {/* ====================================================== */}

      <div
        className="
          mx-auto
          grid
          max-w-[1240px]
          grid-cols-1
          gap-y-16
          px-6
          lg:grid-cols-[210px_minmax(0,660px)_210px]
          lg:justify-center
          lg:gap-x-12
          xl:grid-cols-[220px_minmax(0,680px)_220px]
          xl:gap-x-14
        "
      >
        {/* ==================================================== */}
        {/* SIDEBAR GAUCHE                                      */}
        {/* ==================================================== */}

        <aside
          className="
            hidden
            lg:block
            lg:border-r
            lg:border-black/10
            lg:pr-9
          "
        >
          <div className="sticky top-28">
            <p
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.16em]
                text-black/55
              "
            >
              À propos
            </p>

            <div
              className="
                mt-7
                flex
                aspect-square
                items-center
                justify-center
                bg-black
              "
            >
              <span
                className="
                  text-4xl
                  font-medium
                  tracking-[-0.05em]
                  text-white
                "
              >
                VK
              </span>
            </div>

            <p
              className="
                mt-4
                text-[10px]
                leading-[1.6]
                text-black/50
              "
            >
              Réalisation vidéo,
              documentaire et narration en
              images.
            </p>

            {/* <div className="mt-10">
              <p
                className="
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.14em]
                  text-black/50
                "
              >
                Découvrir
              </p>

              <nav
                className="
                  mt-4
                  flex
                  flex-col
                  gap-2
                "
              >
                <Link
                  href="/projects"
                  className="
                    text-[12px]
                    font-medium
                    transition-opacity
                    hover:opacity-50
                  "
                >
                  Projets
                </Link>

                <Link
                  href="/about"
                  className="
                    text-[12px]
                    font-medium
                    transition-opacity
                    hover:opacity-50
                  "
                >
                  À propos
                </Link>

                <Link
                  href="/contact"
                  className="
                    text-[12px]
                    font-medium
                    transition-opacity
                    hover:opacity-50
                  "
                >
                  Contact
                </Link>
              </nav>
            </div> */}
          </div>
        </aside>

        {/* ==================================================== */}
        {/* CONTENU CENTRAL                                     */}
        {/* ==================================================== */}

        <main className="min-w-0">
          {/* IMAGE */}
          {article.coverUrl ? (
            <figure>
              <div
                className="
                  relative
                  aspect-4/3
                  overflow-hidden
                  bg-black/5
                "
              >
                <Image
                  src={article.coverUrl}
                  alt={
                    article.coverAlt ||
                    article.title
                  }
                  fill
                  priority
                  sizes="
                    (min-width: 1280px) 680px,
                    (min-width: 1024px) 660px,
                    100vw
                  "
                  className="object-cover"
                />
              </div>

              {article.coverAlt ? (
                <figcaption
                  className="
                    mt-3
                    text-[10px]
                    leading-4
                    text-black/40
                  "
                >
                  {article.coverAlt}
                </figcaption>
              ) : null}
            </figure>
          ) : null}

          {/* SHORT DESCRIPTION */}
          {article.excerpt ? (
            <p
              className="
                mt-8
                text-[14px]
                font-medium
                leading-[1.65]
                
                text-black/70
              "
            >
              {article.excerpt}
            </p>
          ) : null}

          {/* BODY */}
        {/* BODY */}
<div
  className="
    mt-8
    text-black/80

    [&_p]:mb-6
    [&_p]:text-[14px]
    [&_p]:leading-[1.75]

    [&_h2]:mb-5
    [&_h2]:mt-14
    [&_h2]:text-[30px]
    [&_h2]:font-medium
    [&_h2]:leading-[1.05]
    [&_h2]:tracking-[-0.04em]

    [&_h3]:mb-4
    [&_h3]:mt-10
    [&_h3]:text-[21px]
    [&_h3]:font-medium
    [&_h3]:leading-[1.15]
    [&_h3]:tracking-[-0.03em]

    [&_strong]:font-semibold

    [&_a]:underline
    [&_a]:decoration-black/30
    [&_a]:underline-offset-4
    [&_a]:transition
    [&_a:hover]:decoration-black

    [&_ul]:mb-6
    [&_ul]:ml-5
    [&_ul]:list-disc
    [&_ul]:text-[14px]
    [&_ul]:leading-[1.75]

    [&_ol]:mb-6
    [&_ol]:ml-5
    [&_ol]:list-decimal
    [&_ol]:text-[14px]
    [&_ol]:leading-[1.75]

    [&_li]:mb-2

    [&_blockquote]:my-10
    [&_blockquote]:border-l
    [&_blockquote]:border-black/20
    [&_blockquote]:pl-6
    [&_blockquote]:text-[18px]
    [&_blockquote]:font-medium
    [&_blockquote]:leading-[1.5]

    [&_img]:my-10
    [&_img]:w-full
  "
>
  <BlogContent content={article.content} />
</div>
        </main>

        {/* ==================================================== */}
        {/* SIDEBAR DROITE                                      */}
        {/* ==================================================== */}

        <aside className="hidden lg:block">
          <div className="sticky top-28">
            {/* ARTICLES RÉCENTS */}
            <section>
              <p
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.16em]
                  text-black/55
                "
              >
                Articles récents
              </p>

              <div className="mt-7 space-y-7">
                {recentArticles.map(
                  (recent) => (
                    <article
                      key={recent.id}
                    >
                      <p
                        className="
                          mb-2
                          text-[9px]
                          uppercase
                          tracking-[0.09em]
                          text-black/40
                        "
                      >
                        {recent
                          .keywords[0] ??
                          "Journal"}
                      </p>

                      <Link
                        href={`/blog/${recent.slug}`}
                        className="
                          block
                          text-[12px]
                          font-medium
                          leading-[1.45]
                          tracking-[-0.015em]
                          transition-opacity
                          hover:opacity-50
                        "
                      >
                        {recent.title}
                      </Link>
                    </article>
                  ),
                )}
              </div>
            </section>

            {/* ARCHIVE */}
            <section className="mt-12">
              <p
                className="
                  mb-5
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.14em]
                  text-black/50
                "
              >
                Archive
              </p>

              <div className="space-y-2">
                {Object.entries(archive)
                  .sort(
                    ([yearA], [yearB]) =>
                      Number(yearB) -
                      Number(yearA),
                  )
                  .map(
                    ([year, count]) => (
                      <p
                        key={year}
                        className="
                          text-[11px]
                          font-medium
                          text-black/60
                        "
                      >
                        {year} ({count})
                      </p>
                    ),
                  )}
              </div>
            </section>

            {/* SUJETS */}
            {article.keywords.length >
            0 ? (
              <section className="mt-12">
                <p
                  className="
                    mb-5
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.14em]
                    text-black/50
                  "
                >
                  Sujets
                </p>

                <div className="space-y-2">
                  {article.keywords.map(
                    (keyword) => (
                      <p
                        key={keyword}
                        className="
                          text-[11px]
                          font-medium
                          text-black/60
                        "
                      >
                        {keyword}
                      </p>
                    ),
                  )}
                </div>
              </section>
            ) : null}
          </div>
        </aside>
      </div>

      {/* ====================================================== */}
      {/* MOBILE NAV                                            */}
      {/* ====================================================== */}

      <div className="container-vk mt-16 lg:hidden">
        <div
          className="
            grid
            gap-10
            border-t
            border-black/10
            pt-8
            sm:grid-cols-2
          "
        >
          <div>
            <p
              className="
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.14em]
                text-black/45
              "
            >
              Articles récents
            </p>

            <div className="mt-5 space-y-4">
              {recentArticles.map(
                (recent) => (
                  <Link
                    key={recent.id}
                    href={`/blog/${recent.slug}`}
                    className="
                      block
                      max-w-sm
                      text-sm
                      font-medium
                      leading-5
                    "
                  >
                    {recent.title}
                  </Link>
                ),
              )}
            </div>
          </div>

          <div>
            <p
              className="
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.14em]
                text-black/45
              "
            >
              Navigation
            </p>

            <nav className="mt-5 flex flex-col gap-3">
              <Link
                href="/blog"
                className="text-sm font-medium"
              >
                Journal
              </Link>

              <Link
                href="/projects"
                className="text-sm font-medium"
              >
                Projets
              </Link>

              <Link
                href="/about"
                className="text-sm font-medium"
              >
                À propos
              </Link>

              <Link
                href="/contact"
                className="text-sm font-medium"
              >
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* ====================================================== */}
      {/* FOOTER ARTICLE                                        */}
      {/* ====================================================== */}

      <footer
        className="
          mx-auto
          mt-24
          max-w-[680px]
          px-6
          md:mt-32
        "
      >
        <div
          className="
            border-t
            border-black/15
            pt-8
            text-center
          "
        >
          <Link
            href="/blog"
            className="
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.14em]
              text-black/50
              transition-opacity
              hover:opacity-50
            "
          >
            Retour au journal
          </Link>
        </div>
      </footer>
    </article>
  );
}