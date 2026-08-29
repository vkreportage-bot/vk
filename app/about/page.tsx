import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos",
  description: "L'approche VK : une réalisation vidéo naturelle, sensible et cinématographique."
};

export default function AboutPage() {
  return (
    <div className="container-vk min-h-screen pb-24 pt-36 md:pt-44">
      <p className="eyebrow mb-5">À propos</p>
      <h1 className="section-title max-w-5xl">
        Filmer les personnes avant de filmer la performance.
      </h1>

      <div className="mt-14 grid gap-10 border-t hairline pt-10 md:grid-cols-12">
        <p className="text-sm text-(--muted) md:col-span-3">VK / Vidéaste</p>
        <div className="space-y-6 text-xl leading-8 md:col-span-7 md:col-start-5">
          <p>
            VK développe une approche documentaire et cinématographique de la vidéo,
            avec une attention particulière portée aux gestes, à la lumière et au son.
          </p>
          <p>
            Mariage, événement, portrait ou projet personnel : chaque film cherche
            d&apos;abord une histoire et un rythme propres plutôt qu&apos;une formule.
          </p>
        </div>
      </div>
    </div>
  );
}
