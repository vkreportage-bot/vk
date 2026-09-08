"use client";

import { useState } from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { motion } from "framer-motion";

type LoginFormProps = {
  hasError?: boolean;
};

export function LoginForm({ hasError = false }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-md"
    >
      <div className="rounded-[2rem] border border-white/70 bg-white/50 p-6 shadow-[0_24px_80px_rgba(20,20,18,0.08)] backdrop-blur-2xl sm:p-8 md:p-10">
        <div className="mb-9">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black/35">
            Connexion
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.055em] text-black sm:text-[2.75rem]">
            Bon retour.
          </h1>
          <p className="mt-3 max-w-sm text-sm leading-6 text-black/45">
            Accédez à l’espace d’administration du portfolio VK.
          </p>
        </div>

        {hasError ? (
          <div
            role="alert"
            className="mb-6 rounded-2xl border border-red-950/10 bg-red-950/[0.04] px-4 py-3 text-sm text-red-950/70"
          >
            E-mail ou mot de passe incorrect.
          </div>
        ) : null}

        <form action="/api/admin/login" method="post" className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-xs font-medium text-black/55">
              E-mail
            </span>
            <input
              name="email"
              type="email"
              required
              autoComplete="username"
              inputMode="email"
              className="login-input h-13 w-full rounded-2xl border border-black/10 bg-white/55 px-4 text-[15px] text-black outline-none transition duration-200 placeholder:text-black/25 hover:border-black/15 focus:border-black/30 focus:bg-white/75 focus:ring-4 focus:ring-black/[0.035]"
              placeholder="votre@email.fr"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-medium text-black/55">
              Mot de passe
            </span>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                className="login-input h-13 w-full rounded-2xl border border-black/10 bg-white/55 px-4 pr-13 text-[15px] text-black outline-none transition duration-200 placeholder:text-black/25 hover:border-black/15 focus:border-black/30 focus:bg-white/75 focus:ring-4 focus:ring-black/[0.035]"
                placeholder="Votre mot de passe"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                aria-pressed={showPassword}
                title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                className="absolute inset-y-0 right-0 flex w-13 items-center justify-center rounded-r-2xl text-black/35 transition hover:text-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-black/20"
              >
                {showPassword ? (
                  <EyeOff className="h-[18px] w-[18px]" strokeWidth={1.7} />
                ) : (
                  <Eye className="h-[18px] w-[18px]" strokeWidth={1.7} />
                )}
              </button>
            </div>
          </label>

          <button
            type="submit"
            className="group mt-2 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[#111] px-5 text-sm font-medium text-white transition duration-200 hover:-translate-y-0.5 hover:bg-black hover:shadow-lg active:translate-y-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/15"
          >
            <LockKeyhole
              className="h-4 w-4 transition-transform duration-200 group-hover:scale-105"
              strokeWidth={1.8}
            />
            Se connecter
          </button>
        </form>
      </div>

      <p className="mt-5 text-center text-[11px] text-black/30">
        Accès réservé à l’administration VK
      </p>
    </motion.div>
  );
}
