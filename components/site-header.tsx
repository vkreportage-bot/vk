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

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[100] px-3 pt-3 sm:px-5 sm:pt-4 md:px-7 md:pt-5">
        <div
          className={[
            "container-vk pointer-events-auto relative mx-auto flex h-[64px] items-center justify-between overflow-hidden",
            "rounded-[22px] border border-white/30 px-4 sm:px-5 md:h-[68px] md:rounded-[24px] md:px-6",
            "bg-white/[0.34] text-black",
            "backdrop-blur-[30px] backdrop-saturate-[1.55]",
            "shadow-[0_10px_36px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.50)]",
            "transition-[background-color,border-color,box-shadow] duration-500",
            scrolled
              ? "bg-white/[0.46] border-white/40 shadow-[0_14px_42px_rgba(0,0,0,0.14),inset_0_1px_0_rgba(255,255,255,0.58)]"
              : ""
          ].join(" ")}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.26)_0%,rgba(255,255,255,0.08)_36%,rgba(255,255,255,0.03)_68%,rgba(255,255,255,0.18)_100%)]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-16 -top-16 h-32 w-56 rounded-full bg-white/30 blur-3xl"
          />

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
            className="relative z-10 hidden items-center gap-1 md:flex"
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
                    "hover:bg-white/30 hover:text-black",
                    active
                      ? "bg-white/32 text-black shadow-[inset_0_1px_0_rgba(255,255,255,0.38)]"
                      : "text-black/70 hover:text-black"
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
            className="relative z-[120] flex h-10 w-10 items-center justify-center rounded-full bg-white/20 transition-colors duration-300 hover:bg-white/35 md:hidden"
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
        <div className="absolute inset-0 bg-white/[0.38] backdrop-blur-[36px] backdrop-saturate-[1.55]" />

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.30)_0%,rgba(255,255,255,0.08)_46%,rgba(255,255,255,0.16)_100%)]" />
        <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-white/40 blur-[90px]" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-black/[0.05] blur-[100px]" />

        <div className="container-vk relative flex min-h-[100svh] flex-col pb-8 pt-28 text-black">
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
                      active ? "bg-white/24" : "hover:bg-white/18",
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
              "text-[10px] uppercase tracking-[0.14em] text-black/55",
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
