export function extractYouTubeId(input: string) {
  try {
    const url = new URL(input);
    const hostname = url.hostname.replace(/^www\./, "");

    if (hostname === "youtu.be") {
      return url.pathname.slice(1).split("/")[0] || null;
    }

    const isYouTubeHost =
      hostname === "youtube.com" ||
      hostname.endsWith(".youtube.com") ||
      hostname === "youtube-nocookie.com" ||
      hostname.endsWith(".youtube-nocookie.com");

    if (isYouTubeHost) {
      if (url.pathname.startsWith("/shorts/")) {
        return url.pathname.split("/")[2] || null;
      }
      if (url.pathname.startsWith("/embed/")) {
        return url.pathname.split("/")[2] || null;
      }
      return url.searchParams.get("v");
    }

    return null;
  } catch {
    return /^[a-zA-Z0-9_-]{11}$/.test(input) ? input : null;
  }
}

export function youtubeEmbedUrl(input: string) {
  const id = extractYouTubeId(input);
  return id
    ? `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`
    : null;
}

export function youtubeHeroEmbedUrl(input: string) {
  const id = extractYouTubeId(input);

  return id
    ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${id}&playsinline=1&rel=0&modestbranding=1&disablekb=1&fs=0`
    : null;
}

export function isYouTubeUrl(input: string) {
  return Boolean(extractYouTubeId(input));
}
