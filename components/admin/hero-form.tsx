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
import { HeroMedia } from "@/components/hero-media";
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
import { extractYouTubeId } from "@/lib/youtube";
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

function hasMinimumDimensions(
  width: number,
  height: number,
  landscapeWidth: number,
  landscapeHeight: number
) {
  const longEdge = Math.max(width, height);
  const shortEdge = Math.min(width, height);
  const requiredLongEdge = Math.max(landscapeWidth, landscapeHeight);
  const requiredShortEdge = Math.min(landscapeWidth, landscapeHeight);

  return longEdge >= requiredLongEdge && shortEdge >= requiredShortEdge;
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
      !hasMinimumDimensions(
        metadata.width,
        metadata.height,
        HERO_IMAGE_MIN_WIDTH,
        HERO_IMAGE_MIN_HEIGHT
      )
    ) {
      throw new Error(
        `Image trop petite : ${HERO_IMAGE_MIN_WIDTH} × ${HERO_IMAGE_MIN_HEIGHT} px en paysage ou ${HERO_IMAGE_MIN_HEIGHT} × ${HERO_IMAGE_MIN_WIDTH} px en portrait minimum.`
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
    !hasMinimumDimensions(
      metadata.width,
      metadata.height,
      HERO_VIDEO_MIN_WIDTH,
      HERO_VIDEO_MIN_HEIGHT
    )
  ) {
    throw new Error(
      `Vidéo trop petite : ${HERO_VIDEO_MIN_WIDTH} × ${HERO_VIDEO_MIN_HEIGHT} px en paysage ou ${HERO_VIDEO_MIN_HEIGHT} × ${HERO_VIDEO_MIN_WIDTH} px en portrait minimum.`
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
  const isYoutubeMedia = Boolean(
    mediaType === "VIDEO" && mediaUrl && extractYouTubeId(mediaUrl)
  );

  return (
    <div className="grid w-full min-w-0 gap-6 py-6 sm:gap-8 sm:py-8 xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
      <section className="min-w-0">
        <div className="mb-4 flex min-w-0 flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/35">
              Aperçu
            </p>
            <h2 className="mt-2 max-w-full text-xl font-semibold tracking-[-0.035em] sm:text-2xl">
              Hero de la page d’accueil
            </h2>
          </div>

          {hasMedia ? (
            <span className="shrink-0 self-start rounded-full border border-black/10 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-black/50 sm:self-auto">
              {isYoutubeMedia
                ? "YouTube"
                : mediaType === "VIDEO"
                  ? "Vidéo"
                  : "Image"}
            </span>
          ) : null}
        </div>

        <div className="relative aspect-[4/5] w-full max-w-full overflow-hidden rounded-2xl bg-[#e9e7e1] text-[#111] shadow-[0_1px_0_rgba(0,0,0,0.06)] ring-1 ring-black/10 sm:aspect-[16/10] sm:min-h-[420px]">
          {hasMedia && mediaType && mediaUrl ? (
            <>
              <HeroMedia mediaType={mediaType} mediaUrl={mediaUrl} />
              <div className="absolute inset-0 bg-black/22" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/5 to-black/45" />
            </>
          ) : null}

          <div
            className={`absolute inset-0 flex min-w-0 flex-col justify-center px-4 py-6 sm:px-8 sm:py-8 lg:px-12 ${
              hasMedia ? "text-white" : "text-[#111]"
            }`}
          >
            <p
              className={`mb-4 text-[9px] font-semibold uppercase tracking-[0.18em] sm:mb-5 sm:text-[10px] sm:tracking-[0.2em] ${
                hasMedia ? "text-white/65" : "text-black/40"
              }`}
            >
              VK / Vidéaste
            </p>
            <h3 className="max-w-full text-[clamp(2rem,11vw,3.25rem)] leading-[0.92] tracking-[-0.055em] sm:max-w-4xl sm:text-[clamp(2.5rem,5vw,5rem)] sm:leading-[0.9] sm:tracking-[-0.065em]">
              Des histoires humaines,
              <br />
              mises en images.
            </h3>
            <p
              className={`mt-5 max-w-md text-[11px] leading-5 sm:mt-8 sm:text-sm ${
                hasMedia ? "text-white/75" : "text-black/45"
              }`}
            >
              Films de mariage, événements et réalisations audiovisuelles. Une
              approche naturelle, documentaire et cinématographique.
            </p>
          </div>
        </div>
      </section>

      <aside className="min-w-0 space-y-5 sm:space-y-6">
        <section className="min-w-0 rounded-2xl border border-black/10 bg-white p-4 sm:p-6">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-black text-white">
              <Upload size={17} />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-semibold">Média du hero</h2>
              <p className="mt-1 break-words text-xs leading-5 text-black/45">
                Importez un fichier paysage ou portrait, ou utilisez une vidéo YouTube.
              </p>
            </div>
          </div>

          <label
            className={`mt-5 flex min-h-32 w-full min-w-0 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-black/20 px-3 text-center transition hover:border-black/45 hover:bg-black/[0.025] sm:px-5 ${
              uploading ? "pointer-events-none opacity-60" : ""
            }`}
          >
            {uploading ? (
              <LoaderCircle className="animate-spin" size={22} />
            ) : (
              <Upload size={22} />
            )}
            <span className="mt-3 max-w-full break-words text-sm font-medium">
              {uploading ? "Envoi en cours…" : "Choisir une image ou une vidéo"}
            </span>
            <span className="mt-1 max-w-full break-words text-xs text-black/40">
              Paysage ou portrait · JPG, PNG, WebP, AVIF, MP4 ou WebM
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

          <div className="my-5 flex min-w-0 items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-black/30">
            <span className="h-px min-w-0 flex-1 bg-black/10" />
            ou
            <span className="h-px min-w-0 flex-1 bg-black/10" />
          </div>

          <div className="min-w-0">
            <label htmlFor="hero-youtube-url" className="text-sm font-medium">
              Vidéo YouTube
            </label>
            <div className="mt-2 flex min-w-0 flex-col gap-2 sm:flex-row">
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
                className="w-full min-w-0 rounded-xl border border-black/15 px-3 py-2.5 text-sm outline-none transition focus:border-black/40"
              />
              <button
                type="button"
                onClick={useYoutubeVideo}
                className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-black px-4 text-xs font-semibold text-white transition hover:bg-black/80 sm:w-auto"
              >
                <Youtube size={15} />
                Utiliser
              </button>
            </div>
            <p className="mt-2 break-words text-xs leading-5 text-black/40">
              Liens youtube.com, youtu.be, Shorts et URLs d’intégration acceptés. Les Shorts utilisent automatiquement le cadrage portrait.
            </p>
          </div>

          {uploadInfo ? (
            <div className="mt-4 min-w-0 rounded-xl bg-black/[0.035] p-4 text-xs text-black/55">
              <p className="truncate font-medium text-black/75">{uploadInfo.name}</p>
              <p className="mt-1 break-words">
                {uploadInfo.width} × {uploadInfo.height} px · {formatBytes(uploadInfo.size)}
                {uploadInfo.duration !== undefined
                  ? ` · ${uploadInfo.duration.toFixed(1)} s`
                  : ""}
              </p>
              <p className="mt-1 break-words text-black/40">
                {uploadInfo.height > uploadInfo.width ? "Format portrait détecté" : "Format paysage détecté"}
              </p>
            </div>
          ) : null}

          {hasMedia ? (
            <button
              type="button"
              onClick={removeMedia}
              className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-black/10 px-3 text-sm font-medium text-black/55 transition hover:border-black/25 hover:text-black"
            >
              <Trash2 size={15} /> Retirer le média
            </button>
          ) : null}
        </section>

        <section className="min-w-0 rounded-2xl border border-black/10 bg-white p-4 sm:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/35">
            Conditions d’upload
          </p>

          <div className="mt-4 min-w-0 space-y-4 text-xs leading-5 text-black/55">
            <div className="flex min-w-0 gap-3">
              <ImageIcon size={17} className="mt-0.5 shrink-0 text-black/70" />
              <div className="min-w-0">
                <p className="font-semibold text-black/80">Image</p>
                <p className="break-words">
                  JPG, PNG, WebP ou AVIF · {Math.round(HERO_IMAGE_MAX_BYTES / 1024 / 1024)} Mo max · {HERO_IMAGE_MIN_WIDTH} × {HERO_IMAGE_MIN_HEIGHT} px paysage ou {HERO_IMAGE_MIN_HEIGHT} × {HERO_IMAGE_MIN_WIDTH} px portrait minimum.
                </p>
              </div>
            </div>

            <div className="flex min-w-0 gap-3">
              <Film size={17} className="mt-0.5 shrink-0 text-black/70" />
              <div className="min-w-0">
                <p className="font-semibold text-black/80">Vidéo</p>
                <p className="break-words">
                  MP4 ou WebM · {Math.round(HERO_VIDEO_MAX_BYTES / 1024 / 1024)} Mo max · {HERO_VIDEO_MIN_WIDTH} × {HERO_VIDEO_MIN_HEIGHT} px paysage ou {HERO_VIDEO_MIN_HEIGHT} × {HERO_VIDEO_MIN_WIDTH} px portrait minimum · {HERO_VIDEO_MAX_DURATION_SECONDS} s max.
                </p>
              </div>
            </div>

            <div className="flex min-w-0 gap-3">
              <Youtube size={17} className="mt-0.5 shrink-0 text-black/70" />
              <div className="min-w-0">
                <p className="font-semibold text-black/80">YouTube</p>
                <p className="break-words">
                  Vidéo publique ou non répertoriée avec intégration autorisée. Les Shorts sont affichés en portrait avec un fond plein écran dérivé du média.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-4 break-words border-t border-black/10 pt-4 text-xs leading-5 text-black/40">
            Le Hero détecte automatiquement l’orientation. En desktop, un média portrait reste lisible au premier plan avec un fond agrandi et flouté ; sur mobile, il occupe naturellement davantage de l’écran.
          </p>
        </section>

        {status ? (
          <div
            className={`flex min-w-0 items-start gap-2 rounded-xl px-4 py-3 text-xs leading-5 ${
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
            <span className="min-w-0 break-words">{status.text}</span>
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
