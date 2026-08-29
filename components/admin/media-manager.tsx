"use client";

import { useState } from "react";
import { Trash2, Upload } from "lucide-react";
import type { MediaItem } from "@/types";

export function MediaManager({
  projectId,
  initialMedia
}: {
  projectId: string;
  initialMedia: MediaItem[];
}) {
  const [media, setMedia] = useState(initialMedia);
  const [videoUrl, setVideoUrl] = useState("");
  const [message, setMessage] = useState("");

  async function refresh() {
    const response = await fetch(`/api/admin/projects/${projectId}/media`);
    if (response.ok) setMedia(await response.json());
  }

  async function addUrl(type: "IMAGE" | "VIDEO", url: string) {
    const response = await fetch(`/api/admin/projects/${projectId}/media`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, url })
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Impossible d'ajouter le média.");
    }

    await refresh();
  }

  async function upload(file?: File) {
    if (!file) return;
    setMessage("Upload…");

    const body = new FormData();
    body.append("file", file);
    const uploadResponse = await fetch("/api/admin/media", {
      method: "POST",
      body
    });
    const uploadData = await uploadResponse.json();

    if (!uploadResponse.ok) {
      setMessage(uploadData.error || "Erreur upload.");
      return;
    }

    try {
      await addUrl(file.type.startsWith("video/") ? "VIDEO" : "IMAGE", uploadData.url);
      setMessage("Média ajouté.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erreur.");
    }
  }

  async function remove(id: string) {
    await fetch(`/api/admin/projects/${projectId}/media?id=${id}`, {
      method: "DELETE"
    });
    await refresh();
  }

  return (
    <div className="mt-6 rounded-2xl border border-black/10 bg-white p-6">
      <h2 className="text-lg font-semibold">Médias du projet</h2>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-black/20 p-5 text-sm">
          <Upload size={16} />
          Upload photo / vidéo
          <input
            type="file"
            accept="image/*,video/mp4,video/webm,video/quicktime"
            className="hidden"
            onChange={(event) => upload(event.target.files?.[0])}
          />
        </label>

        <form
          className="flex gap-2"
          onSubmit={async (event) => {
            event.preventDefault();
            if (!videoUrl) return;
            try {
              await addUrl("VIDEO", videoUrl);
              setVideoUrl("");
            } catch (error) {
              setMessage(error instanceof Error ? error.message : "Erreur.");
            }
          }}
        >
          <input
            value={videoUrl}
            onChange={(event) => setVideoUrl(event.target.value)}
            placeholder="URL YouTube"
            className="min-w-0 flex-1 rounded-xl border border-black/15 px-3 text-sm"
          />
          <button className="rounded-xl bg-black px-4 text-sm text-white">Ajouter</button>
        </form>
      </div>

      {message ? <p className="mt-3 text-xs text-black/50">{message}</p> : null}

      <div className="mt-6 divide-y divide-black/10">
        {media.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-4 py-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold">{item.type}</p>
              <p className="truncate text-sm text-black/50">{item.url}</p>
            </div>
            <button
              type="button"
              onClick={() => remove(item.id)}
              className="rounded-lg border border-black/10 p-2"
              aria-label="Supprimer"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
