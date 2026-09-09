"use client";

import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export function TopBrandBar() {
  const { scrollY } = useScroll();
  const shouldReduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest < 16);
  });

  return (
    <motion.header
      initial={false}
      animate={
        visible
          ? { y: 0, opacity: 1 }
          : { y: shouldReduceMotion ? 0 : -80, opacity: 0 }
      }
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 240, damping: 28, mass: 0.9 }
      }
      className="pointer-events-none fixed inset-x-0 top-0 z-[84] h-20 will-change-transform"
    >
      <div className="pointer-events-auto relative flex h-full items-center overflow-hidden border-b border-white/25 bg-white/[0.24] px-6 text-black backdrop-blur-[28px] backdrop-saturate-[1.55] shadow-[0_10px_34px_rgba(0,0,0,0.07),inset_0_1px_0_rgba(255,255,255,0.44)] md:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.30)_0%,rgba(255,255,255,0.08)_48%,rgba(255,255,255,0.18)_100%)]"
        />

        <Link
          href="/"
          aria-label="VK-ONE — Accueil"
          className="relative z-10 inline-flex items-center text-[1.05rem] font-bold uppercase tracking-[-0.045em] transition-opacity duration-300 hover:opacity-60 md:text-[1.1rem]"
        >
          VK-ONE
        </Link>
      </div>
    </motion.header>
  );
}
