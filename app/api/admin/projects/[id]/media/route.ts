import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { extractYouTubeId } from "@/lib/youtube";

const mediaSchema = z.object({
  type: z.enum(["IMAGE", "VIDEO"]),
  url: z.string().min(1)
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const media = await prisma.media.findMany({
    where: { projectId: id },
    orderBy: { sortOrder: "asc" }
  });
  return NextResponse.json(media);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "DATABASE_URL required." }, { status: 503 });
  }

  const { id } = await params;
  const result = mediaSchema.safeParse(await request.json());

  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
  }

  if (
    result.data.type === "VIDEO" &&
    !result.data.url.startsWith("/") &&
    !extractYouTubeId(result.data.url)
  ) {
    return NextResponse.json(
      { error: "Use a YouTube URL or an uploaded local video URL." },
      { status: 400 }
    );
  }

  const count = await prisma.media.count({ where: { projectId: id } });

  const media = await prisma.media.create({
    data: {
      projectId: id,
      type: result.data.type,
      url: result.data.url,
      sortOrder: count
    }
  });

  return NextResponse.json(media, { status: 201 });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: projectId } = await params;
  const mediaId = new URL(request.url).searchParams.get("id");

  if (!mediaId) {
    return NextResponse.json({ error: "Missing media id." }, { status: 400 });
  }

  await prisma.media.deleteMany({
    where: { id: mediaId, projectId }
  });

  return NextResponse.json({ ok: true });
}
