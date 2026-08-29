"use client";

import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Play,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { extractYouTubeId, youtubeEmbedUrl } from "@/lib/youtube";
import type { MediaItem } from "@/types";

type Props = {
  media: MediaItem[];
  projectTitle: string;
};

export function ProjectMediaGallery({
  media,
  projectTitle,
}: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const viewerRef = useRef<HTMLDivElement>(null);

  const activeMedia =
    activeIndex !== null ? media[activeIndex] : null;

  const closeViewer = useCallback(async () => {
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch {
        // Certains navigateurs peuvent refuser exitFullscreen.
      }
    }

    setActiveIndex(null);
  }, []);

  const previous = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null) return null;

      return current === 0
        ? media.length - 1
        : current - 1;
    });
  }, [media.length]);

  const next = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null) return null;

      return current === media.length - 1
        ? 0
        : current + 1;
    });
  }, [media.length]);

  async function toggleFullscreen() {
    if (!viewerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await viewerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Fullscreen non disponible ou refusé par le navigateur.
    }
  }

  useEffect(() => {
    if (activeIndex === null) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      switch (event.key) {
        case "Escape":
          void closeViewer();
          break;

        case "ArrowLeft":
          previous();
          break;

        case "ArrowRight":
          next();
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, closeViewer, next, previous]);

  if (media.length === 0) {
    return null;
  }

  return (
    <>
      {/* GALERIE */}
      <div className="container-vk pb-24 pt-4 md:pt-5">
        <div className="grid grid-cols-2 gap-0.75 sm:grid-cols-3 lg:grid-cols-5">
          {media.map((item, index) => {
            const youtubeId =
              item.type === "VIDEO"
                ? extractYouTubeId(item.url)
                : null;

            const youtubeThumbnail = youtubeId
              ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`
              : null;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Ouvrir ${
                  item.type === "VIDEO"
                    ? "la vidéo"
                    : "la photo"
                } ${index + 1}`}
                className="
                  group
                  relative
                  aspect-square
                  cursor-pointer
                  overflow-hidden
                  bg-neutral-200
                  outline-none
                  focus-visible:ring-2
                  focus-visible:ring-black
                "
              >
                {item.type === "IMAGE" ? (
                  <Image
                    src={item.url}
                    alt={item.alt || projectTitle}
                    fill
                    sizes="
                      (min-width: 1024px) 20vw,
                      (min-width: 640px) 33vw,
                      50vw
                    "
                    className="
                      object-cover
                      transition-transform
                      duration-700
                      ease-out
                      group-hover:scale-[1.025]
                    "
                  />
                ) : youtubeThumbnail ? (
                  <>
                    <Image
                      src={youtubeThumbnail}
                      alt={item.alt || projectTitle}
                      fill
                      sizes="
                        (min-width: 1024px) 20vw,
                        (min-width: 640px) 33vw,
                        50vw
                      "
                      className="
                        object-cover
                        transition-transform
                        duration-700
                        ease-out
                        group-hover:scale-[1.025]
                      "
                    />

                    <div
                      className="
                        absolute
                        inset-0
                        bg-black/10
                        transition-colors
                        duration-300
                        group-hover:bg-black/25
                      "
                    />

                    <PlayButton />
                  </>
                ) : (
                  <>
                    <video
                      src={item.url}
                      muted
                      playsInline
                      preload="metadata"
                      className="
                        size-full
                        object-cover
                        transition-transform
                        duration-700
                        ease-out
                        group-hover:scale-[1.025]
                      "
                    />

                    <div className="absolute inset-0 bg-black/10" />

                    <PlayButton />
                  </>
                )}

                {/* Index discret */}
                <span
                  className="
                    absolute
                    bottom-3
                    left-3
                    z-10
                    text-[9px]
                    font-medium
                    tracking-[0.16em]
                    text-white/70
                    opacity-0
                    transition-opacity
                    group-hover:opacity-100
                  "
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* LIGHTBOX */}
      {activeMedia && (
        <div
          ref={viewerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Visionneuse média"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              void closeViewer();
            }
          }}
          className="
            fixed
            inset-0
            z-100
            flex
            items-center
            justify-center
            bg-black
            text-white
          "
        >
          {/* HEADER */}
          <div
            className="
              pointer-events-none
              absolute
              inset-x-0
              top-0
              z-20
              flex
              h-20
              items-center
              justify-between
              px-4
              md:px-8
            "
          >
            <div className="pointer-events-auto">
              <p className="text-[10px] font-medium tracking-[0.18em] text-white/50">
                {String((activeIndex ?? 0) + 1).padStart(2, "0")}
                {" / "}
                {String(media.length).padStart(2, "0")}
              </p>
            </div>

            <div className="pointer-events-auto flex items-center gap-2">
              <button
                type="button"
                onClick={toggleFullscreen}
                aria-label="Afficher en plein écran"
                className="
                  flex
                  size-11
                  items-center
                  justify-center
                  rounded-full
                  bg-white/10
                  transition
                  hover:bg-white
                  hover:text-black
                "
              >
                <Maximize2 size={17} />
              </button>

              <button
                type="button"
                onClick={() => void closeViewer()}
                aria-label="Fermer la visionneuse"
                className="
                  flex
                  size-11
                  items-center
                  justify-center
                  rounded-full
                  bg-white/10
                  transition
                  hover:bg-white
                  hover:text-black
                "
              >
                <X size={19} />
              </button>
            </div>
          </div>

          {/* PRÉCÉDENT */}
          {media.length > 1 && (
            <button
              type="button"
              onClick={previous}
              aria-label="Média précédent"
              className="
                absolute
                left-3
                top-1/2
                z-20
                flex
                size-11
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                bg-white/10
                transition
                hover:bg-white
                hover:text-black
                md:left-8
              "
            >
              <ChevronLeft size={22} />
            </button>
          )}

          {/* MÉDIA */}
          <div
            className="
              flex
              size-full
              items-center
              justify-center
              px-4
              py-20
              sm:px-16
              md:px-24
              md:py-24
            "
          >
            {activeMedia.type === "IMAGE" ? (
              <div className="relative size-full">
                <Image
                  src={activeMedia.url}
                  alt={activeMedia.alt || projectTitle}
                  fill
                  priority
                  sizes="100vw"
                  className="object-contain"
                />
              </div>
            ) : extractYouTubeId(activeMedia.url) ? (
              <YouTubeLightbox
                url={activeMedia.url}
                title={activeMedia.alt || projectTitle}
              />
            ) : (
              <video
                key={activeMedia.id}
                src={activeMedia.url}
                controls
                autoPlay
                playsInline
                className="
                  max-h-full
                  max-w-full
                  object-contain
                "
              />
            )}
          </div>

          {/* SUIVANT */}
          {media.length > 1 && (
            <button
              type="button"
              onClick={next}
              aria-label="Média suivant"
              className="
                absolute
                right-3
                top-1/2
                z-20
                flex
                size-11
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                bg-white/10
                transition
                hover:bg-white
                hover:text-black
                md:right-8
              "
            >
              <ChevronRight size={22} />
            </button>
          )}
        </div>
      )}
    </>
  );
}

function PlayButton() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        className="
          flex
          size-11
          items-center
          justify-center
          rounded-full
          bg-white
          text-black
          shadow-lg
          transition-transform
          duration-300
          group-hover:scale-110
          md:size-12
        "
      >
        <Play
          size={17}
          fill="currentColor"
          className="ml-0.5"
        />
      </div>
    </div>
  );
}

function YouTubeLightbox({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  const embedUrl = youtubeEmbedUrl(url);

  if (!embedUrl) {
    return null;
  }

  return (
    <div className="aspect-video w-full max-w-[1600px]">
      <iframe
        src={`${embedUrl}&autoplay=1`}
        title={title}
        className="size-full"
        allow="
          accelerometer;
          autoplay;
          clipboard-write;
          encrypted-media;
          gyroscope;
          picture-in-picture;
          fullscreen
        "
        allowFullScreen
      />
    </div>
  );
}