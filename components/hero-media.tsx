"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform
} from "framer-motion";
import type { MediaType } from "@/types";
import {
  isYouTubeShortUrl,
  youtubeHeroEmbedUrl
} from "@/lib/youtube";

type HeroMediaProps = {
  mediaType: MediaType;
  mediaUrl: string;
};

export function HeroMedia({ mediaType, mediaUrl }: HeroMediaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const youtubeUrl = mediaType === "VIDEO" ? youtubeHeroEmbedUrl(mediaUrl) : null;
  const [portrait, setPortrait] = useState(() =>
    youtubeUrl ? isYouTubeShortUrl(mediaUrl) : false
  );
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 78]);
  const parallaxScale = useTransform(scrollYProgress, [0, 1], [1.015, 1.08]);

  useEffect(() => {
    setPortrait(youtubeUrl ? isYouTubeShortUrl(mediaUrl) : false);
  }, [mediaUrl, youtubeUrl]);

  const updateOrientation = (width: number, height: number) => {
    setPortrait(height > width);
  };

  let mediaContent: React.ReactNode;

  if (youtubeUrl) {
    if (portrait) {
      mediaContent = (
        <>
          <iframe
            src={youtubeUrl}
            title="Vidéo d’arrière-plan VK"
            allow="autoplay; encrypted-media; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            tabIndex={-1}
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[177.7778vw] min-h-[125%] w-[100vw] min-w-[125%] -translate-x-1/2 -translate-y-1/2 scale-110 border-0 opacity-65 blur-3xl"
          />
          <iframe
            src={youtubeUrl}
            title="Vidéo portrait VK"
            allow="autoplay; encrypted-media; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            tabIndex={-1}
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 aspect-[9/16] h-[105%] w-auto -translate-x-1/2 -translate-y-1/2 border-0 md:left-[76%] md:h-[92%] xl:left-[78%]"
          />
        </>
      );
    } else {
      mediaContent = (
        <iframe
          src={youtubeUrl}
          title="Vidéo d’arrière-plan VK"
          allow="autoplay; encrypted-media; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          tabIndex={-1}
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.7778vh] min-w-full -translate-x-1/2 -translate-y-1/2 scale-[1.015] border-0 blur-[2px]"
        />
      );
    }
  } else if (mediaType === "VIDEO") {
    if (portrait) {
      mediaContent = (
        <>
          <video
            src={mediaUrl}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            onLoadedMetadata={(event) =>
              updateOrientation(event.currentTarget.videoWidth, event.currentTarget.videoHeight)
            }
            className="absolute inset-0 h-full w-full scale-110 object-cover opacity-65 blur-3xl"
          />
          <video
            src={mediaUrl}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-[105%] w-auto max-w-none -translate-x-1/2 -translate-y-1/2 object-contain md:left-[76%] md:h-[92%] xl:left-[78%]"
          />
        </>
      );
    } else {
      mediaContent = (
        <video
          src={mediaUrl}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          onLoadedMetadata={(event) =>
            updateOrientation(event.currentTarget.videoWidth, event.currentTarget.videoHeight)
          }
          className="absolute inset-0 h-full w-full scale-[1.015] object-cover blur-[2px]"
        />
      );
    }
  } else if (portrait) {
    mediaContent = (
      <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={mediaUrl}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full scale-110 object-cover opacity-65 blur-3xl"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={mediaUrl}
          alt=""
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 h-[105%] w-auto max-w-none -translate-x-1/2 -translate-y-1/2 object-contain md:left-[76%] md:h-[92%] xl:left-[78%]"
        />
      </>
    );
  } else {
    mediaContent = (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={mediaUrl}
        alt=""
        fetchPriority="high"
        decoding="async"
        aria-hidden="true"
        onLoad={(event) =>
          updateOrientation(event.currentTarget.naturalWidth, event.currentTarget.naturalHeight)
        }
        className="absolute inset-0 h-full w-full scale-[1.015] object-cover blur-[2px]"
      />
    );
  }

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <motion.div
        aria-hidden="true"
        className="absolute -inset-y-[8%] inset-x-0 will-change-transform"
        style={{
          y: shouldReduceMotion ? 0 : parallaxY,
          scale: shouldReduceMotion ? 1 : parallaxScale
        }}
      >
        {mediaContent}
      </motion.div>
    </div>
  );
}
