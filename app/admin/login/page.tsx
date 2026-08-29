import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#111] px-5 pt-24">
      <form
        action="/api/admin/login"
        method="post"
        className="w-full max-w-md rounded-2xl bg-white p-7"
      >
        <p className="text-2xl font-black tracking-[-0.08em]">VK / ADMIN</p>
        <p className="mt-2 text-sm text-black/50">Connexion propriétaire</p>

        <label className="mt-8 block text-sm font-medium">
          E-mail
          <input
            name="email"
            type="email"
            required
            autoComplete="username"
            className="mt-2 w-full rounded-lg border border-black/15 px-3 py-3 outline-none focus:border-black"
          />
        </label>

        <label className="mt-4 block text-sm font-medium">
          Mot de passe
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="mt-2 w-full rounded-lg border border-black/15 px-3 py-3 outline-none focus:border-black"
          />
        </label>

        <button className="mt-6 w-full rounded-lg bg-black px-4 py-3 text-sm font-semibold text-white">
          Se connecter
        </button>
      </form>
    </div>
  );
}
