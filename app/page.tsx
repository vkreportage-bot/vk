import Link from "next/link";
import { ArrowDownRight } from "lucide-react";
import { Hero } from "@/components/hero";
import { ProjectGrid } from "@/components/project-grid";
import { StructuredData } from "@/components/structured-data";
import { getCategories, getProjects } from "@/lib/repository";
import { siteConfig } from "@/lib/site";

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
          "@type": "ProfessionalService",
          name: "VK",
          url: siteConfig.url,
          description: siteConfig.description,
          email: siteConfig.email,
          knowsAbout: categories.map((category) => category.name)
        }}
      />

      <Hero />

      <section id="projets" className="container-vk py-20 md:py-32">
        <div className="mb-10 flex items-end justify-between gap-6 border-b hairline pb-5 md:mb-14">
          <div>
            <p className="eyebrow mb-3">Sélection</p>
            <h2 className="section-title">Projets récents</h2>
          </div>
          <Link
            href="/projects"
            className="hidden items-center gap-2 text-sm font-semibold md:flex"
          >
            Tous les projets <ArrowDownRight size={16} />
          </Link>
        </div>

        <ProjectGrid projects={projects} />

        <Link
          href="/projects"
          className="mt-10 inline-flex items-center gap-2 text-sm font-semibold md:hidden"
        >
          Tous les projets <ArrowDownRight size={16} />
        </Link>
      </section>

      <section className="bg-[var(--dark)] text-[var(--light)]">
        <div className="container-vk grid gap-12 py-20 md:grid-cols-12 md:py-32">
          <div className="md:col-span-4">
            <p className="eyebrow">Approche</p>
          </div>
          <div className="md:col-span-8">
            <p className="max-w-4xl text-3xl leading-tight tracking-[-0.04em] md:text-6xl">
              Des films simples, sensibles et vivants. Moins de mise en scène,
              plus de présence.
            </p>
            <div className="mt-12 flex flex-wrap gap-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/projects?category=${category.slug}`}
                  className="rounded-full border border-white/25 px-4 py-2 text-sm hover:bg-white hover:text-black"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-vk py-20 md:py-32">
        <p className="eyebrow mb-6">Un projet ?</p>
        <Link
          href="/contact"
          className="group flex items-end justify-between border-b hairline pb-5"
        >
          <span className="section-title">Parlons-en.</span>
          <ArrowDownRight
            className="mb-2 transition-transform group-hover:translate-x-1 group-hover:translate-y-1"
            size={32}
          />
        </Link>
      </section>
    </>
  );
}
