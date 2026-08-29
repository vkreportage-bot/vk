import webpush from "web-push";
import { prisma } from "@/lib/prisma";

let configured = false;

function configureWebPush() {
  if (configured) return;

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT;

  if (!publicKey || !privateKey || !subject) {
    throw new Error(
      "VAPID configuration missing. Check NEXT_PUBLIC_VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY and VAPID_SUBJECT."
    );
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);
  configured = true;
}

export async function sendNewContactMessagePush(input: {
  messageId: string;
  senderName: string;
  subject?: string | null;
  unreadCount: number;
}) {
  configureWebPush();

  const subscriptions = await prisma.pushSubscription.findMany();

  if (subscriptions.length === 0) {
    return;
  }

  const payload = JSON.stringify({
    title: "Nouveau message",
    body: input.subject
      ? `${input.senderName} — ${input.subject}`
      : `${input.senderName} vous a envoyé un message.`,
    url: `/admin/messages/${input.messageId}`,
    unreadCount: input.unreadCount,
  });

  await Promise.allSettled(
    subscriptions.map(async (subscription) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dh,
              auth: subscription.auth,
            },
          },
          payload
        );
      } catch (error: unknown) {
        const statusCode =
          typeof error === "object" &&
          error !== null &&
          "statusCode" in error &&
          typeof (error as { statusCode?: unknown }).statusCode === "number"
            ? (error as { statusCode: number }).statusCode
            : null;

        // L'abonnement n'existe plus côté navigateur.
        if (statusCode === 404 || statusCode === 410) {
          await prisma.pushSubscription.deleteMany({
            where: { endpoint: subscription.endpoint },
          });
          return;
        }

        console.error("Unable to send push notification:", error);
      }
    })
  );
}
