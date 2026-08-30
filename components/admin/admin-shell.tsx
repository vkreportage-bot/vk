"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, FolderKanban, LayoutDashboard, LogOut, Mail, Plus, Tags } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projets", icon: FolderKanban },
  { href: "/admin/categories", label: "Catégories", icon: Tags },
  { href: "/admin/messages", label: "Messages", icon: Mail },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function pageLabel(pathname: string) {
  if (pathname.startsWith("/admin/messages")) return "Messages";
  if (pathname.startsWith("/admin/categories")) return "Catégories";
  if (pathname.startsWith("/admin/projects/new")) return "Nouveau projet";
  if (pathname.startsWith("/admin/projects/")) return "Modifier le projet";
  if (pathname.startsWith("/admin/projects")) return "Projets";
  return "Dashboard";
}

export function AdminShell({ children, unreadCount = 0 }: { children: React.ReactNode; unreadCount?: number }) {
  const pathname = usePathname();
  if (pathname === "/admin/login") return <>{children}</>;
  const currentLabel = pageLabel(pathname);

  return (
    <div className="min-h-dvh bg-[#f3f2ee] text-[#111]">
      <div className="mx-auto grid min-h-dvh w-full max-w-[1600px] lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="hidden min-h-dvh border-r border-black/10 px-5 py-6 lg:flex lg:flex-col">
          <div className="mb-10">
            <Link href="/admin" className="inline-block text-[26px] font-black leading-none tracking-[-0.09em]">VK</Link>
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-black/35">Administration</p>
          </div>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(pathname, item.href);
              const showUnread = item.href === "/admin/messages" && unreadCount > 0;
              return (
                <Link key={item.href} href={item.href} className={cn("group flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm transition-colors", active ? "bg-black text-white" : "text-black/55 hover:bg-black/[0.045] hover:text-black")}>
                  <Icon size={17} strokeWidth={1.8} />
                  <span className="flex-1">{item.label}</span>
                  {showUnread ? <span className={cn("inline-flex min-w-6 items-center justify-center rounded-full px-1.5 py-0.5 text-[11px] font-semibold", active ? "bg-white text-black" : "bg-black text-white")}>{unreadCount > 99 ? "99+" : unreadCount}</span> : null}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 border-t border-black/10 pt-5">
            <Link href="/admin/projects/new" className="flex min-h-11 items-center gap-3 rounded-xl bg-white px-3 text-sm font-medium shadow-[0_1px_0_rgba(0,0,0,0.05)] ring-1 ring-black/10 transition hover:bg-black hover:text-white">
              <Plus size={17} /> Nouveau projet
            </Link>
          </div>

          <div className="mt-auto space-y-1 border-t border-black/10 pt-5">
            <Link href="/" target="_blank" className="flex min-h-10 items-center gap-3 rounded-xl px-3 text-sm text-black/45 transition hover:bg-black/[0.045] hover:text-black">
              <ExternalLink size={16} /> Voir le site
            </Link>
            <form action="/api/admin/logout" method="post">
              <button type="submit" className="flex min-h-10 w-full items-center gap-3 rounded-xl px-3 text-sm text-black/45 transition hover:bg-black/[0.045] hover:text-black">
                <LogOut size={16} /> Déconnexion
              </button>
            </form>
          </div>
        </aside>

        <div className="min-w-0 pb-24 lg:pb-0">
          <header className="flex h-16 items-center justify-between border-b border-black/10 px-5 md:px-8 lg:h-[76px] lg:px-10">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/35 lg:hidden">VK / Admin</p>
              <p className="text-sm font-medium lg:text-base">{currentLabel}</p>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 ? <Link href="/admin/messages?filter=unread" className="inline-flex min-h-9 items-center gap-2 rounded-full border border-black/10 bg-white px-3 text-xs font-medium"><span className="size-2 rounded-full bg-black" />{unreadCount} non lu{unreadCount > 1 ? "s" : ""}</Link> : null}
              <Link href="/" target="_blank" aria-label="Voir le site" className="hidden size-9 items-center justify-center rounded-full border border-black/10 bg-white text-black/60 sm:inline-flex lg:hidden"><ExternalLink size={15} /></Link>
              <form action="/api/admin/logout" method="post" className="lg:hidden"><button type="submit" aria-label="Se déconnecter" className="inline-flex size-9 items-center justify-center rounded-full border border-black/10 bg-white text-black/60"><LogOut size={15} /></button></form>
            </div>
          </header>

          <main className="px-5 py-8 md:px-8 md:py-10 lg:px-10 lg:py-12">{children}</main>
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-[#f7f6f2]/95 px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 backdrop-blur lg:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-4 gap-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.href);
            const showUnread = item.href === "/admin/messages" && unreadCount > 0;
            return (
              <Link key={item.href} href={item.href} className={cn("relative flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-medium transition", active ? "bg-black text-white" : "text-black/45")}>
                <span className="relative"><Icon size={18} />{showUnread ? <span className={cn("absolute -right-3 -top-2 inline-flex min-w-5 items-center justify-center rounded-full px-1 py-0.5 text-[9px] font-bold", active ? "bg-white text-black" : "bg-black text-white")}>{unreadCount > 9 ? "9+" : unreadCount}</span> : null}</span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
