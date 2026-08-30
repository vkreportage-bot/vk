import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");

  return (
    <div className="grid min-h-dvh bg-[#f3f2ee] lg:grid-cols-2">
      <div className="hidden bg-[#111] p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <p className="text-4xl font-black tracking-[-0.09em]">VK</p>
          <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">Administration</p>
        </div>
        <div className="max-w-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35">Espace propriétaire</p>
          <h1 className="mt-5 text-5xl font-semibold leading-[0.98] tracking-[-0.06em]">Pilotez le portfolio depuis un espace simple et direct.</h1>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-12 sm:px-10">
        <form action="/api/admin/login" method="post" className="w-full max-w-md">
          <div className="lg:hidden">
            <p className="text-3xl font-black tracking-[-0.09em]">VK</p>
            <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-black/35">Administration</p>
          </div>
          <p className="mt-12 text-[11px] font-semibold uppercase tracking-[0.2em] text-black/35 lg:mt-0">Connexion</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-[-0.055em]">Bon retour.</h2>

          <div className="mt-10 space-y-6">
            <label className="block">
              <span className="text-xs font-medium text-black/55">E-mail</span>
              <input name="email" type="email" required autoComplete="username" className="mt-2 w-full border-0 border-b border-black/20 bg-transparent px-0 py-3 text-base outline-none transition focus:border-black" />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-black/55">Mot de passe</span>
              <input name="password" type="password" required autoComplete="current-password" className="mt-2 w-full border-0 border-b border-black/20 bg-transparent px-0 py-3 text-base outline-none transition focus:border-black" />
            </label>
          </div>

          <button className="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-black px-5 text-sm font-medium text-white transition hover:bg-black/80">Se connecter</button>
        </form>
      </div>
    </div>
  );
}
