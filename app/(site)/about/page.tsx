import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "À propos | Photographe & vidéaste à Triel-sur-Seine",
  description:
    "VK est photographe et vidéaste basé à Triel-sur-Seine, dans les Yvelines. Reportages photo et vidéo, mariages, événements, portraits et projets professionnels en Île-de-France et partout en France."
};

const disciplines = [
  {
    index: "01",
    title: "Photographie",
    text:
      "Portraits, mariages, événements et projets professionnels. Chaque reportage est construit comme une série cohérente, attentive aux gestes, aux détails et aux instants qui donnent une identité à une histoire."
  },
  {
    index: "02",
    title: "Film",
    text:
      "Le mouvement, le son, les silences et le rythme donnent une autre dimension au récit. Je réalise des films de mariage, des portraits, des films événementiels et des contenus professionnels avec une écriture sobre et cinématographique."
  },
  {
    index: "03",
    title: "Approche",
    text:
      "Observer avant de diriger. Comprendre une personne, un lieu ou une atmosphère avant de construire l’image. Je privilégie les émotions sincères, les mouvements naturels et les situations qui ne semblent pas fabriquées."
  },
  {
    index: "04",
    title: "Territoire",
    text:
      "Basé à Triel-sur-Seine, je travaille dans les Yvelines, à Saint-Germain-en-Laye, Poissy, Versailles, Paris et plus largement en Île-de-France. Je me déplace également partout en France selon les projets."
  }
];

export default function AboutPage() {
  return (
    <main className="bg-[var(--light)] text-[var(--dark)]">
      <section className="container-vk flex min-h-[82svh] flex-col justify-between pb-12 pt-32 md:pb-16 md:pt-40 lg:pb-20 lg:pt-44">
        <div>
          <p className="eyebrow mb-8 text-[var(--muted)]">À propos / VK</p>

          <h1 className="max-w-[1450px] text-[clamp(3.6rem,8.5vw,9.2rem)] leading-[0.86] tracking-[-0.07em]">
            Photographier et filmer
            <br className="hidden sm:block" /> ce qui mérite de rester.
          </h1>
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-12 md:items-end lg:mt-24">
          <p className="max-w-2xl text-base leading-7 md:col-span-7 md:text-lg md:leading-8 lg:col-span-6">
            Photographe et vidéaste basé à Triel-sur-Seine, je travaille avec
            une approche documentaire et cinématographique, au plus près des
            personnes, des gestes et des atmosphères.
          </p>

          <div className="flex gap-10 text-xs uppercase tracking-[0.14em] text-[var(--muted)] md:col-span-4 md:col-start-9 md:justify-end">
            <div>
              <p className="mb-2 text-[10px] opacity-60">Basé à</p>
              <p className="text-[var(--dark)]">Triel-sur-Seine</p>
            </div>
            <div>
              <p className="mb-2 text-[10px] opacity-60">Disponible</p>
              <p className="text-[var(--dark)]">France entière</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#111] text-white">
        <div className="container-vk py-20 md:py-28 lg:py-36">
          <div className="grid gap-12 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">
                Intention
              </p>
            </div>

            <div className="md:col-span-8 md:col-start-5">
              <p className="text-[clamp(2.35rem,5vw,5.5rem)] leading-[0.98] tracking-[-0.055em]">
                Je cherche moins à fabriquer des images qu’à révéler ce qui est
                déjà là.
              </p>

              <div className="mt-12 grid gap-8 text-sm leading-7 text-white/65 sm:grid-cols-2 md:mt-16 md:text-base md:leading-8">
                <p>
                  Un regard, un geste, une lumière, une tension, un silence ou
                  un instant que l’on n’avait pas prévu. Ce sont souvent ces
                  détails qui donnent aux images leur force et leur vérité.
                </p>
                <p>
                  Chaque projet commence donc par l’observation : comprendre la
                  personne, le lieu et le rythme avant de décider comment les
                  photographier ou les filmer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-vk py-20 md:py-28 lg:py-36">
        <div className="mb-14 grid gap-8 md:mb-20 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="eyebrow mb-5 text-[var(--muted)]">Pratique</p>
            <h2 className="text-[clamp(3rem,6vw,6.4rem)] leading-[0.9] tracking-[-0.06em]">
              Deux médiums.
              <br />
              Une même intention.
            </h2>
          </div>

          <p className="max-w-lg text-sm leading-7 text-[var(--muted)] md:col-span-4 md:col-start-9 md:text-base md:leading-8">
            La photographie suspend un instant. Le film lui redonne du
            mouvement. Dans les deux cas, l’image doit raconter quelque chose.
          </p>
        </div>

        <div className="grid gap-x-10 border-t border-black/10 md:grid-cols-2">
          {disciplines.map((item) => (
            <article
              key={item.index}
              className="grid grid-cols-[44px_1fr] gap-4 border-b border-black/10 py-8 sm:grid-cols-[64px_1fr] md:py-10"
            >
              <span className="pt-1 text-[10px] font-semibold tracking-[0.14em] text-[var(--muted)]">
                {item.index}
              </span>

              <div>
                <h3 className="text-2xl font-semibold tracking-[-0.035em] md:text-3xl">
                  {item.title}
                </h3>
                <p className="mt-5 max-w-xl text-sm leading-7 text-[var(--muted)] md:text-base md:leading-8">
                  {item.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container-vk pb-24 md:pb-32 lg:pb-40">
        <div className="rounded-[28px] bg-[#dedbd3] px-6 py-10 sm:px-10 md:px-14 md:py-14 lg:grid lg:grid-cols-12 lg:items-end lg:px-16 lg:py-16">
          <div className="lg:col-span-8">
            <p className="eyebrow mb-5 text-[var(--muted)]">Un projet en tête ?</p>
            <h2 className="max-w-5xl text-[clamp(2.8rem,6vw,6rem)] leading-[0.92] tracking-[-0.06em]">
              Parlons de ce que vous voulez raconter.
            </h2>
          </div>

          <div className="mt-10 lg:col-span-3 lg:col-start-10 lg:mt-0 lg:flex lg:justify-end">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 text-sm font-semibold"
            >
              Me contacter
              <ArrowUpRight
                size={18}
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
