import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDownRight } from "lucide-react";
import { notFound } from "next/navigation";

import { ProjectGrid } from "@/components/project-grid";
import { StructuredData } from "@/components/structured-data";
import { getProjects } from "@/lib/repository";
import { locationPageMap, locationPages } from "@/lib/location-pages";
import { siteConfig } from "@/lib/site";

type Props = {
  params: Promise<{ city: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return locationPages.map((page) => ({ city: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const page = locationPageMap[city];

  if (!page) return {};

  const canonical = `/photographe-videaste/${page.slug}`;

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: canonical,
      siteName: "VK",
      type: "website",
    },
  };
}

const services = [
  {
    title: "Mariage",
    text: "Reportage photo et film de mariage avec une présence discrète, peu de mise en scène et une attention particulière portée aux personnes et aux moments spontanés.",
  },
  {
    title: "Événement",
    text: "Couverture photo et vidéo d'événements privés ou professionnels, pensée pour restituer l'ambiance, les temps forts et les détails qui donnent son identité à la journée.",
  },
  {
    title: "Portrait",
    text: "Portraits personnels, éditoriaux ou professionnels avec une direction légère et une esthétique naturelle, contemporaine et cohérente avec votre univers.",
  },
  {
    title: "Entreprise & marque",
    text: "Interviews, films de présentation, portraits d'équipe, reportages métier et contenus visuels pour raconter une activité sans tomber dans les codes publicitaires génériques.",
  },
];

export default async function LocationPage({ params }: Props) {
  const { city } = await params;
  const page = locationPageMap[city];

  if (!page) notFound();

  const projects = await getProjects({ featured: true });
  const canonicalUrl = `${siteConfig.url}/photographe-videaste/${page.slug}`;

  return (
    <>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "ProfessionalService",
              "@id": `${siteConfig.url}/#vk`,
              name: "VK",
              url: siteConfig.url,
              email: siteConfig.email,
              description: page.metaDescription,
              areaServed: {
                "@type": "City",
                name: page.city,
              },
              serviceType: [
                "Photographie de mariage",
                "Film de mariage",
                "Photographie événementielle",
                "Vidéo événementielle",
                "Portrait",
                "Réalisation vidéo",
              ],
            },
            {
              "@type": "WebPage",
              "@id": `${canonicalUrl}#webpage`,
              url: canonicalUrl,
              name: page.metaTitle,
              description: page.metaDescription,
              isPartOf: {
                "@id": `${siteConfig.url}/#website`,
              },
              about: {
                "@id": `${siteConfig.url}/#vk`,
              },
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Accueil",
                  item: siteConfig.url,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: `Photographe & vidéaste à ${page.city}`,
                  item: canonicalUrl,
                },
              ],
            },
            {
              "@type": "FAQPage",
              mainEntity: page.faq.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: item.answer,
                },
              })),
            },
          ],
        }}
      />

      <main>
        <section className="container-vk pb-20 pt-28 md:pb-28 md:pt-36 lg:pb-32 lg:pt-40">
          <p className="eyebrow mb-5">{page.eyebrow}</p>

          <div className="grid gap-10 md:grid-cols-12 md:items-end">
            <div className="md:col-span-9">
              <h1 className="max-w-6xl text-5xl leading-[0.95] tracking-[-0.055em] md:text-7xl lg:text-8xl">
                {page.title}
              </h1>
            </div>

            <div className="md:col-span-3">
              <p className="max-w-sm text-base leading-7 text-[var(--muted)] md:text-lg md:leading-8">
                {page.lead}
              </p>
            </div>
          </div>
        </section>

        <section className="border-y hairline">
          <div className="container-vk py-20 md:py-28 lg:py-32">
            <div className="grid gap-10 md:grid-cols-12">
              <div className="md:col-span-3">
                <p className="eyebrow">Approche</p>
              </div>

              <div className="md:col-span-8 md:col-start-5">
                <h2 className="max-w-4xl text-3xl leading-[1.05] tracking-[-0.04em] md:text-5xl lg:text-6xl">
                  Photographier ce qui se passe.
                  <br />
                  Filmer ce qui se ressent.
                </h2>

                <div className="mt-10 grid gap-8 md:grid-cols-2">
                  {page.introduction.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-base leading-7 text-[var(--muted)] md:text-lg md:leading-8"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container-vk py-20 md:py-28 lg:py-32">
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-3">
              <p className="eyebrow">Prestations</p>
            </div>

            <div className="md:col-span-8 md:col-start-5">
              <div className="border-t hairline">
                {services.map((service, index) => (
                  <article
                    key={service.title}
                    className="grid gap-5 border-b hairline py-7 md:grid-cols-[72px_1fr_1.4fr] md:gap-8 md:py-9"
                  >
                    <span className="text-xs text-[var(--muted)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <h2 className="text-2xl tracking-[-0.03em] md:text-3xl">
                      {service.title}
                    </h2>

                    <p className="text-sm leading-7 text-[var(--muted)] md:text-base md:leading-8">
                      {service.text}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {projects.length > 0 && (
          <section className="border-y hairline">
            <div className="container-vk py-20 md:py-28 lg:py-32">
              <header className="mb-12 flex items-end justify-between gap-8 md:mb-16">
                <div>
                  <p className="eyebrow mb-4">Portfolio</p>
                  <h2 className="section-title">Films & projets récents</h2>
                </div>

                <Link
                  href="/projects"
                  className="group hidden items-center gap-2 text-sm font-semibold md:flex"
                >
                  Voir tous les projets
                  <ArrowDownRight
                    size={16}
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1"
                  />
                </Link>
              </header>

              <ProjectGrid projects={projects} />
            </div>
          </section>
        )}

        <section className="bg-[var(--dark)] text-[var(--light)]">
          <div className="container-vk py-24 md:py-36">
            <div className="grid gap-12 md:grid-cols-12">
              <div className="md:col-span-3">
                <p className="eyebrow">{page.city}</p>
              </div>

              <div className="md:col-span-8 md:col-start-5">
                <h2 className="max-w-5xl text-4xl leading-[0.98] tracking-[-0.05em] md:text-6xl">
                  {page.localTitle}
                </h2>

                <div className="mt-12 grid gap-8 border-t border-white/15 pt-10 md:grid-cols-2">
                  {page.localContent.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-base leading-7 text-white/60 md:text-lg md:leading-8"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container-vk py-20 md:py-28 lg:py-32">
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-3">
              <p className="eyebrow">Secteurs</p>
            </div>

            <div className="md:col-span-8 md:col-start-5">
              <h2 className="max-w-4xl text-3xl leading-[1.05] tracking-[-0.04em] md:text-5xl">
                Basé à Triel-sur-Seine.
                <br />
                Mobile dans toute l'Île-de-France.
              </h2>

              <div className="mt-12 flex flex-wrap gap-3">
                {page.nearby.map((place) => (
                  <span
                    key={place}
                    className="rounded-full border hairline px-4 py-2 text-sm text-[var(--muted)]"
                  >
                    {place}
                  </span>
                ))}
              </div>

              <nav className="mt-12 border-t hairline" aria-label="Autres secteurs">
                {locationPages
                  .filter((location) => location.slug !== page.slug)
                  .map((location) => (
                    <Link
                      key={location.slug}
                      href={`/photographe-videaste/${location.slug}`}
                      className="group flex items-center justify-between border-b hairline py-5"
                    >
                      <span className="text-lg tracking-[-0.02em] md:text-2xl">
                        Photographe & vidéaste à {location.city}
                      </span>
                      <ArrowDownRight
                        size={18}
                        aria-hidden="true"
                        className="transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1"
                      />
                    </Link>
                  ))}
              </nav>
            </div>
          </div>
        </section>

        <section className="border-t hairline">
          <div className="container-vk py-20 md:py-28 lg:py-32">
            <div className="grid gap-12 md:grid-cols-12">
              <div className="md:col-span-3">
                <p className="eyebrow">Questions</p>
              </div>

              <div className="md:col-span-8 md:col-start-5">
                <h2 className="section-title mb-10">FAQ</h2>

                <div className="border-t hairline">
                  {page.faq.map((item) => (
                    <article key={item.question} className="border-b hairline py-7">
                      <h3 className="text-xl tracking-[-0.02em] md:text-2xl">
                        {item.question}
                      </h3>
                      <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)] md:text-base md:leading-8">
                        {item.answer}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container-vk pb-24 pt-10 md:pb-40 md:pt-16">
          <p className="eyebrow mb-8">Un projet à {page.city} ?</p>

          <Link
            href="/contact"
            className="group flex items-end justify-between gap-6 pb-7"
          >
            <h2 className="text-5xl leading-none tracking-[-0.055em] md:text-7xl lg:text-8xl">
              Parlons-en.
            </h2>

            <ArrowDownRight
              size={40}
              aria-hidden="true"
              className="mb-1 shrink-0 transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2"
            />
          </Link>
        </section>
      </main>
    </>
  );
}
