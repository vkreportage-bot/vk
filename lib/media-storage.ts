import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const allowedTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "video/mp4",
  "video/webm",
  "video/quicktime"
]);

const extensionByMime: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "video/quicktime": ".mov"
};

function validateMedia(file: File) {
  if (!allowedTypes.has(file.type)) {
    throw new Error("Unsupported media type.");
  }

  const maxMb = Number(process.env.MAX_UPLOAD_MB || 100);
  if (!Number.isFinite(maxMb) || maxMb <= 0) {
    throw new Error("Invalid MAX_UPLOAD_MB configuration.");
  }

  if (file.size <= 0 || file.size > maxMb * 1024 * 1024) {
    throw new Error(`File exceeds ${maxMb} MB or is empty.`);
  }
}

function encodeStoragePath(value: string) {
  return value
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
}

async function saveLocally(file: File) {
  if (process.env.VERCEL) {
    throw new Error(
      "Local media storage is not persistent on Vercel. Configure MEDIA_STORAGE=supabase."
    );
  }

  const extension =
    extensionByMime[file.type] || path.extname(file.name).toLowerCase() || ".bin";
  const filename = `${randomUUID()}${extension}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");

  await mkdir(uploadDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), buffer);

  return `/uploads/${filename}`;
}

async function saveToSupabase(file: File) {
  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_MEDIA_BUCKET || "media";

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Supabase Storage is not configured. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  const extension =
    extensionByMime[file.type] || path.extname(file.name).toLowerCase() || ".bin";
  const objectPath = `uploads/${randomUUID()}${extension}`;
  const encodedBucket = encodeURIComponent(bucket);
  const encodedPath = encodeStoragePath(objectPath);
  const storageBase = `${supabaseUrl}/storage/v1`;

  const body = new FormData();
  body.append("cacheControl", "31536000");
  body.append("", file, file.name);

  const response = await fetch(
    `${storageBase}/object/${encodedBucket}/${encodedPath}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serviceRoleKey}`,
        apikey: serviceRoleKey,
        "x-upsert": "false"
      },
      body,
      cache: "no-store"
    }
  );

  if (!response.ok) {
    let message = "Supabase media upload failed.";
    try {
      const payload = (await response.json()) as {
        message?: string;
        error?: string;
      };
      message = payload.message || payload.error || message;
    } catch {}
    throw new Error(message);
  }

  return `${storageBase}/object/public/${encodedBucket}/${encodedPath}`;
}

export async function saveMediaLocally(file: File) {
  validateMedia(file);

  const storageMode = process.env.MEDIA_STORAGE || "local";

  if (storageMode === "local") return saveLocally(file);
  if (storageMode === "supabase") return saveToSupabase(file);

  throw new Error(`Unsupported MEDIA_STORAGE value: ${storageMode}`);
}
