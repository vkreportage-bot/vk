import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { filter } = await searchParams;
  const onlyUnread = filter === "unread";

  const [messages, unreadCount] = await Promise.all([
    prisma.contactMessage.findMany({ where: onlyUnread ? { readAt: null } : undefined, orderBy: { createdAt: "desc" }, take: 100 }),
    prisma.contactMessage.count({ where: { readAt: null } }),
  ]);

  return (
    <div className="mx-auto max-w-6xl">
      <header className="border-b border-black/10 pb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/35">Contact</p><h1 className="mt-3 text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">Messages</h1></div>
          <p className="text-sm text-black/40">{unreadCount} non lu{unreadCount > 1 ? "s" : ""}</p>
        </div>
        <nav className="mt-8 flex gap-6 text-xs font-semibold uppercase tracking-[0.14em]">
          <Link href="/admin/messages" className={!onlyUnread ? "border-b border-black pb-2 text-black" : "pb-2 text-black/35"}>Tous</Link>
          <Link href="/admin/messages?filter=unread" className={onlyUnread ? "border-b border-black pb-2 text-black" : "pb-2 text-black/35"}>Non lus {unreadCount > 0 ? `(${unreadCount})` : ""}</Link>
        </nav>
      </header>

      {messages.length === 0 ? <div className="py-16 text-sm text-black/40">{onlyUnread ? "Aucun message non lu." : "Aucun message pour le moment."}</div> : (
        <div>
          {messages.map((message) => (
            <Link key={message.id} href={`/admin/messages/${message.id}`} className="group grid gap-3 border-b border-black/10 py-6 transition hover:pl-2 md:grid-cols-[190px_minmax(0,1fr)_160px] md:items-center">
              <div className="flex min-w-0 items-center gap-3"><span className={`size-2 shrink-0 rounded-full ${message.readAt ? "bg-black/15" : "bg-black"}`} /><span className={`truncate text-sm ${message.readAt ? "text-black/45" : "font-medium text-black"}`}>{message.name}</span></div>
              <div className="min-w-0"><p className={`truncate text-sm ${message.readAt ? "text-black/45" : "font-medium text-black"}`}>{message.subject || "Nouveau message"}</p><p className="mt-1 truncate text-sm text-black/35">{message.message}</p></div>
              <time dateTime={message.createdAt.toISOString()} className="text-xs text-black/30 md:text-right">{new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Paris" }).format(message.createdAt)}</time>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
