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
  const eyebrowClass = hasMedia ? "text-white/72" : "text-[var(--muted)]";
  const bodyClass = hasMedia ? "text-white/84" : "text-[var(--muted)]";

  return (
    <section
      className={`relative h-[100svh] min-h-[650px] overflow-hidden ${
        hasMedia ? "bg-black" : "bg-[var(--light)]"
      } ${textClass}`}
    >
      {hasMedia && hero?.mediaType && hero.mediaUrl ? (
        <>
          <HeroMedia mediaType={hero.mediaType} mediaUrl={hero.mediaUrl} />

          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.16)_0%,rgba(0,0,0,0.08)_32%,rgba(0,0,0,0.18)_60%,rgba(0,0,0,0.64)_100%)] md:bg-black/22"
          />

          <div
            aria-hidden="true"
            className={`absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.30)_0%,rgba(0,0,0,0.08)_70%,rgba(0,0,0,0.02)_100%)] md:bg-gradient-to-b md:from-black/10 md:via-black/5 md:to-black/45 ${
              isPortraitYouTube
                ? "md:bg-[linear-gradient(90deg,rgba(0,0,0,0.48)_0%,rgba(0,0,0,0.34)_42%,rgba(0,0,0,0.08)_64%,rgba(0,0,0,0.18)_100%)]"
                : ""
            }`}
          />

          {/* Profondeur cinématographique : halos flous très légers. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-[18%] top-[4%] h-[48vw] max-h-[620px] min-h-[260px] w-[48vw] max-w-[620px] min-w-[260px] rounded-full bg-white/[0.055] blur-[80px] md:blur-[120px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-[18%] -right-[12%] h-[52vw] max-h-[720px] min-h-[300px] w-[52vw] max-w-[720px] min-w-[300px] rounded-full bg-black/30 blur-[90px] md:blur-[140px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[28%] bg-black/10 backdrop-blur-[1px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 shadow-[inset_0_0_160px_rgba(0,0,0,0.18)] md:shadow-[inset_0_0_220px_rgba(0,0,0,0.16)]"
          />
        </>
      ) : null}

      <div className="container-vk relative z-10 flex h-full flex-col justify-end pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-28 md:justify-center md:pb-0 md:pt-32">
        <div
          className={
            isPortraitYouTube
              ? "w-full md:max-w-[54%] lg:max-w-[56%]"
              : "w-full"
          }
        >
          <p className={`eyebrow mb-5 md:mb-8 ${eyebrowClass}`}>
            VK / Vidéaste
          </p>

          <h1
            className={
              isPortraitYouTube
                ? "max-w-[780px] text-[clamp(3.25rem,14.6vw,4.8rem)] leading-[0.93] tracking-[-0.055em] md:text-[clamp(3.7rem,6vw,6.9rem)] md:leading-[0.9] md:tracking-[-0.065em]"
                : "max-w-[94vw] text-[clamp(3.25rem,14.6vw,4.8rem)] leading-[0.93] tracking-[-0.055em] md:mx-auto md:max-w-[1250px] md:text-[clamp(4rem,7.6vw,8rem)] md:leading-[0.9] md:tracking-[-0.065em]"
            }
          >
            Des histoires humaines,
            <br />
            mises en images.
          </h1>

          <div
            className={
              isPortraitYouTube
                ? "mt-8 grid gap-8 md:mt-12 md:pt-5"
                : "mt-8 grid gap-8 md:mt-14 md:grid-cols-12 md:items-end md:pt-7"
            }
          >
            <p
              className={`${
                isPortraitYouTube
                  ? "max-w-[34ch] text-[15px] leading-7 md:max-w-xl md:text-base md:leading-7"
                  : "max-w-[34ch] text-[15px] leading-7 md:col-span-6 md:max-w-xl md:text-base md:leading-7"
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
                className="group inline-flex items-center gap-3 text-base font-semibold md:gap-2 md:text-sm"
              >
                Voir les films

                <ArrowDownRight
                  size={18}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1 md:size-4"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
