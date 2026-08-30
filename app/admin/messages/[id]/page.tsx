import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { MarkMessageRead } from "@/components/mark-message-read";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminMessagePage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { id } = await params;
  const message = await prisma.contactMessage.findUnique({ where: { id } });
  if (!message) notFound();

  return (
    <div className="mx-auto max-w-4xl">
      <MarkMessageRead messageId={message.id} alreadyRead={Boolean(message.readAt)} />
      <Link href="/admin/messages" className="inline-flex items-center gap-2 text-sm text-black/40 transition hover:text-black"><ArrowLeft size={15} /> Messages</Link>

      <article className="mt-8">
        <header className="border-b border-black/10 pb-8">
          <div className="flex flex-wrap items-center justify-between gap-4"><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/35">{message.subject || "Nouveau message"}</p><time className="text-xs text-black/30">{new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeStyle: "short", timeZone: "Europe/Paris" }).format(message.createdAt)}</time></div>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">{message.name}</h1>
        </header>

        <section className="grid gap-6 border-b border-black/10 py-7 sm:grid-cols-2">
          <div><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-black/30">E-mail</p><a href={`mailto:${message.email}`} className="mt-2 inline-flex items-center gap-2 text-sm font-medium underline decoration-black/20 underline-offset-4"><Mail size={14} /> {message.email}</a></div>
          {message.phone ? <div><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-black/30">Téléphone</p><a href={`tel:${message.phone}`} className="mt-2 inline-flex items-center gap-2 text-sm font-medium underline decoration-black/20 underline-offset-4"><Phone size={14} /> {message.phone}</a></div> : null}
        </section>

        <section className="py-10"><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-black/30">Message</p><div className="mt-6 max-w-3xl whitespace-pre-wrap text-lg leading-8 tracking-[-0.015em] text-black/80">{message.message}</div></section>

        <footer className="flex flex-wrap gap-3 border-t border-black/10 pt-7">
          <a href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject || "Votre demande VK"}`)}`} className="inline-flex min-h-11 items-center rounded-full bg-black px-5 text-sm font-medium text-white transition hover:bg-black/80">Répondre par e-mail</a>
        </footer>
      </article>
    </div>
  );
}
