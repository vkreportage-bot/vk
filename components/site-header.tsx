"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

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
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[100] hidden px-7 pt-5 md:block">
        <div
          className={[
            "pointer-events-auto relative mx-auto flex h-[68px] w-fit items-center justify-center overflow-hidden",
            "rounded-[24px] border border-white/30 px-3",
            "bg-white/[0.34] text-black",
            "backdrop-blur-[30px] backdrop-saturate-[1.55]",
            "shadow-[0_10px_36px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.50)]",
            "transition-[background-color,border-color,box-shadow] duration-500",
            scrolled
              ? "border-white/40 bg-white/[0.46] shadow-[0_14px_42px_rgba(0,0,0,0.14),inset_0_1px_0_rgba(255,255,255,0.58)]"
              : ""
          ].join(" ")}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.26)_0%,rgba(255,255,255,0.08)_36%,rgba(255,255,255,0.03)_68%,rgba(255,255,255,0.18)_100%)]"
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
                    "relative rounded-full px-5 py-2.5",
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
        </div>
      </header>

      {/* Mobile : uniquement le bouton d'ouverture */}
      <motion.button
        type="button"
        aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={menuOpen}
        aria-controls="mobile-navigation"
        onClick={() => setMenuOpen((open) => !open)}
        whileTap={{ scale: 0.88 }}
        transition={{ type: "spring", stiffness: 420, damping: 24 }}
        className={[
          "fixed right-5 top-5 z-[130] flex h-14 w-14 items-center justify-center md:hidden",
          "rounded-full border border-white/35 bg-white/[0.38] text-black",
          "backdrop-blur-[28px] backdrop-saturate-[1.6]",
          "shadow-[0_10px_32px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.65)]"
        ].join(" ")}
      >
        <span className="relative block h-5 w-6">
          <motion.span
            className="absolute left-0 top-[5px] block h-px w-6 bg-current"
            animate={
              menuOpen
                ? { y: 5, rotate: 45 }
                : { y: 0, rotate: 0 }
            }
            transition={{ type: "spring", stiffness: 360, damping: 22 }}
          />

          <motion.span
            className="absolute bottom-[5px] left-0 block h-px w-6 bg-current"
            animate={
              menuOpen
                ? { y: -5, rotate: -45 }
                : { y: 0, rotate: 0 }
            }
            transition={{ type: "spring", stiffness: 360, damping: 22 }}
          />
        </span>
      </motion.button>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="mobile-navigation"
            className="fixed inset-0 z-[120] overflow-hidden md:hidden"
            initial={{ opacity: 0, scale: 0.94, filter: "blur(18px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.97, filter: "blur(12px)" }}
            transition={{
              type: "spring",
              stiffness: 190,
              damping: 22,
              mass: 0.85
            }}
          >
            <div className="absolute inset-0 bg-white/[0.42] backdrop-blur-[42px] backdrop-saturate-[1.6]" />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.34)_0%,rgba(255,255,255,0.08)_48%,rgba(255,255,255,0.18)_100%)]"
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-24 top-16 h-80 w-80 rounded-full bg-white/45 blur-[100px]"
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-28 -right-24 h-96 w-96 rounded-full bg-black/[0.055] blur-[110px]"
            />

            <div className="container-vk relative flex min-h-[100svh] flex-col pb-[max(2rem,env(safe-area-inset-bottom))] pt-7 text-black">
              <motion.div
                initial={{ opacity: 0, y: -14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.4 }}
                className="flex h-14 items-center"
              >
                <Link
                  href="/"
                  aria-label="VK — Accueil"
                  onClick={closeMenu}
                  className="text-[1.35rem] font-bold tracking-[-0.07em]"
                >
                  VK
                </Link>
              </motion.div>

              <nav
                aria-label="Navigation mobile"
                className="flex flex-1 flex-col justify-center py-10"
              >
                <div className="space-y-1">
                  {navigation.map((item, index) => {
                    const active = pathname.startsWith(item.href);

                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, y: 38, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 210,
                          damping: 21,
                          delay: 0.07 + index * 0.055
                        }}
                      >
                        <Link
                          href={item.href}
                          onClick={closeMenu}
                          aria-current={active ? "page" : undefined}
                          className={[
                            "group flex items-center justify-between rounded-[22px] px-2 py-4",
                            "transition-colors duration-300",
                            active ? "bg-white/20" : "hover:bg-white/15"
                          ].join(" ")}
                        >
                          <span className="text-[clamp(3rem,13vw,5.2rem)] leading-[0.92] tracking-[-0.065em]">
                            {item.label}
                          </span>

                          <span
                            className={[
                              "text-[10px] font-semibold tracking-[0.18em]",
                              active ? "opacity-100" : "opacity-30"
                            ].join(" ")}
                          >
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.45 }}
                className="flex items-end justify-between gap-6 border-t border-black/[0.08] pt-5 text-[10px] uppercase tracking-[0.14em] text-black/55"
              >
                <span>VK / Vidéaste</span>
                <span className="text-right">Films & histoires humaines</span>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
