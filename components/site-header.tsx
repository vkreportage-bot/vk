"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navigation = [
  { label: "Projets", href: "/projects" },
  { label: "À propos", href: "/about" },
  { label: "Journal", href: "/blog" },
  { label: "Contact", href: "/contact" }
];

const drawerSpring = {
  type: "spring" as const,
  stiffness: 260,
  damping: 28,
  mass: 0.92
};

export function SiteHeader() {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerPeek, setDrawerPeek] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const drawerHoveredRef = useRef(false);
  const lastPointerXRef = useRef(0);

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
      if (event.key === "Escape") {
        setMenuOpen(false);
        setDrawerOpen(false);
        setDrawerPeek(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");

    function handlePointerMove(event: PointerEvent) {
      lastPointerXRef.current = event.clientX;

      if (!finePointer.matches || window.innerWidth < 768) return;

      const distanceFromRight = window.innerWidth - event.clientX;

      if (distanceFromRight <= 42) {
        setDrawerPeek(true);
        setDrawerOpen(true);
        return;
      }

      if (distanceFromRight <= 150) {
        setDrawerPeek(true);
        return;
      }

      if (!drawerHoveredRef.current) {
        setDrawerOpen(false);
        setDrawerPeek(false);
      }
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  function closeMobileMenu() {
    setMenuOpen(false);
  }

  function closeDesktopDrawer() {
    drawerHoveredRef.current = false;
    setDrawerOpen(false);
    setDrawerPeek(false);
  }

  function handleDrawerEnter() {
    drawerHoveredRef.current = true;
    setDrawerPeek(true);
    setDrawerOpen(true);
  }

  function handleDrawerLeave() {
    drawerHoveredRef.current = false;

    const distanceFromRight = window.innerWidth - lastPointerXRef.current;

    if (distanceFromRight > 150) {
      setDrawerOpen(false);
      setDrawerPeek(false);
      return;
    }

    if (distanceFromRight > 42) {
      setDrawerOpen(false);
      setDrawerPeek(true);
    }
  }

  const drawerX = drawerOpen ? "0%" : drawerPeek ? "82%" : "97%";

  return (
    <>
      {/* Desktop : drawer latéral sensible à la proximité de la souris */}
      <div className="hidden md:block">
        <AnimatePresence>
          {drawerOpen ? (
            <motion.button
              type="button"
              aria-label="Fermer la navigation"
              onClick={closeDesktopDrawer}
              className="fixed inset-0 z-[88] cursor-default bg-black/[0.025] backdrop-blur-[1.5px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.28 }}
            />
          ) : null}
        </AnimatePresence>

        <motion.aside
          aria-label="Navigation principale"
          onMouseEnter={handleDrawerEnter}
          onMouseLeave={handleDrawerLeave}
          animate={{ x: drawerX }}
          transition={shouldReduceMotion ? { duration: 0 } : drawerSpring}
          className={[
            "fixed bottom-4 right-0 top-4 z-[100] w-[360px] xl:w-[400px]",
            "overflow-hidden rounded-l-[32px] border-y border-l border-white/30",
            "bg-white/[0.30] text-black backdrop-blur-[34px] backdrop-saturate-[1.55]",
            "shadow-[-24px_0_70px_rgba(0,0,0,0.10),inset_1px_0_0_rgba(255,255,255,0.46)]"
          ].join(" ")}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.34)_0%,rgba(255,255,255,0.10)_46%,rgba(255,255,255,0.17)_100%)]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-28 top-[8%] h-72 w-72 rounded-full bg-white/45 blur-[100px]"
          />

          {/* Rail visible quand le drawer est fermé / en approche */}
          <button
            type="button"
            aria-label={drawerOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={drawerOpen}
            onClick={() => {
              setDrawerPeek(true);
              setDrawerOpen((open) => !open);
            }}
            className="absolute inset-y-0 left-0 z-20 flex w-[72px] items-center justify-center"
          >
            <motion.div
              animate={{ opacity: drawerOpen ? 0 : 1 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center gap-5"
            >
              <span className="block h-px w-8 bg-black/70" />
              <span className="[writing-mode:vertical-rl] rotate-180 text-[9px] font-semibold uppercase tracking-[0.28em] text-black/45">
                Menu
              </span>
              <span className="block h-10 w-px bg-black/20" />
            </motion.div>
          </button>

          <div className="relative z-10 flex h-full flex-col pl-[86px] pr-8 py-9">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black/35">
                  Navigation
                </p>
                <p className="mt-2 text-sm tracking-[-0.02em] text-black/55">
                  VK / Vidéaste
                </p>
              </div>

              <motion.button
                type="button"
                aria-label="Fermer le menu"
                onClick={closeDesktopDrawer}
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={drawerSpring}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-black/[0.08] bg-white/[0.18]"
              >
                <span className="relative block h-4 w-4">
                  <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 rotate-45 bg-black" />
                  <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 -rotate-45 bg-black" />
                </span>
              </motion.button>
            </div>

            <nav className="flex flex-1 flex-col justify-center" aria-label="Menu desktop">
              <div>
                {navigation.map((item, index) => {
                  const active = pathname.startsWith(item.href);

                  return (
                    <motion.div
                      key={item.href}
                      initial={false}
                      animate={
                        drawerOpen
                          ? { opacity: 1, x: 0 }
                          : { opacity: 0.58, x: 16 }
                      }
                      transition={{
                        ...drawerSpring,
                        delay: drawerOpen && !shouldReduceMotion ? index * 0.035 : 0
                      }}
                      className="border-b border-black/[0.075] first:border-t"
                    >
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        onClick={closeDesktopDrawer}
                        className="group grid grid-cols-[1fr_auto] items-center gap-5 py-5"
                      >
                        <span
                          className={[
                            "text-[clamp(2rem,3vw,3.15rem)] leading-[0.95] tracking-[-0.06em] transition-[transform,opacity] duration-300",
                            "group-hover:translate-x-2",
                            active ? "opacity-100" : "opacity-72 group-hover:opacity-100"
                          ].join(" ")}
                        >
                          {item.label}
                        </span>

                        <span
                          className={[
                            "text-[9px] font-semibold tracking-[0.18em]",
                            active ? "text-black" : "text-black/28"
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

            <div className="flex items-end justify-between border-t border-black/[0.08] pt-5 text-[9px] uppercase tracking-[0.16em] text-black/38">
              <span>Films</span>
              <span>Histoires humaines</span>
            </div>
          </div>
        </motion.aside>
      </div>

      {/* Mobile : bouton flottant transparent */}
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
            ? "border border-transparent bg-transparent shadow-none"
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
            transition={{ duration: shouldReduceMotion ? 0 : 0.26, ease: "easeOut" }}
          >
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

            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.985, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, scale: 0.985, filter: "blur(8px)" }}
              transition={shouldReduceMotion ? { duration: 0 } : drawerSpring}
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

              <div className="relative z-10 flex min-h-[calc(100svh-2rem)] flex-col px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: shouldReduceMotion ? 0 : 0.06, duration: 0.35 }}
                  className="flex h-14 items-center"
                >
                  <Link
                    href="/"
                    aria-label="VK — Accueil"
                    onClick={closeMobileMenu}
                    className="text-[1.9rem] font-bold tracking-[-0.06em]"
                  >
                    VK
                  </Link>
                </motion.div>

                <nav aria-label="Navigation mobile" className="flex flex-1 flex-col justify-center py-8">
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
                            ...drawerSpring,
                            delay: shouldReduceMotion ? 0 : 0.06 + index * 0.05
                          }}
                        >
                          <Link
                            href={item.href}
                            onClick={closeMobileMenu}
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
                  transition={{ delay: shouldReduceMotion ? 0 : 0.22, duration: 0.35 }}
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
