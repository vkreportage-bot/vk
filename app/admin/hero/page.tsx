import { redirect } from "next/navigation";
import { HeroForm } from "@/components/admin/hero-form";
import { isAdmin } from "@/lib/auth";
import { getHeroSettings } from "@/lib/repository";

export const dynamic = "force-dynamic";

export default async function AdminHeroPage() {
  if (!(await isAdmin())) redirect("/admin/login");

  const hero = await getHeroSettings();

  return (
    <div className="mx-auto max-w-6xl">
      <header className="border-b border-black/10 pb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/35">
          Page d’accueil
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">
          Hero
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-black/45">
          Choisissez l’image ou la vidéo affichée en plein écran derrière le titre du portfolio.
        </p>
      </header>

      <HeroForm initialHero={hero} />
    </div>
  );
}
