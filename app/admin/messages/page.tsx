import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// IMPORTANT : cette page doit être protégée par ton layout/middleware admin.
export default async function AdminMessagesPage() {
  const [messages, unreadCount] = await Promise.all([
    prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    prisma.contactMessage.count({
      where: { readAt: null },
    }),
  ]);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-black/10 pb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-black/40">
            Contact
          </p>
          <h1 className="mt-2 text-3xl font-medium tracking-tight">
            Messages
          </h1>
        </div>

        <p className="text-sm text-black/50">
          {unreadCount} non lu{unreadCount > 1 ? "s" : ""}
        </p>
      </header>

      {messages.length === 0 ? (
        <div className="border border-dashed border-black/15 p-8 text-sm text-black/50">
          Aucun message pour le moment.
        </div>
      ) : (
        <div className="divide-y divide-black/10 border-y border-black/10">
          {messages.map((message) => (
            <Link
              key={message.id}
              href={`/admin/messages/${message.id}`}
              className="grid gap-3 py-5 transition hover:bg-black/[0.025] md:grid-cols-[220px_minmax(0,1fr)_150px] md:px-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  aria-hidden="true"
                  className={`size-2 shrink-0 rounded-full ${
                    message.readAt ? "bg-black/15" : "bg-black"
                  }`}
                />
                <span
                  className={`truncate text-sm ${
                    message.readAt ? "text-black/55" : "font-medium"
                  }`}
                >
                  {message.name}
                </span>
              </div>

              <div className="min-w-0">
                <p
                  className={`truncate text-sm ${
                    message.readAt ? "text-black/55" : "font-medium"
                  }`}
                >
                  {message.subject || "Nouveau message"}
                </p>
                <p className="mt-1 truncate text-sm text-black/40">
                  {message.message}
                </p>
              </div>

              <time
                dateTime={message.createdAt.toISOString()}
                className="text-xs text-black/40 md:text-right"
              >
                {new Intl.DateTimeFormat("fr-FR", {
                  dateStyle: "medium",
                  timeStyle: "short",
                  timeZone: "Europe/Paris",
                }).format(message.createdAt)}
              </time>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
