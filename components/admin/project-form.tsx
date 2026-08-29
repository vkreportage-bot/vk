"use client";

import { useMemo, useState } from "react";
import { Plus, Upload } from "lucide-react";
import type { Category, Project } from "@/types";
import { slugify } from "@/lib/utils";

export function ProjectForm({
  categories,
  project
}: {
  categories: Category[];
  project?: Project;
}) {
  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [coverUrl, setCoverUrl] = useState(project?.coverUrl ?? "");
  const [message, setMessage] = useState("");

  const initialCategoryIds = useMemo(
    () => new Set(project?.categories.map((item) => item.id) ?? []),
    [project]
  );

  async function uploadFile(file: File) {
    const body = new FormData();
    body.append("file", file);

    const response = await fetch("/api/admin/media", {
      method: "POST",
      body
    });
    const data = await response.json();

    if (!response.ok) throw new Error(data.error || "Upload failed");
    return data.url as string;
  }

  async function onCover(file?: File) {
    if (!file) return;
    try {
      setMessage("Upload…");
      setCoverUrl(await uploadFile(file));
      setMessage("Média envoyé.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erreur upload.");
    }
  }

  return (
    <form
      action={project ? `/api/admin/projects/${project.id}` : "/api/admin/projects"}
      method="post"
      className="space-y-6 rounded-2xl border border-black/10 bg-white p-6"
    >
      <input type="hidden" name="_method" value={project ? "PATCH" : "POST"} />

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-medium">
          Titre
          <input
            name="title"
            value={title}
            onChange={(event) => {
              const next = event.target.value;
              setTitle(next);
              if (!project) setSlug(slugify(next));
            }}
            required
            className="mt-2 w-full rounded-lg border border-black/15 px-3 py-3"
          />
        </label>

        <label className="text-sm font-medium">
          Slug
          <input
            name="slug"
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            required
            className="mt-2 w-full rounded-lg border border-black/15 px-3 py-3"
          />
        </label>
      </div>

      <label className="block text-sm font-medium">
        Résumé
        <textarea
          name="excerpt"
          defaultValue={project?.excerpt}
          required
          rows={3}
          className="mt-2 w-full rounded-lg border border-black/15 px-3 py-3"
        />
      </label>

      <label className="block text-sm font-medium">
        Description
        <textarea
          name="description"
          defaultValue={project?.description}
          required
          rows={8}
          className="mt-2 w-full rounded-lg border border-black/15 px-3 py-3"
        />
      </label>

      <div className="grid gap-5 sm:grid-cols-3">
        <label className="text-sm font-medium">
          Client
          <input
            name="client"
            defaultValue={project?.client ?? ""}
            className="mt-2 w-full rounded-lg border border-black/15 px-3 py-3"
          />
        </label>
        <label className="text-sm font-medium">
          Lieu
          <input
            name="location"
            defaultValue={project?.location ?? ""}
            className="mt-2 w-full rounded-lg border border-black/15 px-3 py-3"
          />
        </label>
        <label className="text-sm font-medium">
          Année
          <input
            name="year"
            type="number"
            defaultValue={project?.year ?? new Date().getFullYear()}
            className="mt-2 w-full rounded-lg border border-black/15 px-3 py-3"
          />
        </label>
      </div>

      <div>
        <p className="text-sm font-medium">Image de couverture</p>
        <div className="mt-2 flex gap-2">
          <input
            name="coverUrl"
            value={coverUrl}
            onChange={(event) => setCoverUrl(event.target.value)}
            placeholder="URL ou upload"
            required
            className="min-w-0 flex-1 rounded-lg border border-black/15 px-3 py-3 text-sm"
          />
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-black/15 px-4 text-sm">
            <Upload size={15} />
            Photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => onCover(event.target.files?.[0])}
            />
          </label>
        </div>
        {message ? <p className="mt-2 text-xs text-black/50">{message}</p> : null}
      </div>

      <fieldset>
        <legend className="text-sm font-medium">Catégories</legend>
        <div className="mt-3 flex flex-wrap gap-3">
          {categories.map((category) => (
            <label key={category.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="categoryIds"
                value={category.id}
                defaultChecked={initialCategoryIds.has(category.id)}
              />
              {category.name}
            </label>
          ))}
        </div>
        <a
          href="/admin/categories"
          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold underline"
        >
          <Plus size={13} /> Créer une catégorie
        </a>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            name="featured"
            type="checkbox"
            value="true"
            defaultChecked={project?.featured}
          />
          Mettre en avant
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            name="published"
            type="checkbox"
            value="true"
            defaultChecked={project?.published}
          />
          Publié
        </label>
      </div>

      <div className="rounded-xl bg-black/[0.035] p-4 text-sm text-black/60">
        Les médias supplémentaires (photos + vidéos) se gèrent après création du
        projet dans sa fiche. La vidéo YouTube reste la méthode recommandée.
      </div>

      <button className="rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white">
        {project ? "Enregistrer" : "Créer le projet"}
      </button>
    </form>
  );
}
