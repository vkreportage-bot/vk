import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight, Mail, Plus } from "lucide-react";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCategories, getProjects } from "@/lib/repository";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");

  const [projects, categories] = await Promise.all([
    getProjects({ includeDrafts: true }),
    getCategories(),
  ]);

  let unreadCount = 0;
  let recentMessages: Array<{ id: string; name: string; subject: string | null; message: string; createdAt: Date; readAt: Date | null }> = [];

  if (process.env.DATABASE_URL) {
    try {
      [unreadCount, recentMessages] = await Promise.all([
        prisma.contactMessage.count({ where: { readAt: null } }),
        prisma.contactMessage.findMany({
          orderBy: { createdAt: "desc" },
          take: 5,
          select: { id: true, name: true, subject: true, message: true, createdAt: true, readAt: true },
        }),
      ]);
    } catch {}
  }

  const draftCount = projects.filter((project) => !project.published).length;
  const publishedCount = projects.length - draftCount;

  return (
    <div className="mx-auto max-w-6xl">
      <header className="flex flex-col gap-5 border-b border-black/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/35">Vue d’ensemble</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">Tableau de bord</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/45">Gérez les projets, les catégories et les demandes reçues depuis le portfolio VK.</p>
        </div>
        <Link href="/admin/projects/new" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-black px-5 text-sm font-medium text-white transition hover:bg-black/80">
          <Plus size={16} /> Nouveau projet
        </Link>
      </header>

      <section className="grid border-b border-black/10 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { value: projects.length, label: "Projets" },
          { value: publishedCount, label: "Publiés" },
          { value: draftCount, label: "Brouillons" },
          { value: unreadCount, label: "Messages non lus" },
        ].map((item, index) => (
          <div key={item.label} className={`py-8 sm:px-6 ${index > 0 ? "sm:border-l sm:border-black/10" : ""}`}>
            <p className="text-5xl font-semibold tracking-[-0.06em]">{item.value}</p>
            <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-black/35">{item.label}</p>
          </div>
        ))}
      </section>

      <div className="mt-12 grid gap-12 xl:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.6fr)]">
        <section>
          <div className="flex items-center justify-between border-b border-black/10 pb-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/35">Activité récente</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em]">Derniers messages</h2>
            </div>
            <Link href="/admin/messages" className="inline-flex items-center gap-1 text-xs font-medium text-black/45 transition hover:text-black">Tout voir <ArrowUpRight size={14} /></Link>
          </div>

          {recentMessages.length === 0 ? <div className="py-10 text-sm text-black/40">Aucun message récent.</div> : (
            <div>
              {recentMessages.map((message) => (
                <Link key={message.id} href={`/admin/messages/${message.id}`} className="grid gap-3 border-b border-black/10 py-5 transition hover:pl-2 sm:grid-cols-[150px_minmax(0,1fr)_130px]">
                  <div className="flex items-center gap-3"><span className={`size-2 rounded-full ${message.readAt ? "bg-black/15" : "bg-black"}`} /><span className="truncate text-sm font-medium">{message.name}</span></div>
                  <div className="min-w-0"><p className="truncate text-sm">{message.subject || "Nouveau message"}</p><p className="mt-1 truncate text-xs text-black/40">{message.message}</p></div>
                  <time className="text-xs text-black/35 sm:text-right">{new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeZone: "Europe/Paris" }).format(message.createdAt)}</time>
                </Link>
              ))}
            </div>
          )}
        </section>

        <aside>
          <div className="border-b border-black/10 pb-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/35">Accès rapide</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em]">Gestion</h2>
          </div>
          <div className="divide-y divide-black/10">
            <Link href="/admin/projects" className="flex items-center justify-between py-5 text-sm transition hover:pl-2"><span>Gérer les projets</span><ArrowUpRight size={15} className="text-black/35" /></Link>
            <Link href="/admin/categories" className="flex items-center justify-between py-5 text-sm transition hover:pl-2"><span>{categories.length} catégories</span><ArrowUpRight size={15} className="text-black/35" /></Link>
            <Link href="/admin/messages" className="flex items-center justify-between py-5 text-sm transition hover:pl-2">
              <span className="flex items-center gap-2"><Mail size={15} /> Messages</span>
              {unreadCount > 0 ? <span className="rounded-full bg-black px-2 py-0.5 text-[11px] font-semibold text-white">{unreadCount}</span> : <ArrowUpRight size={15} className="text-black/35" />}
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
