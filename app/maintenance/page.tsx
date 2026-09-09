import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Site en maintenance | VK",
  description: "Le portfolio VK est temporairement indisponible.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false
    }
  }
};

export default function MaintenancePage() {
  return (
    <main className="min-h-dvh bg-[#f3f2ee] text-[#111]">
      <div className="mx-auto flex min-h-dvh w-full max-w-[1600px] flex-col px-5 py-5 sm:px-8 sm:py-7 lg:px-12 lg:py-10">
        <header className="flex items-center justify-between border-b border-black/10 pb-5 sm:pb-6">
          <p className="text-[28px] font-black leading-none tracking-[-0.09em] sm:text-[32px]">
            VK
          </p>

          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-black/45 sm:text-[11px]">
            <span className="size-2 rounded-full bg-black" />
            Maintenance
          </div>
        </header>

        <section className="flex flex-1 items-center py-14 sm:py-20 lg:py-24">
          <div className="max-w-5xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-black/35 sm:text-xs">
              VK / Portfolio
            </p>

            <h1 className="mt-5 max-w-5xl text-[clamp(3.5rem,10vw,9rem)] font-semibold leading-[0.84] tracking-[-0.075em]">
              Le site se refait une beauté.
            </h1>

            <p className="mt-8 max-w-2xl text-base leading-7 text-black/55 sm:mt-10 sm:text-lg sm:leading-8">
              Le portfolio est temporairement indisponible. Quelques ajustements sont en cours avant la remise en ligne.
            </p>
          </div>
        </section>

        <footer className="flex flex-col gap-3 border-t border-black/10 pt-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-black/35 sm:flex-row sm:items-center sm:justify-between sm:pt-6 sm:text-[11px]">
          <span>Retour très bientôt</span>
          <span>VK / Vidéaste</span>
        </footer>
      </div>
    </main>
  );
}
