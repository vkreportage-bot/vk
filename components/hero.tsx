import Link from "next/link";
import { ArrowDownRight } from "lucide-react";
import { HeroMedia } from "@/components/hero-media";
import { isYouTubeShortUrl } from "@/lib/youtube";
import type { HeroSettings } from "@/types";

export function Hero({ hero }: { hero?: HeroSettings | null }) {
  const hasMedia = Boolean(hero?.mediaUrl && hero.mediaType);
  const isPortraitYouTube = Boolean(
    hero?.mediaType === "VIDEO" &&
      hero.mediaUrl &&
      isYouTubeShortUrl(hero.mediaUrl)
  );
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
            className={`absolute inset-0 bg-gradient-to-b from-black/10 via-black/5 to-black/45 ${
              isPortraitYouTube
                ? "md:bg-[linear-gradient(90deg,rgba(0,0,0,0.48)_0%,rgba(0,0,0,0.34)_42%,rgba(0,0,0,0.08)_64%,rgba(0,0,0,0.18)_100%)]"
                : ""
            }`}
          />
        </>
      ) : null}

      <div className="container-vk relative z-10 flex h-full flex-col justify-center pt-28 md:pt-32">
        <div className={isPortraitYouTube ? "w-full md:max-w-[54%] lg:max-w-[56%]" : "w-full"}>
          <p className={`eyebrow mb-8 ${eyebrowClass}`}>VK / Vidéaste</p>

          <h1
            className={
              isPortraitYouTube
                ? "max-w-[780px] text-[clamp(3.7rem,6vw,6.9rem)] leading-[0.9] tracking-[-0.065em]"
                : "mx-auto max-w-[1250px] text-[clamp(4rem,7.6vw,8rem)] leading-[0.9] tracking-[-0.065em]"
            }
          >
            Des histoires humaines,
            <br />
            mises en images.
          </h1>

          <div
            className={
              isPortraitYouTube
                ? "mt-10 grid gap-8 pt-5 md:mt-12"
                : "mt-14 grid gap-8 pt-7 md:grid-cols-12 md:items-end"
            }
          >
            <p
              className={`${
                isPortraitYouTube
                  ? "max-w-xl text-sm leading-6 md:text-base md:leading-7"
                  : "max-w-xl text-sm leading-6 md:col-span-6 md:text-base md:leading-7"
              } ${bodyClass}`}
            >
              Films de mariage, événements et réalisations audiovisuelles. Une
              approche naturelle, documentaire et cinématographique.
            </p>

            <div
              className={
                isPortraitYouTube
                  ? ""
                  : "md:col-span-3 md:col-start-10 md:flex md:justify-end"
              }
            >
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
