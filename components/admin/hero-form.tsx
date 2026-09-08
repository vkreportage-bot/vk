"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  CheckCircle2,
  Film,
  ImageIcon,
  LoaderCircle,
  Save,
  Trash2,
  Upload,
  Youtube
} from "lucide-react";
import {
  HERO_IMAGE_MAX_BYTES,
  HERO_IMAGE_MIN_HEIGHT,
  HERO_IMAGE_MIN_WIDTH,
  HERO_VIDEO_MAX_BYTES,
  HERO_VIDEO_MAX_DURATION_SECONDS,
  HERO_VIDEO_MIN_HEIGHT,
  HERO_VIDEO_MIN_WIDTH,
  getHeroMediaTypeFromMime,
  validateHeroFileBasics
} from "@/lib/hero-upload-rules";
import { extractYouTubeId, youtubeHeroEmbedUrl } from "@/lib/youtube";
import type { HeroSettings, MediaType } from "@/types";

type UploadInfo = {
  name: string;
  width: number;
  height: number;
  duration?: number;
  size: number;
};

type Status = {
  kind: "success" | "error" | "info";
  text: string;
} | null;

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / 1024 / 1024).toFixed(1)} Mo`;
}

function readImageMetadata(file: File) {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Impossible de lire les dimensions de l’image."));
    };
    image.src = url;
  });
}

function readVideoMetadata(file: File) {
  return new Promise<{ width: number; height: number; duration: number }>(
    (resolve, reject) => {
      const url = URL.createObjectURL(file);
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        URL.revokeObjectURL(url);
        resolve({
          width: video.videoWidth,
          height: video.videoHeight,
          duration: video.duration
        });
      };
      video.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Impossible de lire les informations de la vidéo."));
      };
      video.src = url;
    }
  );
}

async function validateHeroFile(file: File) {
  const basicError = validateHeroFileBasics(file);
  if (basicError) throw new Error(basicError);

  const mediaType = getHeroMediaTypeFromMime(file.type);
  if (!mediaType) throw new Error("Format de fichier invalide.");

  if (mediaType === "IMAGE") {
    const metadata = await readImageMetadata(file);

    if (
      metadata.width < HERO_IMAGE_MIN_WIDTH ||
      metadata.height < HERO_IMAGE_MIN_HEIGHT
    ) {
      throw new Error(
        `Image trop petite : ${HERO_IMAGE_MIN_WIDTH} × ${HERO_IMAGE_MIN_HEIGHT} px minimum.`
      );
    }

    return {
      mediaType,
      info: {
        name: file.name,
        width: metadata.width,
        height: metadata.height,
        size: file.size
      } satisfies UploadInfo
    };
  }

  const metadata = await readVideoMetadata(file);

  if (
    metadata.width < HERO_VIDEO_MIN_WIDTH ||
    metadata.height < HERO_VIDEO_MIN_HEIGHT
  ) {
    throw new Error(
      `Vidéo trop petite : ${HERO_VIDEO_MIN_WIDTH} × ${HERO_VIDEO_MIN_HEIGHT} px minimum.`
    );
  }

  if (
    !Number.isFinite(metadata.duration) ||
    metadata.duration > HERO_VIDEO_MAX_DURATION_SECONDS + 0.1
  ) {
    throw new Error(
      `La vidéo doit durer ${HERO_VIDEO_MAX_DURATION_SECONDS} secondes maximum.`
    );
  }

  return {
    mediaType,
    info: {
      name: file.name,
      width: metadata.width,
      height: metadata.height,
      duration: metadata.duration,
      size: file.size
    } satisfies UploadInfo
  };
}

export function HeroForm({
  initialHero
}: {
  initialHero: HeroSettings | null;
}) {
  const router = useRouter();
  const initialYoutubeUrl =
    initialHero?.mediaType === "VIDEO" &&
    initialHero.mediaUrl &&
    extractYouTubeId(initialHero.mediaUrl)
      ? initialHero.mediaUrl
      : "";

  const [mediaType, setMediaType] = useState<MediaType | null>(
    initialHero?.mediaType ?? null
  );
  const [mediaUrl, setMediaUrl] = useState(initialHero?.mediaUrl ?? "");
  const [youtubeUrl, setYoutubeUrl] = useState(initialYoutubeUrl);
  const [uploadInfo, setUploadInfo] = useState<UploadInfo | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  async function uploadToStorage(file: File, nextMediaType: MediaType) {
    const prepareResponse = await fetch("/api/admin/hero/upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size
      })
    });

    const prepared = await prepareResponse.json();
    if (!prepareResponse.ok) {
      throw new Error(prepared.error || "Impossible de préparer l’upload.");
    }

    if (prepared.mode === "local") {
      const body = new FormData();
      body.append("file", file);

      const localResponse = await fetch("/api/admin/hero/media", {
        method: "POST",
        body
      });
      const localData = await localResponse.json();

      if (!localResponse.ok) {
        throw new Error(localData.error || "Upload impossible.");
      }

      return localData.url as string;
    }

    const body = new FormData();
    body.append("cacheControl", "31536000");
    body.append("", file, file.name);

    const uploadResponse = await fetch(prepared.signedUrl as string, {
      method: "PUT",
      headers: { "x-upsert": "false" },
      body
    });

    if (!uploadResponse.ok) {
      let details = "";
      try {
        const payload = await uploadResponse.json();
        details = payload.message || payload.error || "";
      } catch {}
      throw new Error(details || "L’envoi vers le stockage a échoué.");
    }

    if (prepared.mediaType !== nextMediaType) {
      throw new Error("Le type de média retourné par le serveur est incohérent.");
    }

    return prepared.publicUrl as string;
  }

  async function onFile(file?: File) {
    if (!file) return;

    setUploading(true);
    setStatus({ kind: "info", text: "Vérification du média…" });

    try {
      const validated = await validateHeroFile(file);
      setUploadInfo(validated.info);
      setStatus({ kind: "info", text: "Envoi du média…" });

      const url = await uploadToStorage(file, validated.mediaType);
      setMediaType(validated.mediaType);
      setMediaUrl(url);
      setYoutubeUrl("");
      setStatus({
        kind: "success",
        text: "Média envoyé. Cliquez sur « Enregistrer le hero » pour le publier."
      });
    } catch (error) {
      setStatus({
        kind: "error",
        text: error instanceof Error ? error.message : "Erreur pendant l’upload."
      });
    } finally {
      setUploading(false);
    }
  }

  function useYoutubeVideo() {
    const value = youtubeUrl.trim();
    const videoId = extractYouTubeId(value);

    if (!videoId) {
      setStatus({
        kind: "error",
        text: "Lien YouTube invalide. Utilisez une URL youtube.com, youtu.be ou Shorts."
      });
      return;
    }

    setMediaType("VIDEO");
    setMediaUrl(value);
    setUploadInfo(null);
    setStatus({
      kind: "success",
      text: "Vidéo YouTube sélectionnée. Cliquez sur « Enregistrer le hero » pour la publier."
    });
  }

  async function saveHero() {
    setSaving(true);
    setStatus({ kind: "info", text: "Enregistrement…" });

    try {
      const response = await fetch("/api/admin/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mediaType: mediaUrl ? mediaType : null,
          mediaUrl: mediaUrl || null
        })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Impossible d’enregistrer le hero.");
      }

      setStatus({ kind: "success", text: "Hero enregistré et publié." });
      router.refresh();
    } catch (error) {
      setStatus({
        kind: "error",
        text: error instanceof Error ? error.message : "Erreur d’enregistrement."
      });
    } finally {
      setSaving(false);
    }
  }

  function removeMedia() {
    setMediaType(null);
    setMediaUrl("");
    setYoutubeUrl("");
    setUploadInfo(null);
    setStatus({
      kind: "info",
      text: "Média retiré de l’aperçu. Enregistrez pour appliquer la modification."
    });
  }

  const hasMedia = Boolean(mediaType && mediaUrl);
  const youtubePreviewUrl =
    mediaType === "VIDEO" && mediaUrl ? youtubeHeroEmbedUrl(mediaUrl) : null;

  return (
    <div className="grid gap-8 py-8 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/35">
              Aperçu
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em]">
              Hero de la page d’accueil
            </h2>
          </div>

          {hasMedia ? (
            <span className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-black/50">
              {youtubePreviewUrl
                ? "YouTube"
                : mediaType === "VIDEO"
                  ? "Vidéo"
                  : "Image"}
            </span>
          ) : null}
        </div>

        <div className="relative aspect-[16/10] min-h-[420px] overflow-hidden rounded-2xl bg-[#e9e7e1] text-[#111] shadow-[0_1px_0_rgba(0,0,0,0.06)] ring-1 ring-black/10">
          {hasMedia ? (
            <>
              {mediaType === "VIDEO" ? (
                youtubePreviewUrl ? (
                  <iframe
                    src={youtubePreviewUrl}
                    title="Aperçu de la vidéo YouTube du hero"
                    allow="autoplay; encrypted-media; picture-in-picture"
                    referrerPolicy="strict-origin-when-cross-origin"
                    tabIndex={-1}
                    className="pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.7778vh] min-w-full -translate-x-1/2 -translate-y-1/2 border-0"
                  />
                ) : (
                  <video
                    src={mediaUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={mediaUrl}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black/20 backdrop-blur-[4px]" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/5 to-black/40" />
            </>
          ) : null}

          <div
            className={`absolute inset-0 flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-12 ${
              hasMedia ? "text-white" : "text-[#111]"
            }`}
          >
            <p
              className={`mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] ${
                hasMedia ? "text-white/65" : "text-black/40"
              }`}
            >
              VK / Vidéaste
            </p>
            <h3 className="max-w-4xl text-[clamp(2.5rem,5vw,5rem)] leading-[0.9] tracking-[-0.065em]">
              Des histoires humaines,
              <br />
              mises en images.
            </h3>
            <p
              className={`mt-8 max-w-md text-xs leading-5 sm:text-sm ${
                hasMedia ? "text-white/75" : "text-black/45"
              }`}
            >
              Films de mariage, événements et réalisations audiovisuelles. Une
              approche naturelle, documentaire et cinématographique.
            </p>
          </div>
        </div>
      </section>

      <aside className="space-y-6">
        <section className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-black text-white">
              <Upload size={17} />
            </div>
            <div>
              <h2 className="text-base font-semibold">Média du hero</h2>
              <p className="mt-1 text-xs leading-5 text-black/45">
                Importez un fichier ou utilisez une vidéo YouTube.
              </p>
            </div>
          </div>

          <label
            className={`mt-5 flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-black/20 px-5 text-center transition hover:border-black/45 hover:bg-black/[0.025] ${
              uploading ? "pointer-events-none opacity-60" : ""
            }`}
          >
            {uploading ? (
              <LoaderCircle className="animate-spin" size={22} />
            ) : (
              <Upload size={22} />
            )}
            <span className="mt-3 text-sm font-medium">
              {uploading ? "Envoi en cours…" : "Choisir une image ou une vidéo"}
            </span>
            <span className="mt-1 text-xs text-black/40">
              JPG, PNG, WebP, AVIF, MP4 ou WebM
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm"
              className="hidden"
              disabled={uploading}
              onChange={(event) => {
                const file = event.target.files?.[0];
                void onFile(file);
                event.currentTarget.value = "";
              }}
            />
          </label>

          <div className="my-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-black/30">
            <span className="h-px flex-1 bg-black/10" />
            ou
            <span className="h-px flex-1 bg-black/10" />
          </div>

          <div>
            <label htmlFor="hero-youtube-url" className="text-sm font-medium">
              Vidéo YouTube
            </label>
            <div className="mt-2 flex gap-2">
              <input
                id="hero-youtube-url"
                type="url"
                value={youtubeUrl}
                onChange={(event) => setYoutubeUrl(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    useYoutubeVideo();
                  }
                }}
                placeholder="https://www.youtube.com/watch?v=..."
                className="min-w-0 flex-1 rounded-xl border border-black/15 px-3 py-2.5 text-sm outline-none transition focus:border-black/40"
              />
              <button
                type="button"
                onClick={useYoutubeVideo}
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-black px-3 text-xs font-semibold text-white transition hover:bg-black/80"
              >
                <Youtube size={15} />
                Utiliser
              </button>
            </div>
            <p className="mt-2 text-xs leading-5 text-black/40">
              Liens youtube.com, youtu.be, Shorts et URLs d’intégration acceptés.
            </p>
          </div>

          {uploadInfo ? (
            <div className="mt-4 rounded-xl bg-black/[0.035] p-4 text-xs text-black/55">
              <p className="truncate font-medium text-black/75">{uploadInfo.name}</p>
              <p className="mt-1">
                {uploadInfo.width} × {uploadInfo.height} px · {formatBytes(uploadInfo.size)}
                {uploadInfo.duration !== undefined
                  ? ` · ${uploadInfo.duration.toFixed(1)} s`
                  : ""}
              </p>
            </div>
          ) : null}

          {hasMedia ? (
            <button
              type="button"
              onClick={removeMedia}
              className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-black/10 text-sm font-medium text-black/55 transition hover:border-black/25 hover:text-black"
            >
              <Trash2 size={15} /> Retirer le média
            </button>
          ) : null}
        </section>

        <section className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/35">
            Conditions d’upload
          </p>

          <div className="mt-4 space-y-4 text-xs leading-5 text-black/55">
            <div className="flex gap-3">
              <ImageIcon size={17} className="mt-0.5 shrink-0 text-black/70" />
              <div>
                <p className="font-semibold text-black/80">Image</p>
                <p>
                  JPG, PNG, WebP ou AVIF · {Math.round(HERO_IMAGE_MAX_BYTES / 1024 / 1024)} Mo max · {HERO_IMAGE_MIN_WIDTH} × {HERO_IMAGE_MIN_HEIGHT} px minimum.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Film size={17} className="mt-0.5 shrink-0 text-black/70" />
              <div>
                <p className="font-semibold text-black/80">Vidéo</p>
                <p>
                  MP4 ou WebM · {Math.round(HERO_VIDEO_MAX_BYTES / 1024 / 1024)} Mo max · {HERO_VIDEO_MIN_WIDTH} × {HERO_VIDEO_MIN_HEIGHT} px minimum · {HERO_VIDEO_MAX_DURATION_SECONDS} s max.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Youtube size={17} className="mt-0.5 shrink-0 text-black/70" />
              <div>
                <p className="font-semibold text-black/80">YouTube</p>
                <p>
                  Vidéo publique ou non répertoriée avec intégration autorisée. Lecture automatique, muette et en boucle dans le hero.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-4 border-t border-black/10 pt-4 text-xs leading-5 text-black/40">
            Pour de bonnes performances, privilégiez un cadrage paysage 16:9. Pour YouTube, la vidéo doit autoriser la lecture intégrée sur des sites externes.
          </p>
        </section>

        {status ? (
          <div
            className={`flex items-start gap-2 rounded-xl px-4 py-3 text-xs leading-5 ${
              status.kind === "error"
                ? "bg-red-50 text-red-700"
                : status.kind === "success"
                  ? "bg-emerald-50 text-emerald-800"
                  : "bg-black/[0.045] text-black/60"
            }`}
          >
            {status.kind === "success" ? (
              <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
            ) : null}
            <span>{status.text}</span>
          </div>
        ) : null}

        <button
          type="button"
          disabled={saving || uploading}
          onClick={() => void saveHero()}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-black px-5 text-sm font-semibold text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? (
            <LoaderCircle size={17} className="animate-spin" />
          ) : (
            <Save size={17} />
          )}
          {saving ? "Enregistrement…" : "Enregistrer le hero"}
        </button>
      </aside>
    </div>
  );
}
