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
    .filter(Boolean)
    .map((part) => encodeURIComponent(part))
    .join("/");
}

function getSupabaseAdminHeaders(apiKey: string) {
  const headers: Record<string, string> = {
    apikey: apiKey,
    "Content-Type": "application/json"
  };

  // Legacy service_role keys are JWTs and can be sent as Bearer tokens.
  // New sb_secret_* keys are opaque API keys and must use the apikey header.
  if (!apiKey.startsWith("sb_secret_")) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  return headers;
}

function getSupabaseOrigin(value: string) {
  const raw = value.trim();
  const url = new URL(raw);

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("SUPABASE_URL doit être une URL HTTP(S) valide.");
  }

  return url.origin;
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

    const storageMode = (process.env.MEDIA_STORAGE || "local").trim();

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

    const supabaseUrl = process.env.SUPABASE_URL;
    const adminKey = (
      process.env.SUPABASE_SECRET_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      ""
    ).trim();
    const bucket = (process.env.SUPABASE_MEDIA_BUCKET || "media").trim();

    if (!supabaseUrl || !adminKey) {
      return NextResponse.json(
        {
          error:
            "Supabase Storage n’est pas configuré. Ajoutez SUPABASE_URL et SUPABASE_SECRET_KEY (ou SUPABASE_SERVICE_ROLE_KEY)."
        },
        { status: 503 }
      );
    }

    if (!bucket || bucket.includes("/") || bucket.includes("\\")) {
      return NextResponse.json(
        { error: "SUPABASE_MEDIA_BUCKET contient un nom de bucket invalide." },
        { status: 503 }
      );
    }

    const supabaseOrigin = getSupabaseOrigin(supabaseUrl);
    const storageBase = `${supabaseOrigin}/storage/v1`;
    const objectPath = `hero/${randomUUID()}.${extension}`;
    const encodedBucket = encodeURIComponent(bucket);
    const encodedPath = encodeStoragePath(objectPath);
    const signedUploadPath = `/object/upload/sign/${encodedBucket}/${encodedPath}`;

    const signedResponse = await fetch(`${storageBase}${signedUploadPath}`, {
      method: "POST",
      headers: getSupabaseAdminHeaders(adminKey),
      body: "{}",
      cache: "no-store"
    });

    let signedData: {
      url?: string;
      message?: string;
      error?: string;
    } = {};

    try {
      signedData = (await signedResponse.json()) as typeof signedData;
    } catch {
      // Keep a clean fallback message below when Storage returns non-JSON.
    }

    if (!signedResponse.ok || !signedData.url) {
      return NextResponse.json(
        {
          error:
            signedData.message ||
            signedData.error ||
            `Impossible de créer l’URL d’upload Supabase (${signedResponse.status}).`
        },
        { status: 502 }
      );
    }

    // Supabase returns a relative signed upload URL containing a short-lived token.
    // Rebuild the final upload URL from our validated bucket/path and only reuse
    // that token. This prevents malformed/duplicated Storage paths in production.
    const returnedSignedUrl = signedData.url.startsWith("http")
      ? new URL(signedData.url)
      : new URL(`${storageBase}${signedData.url.startsWith("/") ? "" : "/"}${signedData.url}`);
    const token = returnedSignedUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Supabase n’a pas retourné de token d’upload signé." },
        { status: 502 }
      );
    }

    const signedUrl = `${storageBase}${signedUploadPath}?token=${encodeURIComponent(token)}`;
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
