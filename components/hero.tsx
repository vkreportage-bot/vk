import Link from "next/link";
import { ArrowDown } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-black text-white">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(0,0,0,.12), rgba(0,0,0,.55)), url('https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=2200&q=88')"
        }}
      />
      <div className="absolute inset-0 bg-black/15" />

      <div className="container-vk relative flex min-h-[100svh] flex-col justify-end pb-10 pt-32 md:pb-14">
        <p className="eyebrow mb-5 text-white/70">Films · stories · moments</p>
        <h1 className="display-title max-w-7xl">
          Raconter
          <br />
          ce qui reste.
        </h1>

        <div className="mt-10 flex items-end justify-between gap-10 border-t border-white/25 pt-5">
          <p className="max-w-md text-sm leading-6 text-white/70 md:text-base">
            VK crée des films de mariage, d&apos;événement et des portraits
            visuels avec une esthétique cinématographique et naturelle.
          </p>

          <Link
            href="#projets"
            aria-label="Découvrir les projets"
            className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/40"
          >
            <ArrowDown size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
