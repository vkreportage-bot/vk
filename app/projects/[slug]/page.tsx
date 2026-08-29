import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { StructuredData } from "@/components/structured-data";
import { ProjectMediaGallery } from "@/components/project-media-gallery";
import { getProjectBySlug } from "@/lib/repository";
import { siteConfig } from "@/lib/site";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) return {};

  return {
    title: project.title,
    description: project.excerpt,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.excerpt,
      images: [{ url: project.coverUrl, alt: project.title }]
    }
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  return (
    <article>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: project.title,
          description: project.excerpt,
          image: project.coverUrl,
          dateCreated: project.year ? `${project.year}-01-01` : undefined,
          creator: {
            "@type": "Organization",
            name: "VK",
            url: siteConfig.url
          },
          about: project.categories.map((category) => category.name)
        }}
      />

      <header className="container-vk pb-12 pt-36 md:pb-16 md:pt-44">
        <p className="eyebrow mb-4">
          {project.categories.map((category) => category.name).join(" · ")}
        </p>
        <h1 className="section-title max-w-5xl">{project.title}</h1>
        <p className="mt-7 max-w-2xl text-lg leading-8 text-(--muted)">
          {project.excerpt}
        </p>
      </header>

      <div className="container-vk">
        <div className="relative aspect-video overflow-hidden bg-neutral-200">
          <Image
            src={project.coverUrl}
            alt={project.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </div>

    <section className="container-vk">
  <div className="grid border-b border-black/15 py-12 md:grid-cols-12 md:gap-x-8 md:py-16">

    {/* COLONNE GAUCHE */}
    <aside className="md:col-span-3">
      <p className="mb-10 text-[10px] font-semibold uppercase tracking-[0.22em] text-black/40">
        01 / Film
      </p>

      <div className="grid grid-cols-2 gap-x-6 gap-y-7 md:block md:space-y-7">

        {project.location && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/45">
              Lieu
            </p>

            <p className="mt-2 text-sm">
              {project.location}
            </p>
          </div>
        )}

        {project.year && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/45">
              Année
            </p>

            <p className="mt-2 text-sm">
              {project.year}
            </p>
          </div>
        )}

        {project.client && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/45">
              Client
            </p>

            <p className="mt-2 text-sm">
              {project.client}
            </p>
          </div>
        )}

        {project.categories.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/45">
              Catégorie
            </p>

            <p className="mt-2 text-sm">
              {project.categories
                .map((category) => category.name)
                .join(" · ")}
            </p>
          </div>
        )}
      </div>
    </aside>


    {/* TEXTE PRINCIPAL */}
    <div className="mt-12 md:col-span-8 md:col-start-5 md:mt-0">

      <p className="mb-8 text-[10px] font-semibold uppercase tracking-[0.22em] text-black/40">
        À propos du projet
      </p>

      <p className="max-w-4xl text-[clamp(2rem,3.6vw,4.3rem)] font-medium leading-[0.98] tracking-[-0.055em]">
        {project.description}
      </p>

    </div>
  </div>
</section>

 <div className="container-vk pt-14 md:pt-20">
  <div className="flex items-end justify-between border-b border-black/15 pb-4">

    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black/40">
        Sélection
      </p>

      <h2 className="mt-2 text-2xl font-medium tracking-[-0.04em] md:text-3xl">
        Galerie
      </h2>
    </div>

    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/40">
      {String(project.media.length).padStart(2, "0")} médias
    </p>

  </div>
</div>

<ProjectMediaGallery
  media={project.media}
  projectTitle={project.title}
/>
    </article>
  );
}
