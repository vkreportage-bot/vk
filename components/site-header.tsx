"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { label: "Projets", href: "/projects" },
  { label: "À propos", href: "/about" },
  { label: "Journal", href: "/blog" },
  { label: "Contact", href: "/contact" }
];

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = menuOpen ? "hidden" : previousOverflow;

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function closeMenu() {
    setMenuOpen(false);
  }

  const darkHeader = isHome && !menuOpen;

  const shellClass = darkHeader
    ? [
        "border-white/[0.14] bg-black/28 text-white",
        "shadow-[0_10px_40px_rgba(0,0,0,0.12)]",
        scrolled ? "bg-black/42 shadow-[0_12px_45px_rgba(0,0,0,0.20)]" : ""
      ].join(" ")
    : [
        "border-black/[0.07] bg-[rgba(248,246,241,0.78)] text-[var(--dark)]",
        "shadow-[0_10px_40px_rgba(20,20,20,0.07)]",
        scrolled ? "bg-[rgba(248,246,241,0.90)] shadow-[0_12px_45px_rgba(20,20,20,0.10)]" : ""
      ].join(" ");

  const navHoverClass = darkHeader
    ? "hover:bg-white/[0.10] hover:text-white"
    : "hover:bg-black/[0.055] hover:text-black";

  const activeClass = darkHeader
    ? "bg-white/[0.12] text-white"
    : "bg-black/[0.06] text-black";

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[100] px-3 pt-3 sm:px-5 sm:pt-4 md:px-7 md:pt-5">
        <div
          className={[
            "container-vk pointer-events-auto mx-auto flex h-[64px] items-center justify-between",
            "rounded-[22px] border px-4 sm:px-5 md:h-[68px] md:rounded-[24px] md:px-6",
            "backdrop-blur-2xl backdrop-saturate-[1.35]",
            "transition-[background-color,border-color,box-shadow,color] duration-500",
            shellClass
          ].join(" ")}
        >
          <Link
            href="/"
            aria-label="VK — Accueil"
            onClick={closeMenu}
            className="relative z-[120] flex h-10 items-center text-[1.1rem] font-bold tracking-[-0.065em] transition-opacity duration-300 hover:opacity-55"
          >
            VK
          </Link>

          <nav
            aria-label="Navigation principale"
            className="hidden items-center gap-1 md:flex"
          >
            {navigation.map((item) => {
              const active = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "relative rounded-full px-4 py-2.5",
                    "text-[11px] font-semibold uppercase tracking-[0.18em]",
                    "transition-[background-color,color,opacity] duration-300",
                    navHoverClass,
                    active ? activeClass : "opacity-80"
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
            className={[
              "relative z-[120] flex h-10 w-10 items-center justify-center rounded-full md:hidden",
              "transition-colors duration-300",
              darkHeader ? "bg-white/[0.10]" : "bg-black/[0.05]"
            ].join(" ")}
          >
            <span className="relative block h-4 w-5">
              <span
                className={[
                  "absolute left-0 top-[4px] block h-px w-5 bg-current",
                  "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  menuOpen
                    ? "translate-y-[4px] rotate-45"
                    : "translate-y-0 rotate-0"
                ].join(" ")}
              />
              <span
                className={[
                  "absolute bottom-[3px] left-0 block h-px w-5 bg-current",
                  "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  menuOpen
                    ? "-translate-y-[4px] -rotate-45"
                    : "translate-y-0 rotate-0"
                ].join(" ")}
              />
            </span>
          </button>
        </div>
      </header>

      <div
        id="mobile-navigation"
        aria-hidden={!menuOpen}
        className={[
          "fixed inset-0 z-[90] md:hidden",
          "transition-[opacity,visibility] duration-500",
          menuOpen
            ? "visible pointer-events-auto opacity-100"
            : "invisible pointer-events-none opacity-0"
        ].join(" ")}
      >
        <div className="absolute inset-0 bg-[rgba(243,241,236,0.92)] backdrop-blur-3xl backdrop-saturate-150" />

        <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-white/60 blur-[90px]" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-black/[0.06] blur-[100px]" />

        <div className="container-vk relative flex min-h-[100svh] flex-col pb-8 pt-28 text-[var(--dark)]">
          <nav
            aria-label="Navigation mobile"
            className="flex flex-1 flex-col justify-center"
          >
            <div className="space-y-1">
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
                      "group flex items-center justify-between rounded-[22px] px-4 py-4",
                      "transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                      active ? "bg-black/[0.055]" : "hover:bg-black/[0.035]",
                      menuOpen
                        ? "translate-y-0 opacity-100"
                        : "translate-y-7 opacity-0"
                    ].join(" ")}
                    style={{
                      transitionDelay: menuOpen ? `${80 + index * 65}ms` : "0ms"
                    }}
                  >
                    <span className="text-[clamp(2.7rem,12vw,4.8rem)] leading-[0.94] tracking-[-0.06em]">
                      {item.label}
                    </span>

                    <span
                      className={[
                        "text-[10px] font-semibold tracking-[0.18em] transition-opacity",
                        active ? "opacity-100" : "opacity-30"
                      ].join(" ")}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </Link>
                );
              })}
            </div>
          </nav>

          <div
            className={[
              "flex items-end justify-between gap-6 border-t border-black/[0.08] pt-5",
              "text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]",
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
