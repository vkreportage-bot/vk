import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos | Photographe & vidéaste à Triel-sur-Seine",
  description:
    "VK est photographe et vidéaste basé à Triel-sur-Seine, dans les Yvelines. Reportages photo et vidéo, mariages, événements, portraits et projets professionnels en Île-de-France et partout en France.",
};

export default function AboutPage() {
  return (
    <div className="container-vk min-h-screen pb-20 pt-28 md:pb-28 md:pt-32 lg:pt-36">
      {/* HERO */}
      <header className="pb-10 md:pb-14">
        <p className="eyebrow mb-4">À propos</p>

        <h1 className="section-title max-w-4xl">
          Photographier et filmer ce qui mérite de rester.
        </h1>
      </header>

      {/* INTRODUCTION */}
      <section className="grid gap-6 border-t hairline py-8 md:grid-cols-12 md:gap-10 md:py-10 lg:gap-14">
        <p className="text-sm text-(--muted) md:col-span-3">
          VK / Photographe & vidéaste
        </p>

        <div className="max-w-3xl space-y-5 text-lg leading-7 text-justify md:col-span-7 md:col-start-5 md:text-xl md:leading-8">
          <p>
            Basé à Triel-sur-Seine, dans les Yvelines, je réalise des
            photographies et des films avec une approche naturelle,
            documentaire et cinématographique.
          </p>

          <p>
            Je cherche moins à fabriquer des images qu&apos;à révéler ce qui est
            déjà là : un regard, un geste, une lumière, une atmosphère ou un
            instant que l&apos;on n&apos;avait pas prévu.
          </p>
        </div>
      </section>

      {/* APPROCHE */}
      <section className="grid gap-6 border-t hairline py-8 md:grid-cols-12 md:gap-10 md:py-10 lg:gap-14">
        <p className="text-sm text-(--muted) md:col-span-3">
          Une approche naturelle 
        </p>

        <div className="max-w-3xl space-y-5 text-justify text-lg leading-7 md:col-span-7 md:col-start-5 md:text-xl md:leading-8">
          <p>
            Chaque projet commence par l&apos;observation. Comprendre une
            personne, un lieu ou une histoire permet de créer des images qui
            leur ressemblent réellement.
          </p>

          <p>
            Je privilégie les émotions sincères, les mouvements naturels et
            les moments spontanés, loin des poses systématiques et des mises en
            scène artificielles.
          </p>

          <p>
            L&apos;objectif reste toujours le même : raconter une histoire avec
            des images fortes, élégantes et intemporelles.
          </p>
        </div>
      </section>

      {/* PHOTO */}
      <section className="grid gap-6 border-t hairline py-8 md:grid-cols-12 md:gap-10 md:py-10 lg:gap-14">
        <p className="text-sm text-(--muted) md:col-span-3">
          Photographie
        </p>

        <div className="max-w-3xl space-y-5 text-lg text-justify leading-7 md:col-span-7 md:col-start-5 md:text-xl md:leading-8">
          <p>
            Portraits, mariages, événements, projets personnels ou
            professionnels : chaque reportage photographique est pensé comme
            une série cohérente.
          </p>

          <p>
            Je recherche les détails, les expressions et les instants qui
            donnent une identité particulière à chaque histoire.
          </p>
        </div>
      </section>

      {/* VIDEO */}
      <section className="grid gap-6 border-t hairline py-8 md:grid-cols-12 md:gap-10 md:py-10 lg:gap-14">
        <p className="text-sm text-(--muted) md:col-span-3">
          Vidéo
        </p>

        <div className="max-w-3xl space-y-5 text-lg text-justify leading-7 md:col-span-7 md:col-start-5 md:text-xl md:leading-8">
          <p>
            Le film permet d&apos;aller plus loin dans le récit. Le mouvement,
            le son, les silences et le rythme donnent une autre dimension aux
            images.
          </p>

          <p>
            Je réalise des films événementiels, vidéos de mariage, portraits,
            contenus professionnels et films de présentation avec une approche
            cinématographique sobre et contemporaine.
          </p>
        </div>
      </section>

      {/* LOCALISATION */}
      <section className="grid gap-6 border-t hairline py-8 md:grid-cols-12 md:gap-10 md:py-10 lg:gap-14">
        <p className="text-sm text-(--muted) md:col-span-3">
          Triel-sur-Seine / France
        </p>

        <div className="max-w-3xl space-y-5 text-lg leading-7 text-justify md:col-span-7 md:col-start-5 md:text-xl md:leading-8">
          <p>
            Basé à Triel-sur-Seine, je travaille régulièrement dans les
            Yvelines, notamment autour de Saint-Germain-en-Laye, Poissy,
            Verneuil-sur-Seine, Villennes-sur-Seine, Paris et plus largement en
            Île-de-France.
          </p>

          <p>
            Mes déplacements ne se limitent pas à la région parisienne. Je me
            déplace partout en France pour les mariages, événements, portraits,
            reportages et projets professionnels.
          </p>
        </div>
      </section>

      {/* SIGNATURE */}
      <section className="border-t hairline pb-6 pt-12 md:pt-16">
        <p className="eyebrow mb-5">VK</p>

        <h2 className="section-title max-w-4xl">
          Deux médiums.
          <br />
          Une même intention.
        </h2>

        <div className="mt-8 max-w-2xl space-y-2 text-lg leading-7 md:mt-10 md:text-xl md:leading-8">
          <p>La photographie suspend un instant.</p>
          <p>Le film lui redonne du mouvement.</p>
          <p>Dans les deux cas, une image doit raconter quelque chose.</p>
        </div>
      </section>
    </div>
  );
}