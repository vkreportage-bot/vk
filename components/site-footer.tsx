"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="border-t hairline">
      <div className="container-vk grid gap-10 py-10 md:grid-cols-3 md:items-end">
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
    </footer>
  );
}
