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

export async function saveMediaLocally(file: File) {
  if (process.env.MEDIA_STORAGE !== "local") {
    throw new Error(
      "No production media adapter configured. Replace lib/media-storage.ts with R2/S3/Cloudinary."
    );
  }

  if (!allowedTypes.has(file.type)) {
    throw new Error("Unsupported media type.");
  }

  const maxMb = Number(process.env.MAX_UPLOAD_MB || 100);
  if (file.size > maxMb * 1024 * 1024) {
    throw new Error(`File exceeds ${maxMb} MB.`);
  }

  const extension = path.extname(file.name).toLowerCase() || ".bin";
  const filename = `${randomUUID()}${extension}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");

  await mkdir(uploadDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), buffer);

  return `/uploads/${filename}`;
}
