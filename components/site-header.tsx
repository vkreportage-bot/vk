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
  stiffness: 185,
  damping: 20,
  mass: 0.95
};

const itemSpring = {
  type: "spring" as const,
  stiffness: 165,
  damping: 15,
  mass: 0.88
};

const desktopListVariants = {
  closed: {
    transition: {
      staggerChildren: 0.025,
      staggerDirection: -1
    }
  },
  open: {
    transition: {
      delayChildren: 0.055,
      staggerChildren: 0.075
    }
  }
};

const desktopItemVariants = {
  closed: {
    x: 52,
    scale: 0.94,
    opacity: 0
  },
  open: {
    x: 0,
    scale: 1,
    opacity: 1
  }
};

const mobileListVariants = {
  closed: {
    transition: {
      staggerChildren: 0.02,
      staggerDirection: -1
    }
  },
  open: {
    transition: {
      delayChildren: 0.08,
      staggerChildren: 0.07
    }
  }
};

const mobileItemVariants = {
  closed: {
    y: 46,
    scale: 0.93,
    opacity: 0
  },
  open: {
    y: 0,
    scale: 1,
    opacity: 1
  }
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
      {/* Desktop */}
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
              transition={{ duration: shouldReduceMotion ? 0 : 0.24 }}
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
            "shadow-[-24px_0_70px_rgba(0,0,0,0.10),inset_1px_0_0_rgba(255,255,255,0.46)]",
            "will-change-transform"
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

          <button
            type="button"
            aria-label={drawerOpen ? "Réduire le menu" : "Ouvrir le menu"}
            aria-expanded={drawerOpen}
            onClick={() => {
              setDrawerPeek(true);
              setDrawerOpen((open) => !open);
            }}
            className="absolute inset-y-0 left-0 z-20 flex w-[72px] items-center justify-center"
          >
            <motion.div
              animate={{ opacity: drawerOpen ? 0 : 1 }}
              transition={{ duration: 0.18 }}
              className="flex flex-col items-center gap-5"
            >
              <span className="block h-px w-8 bg-black/70" />
              <span className="[writing-mode:vertical-rl] rotate-180 text-[9px] font-semibold uppercase tracking-[0.28em] text-black/45">
                Menu
              </span>
              <span className="block h-10 w-px bg-black/20" />
            </motion.div>
          </button>

          <div className="relative z-10 flex h-full flex-col py-9 pl-[86px] pr-8">
            <motion.div
              initial={false}
              animate={drawerOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={shouldReduceMotion ? { duration: 0 } : itemSpring}
            >
              <Link
                href="/"
                aria-label="VK — Accueil"
                onClick={closeDesktopDrawer}
                className="inline-block text-[1.9rem] font-bold tracking-[-0.07em]"
              >
                VK
              </Link>
            </motion.div>

            <nav className="flex flex-1 flex-col justify-center" aria-label="Menu desktop">
              <motion.div
                variants={desktopListVariants}
                initial={false}
                animate={drawerOpen ? "open" : "closed"}
              >
                {navigation.map((item, index) => {
                  const active = pathname.startsWith(item.href);

                  return (
                    <motion.div
                      key={item.href}
                      variants={desktopItemVariants}
                      transition={shouldReduceMotion ? { duration: 0 } : itemSpring}
                      className="border-b border-black/[0.075] first:border-t will-change-transform"
                    >
                      <motion.div
                        whileHover={shouldReduceMotion ? undefined : { x: 10, scale: 1.015 }}
                        whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
                        transition={itemSpring}
                      >
                        <Link
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                          onClick={closeDesktopDrawer}
                          className="grid grid-cols-[1fr_auto] items-center gap-5 py-5"
                        >
                          <span
                            className={[
                              "text-[clamp(2rem,3vw,3.15rem)] leading-[0.95] tracking-[-0.06em]",
                              active ? "opacity-100" : "opacity-72"
                            ].join(" ")}
                          >
                            {item.label}
                          </span>

                          <motion.span
                            animate={active ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0.28 }}
                            transition={itemSpring}
                            className="text-[9px] font-semibold tracking-[0.18em]"
                          >
                            {String(index + 1).padStart(2, "0")}
                          </motion.span>
                        </Link>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </nav>
          </div>
        </motion.aside>
      </div>

      {/* Mobile : drawer bas -> haut, plein écran en largeur et hauteur */}
      <div className="md:hidden">
        <AnimatePresence>
          {menuOpen ? (
            <motion.button
              type="button"
              aria-label="Fermer le menu"
              onClick={closeMobileMenu}
              className="fixed inset-0 z-[118] bg-black/[0.035] backdrop-blur-[3px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.22 }}
            />
          ) : null}
        </AnimatePresence>

        <motion.aside
          id="mobile-navigation"
          aria-label="Navigation mobile"
          animate={{ y: menuOpen ? "0%" : "calc(100% - 44px)" }}
          transition={shouldReduceMotion ? { duration: 0 } : drawerSpring}
          className={[
            "fixed inset-x-0 bottom-0 z-[130] h-[100svh] overflow-hidden",
            "bg-white/[0.20] text-black backdrop-blur-[34px] backdrop-saturate-[1.55]",
            "shadow-[0_-18px_60px_rgba(0,0,0,0.10)]",
            "will-change-transform"
          ].join(" ")}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.25)_0%,rgba(255,255,255,0.07)_48%,rgba(255,255,255,0.11)_100%)]"
          />

          <button
            type="button"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="relative z-20 flex h-14 w-full items-center justify-center"
          >
            <AnimatePresence mode="wait" initial={false}>
              {menuOpen ? (
                <motion.span
                  key="close"
                  initial={{ opacity: 0, scale: 0.72, rotate: -18 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.72, rotate: 18 }}
                  transition={shouldReduceMotion ? { duration: 0 } : itemSpring}
                  className="absolute right-6 top-1/2 block h-7 w-7 -translate-y-1/2"
                >
                  <span className="absolute left-1/2 top-1/2 block h-[2px] w-7 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-black" />
                  <span className="absolute left-1/2 top-1/2 block h-[2px] w-7 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-black" />
                </motion.span>
              ) : (
                <motion.span
                  key="handle"
                  initial={{ opacity: 0, scaleX: 0.72 }}
                  animate={{ opacity: 0.78, scaleX: 1 }}
                  exit={{ opacity: 0, scaleX: 0.72 }}
                  transition={shouldReduceMotion ? { duration: 0 } : itemSpring}
                  className="block h-[2px] w-[38px] bg-black"
                />
              )}
            </AnimatePresence>
          </button>

          <div className="relative z-10 flex h-[calc(100%-56px)] flex-col px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3">
            <motion.div
              initial={false}
              animate={menuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              transition={shouldReduceMotion ? { duration: 0 } : itemSpring}
            >
              <Link
                href="/"
                aria-label="VK — Accueil"
                onClick={closeMobileMenu}
                className="inline-block text-[1.9rem] font-bold tracking-[-0.07em]"
              >
                VK
              </Link>
            </motion.div>

            <nav className="flex flex-1 flex-col justify-center py-6">
              <motion.div
                className="space-y-1"
                variants={mobileListVariants}
                initial={false}
                animate={menuOpen ? "open" : "closed"}
              >
                {navigation.map((item, index) => {
                  const active = pathname.startsWith(item.href);

                  return (
                    <motion.div
                      key={item.href}
                      variants={mobileItemVariants}
                      transition={shouldReduceMotion ? { duration: 0 } : itemSpring}
                      className="border-b border-black/[0.075] first:border-t will-change-transform"
                    >
                      <motion.div
                        whileTap={shouldReduceMotion ? undefined : { scale: 0.975 }}
                        transition={itemSpring}
                      >
                        <Link
                          href={item.href}
                          onClick={closeMobileMenu}
                          aria-current={active ? "page" : undefined}
                          className="grid grid-cols-[1fr_auto] items-center gap-5 py-5"
                        >
                          <span
                            className={[
                              "text-[clamp(2.8rem,12vw,4.8rem)] leading-[0.94] tracking-[-0.065em]",
                              active ? "opacity-100" : "opacity-72"
                            ].join(" ")}
                          >
                            {item.label}
                          </span>

                          <motion.span
                            animate={active ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0.3 }}
                            transition={itemSpring}
                            className="text-[11px] font-semibold tracking-[0.18em]"
                          >
                            {String(index + 1).padStart(2, "0")}
                          </motion.span>
                        </Link>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </nav>
          </div>
        </motion.aside>
      </div>
    </>
  );
}
