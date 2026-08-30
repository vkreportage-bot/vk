"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const links = [
  {
    href: "/projects",
    label: "Projets",
  },
  {
    href: "/blog",
    label: "Journal",
  },
  {
    href: "/about",
    label: "À propos",
  },
  {
    href: "/contact",
    label: "Contact",
  },
];

export function SiteHeader() {
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return null;
  }

  return (
    <header
      className={cn(
        "z-50 w-full transition-colors duration-300",

        isHome
          ? "absolute inset-x-0 top-0 text-white"
          : "relative border-b border-black/10 bg-[var(--background)] text-black",
      )}
    >
      <div className="container-vk flex h-[76px] items-center justify-between md:h-[88px]">
        {/* LOGO */}
        <Link
          href="/"
          aria-label="VK — Accueil"
          className="
            text-[26px]
            font-black
            leading-none
            tracking-[-0.09em]
            transition-opacity
            hover:opacity-55
          "
        >
          VK
        </Link>

        {/* NAVIGATION */}
        <nav
          aria-label="Navigation principale"
          className="flex items-center gap-3 sm:gap-6 md:gap-9"
        >
          {links.map((link) => {
            const active =
              pathname === link.href ||
              pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  `
                    relative
                    py-2
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.14em]
                    transition-opacity
                    duration-200
                    sm:text-[10px]
                    sm:tracking-[0.17em]
                    md:text-[11px]
                  `,

                  isHome
                    ? "text-white/75 hover:text-white"
                    : "text-black/45 hover:text-black",

                  active &&
                    (isHome
                      ? "text-white"
                      : "text-black"),
                )}
              >
                {link.label}

                {/* INDICATEUR ACTIF */}
                <span
                  className={cn(
                    `
                      absolute
                      -bottom-[1px]
                      left-0
                      h-px
                      w-full
                      origin-left
                      transition-transform
                      duration-300
                    `,
                    isHome ? "bg-white" : "bg-black",
                    active ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}