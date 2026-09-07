import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { MediaType } from "@/types";

function isMissingTable(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2021"
  );
}

function isValidMediaType(value: unknown): value is MediaType {
  return value === "IMAGE" || value === "VIDEO";
}

function isValidMediaUrl(value: string) {
  return value.startsWith("/") || /^https?:\/\//i.test(value);
}

export async function PUT(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "Base de données non configurée." },
      { status: 503 }
    );
  }

  try {
    const body = (await request.json()) as {
      mediaType?: MediaType | null;
      mediaUrl?: string | null;
    };

    const mediaUrl = typeof body.mediaUrl === "string" ? body.mediaUrl.trim() : null;
    const mediaType = body.mediaType ?? null;

    if (mediaUrl && !isValidMediaType(mediaType)) {
      return NextResponse.json(
        { error: "Le type du média est invalide." },
        { status: 400 }
      );
    }

    if (mediaUrl && !isValidMediaUrl(mediaUrl)) {
      return NextResponse.json(
        { error: "L’URL du média est invalide." },
        { status: 400 }
      );
    }

    const hero = await prisma.heroSettings.upsert({
      where: { id: "home" },
      create: {
        id: "home",
        mediaType: mediaUrl ? mediaType : null,
        mediaUrl: mediaUrl || null
      },
      update: {
        mediaType: mediaUrl ? mediaType : null,
        mediaUrl: mediaUrl || null
      }
    });

    return NextResponse.json({ hero });
  } catch (error) {
    if (isMissingTable(error)) {
      return NextResponse.json(
        {
          error:
            "La table HeroSettings n’existe pas encore. Exécutez `npx prisma migrate deploy` puis réessayez."
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Impossible d’enregistrer le hero."
      },
      { status: 500 }
    );
  }
}
