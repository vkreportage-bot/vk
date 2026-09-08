"use client";

import { useEffect, useState } from "react";
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
  const youtubeUrl = mediaType === "VIDEO" ? youtubeHeroEmbedUrl(mediaUrl) : null;
  const [portrait, setPortrait] = useState(() =>
    youtubeUrl ? isYouTubeShortUrl(mediaUrl) : false
  );

  useEffect(() => {
    setPortrait(youtubeUrl ? isYouTubeShortUrl(mediaUrl) : false);
  }, [mediaUrl, youtubeUrl]);

  const updateOrientation = (width: number, height: number) => {
    setPortrait(height > width);
  };

  if (youtubeUrl) {
    if (portrait) {
      return (
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
            className="pointer-events-none absolute left-1/2 top-1/2 aspect-[9/16] h-[105%] w-auto -translate-x-1/2 -translate-y-1/2 border-0 md:left-[72%] md:h-[94%]"
          />
        </>
      );
    }

    return (
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

  if (mediaType === "VIDEO") {
    if (portrait) {
      return (
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
            className="absolute left-1/2 top-1/2 h-[105%] w-auto max-w-none -translate-x-1/2 -translate-y-1/2 object-contain md:left-[72%] md:h-[94%]"
          />
        </>
      );
    }

    return (
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

  if (portrait) {
    return (
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
          className="absolute left-1/2 top-1/2 h-[105%] w-auto max-w-none -translate-x-1/2 -translate-y-1/2 object-contain md:left-[72%] md:h-[94%]"
        />
      </>
    );
  }

  return (
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
