import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import {
  getHeroMediaTypeFromMime,
  validateHeroFileBasics
} from "@/lib/hero-upload-rules";

const extensionByMime: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "video/mp4": "mp4",
  "video/webm": "webm"
};

function encodeStoragePath(path: string) {
  return path
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      fileName?: string;
      fileType?: string;
      fileSize?: number;
    };

    const fileType = typeof body.fileType === "string" ? body.fileType : "";
    const fileSize = Number(body.fileSize || 0);
    const validationError = validateHeroFileBasics({
      type: fileType,
      size: fileSize
    });

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const mediaType = getHeroMediaTypeFromMime(fileType);
    const extension = extensionByMime[fileType];

    if (!mediaType || !extension) {
      return NextResponse.json(
        { error: "Format de fichier invalide." },
        { status: 400 }
      );
    }

    const storageMode = process.env.MEDIA_STORAGE || "local";

    if (storageMode === "local") {
      if (process.env.VERCEL) {
        return NextResponse.json(
          {
            error:
              "Le stockage local n’est pas persistant sur Vercel. Configurez MEDIA_STORAGE=supabase avant d’envoyer un média Hero."
          },
          { status: 503 }
        );
      }

      return NextResponse.json({ mode: "local", mediaType });
    }

    if (storageMode !== "supabase") {
      return NextResponse.json(
        { error: `Stockage inconnu : ${storageMode}.` },
        { status: 503 }
      );
    }

    const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const bucket = process.env.SUPABASE_MEDIA_BUCKET || "media";

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        {
          error:
            "Supabase Storage n’est pas configuré. Ajoutez SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY."
        },
        { status: 503 }
      );
    }

    const objectPath = `hero/${randomUUID()}.${extension}`;
    const encodedBucket = encodeURIComponent(bucket);
    const encodedPath = encodeStoragePath(objectPath);
    const storageBase = `${supabaseUrl}/storage/v1`;

    const signedResponse = await fetch(
      `${storageBase}/object/upload/sign/${encodedBucket}/${encodedPath}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${serviceRoleKey}`,
          apikey: serviceRoleKey,
          "Content-Type": "application/json"
        },
        body: "{}",
        cache: "no-store"
      }
    );

    const signedData = (await signedResponse.json()) as {
      url?: string;
      message?: string;
      error?: string;
    };

    if (!signedResponse.ok || !signedData.url) {
      return NextResponse.json(
        {
          error:
            signedData.message ||
            signedData.error ||
            "Impossible de créer l’URL d’upload Supabase. Vérifiez que le bucket existe."
        },
        { status: 502 }
      );
    }

    const signedUrl = signedData.url.startsWith("http")
      ? signedData.url
      : `${storageBase}${signedData.url.startsWith("/") ? "" : "/"}${signedData.url}`;

    const publicUrl = `${storageBase}/object/public/${encodedBucket}/${encodedPath}`;

    return NextResponse.json({
      mode: "supabase",
      mediaType,
      signedUrl,
      publicUrl,
      objectPath
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Impossible de préparer l’upload."
      },
      { status: 400 }
    );
  }
}
