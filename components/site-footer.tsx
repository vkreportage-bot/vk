"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="border-t hairline">
      <div className="container-vk grid gap-10 py-10 md:grid-cols-3 md:items-end">
        <div>
          <p className="text-3xl font-black tracking-[-0.08em]">VK</p>
          <p className="mt-2 max-w-sm text-sm text-[var(--muted)]">
            Films de mariage, événementiel et histoires visuelles.
          </p>
        </div>

        <div className="flex flex-wrap gap-5 text-sm md:justify-center">
          <Link href="/projects">Projets</Link>
          <Link href="/blog">Journal</Link>
          <Link href="/about">À propos</Link>
          <Link href="/contact">Contact</Link>
        </div>

        <div className="text-sm text-[var(--muted)] md:text-right">
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          <p className="mt-1">© {new Date().getFullYear()} VK</p>
        </div>
      </div>
    </footer>
  );
}
