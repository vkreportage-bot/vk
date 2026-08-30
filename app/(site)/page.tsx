import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDownRight } from "lucide-react";

import { Hero } from "@/components/hero";
import { ProjectGrid } from "@/components/project-grid";
import { StructuredData } from "@/components/structured-data";
import { getCategories, getProjects } from "@/lib/repository";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "VK — Vidéaste | Mariage, événementiel & réalisation",
  description:
    "VK réalise des films de mariage, vidéos événementielles et projets audiovisuels avec une approche naturelle, documentaire et cinématographique.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "VK — Vidéaste",
    description:
      "Films naturels, sensibles et cinématographiques. Mariages, événements et histoires humaines.",
    url: "/",
    siteName: "VK",
    type: "website"
  }
};

export default async function HomePage() {
  const [projects, categories] = await Promise.all([
    getProjects({ featured: true }),
    getCategories()
  ]);

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
              description:
                "Vidéaste spécialisé dans les films de mariage, vidéos événementielles et réalisations audiovisuelles.",
              email: siteConfig.email,
              areaServed: {
                "@type": "AdministrativeArea",
                name: "Haute-Savoie"
              },
              serviceType: [
                "Film de mariage",
                "Vidéo événementielle",
                "Réalisation vidéo",
                "Production audiovisuelle"
              ],
              knowsAbout: categories.map((category) => category.name)
            },
            {
              "@type": "WebSite",
              "@id": `${siteConfig.url}/#website`,
              url: siteConfig.url,
              name: "VK",
              publisher: {
                "@id": `${siteConfig.url}/#vk`
              }
            }
          ]
        }}
      />

      {/* HERO */}
      <Hero />

      {/* INTRODUCTION */}
      <section className="container-vk border-b hairline py-20 md:py-32">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-3">
            <p className="eyebrow">VK / Réalisation</p>
          </div>

          <div className="md:col-span-8 md:col-start-5">
            <h2 className="max-w-4xl text-3xl leading-[1.05] tracking-[-0.045em] md:text-5xl lg:text-6xl">
              Filmer ce qui est là.
              <br />
              Sans chercher à le fabriquer.
            </h2>

            <div className="mt-10 grid max-w-4xl gap-8 md:grid-cols-2">
              <p className="text-base leading-7 text-[var(--muted)] md:text-lg md:leading-8">
                VK réalise des films de mariage, des vidéos événementielles et
                des projets audiovisuels avec une approche documentaire et
                cinématographique.
              </p>

              <p className="text-base leading-7 text-[var(--muted)] md:text-lg md:leading-8">
                Une caméra discrète, peu de mise en scène et une attention
                particulière portée aux personnes, aux gestes et aux moments
                qui échappent au scénario.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section
        id="projets"
        className="container-vk py-20 md:py-32"
        aria-labelledby="projects-title"
      >
        <header className="mb-12 flex items-end justify-between gap-8 pb-6 md:mb-16">
          <div>
            <p className="eyebrow mb-4">Sélection</p>

            <h2 id="projects-title" className="section-title">
              Films récents
            </h2>
          </div>

          <Link
            href="/projects"
            className="group hidden items-center gap-2 text-sm font-semibold md:flex"
          >
            Tous les projets

            <ArrowDownRight
              size={16}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1"
            />
          </Link>
        </header>

        <ProjectGrid projects={projects} />

        <Link
          href="/projects"
          className="group mt-10 inline-flex items-center gap-2 text-sm font-semibold md:hidden"
        >
          Tous les projets

          <ArrowDownRight
            size={16}
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1"
          />
        </Link>
      </section>

      {/* CATEGORIES */}
      <section className="border-y hairline">
        <div className="container-vk py-20 md:py-32">
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-3">
              <p className="eyebrow">Projets</p>
            </div>

            <div className="md:col-span-8 md:col-start-5">
              <h2 className="max-w-3xl text-3xl leading-tight tracking-[-0.04em] md:text-5xl">
                Des histoires différentes.
                <br />
                Un même regard.
              </h2>

              <nav
                aria-label="Catégories de projets"
                className="mt-14 border-t hairline"
              >
                {categories.map((category, index) => (
                  <Link
                    key={category.id}
                    href={`/projects?category=${category.slug}`}
                    className="group grid grid-cols-[48px_1fr_auto] items-center gap-4 border-b hairline py-6 md:grid-cols-[72px_1fr_auto] md:py-7"
                  >
                    <span className="text-xs text-[var(--muted)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="text-xl tracking-[-0.025em] md:text-3xl">
                      {category.name}
                    </span>

                    <ArrowDownRight
                      size={20}
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1"
                    />
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </section>

      {/* APPROACH */}
      <section className="bg-[var(--dark)] text-[var(--light)]">
        <div className="container-vk py-24 md:py-40">
          <div className="grid gap-14 md:grid-cols-12">
            <div className="md:col-span-3">
              <p className="eyebrow">Approche</p>
            </div>

            <div className="md:col-span-9">
              <h2 className="max-w-5xl text-4xl leading-[0.98] tracking-[-0.055em] md:text-6xl lg:text-7xl">
                Moins de mise en scène.
                <br />
                Plus de présence.
              </h2>

              <div className="mt-14 grid max-w-4xl gap-8 border-t border-white/15 pt-10 md:grid-cols-2">
                <p className="text-base leading-7 text-white/60 md:text-lg md:leading-8">
                  Observer avant de filmer. Comprendre un lieu, une lumière,
                  une relation et laisser les situations exister naturellement.
                </p>

                <p className="text-base leading-7 text-white/60 md:text-lg md:leading-8">
                  Les silences, les regards et les gestes spontanés deviennent
                  alors une partie essentielle du récit.
                </p>
              </div>

              <Link
                href="/about"
                className="group mt-12 inline-flex items-center gap-2 text-sm font-semibold"
              >
                Découvrir l&apos;approche

                <ArrowDownRight
                  size={16}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SIGNATURE */}
      <section className="container-vk py-24 md:py-36">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-3">
            <p className="eyebrow">VK</p>
          </div>

          <div className="md:col-span-8 md:col-start-5">
            <blockquote className="max-w-4xl text-3xl leading-[1.08] tracking-[-0.04em] md:text-5xl">
              Un film ne devrait pas seulement montrer un moment.
              <br className="hidden md:block" />
              Il devrait permettre de le ressentir à nouveau.
            </blockquote>

            <Link
              href="/about"
              className="group mt-10 inline-flex items-center gap-2 border-b hairline pb-2 text-sm font-semibold"
            >
              À propos de VK

              <ArrowDownRight
                size={16}
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="container-vk pb-24 pt-6 md:pb-40 md:pt-10">
        <p className="eyebrow mb-8">Un projet ?</p>

        <Link
          href="/contact"
          className="group flex items-end justify-between gap-6  pb-7"
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
    </>
  );
}