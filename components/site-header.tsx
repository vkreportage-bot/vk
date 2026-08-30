"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    label: "Projets",
    href: "/projects"
  },
  {
    label: "À propos",
    href: "/about"
  },
  
   {
    label: "Journal",
    href: "/blog"
  },
  {
    label: "Contact",
    href: "/contact"
  }
];

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Bloque le scroll de la page quand le menu est ouvert
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = menuOpen ? "hidden" : previousOverflow;

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  // Fermeture avec Escape
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[100]">
        <div className="container-vk flex h-24 items-center justify-between md:h-28">
          {/* LOGO */}
          <Link
            href="/"
            aria-label="VK — Accueil"
            onClick={closeMenu}
            className="relative z-[120] text-xl font-bold tracking-[-0.06em] text-[var(--dark)]"
          >
            VK
          </Link>

          {/* NAVIGATION DESKTOP */}
          <nav
            aria-label="Navigation principale"
            className="hidden items-center gap-10 md:flex"
          >
            {navigation.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "text-xs font-semibold uppercase tracking-[0.18em]",
                    "text-[var(--dark)] transition-opacity duration-300",
                    "hover:opacity-50",
                    active ? "opacity-50" : ""
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* BOUTON MOBILE */}
          <button
            type="button"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
            className="relative z-[120] flex h-11 w-11 items-center justify-center text-[var(--dark)] md:hidden"
          >
            <span className="relative block h-4 w-6">
              <span
                className={[
                  "absolute left-0 top-[3px] block h-px w-6 bg-current",
                  "transition-all duration-500 ease-out",
                  menuOpen
                    ? "translate-y-[5px] rotate-45"
                    : "translate-y-0 rotate-0"
                ].join(" ")}
              />

              <span
                className={[
                  "absolute bottom-[3px] left-0 block h-px w-6 bg-current",
                  "transition-all duration-500 ease-out",
                  menuOpen
                    ? "-translate-y-[5px] -rotate-45"
                    : "translate-y-0 rotate-0"
                ].join(" ")}
              />
            </span>
          </button>
        </div>
      </header>

      {/* MENU MOBILE */}
    <div
  id="mobile-navigation"
  aria-hidden={!menuOpen}
  className={[
    "fixed inset-0 z-[90] md:hidden",
    "transition-opacity duration-500",
    menuOpen
      ? "pointer-events-auto opacity-100"
      : "pointer-events-none opacity-0"
  ].join(" ")}
>
        {/* FOND DÉPOLI */}
        <div
          className={[
            "absolute inset-0",
            "bg-[rgba(242,240,235,0.72)]",
            "backdrop-blur-2xl backdrop-saturate-150",
            "transition-opacity duration-500",
            menuOpen ? "opacity-100" : "opacity-0"
          ].join(" ")}
        />

        {/* LÉGER VOILE */}
        <div
          className={[
            "absolute inset-0 bg-white/10",
            "transition-opacity duration-500",
            menuOpen ? "opacity-100" : "opacity-0"
          ].join(" ")}
        />

        {/* CONTENU */}
        <div className="container-vk relative flex min-h-[100svh] flex-col pb-10 pt-28">
          <nav
            aria-label="Navigation mobile"
            className="flex flex-1 flex-col justify-center"
          >
            <div className="border-t hairline">
              {navigation.map((item, index) => {
                const active = pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    tabIndex={menuOpen ? 0 : -1}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "group grid grid-cols-[1fr_auto] items-center",
                      "border-b hairline py-6",
                      "transition-all duration-700 ease-out",
                      menuOpen
                        ? "translate-y-0 opacity-100"
                        : "translate-y-8 opacity-0"
                    ].join(" ")}
                    style={{
                      transitionDelay: menuOpen
                        ? `${100 + index * 70}ms`
                        : "0ms"
                    }}
                  >
                    <span className="text-[clamp(2.8rem,13vw,5rem)] leading-[0.95] tracking-[-0.055em]">
                      {item.label}
                    </span>

                    <span
                      className={[
                        "text-xs tracking-[0.18em] transition-opacity",
                        active ? "opacity-100" : "opacity-35"
                      ].join(" ")}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* FOOTER */}
          <div
            className={[
              "flex items-end justify-between gap-6",
              "border-t hairline pt-5",
              "text-[10px] uppercase tracking-[0.14em]",
              "text-[var(--muted)]",
              "transition-all duration-700",
              menuOpen
                ? "translate-y-0 opacity-100 delay-300"
                : "translate-y-4 opacity-0 delay-0"
            ].join(" ")}
          >
            <span>VK / Vidéaste</span>
            <span className="text-right">Films & histoires humaines</span>
          </div>
        </div>
      </div>
    </>
  );
}