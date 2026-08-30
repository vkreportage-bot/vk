import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos | Photographe & vidéaste à Triel-sur-Seine",
  description:
    "VK est photographe et vidéaste basé à Triel-sur-Seine, dans les Yvelines. Reportages photo et vidéo, mariages, événements, portraits et projets professionnels en Île-de-France et partout en France.",
};

const sections = [
  {
    title: "VK / Photographe & vidéaste",
    paragraphs: [
      <>
        Basé à Triel-sur-Seine, dans les Yvelines, je réalise des photographies
        et des films avec une approche naturelle, documentaire et
        cinématographique.
      </>,
      <>
        Je cherche moins à fabriquer des images qu&apos;à révéler ce qui est déjà
        là : un regard, un geste, une lumière, une atmosphère ou un instant que
        l&apos;on n&apos;avait pas prévu.
      </>,
    ],
  },
  {
    title: "Une approche naturelle",
    paragraphs: [
      <>
        Chaque projet commence par l&apos;observation. Comprendre une personne,
        un lieu ou une histoire permet de créer des images qui leur ressemblent
        réellement.
      </>,
      <>
        Je privilégie les émotions sincères, les mouvements naturels et les
        moments spontanés, loin des poses systématiques et des mises en scène
        artificielles.
      </>,
      <>
        L&apos;objectif reste toujours le même : raconter une histoire avec des
        images fortes, élégantes et intemporelles.
      </>,
    ],
  },
  {
    title: "Photographie",
    paragraphs: [
      <>
        Portraits, mariages, événements, projets personnels ou professionnels :
        chaque reportage photographique est pensé comme une série cohérente.
      </>,
      <>
        Je recherche les détails, les expressions et les instants qui donnent
        une identité particulière à chaque histoire.
      </>,
    ],
  },
  {
    title: "Vidéo",
    paragraphs: [
      <>
        Le film permet d&apos;aller plus loin dans le récit. Le mouvement, le
        son, les silences et le rythme donnent une autre dimension aux images.
      </>,
      <>
        Je réalise des films événementiels, vidéos de mariage, portraits,
        contenus professionnels et films de présentation avec une approche
        cinématographique sobre et contemporaine.
      </>,
    ],
  },
  {
    title: "Triel-sur-Seine / France",
    paragraphs: [
      <>
        Basé à Triel-sur-Seine, je travaille régulièrement dans les Yvelines,
        notamment autour de Saint-Germain-en-Laye, Poissy, Verneuil-sur-Seine,
        Villennes-sur-Seine, Paris et plus largement en Île-de-France.
      </>,
      <>
        Mes déplacements ne se limitent pas à la région parisienne. Je me
        déplace partout en France pour les mariages, événements, portraits,
        reportages et projets professionnels.
      </>,
    ],
  },
];

export default function AboutPage() {
  return (
    <div className="container-vk min-h-screen pb-20 pt-28 md:pb-28 md:pt-32 lg:pt-36 ">
      {/* HERO */}
      <header className="pb-12 md:pb-16 lg:pb-20">
        <p className="eyebrow mb-4">À propos</p>

        <h1 className="section-title max-w-4xl">
          Photographier et filmer ce qui mérite de rester.
        </h1>
      </header>

      {/* SECTIONS */}
      <div className="max-w-[80%] mx-auto">
        {sections.map((section, index) => {
          const isRight = index % 2 === 0;

          return (
            <section
              key={section.title}
              className="
               
                py-10
                md:border-t-0 md:py-14
                lg:py-16
              "
            >
              <div className="grid md:grid-cols-12">
                <div
                  className={
                    isRight
                      ? "md:col-span-6 md:col-start-7"
                      : "md:col-span-6 md:col-start-1"
                  }
                >
                  {/* TITRE */}
                  <h2
                    className="
                      mb-6
                      text-xl
                      font-bold
                      tracking-[-0.02em]
                      text-[var(--muted)]
                      md:mb-8
                      md:text-2xl
                      lg:text-[28px]
                    "
                  >
                    {section.title}
                  </h2>

                  {/* TEXTE */}
                  <div
                    className="
                      max-w-3xl
                      space-y-5
                      text-sm
                      leading-7
                      text-justify
                      md:leading-8
                    "
                  >
                    {section.paragraphs.map((paragraph, paragraphIndex) => (
                      <p key={paragraphIndex}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* SIGNATURE */}
      <section
        className="
         
          pb-12
          pt-16
          text-center
          font-serif
          md:border-t-0
          md:pt-20
          lg:pt-24
        "
      >
        <div className="mx-auto max-w-4xl">
          <h2 className="section-title mx-auto text-center">
            Deux médiums.
            <br />
            Une même intention.
          </h2>

          <div className="mx-auto mt-10 max-w-3xl space-y-3 text-lg leading-7 md:mt-12 md:text-xl md:leading-8">
            <p>La photographie suspend un instant.</p>
            <p>Le film lui redonne du mouvement.</p>
            <p>Dans les deux cas, une image doit raconter quelque chose.</p>
          </div>
        </div>
      </section>
    </div>
  );
}