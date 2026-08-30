import Link from "next/link";
import { ArrowDownRight } from "lucide-react";

export function Hero() {
  return (
    <section className="bg-[var(--light)] text-[var(--dark)] h-screen">
      <div className="container-vk flex min-h-[88svh] flex-col justify-center pt-28 md:pt-32">
        <div className="w-full">
          <p className="eyebrow mb-8 text-[var(--muted)]">
            VK / Vidéaste
          </p>

          <h1 className="mx-auto max-w-[1250px] text-[clamp(4rem,7.6vw,8rem)] leading-[0.9] tracking-[-0.065em]">
            Des histoires humaines,
            <br />
            mises en images.
          </h1>

          <div className="mt-14 grid gap-8 pt-7 md:grid-cols-12 md:items-end">
            <p className="max-w-xl text-sm leading-6 text-[var(--muted)] md:col-span-6 md:text-base md:leading-7">
              Films de mariage, événements et réalisations audiovisuelles.
              Une approche naturelle, documentaire et cinématographique.
            </p>

            <div className="md:col-span-3 md:col-start-10 md:flex md:justify-end">
              <Link
                href="#projets"
                className="group inline-flex items-center gap-2 text-sm font-semibold"
              >
                Voir les films

                <ArrowDownRight
                  size={16}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}