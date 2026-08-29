import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { extractYouTubeId } from "@/lib/youtube";

export async function GET(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url).searchParams.get("url") || "";
  const id = extractYouTubeId(url);

  if (!id) {
    return NextResponse.json({ error: "Invalid YouTube URL." }, { status: 400 });
  }

  if (!process.env.YOUTUBE_API_KEY) {
    return NextResponse.json({
      id,
      thumbnail: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`
    });
  }

  const endpoint = new URL("https://www.googleapis.com/youtube/v3/videos");
  endpoint.searchParams.set("part", "snippet,contentDetails");
  endpoint.searchParams.set("id", id);
  endpoint.searchParams.set("key", process.env.YOUTUBE_API_KEY);

  const response = await fetch(endpoint, { next: { revalidate: 86400 } });
  if (!response.ok) {
    return NextResponse.json({ error: "YouTube API error." }, { status: 502 });
  }

  const data = await response.json();
  const item = data.items?.[0];

  if (!item) {
    return NextResponse.json({ error: "Video not found." }, { status: 404 });
  }

  return NextResponse.json({
    id,
    title: item.snippet?.title,
    description: item.snippet?.description,
    thumbnail:
      item.snippet?.thumbnails?.maxres?.url ||
      item.snippet?.thumbnails?.high?.url ||
      `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    duration: item.contentDetails?.duration
  });
}
