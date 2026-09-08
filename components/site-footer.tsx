"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const localLinks = [
  { label: "Paris", href: "/photographe-videaste/paris" },
  { label: "Triel-sur-Seine", href: "/photographe-videaste/triel-sur-seine" },
  { label: "Versailles", href: "/photographe-videaste/versailles" },
  {
    label: "Saint-Germain-en-Laye",
    href: "/photographe-videaste/saint-germain-en-laye",
  },
];

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="border-t hairline">
      <div className="container-vk py-10">
        <div className="grid gap-10 md:grid-cols-3 md:items-end">
          <div>
            <p className="text-3xl font-black tracking-[-0.08em]">VK</p>
          </div>

          <div className="flex flex-wrap gap-5 text-sm md:justify-center">
            <Link href="/projects">Projets</Link>
            <Link href="/blog">Journal</Link>
            <Link href="/about">À propos</Link>
            <Link href="/contact">Contact</Link>
          </div>

          <div className="text-sm text-[var(--muted)] md:text-right">
            <p>© {new Date().getFullYear()} VK</p>
          </div>
        </div>

        <nav
          aria-label="Photographe et vidéaste par secteur"
          className="mt-8 flex flex-wrap gap-x-5 gap-y-2 border-t hairline pt-6 text-xs text-[var(--muted)]"
        >
          {localLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-[var(--foreground)]">
              Photographe & vidéaste {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
