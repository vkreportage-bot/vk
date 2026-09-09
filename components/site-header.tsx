"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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
    const handleScroll = () => setScrolled(window.scrollY > 20);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (menuOpen) {
      document.body.style.overflow = "hidden";
    }

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
      {/* Desktop */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[100] hidden px-4 pt-4 md:block">
        <div
          className={[
            "pointer-events-auto relative mx-auto flex h-[68px] w-fit items-center justify-center overflow-hidden",
            "rounded-[24px] border border-white/25 px-3",
            "bg-white/[0.18] text-black",
            "backdrop-blur-3xl backdrop-saturate-150",
            "shadow-[0_10px_40px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.35)]",
            "transition-all duration-500",
            scrolled
              ? "bg-white/[0.24] shadow-[0_14px_50px_rgba(0,0,0,0.14),inset_0_1px_0_rgba(255,255,255,0.42)]"
              : ""
          ].join(" ")}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.26)_0%,rgba(255,255,255,0.10)_42%,rgba(255,255,255,0.06)_100%)]"
          />

          <nav
            aria-label="Navigation principale"
            className="relative z-10 flex items-center gap-1"
          >
            {navigation.map((item) => {
              const active = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "rounded-full px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em]",
                    "transition-all duration-300",
                    active
                      ? "bg-white/[0.26] text-black shadow-[inset_0_1px_0_rgba(255,255,255,0.30)]"
                      : "text-black/75 hover:bg-white/[0.18] hover:text-black"
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Mobile : un seul bouton flottant */}
      <motion.button
        type="button"
        aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={menuOpen}
        aria-controls="mobile-navigation"
        onClick={() => setMenuOpen((open) => !open)}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 420, damping: 24 }}
        className={[
          "fixed right-5 top-5 z-[140] flex h-14 w-14 items-center justify-center rounded-full text-black md:hidden",
          "transition-all duration-300",
          menuOpen
            ? "border border-transparent bg-transparent shadow-none backdrop-blur-none backdrop-saturate-100"
            : "border border-white/35 bg-transparent shadow-[0_10px_30px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.45)]"
        ].join(" ")}
      >
        <span className="relative block h-5 w-5">
          <motion.span
            className="absolute left-0 top-[6px] block h-px w-5 bg-current"
            animate={menuOpen ? { y: 3, rotate: 45 } : { y: 0, rotate: 0 }}
            transition={{ type: "spring", stiffness: 360, damping: 22 }}
          />
          <motion.span
            className="absolute left-0 top-[13px] block h-px w-5 bg-current"
            animate={menuOpen ? { y: -4, rotate: -45 } : { y: 0, rotate: 0 }}
            transition={{ type: "spring", stiffness: 360, damping: 22 }}
          />
        </span>
      </motion.button>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="mobile-navigation"
            className="fixed inset-0 z-[120] overflow-hidden md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.26, ease: "easeOut" }}
          >
            {/* Flou global du contenu derrière */}
            <motion.div
              className="absolute inset-0 bg-white/[0.24] backdrop-blur-[26px] backdrop-saturate-150"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.34)_0%,rgba(255,255,255,0.20)_42%,rgba(255,255,255,0.16)_100%)]"
            />

            {/* Panneau verre dépoli */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.985, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, scale: 0.985, filter: "blur(8px)" }}
              transition={{ type: "spring", stiffness: 240, damping: 24, mass: 0.9 }}
              className={[
                "relative mx-4 mt-4 min-h-[calc(100svh-2rem)] overflow-hidden rounded-[32px]",
                "border border-white/30 bg-white/[0.20] text-black",
                "backdrop-blur-3xl backdrop-saturate-150",
                "shadow-[0_20px_70px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.40)]"
              ].join(" ")}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.34)_0%,rgba(255,255,255,0.12)_36%,rgba(255,255,255,0.08)_100%)]"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-white/30 blur-[90px]"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-20 right-0 h-72 w-72 rounded-full bg-stone-200/30 blur-[90px]"
              />

              <div className="relative z-10 flex min-h-[calc(100svh-2rem)] flex-col px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06, duration: 0.35 }}
                  className="flex h-14 items-center"
                >
                  <Link
                    href="/"
                    aria-label="VK — Accueil"
                    onClick={closeMenu}
                    className="text-[1.9rem] font-bold tracking-[-0.06em]"
                  >
                    VK
                  </Link>
                </motion.div>

                <nav
                  aria-label="Navigation mobile"
                  className="flex flex-1 flex-col justify-center py-8"
                >
                  <div className="space-y-1">
                    {navigation.map((item, index) => {
                      const active = pathname.startsWith(item.href);

                      return (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, y: 24, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{
                            delay: 0.06 + index * 0.05,
                            type: "spring",
                            stiffness: 220,
                            damping: 22
                          }}
                        >
                          <Link
                            href={item.href}
                            onClick={closeMenu}
                            aria-current={active ? "page" : undefined}
                            className={[
                              "flex items-center justify-between rounded-[24px] px-3 py-5",
                              "transition-colors duration-300",
                              active ? "bg-white/[0.18]" : "hover:bg-white/[0.12]"
                            ].join(" ")}
                          >
                            <span className="text-[clamp(2.8rem,12vw,4.8rem)] leading-[0.94] tracking-[-0.065em]">
                              {item.label}
                            </span>

                            <span className="text-[11px] font-semibold tracking-[0.18em] text-black/30">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </nav>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ delay: 0.22, duration: 0.35 }}
                  className="flex items-end justify-between gap-4 border-t border-black/[0.08] pt-5 text-[10px] uppercase tracking-[0.14em] text-black/50"
                >
                  <span>VK / Vidéaste</span>
                  <span className="text-right">Films & histoires humaines</span>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
