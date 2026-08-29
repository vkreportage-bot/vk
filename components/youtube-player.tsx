import { youtubeEmbedUrl } from "@/lib/youtube";

export function YouTubePlayer({
  url,
  title
}: {
  url: string;
  title: string;
}) {
  const embedUrl = youtubeEmbedUrl(url);
  if (!embedUrl) return null;

  return (
    <div className="aspect-video overflow-hidden bg-black">
      <iframe
        src={embedUrl}
        title={title}
        className="size-full"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}
