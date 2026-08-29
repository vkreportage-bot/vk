import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contacter VK pour un projet vidéo, un mariage, un événement ou une collaboration."
};

export default function ContactPage() {
  return (
    <div className="container-vk min-h-screen pb-24 pt-36 md:pt-44">
      <p className="eyebrow mb-5">Contact</p>
      <h1 className="section-title max-w-5xl">Un projet à raconter ?</h1>

      <div className="mt-14 grid gap-10 border-t hairline pt-10 md:grid-cols-12">
        <p className="text-sm text-[var(--muted)] md:col-span-3">
          Décrivez simplement le projet, le lieu et la date envisagée.
        </p>
        <div className="md:col-span-7 md:col-start-5">
          <a
            href={`mailto:${siteConfig.email}`}
            className="block border-b hairline pb-4 text-2xl tracking-[-0.03em] md:text-4xl"
          >
            {siteConfig.email}
          </a>
        </div>
      </div>
    </div>
  );
}
