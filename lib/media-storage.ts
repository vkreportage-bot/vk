import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const extensionsByType: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "video/quicktime": ".mov"
};

export async function saveMediaLocally(file: File) {
  if (process.env.MEDIA_STORAGE !== "local") {
    throw new Error(
      "No production media adapter configured. Replace lib/media-storage.ts with R2/S3/Cloudinary."
    );
  }

  const extension = extensionsByType[file.type];
  if (!extension) {
    throw new Error("Unsupported media type.");
  }

  const maxMb = Number(process.env.MAX_UPLOAD_MB || 100);
  if (!Number.isFinite(maxMb) || maxMb <= 0) {
    throw new Error("Invalid MAX_UPLOAD_MB configuration.");
  }

  if (file.size <= 0 || file.size > maxMb * 1024 * 1024) {
    throw new Error(`File must be between 1 byte and ${maxMb} MB.`);
  }

  const filename = `${randomUUID()}${extension}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");

  await mkdir(uploadDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), buffer, { flag: "wx" });

  return `/uploads/${filename}`;
}
