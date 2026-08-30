import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const allowedTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "video/mp4",
  "video/webm",
  "video/quicktime"
]);

const extensionByType: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "video/quicktime": ".mov"
};

function validateFile(file: File) {
  if (!allowedTypes.has(file.type)) {
    throw new Error("Unsupported media type.");
  }

  const maxMb = Number(process.env.MAX_UPLOAD_MB || 100);
  if (!Number.isFinite(maxMb) || maxMb <= 0) {
    throw new Error("MAX_UPLOAD_MB must be a positive number.");
  }

  if (file.size > maxMb * 1024 * 1024) {
    throw new Error(`File exceeds ${maxMb} MB.`);
  }
}

async function saveMediaLocally(file: File) {
  const extension = extensionByType[file.type] || ".bin";
  const filename = `${randomUUID()}${extension}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");

  await mkdir(uploadDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), buffer);

  return `/uploads/${filename}`;
}

function getSupabaseConfig() {
  const url = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "")
    .trim()
    .replace(/\/+$/, "");
  const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  const bucket = (process.env.SUPABASE_STORAGE_BUCKET || "media").trim();

  if (!url || !serviceRoleKey) return null;

  if (!/^https:\/\//.test(url)) {
    throw new Error("SUPABASE_URL must be an https URL.");
  }

  if (!/^[a-zA-Z0-9._-]+$/.test(bucket)) {
    throw new Error("SUPABASE_STORAGE_BUCKET contains invalid characters.");
  }

  return { url, serviceRoleKey, bucket };
}

async function saveMediaToSupabase(file: File) {
  const config = getSupabaseConfig();
  if (!config) {
    throw new Error(
      "Supabase Storage is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  const now = new Date();
  const year = String(now.getUTCFullYear());
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const extension = extensionByType[file.type] || ".bin";
  const objectPath = `uploads/${year}/${month}/${randomUUID()}${extension}`;
  const encodedObjectPath = objectPath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  const uploadUrl = `${config.url}/storage/v1/object/${encodeURIComponent(config.bucket)}/${encodedObjectPath}`;
  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      "Content-Type": file.type,
      "Cache-Control": "31536000",
      "x-upsert": "false"
    },
    body: file
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(
      `Supabase Storage upload failed (${response.status})${details ? `: ${details}` : "."}`
    );
  }

  return `${config.url}/storage/v1/object/public/${encodeURIComponent(config.bucket)}/${encodedObjectPath}`;
}

export async function saveMedia(file: File) {
  validateFile(file);

  const mode = (process.env.MEDIA_STORAGE || "").trim().toLowerCase();
  const hasSupabase = Boolean(getSupabaseConfig());

  if (mode === "local" && process.env.NODE_ENV !== "production") {
    return saveMediaLocally(file);
  }

  if (mode === "supabase" || hasSupabase) {
    return saveMediaToSupabase(file);
  }

  if (mode === "local" && process.env.NODE_ENV === "production") {
    throw new Error(
      "Local media storage is not persistent on Vercel. Configure Supabase Storage for production."
    );
  }

  throw new Error(
    "No media storage configured. Use MEDIA_STORAGE=local for development or configure Supabase Storage."
  );
}
