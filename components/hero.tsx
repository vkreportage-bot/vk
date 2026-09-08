import Link from "next/link";
import { ArrowDownRight } from "lucide-react";
import { HeroMedia } from "@/components/hero-media";
import type { HeroSettings } from "@/types";

export function Hero({ hero }: { hero?: HeroSettings | null }) {
  const hasMedia = Boolean(hero?.mediaUrl && hero.mediaType);
  const textClass = hasMedia ? "text-white" : "text-[var(--dark)]";
  const eyebrowClass = hasMedia ? "text-white/70" : "text-[var(--muted)]";
  const bodyClass = hasMedia ? "text-white/80" : "text-[var(--muted)]";

  return (
    <section
      className={`relative h-[100svh] min-h-[650px] overflow-hidden ${
        hasMedia ? "bg-black" : "bg-[var(--light)]"
      } ${textClass}`}
    >
      {hasMedia && hero?.mediaType && hero.mediaUrl ? (
        <>
          <HeroMedia mediaType={hero.mediaType} mediaUrl={hero.mediaUrl} />
          <div aria-hidden="true" className="absolute inset-0 bg-black/22" />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/5 to-black/45"
          />
        </>
      ) : null}

      <div className="container-vk relative z-10 flex h-full flex-col justify-center pt-28 md:pt-32">
        <div className="w-full">
          <p className={`eyebrow mb-8 ${eyebrowClass}`}>VK / Vidéaste</p>

          <h1 className="mx-auto max-w-[1250px] text-[clamp(4rem,7.6vw,8rem)] leading-[0.9] tracking-[-0.065em]">
            Des histoires humaines,
            <br />
            mises en images.
          </h1>

          <div className="mt-14 grid gap-8 pt-7 md:grid-cols-12 md:items-end">
            <p
              className={`max-w-xl text-sm leading-6 md:col-span-6 md:text-base md:leading-7 ${bodyClass}`}
            >
              Films de mariage, événements et réalisations audiovisuelles. Une
              approche naturelle, documentaire et cinématographique.
            </p>

            <div className="md:col-span-3 md:col-start-10 md:flex md:justify-end">
              <Link
                href="#projets"
                className="group inline-flex items-center gap-2 text-sm font-semibold"
              >
                Voir les films

                <ArrowDownRight
                  size={16}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
