import type { MediaType } from "@/types";

export const HERO_IMAGE_MAX_BYTES = 8 * 1024 * 1024;
export const HERO_VIDEO_MAX_BYTES = 35 * 1024 * 1024;
export const HERO_VIDEO_MAX_DURATION_SECONDS = 20;
export const HERO_IMAGE_MIN_WIDTH = 1600;
export const HERO_IMAGE_MIN_HEIGHT = 900;
export const HERO_VIDEO_MIN_WIDTH = 1280;
export const HERO_VIDEO_MIN_HEIGHT = 720;

export const HERO_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif"
] as const;

export const HERO_VIDEO_MIME_TYPES = ["video/mp4", "video/webm"] as const;

const imageTypes = new Set<string>(HERO_IMAGE_MIME_TYPES);
const videoTypes = new Set<string>(HERO_VIDEO_MIME_TYPES);

export function getHeroMediaTypeFromMime(mimeType: string): MediaType | null {
  if (imageTypes.has(mimeType)) return "IMAGE";
  if (videoTypes.has(mimeType)) return "VIDEO";
  return null;
}

export function validateHeroFileBasics(file: { type: string; size: number }) {
  if (!Number.isFinite(file.size) || file.size <= 0) {
    return "Le fichier est vide ou sa taille est invalide.";
  }

  const mediaType = getHeroMediaTypeFromMime(file.type);

  if (!mediaType) {
    return "Format non pris en charge. Utilisez JPG, PNG, WebP, AVIF, MP4 ou WebM.";
  }

  const maxBytes =
    mediaType === "IMAGE" ? HERO_IMAGE_MAX_BYTES : HERO_VIDEO_MAX_BYTES;

  if (file.size > maxBytes) {
    const maxMb = Math.round(maxBytes / 1024 / 1024);
    return `Le fichier dépasse la limite de ${maxMb} Mo.`;
  }

  return null;
}
