import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MarkMessageRead } from "@/components/mark-message-read";

export const dynamic = "force-dynamic";

// IMPORTANT : cette page doit être protégée par ton layout/middleware admin.
export default async function AdminMessagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const message = await prisma.contactMessage.findUnique({
    where: { id },
  });

  if (!message) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <MarkMessageRead
        messageId={message.id}
        alreadyRead={Boolean(message.readAt)}
      />

      <header className="border-b border-black/10 pb-6">
        <Link
          href="/admin/messages"
          className="text-sm text-black/45 transition hover:text-black"
        >
          ← Messages
        </Link>

        <h1 className="mt-5 text-3xl font-medium tracking-tight">
          {message.subject || "Nouveau message"}
        </h1>

        <p className="mt-3 text-sm text-black/45">
          Reçu le{" "}
          {new Intl.DateTimeFormat("fr-FR", {
            dateStyle: "long",
            timeStyle: "short",
            timeZone: "Europe/Paris",
          }).format(message.createdAt)}
        </p>
      </header>

      <section className="grid gap-6 border-b border-black/10 pb-8 sm:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-black/35">
            Contact
          </p>
          <p className="mt-2 text-sm font-medium">{message.name}</p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-black/35">
            E-mail
          </p>
          <a
            href={`mailto:${message.email}`}
            className="mt-2 block text-sm underline underline-offset-4"
          >
            {message.email}
          </a>
        </div>

        {message.phone ? (
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-black/35">
              Téléphone
            </p>
            <a
              href={`tel:${message.phone}`}
              className="mt-2 block text-sm underline underline-offset-4"
            >
              {message.phone}
            </a>
          </div>
        ) : null}
      </section>

      <section>
        <p className="text-xs uppercase tracking-[0.16em] text-black/35">
          Message
        </p>
        <div className="mt-5 whitespace-pre-wrap text-base leading-8">
          {message.message}
        </div>
      </section>

      <div className="flex flex-wrap gap-3 border-t border-black/10 pt-8">
        <a
          href={`mailto:${message.email}?subject=${encodeURIComponent(
            `Re: ${message.subject || "Votre demande VK"}`
          )}`}
          className="inline-flex min-h-11 items-center bg-black px-5 text-sm text-white"
        >
          Répondre par e-mail
        </a>
      </div>
    </div>
  );
}
