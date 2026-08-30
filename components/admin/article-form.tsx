"use client";

import { useState } from "react";
import { ExternalLink, Eye, Trash2, Upload } from "lucide-react";
import { BlogContent } from "@/components/blog-content";
import { slugify } from "@/lib/utils";
import type { Article } from "@/types";

export function ArticleForm({ article }: { article?: Article }) {
  const [title, setTitle] = useState(article?.title ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [content, setContent] = useState(article?.content ?? "");
  const [coverUrl, setCoverUrl] = useState(article?.coverUrl ?? "");
  const [message, setMessage] = useState("");

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
      setMessage("Image envoyée.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erreur upload.");
    }
  }

  return (
    <div className="space-y-6">
      <form
        action={article ? `/api/admin/blog/${article.id}` : "/api/admin/blog"}
        method="post"
        className="space-y-7 rounded-2xl border border-black/10 bg-white p-6 md:p-8"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-medium">
            Titre
            <input
              name="title"
              value={title}
              onChange={(event) => {
                const next = event.target.value;
                setTitle(next);
                if (!article) setSlug(slugify(next));
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
            defaultValue={article?.excerpt}
            required
            rows={4}
            maxLength={320}
            className="mt-2 w-full rounded-lg border border-black/15 px-3 py-3 leading-6"
          />
          <span className="mt-1 block text-xs font-normal text-black/40">
            Utilisé sur la page blog et comme description par défaut dans les moteurs.
          </span>
        </label>

        <div className="grid gap-5 xl:grid-cols-2">
          <label className="block text-sm font-medium">
            Contenu Markdown
            <textarea
              name="content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              required
              rows={24}
              className="mt-2 min-h-[560px] w-full resize-y rounded-lg border border-black/15 px-3 py-3 font-mono text-sm leading-6"
              placeholder={
                "## Intertitre\n\nVotre paragraphe avec **du gras**, *de l’italique* et [un lien](https://example.com).\n\n- Élément de liste\n- Deuxième élément\n\n> Une citation\n\n```js\nconsole.log('VK');\n```"
              }
            />
            <span className="mt-1 block text-xs font-normal leading-5 text-black/40">
              Markdown complet avec React Markdown : titres, listes, liens, gras, italique, citations,
              code, tableaux et listes de tâches.
            </span>
          </label>

          <section aria-label="Aperçu Markdown" className="min-w-0">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Eye size={15} /> Aperçu en direct
            </div>
            <div className="mt-2 h-[560px] overflow-y-auto rounded-lg border border-black/10 bg-[#f7f5f0] p-5 md:p-6">
              {content.trim() ? (
                <BlogContent content={content} compact />
              ) : (
                <p className="text-sm leading-6 text-black/35">
                  Commence à écrire dans l’éditeur pour afficher l’aperçu de l’article.
                </p>
              )}
            </div>
          </section>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_220px]">
          <div>
            <p className="text-sm font-medium">Image de couverture</p>
            <div className="mt-2 flex gap-2">
              <input
                name="coverUrl"
                value={coverUrl}
                onChange={(event) => setCoverUrl(event.target.value)}
                placeholder="URL ou upload"
                className="min-w-0 flex-1 rounded-lg border border-black/15 px-3 py-3 text-sm"
              />
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-black/15 px-4 text-sm transition hover:bg-black/[0.035]">
                <Upload size={15} /> Photo
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

          {coverUrl ? (
            <div className="aspect-[4/3] overflow-hidden bg-black/5">
              <img src={coverUrl} alt="" className="h-full w-full object-cover" />
            </div>
          ) : null}
        </div>

        <label className="block text-sm font-medium">
          Texte alternatif de la couverture
          <input
            name="coverAlt"
            defaultValue={article?.coverAlt ?? ""}
            maxLength={180}
            className="mt-2 w-full rounded-lg border border-black/15 px-3 py-3"
            placeholder="Décrire précisément ce que montre l’image"
          />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-medium">
            Auteur
            <input
              name="author"
              defaultValue={article?.author ?? "VK"}
              required
              className="mt-2 w-full rounded-lg border border-black/15 px-3 py-3"
            />
          </label>

          <label className="text-sm font-medium">
            Date de publication
            <input
              name="publishedAt"
              type="date"
              defaultValue={article?.publishedAt?.toISOString().slice(0, 10) ?? ""}
              className="mt-2 w-full rounded-lg border border-black/15 px-3 py-3"
            />
          </label>
        </div>

        <label className="block text-sm font-medium">
          Mots-clés
          <input
            name="keywords"
            defaultValue={article?.keywords.join(", ") ?? ""}
            className="mt-2 w-full rounded-lg border border-black/15 px-3 py-3"
            placeholder="vidéaste, mariage, film, Haute-Savoie"
          />
          <span className="mt-1 block text-xs font-normal text-black/40">
            Séparer les termes par des virgules. Ils servent aussi au JSON-LD.
          </span>
        </label>

        <div className="border-t border-black/10 pt-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/35">SEO</p>
          <div className="mt-5 space-y-5">
            <label className="block text-sm font-medium">
              Meta title
              <input
                name="metaTitle"
                defaultValue={article?.metaTitle ?? ""}
                maxLength={70}
                className="mt-2 w-full rounded-lg border border-black/15 px-3 py-3"
                placeholder="Laisser vide pour utiliser le titre de l’article"
              />
            </label>
            <label className="block text-sm font-medium">
              Meta description
              <textarea
                name="metaDescription"
                defaultValue={article?.metaDescription ?? ""}
                maxLength={170}
                rows={3}
                className="mt-2 w-full rounded-lg border border-black/15 px-3 py-3"
                placeholder="Laisser vide pour utiliser le résumé"
              />
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-black/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              name="published"
              type="checkbox"
              value="true"
              defaultChecked={article?.published}
            />
            Article publié
          </label>

          <div className="flex flex-wrap items-center gap-3">
            {article?.published ? (
              <a
                href={`/blog/${article.slug}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-black/15 px-5 text-sm font-medium"
              >
                Voir l’article <ExternalLink size={15} />
              </a>
            ) : null}
            <button className="min-h-11 rounded-full bg-black px-6 text-sm font-semibold text-white">
              {article ? "Enregistrer" : "Créer l’article"}
            </button>
          </div>
        </div>
      </form>

      {article ? (
        <form
          action={`/api/admin/blog/${article.id}/delete`}
          method="post"
          onSubmit={(event) => {
            if (!window.confirm("Supprimer définitivement cet article ?")) {
              event.preventDefault();
            }
          }}
          className="flex justify-end"
        >
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-red-700 transition hover:bg-red-50"
          >
            <Trash2 size={15} /> Supprimer l’article
          </button>
        </form>
      ) : null}
    </div>
  );
}
