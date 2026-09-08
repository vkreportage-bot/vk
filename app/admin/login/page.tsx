import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { LoginForm } from "./login-form";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: Props) {
  if (await isAdmin()) redirect("/admin");

  const { error } = await searchParams;

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#efeee9] text-[#111]">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-24 -top-32 h-[28rem] w-[28rem] rounded-full bg-white/65 blur-3xl" />
        <div className="absolute -bottom-56 right-[-8rem] h-[34rem] w-[34rem] rounded-full bg-[#d8d1c5]/55 blur-3xl" />
        <div className="absolute left-[44%] top-[18%] h-56 w-56 rounded-full bg-white/40 blur-3xl" />
      </div>

      <div className="relative mx-auto grid min-h-dvh w-full max-w-[1600px] lg:grid-cols-[minmax(0,1fr)_minmax(520px,0.82fr)]">
        <section className="flex min-h-[34vh] flex-col justify-between px-6 pb-8 pt-7 sm:px-10 sm:pt-9 lg:min-h-dvh lg:px-14 lg:pb-14 lg:pt-12 xl:px-20 xl:pb-20 xl:pt-16">
          <div>
            <p className="text-4xl font-black tracking-[-0.09em] sm:text-5xl">VK</p>
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-black/35">
              Administration
            </p>
          </div>

          <div className="hidden max-w-2xl lg:block">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-black/35">
              Espace propriétaire
            </p>
            <h2 className="mt-5 max-w-[720px] text-5xl font-semibold leading-[0.98] tracking-[-0.06em] xl:text-6xl">
              Le portfolio, simplement.
            </h2>
            <p className="mt-6 max-w-lg text-base leading-7 text-black/45">
              Gérez les projets, le journal, le hero et les messages depuis un espace dédié.
            </p>
          </div>
        </section>

        <section className="flex items-center justify-center px-6 pb-10 sm:px-10 lg:min-h-dvh lg:px-12 lg:py-12 xl:px-16">
          <LoginForm hasError={error === "credentials"} />
        </section>
      </div>
    </main>
  );
}
