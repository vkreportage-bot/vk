export function extractYouTubeId(input: string) {
  try {
    const url = new URL(input);

    if (url.hostname === "youtu.be") {
      return url.pathname.slice(1) || null;
    }

    if (url.hostname.includes("youtube.com")) {
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
